import { createFileRoute } from "@tanstack/react-router";
import { loadPublishedCard } from "@/lib/card.functions";
import { buildVCard } from "@/lib/vcard";
import { cardConfig } from "@/config/card.config";

/** Public contact file of the published card. Served by the server so iPhone Safari opens "Add to Contacts". */
export const Route = createFileRoute("/api/public/vcard")({
  server: {
    handlers: {
      GET: async () => {
        const { card } = await loadPublishedCard();
        return new Response(buildVCard(card), {
          headers: {
            "Content-Type": "text/vcard; charset=utf-8",
            "Content-Disposition": `inline; filename="${cardConfig.vcardFileName}"`,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
