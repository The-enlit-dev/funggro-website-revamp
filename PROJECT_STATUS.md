# PROJECT STATUS — Funngro two-page redesign

_Last updated: 2026-11-27 · Current phase: **2 — Strategy & design direction (complete, awaiting approval)**_

## Decisions recorded (from your Phase 1 review)
- Brand spelling: **Funngro**.
- Pages: **Teen = `/earn`** (old `/teen` redirects there), **Company = `/about`**.
- Stack: **static HTML, CSS, vanilla JS**; GitHub + **Netlify**.
- Instagram: discrepancy recorded (`/funngro/` per brief vs `/fun.n.gro` on site) — neither treated as official.
- No invented founders, stats, testimonials, financial claims or age/consent wording; gaps listed as requirements.

## Completed
### Phase 1 — Research
- [x] Site crawl, page identification, brand/audience, competitors, UX audit, SEO/Lighthouse/axe audit → `research/01–05`
### Phase 2 — Strategy & design
- [x] Verified facts register with source tiers + conflicts + client requirements → `research/06-verified-facts.md`
- [x] Official assets archived (logo, 5 app screens, 10 earner portraits, Shark Tank thumbnail) → `assets/source/`
- [x] Strategy & audience analysis → `strategy/01`
- [x] Section-by-section structures: Teen `strategy/02`, Company `strategy/03`
- [x] Content strategy → `strategy/04`
- [x] SEO strategy per page → `strategy/05`
- [x] Technical implementation plan → `strategy/06`
- [x] Design research (FamApp, Jar, CRED + competitors) → `design/01`
- [x] Three visual concepts with rendered boards → `design/02`, `design/concepts/*.png`
- [x] Design system specification → `design/03`

## In progress
- Nothing. Phase 3 has **not** started; no website code written.

## Awaiting your approval
1. **Visual direction:** Concept 1 Night Ledger / **Concept 2 Sticker Book (recommended)** / Concept 3 Clear Signal — or a combination.
2. **Page structures** (`strategy/02`, `strategy/03`) — approve or request changes.
3. **What `/` shows** on the Netlify deploy: temporary redirect to `/earn` (recommended), or a tiny landing linking both pages.
4. **Evaluation deploy indexing:** `noindex` on the Netlify domain to avoid duplicating funngro.com (recommended).
5. **Fact-handling approach:** use only Tier A/B facts; Tier C shown as placeholders until confirmed (`research/06`).

## Awaiting client information (requirements — not invented)
1. Founder titles + approved bios (About vs Press pages conflict) and official founder portraits.
2. Founding year (2021 vs 2022); current users (70L/60L claims vs 50L+ verified downloads); brand count.
3. Parent-consent / age wording (14–25 vs App Store 16+).
4. Payout-time and withdrawal-fee wording (FAQ contradicts itself).
5. Consent to reuse published earner stories/photos.
6. Permission and files for partner brand logos.
7. Official Instagram handle.
8. Exact Shark Tank pitch video URL; confirm SucSEED Indovation relationship.
9. Optional: team/office photography, higher-res app screens.

## Blocked / limited
- Instagram (login wall).
- Keyword volumes/traffic/backlinks: no SEO-tool or Search Console access — SEO targets are intent-based hypotheses.
- Teenker competitor site not found.
- Lighthouse figures are single lab runs from a cloud container.
