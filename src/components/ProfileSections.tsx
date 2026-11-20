import { useId, useState, type ReactNode } from "react";
import { ChevronDown, Copy, ExternalLink, Mail } from "lucide-react";
import { buildIntroduction, cardConfig, type Lang } from "@/config/card.config";

type T = (typeof cardConfig.text)[Lang];

function Panel({ label, openLabel, children }: { label: string; openLabel?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="mt-4 rounded-2xl border border-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center justify-between gap-2 rounded-2xl px-4 text-left text-sm font-medium hover:bg-secondary/60"
      >
        {open && openLabel ? openLabel : label}
        <ChevronDown className={`size-4 shrink-0 text-primary transition ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <div id={id} hidden={!open} className="px-4 pb-4">
        {children}
      </div>
    </div>
  );
}

export function AboutSection({ t }: { t: T }) {
  const a = t.about;
  return (
    <section aria-labelledby="about-h" className="mt-4 rounded-3xl border border-border bg-card p-5 sm:p-6">
      <h2 id="about-h" className="text-lg font-semibold">{a.heading}</h2>
      <Panel label={a.readBio} openLabel={a.hideBio}>
        {a.bio.map((p) => (
          <p key={p} className="mt-2 text-sm leading-relaxed text-foreground/90">{p}</p>
        ))}
        <a
          href={cardConfig.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {a.linkedinLink} <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </Panel>
    </section>
  );
}

export function ReferralSection({ t, lang, onCopied }: { t: T; lang: Lang; onCopied: (msg: string) => void }) {
  const r = t.ref;
  const [manual, setManual] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildIntroduction(lang));
      onCopied(r.introCopied);
      setManual(false);
    } catch {
      setManual(true);
    }
  };
  const mailto = `mailto:${cardConfig.email}?subject=${encodeURIComponent(r.emailSubject)}`;
  return (
    <section aria-labelledby="ref-h" className="mt-4 rounded-3xl border border-border bg-card p-5 sm:p-6">
      <h2 id="ref-h" className="text-lg font-semibold">{r.heading}</h2>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{r.intro}</p>

      <div className="mt-4 rounded-2xl border border-primary/60 bg-primary/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{r.askLabel}</p>
        <p className="mt-1.5 text-[0.95rem] font-medium leading-relaxed">{r.ask}</p>
      </div>

      <h3 className="mt-5 text-sm font-semibold">{r.cuesLabel}</h3>
      <ol className="mt-2 space-y-2">
        {r.cues.map((cue, i) => (
          <li key={cue} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">{i + 1}</span>
            <span>{cue}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{r.cuesNote}</p>

      <Panel label={r.networkLabel}>
        <ul className="space-y-3">
          {r.network.map((n) => (
            <li key={n.title}>
              <p className="text-sm font-medium">{n.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel label={r.introLabel}>
        <p className="whitespace-pre-line rounded-xl bg-secondary p-3 text-sm leading-relaxed">{buildIntroduction(lang)}</p>
        <p className="mt-2 text-xs text-muted-foreground">{r.consent}</p>
        {manual && (
          <textarea readOnly value={buildIntroduction(lang)} onFocus={(e) => e.currentTarget.select()} className="mt-2 h-28 w-full rounded-lg border border-border bg-background p-2 text-sm" />
        )}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={copy} className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-primary/60 bg-secondary px-2 text-sm font-medium">
            <Copy className="size-4" aria-hidden /> {r.copyIntro}
          </button>
          <a href={mailto} className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-2 text-sm font-medium hover:border-primary/50">
            <Mail className="size-4" aria-hidden /> {r.emailEric}
          </a>
        </div>
      </Panel>
    </section>
  );
}
