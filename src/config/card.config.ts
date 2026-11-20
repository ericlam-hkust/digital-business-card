/**
 * Eric Lam's digital business card.
 * - `defaultCard`: built-in content. It seeds the editor and is the fallback when
 *   no valid published version can be loaded.
 * - `cardConfig`: fixed settings (card address, images, file name).
 * - `uiText`: fixed button and label text.
 */
import headshot from "@/assets/eric-lam-headshot.jpg.asset.json";
import cover from "@/assets/tonric-cover.png.asset.json";
import logo from "@/assets/tonric-logo.png.asset.json";
import type { CardData, Lang } from "@/lib/card-schema";

export type { Lang };

export const cardConfig = {
  /**
   * Final public URL of this card, e.g. "https://tonric.com/eric".
   * While empty, the QR code and Share use the current site address and the
   * QR is labelled "Preview" so it is not printed by mistake.
   */
  canonicalUrl: "",
  cardPath: "/eric",
  vcardFileName: "Eric-Lam-Tonric.vcf",
  headshotUrl: headshot.url as string | null,
  coverUrl: cover.url as string | null,
  logoUrl: logo.url as string | null,
  initials: "EL",
};

export const defaultCard: CardData = {
  name: { first: "Eric", last: "Lam", full: "Eric Lam" },
  company: "Tonric Limited",
  companyZh: "拓域創科",
  email: "eric.lam@tonric.com",
  phone: "+852 6616 9018",
  website: "https://tonric.com",
  linkedin: { enabled: true, url: "https://www.linkedin.com/in/ericlamhf/" },
  whatsapp: { enabled: false, number: "85266169018" },
  show: { email: true, phone: true, website: true },
  includeHiddenInContactFile: false,
  referrals: { visible: true, showNetwork: true, showIntro: true },
  headshot: "",
  cover: "",
  socials: {
    facebook: { enabled: true, url: "https://www.facebook.com/tonric" },
    instagram: { enabled: true, url: "https://www.instagram.com/tonric.ai/" },
    linkedin: { enabled: false, url: "" },
  },
  brands: { visible: true, names: ["PUMA", "Li & Fung", "Pandora", "Tiffany & Co.", "Nike"] },
  sharing: {
    title: "Eric Lam | Tonric Limited",
    description: "Eric Lam, Co-founder & CEO of Tonric Limited (拓域創科). Hong Kong AI solutions and SaaS. Save my contact in one tap.",
  },
  text: {
    en: {
      title: "Co-founder & CEO",
      location: "Hong Kong",
      intro: "I help Hong Kong SMEs put AI to work, from automating everyday workflows to building custom software.",
      tagline: "Make the right solution. Ship the solution right.",
      bio:
        "Eric Lam is Co-founder & CEO of Tonric Limited, where he helps Hong Kong SMEs identify practical uses for AI, automate manual workflows, and build software that fits the way they work.\n\nEric brings over a decade of experience in digital transformation, enterprise systems, and process innovation across global consumer brands. At PUMA Group, he leads digital solutions and process innovation for supply chain operations, including AI, automation, and enterprise systems initiatives. His earlier experience includes roles at Li & Fung, Pandora, Tiffany & Co., and Nike.",
      ref: {
        heading: "Referrals & Partnerships",
        positioning:
          "Tonric’s AI-powered WhatsApp agent and intelligent CRM help Hong Kong SMEs serve customers 24/7. The AI understands each enquiry, answers instantly in natural language, and automatically captures every conversation, lead and follow-up in one smart workspace.",
        ask: "Please introduce me to the owner or customer service lead of a Hong Kong SME that serves customers on WhatsApp and wants AI to reply after hours and track every follow-up automatically. I’d especially like to meet service businesses that handle frequent enquiries about bookings, pricing, or availability.",
        cues: [
          "“Customers message us after closing, but nobody replies until the next day.”",
          "“We answer the same questions about prices, bookings, and availability all day.”",
          "“Several staff handle WhatsApp, but we don’t know who replied or which enquiry still needs follow-up.”",
        ],
        network: [
          { title: "Upstream — Referral partners", body: "SME advisers, business association contacts, and marketing agencies that can introduce owners or customer service leads ready to let AI handle frequent WhatsApp enquiries." },
          { title: "Midstream — Solution partners", body: "CRM implementers, booking-system providers, and digital agencies that can combine their solutions with Tonric’s AI agent for shared clients." },
          { title: "Downstream — Delivery suppliers", body: "AI model, messaging platform and cloud providers, plus integration specialists, whom Tonric may directly pay for products or services needed to deliver the solution." },
        ],
        template:
          "Hi [Name], I’d like to introduce you to Eric Lam, Co-founder & CEO of Tonric. You mentioned that your team [describe the WhatsApp challenge]. Eric’s team offers an AI-powered WhatsApp agent and intelligent CRM that answers customers 24/7 and tracks every follow-up automatically. I thought it would be useful for you to explore how AI could handle your enquiries. Eric, [Name] leads [function] at [company].",
      },
    },
    zh: {
      title: "聯合創辦人兼行政總裁",
      location: "香港",
      intro: "我協助香港中小企將 AI 應用於實際業務，從日常流程自動化到度身訂造軟件。",
      tagline: "Make the right solution. Ship the solution right.",
      bio:
        "Eric Lam 是拓域創科（Tonric Limited）的聯合創辦人兼行政總裁，專注協助香港中小企找出切合業務需要的 AI 應用場景、自動化人手流程，以及開發配合日常營運的軟件。\n\nEric 在國際消費品牌累積逾十年數碼轉型、企業系統及流程創新經驗。他現於 PUMA Group 領導供應鏈數碼方案及流程創新，負責推動 AI、自動化及企業系統項目，過往亦曾任職於利豐、Pandora、Tiffany & Co. 及 Nike。",
      ref: {
        heading: "商業引薦與合作",
        positioning:
          "拓域創科的 AI WhatsApp 客服助理及智能客戶關係管理系統（CRM），協助香港中小企全天候 24 小時服務客戶。AI 能理解每項查詢、以自然語言即時回覆，並自動記錄每段對話、潛在客戶及跟進事項，集中於同一個智能平台。",
        ask: "希望你介紹我認識已用 WhatsApp 服務客戶的香港中小企東主或客戶服務主管，尤其是希望由 AI 在非辦公時間即時回覆、並自動跟進每位客戶的團隊。我特別希望認識經常處理預約、收費或可預約時段查詢的服務型企業。",
        cues: [
          "「客人收舖後都會 WhatsApp 我哋，但要等到第二日先有人覆。」",
          "「我哋日日都要答同樣嘅問題，例如收費、預約同有冇位。」",
          "「幾個同事一齊睇 WhatsApp，但有時唔知邊個覆咗，或者邊個客仲未跟進。」",
        ],
        network: [
          { title: "上游：引薦夥伴", body: "可引薦希望以 AI 處理大量 WhatsApp 查詢的企業東主或客服主管，例如中小企顧問、商會聯絡人及市場推廣公司。" },
          { title: "中游：方案合作夥伴", body: "可將自家方案與拓域創科 AI 助理結合、共同服務客戶的夥伴，例如 CRM 實施商、預約系統供應商及數碼服務公司。" },
          { title: "下游：交付供應商", body: "拓域創科可能直接付費採購產品或服務的交付供應商，例如 AI 模型、訊息平台及雲端服務商，以及系統整合專家。" },
        ],
        template:
          "你好，[姓名]，想介紹拓域創科聯合創辦人兼行政總裁 Eric Lam 畀你認識。你之前提過團隊［描述 WhatsApp 客服遇到的問題］。Eric 嘅團隊提供 AI WhatsApp 客服助理同智能 CRM，可以 24 小時自動回覆客人，仲會自動跟進每個查詢，我諗你哋可以傾下點樣用 AI 處理你哋嘅查詢。Eric，［姓名］負責［公司］嘅［職能］。",
      },
    },
  },
};

export const uiText = {
  en: {
    save: "Save Contact", share: "Share Card", showQr: "Show QR",
    email: "Email", call: "Call", website: "Website", digitalCard: "Digital Card", fansHeading: "Tonric Fans Pages", companyWebsite: "Company website", linkedin: "LinkedIn", whatsapp: "WhatsApp",
    linkCopied: "Link copied", copyLink: "Copy Link", downloadQr: "Download QR", close: "Close",
    qrTitle: "Scan to open my card", preview: "Preview — final link not set. Do not print.",
    copyManual: "Copy this link:", langToggle: "切換至繁體中文", photoAlt: "Photo of Eric Lam",
    aboutHeading: "About Eric", brandsLabel: "Brands I have worked with", readBio: "Read bio", hideBio: "Hide bio", linkedinLink: "View LinkedIn profile",
    askLabel: "Current referral ask", cuesLabel: "Listen for these signals", networkLabel: "Partner network",
    introLabel: "Make an introduction", copyIntro: "Copy Introduction", introCopied: "Introduction copied",
    consent: "Check that both people are comfortable with the introduction before sharing their contact details.",
    emailEric: "Email Eric", emailSubject: "Tonric referral or partnership introduction",
  },
  zh: {
    save: "儲存聯絡人", share: "分享名片", showQr: "顯示二維碼",
    email: "電郵", call: "致電", website: "網站", digitalCard: "電子名片", fansHeading: "拓域創科官方專頁", companyWebsite: "公司網站", linkedin: "LinkedIn", whatsapp: "WhatsApp",
    linkCopied: "已複製連結", copyLink: "複製連結", downloadQr: "下載二維碼", close: "關閉",
    qrTitle: "掃描開啟我的名片", preview: "預覽 — 尚未設定正式連結，請勿印刷。",
    copyManual: "請複製此連結：", langToggle: "Switch to English", photoAlt: "Eric Lam 的照片",
    aboutHeading: "關於 Eric", brandsLabel: "曾任職的品牌", readBio: "閱讀簡介", hideBio: "收起簡介", linkedinLink: "查看 LinkedIn 個人檔案",
    askLabel: "目前最希望獲得的引薦", cuesLabel: "留意這些說法", networkLabel: "合作夥伴網絡",
    introLabel: "作出引薦", copyIntro: "複製引薦訊息", introCopied: "已複製引薦訊息",
    consent: "分享聯絡資料前，請先確認雙方都同意接受引薦。",
    emailEric: "電郵聯絡 Eric", emailSubject: "拓域創科｜商業引薦或合作",
  },
} as const;

export type UiText = (typeof uiText)[Lang];

export function getCardUrl(origin?: string): { url: string; isPreview: boolean } {
  if (cardConfig.canonicalUrl) return { url: cardConfig.canonicalUrl, isPreview: false };
  return { url: `${origin ?? ""}${cardConfig.cardPath}`, isPreview: true };
}

/** Introduction text to copy; appends the card link only when a public canonical URL is set. */
export function buildIntroduction(card: CardData, lang: Lang): string {
  const tpl = card.text[lang].ref.template;
  return cardConfig.canonicalUrl ? `${tpl}\n\n${cardConfig.canonicalUrl}` : tpl;
}
