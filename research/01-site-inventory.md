# 01 — Site inventory & identifying the "Company" and "Teen" pages

Crawled: 2026-11-27 with Playwright (Chromium, desktop 1440px + mobile 390px). Raw data in `research/raw/`, screenshots in `research/screenshots/`.

## Brand spelling
The brand is **Funngro** (two n's), not "Funggro". The brief and repo use "Funggro". Every page on the live site, the legal footer and the domain use "Funngro". **Needs your decision** — see PROJECT_STATUS.md.

## How the site is built
- Client-side rendered React single-page app (Vite bundle). The raw HTML is a ~4 KB empty shell (`<div id="root">`); all content appears only after JavaScript runs.
- Dark theme only. Fonts (self-hosted): Instrument Serif (headlines), Work Sans (body), JetBrains Mono (labels). Green accent on near-black (`theme-color #0b0f0d`).
- Languages: EN / Hi-En (Hinglish) / हिं toggle.
- Primary nav: Earn · Stories · For Brands · Arcade · SheLancer · About · Blog, plus a "Download" button.
- Footer columns: EARN (How it works, Stories, Arcade, SheLancer) · BRANDS (For brands, Contact sales) · **COMPANY** (About, Careers, Press, Trust & safety, Blog, FAQ, Contact) · LEGAL.

## The two pages from the brief ("Company / Teen")
| Brief says | What exists on the live site | Evidence |
|---|---|---|
| **Teen** page — `https://www.funngro.com/teen` | `/teen` is **not a real page in the sitemap**. In a browser it loads and the app **redirects client-side to `/earn`** ("How it works", H1: *Start your online earning journey in five simple steps.*). A plain HTTP request to `/teen` returns HTTP 200 with the *homepage* shell (not a redirect), and one early request was reset by the server. | `raw/teen.desktop.json` (final URL `/earn`), `raw/teen.headers`, curl results in 05-seo-audit |
| **Company** page — no URL given | There is no page called "Company". **Company** is a footer column; its anchor page is **`/about`** ("Built so young Indians can earn for real."). | footer text in `raw/about.desktop.json` |

**Working assumption (not yet approved):** Page 1 = Teen / How it works (`/earn`, reached via `/teen`). Page 2 = Company / About (`/about`).
**Uncertain:** whether "Company" in the brief means About, or the whole Company column (Careers, Press, Trust). Needs your confirmation.

## Full page map (from sitemap.xml, 40 URLs; all rendered with HTTP 200, 0 console errors, 0 failed requests)
Home `/` · `/earn` · `/for-brands` · `/stories` (+7 story pages) · `/arcade` · `/shelancer` · `/about` · `/blog` (+16 posts) · `/trust` · `/faq` · `/contact` · `/press` · `/careers` · `/privacy-policy` · `/terms-and-conditions`.
`/teen` is **not** in the sitemap.

## Structure of the two target pages (as they are today)

### /earn — "How it works" (Teen)
Hero (H1 + 2 CTAs) → Chapter 1: 5 steps (Download → Pick a campaign → Complete task → Instant UPI payout → Start small/build influence), each with a "what you need" box → Chapter 2: Income & Influence Ladder (₹1K–3K → ₹3K–7K → ₹7K–15K+/mo; "average active user ₹4,100/mo, top 5% ₹18,000+/mo, FY26") → Chapter 3: 6 pillars → Chapter 4: 7-step progression → Chapter 5: FAQ accordion (4 Qs) → footer.
Images on page: **0**. Page length: 6,303px desktop / 11,001px mobile.

### /about — "Company"
Hero → Founders (Payal Jain, CEO; Anik Jain, CFO, both with LinkedIn) → Journey timeline (FY22 → FY26, 5 milestones) → "Teenlancer Engine" (100 young Indians run the company: Support, QA, Content & Design, Community/Clans) → Backed by (Shark Tank India S2, Amit Jain / SucSEED Indovation) → Careers CTA → footer.
Images on page: **0** (no founder or team photos). Page length: 4,279px desktop / 6,438px mobile.

## Inaccessible / unverifiable
- **Instagram** (`instagram.com/funngro/` as given): redirects to the Instagram login wall; not inspectable. The site itself links `instagram.com/fun.n.gro` — a **different handle** from the one you gave. Which is official is unconfirmed.
- Play Store / App Store listings, press articles: not crawled in depth (only surfaced via search).
- FAQ answers are hidden in an accordion; I opened the ones that mattered (eligibility, safety, earnings).
