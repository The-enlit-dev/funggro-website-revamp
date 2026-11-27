# SEO audit — redesigned pages (`/earn`, `/about`)

**Scope:** the two pages built in this repository. This is separate from the audit of the current live funngro.com site (`research/05-seo-audit-preliminary.md`), which is unchanged.
**Tested:** 2026-11-27 (Phase 4 final re-check), evaluation deploy https://funngro-revamp-evaluation.netlify.app (`noindex` by design) and a local production build (`npm run build:production`).
**Limits:** no Search Console, ranking, traffic or keyword-volume data; nothing here claims ranking outcomes.

## Before → after (findings from the original-site audit)
| # | Original-site finding | Redesign status | Evidence |
|---|---|---|---|
| S1 | Client-side rendered: empty HTML shell, no H1/content for non-JS crawlers | **Fixed** — static HTML; H1, all copy, links and JSON-LD in server response; pages fully visible with JS disabled | `seo-links.json` checks "h1 present in server HTML", `interactions.cjs` no-JS test |
| S2 | `/teen` not a real URL (200 homepage shell + JS redirect) | **Fixed** — server-side **301** `/teen` → `/earn` | curl |
| S3 | Soft 404s (unknown URLs → 200) | **Fixed** — real **404** status + custom page | curl |
| S4 | Canonical pointed to non-www URL that redirects | **Fixed** — absolute self-canonical to the final URL (`SITE_URL`); production = `https://www.funngro.com/earn` / `/about` | built HTML |
| S5 | Inner pages reused homepage OG tags | **Fixed** — per-page og:title/description/url/image (1200×630 per page) + Twitter card | `seo-links.json` |
| S6 | Title/description changed after JS ran | **Fixed** — one title/description per page, in the HTML | built HTML |
| S7 | Brand spelling | **Funngro** everywhere | — |
| S8 | JSON-LD legal name / logo mismatch | **Fixed** — `legalName: Wishbanc Technologies Private Limited`, square `logo-square.png`; `sameAs` limited to profiles linked from funngro.com (Instagram excluded — unverified) | built HTML |
| S9 | Keyword-stuffed copy; H1 without topic | **Fixed** — natural copy; H1 "Earn your first income online, from real brands."; title targets "earn money online as a teen in India" | page |
| S10 | Duplicated Organization/WebSite JSON-LD | **Fixed** — one `@graph` per page | built HTML |
| S11 | Obsolete keywords meta; trailing-slash duplicates | **Fixed** — no keywords meta; `/earn/`, `/earn.html` etc. 301 to clean URL | curl |

## Per-page on-page SEO (as built)
| Item | `/earn` | `/about` |
|---|---|---|
| Title | Earn Money Online as a Teen in India — Funngro (46) | About Funngro — Our Mission, Founders & Story (45) |
| Description | 148 chars | 149 chars |
| H1 | Earn your first income online, from real brands. | Built so young Indians can earn for real. |
| Heading order | No skipped levels | No skipped levels |
| JSON-LD | WebPage, WebSite, Organization, MobileApplication (price 0 INR, no aggregateRating), BreadcrumbList, FAQPage (generated from the visible FAQ text) | AboutPage, Organization (`foundingDate` 2021; founders as Person with verified `jobTitle` and LinkedIn `sameAs`), BreadcrumbList |
| Images | All with alt + width/height; AVIF/WebP/JPEG `srcset`; LCP image `fetchpriority=high`, others lazy | same |
| Internal links | → /about (parents card), ↔ nav, footer | → /earn ("Start earning"), nav, footer |
| `lang` | en-IN | en-IN |

## Technical
| Item | Evaluation deploy | Production build |
|---|---|---|
| robots meta | noindex, nofollow | index, follow, max-image-preview:large |
| X-Robots-Tag | noindex, nofollow | — (not sent) |
| robots.txt | Allow: / (no sitemap; lets crawlers see the noindex) | Allow: / + Sitemap |
| sitemap.xml | 2 URLs | 2 URLs (www.funngro.com) |
| Lighthouse SEO | 69 (blocked from indexing — expected) | **100** both pages, mobile + desktop |
| Core Web Vitals (lab, mobile) | LCP 0.9 s, CLS 0, TBT ≤ 70 ms | similar (local) |

## Phase 4 validation results
| Check | Result |
|---|---|
| Metadata (titles 45–46 chars, descriptions 148–149, single H1, no heading skips, lang en-IN) | Pass — `seo-links.json` |
| Canonical = final URL; og:url = canonical | Pass (evaluation host; production build → www.funngro.com) |
| Structured data — validator.schema.org | 0 errors on both pages — `schema-validator.json` |
| sitemap.xml — sitemaps.org XSD | Valid (evaluation and production) — `sitemap.live.xml`, `sitemap.production.xml` |
| robots.txt | Evaluation: `Allow: /`, no sitemap (corrected in Phase 7 — a `Disallow` would hide the noindex from crawlers); production: `Allow: /` + Sitemap — `robots.production.txt` |
| Social previews | og:image 200, image/jpeg, 1200×630, same host, per page; Twitter `summary_large_image` |
| Image alt + dimensions | All images have alt (decorative = empty) and width/height |
| Internal links | All resolve (200/301 as designed); external links 27/31 verified, 4 blocked by bot protection (LinkedIn ×3, IBS Intelligence) |
| Evaluation noindex | Confirmed: meta robots + `X-Robots-Tag: noindex, nofollow` + robots.txt |
| Lighthouse SEO | Evaluation 69 (blocked from indexing — expected); production build **100** on both pages, mobile and desktop |

## Remaining recommendations (outside these two pages)
1. If adopted on funngro.com: deploy with `DEPLOY_TARGET=production`, keep the `/teen` 301, submit the sitemap in Search Console.
2. Fix site-wide items on the live host that this build can't touch: www/apex canonical consistency and soft 404s on other routes.
3. Resolve the remaining placeholders (founder portraits, parental-consent wording, SucSEED relationship) and confirm Anik Jain's LinkedIn URL with Funngro before indexing — placeholder content shouldn't go to production.
4. Validate structured data in Google's Rich Results Test after the production deploy (not run here).
5. FAQPage rich results are restricted by Google for most sites; the markup is kept for clarity, not expected to produce rich snippets.
