# 03 · Original website — SEO audit (concise)

**Subject:** the live funngro.com pages as they were on **2026-11-27** — `/earn` (Teen) and `/about` (Company), plus the homepage for context. **This audit is about Funngro's current site only**; the redesign is audited separately in `04-redesign-seo-audit.md`. Full version and raw evidence: `research/05-seo-audit-preliminary.md`, `research/raw/`, `research/lighthouse/`.

**Method:** curl (raw HTML, status codes, headers), Playwright (rendered DOM), Lighthouse (single lab runs from a cloud container), axe-core. No Search Console, ranking or keyword-volume data was available, so nothing here describes current rankings.

## Lighthouse (original site, lab, single run)
| Page | Form | Perf | A11y | Best pr. | SEO | LCP | CLS |
|---|---|---|---|---|---|---|---|
| `/earn` | mobile | 88 | 100 | 100 | 100 | 3.4 s | 0 |
| `/earn` | desktop | 91 | 96 | 100 | 100 | 0.9 s | 0.181 |
| `/about` | mobile | 91 | 100 | 100 | 100 | 2.9 s | 0.025 |
| `/about` | desktop | 99 | 100 | 100 | 100 | 0.9 s | 0.038 |
Lighthouse's SEO score only checks basics; the problems below don't show up in it.

## Findings (most important first)
| # | Finding | Severity |
|---|---|---|
| 1 | **Client-side rendering:** raw HTML of every page is a ~4 KB shell with no `<h1>`, body text or links — invisible to crawlers that don't run JavaScript | High |
| 2 | **`/teen` isn't a real URL:** not in the sitemap; returns HTTP 200 with the homepage shell; only a JavaScript redirect reaches `/earn` (duplicate content) | High |
| 3 | **Soft 404s:** unknown URLs return HTTP 200 with the homepage shell | High |
| 4 | **Canonical conflict:** canonicals point to `https://funngro.com/…`, which 301-redirects to `www`; sitemap and robots use `www` | High |
| 5 | **Social tags wrong on inner pages:** `/earn` carries the homepage's og:title/description/url | Medium |
| 6 | **Title/description change after JavaScript runs** (raw vs rendered differ) | Medium |
| 7 | **Entity data inconsistent:** JSON-LD legalName "Funngro Innovations Pvt Ltd" vs footer/store "Wishbanc Technologies Private Limited"; logo points to the OG image | Medium |
| 8 | **Keyword-stuffed copy** on `/earn`; H1 lacks the audience term | Medium |
| 9 | Duplicated Organization/WebSite JSON-LD; obsolete `keywords` meta; trailing-slash duplicates | Low |
| 10 | Performance: mobile LCP 3.4 s on `/earn`; desktop CLS 0.181 | Medium |
| — | **Positives:** valid robots.txt and sitemap, HTTPS + HSTS, apex→www 301, `lang="en-IN"` | — |

## Content/fact issues relevant to SEO and trust
Contradictory claims across Funngro's own pages and store listing (founder titles, founding year, user counts, payout speed, fees, age rating) — see `07-facts-questions-assumptions.md`.
