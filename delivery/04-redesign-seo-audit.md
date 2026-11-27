# 04 · Redesign — SEO audit (concise)

**Subject:** the two new pages only — `/earn` and `/about` — on the evaluation deploy https://funngro-revamp-evaluation.netlify.app (`noindex` by design) and the local production build (`npm run build:production`). The original site is audited separately in `03-original-site-seo-audit.md`. Full version: `qa/REDESIGN-SEO-AUDIT.md`; raw results: `qa/seo-links.json`, `qa/schema-validator.json`, `qa/sitemap.*.xml`.

**Limits:** no Search Console, ranking, traffic or keyword-volume data. Keyword targets are intent-based hypotheses, not measured volumes.

## Original-site findings → redesign
| Original finding | Redesign | How verified |
|---|---|---|
| Client-side rendering (empty HTML) | **Fixed** — static HTML; H1, copy, links and JSON-LD in the server response; works with JS disabled | `seo-links.cjs` checks server HTML; no-JS test |
| `/teen` fake URL | **Fixed** — server 301 to `/earn` | curl |
| Soft 404s | **Fixed** — real 404 status + page | curl |
| Canonical conflict | **Fixed** — absolute self-canonical to the final URL | automated check |
| Wrong social tags | **Fixed** — per-page OG/Twitter + 1200×630 images | `delivery.mjs` |
| Title changes after JS | **Fixed** — one title/description in the HTML | automated check |
| Inconsistent entity data | **Fixed** — legal name Wishbanc Technologies Private Limited, square logo, verified `sameAs` only | schema.org validator |
| Keyword stuffing | **Fixed** — natural copy, topic in title and H1 | review |
| Duplicate schema, keywords meta, trailing-slash duplicates | **Fixed** — one JSON-LD graph per page; 301s to clean URLs | curl, validator |

## On-page
| | `/earn` | `/about` |
|---|---|---|
| Title | Earn Money Online as a Teen in India — Funngro (46) | About Funngro — Our Mission, Founders & Story (45) |
| Description | 148 characters | 149 characters |
| H1 | Earn your first income online, from real brands. | Built so young Indians can earn for real. |
| Headings | One H1, no skipped levels | One H1, no skipped levels |
| Structured data | WebPage, WebSite, Organization, MobileApplication (free; no ratings), BreadcrumbList, FAQPage (generated from visible FAQ) | AboutPage, Organization (foundingDate 2021; founders with verified jobTitle + LinkedIn), BreadcrumbList |
| Images | All with alt + width/height; AVIF/WebP/JPEG `srcset`; LCP image prioritised | same |

## Validation
| Check | Result |
|---|---|
| validator.schema.org | **0 errors** on both pages |
| sitemap.xml vs sitemaps.org XSD | **Valid** (evaluation and production) |
| robots.txt | Evaluation `Disallow: /`; production `Allow: /` + Sitemap |
| Evaluation noindex | `<meta name="robots" content="noindex, nofollow">` + `X-Robots-Tag: noindex, nofollow` + robots.txt — confirmed live |
| Lighthouse SEO | Evaluation **69** (because it is blocked from indexing — intended); production build **100** on both pages, mobile and desktop |
| Links | Internal: all pass. External: 27 of 31 verified automatically; LinkedIn ×3 and IBS Intelligence block automated clients |

## Recommendations before any production launch
Resolve the placeholders and confirmations in `08-funngro-confirmation-items.md`; build with `DEPLOY_TARGET=production`; keep the `/teen` 301; submit the sitemap in Search Console; run Google's Rich Results Test; fix the live host's site-wide issues (www/apex canonicals, soft 404s on other routes), which this two-page build can't change.
