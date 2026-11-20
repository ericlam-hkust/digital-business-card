import { describe, expect, it } from "vitest";
import { decodeJpegDataUrl, shareImageForCard } from "@/lib/share-image";

describe("share image", () => {
  it("uses the 1200 by 630 rendition of the built-in headshot", () => {
    expect(shareImageForCard({ headshot: "", shareHeadshot: "" })).toEqual({
      path: "/eric-share.jpg",
      width: 1200,
      height: 630,
    });
  });

  it("uses the latest uploaded headshot's social rendition", () => {
    expect(shareImageForCard({ headshot: "data:image/jpeg;base64,cGhvdG8=", shareHeadshot: "data:image/jpeg;base64,c2hhcmU=" })).toEqual({
      path: "/api/public/share-headshot",
      width: 1200,
      height: 630,
    });
  });

  it("supports an uploaded headshot saved before social renditions existed", () => {
    expect(shareImageForCard({ headshot: "data:image/jpeg;base64,cGhvdG8=", shareHeadshot: "" })).toEqual({
      path: "/api/public/share-headshot",
      width: 400,
      height: 400,
    });
  });

  it("decodes only JPEG data URLs", () => {
    expect(Array.from(decodeJpegDataUrl("data:image/jpeg;base64,cGhvdG8=")!)).toEqual(Array.from(new TextEncoder().encode("photo")));
    expect(decodeJpegDataUrl("data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=")).toBeNull();
    expect(decodeJpegDataUrl("not an image")).toBeNull();
  });
});
