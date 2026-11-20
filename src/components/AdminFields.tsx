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
