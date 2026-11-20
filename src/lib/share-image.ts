import type { CardData } from "@/lib/card-schema";

export const DEFAULT_SHARE_IMAGE_PATH = "/eric-share.jpg";
export const DYNAMIC_SHARE_IMAGE_PATH = "/api/public/share-headshot";

export type ShareImage = { path: string; width: number; height: number };

/** Uploaded photos use the public image endpoint; the built-in photo has a static social rendition. */
export function shareImageForCard(card: Pick<CardData, "headshot" | "shareHeadshot">): ShareImage {
  if (!card.headshot) return { path: DEFAULT_SHARE_IMAGE_PATH, width: 1200, height: 630 };
  // Older published cards predate the social rendition, but can still share their 400px headshot.
  return {
    path: DYNAMIC_SHARE_IMAGE_PATH,
    width: card.shareHeadshot ? 1200 : 400,
    height: card.shareHeadshot ? 630 : 400,
  };
}

/** Accept only the JPEG data URLs produced by the headshot uploader. */
export function decodeJpegDataUrl(value: string): Uint8Array | null {
  const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match?.[1]) return null;
  try {
    const binary = atob(match[1]);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return null;
  }
}
