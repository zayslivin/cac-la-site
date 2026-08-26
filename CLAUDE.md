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
- **Events** (slugs): `the-pink-issue`, `studio-sets-social`, `the-creative-collective`
  (**CANCELLED** — pages kept as cancellation notices), `poolside-summer-social`,
  `artists-and-muses` (legacy redirect stubs → TCC), `modinochi-ii`.
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
- **Per-event accent override**: every accent in `styles.css` goes through `var(--gold)` /
  `--gold-bright` / `--gold-deep`, never a hardcoded hex. So an event that needs its own accent
  redefines just those 3 tokens in a page-level `<style>` block — it cascades to eyebrows,
  buttons, hovers and `.capacity`, and stays document-scoped. `the-pink-issue` does this
  (`#ee3d96` / `#ff6ab4` / `#c2186f`). Check contrast when swapping: the accent is used as
  button *background* behind ink text AND as text on both ink and cream.
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
  `file://` instead** (relative `../../` paths resolve fine). Add `.visible` to `.fade-in`
  els before screenshotting (or inject `.fade-in{opacity:1!important;transform:none!important}`).
  Browser binary differs by machine: on **Zay's Mac** it's
  `~/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-x64/chrome-headless-shell`
  (drive it directly: `--headless --hide-scrollbars --window-size=W,H --virtual-time-budget=8000
  --screenshot=out.png file://...`); in the **cloud sandbox** it's `/opt/pw-browsers/chromium`
  with playwright-core at `/opt/node22/lib/node_modules/playwright/node_modules/playwright-core`.
  A temp copy of the page must live in the page's own dir or relative asset paths break.
- **Images**: optimize before committing (progressive JPEG, ~1320px wide, quality ~82,
  via Pillow). Keep an event's `flyer.jpg` even if not shown on the detail page — it's the
  `og:image`/schema share image. Split multi-photo collages by detecting near-white seam rows.
- Don't put the model identifier in commits/PRs. End commit messages with the Co-Authored-By
  + Claude-Session trailers; PR bodies with the Claude Code footer.

## Change log
### 2026-08-26 — The Pink Issue (Sept 19) added
- New event `events/the-pink-issue/` + `checkout/` + `confirmed/`, modeled on the SSS page.
  Sat **Sept 19, 1–4 PM**, LA multi-set studio, **35 spots**, photographers **$95** / models **$55**.
  Barbie World / Ken Core / creative playground theme.
- **Pink accent scoped to this event only** via the 3-token override (see Design system above).
  Applied to all three funnel pages so checkout matches the flyer; the events *listing* card
  deliberately stays gold so the three cards read as one set.
- Hero: `.event-detail-hero::before` scrim deepened on this page (mid-stop 0.3 → 0.55) because
  the flyer crop is bright pink edge-to-edge, unlike the dark venue photos the default was tuned
  for; hero eyebrow forced to `--cream` (pink-on-pink was illegible).
- Images from the flyer only (`IMG_7724.JPEG`): `flyer.jpg` (og:image + The Cover section),
  `hero.jpg` (landscape crop 330,902→1310,1424 — the one text-free band), `model.jpg`
  (portrait crop 400,648→900,1420). **When Nat sends real studio/set photos, replace The Cover
  section with a `.sets-gallery` masonry like SSS.**
- "The Cover" section intentionally *does* show the flyer, unlike SSS which removed its flyer
  section as redundant — here the event is literally an "issue" and the flyer is the only asset.
- **Repointed the next-event target site-wide** to `the-pink-issue` (nav RSVP, footer RSVP,
  homepage hero + text links, gallery's 11 "next room" CTAs, and the retired poolside/modinochi
  funnels). Left alone: `events/studio-sets-social/index.html` (an event page's own nav points at
  its own checkout) and the SSS card's RSVP button on the events listing.
- **Stripe links created + wired** (live mode) — photographer $95 `plink_1U8lGWFqKR455jnLhdgn8wTE`,
  model $55 `plink_1U8lGiFqKR455jnLO7MvEJwc`, both redirecting to this event's `confirmed/`.
  Cloned from the SSS link config (adjustable qty 1–10, IG handle + email + guest-handles fields,
  promo codes on, `tax_code txcd_20030000`). Verified rendering live at $95 / $55.
- **Open placeholder** — grep `REPLACE_WITH`: the IG group-chat link in `confirmed/` (the same
  token also sits in the Make email body; fill both, then activate the scenario).
- **Make**: the Creative Collective scenario `5540298` was repurposed into
  "The Pink Issue — payment confirmation email" (SSS direct-SMTP pattern). Left **inactive**
  until the group-chat link is filled in. Pre-repurpose config is backed up at
  `../make-blueprints/creative-collective-5540298-RESTORE-NOTES.md`.
- The Creative Collective was cancelled separately in #11; its 4 Stripe links are deactivated
  by design. Nothing in this change touches TCC.

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

### 2026-08-24 — The Creative Collective CANCELLED
- **TCC (Oct 25, Thatcher Manor) is cancelled.** Nat and Zay are no longer working together.
  Reason given publicly is "unforeseen circumstances" — the split is not mentioned anywhere
  customer-facing.
- **Site — soft-cancel in place** (URLs kept alive; ~8 people had bought tickets and hold the
  link, and the 4 `events/artists-and-muses/*` redirect stubs point into this tree):
  - `events/index.html` — TCC listing card removed; only the SSS card remains.
  - `events/the-creative-collective/index.html` — rewritten as a cancellation notice (static
    `hero.jpg` hero replacing the `hero.mp4` video, cream notice section, gold CTA band to
    SSS). JSON-LD `eventStatus` → `EventCancelled`, `offers` block dropped, `noindex` added.
  - `checkout/` — all 4 `buy.stripe.com` buttons, tier cards, spot counters and order summary
    removed; now a "RSVPs closed / you're being refunded" notice. Partner CTA kept.
  - `casting/` — Google Form iframe removed; casting closed notice.
  - `confirmed/` — "You're in" replaced with the cancellation + refund message.
  - Every RSVP/nav/footer link in the tree repointed to `studio-sets-social/checkout/`.
- **Stripe** (`acct_1FwjCqFqKR455jnL`): 4 TCC payment links deactivated —
  `plink_1TnnLP…` ($100 creatives EB), `plink_1TnnPf…` ($150 creatives), `plink_1TnnSG…`
  ($50 model EB), `plink_1TnnVi…` ($100 model). 13 payments refunded, $602.50 total (8 real
  customers + 5 of Zay's own $0.50 promo test charges). **The TCC links redirect to
  `events/artists-and-muses/confirmed/`** — that legacy slug is how TCC purchases are
  identified in Stripe.
- **Beehiiv**: 4 scheduled TCC reminder emails (Sep 25 → Oct 23, targeted at segment
  `seg_840fb10e…`) had to be unscheduled **by hand in the UI** — the MCP `edit_post` tool
  exposes no status/schedule field, so unscheduling is not automatable. Cancellation email
  sent to all subscribers.
- **Gotcha**: the tag is `the-creative-collective-rsvp` (9 subs) but segment
  `seg_840fb10e…` is stale/paused at 8 and its description wrongly says "Artists & Muses".
- **Still open**: the "Curated by @natguerrero__" credit remains in the footer site-wide —
  decide whether to remove it everywhere now that the partnership has ended.
