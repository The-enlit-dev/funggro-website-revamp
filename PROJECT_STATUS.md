# PROJECT STATUS — Funngro two-page redesign

_Last updated: 2026-11-27 · Current phase: **7 — Final delivery package (complete; awaiting your submission and merge decision)**_

**Live evaluation site:** https://funngro-revamp-evaluation.netlify.app → `/earn` (Teen) · `/about` (Company) — `noindex` retained by design. Nothing has been submitted to Funngro or published on funngro.com.

## Decisions recorded
- Brand **Funngro**; pages **/earn** (Teen; `/teen` 301s here) and **/about** (Company); `/` → `/earn` (302).
- Static HTML/CSS/vanilla JS · Netlify · GitHub. Visual direction: Concept 2 "Sticker Book" (premium).
- **noindex only on the evaluation deploy**; production build is indexable.
- Public copy: Tier A/B facts only; unresolved items shown as placeholders.

## Completed
### Phases 1–3 ✅ — research, strategy, design, build, deploy, QA (see earlier sections of `qa/QA-REPORT.md` history in git)
### Phase 4 ✅
- [x] **Co-founder research** → `research/06-verified-facts.md` (update section)
  - Payal Jain — **Co-founder & CEO** (Entrackr, Inc42, eChai, SugerMint, funngro.com/about agree; funngro.com/press "CTO" is the outlier). Ex-Customer Success Director, Worldline Global; IIM Calcutta alumna. LinkedIn `/in/payal-jain-8780191/`.
  - Anik Jain — **Co-founder** (no independent source confirms a C-level title; Funngro's pages say CFO and CEO). Second-time founder; ex co-founder & CEO of insurtech Symbo; earlier ICICI Lombard, Marsh, Mahindra Insurance Brokers. LinkedIn `/in/anik-jain-7966404` (Inc42 + coffeemug.ai).
  - Founding year resolved to **2021**.
- [x] **Founder section implemented**: verified titles + short sourced bios, distinct LinkedIn links opening in a new tab (`noopener noreferrer`, accessible names), polished portrait slots, sources note, responsive (stacked on mobile, side-by-side ≥640px, two-up ≥1024px). JSON-LD founders updated.
- [x] **SEO polish**: metadata, canonicals, JSON-LD (schema.org validator: 0 errors), sitemap (XSD-valid), robots, social previews, alt text, headings, links, noindex — `qa/REDESIGN-SEO-AUDIT.md`
- [x] **Performance**: Lighthouse live P100 ×4; production build 100/100/100/100 ×4; Brotli, immutable caching, font preload/swap, ₹ subset; lab LCP ≤0.9 s, CLS 0, interaction latency ≤32 ms
- [x] **Accessibility**: axe 0 violations; keyboard 15/15 (focus visible everywhere, menu containment, Esc); contrast verified
- [x] **Functional**: 150 links/buttons inventoried; interactions 26/26; functional 26/26 (LinkedIn new tabs, QR decodes to Google Play, store listings 200); redirects + 404; 7 widths; no-JS rendering
- [x] **Docs**: `qa/QA-REPORT.md`, `qa/REDESIGN-SEO-AUDIT.md` (original-site audit stays in `research/05`), `DEPLOYMENT.md` (incl. pre-production checklist)

### Phase mapping check (before Phase 7)
The brief's Phases 5 (SEO) and 6 (Testing) were delivered under the session's "Phase 4"; each brief requirement is mapped to evidence in `delivery/02-phase-completion.md` — both complete, with documented limits (no physical-device/screen-reader testing, 4 external links not machine-checkable, Netlify badge).

### Phase 7 ✅ — Final delivery package → `delivery/`
- [x] Project overview, phase completion review, original-site SEO audit, redesign SEO audit, QA & accessibility report, Lighthouse/performance summary, facts/questions/assumptions, Funngro confirmation list, deployment + pre-production checklist, submission summary
- [x] Fresh screenshots from the live evaluation site (desktop 1440, tablet 768, mobile 390; founders close-ups)
- [x] Small fix found while capturing screenshots: on phones the proof pills hid the ★ next to "4.1" and showed the TV icon (wrapping "Season 2"); corrected, redeployed, full QA suite + Lighthouse re-run on the new deploy

## In progress
- Nothing.

## Awaiting your decision
1. Submit the project (checklist in the final message / `delivery/10-submission-summary.md`).
2. Merge PR #1 — **not merged; needs your approval**.
3. Any production publishing to funngro.com — not done; needs your approval and Funngro's confirmations.

## Awaiting client information (shown on the pages as placeholders or flagged)
1. **Official founder portraits** (no legitimately reusable photos found — only third-party publication photos without licence).
2. **Anik Jain's official LinkedIn** — funngro.com links `/in/anik-jain/`; independent sources tie `/in/anik-jain-7966404` to "Co-Founder at Funngro" (used). Also his exact title, if Funngro wants one shown.
3. Parental-consent wording (and App Store 16+ vs 14–25).
4. SucSEED Indovation relationship; exact Shark Tank episode URL.
5. Consent to reuse published earner stories/photos; canonical app link for the QR (currently Google Play).
6. Official Instagram handle; partner-logo permission (not used).

## Blocked / limited
- **Netlify "Powered by Netlify" badge** (edge-injected on the free plan): blocked by our CSP → 2 console errors/page, Lighthouse Best Practices 92, and one empty keyboard focus stop on its iframe. Fix: turn the badge off in Netlify (may need a paid plan) — your action.
- LinkedIn and IBS Intelligence pages can't be opened by automated tools (bot/login walls).
- No real-device or screen-reader testing; no Search Console or keyword data.
- GitHub → Netlify auto-deploys need linking in the Netlify UI (API deploys work).
