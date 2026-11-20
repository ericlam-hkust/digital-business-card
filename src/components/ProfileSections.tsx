import { useId, useState, type ReactNode } from "react";
import { ChevronDown, Copy, ExternalLink, Mail } from "lucide-react";
import { buildIntroduction, type Lang, type UiText } from "@/config/card.config";
import type { CardData } from "@/lib/card-schema";
import { findBrand, onlineLogoUrl } from "@/lib/brands";

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

export function AboutSection({ card, lang, ui, embedded }: { card: CardData; lang: Lang; ui: UiText; embedded?: boolean }) {
  const bio = card.text[lang].bio.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (!bio.length) return null;
  return (
    <section aria-labelledby="about-h" className={embedded ? "mt-5 border-t border-border pt-4" : "mt-4 rounded-3xl border border-border bg-card p-5 sm:p-6"}>
      <h2 id="about-h" className="text-lg font-semibold">{ui.aboutHeading}</h2>
      <div className="mt-2">
        {bio.map((p) => (
          <p key={p} className="mt-2 text-sm leading-relaxed text-foreground/90">{p}</p>
        ))}
      </div>
      <BrandLogos card={card} ui={ui} />
    </section>
  );
}

function BrandLogos({ card, ui }: { card: CardData; ui: UiText }) {
  const names = card.brands.visible ? card.brands.names.map((n) => n.trim()).filter(Boolean) : [];
  if (!names.length) return null;
  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{ui.brandsLabel}</h3>
      <ul className="mt-2 grid grid-cols-3 gap-2">
        {names.map((n) => {
          const b = findBrand(n);
          return (
            <li key={n} className="flex h-20 items-center justify-center rounded-xl bg-brand-tile px-2" title={b?.name ?? n}>
              {b ? (
                <img src={b.logo} alt={b.name} loading="lazy" className="max-h-10 max-w-full object-contain" />
              ) : (
                <OnlineLogo name={n} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function OnlineLogo({ name }: { name: string }) {
  const url = onlineLogoUrl(name);
  const [failed, setFailed] = useState(false);
  if (!url || failed) return <span className="text-center text-xs font-semibold leading-tight text-brand-tile-foreground">{name}</span>;
  return <img src={url} alt={name} loading="lazy" onError={() => setFailed(true)} className="h-14 w-auto max-w-full object-contain" />;
}

export function ReferralSection({ card, lang, ui, onCopied }: { card: CardData; lang: Lang; ui: UiText; onCopied: (msg: string) => void }) {
  const r = card.text[lang].ref;
  const [manual, setManual] = useState(false);
  if (!card.referrals.visible) return null;
  const intro = buildIntroduction(card, lang);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(intro);
      onCopied(ui.introCopied);
      setManual(false);
    } catch {
      setManual(true);
    }
  };
  const mailto = card.email ? `mailto:${card.email}?subject=${encodeURIComponent(ui.emailSubject)}` : null;
  const cues = r.cues.filter((c) => c.trim());
  return (
    <section aria-labelledby="ref-h" className="mt-4 rounded-3xl border border-border bg-card p-5 sm:p-6">
      <h2 id="ref-h" className="text-lg font-semibold">{r.heading}</h2>
      {r.positioning && (
        <div className="mt-2">
          <p className="text-sm leading-relaxed text-foreground/90">{r.positioning}</p>
        </div>
      )}

      {r.ask && (
        <div className="mt-4 rounded-2xl border border-primary/60 bg-primary/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{ui.askLabel}</p>
          <p className="mt-1.5 text-[0.95rem] font-medium leading-relaxed">{r.ask}</p>
        </div>
      )}

      {cues.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-semibold">{ui.cuesLabel}</h3>
          <ol className="mt-2 space-y-2">
            {cues.map((cue, i) => (
              <li key={cue} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">{i + 1}</span>
                <span>{cue}</span>
              </li>
            ))}
          </ol>
        </>
      )}

      {card.referrals.showNetwork && (
        <Panel label={ui.networkLabel}>
          <ul className="space-y-3">
            {r.network.filter((n) => n.title || n.body).map((n) => (
              <li key={n.title}>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {card.referrals.showIntro && r.template && (
        <Panel label={ui.introLabel}>
          <p className="whitespace-pre-line rounded-xl bg-secondary p-3 text-sm leading-relaxed">{intro}</p>
          <p className="mt-2 text-xs text-muted-foreground">{ui.consent}</p>
          {manual && (
            <textarea readOnly value={intro} onFocus={(e) => e.currentTarget.select()} className="mt-2 h-28 w-full rounded-lg border border-border bg-background p-2 text-sm" />
          )}
          <div className={`mt-3 grid gap-3 ${mailto ? "grid-cols-2" : "grid-cols-1"}`}>
            <button type="button" onClick={copy} className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-primary/60 bg-secondary px-2 text-sm font-medium">
              <Copy className="size-4" aria-hidden /> {ui.copyIntro}
            </button>
            {mailto && (
              <a href={mailto} className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-2 text-sm font-medium hover:border-primary/50">
                <Mail className="size-4" aria-hidden /> {ui.emailEric}
              </a>
            )}
          </div>
        </Panel>
      )}
    </section>
  );
}
