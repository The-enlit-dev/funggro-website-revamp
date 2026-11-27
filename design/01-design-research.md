# 01 — Competitor-inspired design research

Method: rendered in Chromium on 2026-11-27, desktop 1440 + mobile 390; screenshots in `design/references/` and `research/competitors/`. Observations are mine; no user testing.

## Reference set
| Site | Why it's relevant | What it does well | What to avoid |
|---|---|---|---|
| **FamApp** (famapp.in, formerly FamPay) | Indian teen-first UPI app — same audience | Collage / zine aesthetic: torn paper, halftone, sticker type, tilted 3D phone. Instantly reads "made for Gen Z", not "bank" | Heavy imagery, almost no text in source (no `<h1>`) → weak SEO |
| **Jar** (myjar.app) | Indian Gen-Z savings app | Real people front and centre; a visible **fraud-warning card** ("We do NOT ask for OTP…") — trust as a design element | Generic Inter UI; cluttered pop-ups |
| **CRED** (cred.club) | Premium Indian fintech benchmark | Cinematic dark, big editorial serif, restraint; **QR "download" block on desktop** solves "I'm on a laptop, the product is an app" | Mystique over clarity; no `<h1>` |
| **PickMyWork** | Direct-ish competitor (gig earning) | Clear earning headline | Hype ("₹50K+ monthly"), template feel |
| **EarnKaro** | Earning via affiliate links | Brand-logo wall, short FAQ | Generic visuals |
| **Internshala** | Student career platform | Student social proof (placement counts, stories) | Dense, utilitarian |
| **Funngro today** | Baseline | Strong copy voice, real app screens on home | Dark-glow + italic-serif + mono-caps look is very close to the default output of AI site builders (the page HTML also loads a `/__l5e/` analytics script with a `lovp_` project token, consistent with being built on an AI builder — an inference, not confirmed) |

## Patterns worth adopting
1. **Real people + real UI** beat illustrations and stock (Jar, FamApp, Funngro's own assets).
2. **Trust as a visible component** — a safety card / fraud warning (Jar) maps directly to the teen "is this fake?" fear.
3. **Desktop QR download** (CRED) — the page converts to an app, so desktop visitors need a phone hand-off.
4. **Tactile, collage-like Gen-Z language** (FamApp) differentiates from banks and from AI-template sites.
5. **Editorial typography with restraint** (CRED) signals quality; huge type + few elements per screen.

## Patterns to avoid ("generic AI website" checklist)
- Dark background + green/purple radial glow + glassy cards everywhere.
- Italic-serif "accent word" in every heading.
- Tiny letter-spaced mono-caps eyebrow above every section (`· CHAPTER ONE ·`).
- Identical three-card rows and bento grids repeated down the page.
- Emoji as icons; stock 3D blobs; gradient text.
- Fade-up-on-scroll applied to every element.
- Superlatives and fake live tickers.

## Technical observations that inform design
- **₹ glyph support:** Instrument Serif and JetBrains Mono (both used on the live site), Instrument Sans, Sora, Outfit, DM Mono and others **lack ₹** — it silently falls back to a system font. All proposed faces were verified to contain ₹ (canvas width test against two different fallbacks).
- **Brand green #07AB5F + white text = 3.0:1** (fails WCAG AA for body text). Green surfaces must carry dark ink text (5.7–6.0:1).
- Audience devices: published earner stories are heavily Tier-2/3 → design for mid/low-end Android: limited JS, no video autoplay, small font payloads.
