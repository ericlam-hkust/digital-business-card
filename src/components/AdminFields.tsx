import { useState } from "react";
import type { Lang } from "@/lib/card-schema";

export function TextField({ label, value, onChange, error, area, type = "text" }: { label: string; value: string; onChange: (v: string) => void; error?: string | undefined; area?: boolean | undefined; type?: string }) {
  const cls = `mt-1 w-full rounded-xl border bg-background px-3 text-sm ${error ? "border-destructive" : "border-border"}`;
  return (
    <label className="block text-sm">
      <span className="text-muted-foreground">{label}</span>
      {area ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} aria-invalid={!!error} className={`${cls} py-2 leading-relaxed`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} className={`${cls} h-11`} />
      )}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function BiField({ label, area, values }: { label: string; area?: boolean | undefined; values: { l: Lang; value: string; onChange: (v: string) => void; error?: string | undefined }[] }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      {values.map((v) => (
        <TextField key={v.l} label={v.l === "en" ? "EN" : "繁中"} value={v.value} onChange={v.onChange} area={area} error={v.error} />
      ))}
    </fieldset>
  );
}

/** Resizes an image to the card headshot and a 1200 × 630 social-link preview. */
async function toHeadshots(file: File): Promise<{ headshot: string; shareHeadshot: string }> {
  const bmp = await createImageBitmap(file);
  const side = Math.min(bmp.width, bmp.height);
  const sx = (bmp.width - side) / 2;
  const sy = (bmp.height - side) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 400;
  canvas.getContext("2d")!.drawImage(bmp, sx, sy, side, side, 0, 0, 400, 400);

  const share = document.createElement("canvas");
  share.width = 1200;
  share.height = 630;
  const ctx = share.getContext("2d")!;
  const coverScale = Math.max(share.width / bmp.width, share.height / bmp.height);
  const sw = share.width / coverScale;
  const sh = share.height / coverScale;
  ctx.filter = "blur(34px)";
  ctx.drawImage(bmp, (bmp.width - sw) / 2, (bmp.height - sh) / 2, sw, sh, 0, 0, share.width, share.height);
  ctx.filter = "none";
  ctx.fillStyle = "rgba(0, 0, 0, 0.58)";
  ctx.fillRect(0, 0, share.width, share.height);
  ctx.drawImage(bmp, sx, sy, side, side, 285, 0, 630, 630);

  return { headshot: canvas.toDataURL("image/jpeg", 0.85), shareHeadshot: share.toDataURL("image/jpeg", 0.88) };
}

export function PhotoField({ value, fallback, onChange }: { value: string; fallback: string | null; onChange: (headshot: string, shareHeadshot: string) => void }) {
  const [error, setError] = useState("");
  const src = value || fallback;
  return (
    <div className="flex items-center gap-4">
      {src ? <img src={src} alt="Headshot" className="size-20 rounded-full object-cover ring-2 ring-primary/70" /> : <div className="size-20 rounded-full bg-secondary" />}
      <div className="space-y-2 text-sm">
        <label className="inline-block cursor-pointer rounded-lg border border-border px-3 py-1.5 font-medium hover:border-primary">
          Upload new headshot
          <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
            const f = e.target.files?.[0]; e.target.value = "";
            if (!f) return;
            if (!f.type.startsWith("image/")) return setError("Please choose an image file");
            try {
              setError("");
              const images = await toHeadshots(f);
              onChange(images.headshot, images.shareHeadshot);
            } catch { setError("Couldn't read that image — try a JPG or PNG"); }
          }} />
        </label>
        {value && <button type="button" className="ml-2 text-muted-foreground underline" onClick={() => onChange("", "")}>Use original photo</button>}
        <p className="text-muted-foreground">Square-cropped automatically and used for link previews. Publish to update the live card.</p>
        {error && <p className="text-destructive">{error}</p>}
      </div>
    </div>
  );
}

/** Resizes a banner to max 1600px wide JPEG data URL, keeping its shape. */
async function toCover(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const w = Math.min(1600, bmp.width), h = Math.round((bmp.height * w) / bmp.width);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export function CoverField({ value, fallback, onChange }: { value: string; fallback: string | null; onChange: (v: string) => void }) {
  const [error, setError] = useState("");
  const src = value || fallback;
  return (
    <div className="space-y-2 text-sm">
      {src ? <img src={src} alt="Banner" className="aspect-[1920/731] w-full rounded-xl object-cover" /> : <div className="aspect-[1920/731] w-full rounded-xl bg-secondary" />}
      <label className="inline-block cursor-pointer rounded-lg border border-border px-3 py-1.5 font-medium hover:border-primary">
        Upload new banner
        <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
          const f = e.target.files?.[0]; e.target.value = "";
          if (!f) return;
          if (!f.type.startsWith("image/")) return setError("Please choose an image file");
          try {
            setError("");
            const url = await toCover(f);
            if (url.length > 900_000) return setError("That image is too detailed — try a smaller file");
            onChange(url);
          } catch { setError("Couldn't read that image — try a JPG or PNG"); }
        }} />
      </label>
      {value && <button type="button" className="ml-2 text-muted-foreground underline" onClick={() => onChange("")}>Use default banner</button>}
      <p className="text-muted-foreground">Best at about 1920 × 730 (wide). Publish to update the live card.</p>
      {error && <p className="text-destructive">{error}</p>}
    </div>
  );
}
