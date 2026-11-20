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

import { cardDataSchema as _cs, whatsappHref, whatsappLabel } from "@/lib/card-schema";
describe("whatsapp accepts number or link", () => {
  it("link used as-is", () => {
    expect(whatsappHref("https://wa.me/message/WG4UEQM4NNOQN1")).toBe("https://wa.me/message/WG4UEQM4NNOQN1");
    expect(whatsappLabel("https://wa.me/message/WG4UEQM4NNOQN1")).toBe("wa.me/message/WG4UEQM4NNOQN1");
  });
  it("number becomes wa.me link", () => {
    expect(whatsappHref("85266169018")).toBe("https://wa.me/85266169018");
  });
});
describe("whatsapp schema", () => {
  it("accepts the wa.me link", () => {
    const d = { ...defaultCard, whatsapp: { enabled: true, number: "https://wa.me/message/WG4UEQM4NNOQN1" } };
    expect(_cs.safeParse(d).success).toBe(true);
  });
  it("rejects a non-WhatsApp link", () => {
    const d = { ...defaultCard, whatsapp: { enabled: true, number: "https://evil.com/x" } };
    expect(_cs.safeParse(d).success).toBe(false);
  });
});
