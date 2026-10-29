# Conversion Optimization Log — createconnectla.com

Every meaningful site change, why it was made, the evidence behind it, how it was
checked, and what to measure. Newest first. Not published (Jekyll skips `_docs/`).

Categories: **A** verified problem · **B** evidence-based opportunity · **C** hypothesis
needing a test · **D** completed. "Implemented" ≠ "worked" — impact stays *unmeasured*
until Stripe/analytics show it.

Measurement reality (2026-10-29): Cloudflare Web Analytics only (pageviews, referrers —
no click or checkout events). Stripe is the source of truth for purchases. Event rooms
are 20–35 spots, so A/B tests can't reach significance; use before/after on Stripe
data per event plus qualitative feedback.

---

## 2026-10-29 — Book a Shoot images enhanced; no heads cut off
- **Pages:** `book-a-shoot/`, `images/book-a-shoot/` (16 images)
- **Category:** A → D
- **Problem:** Portfolio images were ~1170px screen-recording crops (soft, HEVC artifacts);
  two crops cut heads (silver-beard portrait's top-knot, fitness-bench beanie); the hero stack's
  front card covered part of a face at every width.
- **Change:** Every image re-run through Real-ESRGAN ×4 (CPU/ONNX) from the cleanest source
  frame, saved at 1400px (runway 900px). Silver portrait: IG's "1/2" badge inpainted instead of
  cropped, so the full head is back. Fitness bench: re-cropped higher from the flyer and the
  tilted frame line inpainted, so the whole beanie is in frame. Hero stack front card lowered
  (top 22%→30%, height 72%→68%).
- **Tested:** automated face check — head boxes for all 17 images mapped through object-fit/
  object-position and sampled with `elementFromPoint` (catches crop *and* overlap) at
  360/390/768/1081/1280/1400/1920px: 0 failures. Page total images 3.8 MB, all below-the-fold
  ones lazy-loaded.
- **Expected impact:** Medium on trust/perceived quality of the shoot offer; unmeasured.
- **Measure:** DM inquiries per week from the Book a Shoot page (ask "where did you find us").

## 2026-10-29 — Homepage hero sells the next event; ticket inclusions on checkout
- **Pages:** `index.html` hero, `styles.css` (hero block), `events/the-statement/checkout/`
- **Category:** A → D (implemented; impact unmeasured)
- **Problem:** The hero said "Where creatives turn portfolios into art" + "View the next event" —
  no event name, date or price anywhere on the homepage (verified). Ticket inclusions lived
  only in the event FAQ, not beside the price.
- **Change:** Kept the brand headline; added a one-line plain description ("Curated editorial
  photoshoots in Los Angeles…") and a **next-event card** in the hero: The Statement · Sat Nov 14
  · LA · Photographers $95 · Models $55 · **Reserve your spot** (→ checkout) + "See the event".
  Free guide demoted to a quiet "Not ready yet?" link (hidden in the mobile hero; still in
  #subscribe). Checkout: 4 "✓ included" lines per ticket, all taken from the event FAQ.
- **Evidence:** NN/g *Homepage Design: 5 Fundamental Principles* — communicate who you are and
  what you do in the hero, prompt the key action; NN/g *"Get Started" Stops Users* — specific CTA
  labels beat generic ones. Baymard — surprise terms/unclear inclusions drive abandonment.
- **Layout/faces:** hero grows with content (no clipping under the fixed nav on short screens);
  copy column capped at `50vw − 200px` on desktop so it stays left of the model's face; on
  phones the photo is a top band that fades to ink, face fully clear above the copy.
- **Tested:** 360×640, 390×844, 768×1024, 1024×768, 1280×720, 1440×900, 1920×1080 — no
  overflow, tag always below the nav, zero JS errors. Reserve button above the fold at 390×844
  (810px) and every desktop size; below the fold only on 360×640.
- **Expected impact:** High (largest gap in the audit). Uncertainty: the card must be updated
  by hand each event (HTML comment marks it) or it will advertise a past event.
- **Measure:** Compare Statement Stripe sales/day before vs after merge; tag the hero CTA with
  `?utm_source=site&utm_medium=home-hero` once UTMs are adopted (backlog #4).

## 2026-10-29 — Refund policy link fixed + visible on The Statement checkout
- **Pages:** `events/*/checkout/` (5), `terms/`
- **Category:** A → D
- **Problem:** Every checkout's "terms & refund policy" link pointed at `/contact/`, not the
  terms. Buyers could not see the policy (non-refundable; full refund if CCLA cancels;
  reschedules honored) before paying.
- **Change:** Link → `terms/#refunds` (new anchor) on all 5 checkouts; one plain-language
  line above "Secured by Stripe" on the live Statement checkout. Policy itself unchanged
  (Zay: "current terms, made visible").
- **Evidence:** Baymard checkout research — refund/return policy should be reachable from the
  checkout page; dissatisfaction with return policy is a documented abandonment cause
  (baymard.com/blog/checkout-flow-ux-optimization; baymard.com/research/checkout-usability).
  Context differs (e-commerce vs event tickets) — the principle (no surprise terms) transfers.
- **Tested:** link targets resolve; anchor exists; checkout renders at 390/1400px.
- **Expected impact:** Low–medium on conversion; high on trust/chargeback risk.
- **Measure:** Statement checkout → Stripe completed sessions per checkout-page view
  (Cloudflare pageviews vs Stripe sessions), compared with The Pink Issue.

## 2026-10-29 — Internal notes removed from the public site
- **Category:** A → D (partial)
- **Problem:** `createconnectla.com/CLAUDE.md` and `/CLAUDE.html` were publicly served —
  Stripe/Make/Beehiiv IDs, refund history, partnership notes.
- **Change:** `_config.yml` excludes `CLAUDE.md` from the Pages build.
- **Remaining:** the GitHub repo is **public**, so the file is still readable on GitHub.
  Fix = make the repo private (needs GitHub Pro for Pages) — Zay's decision.
