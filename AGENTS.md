<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Editable card content follows `src/lib/card-schema.ts`. Built-in defaults and fallback content are in `src/config/card.config.ts`. At runtime the public card reads only the published database row and falls back to the defaults when that row is missing or invalid, so the card never renders empty.
- The card owner is the email in `public.card_owner`. Owner checks, saving the draft and publishing happen in security-definer database functions; the `/admin` route guard is only for user experience.
- The published snapshot leaves out hidden email/phone (`toPublic`), because anyone can read the published row.
- QR codes are generated locally with the `qrcode` package; never call third-party QR services.
- Brand colours are `--tonric-*` CSS variables in `src/styles.css`; the app always renders in dark mode.
- Past-employer logos are local SVGs in `public/brands/`, matched to company names by `findBrand` in `src/lib/brands.ts`; unknown names show as text. Why: no third-party logo services, and settings only store names.

- Cards are per person, keyed by a slug (`public.cards`); public page is `/$slug`, card rows are (slug, kind). Every editor in `card_owner` can edit every card, via `save_card_draft_for`/`publish_card_for`. Why: co-founders manage each other's cards from one settings page.
