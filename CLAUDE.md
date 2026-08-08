# Create & Connect LA (CCLA) — Project Memory

Working notes for this repo so past context carries across sessions. Keep this
file updated when the site's structure, design system, or conventions change.

## What this is
- **Create & Connect LA** — a curated events brand for LA creatives (photographers,
  models, videographers, brands). Curated by **@natguerrero__** (Nat). Owner/dev
  contact: Zay.
- **Static HTML site** (no build system, no framework). Plain `.html` + one global
  `styles.css`. Vanilla JS inline for menu/fade-ins.
- **Hosted on GitHub Pages**, custom domain **createconnectla.com** (see `CNAME`).
  Repo: `zayslivin/cac-la-site`.
- Social handle: **@createconnect.la** ; email **hello@createconnectla.com**.

## Deploy / workflow
- **Deploys from `main`** via the built-in `pages-build-deployment` workflow. There
  are **no PR-level CI checks** — the only workflow runs on `main` after merge.
- **"Push it live" = merge the PR into `main`.** Pages redeploys in ~1 min.
- Feature branch for this line of work: `claude/studio-sets-event-videos-sir9gb`.
  If its PR is already merged, restart the branch from latest `main` for follow-ups
  (a merged PR can't be reused; open a fresh PR).
- PRs are opened as **draft** first, then marked ready + squash-merged when the user
  says to push live. No PR template in this repo.

## Repo structure
```
/                     index.html (home), styles.css, CNAME, favicon.svg, og-image
/about /contact /brands /gallery /guide /privacy /terms /testimonials /venues
/events/              index.html = event listing (cards)
/events/<slug>/       index.html (detail) + checkout/ + confirmed/ (+ casting/ for some)
/images/events/<slug>/  per-event imagery
/images/gallery/<venue>/ past-event galleries
/_templates/          reusable HTML section snippets (NOT published — "_" ignored by Pages/Jekyll)
```
- **Events** (slugs): `studio-sets-social`, `the-creative-collective`,
  `poolside-summer-social`, `artists-and-muses`, `modinochi-ii`.
- **Nav links** (top bar): Events · Gallery · Testimonials · Brands · About · Contact · RSVP.

## Design system (styles.css)
- **Color tokens** (`:root`):
  `--ink #0a0a0a`, `--ink-soft #1a1a1a`, `--cream #f5efe4`, `--cream-soft #ebe3d4`,
  `--gold #c9a662`, `--gold-bright #d4b06c`, `--gold-deep #a08148`, `--neutral #8b7a6a`,
  `--hairline` / `--hairline-dark`.
- **Fonts**: `Inter` (body/UI, weight 300 default), `Cormorant Garamond` (serif
  headings/`body-serif`), `Pinyon Script` (script accents like "los angeles").
- **Containers**: `.container` (1400), `.container-narrow` (1100), `.container-tight` (760).
- **Buttons** (`.btn-pill`):
  - default = **gold** bg + ink text (hover → transparent + gold text).
  - `.btn-pill.ink` = dark bg + cream text (used for secondary CTAs like "Inquire to partner").
  - `.btn-pill.ghost`, `.btn-pill.lg` (bigger), `.btn-pill.block` (full width).
  - Buttons uppercase their text via CSS. Include `<span class="arrow">→</span>` for the arrow.
- **Sections**: `.event-section` = dark (ink) bg; add `.cream` for cream bg; `.tight` for less padding.
- **Gallery masonry**: `.gallery-grid` (4 cols desktop / 3 tablet / 2 mobile, 220px rows) +
  `.gallery-cell` (background-image, `data-label` shows on hover in gold) + `.gallery-cell.tall`
  (spans 2 rows). For a gap-free rectangle the cell count + tall spans must total a multiple
  of the column count (e.g. 11 cells + 4 tall = 15 units → leaves 1 gap; unavoidable at 4 cols).
- **Reveal-on-scroll**: add class `fade-in`; an IntersectionObserver adds `.visible`.
- Common building blocks: `.eyebrow` (gold label), `.section-title`, `.lede`, `.body-serif`,
  `.what-to-expect` (numbered `.expect-item` grid), `.faq`/`.faq-item`, `.cta-band` (final CTA).

## Event detail page anatomy (typical order)
Hero (bg image) → info strip (When/Where/Price/Spots) → The Concept/Vibe → visual section
(gallery or venue photos) → What to Expect / The Experience (numbered) → For Models callout →
**Partner With Us** (brands/sponsors/vendors) → FAQ ("Before You RSVP") → final `.cta-band` → footer.
- Each page has JSON-LD `Event` schema in `<head>` and OG/Twitter meta (og:image = the flyer).
- Checkout links go to `https://createconnectla.com/events/<slug>/checkout/` (target=_blank).

## Reusable templates
- **`_templates/event-partner-section.html`** — "Partner With Us" (Brands, sponsors &
  vendors → *Inquire to partner*) section. Copy into a new event page near the bottom
  (after For Models, before FAQ). Replace `[EVENT NAME]`; the link `../../brands/inquire/`
  assumes the page is 2 levels deep (`events/<slug>/`).

## Conventions / gotchas
- **Verify visual changes** by rendering with headless Chromium. The background HTTP
  server gets reaped between Bash calls / can trip the sandbox — **load pages via
  `file://` instead** (relative `../../` paths resolve fine). Playwright core lives at
  `/opt/node22/lib/node_modules/playwright/node_modules/playwright-core`; Chromium at
  `/opt/pw-browsers/chromium`. Add `.visible` to `.fade-in` els before screenshotting.
- **Images**: optimize before committing (progressive JPEG, ~1320px wide, quality ~82,
  via Pillow). Keep an event's `flyer.jpg` even if not shown on the detail page — it's the
  `og:image`/schema share image. Split multi-photo collages by detecting near-white seam rows.
- Don't put the model identifier in commits/PRs. End commit messages with the Co-Authored-By
  + Claude-Session trailers; PR bodies with the Claude Code footer.

## Claude Code skills
- **`compact`** (`.claude/skills/compact/`) — say "COMPACT" to get a 5–7
  bullet summary of the current session, formatted to paste into a new chat.
- **`stop-slop`** (`.claude/skills/stop-slop/`) — triggers when drafting
  user-facing copy (event descriptions, captions, RSVP text) to strip AI
  writing tells and match the site's direct, specific voice.

## Change log
### 2026-07-28 — Studio Sets Social (SSS) + The Creative Collective (TCC) updates
- SSS page (`events/studio-sets-social/`): added Nat's **12 studio-set photos** throughout;
  new **"The Sets" masonry gallery** (11 room sets, labeled) replacing the repeated
  `sets-grid.jpg`; Concept teaser duo + Models lightbox portrait. Two source files were
  3-panel vertical collages, split into individual set photos. (PR #5, merged.)
- SSS follow-ups (PR #6, merged): removed the standalone **flyer section** (redundant with
  the events page; flyer kept as og:image); made **"RSVP for Models"** button gold; added
  3 mid-page gold CTAs — **Start Creating** (Concept), **Start Connecting** (What to Expect),
  **Secure a Spot** (The Sets); simplified RSVP labels ("RSVP", "RSVP for Models",
  "Studio Sets Social"); added the **Partner With Us** section + saved its template.
- Events listing card (`events/index.html`, SSS card): price line →
  "Photographers $95 · Models $55 · 30 spots"; card button → just "RSVP".
- TCC page (`events/the-creative-collective/`): added 4 gold CTAs by section — **Start
  Creating** (The Vibe), **Start Connecting** (The Experience), **Secure a Spot** (The Setting
  venue photos), **The Creative Collective** (Dress Code & Expectations).
- SSS pricing: **Photographers/creators $95, Models $55, 30 spots**, Sat Aug 29, 1–4 PM, LA.
  TCC: Thatcher Manor, Gavilan Hills (Colonial estate, 250+ guests), 6 hours, red-carpet.
