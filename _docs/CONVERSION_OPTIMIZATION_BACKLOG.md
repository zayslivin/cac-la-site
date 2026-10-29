# Conversion Optimization Backlog — createconnectla.com

Priority = Impact × Confidence ÷ Effort (each 1–5). A sorting aid, not a forecast.
Critical bugs, security, broken checkout and serious accessibility issues jump the queue.
Source: ChatGPT audit (2026-10-28, scored the site 8/10) re-verified against the repo
on 2026-10-29, plus Claude's own findings. Revenue context: Zay earns a share of ticket
revenue, so paid RSVPs are the north-star metric.

| # | Opportunity | Page / journey | Evidence | I | C | E | Score | Measure | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Homepage hero sells the next event: name, date, $95/$55, "Reserve your spot" above the fold | Home → event → checkout | Hero only says "Where creatives turn portfolios into art" + "View the next event" (verified). NN/g: homepages must communicate what you offer immediately | 5 | 4 | 2 | 10.0 | Home→checkout click-through (UTM'd), Stripe sales per event | Phase 1 — next |
| 2 | "What's included" beside each ticket (sets, lighting, time, image sharing) + refund line | Event checkout | Inclusions exist but are scattered across FAQ (verified). Baymard: surprise terms drive abandonment | 4 | 4 | 2 | 8.0 | Checkout view → Stripe completion | Phase 1 (refund line done) |
| 3 | Beehiiv welcome sequence for free-guide signups (guide → proof → how it works → next event) | Guide signup → email → event | Funnel step 5 "follow-up" missing: signups get no nurture (verify in Beehiiv) | 4 | 3 | 3 | 4.0 | Subscriber → buyer (Stripe email match) | Phase 1 |
| 4 | UTM-tagged links on every IG bio/story/post + Stripe as scoreboard | All | Cloudflare has referrers but no campaigns; no GA (verified) | 3 | 4 | 1 | 12.0 | Sales by source | Phase 1 |
| 5 | Testimonials paired with face, handle, role, event + finished images | Home, testimonials, events | Audit: proof should be outcome-focused | 4 | 3 | 3 | 4.0 | Time-on-event-page, checkout CTR | Phase 2 |
| 6 | Model / photographer landing pages with role-specific CTAs | New pages | Audit Problem 4 | 3 | 2 | 4 | 1.5 | Visits → checkout per role | Phase 3 |
| 7 | Brand partnership page: deliverables, past partners, short qualified form | brands/, brands/inquire | Audit Problem 4 / Part 6.3 | 3 | 3 | 3 | 3.0 | Inquiries/month | Phase 3 |
| 8 | Waitlist when an event sells out (20-spot cap is manual) | Checkout | Audit table; cap enforced by hand | 3 | 3 | 2 | 4.5 | Waitlist signups → next-event sales | Phase 2 |
| 9 | Event-page sticky mobile CTA | Event pages | Audit 4.1 §9 (test it, don't assume) | 2 | 2 | 2 | 2.0 | Mobile checkout CTR | Hypothesis |
| 10 | Retire `modinochi-ii` (June event still "InStock", indexable) | Orphan page | CLAUDE.md flag 2026-08-30 | 2 | 5 | 1 | 10.0 | — (trust/SEO hygiene) | Quick fix |
| 11 | No-JS fallback: every `.fade-in` is invisible without JS | Site-wide | CLAUDE.md flag; affects crawlers/old browsers | 2 | 4 | 1 | 8.0 | — | Quick fix |
| 12 | Make the GitHub repo private (internal notes are public on GitHub) | Repo | Verified public | — | — | — | Critical (decision) | — | Needs Zay |

Not adopted from the ChatGPT prompt (and why): CMS / event "single source of truth"
(needs a build system for a 25-page static site — revisit only if events become weekly);
formal A/B testing (20–35 buyers per event can't reach significance); GA4 (adds a consent
banner + script weight; UTMs + Stripe answer the questions that matter today).
