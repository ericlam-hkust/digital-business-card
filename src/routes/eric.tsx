import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getPublishedCard } from "@/lib/card.functions";
import { CardView } from "@/components/CardView";

export const publishedCardQuery = queryOptions({
  queryKey: ["published-card"],
  queryFn: () => getPublishedCard(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/eric")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedCardQuery),
  head: ({ loaderData }) => {
    const title = loaderData?.card.sharing.title ?? "Eric Lam | Tonric Limited";
    const desc = loaderData?.card.sharing.description ?? "Digital business card of Eric Lam, Co-founder & CEO of Tonric Limited.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
      ],
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
