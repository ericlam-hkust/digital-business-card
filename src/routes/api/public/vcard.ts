import { createFileRoute } from "@tanstack/react-router";
import { loadPublishedCard } from "@/lib/card.functions";
import { buildVCard } from "@/lib/vcard";
import { cardConfig } from "@/config/card.config";

/** Public contact file of the published card. Served by the server so iPhone Safari opens "Add to Contacts". */
export const Route = createFileRoute("/api/public/vcard")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const slug = new URL(request.url).searchParams.get("slug") || "eric";
        const loaded = /^[a-z0-9-]{2,30}$/.test(slug) ? await loadPublishedCard(slug) : null;
        if (!loaded) return new Response("Card not found", { status: 404 });
        const { card } = loaded;
        return new Response(buildVCard(card), {
          headers: {
            "Content-Type": "text/vcard; charset=utf-8",
            "Content-Disposition": `inline; filename="${slug === "eric" ? cardConfig.vcardFileName : `${card.name.full.replace(/[^A-Za-z0-9]+/g, "-") || slug}-Tonric.vcf`}"`,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
