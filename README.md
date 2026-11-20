# Eric Lam — Tonric digital business card

Public card at `/eric` (`/` redirects there). Private editor at `/admin/settings` (sign in at `/admin/login`).

## Setup checklist
1. **Backend:** Lovable Cloud is connected. The saved draft and published card live in `card_versions`.
2. **Owner account:** public sign-up is off. In Lovable go to **More → Users → Add user**, add `eric.lam@tonric.com` and choose *Send invitation*. The account links itself to the owner record (`card_owner`) automatically. To use a different admin email, ask Lovable to change the owner record.
3. **Login addresses:** sign-in links return to `/admin/login`. After publishing or adding a custom domain, make sure that domain is in **More → Users → Auth settings → Redirect URLs**.
4. **Access rules:** anyone can read only the published card. Only the owner can read or save the draft or publish it. Other signed-in accounts get "No access".
5. **First publish:** sign in, edit, check **Preview**, then **Publish Changes**. Until the first publish, the card shows the built-in content in `src/config/card.config.ts`.

## Other settings
- **Card address:** set `canonicalUrl` in `src/config/card.config.ts` (for example `"https://tonric.com/eric"`). Until it's set, Share and the QR use the current site address and the QR is labelled *Preview — do not print*.
- **Headshot / logo:** set in `src/config/card.config.ts`. Photo uploads aren't in the editor yet.
- **Brand colours:** the `--tonric-*` variables in `src/styles.css`.
