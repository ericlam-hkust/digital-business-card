import { useEffect, useRef, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { Download, Globe, Linkedin, Mail, MapPin, MessageCircle, Phone, QrCode, Share2, Copy, X, ChevronRight } from "lucide-react";
import { cardConfig, getCardUrl, uiText, type Lang, type UiText } from "@/config/card.config";
import { phoneDigits, websiteLabel, type CardData } from "@/lib/card-schema";
import { downloadVCard } from "@/lib/vcard";
import { AboutSection, ReferralSection } from "@/components/ProfileSections";

/** The business card itself; used by the public page and the private draft preview. */
const LANG_KEY = "card-lang";

export function CardView({ card, banner }: { card: CardData; banner?: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [toast, setToast] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const qrBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "zh") setLang(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant-HK" : "en";
  }, [lang]);

  const t = uiText[lang];
  const content = card.text[lang];
  const { url, isPreview } = getCardUrl(origin);
  const c = cardConfig;
  const phoneE164 = phoneDigits(card.phone);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      flash(t.linkCopied);
      setManualUrl(null);
    } catch {
      setManualUrl(url);
    }
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: card.sharing.title, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    await copyLink();
  };
  const toggleLang = () => {
    const next = lang === "en" ? "zh" : "en";
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
  };

  const rows = [
    { show: card.show.email && !!card.email, href: `mailto:${card.email}`, icon: Mail, label: t.email, value: card.email },
    { show: card.show.phone && !!card.phone, href: `tel:${phoneE164}`, icon: Phone, label: t.call, value: card.phone },
    { show: card.show.website && !!card.website, href: card.website, icon: Globe, label: t.website, value: websiteLabel(card.website), ext: true },
    { show: card.linkedin.enabled && !!card.linkedin.url, href: card.linkedin.url, icon: Linkedin, label: t.linkedin, value: "LinkedIn", ext: true },
    { show: card.whatsapp.enabled && !!card.whatsapp.number, href: `https://wa.me/${card.whatsapp.number}`, icon: MessageCircle, label: t.whatsapp, value: "+" + card.whatsapp.number, ext: true },
  ].filter((r) => r.show);

  return (
    <div className="min-h-dvh bg-background px-4 py-4 sm:py-10">
      <main className="mx-auto w-full max-w-[420px]">
        {banner}
        <header className="flex items-center justify-between py-2">
          {c.logoUrl ? (
            <img src={c.logoUrl} alt="Tonric" className="h-6 w-auto" />
          ) : (
            <span className="text-lg font-semibold tracking-tight">tonric</span>
          )}
          <button
            onClick={toggleLang}
            aria-label={t.langToggle}
            className="flex rounded-full border border-border p-0.5 text-xs font-medium"
          >
            <span className={`rounded-full px-2.5 py-1 ${lang === "en" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>EN</span>
            <span className={`rounded-full px-2.5 py-1 ${lang === "zh" ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>繁中</span>
          </button>
        </header>

        <section className="mt-3 rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-4">
            {c.headshotUrl ? (
              <img src={c.headshotUrl} alt={t.photoAlt} className="size-20 shrink-0 rounded-full object-cover ring-2 ring-primary/70 ring-offset-4 ring-offset-card sm:size-24" />
            ) : (
              <div className="grid size-20 shrink-0 place-items-center rounded-full bg-secondary text-2xl font-semibold text-primary">{c.initials}</div>
            )}
            <div className="min-w-0">
              <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight">{card.name.full}</h1>
              <p className="mt-1 text-sm text-foreground/90">{content.title}</p>
              <p className="text-sm text-muted-foreground">
                {card.company} {card.companyZh && <span lang="zh-Hant" className="whitespace-nowrap">({card.companyZh})</span>}
              </p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-primary" aria-hidden /> {content.location}
          </p>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/90">{content.intro}</p>

          {rows.length > 0 && (
            <nav aria-label="Quick contact" className="mt-4 flex justify-center gap-3">
              {rows.map((r) => (
                <a key={r.label} href={r.href} {...(r.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} aria-label={r.label} title={r.label}
                  className="grid size-12 place-items-center rounded-full border border-border bg-secondary text-primary transition hover:border-primary/60 active:scale-95">
                  <r.icon className="size-5" aria-hidden />
                </a>
              ))}
            </nav>
          )}

          <button
            onClick={() => downloadVCard(card)}
            className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground transition hover:brightness-105 active:scale-[0.99]"
          >
            <Download className="size-5" aria-hidden /> {t.save}
          </button>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button onClick={share} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary text-sm font-medium hover:border-primary/50">
              <Share2 className="size-4" aria-hidden /> {t.share}
            </button>
            <button ref={qrBtn} onClick={() => setQrOpen(true)} aria-haspopup="dialog" className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary text-sm font-medium hover:border-primary/50">
              <QrCode className="size-4" aria-hidden /> {t.showQr}
            </button>
          </div>
          {manualUrl && <ManualCopy label={t.copyManual} url={manualUrl} />}

          </section>

        <AboutSection card={card} lang={lang} ui={t} />

        <section className="mt-4 rounded-3xl border border-border bg-card px-5 py-2 sm:px-6">
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.label}>
                <a
                  href={r.href}
                  {...(r.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={`${r.label}: ${r.value}`}
                  className="flex min-h-14 items-center gap-3 rounded-lg px-1 py-2.5 hover:bg-secondary/60"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><r.icon className="size-4" aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-muted-foreground">{r.label}</span>
                    <span className="block truncate text-sm">{r.value}</span>
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <ReferralSection card={card} lang={lang} ui={t} onCopied={flash} />

        {content.tagline && <p className="mt-6 text-center text-xs text-muted-foreground">{content.tagline}</p>}
      </main>

      {qrOpen && (
        <QrDialog
          url={url}
          isPreview={isPreview}
          t={t}
          onCopy={copyLink}
          onClose={() => {
            setQrOpen(false);
            requestAnimationFrame(() => qrBtn.current?.focus());
          }}
        />
      )}

      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center">
        {toast && <span className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">{toast}</span>}
      </div>
    </div>
  );
}

function ManualCopy({ label, url }: { label: string; url: string }) {
  return (
    <label className="mt-3 block text-xs text-muted-foreground">
      {label}
      <input readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground" />
    </label>
  );
}

type T = UiText;

function QrDialog({ url, isPreview, t, onCopy, onClose }: { url: string; isPreview: boolean; t: T; onCopy: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    d?.addEventListener("cancel", onCancel);
    return () => {
      d?.removeEventListener("cancel", onCancel);
      d?.close();
    };
  }, [onClose]);

  useEffect(() => {
    QRCode.toString(url, { type: "svg", margin: 4, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#ffffff" } }).then(setSvg);
  }, [url]);

  const download = async () => {
    const data = await QRCode.toDataURL(url, { width: 1200, margin: 4, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#ffffff" } });
    const a = document.createElement("a");
    a.href = data;
    a.download = isPreview ? "Eric-Lam-Tonric-QR-PREVIEW.png" : "Eric-Lam-Tonric-QR.png";
    a.click();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="qr-title"
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(92vw,380px)] rounded-3xl border border-border bg-card p-5 text-foreground backdrop:bg-background/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <h2 id="qr-title" className="text-base font-semibold">{t.qrTitle}</h2>
        <button onClick={onClose} aria-label={t.close} className="grid size-9 place-items-center rounded-full hover:bg-secondary">
          <X className="size-5" aria-hidden />
        </button>
      </div>
      {isPreview && <p className="mt-3 rounded-lg border border-primary/40 px-3 py-2 text-xs text-primary">{t.preview}</p>}
      <div className="mt-4 overflow-hidden rounded-2xl bg-qr-bg" role="img" aria-label={`QR code: ${url}`}>
        <div className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <p className="mt-3 break-all text-center text-xs text-muted-foreground">{url}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={onCopy} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-secondary text-sm font-medium">
          <Copy className="size-4" aria-hidden /> {t.copyLink}
        </button>
        <button onClick={download} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
          <Download className="size-4" aria-hidden /> {t.downloadQr}
        </button>
      </div>
    </dialog>
  );
}
