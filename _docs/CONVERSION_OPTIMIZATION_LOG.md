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
