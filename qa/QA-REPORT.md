# QA report — redesigned `/earn` and `/about` (Phase 4 final)

**Tested:** 2026-11-27 on the live evaluation deploy **https://funngro-revamp-evaluation.netlify.app** (latest Netlify deploy `6b09088afbdaa55f0565a9b4`), plus a local production build where noted. Every number below comes from a script in `tests/` (re-run with `BASE_URL=<url> npm test`); raw outputs are in this folder.

## Summary
| Area | Check | Tool | Result |
|---|---|---|---|
| Layout | 7 widths (320, 360, 390, 768, 1024, 1280, 1440) × 2 pages | `screens.cjs` | **Pass** — no element beyond the viewport at any width |
| Errors | Console errors from site code | `screens.cjs` | **0** everywhere |
| Accessibility | axe-core, WCAG 2.0/2.1/2.2 A+AA + best practice, /earn /about /404 × mobile/desktop + open menu | `a11y.cjs` | **0 violations** |
| Accessibility | Keyboard: every focusable reached, visible focus on every stop, nothing hidden under the sticky header, menu focus containment, Esc | `keyboard.cjs` | **15/15** |
| Accessibility | Contrast items axe can't auto-verify | manual calc | All ≥ AA (worst: muted text on grid line 5.1:1) |
| Functional | Navigation, menu, skip link, CTA anchor, steps↔phone sync, rail buttons, FAQ, cross-page nav, **no-JS rendering** | `interactions.cjs` | **26/26** |
| Functional | Link/button inventory (150 across 3 pages): names, no empty hrefs, `_blank` safety, official store URLs, **founder LinkedIn new-tab behaviour**, **QR decode**, store listings reachable | `functional.cjs` | **26/26** |
| Delivery | Brotli on HTML/CSS/JS/SVG, cache headers, font preload + swap, ₹ subset, OG images 1200×630, robots/sitemap, X-Robots-Tag | `delivery.mjs` | **27/27** |
| Typography | ₹ rendered by brand web fonts (not fallback) | `rupee.cjs` (DevTools platform fonts) | **4/4** |
| SEO | Metadata, canonical, OG/Twitter, H1/heading order, alt + dimensions, server-rendered H1/JSON-LD, no unresolved placeholders | `seo-links.cjs` | **All pass** |
| SEO | Structured data | validator.schema.org | **0 errors** (both pages) — `schema-validator.json` |
| SEO | sitemap.xml against sitemaps.org XSD | xmllint | **Valid** (evaluation + production) |
| HTML | W3C Nu validator | vnu.jar | **0 errors**; only "role=list unnecessary" warnings (kept on purpose for Safari/VoiceOver) |
| Routing | `/`→`/earn` 302 · `/teen`(/)→`/earn` 301 · `/earn/`, `/about.html` etc. → clean URL 301 · unknown → 404 page | curl | **Pass** |
| Indexing | Evaluation = `noindex, nofollow` meta + `X-Robots-Tag` + robots `Disallow: /`; production build = indexable | curl, Lighthouse | **Pass** (noindex retained) |

## Lighthouse (median of 3 runs)
| Page | Form | Live evaluation (P / A / BP / SEO) | Local production build (P / A / BP / SEO) | LCP (live) | CLS | TBT (live) | Weight (live) |
|---|---|---|---|---|---|---|---|
| /earn | mobile | **100** / 100 / 92* / 69† | **100 / 100 / 100 / 100** | 0.9 s | 0 | 0 ms | 245 KiB |
| /earn | desktop | **100** / 100 / 92* / 69† | **100 / 100 / 100 / 100** | 0.3 s | 0 | 0 ms | 219 KiB |
| /about | mobile | **100** / 100 / 92* / 69† | **100 / 100 / 100 / 100** | 0.9 s | 0 | 70 ms | 215 KiB |
| /about | desktop | **100** / 100 / 92* / 69† | **100 / 100 / 100 / 100** | 0.3 s | 0 | 0 ms | 199 KiB |
\* Netlify's edge-injected "Powered by Netlify" badge is blocked by our CSP → console errors. † intentional `noindex`.
**Core Web Vitals:** lab LCP 0.8–0.9 s (mobile, throttled), CLS 0, TBT ≤ 70 ms; interaction latency (Event Timing, lab approximation of INP) max **32 ms**. No field (CrUX) data exists for a new evaluation URL.

## Phase 4 changes and what they fixed
| Item | Detail |
|---|---|
| Co-founder section completed | Verified titles/backgrounds, distinct LinkedIn profiles opening in a new tab (`target="_blank" rel="noopener noreferrer"`), accessible names ("LinkedIn profile of … (opens in a new tab)"); polished portrait slots (no legitimate photos available) — see `research/06-verified-facts.md` |
| Founding year | Placeholder replaced with **2021** (independent sources) |
| JSON-LD | `foundingDate`, founders with `jobTitle` (Payal: Co-founder & CEO; Anik: Co-founder) and LinkedIn `sameAs` |
| a11y fix | axe flagged `label-content-name-mismatch` on the new LinkedIn links (aria-label didn't contain visible text) → replaced with visible text + visually-hidden suffix |
| New test suites | `keyboard.cjs`, `functional.cjs`, `delivery.mjs`; schema.org and XSD validation |
| Test-harness bugs found and fixed (not site bugs) | link-name check ignored image alt text; new-tab check aborted before recording URL; keyboard check measured focus styles before Chrome applied them |

## Known items (not site defects)
| Item | Impact | Resolution |
|---|---|---|
| Netlify "Powered by Netlify" badge (free plan, edge-injected) | 2 console errors/page, Lighthouse BP 92, **one empty keyboard focus stop at page end** (its iframe) | Turn the badge off in Netlify (Project configuration → General). Our CSP is intentionally not weakened |
| LinkedIn (3 links) and IBS Intelligence return 403/999 to automated checks | Can't be verified from here | URLs sourced from funngro.com / Inc42 / eChai; open fine for logged-in humans |
| funngro.com intermittently resets connections | Occasional link-check noise | Re-checked in a browser: 200 |
| One earner photo compresses poorly | ~20 KB Lighthouse "image delivery" estimate | Accepted; total weight well under budget |

## Not tested / limits
- Real devices (iOS Safari, low-end Android) — Chromium emulation only.
- Screen readers (VoiceOver/TalkBack) — structure verified via axe and markup review.
- Google Rich Results Test (manual web tool) — Schema.org validator used instead.
- Founder LinkedIn pages could not be opened (login wall); verification relies on cross-referenced sources.
