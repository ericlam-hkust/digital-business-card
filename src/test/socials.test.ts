import { describe, expect, it } from "vitest";
import { cardDataSchema } from "@/lib/card-schema";
import { defaultCard } from "@/config/card.config";

describe("Tonric company socials", () => {
  it("uses the links Eric gave, switched on", () => {
    expect(defaultCard.socials.facebook).toEqual({ enabled: true, url: "https://www.facebook.com/tonric" });
    expect(defaultCard.socials.instagram).toEqual({ enabled: true, url: "https://www.instagram.com/tonric.ai/" });
  });
  it("older saved cards without socials still get these links", () => {
    const { socials: _s, ...old } = defaultCard;
    const r = cardDataSchema.parse(old);
    expect(r.socials.facebook.url).toBe("https://www.facebook.com/tonric");
    expect(r.socials.instagram.enabled).toBe(true);
  });
  it("rejects a shown social without an https link", () => {
    expect(cardDataSchema.safeParse({ ...defaultCard, socials: { ...defaultCard.socials, facebook: { enabled: true, url: "" } } }).success).toBe(false);
    expect(cardDataSchema.safeParse({ ...defaultCard, socials: { ...defaultCard.socials, instagram: { enabled: true, url: "http://instagram.com/x" } } }).success).toBe(false);
  });
});
