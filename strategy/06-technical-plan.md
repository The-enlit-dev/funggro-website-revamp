# 06 — Technical implementation plan

Stack (approved): **static HTML + CSS + vanilla JavaScript**, GitHub repo, Netlify hosting. No framework, no runtime dependencies. A tiny Node build step (dev-only) for partials, asset optimisation and minification.

## Repository layout (proposed)
```
/
├─ src/
│  ├─ earn.html                 # Teen page
│  ├─ about.html                # Company page
│  ├─ 404.html
│  ├─ partials/                 # header.html, footer.html, head-meta.html, icons.svg
│  ├─ styles/
│  │  ├─ tokens.css             # design tokens (custom properties)
│  │  ├─ base.css               # reset, typography, utilities
│  │  ├─ layout.css             # grid, containers, sections
│  │  ├─ components/*.css       # one file per component
│  │  └─ pages/earn.css, about.css
│  ├─ scripts/
│  │  ├─ main.js                # header, menu, reveal observer
│  │  ├─ steps.js               # sticky phone sync (earn)
│  │  ├─ carousel.js            # stories
│  │  └─ timeline.js            # about
│  ├─ images/                   # source images (from assets/source + client files)
│  └─ fonts/                    # subset WOFF2
├─ scripts/build.mjs            # include partials, inline critical CSS, minify, hash assets
├─ scripts/images.mjs           # sharp → AVIF/WebP/JPEG at 400/800/1200/1600w
├─ tests/                       # Playwright specs, axe, link check, Lighthouse CI config
├─ netlify.toml                 # build, headers, redirects
├─ public/ → robots.txt, sitemap.xml, favicons, og images (copied to dist)
└─ dist/                        # build output (git-ignored), Netlify publishes this
```
Dev dependencies (all free): `sharp`, `lightningcss`, `html-minifier-terser`, `@playwright/test`, `axe-core`, `@lhci/cli`, `linkinator`.

## HTML
- Semantic landmarks (`header`, `nav`, `main`, `section[aria-labelledby]`, `footer`); one H1.
- Partials injected at build time (`<!-- @include partials/header.html -->`) so both pages share one header/footer source.
- All meta/OG/JSON-LD generated from a single `site.config.json` (titles, descriptions, `SITE_URL`, facts) — facts can't drift between pages.
- Works without JavaScript: content, FAQ (`<details>`), nav (CSS-only fallback), links all function.

## CSS
- Cascade layers: `@layer reset, tokens, base, layout, components, pages, utilities`.
- Modern features with fallbacks: `clamp()` type, container queries, `:has()`, `animation-timeline: view()` (progressive enhancement), logical properties.
- Critical CSS (above-the-fold) inlined per page; rest loaded async. Target ≤30 KB gzipped total.

## JavaScript
- ES modules, `type="module"`, deferred; each page loads only what it uses. Budget ≤15 KB gzipped.
- One shared IntersectionObserver for reveals; `matchMedia('(prefers-reduced-motion: reduce)')` disables motion.
- No third-party scripts by default (no analytics, no YouTube embed on load — click-to-load facade).

## Assets & performance budget (per page, mobile)
| Item | Budget |
|---|---|
| HTML | ≤ 30 KB gz |
| CSS | ≤ 30 KB gz |
| JS | ≤ 15 KB gz |
| Fonts | 2 families, ≤ 4 WOFF2, ≤ 120 KB, `font-display: swap` + metric overrides, preload 2 |
| LCP image | ≤ 90 KB AVIF, preloaded, `fetchpriority="high"` |
| Total initial load | ≤ 400 KB |
Targets: Lighthouse mobile ≥ 95 in all four categories; LCP < 2.5 s; CLS < 0.1; TBT < 150 ms.

## Netlify
- `netlify.toml`: build `npm run build`, publish `dist`, Node LTS.
- `_redirects`/toml: `/teen /earn 301`, `/earn/ /earn 301`, `/about/ /about 301`, `/ /earn 302` (temporary until you decide what `/` should show), custom 404.
- Headers: long-term immutable caching for hashed assets; short cache for HTML; security headers (CSP with no inline-script except JSON-LD hashes, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`); `X-Robots-Tag: noindex` on the evaluation domain.
- Deploy previews per pull request; production from `main`.
- Netlify API access is already connected in this environment, so I can create the site and deploy once you approve.

## Quality & testing (Phase 6, all automated where possible)
| Check | Tool |
|---|---|
| Responsive screenshots 360/390/768/1024/1440 | Playwright |
| Console errors & failed requests = 0 | Playwright |
| Accessibility (0 violations) | axe-core + keyboard walkthrough script |
| Performance/SEO/Best practices | Lighthouse CI (3 runs, median) mobile + desktop |
| Broken links (internal + external) | linkinator |
| HTML validity | W3C Nu validator (`vnu` jar) |
| Structured data | JSON-LD parse + schema.org property check (Google Rich Results test is manual — I'll note if not run) |
| Reduced motion, no-JS rendering | Playwright with emulation / JS disabled |

## Workflow
1. Phase 3: lock tokens + component specs; build static component/style-guide page and high-fidelity hero mocks (desktop + mobile) for approval.
2. Phase 4: build pages on a feature branch; PR with Netlify deploy preview.
3. Phases 5–6: SEO implementation and the test suite; fix until green.
4. Phase 7: production deploy, SEO audit report, deployment guide, change log.

## Risks
| Risk | Mitigation |
|---|---|
| Client facts not confirmed in time | Ship review build with visible placeholders; production build fails if `{{` remains |
| Earner photo consent unclear | Swap to illustrated avatars or remove the section |
| Sticker style tipping into "childish" | Guardrails in design doc; review at Phase 3 mock stage |
| Duplicate content vs funngro.com | `noindex` on evaluation domain |
