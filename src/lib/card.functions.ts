import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database, Json } from "@/integrations/supabase/types";
import { cardDataSchema, toPublic, type CardData } from "@/lib/card-schema";
import { defaultCard } from "@/config/card.config";

export type PublishedCard = { card: CardData; source: "published" | "built-in" };

/** Public read of the published card. Falls back to built-in content if none is valid. */
export const getPublishedCard = createServerFn({ method: "GET" }).handler(() => loadPublishedCard());

/** Server-only loader shared by the card page and the contact file download. */
export async function loadPublishedCard(): Promise<PublishedCard> {
  const fallback: PublishedCard = { card: toPublic(defaultCard), source: "built-in" };
  try {
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) return fallback;
    const sb = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data, error } = await sb.from("card_versions").select("data").eq("kind", "published").maybeSingle();
    if (error || !data) return fallback;
    const parsed = cardDataSchema.safeParse(data.data);
    if (!parsed.success) {
      console.error("Published card failed validation; using built-in content");
      return fallback;
    }
    return { card: toPublic(parsed.data), source: "published" };
  } catch (e) {
    console.error("Could not load published card", e);
    return fallback;
  }
}

export type AdminState =
  | { isOwner: false }
  | { isOwner: true; draft: CardData; draftSavedAt: string | null; publishedAt: string | null };

export const getAdminState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminState> => {
    const { data: isOwner, error } = await context.supabase.rpc("is_card_owner");
    if (error) throw new Error("Could not check access");
    if (!isOwner) return { isOwner: false };
    const { data: rows, error: e2 } = await context.supabase.from("card_versions").select("kind, data, updated_at, published_at");
    if (e2) throw new Error("Could not load the card");
    const draftRow = rows?.find((r) => r.kind === "draft");
    const pubRow = rows?.find((r) => r.kind === "published");
    const draftParsed = draftRow ? cardDataSchema.safeParse(draftRow.data) : null;
    const pubParsed = pubRow ? cardDataSchema.safeParse(pubRow.data) : null;
    // Seed from the draft, else the published card, else built-in content.
    const draft = draftParsed?.success ? draftParsed.data : pubParsed?.success ? pubParsed.data : defaultCard;
    return {
      isOwner: true,
      draft,
      draftSavedAt: draftRow?.updated_at ?? null,
      publishedAt: pubRow?.published_at ?? null,
    };
  });

const inputSchema = z.object({ card: z.unknown() });

function validate(raw: unknown): CardData {
  const r = cardDataSchema.safeParse(raw);
  if (!r.success) throw new Error("Some fields are not valid: " + r.error.issues.map((i) => i.path.join(".")).join(", "));
  return r.data;
}

export const saveDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const card = validate(data.card);
    const { data: t, error } = await context.supabase.rpc("save_card_draft", { _draft: card as unknown as Json });
    if (error) throw new Error(error.code === "42501" ? "Not allowed" : "Could not save the draft");
    return { savedAt: t as string };
  });

export const publishCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data, context }) => {
    const card = validate(data.card);
    const { data: t, error } = await context.supabase.rpc("publish_card", {
      _draft: card as unknown as Json,
      _public: toPublic(card) as unknown as Json,
    });
    if (error) throw new Error(error.code === "42501" ? "Not allowed" : "Publishing failed. The live card was not changed.");
    return { publishedAt: t as string };
  });
