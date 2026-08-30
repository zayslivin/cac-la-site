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
/                     index.html (home), styles.css, motion.js, CNAME, favicon.svg, og-image
/about /contact /brands /gallery /guide /privacy /terms /testimonials /venues
/events/              index.html = event listing (cards)
/events/<slug>/       index.html (detail) + checkout/ + confirmed/ (+ casting/ for some)
/images/events/<slug>/  per-event imagery
/images/gallery/<venue>/ past-event galleries
/_templates/          reusable HTML section snippets (NOT published — "_" ignored by Pages/Jekyll)
```
- **Events** (slugs): `the-pink-issue` (**the live one**), `studio-sets-social`
  (**PAST** — Aug 29, retired to a recap page), `the-creative-collective`
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
  Settles to `transform: none` (not a zeroed transform) so it leaves no containing
  block behind — `position:fixed` children like the gallery lightbox depend on that.
- **Depth / 3D** (`DEPTH & 3D` block at the end of `styles.css` + `motion.js`):
  - **The contract: JS never writes a transform.** `motion.js` only sets custom
    properties (`--tilt-rx`, `--tilt-ry`, `--par`) that the CSS reads with neutral
    fallbacks. With JS off/blocked/slow, every page renders exactly as it would
    without the file. Intensity is three tokens in `:root`: `--tilt-max`,
    `--reveal-rot`, `--par-strength`.
  - **Cursor tilt** on `.gallery-cell`, `.photo`, `.col-card`, `.next-event-flyer`.
    `perspective()` sits *inside* the transform function, so no wrapper elements are
    needed and each card gets its own vanishing point. Gated to
    `(hover: hover) and (pointer: fine)` — never on touch.
  - **Two cascade traps**, both already bitten once: (1) the tilt selectors are
    written doubled (`.photo.photo`) to outrank `.fade-in.visible { transform: none }`,
    because some tilt targets carry `.fade-in` themselves (`.next-event-flyer`);
    (2) never stagger the children of a grid whose children are tilt targets —
    two rules setting `transform` on one element cancel each other. The stagger is
    therefore limited to `.what-to-expect` and `.stats`.
  - `will-change: transform` is scoped to `.is-tilting` and never applied at rest —
    the gallery page has ~80 `.photo` cards.
  - **Parallax** is transform-only (`.hero-image`, `.featured-image`, `.hero-inner`,
    `.event-detail-hero > .container`), rAF-coalesced, and disabled below 900px and
    on coarse pointers. The 1.08 overscan is applied only under `.parallax-on`, which
    `motion.js` adds once parallax actually runs — so the no-JS framing is unchanged.
    Deliberately **no** `background-position` parallax: that repaints a full-viewport
    image on the main thread every frame.
  - **`.flyer-card`** — two-faced spinnable flyer. The flip is the `.flipped` class
    (pure CSS, works with JS off); `motion.js` only adds drag-to-spin. The card takes
    its height from the front image, so **the `<img>` needs `width`/`height` attrs** or
    a lazy flyer collapses the card until it loads.
- Common building blocks: `.eyebrow` (gold label), `.section-title`, `.lede`, `.body-serif`,
  `.what-to-expect` (numbered `.expect-item` grid), `.faq`/`.faq-item`, `.cta-band` (final CTA).

## Event detail page anatomy (typical order)
Hero (bg image) → info strip (When/Where/Price/Spots) → The Concept/Vibe → visual section
(gallery or venue photos) → What to Expect / The Experience (numbered) → For Models callout →
**Partner With Us** (brands/sponsors/vendors) → FAQ ("Before You RSVP") → final `.cta-band` → footer.
- Each page has JSON-LD `Event` schema in `<head>` and OG/Twitter meta (og:image = the flyer).
- Checkout links go to `https://createconnectla.com/events/<slug>/checkout/` (target=_blank).

## Reusable templates
- **`_templates/event-flyer-3d.html`** — the spinnable flyer card. Drop-in for a
  static flyer `<img>`; assumes `events/<slug>/` depth. Set the img's real pixel
  `width`/`height`, and add the ghost-button override if the section is cream.
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
  --screenshot=out.png file://...`); in the **cloud sandbox** it's `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
  (launch with `args: ['--no-sandbox']`) and playwright-core is at
  `/opt/node22/lib/node_modules/playwright/node_modules/playwright-core`. Block
  non-`file:` requests in the page — Google Fonts/Cloudflare/Beehiiv are unreachable
  from the sandbox and `waitUntil:'load'` will otherwise stall for minutes.
  Note `html { scroll-behavior: smooth }`: `scrollIntoView` keeps firing scroll
  events, which legitimately clear the card tilt — use `window.scrollTo` when
  testing hover.
  A temp copy of the page must live in the page's own dir or relative asset paths break.
- **Adding a page**: link `styles.css` *and* `motion.js` with the same relative
  depth (`motion.js` / `../motion.js` / `../../motion.js` / `../../../motion.js`).
  Relative, never root-absolute — root-absolute breaks `file://` verification.
  `guide/` and the 4 `events/artists-and-muses/*` redirect stubs load neither, by design.
- **Retiring an event** (the recipe, from Poolside `f42fbd0` and SSS): keep the page
  whole — flip JSON-LD `availability` to `SoldOut` (leave `eventStatus` and `offers`,
  keep the Price cell, **no** `noindex`), hero eyebrow → `Past Event · …`, hero CTA →
  `../../gallery/#<slug>`, strip cell `Spots` → `Status / Wrapped — results coming soon`,
  strip button → `View gallery`, all remaining RSVPs → the next event, final band →
  "This room has wrapped. / Be in the next one." Rewrite `checkout/` to the dashed
  "This event has passed" panel but **keep** the `.order-summary` aside; leave
  `confirmed/` untouched. Then: demote its card on `events/index.html` to an archive
  row, add a `gallery/` placeholder section, and grep the whole repo for the slug —
  other event trees point at "the next room" and will be left pointing at a dead one.
  This is different from **cancelling** (TCC): that rewrites the page, adds `noindex`,
  sets `EventCancelled`, and drops `offers` + the Price cell.
- **Images**: optimize before committing (progressive JPEG, ~1320px wide, quality ~82,
  via Pillow). Keep an event's `flyer.jpg` even if not shown on the detail page — it's the
  `og:image`/schema share image. Split multi-photo collages by detecting near-white seam rows.
- Don't put the model identifier in commits/PRs. End commit messages with the Co-Authored-By
  + Claude-Session trailers; PR bodies with the Claude Code footer.

## Change log
### 2026-08-30 — Studio Sets Social retired; CSS-3D depth layer added
**Part 1 — SSS became a past event** (it ran Aug 29). Followed the Poolside recipe
(`f42fbd0`), now written up under Conventions. Detail page kept whole with 11 surface
edits (`availability` → `SoldOut`, `Past Event` eyebrow, `Status / Wrapped` cell, all
RSVPs → The Pink Issue, gallery CTAs); `checkout/` lost both Stripe tier cards for the
dashed "event has passed" panel; `confirmed/` untouched per precedent. Demoted its
card on `events/index.html` (incl. the two spot-counter lines) to **archive row 09**,
added a `gallery/#studiosets` placeholder + `images/gallery/studiosets/` for the photos
Nat is still editing.
- **Bug found and fixed along the way**: the cancelled TCC tree advertised SSS as "the
  next room" in 9 places, so a cancelled event was routing people to a finished one.
  All repointed to The Pink Issue.
- Also corrected the SSS checkout's `<meta name="description">`, which still read
  "Reserve your spot" — the Poolside precedent left its own stale, ours doesn't.
- **Still open — Stripe**: the two SSS payment links
  (`buy.stripe.com/28E9AT7UVfXLg3igRlgjC09` $95, `.../14AaEX5MN5j704k8kPgjC0a` $55)
  are **still live**; the site no longer links to them, but a saved link still charges.
  Deactivating was approved but the Stripe MCP call needs tool approval to run.
- **Flagged, not done**: `events/modinochi-ii/` has the same problem in worse form —
  a June 20 event still reading `InStock`, `$90 / attendee`, "8 of 30 remaining",
  "RSVP closes when the room is full". It is orphaned (nothing links to it) but live
  and indexable. The recipe above fixes it.

**Part 2 — depth & 3D** (`styles.css` DEPTH & 3D block + new `motion.js`, ~4 KB, no
dependencies). Cursor tilt on photo cards, transform-only hero parallax, `.fade-in`
upgraded to a perspective hinge, `.btn-pill` lift, and a spinnable two-faced
`.flyer-card` replacing the flat flyer in "The Cover" on The Pink Issue. Because
`styles.css` is shared, most of it needed **no HTML changes**; the only per-page edit
is one `<script defer>` line on the 27 styled pages.
- Verified with headless Chromium: 21/21 behavioural checks, zero JS errors on every
  page type. Under `prefers-reduced-motion` the composition is byte-identical to `main`
  on 6 of 7 unchanged pages; the home page differs by 0.029% of pixels (max channel
  delta 11) purely because `main`'s `.fade-in.visible { transform: translateY(0) }`
  forced grayscale text antialiasing and `transform: none` no longer does.
- **Pre-existing, not introduced here**: with JS disabled every `.fade-in` stays at
  `opacity: 0`, since the inline IntersectionObserver is what reveals it. True on
  `main` too. Worth fixing one day with a `<noscript>` override.

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
