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

## 2026-10-29 — Retired the stale Orange County page; content visible without JS
- **Category:** A → D. **Pages:** `events/modinochi-ii/` (+ checkout), 30 pages with `.fade-in`.
- **Problem:** A June 20 event page still read "InStock", "8 of 30 remaining", "RSVP closes when
  the room is full", and its checkout promised refunds the terms don't offer — live and indexable.
  Separately, with JavaScript off every reveal-on-scroll section stayed invisible.
- **Change:** Retired per the recipe (neutral "past event" copy — no proof it ran); all RSVPs →
  The Statement. `<noscript>` override un-hides `.fade-in` and the staggered children.
- **Evidence:** Google Event structured-data guidance — markup must match the page and expired
  events shouldn't advertise availability; progressive enhancement (content must not depend on JS).
- **Tested:** JS off → 0 hidden elements on home, Statement, Book a Shoot, gallery, about, both
  Orange County pages, Statement checkout; JS on → unchanged.
- **Expected impact:** Low on conversion; removes a trust/SEO liability.

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

## 2026-10-29 — Signup form added to The Statement, gallery and Book a Shoot
- **Pages:** `events/the-statement/`, `gallery/`, `book-a-shoot/` (new `#subscribe` section
  before the footer); `index.html` (copy); `index.html` + `brands/` (stat 270+ → 600+).
- **Category:** B (list growth → future paid RSVPs)
- **Problem:** The list is 49 active subscribers, 3 new in the last 3 months, 1 of them from
  the site (Beehiiv stats). The only form sat at the bottom of the homepage, while traffic
  from IG lands on event and gallery pages. A visitor who can't make Nov 14 had no way to
  hear about the next room except following IG. The meta line claimed "Biweekly" (false:
  sends are sporadic), and "600+ creatives" read like a subscriber count.
- **Change:** Same Beehiiv form (`e0353720…`) in a page-specific section on 3 more pages:
  The Statement leads with "Can't make Nov 14? Hear about the next room first." Pitch = early
  word on new dates + the free prep guide. Meta → "600+ creatives have been in our rooms ·
  No spam · Unsubscribe anytime". "Biweekly" removed. On those 3 pages the mobile-menu /
  footer "Newsletter" / "Get the free guide" links now jump to the on-page form. The 270+ stat
  on home and brands → 600+ (Zay: 600+ = total attendees), so the site states one number.
- **Evidence (weak):** Vendor blog guidance only, not controlled studies — place forms where
  intent is (end of content / exit points), lead with a specific benefit rather than
  "subscribe to our newsletter", set honest frequency expectations
  (tajo.io/blog/newsletter-signup-optimization; orbitforms.ai/blog/newsletter-signup-form-best-practices).
  The stronger argument is our own data: 1 site signup in 3 months from one placement.
- **Tested:** headless Chromium at 390 and 1440px on all 5 changed pages: no horizontal
  overflow, 0 JS errors, exactly one `#subscribe` per page, `<noscript>` fallback present,
  per-event accent cascades (red on The Statement, olive on Book a Shoot). The Beehiiv embed
  itself can't load in the sandbox; check it renders on the live pages after merge.
- **Expected impact:** Medium on list growth; indirect on sales (the list sold nothing yet
  that we can attribute).
- **Measure:** Beehiiv new subscribers/week for 4 weeks after merge vs the 3-month baseline
  (~1/month); Beehiiv subscriber source/referring URL if exposed.

## 2026-10-29 — Book a Shoot hero: "A private shoot with Nathalie."
- **Problem:** H1 read "Book a Shoot", which on a site of group events doesn't say this is a private, one-on-one session or who shoots it.
- **Change (Zay's call):** H1 → "A private shoot with *Nathalie*."; lede opens "Your own session behind her lens, not a group event."; `<title>`/og:title name it a private shoot with Nathalie. H1 clamp eased (56–112px → 46–92px) for the longer line.
- **Evidence:** no live research; a clarity edit. Headline names the offer + the person (NN/g: say what you offer up front).
- **Tests:** 390px + 1440px, no overflow, 0 JS errors.
- **Measure:** DMs to @createconnect.la mentioning a shoot, per month.

## 2026-10-29 — Real testimonials on The Statement page + checkout
- **Problem:** the pages where people decide to pay (event detail + checkout) carried zero social proof; 20 real quotes with IG handles sat only on `testimonials/`. Statement sales: 2 of 20, 0 models, none since Oct 10 (Stripe).
- **Evidence:** NN/g "Social Proof in the User Experience" (people are guided by others' behavior; show it where the decision happens); Baymard trust research (social proof as a trust signal) and its product-page finding that users leave the page to look for proof when it isn't there. Ecommerce context, not events — placement principle transfers, effect size does not.
- **Change:** new dark "From Past Rooms" section (4 cards: 2 models, 2 photographers, verbatim; one trimmed with "…") before the FAQ, with a Reserve button and a link to `testimonials/`. Checkout aside gets 2 short excerpts under "After you RSVP". Models picked deliberately — model sales are at zero.
- **Tests:** 390px + 1440px on both pages, no overflow, 0 JS errors. Accent cascades red.
- **Expected impact:** small-to-moderate lift in event-page → checkout and checkout → paid. Can't be isolated (Nat is also pushing sales).
- **Measure:** Stripe Statement sales after merge vs. the 19-day zero streak before; model share of sales.
