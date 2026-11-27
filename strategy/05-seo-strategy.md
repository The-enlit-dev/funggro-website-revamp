# 05 — SEO strategy (per page)

**Data limits:** no Search Console, keyword-volume or backlink data is available (Ahrefs/Similarweb not authorised). Keyword targets below are **intent-based hypotheses** drawn from the live site's own titles/meta, the store listing language and the audience research — not measured volumes. Recommendation: validate with Google Keyword Planner / Search Console before launch.

## Foundations (both pages)
| Area | Plan | Fixes Phase-1 finding |
|---|---|---|
| Rendering | Static HTML: all content, headings, links and JSON-LD in the source | S1 (client-side rendering) |
| URLs | `/earn` and `/about` (match live URLs to keep equity); Netlify serves `earn.html`/`about.html` | — |
| Redirects | Netlify `_redirects`: `/teen` → `/earn` **301**; `/earn/` and `/about/` → no-slash 301; real **404 page** with HTTP 404 | S2, S3, S11 |
| Canonical | Absolute, self-referencing, final URL. Build variable `SITE_URL`. On the evaluation/preview domain: canonical to that domain **and** `X-Robots-Tag: noindex` so it never competes with funngro.com. If adopted on funngro.com: `https://www.funngro.com/earn` | S4 |
| Meta | Unique title (≤60 chars) and description (≤155) per page; matching OG/Twitter tags with per-page URL and a per-page 1200×630 OG image | S5, S6 |
| Headings | One H1 with the primary topic; logical H2/H3 | S9 |
| Copy | Natural language; topic covered by meaning, not repetition | S9 |
| Images | Descriptive alt, AVIF/WebP, dimensions set, lazy-loaded | CLS/LCP |
| Structured data | One JSON-LD graph per page, no duplicates, values only from facts register | S8, S10 |
| Sitemap/robots | `sitemap.xml` (2 URLs + lastmod) and `robots.txt`; on preview domain robots disallows all | — |
| Performance | Core Web Vitals targets: LCP <2.5s, CLS <0.1, INP <200ms on mobile | Lighthouse findings |
| Internal links | Teen ↔ Company with descriptive anchors; outbound to funngro.com sections | — |

## Teen page `/earn`
- **Primary intent:** "how can a teenager earn money online in India (safely)".
- **Target topics (hypotheses):** earn money online as a teen in India · online earning app for students · part-time work from home for students · paid tasks / brand tasks · earn without investment · is Funngro safe/legit · how to withdraw to UPI.
- **Title (46 chars):** `Earn Money Online as a Teen in India — Funngro`
- **Description (148 chars):** `Do paid tasks for real brands — surveys, referrals, content and brand promotion. Free to join for ages 14–25. Withdraw what you earn to UPI or bank.`
- **H1 (draft):** "Earn your first income online — with real brands" (final wording in Phase 4; must contain "earn" + "online").
- **H2s:** What you can do · How Funngro works · Start small, grow, lead · Real earners · Safe by design · Questions teens and parents ask.
- **Schema:** `WebPage` + `BreadcrumbList` + `MobileApplication` (name, OS, category, offers price 0, download URLs; **no aggregateRating** unless the client approves using store figures and they're shown on the page) + `FAQPage` only for the visible Q&As (low rich-result value today; kept for clarity, not as a ranking tactic).
- **E-E-A-T signals:** company facts block + link to Company page, dated store rating, real earner stories, safety rules.

## Company page `/about`
- **Primary intent:** navigational / trust — "Funngro", "who owns Funngro", "Funngro founder", "Funngro Shark Tank", "is Funngro real".
- **Title (45 chars):** `About Funngro — Our Mission, Founders & Story`
- **Description (149 chars):** `Funngro helps young Indians aged 14–25 earn from real brand projects. Meet the founders, the team that grew from our users, and our Shark Tank story.`
- **H1:** "Built so young Indians can earn for real."
- **Schema:** `AboutPage` + `Organization` (`name` Funngro, `legalName` Wishbanc Technologies Private Limited, `url`, `logo` = a real square logo file, `address`, `founder` Persons by name only, `email`, `sameAs` **only verified** profiles — Instagram excluded until confirmed) + `BreadcrumbList`.

## Off-page / host recommendations (outside the two delivered pages — documented, not done by me)
- Fix canonical host (www vs apex) and soft 404s site-wide on funngro.com.
- Remove duplicate Organization/WebSite JSON-LD and the `keywords` meta.
- Align the store listing, site and press kit on one set of numbers.
- Register/verify the domain in Google Search Console and submit the sitemap.
