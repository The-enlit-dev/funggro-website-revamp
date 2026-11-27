# 05 — Preliminary SEO & performance audit (live site)

All results below come from commands I ran on 2026-11-27 (curl, Playwright, Lighthouse 12-series via Chromium, axe-core). Lighthouse numbers are **single lab runs from a cloud container** — treat as indicative, not field data. **No Google Search Console, rankings or traffic data was available**, so nothing here claims anything about current rankings.

## Lighthouse (lab)
| Page | Form | Perf | A11y | Best-Pr. | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 85 | 100 | 100 | 100 | 2.0 s | 2.0 s | 470 ms | 0.039 |
| `/` | desktop | 99 | 100 | 100 | 100 | 0.6 s | 0.6 s | 30 ms | 0.066 |
| `/earn` | mobile | 88 | 100 | 100 | 100 | 1.0 s | **3.4 s** | 220 ms | 0 |
| `/earn` | desktop | 91 | 96 | 100 | 100 | 0.3 s | 0.9 s | 0 | **0.181** |
| `/about` | mobile | 91 | 100 | 100 | 100 | 1.0 s | **2.9 s** | 250 ms | 0.025 |
| `/about` | desktop | 99 | 100 | 100 | 100 | 0.3 s | 0.9 s | 0 | 0.038 |

Lighthouse's SEO category only checks basics (title, meta, crawlability) — a score of 100 does **not** mean the SEO is sound. The real problems are below.

## Findings (most important first)
| # | Finding | Evidence | Severity |
|---|---|---|---|
| S1 | **Client-side rendering.** Raw HTML of every page is a ~4 KB shell with no `<h1>`, no body text, no internal content. Search engines and AI crawlers that don't run JS see nothing. | `raw/earn.plain.html`, `raw/home.html` | **High** |
| S2 | **`/teen` is not a real URL.** It isn't in the sitemap, returns HTTP 200 with the *homepage* shell (title "Funngro — Earn online…"), and only a JavaScript redirect sends browsers to `/earn`. It is duplicate content and an unreliable redirect. (One earlier request to `/teen` was also reset by the server — a single occurrence; unconfirmed whether it repeats.) | curl, `raw/teen.headers` | **High** |
| S3 | **Soft 404s.** `/nonexistent-page-xyz` returns HTTP 200 with the homepage shell instead of a 404. | curl | High |
| S4 | **Canonical conflict.** Canonical tags point to `https://funngro.com/…` (non-www), but that URL 301-redirects to `https://www.funngro.com/…`, and the sitemap + robots.txt use `www`. Canonicals should name the final URL. | rendered `<link rel=canonical>`, curl 301 | High |
| S5 | **Social tags wrong on inner pages.** Rendered `/earn` still has the homepage `og:title`, `og:description` and `og:url` (`https://funngro.com/`). Shares of the Teen page will preview as the homepage. | `raw/teen.desktop.json` | Medium |
| S6 | **Titles/descriptions differ before and after JS.** `/earn`: raw title "How to Earn Online as a Teen in India \| Funngro" vs rendered "Earn Money Online Through Online Jobs & Remote Work". Home: raw "Funngro — Earn online with India's biggest brands" vs rendered "Earn Money Online with India's Biggest Brands \| Funngro". Which one Google keeps is unpredictable. | raw vs rendered | Medium |
| S7 | **Brand spelling "Funngro" vs the brief's "Funggro".** Keywords/branding must follow the real spelling; also consider misspelling queries. | all pages | Decision needed |
| S8 | **Entity data inconsistent.** JSON-LD `legalName` "Funngro Innovations Pvt Ltd" vs footer "Wishbanc Technologies Private Limited"; Organization `logo` points at `og-image.jpg` (a 1200×630 social image), not a logo. | `raw/home.html` | Medium |
| S9 | **Copy keyword-stuffed on `/earn`** ("online work for earning", "earning app without investment"…); H1 doesn't contain the audience term "teen". | page text | Medium |
| S10 | JSON-LD is mostly sound (Organization, WebSite, BreadcrumbList, FAQPage on `/earn`, MobileApplication on home) but Organization/WebSite are **duplicated** (shell + per-route). FAQ rich results in Google are largely restricted today, so FAQPage markup is unlikely to produce visible gains. | `raw/*.json` | Low |
| S11 | Obsolete `<meta name="keywords">`; ignored by Google. `/about/` (trailing slash) serves a duplicate (canonical mitigates). | `raw/home.html`, curl | Low |
| S12 | **Positive:** valid robots.txt + sitemap (40 URLs, `www`), HTTPS + HSTS, apex→www 301, `lang="en-IN"`, 0 images missing alt on the homepage, mobile viewport set, 0 console errors. | curl / crawl | — |

## What the redesign should do about it (proposal for Phase 2 — not built yet)
Static or pre-rendered HTML with real content in the source; one canonical URL per page (`/teen` and `/about` or whatever slugs you approve, with a true 301 from the old routes if the client controls the host); correct per-page title, description, OG/Twitter tags; one clean JSON-LD set; sitemap.xml + robots.txt; image optimisation; fix CLS/LCP.
**Important limit:** I cannot change the live funngro.com server. Anything outside the delivered two pages (redirects on their host, canonical on other pages) will be documented as recommendations.
