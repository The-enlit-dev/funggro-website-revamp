# Funngro website revamp — Teen (`/earn`) and Company (`/about`) pages

A static, two-page redesign of [Funngro](https://www.funngro.com) built for a website-development evaluation.

**➡ Reviewers: start with the [delivery package](delivery/README.md).**

- **Live evaluation site:** https://funngro-revamp-evaluation.netlify.app (`/` → `/earn`; marked `noindex`)
- **Stack:** static HTML, modern CSS (layers, container-safe grids, fluid type), vanilla JS (progressive enhancement), Netlify.
- **Design:** "Sticker Book" (premium) — warm paper, ink type, Funngro green, real Funngro photography and app screens. Fonts: Bricolage Grotesque + Figtree, self-hosted and subset, ₹ glyph verified.
- **Facts policy:** public copy uses only verified (Tier A) or consistent company-published (Tier B) facts from `research/06-verified-facts.md`. Unresolved items are shown as visible "To be confirmed" placeholders.

| Folder | What's in it |
|---|---|
| `delivery/` | **Final delivery package** — overview, audits, QA, Lighthouse, facts, confirmations, deployment, submission summary, live screenshots |
| `research/` | Phase 1 audit of the current site (incl. the original SEO audit) + verified facts register |
| `strategy/` | Page strategy, structures, content, SEO and technical plans |
| `design/` | Design research, three concepts, design system, implementation spec |
| `src/` | Source pages, partials, styles, scripts, fonts, optimised images |
| `scripts/` | Build, asset preparation, Netlify deploy |
| `tests/` | Playwright/axe/Lighthouse QA scripts |
| `qa/` | QA report, redesign SEO audit, screenshots and raw results |

```bash
npm ci
npm run build          # evaluation build (noindex) → dist/
npm run serve          # preview at http://localhost:4173
BASE_URL=<url> npm test
```
See `DEPLOYMENT.md` for deploy/production instructions and `PROJECT_STATUS.md` for progress.
