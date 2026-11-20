import { createFileRoute, useBlocker, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminState, publishCard, saveDraft } from "@/lib/card.functions";
import { cardDataSchema, missingTranslations, type CardData, type Lang } from "@/lib/card-schema";
import { cardConfig, defaultCard, getCardUrl } from "@/config/card.config";
import { CardView } from "@/components/CardView";
import { BiField, TextField, PhotoField, CoverField } from "@/components/AdminFields";
import { findBrand } from "@/lib/brands";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({
    meta: [
      { title: "Card settings | Eric Lam" },
      { name: "description", content: "Private editor for Eric Lam's business card." },
      { property: "og:title", content: "Card settings | Eric Lam" },
      { property: "og:description", content: "Private editor for Eric Lam's business card." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SettingsPage,
});

const isAuthError = (e: unknown) => e instanceof Response ? e.status === 401 : /unauthori[sz]ed|401|jwt/i.test(String((e as Error)?.message ?? e));

type Path = (string | number)[];
function setIn<T>(obj: T, path: Path, value: unknown): T {
  const copy = structuredClone(obj) as Record<string | number, unknown>;
  let cur = copy;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]!] as Record<string | number, unknown>;
  cur[path[path.length - 1]!] = value;
  return copy as T;
}

function SettingsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchState = useServerFn(getAdminState);
  const save = useServerFn(saveDraft);
  const publish = useServerFn(publishCard);
  const q = useQuery({ queryKey: ["admin-state"], queryFn: () => fetchState(), retry: false });

  const [draft, setDraft] = useState<CardData | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [busy, setBusy] = useState<"" | "save" | "publish">("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (q.data?.isOwner) {
      setDraft(q.data.draft);
      setSaved(JSON.stringify(q.data.draft));
      setSavedAt(q.data.draftSavedAt);
      setPublishedAt(q.data.publishedAt);
    }
  }, [q.data]);

  const expire = () => navigate({ to: "/admin/login", search: { expired: "1" }, replace: true });
  useEffect(() => {
    if (q.error && isAuthError(q.error)) expire();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") expire();
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.error]);

  const dirty = draft !== null && JSON.stringify(draft) !== saved;
  useBlocker({ shouldBlockFn: () => dirty && !window.confirm("You have unsaved changes. Leave without saving?"), enableBeforeUnload: () => dirty });

  const validation = useMemo(() => (draft ? cardDataSchema.safeParse(draft) : null), [draft]);
  const errors = useMemo(() => {
    const m: Record<string, string> = {};
    if (validation && !validation.success) for (const i of validation.error.issues) m[i.path.join(".")] ??= i.message;
    return m;
  }, [validation]);
  const warnings = useMemo(() => (draft ? missingTranslations(draft) : []), [draft]);

  const signOut = async () => {
    if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) return;
    setSaved(JSON.stringify(draft));
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", search: { expired: undefined }, replace: true });
  };

  const run = async (kind: "save" | "publish") => {
    if (!draft) return;
    if (!validation?.success) {
      setMsg({ kind: "err", text: "Fix the highlighted fields first." });
      return;
    }
    setBusy(kind);
    setMsg(null);
    try {
      if (kind === "save") {
        const r = await save({ data: { card: draft } });
        setSavedAt(r.savedAt);
        setMsg({ kind: "ok", text: "Draft saved. The live card is unchanged." });
      } else {
        const r = await publish({ data: { card: draft } });
        setSavedAt(r.publishedAt);
        setPublishedAt(r.publishedAt);
        qc.removeQueries({ queryKey: ["published-card"] });
        setMsg({ kind: "ok", text: "Published. The live card and contact file now show these changes." });
      }
      setSaved(JSON.stringify(draft));
    } catch (e) {
      if (isAuthError(e)) return expire();
      setMsg({ kind: "err", text: (e as Error).message || "Something went wrong." });
    } finally {
      setBusy("");
    }
  };

  if (q.isLoading || (q.data?.isOwner && !draft)) return <Shell><p className="text-sm text-muted-foreground">Loading…</p></Shell>;
  if (q.error) return <Shell><p role="alert" className="text-sm text-destructive">Could not load the settings. Please refresh.</p></Shell>;
  if (!q.data?.isOwner || !draft)
    return (
      <Shell>
        <h1 className="text-lg font-semibold">No access</h1>
        <p className="mt-2 text-sm text-muted-foreground">This account can't edit the card.</p>
        <button onClick={signOut} className="mt-4 h-10 rounded-xl border border-border px-4 text-sm">Sign out</button>
      </Shell>
    );

  const set = (path: Path) => (value: unknown) => setDraft((d) => (d ? setIn(d, path, value) : d));
  const err = (path: Path) => errors[path.join(".")];
  const { url } = getCardUrl(typeof window !== "undefined" ? window.location.origin : "");
  const fmt = (t: string | null) => (t ? new Date(t).toLocaleString() : "Never");

  const Bi = ({ label, field, area }: { label: string; field: (l: Lang) => Path; area?: boolean }) => (
    <BiField label={label} area={area} values={(["en", "zh"] as const).map((l) => ({ l, value: get(draft, field(l)) as string, onChange: set(field(l)), error: err(field(l)) }))} />
  );

  return (
    <div className="min-h-dvh bg-background pb-32">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-semibold">Card settings</h1>
            <p className="truncate text-xs text-muted-foreground">
              {dirty ? <span className="text-primary">Unsaved changes</span> : "All changes saved"} · Last published: {fmt(publishedAt)}
            </p>
          </div>
          <button onClick={signOut} className="h-9 shrink-0 rounded-xl border border-border px-3 text-sm">Sign out</button>
        </div>
        <div className="mx-auto mt-3 flex max-w-2xl gap-2" role="tablist">
          {(["edit", "preview"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`h-9 rounded-full px-4 text-sm ${mode === m ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>
              {m === "edit" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>
      </header>

      {mode === "preview" ? (
        <CardView card={draft} banner={<p className="mb-2 rounded-xl border border-primary/60 bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">Draft preview — not live</p>} />
      ) : (
        <main className="mx-auto max-w-2xl space-y-4 px-4 py-5">
          {warnings.length > 0 && (
            <div className="rounded-2xl border border-primary/40 p-4 text-sm">
              <p className="font-medium text-primary">Missing translations</p>
              <ul className="mt-1 list-disc pl-5 text-muted-foreground">{warnings.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
          )}

          <Section title="Profile">
            <PhotoField value={draft.headshot} fallback={cardConfig.headshotUrl} onChange={set(["headshot"])} />
            <p className="pt-2 text-sm font-medium">Cover banner</p>
            <CoverField value={draft.cover} fallback={cardConfig.coverUrl} onChange={set(["cover"])} />
            <TextField label="Display name" value={draft.name.full} onChange={set(["name", "full"])} error={err(["name", "full"])} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="First name (contact file)" value={draft.name.first} onChange={set(["name", "first"])} error={err(["name", "first"])} />
              <TextField label="Last name (contact file)" value={draft.name.last} onChange={set(["name", "last"])} error={err(["name", "last"])} />
            </div>
            <TextField label="Company" value={draft.company} onChange={set(["company"])} error={err(["company"])} />
            <TextField label="Company (繁中)" value={draft.companyZh} onChange={set(["companyZh"])} />
            {Bi({ label: "Title", field: (l) => ["text", l, "title"] })}
            {Bi({ label: "Location", field: (l) => ["text", l, "location"] })}
            {Bi({ label: "Short introduction", field: (l) => ["text", l, "intro"], area: true })}
            {Bi({ label: "Tagline", field: (l) => ["text", l, "tagline"] })}
            {Bi({ label: "Full bio (leave a blank line between paragraphs)", field: (l) => ["text", l, "bio"], area: true })}
            <TextField label="Brands worked with (one company per line)" area value={draft.brands.names.join("\n")} onChange={(v) => set(["brands", "names"])(String(v).split("\n").slice(0, 12))} error={err(["brands", "names"])} />
            <p className="text-xs text-muted-foreground">
              {draft.brands.names.filter((n) => n.trim()).map((n) => `${n.trim()}: ${findBrand(n) ? "logo found" : "shown as text"}`).join(" · ") || "No brands listed."}
              {" "}Logos available: PUMA, Li & Fung, Pandora, Tiffany & Co., Nike.
            </p>
            <Toggle label="Show brand logos under About Eric" checked={draft.brands.visible} onChange={set(["brands", "visible"])} />
            <p className="text-xs text-muted-foreground">Headshot: photo uploads aren't available yet. The current photo stays, and the "{cardConfig.initials}" monogram shows if it's removed.</p>
          </Section>

          <Section title="Contact and links">
            <TextField label="Work email" type="email" value={draft.email} onChange={set(["email"])} error={err(["email"])} />
            <Toggle label="Show email on card" checked={draft.show.email} onChange={set(["show", "email"])} />
            <TextField label="Phone (international format)" type="tel" value={draft.phone} onChange={set(["phone"])} error={err(["phone"])} />
            <Toggle label="Show phone on card" checked={draft.show.phone} onChange={set(["show", "phone"])} />
            <Toggle label="Still include a hidden email or phone in the downloadable contact file" checked={draft.includeHiddenInContactFile} onChange={set(["includeHiddenInContactFile"])} />
            <TextField label="Website (https://)" type="url" value={draft.website} onChange={set(["website"])} error={err(["website"])} />
            <Toggle label="Show website on card" checked={draft.show.website} onChange={set(["show", "website"])} />
            <TextField label="LinkedIn URL (https://)" type="url" value={draft.linkedin.url} onChange={set(["linkedin", "url"])} error={err(["linkedin", "url"])} />
            <Toggle label="Show LinkedIn" checked={draft.linkedin.enabled} onChange={set(["linkedin", "enabled"])} />
            <TextField label="Eric's own WhatsApp number (digits with country code)" value={draft.whatsapp.number} onChange={set(["whatsapp", "number"])} error={err(["whatsapp", "number"])} />
            <Toggle label="Show WhatsApp contact button" checked={draft.whatsapp.enabled} onChange={set(["whatsapp", "enabled"])} />
            <p className="text-xs text-muted-foreground">This is Eric's personal contact button, separate from the WhatsApp product in the referral section.</p>
          </Section>

          <Section title="Tonric company socials">
            <TextField label="Tonric Facebook page (https://)" type="url" value={draft.socials.facebook.url} onChange={set(["socials", "facebook", "url"])} error={err(["socials", "facebook", "url"])} />
            <Toggle label="Show Facebook" checked={draft.socials.facebook.enabled} onChange={set(["socials", "facebook", "enabled"])} />
            <TextField label="Tonric Instagram page (https://)" type="url" value={draft.socials.instagram.url} onChange={set(["socials", "instagram", "url"])} error={err(["socials", "instagram", "url"])} />
            <Toggle label="Show Instagram" checked={draft.socials.instagram.enabled} onChange={set(["socials", "instagram", "enabled"])} />
            <TextField label="Tonric LinkedIn company page (https://)" type="url" value={draft.socials.linkedin.url} onChange={set(["socials", "linkedin", "url"])} error={err(["socials", "linkedin", "url"])} />
            <Toggle label="Show LinkedIn page" checked={draft.socials.linkedin.enabled} onChange={set(["socials", "linkedin", "enabled"])} />
            <p className="text-xs text-muted-foreground">Shown with the Tonric website under "Follow Tonric" on the card.</p>
          </Section>

          <Section title="Referrals">
            <Toggle label="Show the referral section" checked={draft.referrals.visible} onChange={set(["referrals", "visible"])} />
            <Toggle label="Show the partner network panel" checked={draft.referrals.showNetwork} onChange={set(["referrals", "showNetwork"])} />
            <Toggle label="Show the introduction panel" checked={draft.referrals.showIntro} onChange={set(["referrals", "showIntro"])} />
            <button
              type="button"
              onClick={() => setDraft((d) => (d ? { ...d, text: { en: { ...d.text.en, ref: structuredClone(defaultCard.text.en.ref) }, zh: { ...d.text.zh, ref: structuredClone(defaultCard.text.zh.ref) } } } : d))}
              className="h-10 rounded-xl border border-border px-4 text-sm"
            >
              Use latest suggested referral wording
            </button>
            <p className="text-xs text-muted-foreground">Replaces all referral text below in both languages. Then Preview and Publish Changes.</p>
            {Bi({ label: "Section heading", field: (l) => ["text", l, "ref", "heading"] })}
            {Bi({ label: "Product positioning", field: (l) => ["text", l, "ref", "positioning"], area: true })}
            {Bi({ label: "Current referral ask", field: (l) => ["text", l, "ref", "ask"], area: true })}
            {[0, 1, 2].map((i) => <div key={i}>{Bi({ label: `Signal ${i + 1}`, field: (l) => ["text", l, "ref", "cues", i], area: true })}</div>)}
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-3">
                {Bi({ label: `Partner category ${i + 1} — title`, field: (l) => ["text", l, "ref", "network", i, "title"] })}
                {Bi({ label: `Partner category ${i + 1} — description`, field: (l) => ["text", l, "ref", "network", i, "body"], area: true })}
              </div>
            ))}
            {Bi({ label: "Copyable introduction (keep the [brackets] for people to fill in)", field: (l) => ["text", l, "ref", "template"], area: true })}
          </Section>

          <Section title="Sharing">
            <TextField label="Link preview title" value={draft.sharing.title} onChange={set(["sharing", "title"])} error={err(["sharing", "title"])} />
            <TextField label="Link preview description" area value={draft.sharing.description} onChange={set(["sharing", "description"])} error={err(["sharing", "description"])} />
            <label className="block text-sm">
              <span className="font-medium">Card address (read-only, keeps printed QR codes working)</span>
              <input readOnly value={url} className="mt-1 h-11 w-full rounded-xl border border-border bg-secondary px-3 text-sm text-muted-foreground" />
            </label>
          </Section>
        </main>
      )}

      <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-2 text-sm ${msg.kind === "err" ? "text-destructive" : "text-primary"}`}>{msg.text}</p>}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => run("save")} disabled={!!busy || !dirty} className="h-11 rounded-xl border border-border bg-secondary text-sm font-medium disabled:opacity-50">
              {busy === "save" ? "Saving…" : "Save Draft"}
            </button>
            <button onClick={() => (validation?.success ? setConfirmOpen(true) : setMsg({ kind: "err", text: "Fix the highlighted fields first." }))} disabled={!!busy} className="h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50">
              {busy === "publish" ? "Publishing…" : "Publish Changes"}
            </button>
          </div>
          <p className="mt-1 text-center text-xs text-muted-foreground">Draft saved: {fmt(savedAt)}</p>
        </div>
      </footer>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish these changes?</AlertDialogTitle>
            <AlertDialogDescription>The public card and the downloadable contact file will update right away.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => run("publish")}>Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function get(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((o, k) => (o as Record<string | number, unknown>)?.[k], obj);
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="grid min-h-dvh place-items-center bg-background px-4"><div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6">{children}</div></div>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-3xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-5 shrink-0 accent-primary" />
    </label>
  );
}

