# Eric Lam — Tonric digital business card

Public card at `/eric` (`/` redirects there). No login, database or tracking.

All profile data, links, translations and toggles live in **`src/config/card.config.ts`**.

- **Live public URL:** set `canonicalUrl` (e.g. `"https://tonric.com/eric"`). Until set, Share/QR use the current site address and the QR is labelled *Preview — do not print*.
- **Contact info:** edit `email`, `phone`, `phoneE164`, `website`, `company`, and the `text.en` / `text.zh` strings.
- **Optional links:** LinkedIn → set `linkedin.url` and `linkedin.enabled: true`. WhatsApp → confirm `whatsapp.number` (digits, with country code) and set `enabled: true`.
- **Headshot / logo:** upload a new image with `lovable-assets create --file <img> --filename <name> > src/assets/<name>.asset.json` and update the imports at the top of the config (set `headshotUrl: null` to show the "EL" monogram; `logoUrl: null` for a text wordmark). Favicon: `public/favicon.png`.
- **Brand colours:** replace the `--tonric-*` variables in `src/styles.css` (current values are temporary defaults, not official).
- **vCard:** built in `src/lib/vcard.ts` (vCard 3.0, UTF-8, CRLF), downloaded as `Eric-Lam-Tonric.vcf`.
