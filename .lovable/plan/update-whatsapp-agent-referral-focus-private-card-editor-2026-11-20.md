# Update: WhatsApp-agent referral focus + private card editor

## Review of the request
The request holds together and I can build it as written. Things to know:
- It needs Lovable Cloud, which gives the project a database and sign-in. The card has neither yet.
- Sign-in uses an emailed link with public sign-up turned off. You'll give me the email address that should be the admin login; it doesn't have to be the work email.
- The live card keeps a built-in copy of its content. It switches to the saved version only after that version is checked, so it never shows an empty card.
- Photo uploads stay out of the first version. The current headshot and the "EL" fallback stay as they are, so there are no private images to protect yet.
- No "Book a Demo" or "Join the Pilot" button, and no WhatsApp agent or CRM features.

## 1. New referral section (public card)
- Title stays "Referrals & Partnerships" / 「商業引薦與合作」, below the bio.
- The old order, invoice and shipment re-entry wording is replaced with your WhatsApp agent and CRM copy: product positioning (shown as in development), the current referral ask in the lime box, and the three new signals.
- The partner network panel shows the three new categories (upstream, midstream, downstream).
- The introduction panel gets the new message, Copy Introduction in the chosen language, and Email Eric.
- The bio, LinkedIn link, contact buttons, QR, Save Contact and card address stay as they are.

## 2. Private settings
- Two admin pages, `/admin/login` and `/admin/settings`. They're hidden from search engines and not linked from the card.
- The editor has four sections:
  - **Profile:** EN and 繁中 fields for name, company, title, location, tagline, short intro and full bio.
  - **Contact & links:** email, phone, website, LinkedIn and WhatsApp, each with a show/hide switch.
  - **Referrals:** all text in both languages, plus switches to hide the section or each panel.
  - **Sharing:** link-preview title and description. The card address is shown but can't be edited.
- Field checks: valid email, international phone number, https links only. You'll see warnings when a shown item is missing a translation.
- **Save Draft** stores changes privately.
- **Preview** shows the draft with the real card design, a "Draft" banner and the language toggle.
- **Publish Changes** asks you to confirm, checks everything, then replaces the live version in one step. If something fails, the live card stays as it was.
- You'll see an unsaved-changes marker and the last published time, and get a warning if you leave with unsaved edits.
- Hidden phone or email numbers are also left out of the contact file and the public data.
- Sign Out is included. If your session expires, you're sent back to log in with a clear message.

## Technical details
- Tables:
  - `card_versions(kind 'draft'|'published', data jsonb, updated_at)`, one row of each kind.
  - `card_owner(user_id)`, which records the single owner.
- Access rules: anyone can read only the published row, and only the owner can read or write the draft. The owner check uses a security-definer `is_card_owner()` function.
- Publishing runs as a server function on the server. It re-checks that the caller is the owner, validates the draft with zod, and copies the draft to the published row in one transaction.
- The public `/eric` loader reads the published row through a public server function. It falls back to the built-in copy if the backend is unavailable or the row is invalid. The same data drives the page, the contact file and the buttons.
- The setup migration seeds both rows from the current card plus the new referral copy.
- `card.config.ts` stays as the default and fallback content, and a shared schema type defines the card data.
- Admin pages sit under `_authenticated`, with `noindex` on both.
- Tests:
  - the new referral copy in EN and 繁中
  - copied introduction language
  - hidden phone and email left out of the contact file
  - fallback when no published data exists
  - validation rejects http links
- Access check: run real requests as a visitor, a signed-in non-owner and the owner.

## Setup checklist (in the closing report)
1. Lovable Cloud is turned on.
2. Email-link sign-in is on and public sign-up is off.
3. The owner account is created for your chosen email and added to the owner list.
4. Login return addresses are set.
5. Access rules are confirmed.
6. Log in, edit, preview and publish your first change.
