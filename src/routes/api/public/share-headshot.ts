import { createFileRoute } from "@tanstack/react-router";
import { loadPublishedCard } from "@/lib/card.functions";
import { decodeJpegDataUrl, DEFAULT_SHARE_IMAGE_PATH } from "@/lib/share-image";

const imageHeaders = {
  "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
};

/** Public social-preview rendition of the latest published headshot. */
export const Route = createFileRoute("/api/public/share-headshot")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const slug = new URL(request.url).searchParams.get("slug") || "eric";
        const loaded = /^[a-z0-9-]{2,30}$/.test(slug) ? await loadPublishedCard(slug) : null;
        if (!loaded) return new Response("Card not found", { status: 404 });
        const { card } = loaded;
        const bytes = decodeJpegDataUrl(card.shareHeadshot || card.headshot);
        if (!bytes) {
          return new Response(null, {
            status: 302,
            headers: { ...imageHeaders, Location: DEFAULT_SHARE_IMAGE_PATH },
          });
        }
        return new Response(bytes.buffer as ArrayBuffer, {
          headers: { ...imageHeaders, "Content-Type": "image/jpeg" },
        });
      },
    },
  },
});
