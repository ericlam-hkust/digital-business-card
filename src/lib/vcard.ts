import { cardConfig } from "@/config/card.config";

/** Escape a vCard 3.0 text value (RFC 2426). */
export function escapeVCard(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

export function buildVCard(c = cardConfig): string {
  const e = escapeVCard;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N;CHARSET=UTF-8:${e(c.name.last)};${e(c.name.first)};;;`,
    `FN;CHARSET=UTF-8:${e(c.name.full)}`,
    `ORG;CHARSET=UTF-8:${e(c.company)}`,
    `TITLE;CHARSET=UTF-8:${e(c.text.en.title)}`,
    `EMAIL;TYPE=INTERNET,WORK:${c.email}`,
    `TEL;TYPE=WORK,VOICE:${c.phoneE164}`,
    `URL:${c.website}`,
    "END:VCARD",
  ];
  return lines.join("\r\n") + "\r\n";
}

export function downloadVCard() {
  const blob = new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = cardConfig.vcardFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
