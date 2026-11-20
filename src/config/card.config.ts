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

  linkedin: { enabled: true, url: "https://www.linkedin.com/in/ericlamhf/" },
  whatsapp: { enabled: false, number: "85266169018" },
  showFooterTagline: true,

  text: {
    en: {
      about: {
        heading: "About Eric",
        readBio: "Read bio",
        hideBio: "Hide bio",
        bio: [
          "Eric Lam is Co-founder & CEO of Tonric Limited, where he helps Hong Kong SMEs identify practical uses for AI, automate manual workflows, and build software that fits the way they work.",
          "Eric brings over a decade of experience in digital transformation, enterprise systems, and process innovation across global consumer brands. At PUMA Group, he leads digital solutions and process innovation for supply chain operations, including AI, automation, and enterprise systems initiatives. His earlier experience includes roles at Li & Fung, Pandora, Tiffany & Co., and Nike.",
        ],
        linkedinLink: "View LinkedIn profile",
      },
      ref: {
        heading: "Referrals & Partnerships",
        intro: "I’m looking for introductions to Hong Kong SME owners and operations leaders who want to cut manual work but aren’t sure where to start.",
        askLabel: "Current referral ask",
        ask: "My ideal introduction right now is to the owner or operations head of a Hong Kong trading, distribution, or logistics SME whose team manually re-enters orders, invoices, or shipment updates across email, Excel, and internal systems.",
        cuesLabel: "Listen for these signals",
        cues: [
          "“We keep copying the same order details from emails and PDFs into Excel or our system.”",
          "“Our team spends hours chasing approvals or pulling together weekly reports.”",
          "“We want to try AI, but we don’t know which workflow to start with.”",
        ],
        cuesNote: "A good first conversation starts with one recurring workflow and the person responsible for it. No technical brief is needed.",
        networkLabel: "Partner network",
        network: [
          { title: "Upstream — Referral partners", body: "People who already advise SME decision-makers and can spot a workflow problem early: accountants, outsourced finance advisers, SME consultants, and industry association contacts." },
          { title: "Midstream — Solution partners", body: "Businesses with complementary offerings that could work with Tonric on a shared client opportunity: ERP or CRM implementers, managed IT providers, and process improvement consultants." },
          { title: "Downstream — Delivery suppliers", body: "Vendors and specialists Tonric may directly pay for products or services needed to deliver a project: cloud and software vendors, integration or development contractors, and security testing providers." },
        ],
        introLabel: "Make an introduction",
        template: "Hi [Name], I’d like to introduce you to Eric Lam, Co-founder & CEO of Tonric. You mentioned that your team spends time on [specific workflow]. Eric helps Hong Kong SMEs work out where AI or workflow automation could reduce manual work. Eric, [Name] leads [function] at [company]. I thought it would be useful for you both to connect.",
        copyIntro: "Copy Introduction",
        introCopied: "Introduction copied",
        consent: "Check that both people are comfortable with the introduction before sharing their contact details.",
        emailEric: "Email Eric",
        emailSubject: "Tonric referral or partnership introduction",
      },
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
      about: {
        heading: "關於 Eric",
        readBio: "閱讀簡介",
        hideBio: "收起簡介",
        bio: [
          "Eric Lam 是拓域創科（Tonric Limited）的聯合創辦人兼行政總裁，專注協助香港中小企找出切合業務需要的 AI 應用場景、自動化人手流程，以及開發配合日常營運的軟件。",
          "Eric 在國際消費品牌累積逾十年數碼轉型、企業系統及流程創新經驗。他現於 PUMA Group 領導供應鏈數碼方案及流程創新，負責推動 AI、自動化及企業系統項目，過往亦曾任職於利豐、Pandora、Tiffany & Co. 及 Nike。",
        ],
        linkedinLink: "查看 LinkedIn 個人檔案",
      },
      ref: {
        heading: "商業引薦與合作",
        intro: "我希望認識有意減少人手操作，但未確定從何入手的香港中小企東主及營運主管。",
        askLabel: "目前最希望獲得的引薦",
        ask: "現階段最希望獲引薦的是香港貿易、分銷或物流中小企的東主或營運主管，尤其是團隊需要在電郵、Excel 和內部系統之間重複輸入訂單、發票或付運資料的企業。",
        cuesLabel: "留意這些說法",
        cues: [
          "「我哋成日要將電郵同 PDF 入面嘅訂單資料，再入一次 Excel 或公司系統。」",
          "「我哋每星期都花好多時間追批核或者整合報表。」",
          "「我哋想試用 AI，但唔知由邊個流程開始。」",
        ],
        cuesNote: "初步交流只需由一個重複出現的工作流程及其負責人入手，毋須預先準備技術規格。",
        networkLabel: "合作夥伴網絡",
        network: [
          { title: "上游：引薦夥伴", body: "經常與中小企決策者交流、能及早發現流程痛點的夥伴，例如會計師、外判財務顧問、中小企顧問及商會或行業協會聯絡人。" },
          { title: "中游：方案合作夥伴", body: "服務互補、可與拓域創科共同為客戶提供方案的夥伴，例如 ERP 或 CRM 實施商、託管 IT 服務商及流程改善顧問。" },
          { title: "下游：交付供應商", body: "拓域創科為交付項目而直接採購產品或服務的供應商及專業團隊，例如雲端及軟件供應商、系統整合或開發承辦商，以及保安測試服務商。" },
        ],
        introLabel: "作出引薦",
        template: "你好，[姓名]，想介紹拓域創科聯合創辦人兼行政總裁 Eric Lam 畀你認識。你之前提過團隊花唔少時間處理［具體流程］。Eric 主要協助香港中小企了解點樣用 AI 或流程自動化減少人手工作。Eric，［姓名］負責［公司］嘅［職能］，相信你哋可以交流一下。",
        copyIntro: "複製引薦訊息",
        introCopied: "已複製引薦訊息",
        consent: "分享聯絡資料前，請先確認雙方都同意接受引薦。",
        emailEric: "電郵聯絡 Eric",
        emailSubject: "拓域創科｜商業引薦或合作",
      },
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

/** Introduction text to copy; appends the card link only when a public canonical URL is set. */
export function buildIntroduction(lang: Lang): string {
  const tpl = cardConfig.text[lang].ref.template;
  return cardConfig.canonicalUrl ? `${tpl}\n\n${cardConfig.canonicalUrl}` : tpl;
}
