import { cardConfig } from "@/config/card.config";
import { phoneDigits, type CardData } from "@/lib/card-schema";

/** Escape a vCard 3.0 text value (RFC 2426). */
export function escapeVCard(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

/** Builds the contact file from published card data; empty email/phone are left out. */
export function buildVCard(c: CardData): string {
  const e = escapeVCard;
  const keepHidden = c.includeHiddenInContactFile;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N;CHARSET=UTF-8:${e(c.name.last)};${e(c.name.first)};;;`,
    `FN;CHARSET=UTF-8:${e(c.name.full)}`,
    `ORG;CHARSET=UTF-8:${e(c.company)}`,
    `TITLE;CHARSET=UTF-8:${e(c.text.en.title)}`,
  ];
  if (c.email && (c.show.email || keepHidden)) lines.push(`EMAIL;TYPE=INTERNET,WORK:${c.email}`);
  if (c.phone && (c.show.phone || keepHidden)) lines.push(`TEL;TYPE=WORK,VOICE:${phoneDigits(c.phone)}`);
  if (c.website && c.show.website) lines.push(`URL:${c.website}`);
  lines.push("END:VCARD");
  return lines.join("\r\n") + "\r\n";
}

export function downloadVCard(c: CardData) {
  const blob = new Blob([buildVCard(c)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = cardConfig.vcardFileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
