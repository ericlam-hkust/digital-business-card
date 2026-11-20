import { describe, expect, it } from "vitest";
import { starterCard } from "@/lib/card.functions";
import { defaultCard } from "@/config/card.config";
import { cardDataSchema } from "@/lib/card-schema";
import { shareImageForCard } from "@/lib/share-image";

describe("multiple cards", () => {
  it("Eric's card starts from the built-in content", () => {
    expect(starterCard("eric")).toBe(defaultCard);
  });
  it("a new card starts with its own name and no photo, and is valid", () => {
    const t = starterCard("tony");
    expect(t.name.full).toBe("Tony Ho");
    expect(t.headshot).toBe("");
    expect(cardDataSchema.safeParse(t).success).toBe(true);
  });
  it("share image points at the right person's card", () => {
    expect(shareImageForCard({ headshot: "x", shareHeadshot: "y" }, "tony").path).toBe("/api/public/share-headshot?slug=tony");
  });
});
