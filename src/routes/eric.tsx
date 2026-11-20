import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublishedCard } from "@/lib/card.functions";
import { getRequestOrigin } from "@/lib/origin.functions";
import { CardView } from "@/components/CardView";
import { cardConfig, defaultCard } from "@/config/card.config";
import { shareImageForCard } from "@/lib/share-image";

export const publishedCardQuery = queryOptions({
  queryKey: ["published-card"],
  queryFn: () => getPublishedCard(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/eric")({
  loader: async ({ context }) => {
    const [card, origin] = await Promise.all([
      context.queryClient.ensureQueryData(publishedCardQuery),
      getRequestOrigin(),
    ]);
    return { card, origin };
  },
  head: ({ loaderData }) => {
    const card = loaderData?.card.card ?? defaultCard;
    const title = card.sharing.title;
    const desc = card.sharing.description;
    const shareImage = shareImageForCard(card);
    const imageUrl = loaderData ? new URL(shareImage.path, loaderData.origin).toString() : null;
    const cardUrl = loaderData ? cardConfig.canonicalUrl || new URL(cardConfig.cardPath, loaderData.origin).toString() : null;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        ...(cardUrl ? [{ property: "og:url", content: cardUrl }] : []),
        ...(imageUrl ? [
          { property: "og:image", content: imageUrl },
          { property: "og:image:width", content: String(shareImage.width) },
          { property: "og:image:height", content: String(shareImage.height) },
          { property: "og:image:type", content: "image/jpeg" },
          { property: "og:image:alt", content: "Portrait of Eric Lam" },
          { name: "twitter:image", content: imageUrl },
          { name: "twitter:image:alt", content: "Portrait of Eric Lam" },
        ] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: cardUrl ? [{ rel: "canonical", href: cardUrl }] : [],
    };
  },
  component: CardPage,
  errorComponent: () => <p className="p-6 text-center text-sm text-muted-foreground">This card could not load. Please refresh.</p>,
  notFoundComponent: () => <p className="p-6 text-center text-sm text-muted-foreground">Card not found.</p>,
});

function CardPage() {
  const { data } = useSuspenseQuery(publishedCardQuery);
  return <CardView card={data.card} />;
}
