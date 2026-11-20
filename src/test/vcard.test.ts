import { describe, expect, it } from "vitest";
import { buildVCard, escapeVCard } from "@/lib/vcard";

describe("vCard", () => {
  const v = buildVCard();
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
});
