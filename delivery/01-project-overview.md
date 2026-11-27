# 01 · Project overview

## The brief
> "Click in Company/Teen page and create a 2 page design for Funggro."

A two-page redesign of **Funngro** (the brand's official spelling — the brief's "Funggro" is a typo), produced as a website-development evaluation. The brief asked for research, strategy, design, development, SEO, testing and a delivery package, with no invented company information.

| Brief term | Page on the live site | Redesigned page |
|---|---|---|
| Teen | `funngro.com/teen` → client-side redirect to `/earn` ("How it works") | **`/earn`** |
| Company | Footer column "Company" → `/about` | **`/about`** |

Live evaluation site: https://funngro-revamp-evaluation.netlify.app/earn · https://funngro-revamp-evaluation.netlify.app/about (`noindex` — see §Results).

## 1 · Research (what we found)
- **The live site is a client-side-rendered React app.** Its HTML is an empty ~4 KB shell: no headings or content for crawlers that don't run JavaScript; `/teen` returns the homepage shell with HTTP 200; unknown URLs return 200 (soft 404s); canonicals point to a redirecting host.
- **Teen page:** no imagery, three sections repeating the same idea (≈13 phone screens), search-engine-stuffed copy, one call to action, nothing for parents.
- **Company page:** no faces, unbalanced layout, contradictory facts.
- **Funngro's own sources contradict each other** — founder titles (About vs Press), founding year, user counts (70 lakh vs 60 lakh vs 50L+ verified downloads), payout speed, withdrawal fees. This shaped the project's most important rule: **only verified facts go on the page.**
- **Hidden technical defects:** the live site's headline and number fonts (Instrument Serif, JetBrains Mono) don't contain the ₹ glyph; brand green with white text is 3.0:1 (fails WCAG).
Full reports: `research/01–05`; facts register: `research/06-verified-facts.md`.

## 2 · Strategy
- **Teen page = the promise:** turn a sceptical 14–25-year-old into a download by showing exactly what the work is, what it pays and why it's safe — with a block that reassures the parent looking over their shoulder.
- **Company page = the proof:** faces, accountability, investors, press — for parents, brands, journalists and recruits.
- Messaging: *Real work. Real brands. Real pay.* — specific, honest, no hype ("#1", "instant money" and unverifiable statistics removed).
- Facts policy: Tier A (independently verified) and Tier B (consistently published by Funngro) only; unresolved items shown as visible "To be confirmed" placeholders.
Documents: `strategy/01–06`.

## 3 · Design
Three directions were explored and rendered as boards (`design/concepts/`): **Night Ledger** (dark editorial), **Sticker Book** (warm paper, ink, photo "stickers"), **Clear Signal** (bright product-grade). **Sticker Book** was approved, in a deliberately premium interpretation:
- Warm paper ground, strong ink type, Funngro green; one highlighter phrase per section; tilts and hard shadows used sparingly; the Company page uses a calmer register.
- Type: **Bricolage Grotesque** + **Figtree**, self-hosted and subset (≈82 KB total) — both verified to contain ₹.
- Real Funngro photography and app screens; no stock photos; no emoji or AI-template patterns (dark glow, italic accent words, tracked mono labels).
Documents: `design/01–04` (research, concepts, design system, implementation spec).

## 4 · Implementation
- **Static HTML + modern CSS + ~4 KB vanilla JS** (progressive enhancement — both pages work fully without JavaScript). Small Node build: partials, `<picture>` generation, CSS bundling, target-aware SEO files.
- Responsive AVIF/WebP/JPEG images; official store badges; a desktop QR code to Google Play; per-page Open Graph images.
- **Netlify:** clean URLs, `/` → `/earn` (302), `/teen` → `/earn` (301), real 404, security headers (strict CSP), immutable asset caching, Brotli.
- **Evaluation vs production builds:** the evaluation deploy is `noindex` (meta, `X-Robots-Tag`, robots.txt). A production build for www.funngro.com is indexable and is only produced on request.
- Co-founder section researched and completed with verified titles, sourced bios and each founder's own LinkedIn profile (opens in a new tab).

## 5 · Results (all measured on the live evaluation site unless noted)
| Area | Result |
|---|---|
| Lighthouse (median of 3) | Performance **100** and Accessibility **100** on both pages, mobile and desktop. Production build: **100 / 100 / 100 / 100** |
| Accessibility | axe-core **0 violations**; full keyboard walk-through passes; contrast verified |
| Functional | All interaction, link, QR, redirect and no-JS tests pass |
| SEO | Static HTML, valid structured data (schema.org validator: 0 errors), XSD-valid sitemap, per-page metadata and social previews |
| Original-site defects fixed | Client-side rendering, fake `/teen` URL, soft 404s, canonical conflict, wrong social tags, duplicate schema, keyword stuffing |
Details: `06-performance-lighthouse.md`, `05-qa-accessibility-report.md`.

## 6 · What is outstanding
Funngro-supplied items (founder portraits, Anik Jain's LinkedIn confirmation, parental-consent wording, SucSEED relationship, consent to reuse earner stories, QR target, Instagram handle) and one platform item (Netlify's free-plan badge). See `08-funngro-confirmation-items.md`.
