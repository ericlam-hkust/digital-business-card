/** Shape and validation rules for editable card content (draft and published). */
import { z } from "zod";

export type Lang = "en" | "zh";

const httpsUrl = z
  .string()
  .trim()
  .refine((v) => {
    try {
      return new URL(v).protocol === "https:";
    } catch {
      return false;
    }
  }, "Must be a full https:// link");

const optionalHttpsUrl = z.union([z.literal(""), httpsUrl]);

/** International phone like +852 6616 9018. */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9][0-9 ()-]{6,20}$/, "Use international format, e.g. +852 6616 9018");

const text = z.string().max(2000);

const contentSchema = z.object({
  title: text,
  location: text,
  intro: text,
  tagline: text,
  bio: z.string().max(4000),
  ref: z.object({
    heading: text,
    positioning: text,
    ask: text,
    cues: z.tuple([text, text, text]),
    network: z.tuple([
      z.object({ title: text, body: text }),
      z.object({ title: text, body: text }),
      z.object({ title: text, body: text }),
    ]),
    template: text,
  }),
});

export const cardDataSchema = z.object({
  name: z.object({ first: z.string().trim().min(1), last: z.string().trim().min(1), full: z.string().trim().min(1) }),
  company: z.string().trim().min(1),
  companyZh: z.string().trim(),
  email: z.string().trim().email("Enter a valid email"),
  phone: phoneSchema,
  website: httpsUrl,
  linkedin: z.object({ enabled: z.boolean(), url: optionalHttpsUrl }),
  whatsapp: z.object({ enabled: z.boolean(), number: z.union([z.literal(""), z.string().trim().regex(/^([1-9][0-9]{7,14}|https:\/\/(wa\.me|api\.whatsapp\.com|whatsapp\.com|www\.whatsapp\.com)\/\S+)$/, "Digits with country code (e.g. 85266169018) or a WhatsApp link (e.g. https://wa.me/message/...)")]) }),
  show: z.object({ email: z.boolean(), phone: z.boolean(), website: z.boolean(), digitalCard: z.boolean().default(true), quickIcons: z.boolean().default(true), quickIconItems: z.object({ email: z.boolean().default(true), phone: z.boolean().default(true), card: z.boolean().default(true), linkedin: z.boolean().default(true), whatsapp: z.boolean().default(true) }).default({ email: true, phone: true, card: true, linkedin: true, whatsapp: true }) }),
  /** When true, a hidden email/phone is still put in the downloadable contact file. */
  includeHiddenInContactFile: z.boolean(),
  referrals: z.object({ visible: z.boolean(), showNetwork: z.boolean(), showIntro: z.boolean() }),
  /** Tonric company social pages shown under "Follow Tonric"; older saved versions get empty, hidden links. */
  socials: z
    .object({
      facebook: z.object({ enabled: z.boolean(), url: optionalHttpsUrl }),
      instagram: z.object({ enabled: z.boolean(), url: optionalHttpsUrl }),
      linkedin: z.object({ enabled: z.boolean(), url: optionalHttpsUrl }).default({ enabled: true, url: "https://www.linkedin.com/company/tonric" }),
    })
    .default({
      facebook: { enabled: true, url: "https://www.facebook.com/tonric" },
      instagram: { enabled: true, url: "https://www.instagram.com/tonric.ai/" },
      linkedin: { enabled: true, url: "https://www.linkedin.com/company/tonric" },
    }),
  /** Past employers shown as logos under About Eric; older saved versions get the defaults. */
  brands: z
    .object({ visible: z.boolean(), names: z.array(z.string().trim().max(60)).max(12), logoSize: z.number().int().min(50).max(200).default(100) })
    .default({ visible: true, names: ["PUMA", "Pandora", "Tiffany & Co.", "Nike"], logoSize: 100 }),
  /** Uploaded headshot as a small JPEG data URL; empty uses the built-in photo. */
  headshot: z.string().max(400_000).refine((v) => v === "" || v.startsWith("data:image/"), "Invalid photo").default(""),
  /** Social-sized rendition of the uploaded headshot; empty uses the built-in share image. */
  shareHeadshot: z.string().max(900_000).refine((v) => v === "" || v.startsWith("data:image/jpeg;base64,"), "Invalid share photo").default(""),
  /** Uploaded cover banner as a JPEG data URL; empty uses the built-in Tonric banner. */
  cover: z.string().max(900_000).refine((v) => v === "" || v.startsWith("data:image/"), "Invalid banner").default(""),
  sharing: z.object({ title: z.string().trim().min(1).max(120), description: z.string().trim().min(1).max(300) }),
  text: z.object({ en: contentSchema, zh: contentSchema }),
}).superRefine((d, ctx) => {
  if (d.linkedin.enabled && !d.linkedin.url) ctx.addIssue({ code: "custom", path: ["linkedin", "url"], message: "Add the LinkedIn link or turn it off" });
  if (d.whatsapp.enabled && !d.whatsapp.number) ctx.addIssue({ code: "custom", path: ["whatsapp", "number"], message: "Add the WhatsApp number or turn it off" });
  if (d.socials.facebook.enabled && !d.socials.facebook.url) ctx.addIssue({ code: "custom", path: ["socials", "facebook", "url"], message: "Add the Facebook link or turn it off" });
  if (d.socials.instagram.enabled && !d.socials.instagram.url) ctx.addIssue({ code: "custom", path: ["socials", "instagram", "url"], message: "Add the Instagram link or turn it off" });
  if (d.socials.linkedin.enabled && !d.socials.linkedin.url) ctx.addIssue({ code: "custom", path: ["socials", "linkedin", "url"], message: "Add the LinkedIn page link or turn it off" });
});

export type CardData = z.infer<typeof cardDataSchema>;
export type CardContent = CardData["text"]["en"];

export const phoneDigits = (phone: string) => "+" + phone.replace(/[^0-9]/g, "");
export const websiteLabel = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Published snapshot: hidden email/phone are removed unless the contact-file inclusion setting is on. */
export function toPublic(d: CardData): CardData {
  const keep = d.includeHiddenInContactFile;
  return {
    ...d,
    email: d.show.email || keep ? d.email : "",
    phone: d.show.phone || keep ? d.phone : "",
  };
}

/** Field labels of shown content that are filled in one language but empty in the other. */
export function missingTranslations(d: CardData): string[] {
  const out: string[] = [];
  const cmp = (label: string, en: string, zh: string) => {
    if (!!en.trim() !== !!zh.trim()) out.push(`${label} (${en.trim() ? "繁中" : "EN"} missing)`);
  };
  const { en, zh } = d.text;
  cmp("Title", en.title, zh.title);
  cmp("Location", en.location, zh.location);
  cmp("Short introduction", en.intro, zh.intro);
  cmp("Tagline", en.tagline, zh.tagline);
  cmp("Full bio", en.bio, zh.bio);
  if (d.referrals.visible) {
    cmp("Referral heading", en.ref.heading, zh.ref.heading);
    cmp("Product positioning", en.ref.positioning, zh.ref.positioning);
    cmp("Current referral ask", en.ref.ask, zh.ref.ask);
    en.ref.cues.forEach((c, i) => cmp(`Signal ${i + 1}`, c, zh.ref.cues[i] ?? ""));
    if (d.referrals.showNetwork)
      en.ref.network.forEach((n, i) => {
        cmp(`Partner ${i + 1} title`, n.title, zh.ref.network[i]?.title ?? "");
        cmp(`Partner ${i + 1} description`, n.body, zh.ref.network[i]?.body ?? "");
      });
    if (d.referrals.showIntro) cmp("Introduction message", en.ref.template, zh.ref.template);
  }
  return out;
}

/** WhatsApp setting may be a phone number (digits) or a full wa.me / whatsapp.com link. */
export function whatsappHref(v: string): string {
  return /^https:\/\//.test(v) ? v : `https://wa.me/${v}`;
}
export function whatsappLabel(v: string): string {
  return /^https:\/\//.test(v) ? v.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "") : "+" + v;
}
