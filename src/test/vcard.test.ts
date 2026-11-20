import { describe, expect, it } from "vitest";
import { buildVCard, escapeVCard } from "@/lib/vcard";
import { buildIntroduction, defaultCard } from "@/config/card.config";
import { cardDataSchema, toPublic } from "@/lib/card-schema";

describe("vCard", () => {
  const v = buildVCard(defaultCard);
  it("is vCard 3.0 with CRLF line endings", () => {
    expect(v.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")).toBe(true);
    expect(v.replace(/\r\n/g, "")).not.toMatch(/\n/);
  });
  it("contains Eric's work contact fields", () => {
    expect(v).toContain("N;CHARSET=UTF-8:Lam;Eric;;;");
    expect(v).toContain("FN;CHARSET=UTF-8:Eric Lam");
    expect(v).toContain("ORG;CHARSET=UTF-8:Tonric Limited");
    expect(v).toContain("TITLE;CHARSET=UTF-8:Co-founder & CEO");
    expect(v).toContain("EMAIL;TYPE=INTERNET,WORK:eric.lam@tonric.com");
    expect(v).toContain("TEL;TYPE=WORK,VOICE:+85266169018");
    expect(v).toContain("URL:https://tonric.com");
  });
  it("escapes special characters", () => {
    expect(escapeVCard("a,b;c\\d\ne")).toBe("a\\,b\\;c\\\\d\\ne");
  });
  it("hidden phone and email are removed from public data and the contact file", () => {
    const hidden = { ...defaultCard, show: { ...defaultCard.show, email: false, phone: false } };
    const pub = toPublic(hidden);
    expect(pub.email).toBe("");
    expect(pub.phone).toBe("");
    const vc = buildVCard(pub);
    expect(vc).not.toContain("EMAIL");
    expect(vc).not.toContain("TEL");
  });
  it("hidden phone stays in the contact file only when the inclusion setting is on", () => {
    const c = { ...defaultCard, show: { ...defaultCard.show, phone: false }, includeHiddenInContactFile: true };
    expect(buildVCard(toPublic(c))).toContain("TEL;TYPE=WORK,VOICE:+85266169018");
  });
});

describe("referral content", () => {
  it("LinkedIn uses the exact supplied URL", () => {
    expect(defaultCard.linkedin.url).toBe("https://www.linkedin.com/in/ericlamhf/");
  });
  it("referral ask is the WhatsApp customer service focus in both languages", () => {
    expect(defaultCard.text.en.ref.ask).toContain("serves customers on WhatsApp and wants AI");
    expect(defaultCard.text.zh.ref.ask).toContain("已用 WhatsApp 服務客戶");
    expect(JSON.stringify(defaultCard.text)).not.toMatch(/shipment|付運/);
  });
  it("introduction copies in the chosen language without preview links", () => {
    expect(buildIntroduction(defaultCard, "en").startsWith("Hi [Name], I’d like to introduce you to Eric Lam")).toBe(true);
    expect(buildIntroduction(defaultCard, "zh").startsWith("你好，[姓名]")).toBe(true);
    expect(buildIntroduction(defaultCard, "en")).not.toMatch(/lovable/);
  });
});

describe("card validation", () => {
  it("built-in content is valid", () => {
    expect(cardDataSchema.safeParse(defaultCard).success).toBe(true);
  });
  it("rejects http links", () => {
    expect(cardDataSchema.safeParse({ ...defaultCard, website: "http://tonric.com" }).success).toBe(false);
    expect(cardDataSchema.safeParse({ ...defaultCard, linkedin: { enabled: true, url: "http://linkedin.com/in/x" } }).success).toBe(false);
  });
  it("rejects invalid email and non-international phone", () => {
    expect(cardDataSchema.safeParse({ ...defaultCard, email: "eric@" }).success).toBe(false);
    expect(cardDataSchema.safeParse({ ...defaultCard, phone: "66169018" }).success).toBe(false);
  });
});
