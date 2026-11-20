/**
 * Eric Lam's digital business card — the single source of truth for
 * profile data, links, translations and feature toggles.
 */
import headshot from "@/assets/eric-lam-headshot.jpg.asset.json";
import logo from "@/assets/tonric-logo.png.asset.json";

export type Lang = "en" | "zh";

export const cardConfig = {
  /**
   * Final public URL of this card, e.g. "https://tonric.com/eric".
   * While empty, the QR code and Share use the current site address and the
   * QR is labelled "Preview" so it is not printed by mistake.
   */
  canonicalUrl: "",
  cardPath: "/eric",

  vcardFileName: "Eric-Lam-Tonric.vcf",

  name: { first: "Eric", last: "Lam", full: "Eric Lam", initials: "EL" },
  company: "Tonric Limited",
  companyZh: "拓域創科",
  email: "eric.lam@tonric.com",
  phone: "+852 6616 9018",
  phoneE164: "+85266169018",
  website: "https://tonric.com",
  websiteLabel: "tonric.com",

  headshotUrl: headshot.url as string | null,
  logoUrl: logo.url as string | null,

  linkedin: { enabled: false, url: "" },
  whatsapp: { enabled: false, number: "85266169018" },
  showFooterTagline: true,

  text: {
    en: {
      title: "Co-founder & CEO",
      location: "Hong Kong",
      intro:
        "I help Hong Kong SMEs put AI to work, from automating everyday workflows to building custom software.",
      save: "Save Contact",
      share: "Share Card",
      showQr: "Show QR",
      email: "Email",
      call: "Call",
      website: "Website",
      linkedin: "LinkedIn",
      whatsapp: "WhatsApp",
      linkCopied: "Link copied",
      copyLink: "Copy Link",
      downloadQr: "Download QR",
      close: "Close",
      qrTitle: "Scan to open my card",
      preview: "Preview — final link not set. Do not print.",
      copyManual: "Copy this link:",
      langToggle: "切換至繁體中文",
      tagline: "Make the right solution. Ship the solution right.",
      photoAlt: "Photo of Eric Lam",
    },
    zh: {
      title: "聯合創辦人兼行政總裁",
      location: "香港",
      intro: "我協助香港中小企將 AI 應用於實際業務，從日常流程自動化到度身訂造軟件。",
      save: "儲存聯絡人",
      share: "分享名片",
      showQr: "顯示二維碼",
      email: "電郵",
      call: "致電",
      website: "網站",
      linkedin: "LinkedIn",
      whatsapp: "WhatsApp",
      linkCopied: "已複製連結",
      copyLink: "複製連結",
      downloadQr: "下載二維碼",
      close: "關閉",
      qrTitle: "掃描開啟我的名片",
      preview: "預覽 — 尚未設定正式連結，請勿印刷。",
      copyManual: "請複製此連結：",
      langToggle: "Switch to English",
      tagline: "Make the right solution. Ship the solution right.",
      photoAlt: "Eric Lam 的照片",
    },
  },
} as const;

export function getCardUrl(origin?: string): { url: string; isPreview: boolean } {
  if (cardConfig.canonicalUrl) return { url: cardConfig.canonicalUrl, isPreview: false };
  return { url: `${origin ?? ""}${cardConfig.cardPath}`, isPreview: true };
}
