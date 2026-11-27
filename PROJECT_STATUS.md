# PROJECT STATUS — Funngro two-page redesign

_Last updated: 2026-11-27 · Current phase: **3 — Design & development (built, deployed, tested; awaiting your review)**_

**Live evaluation site:** https://funngro-revamp-evaluation.netlify.app → `/earn` (Teen) · `/about` (Company) — `noindex` by design.

## Decisions recorded
- Brand **Funngro**; pages **/earn** (Teen, `/teen` 301s here) and **/about** (Company); `/` → `/earn` (302).
- Static HTML/CSS/vanilla JS on Netlify + GitHub.
- Visual direction **Concept 2 — Sticker Book**, premium interpretation.
- **noindex only on the evaluation deploy**; production build (`npm run build:production`) is indexable.
- Public copy: **Tier A/B facts only**; unresolved claims shown as "To be confirmed" placeholders.
- Instagram: discrepancy recorded; no Instagram link used until verified.

## Completed
### Phase 1 — Research ✅  ·  Phase 2 — Strategy & design direction ✅
(see `research/`, `strategy/`, `design/01–03`)
### Phase 3 — Design & development ✅ (pending your review)
- [x] Implementation spec → `design/04-implementation-spec.md`
- [x] Asset pipeline: fonts subset (82 KB total, ₹ verified), responsive AVIF/WebP/JPEG images, official store badges, QR, OG images
- [x] Static build with partials, `<picture>` generation, CSS bundling, target-aware SEO files (`scripts/build.mjs`)
- [x] Teen page `/earn` and Company page `/about` + custom 404
- [x] Netlify evaluation site created and deployed (redirects, security headers, caching, noindex)
- [x] QA on the live deploy → `qa/QA-REPORT.md`:
  - responsive 320–1440 (7 widths): no overflow, 0 console errors from our code
  - axe-core: 0 violations (both pages, mobile/desktop, menu open)
  - interactions/navigation: 26/26 pass
  - Lighthouse (median of 3): Performance 100, Accessibility 100 on all 4 runs; Best Practices 92 (Netlify badge blocked by CSP — 100 without it); SEO 69 because noindex (production build: 100)
  - W3C HTML: 0 errors · ₹ rendered by brand fonts · all metadata checks pass · redirects verified
- [x] Redesign SEO audit (separate from the original-site audit) → `qa/REDESIGN-SEO-AUDIT.md`
- [x] Deployment notes → `DEPLOYMENT.md`

## In progress
- Nothing.

## Awaiting your approval
1. Review the live pages and the board-vs-build comparison (`qa/comparison/`).
2. Go-ahead for the remaining phases (final SEO polish, extended testing, delivery package).

## Awaiting client information (shown as "To be confirmed" on the pages)
1. Founder titles + approved bios + portraits (About vs Press pages conflict).
2. Founding year (2021 vs 2022).
3. Parental-consent wording (and App Store 16+ vs 14–25).
4. SucSEED Indovation relationship; exact Shark Tank episode video URL.
5. Consent to reuse published earner stories/photos (used as published on funngro.com/stories).
6. Canonical app download link for the QR code (currently Google Play).
7. Official Instagram handle; partner-logo permission (not used).
8. Payout-time and fee wording (copy currently avoids both contradictory claims).

## Blocked / limited
- Netlify "Powered by Netlify" badge: injected by Netlify on free plans; blocked by our CSP. Turning it off needs the Netlify UI (possibly a paid plan) — your action if wanted.
- GitHub → Netlify continuous deploys need linking in the Netlify UI (manual API deploys work now).
- LinkedIn and IBS Intelligence links can't be verified from this environment (bot protection); copied from funngro.com.
- No real-device or screen-reader testing; no Search Console/keyword data.
