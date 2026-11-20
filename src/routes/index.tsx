import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/$slug", params: { slug: "eric" } });
  },
  head: () => ({
    meta: [
      { title: "Eric Lam | Tonric Limited" },
      { name: "description", content: "Digital business card of Eric Lam, Co-founder & CEO of Tonric Limited." },
      { property: "og:title", content: "Eric Lam | Tonric Limited" },
      { property: "og:description", content: "Digital business card of Eric Lam, Co-founder & CEO of Tonric Limited." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
