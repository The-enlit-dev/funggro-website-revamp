# 06 · Lighthouse & performance

All Lighthouse figures are **lab data** (Lighthouse's default mobile throttling and desktop preset), **median of 3 runs**, from a cloud container. Reports: `qa/lighthouse/*.html` (live) and `qa/lighthouse-local-production/*.html` (production build).

## Redesign — live evaluation site (27 Nov 2026, deploy `6b090ca38c025a4dcdb877d0`)
| Page | Device | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Page weight |
|---|---|---|---|---|---|---|---|---|---|---|
| `/earn` | Mobile | **100** (99/100/100) | **100** | 92* | 69† | 0.9 s | 0.9 s | 40 ms | 0 | 245 KiB |
| `/earn` | Desktop | **100** | **100** | 92* | 69† | 0.3 s | 0.3 s | 0 ms | 0 | 219 KiB |
| `/about` | Mobile | **100** | **100** | 92* | 69† | 0.9 s | 0.9 s | 30 ms | 0 | 215 KiB |
| `/about` | Desktop | **100** | **100** | 92* | 69† | 0.3 s | 0.3 s | 0 ms | 0 | 200 KiB |

\* Best Practices: only "errors in console / issues" from Netlify's injected badge being blocked by our CSP.
† SEO: "page is blocked from indexing" — the intended `noindex` on the evaluation site.

## Redesign — production build (indexable; served locally, 27 Nov 2026)
| Page | Device | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS | Weight |
|---|---|---|---|---|---|---|---|---|---|
| `/earn` | Mobile | **100** | **100** | **100** | **100** | 1.1 s | 0 ms | 0 | 224 KiB |
| `/earn` | Desktop | **100** | **100** | **100** | **100** | 0.2 s | 0 ms | 0 | 206 KiB |
| `/about` | Mobile | **100** | **100** | **100** | **100** | 0.8 s | 40 ms | 0 | 180 KiB |
| `/about` | Desktop | **100** | **100** | **100** | **100** | 0.2 s | 0 ms | 0 | 175 KiB |

## Before → after (original funngro.com pages, single lab runs, same tool)
| Page | Metric | Original | Redesign (live) |
|---|---|---|---|
| Teen (`/earn`) mobile | Performance | 88 | **100** |
| | LCP | 3.4 s | **0.9 s** |
| Teen desktop | CLS | 0.181 | **0** |
| | Accessibility | 96 | **100** |
| Company (`/about`) mobile | Performance | 91 | **100** |
| | LCP | 2.9 s | **0.9 s** |
The original site's Lighthouse SEO score was 100 while its real SEO problems (client-side rendering, fake `/teen` URL, soft 404s) went undetected — see `03-original-site-seo-audit.md`.

## Core Web Vitals (lab)
| Metric | Target | Result |
|---|---|---|
| LCP | < 2.5 s | 0.8–1.1 s mobile (throttled), 0.2–0.3 s desktop |
| CLS | < 0.1 | 0 on every page |
| INP | < 200 ms | Not measurable in Lighthouse; lab Event Timing during taps on menu/FAQ/carousel: max **32 ms** (`keyboard.cjs`) |
No field (CrUX) data exists for a new evaluation URL.

## What makes it fast
- Static HTML with all content in the response; ~4 KB of JavaScript, loaded as a deferred module.
- Fonts: two variable families, self-hosted, instanced/subset to ≈82 KB total, preloaded, `font-display: swap`, metric-matched fallbacks; ₹ served from 1–1.5 KB subsets.
- Images: AVIF → WebP → JPEG with `srcset`; explicit dimensions (no layout shift); hero image prioritised, the rest lazy-loaded.
- Netlify: Brotli on text assets; content-hashed assets cached for a year (`immutable`); HTML always revalidated.
- Remaining Lighthouse suggestion: ~20 KB estimated saving on one detailed earner photo — accepted.
