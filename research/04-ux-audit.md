# 04 — Preliminary UX / UI audit (Teen `/earn` and Company `/about`)

Basis: rendered full-page screenshots (desktop 1440, iPhone 13 / 390), page text, axe-core, Lighthouse. Items marked **[measured]** come from a tool run; **[observed]** are my visual judgement from screenshots; judgement is mine, not user-tested.

## What already works (keep)
- Clear, confident headline copy and a distinctive editorial voice (serif display + italic green emphasis). [observed]
- Dark/green palette is on-brand and consistent across pages; no horizontal overflow on mobile (scrollWidth = 390). [measured]
- Strong, specific proof: rupee ranges per stage, "average ₹4,100, top 5% ₹18,000+", first-payout time. [observed]
- Zero console errors / failed requests on all 20 crawled page loads; Lighthouse Accessibility 96–100, Best Practices 100, SEO 100. [measured]

## Teen page (`/earn`)
| # | Finding | Severity |
|---|---|---|
| T1 | **No imagery at all** (0 `<img>`): no people, no phone UI, no brand logos. A page for teens that is only text in dark boxes feels like a document, not an invitation. | High |
| T2 | **Repetition.** Five steps, six pillars and a seven-step progression restate the same idea (start small → refer → create → lead). On mobile the page is ~11,000px (≈13 screens) before the FAQ. | High |
| T3 | **Copy written for search engines, not people**: "online work for earning", "earning app without investment", "one of the best refer-and-earn apps", repeated. Reads robotic and may hurt trust with the very audience that fears scams. | High |
| T4 | **One CTA only** (Download). No QR/store badges, no "is this safe?" path for a nervous teen or parent; Trust & safety lives on another page and is not linked from the body. | High |
| T5 | **No parent reassurance** and the site's own age rule (14–25 per FAQ) isn't stated on the page. | Medium (needs client facts) |
| T6 | **Unexplained jargon**: Clan Leader, Starter → Grower → Builder, GroMoney. | Medium |
| T7 | The ₹ ladder is the best content on the page but is shown as three small identical cards; the income figures don't dominate. | Medium |
| T8 | FAQ has only 4 questions; the full FAQ (35 Qs) is a separate page and isn't linked from this one. | Low |
| T9 | Desktop CLS 0.181 (above the 0.1 "good" threshold); mobile LCP 3.4 s (above 2.5 s). [measured] | Medium |

## Company page (`/about`)
| # | Finding | Severity |
|---|---|---|
| C1 | **No photos** — founders (IIM Calcutta, Shark Tank) and the "100 young Indians" team are described but never shown. For a trust page, faces are the proof. | High |
| C2 | Founder cards fill ~⅔ of the width and leave a large empty right third on desktop; layout feels unfinished. [observed] | Medium |
| C3 | The "Teenlancer Engine" — the company's real differentiator (a company run by its own users) — is a small 4-box strip, visually weaker than the generic founder block. | Medium |
| C4 | Timeline is plain text on a left rule; the growth story (1M → 3M → 70L users) is not visualised. | Medium |
| C5 | **Inconsistent facts on the page**: founded "FY22" in the timeline, "started in 2022" in the hero; "3M users" (Q4 FY25) vs "70 Lakh+" (FY26) with no explanation; investors named differently in the founder bio vs the "Backed by" card. Needs client confirmation (see doc 02). | Medium |
| C6 | Footer in the Company column duplicates the nav; no contact route on the page itself (email only in footer mailto). | Low |

## Sitewide UI issues seen on both pages
- **Accessibility [measured, axe-core, lab]:** `label-content-name-mismatch` (language toggle "Switch to Hinglish" and the Download button's accessible name don't contain their visible text) on 3 of 4 desktop runs; `color-contrast` failures and 2 `scrollable-region-focusable` on the homepage (not a target page, but shows the system); `/about` desktop has 1 color-contrast failure. Some contrast hits were sampled on elements mid-fade-in, so they need re-checking after the redesign rather than being treated as final.
- **Touch targets [measured]:** 29–35 interactive elements per mobile page measure under 44×44px (many are inline/footer links; Lighthouse flagged touch targets on desktop `/earn`). Treat as a prompt to design bigger targets.
- **Dark-only theme** (`class="dark"`); no light option. Fine as a brand choice, but low-contrast muted text (e.g. `#35473b` on `#0a150e`, ratio 1.87:1 — homepage) shows the risk of the very dark palette.
- Heavy reliance on tiny mono-caps labels (`· CHAPTER ONE · FIVE STEPS ·`) in low-contrast green — decorative but hard to read.

## Opportunities for the redesign (not decisions yet)
1. Show people and product: real phone UI, brand logos, founders/team photography (client-supplied).
2. Cut the Teen page's repetition into one clear journey + one big earnings visual + a trust/parent block.
3. Rewrite SEO-stuffed copy into natural language that still targets the same topics.
4. Make the Company page a trust page: faces, the Teenlancer engine as the hero idea, growth numbers visualised with client-verified figures.
