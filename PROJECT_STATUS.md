# PROJECT STATUS — Funngro two-page redesign

_Last updated: 2026-11-27 · Current phase: **1 — Research (complete, awaiting review)**_

## Completed
- [x] Located the official site (https://www.funngro.com) and crawled 20 URLs (3 target + 10 supporting pages), desktop + mobile, with screenshots → `research/`
- [x] Identified the two target pages: Teen = `/teen` → `/earn`; Company = `/about` (see `research/01-site-inventory.md`)
- [x] Brand & audience notes → `research/02-brand-and-audience.md`
- [x] Competitor scan (partial, no paid tools) → `research/03-competitors.md`
- [x] UX/UI audit → `research/04-ux-audit.md`
- [x] Preliminary SEO + Lighthouse + axe audit → `research/05-seo-audit-preliminary.md`, raw data in `research/lighthouse`, `research/a11y`, `research/raw`

## In progress
- Nothing. Phase 2 (strategy) has **not** started.

## Awaiting your approval / answers
1. **Brand spelling:** site uses **Funngro**; brief says "Funggro". Which do we use on the pages? (Recommendation: Funngro — it is the real brand and domain.)
2. **Teen page:** confirm it is `/teen` → `/earn` ("How it works"). Note `/teen` is not a real page on the live site.
3. **Company page:** confirm "Company" = `/about`, not the wider Company column (Careers/Press/Trust).
4. **Instagram:** you gave `instagram.com/funngro/`; the site links `instagram.com/fun.n.gro`. Which is official? (Login-walled, not inspected either way.)
5. **Client-supplied facts/assets** I must not invent: founder & team photos, parent/age-consent wording, which user/brand numbers are current (70L vs 3M; 5,000 brands vs campaigns), legal entity name.
6. **Deliverable form:** static HTML/CSS/JS pages (recommended: fixes the client-side-rendering SEO problem), or a framework? Plus where it will be hosted.
7. **Redesign scope:** keep the dark green brand and refine it, or explore a visibly different direction? (Phase 3 decision — I'll show options.)

## Blocked / limited
- Instagram and any logged-in social pages: not accessible.
- Keyword volumes, traffic, backlinks: no SEO-tool access (Ahrefs/Similarweb connectors unauthenticated; Search Console not provided). No such figures appear anywhere in the audit.
- Teenker (competitor): official site not found.
- Lighthouse numbers are single lab runs from a cloud container.
