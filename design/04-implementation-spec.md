# 04 — Implementation specification (Concept 2: Sticker Book, premium interpretation)

Approved inputs: Concept 2, page structures (`strategy/02`, `strategy/03`), `/` → `/earn`, noindex on the evaluation deploy only, Tier A/B facts only (`research/06-verified-facts.md`).

## 0. "Premium, not childish" — interpretation rules
| Keep from the board | Dial down for polish |
|---|---|
| Warm paper ground, ink type, Funngro green | Grid-paper texture → barely visible (3% ink), only in hero and CTA |
| Sticker-style photo cards | Max **two** tilted elements per viewport; tilt 2–6°; never on text |
| Hard offset shadows | Only on primary buttons, stickers, and focused cards; 4–6px, ink |
| Highlighter behind one phrase | One highlight per page section heading at most (hero + 1 more) |
| Bold display type | Bricolage at wdth 86, tracking −0.025em, generous leading; long copy in Figtree |
| Colour tiles | Muted tile tints (lime/sun/mint softened 20%) on the dark work section only |
Removed vs board: emoji (🦈) → custom SVG; hand-drawn arrows → one, in the hero only; "New"-type badges → none.

## 1. Tokens (final)
```
--paper #F6F1E7   --paper-2 #EFE8D9   --surface #FFFDF8   --ink #0E1A12   --ink-2 #1C2A21
--muted #56655B (5.4:1 on paper)   --line rgba(14,26,18,.12)   --line-strong rgba(14,26,18,.9)
--brand #07AB5F (fills; ink text only)   --brand-deep #067A41 (text on paper 4.8:1)
--lime #D2F28A   --sun #FFD36B   --mint #A8E6C4   --blush #F4C7B4 (decorative tints, ink text ≥ 11:1)
--on-ink #F6F1E7   --on-ink-muted #B9C4BC (≥ 9:1 on ink)   --lime-on-ink #D2F28A
```
Type: Bricolage Grotesque (variable, instanced: wdth 86 fixed, opsz 12–96, wght 500–800) for display; Figtree (variable wght 400–800) for text. ₹ served from a separate tiny subset file per family (unicode-range U+20B9). Fluid scale as in `03-design-system.md`.
Radii 10 / 14 / 22 / 28 / pill. Shadows: `--shadow-hard: 5px 5px 0 var(--ink)`; `--shadow-soft: 0 1px 0 var(--line), 0 18px 40px -24px rgba(14,26,18,.35)` (for photos/phone).
Layout: container max 1240px; side padding `clamp(20px, 5vw, 64px)`; section padding `clamp(72px, 11vw, 144px)`.

## 2. Shared components
- **Header**: 72px desktop / 64px mobile; logo left; nav centre (Earn, About, Stories↗, For brands↗, Safety↗); "Get the app" ink button right. Becomes paper + hairline + slight blur after 8px scroll. Mobile: burger → full-height sheet with large links + store badges; Esc closes; focus trapped; body scroll locked.
- **Buttons**: `.btn` ink fill / paper text / brand hard shadow; hover lifts 2px (shadow 6px); active presses to 0; focus = 3px lime halo + 2px ink outline. Secondary: surface fill, ink border, ink shadow.
- **Store badges**: official Google Play & App Store badge artwork (black), 48px tall, with descriptive accessible names. If artwork can't be fetched, fall back to text buttons with the official wording.
- **QR block** (≥1024px): QR to the Google Play listing (most Indian users are Android; final target link is a client requirement) + caption.
- **Proof pills**: surface fill, 1.5px ink border, number in Bricolage + source line in Figtree 13px + date.
- **Sticker photo card**: surface frame 10px, 1.5px ink outline, soft shadow; optional tape (sun, 40% opacity) on one card only.
- **TBC placeholder** (`.tbc`): dashed 1.5px muted border, muted text "To be confirmed", `title` + `data-tbc` naming the missing item. Rendered in the public evaluation build (approved approach).
- **Footer**: ink background; 4 link columns; legal line "© Wishbanc Technologies Private Limited · Funngro"; socials except Instagram (unverified).

## 3. Teen page `/earn` — layout spec
| § | Desktop (≥1024) | Mobile (<768) | Motion |
|---|---|---|---|
| Hero | 12-col: copy cols 1–7, collage 8–12. Chip → H1 (hero step, max 11ch/line, highlight "first income") → lede (52ch) → badges + QR → proof pills row. Collage: phone (`screen-reward`, 4° tilt) + 2 sticker cards (Yash Raj Singh, Anshika) + one ₹ tag + one arrow | Copy first; collage below in a 4:3 stage, phone 62% width, one sticker card | Stickers drop in with spring (stagger 120ms) after LCP; arrow draws; none with reduced motion |
| Work | Ink section. H2 left, intro right. 4 tiles in a row (min-height 320) | Horizontal snap scroller, 82% card width, visible next card, keyboard-focusable region with label | Tiles rise 16px in sequence |
| How it works | 2 columns: left sticky phone (top 120px), right 4 steps each ≥ 60vh; active step swaps the phone screen | Steps stacked, each with its own 160px screen thumbnail | Crossfade + 8px slide; active step number fills brand |
| Ladder | 3 ascending columns (heights 70/85/100%), stage label, ₹ range, unlocks; footnote row; tier screen on right | Vertical stack, ranges large | Bars grow from 0 once |
| Earners | Header + "Read their stories ↗"; 6 sticker cards in a horizontal scroller with prev/next buttons | Snap carousel, 78% width | Cards tilt ±2° on hover; none on touch |
| Safety | Paper-2 band. 4 pillars (2×2) + "For parents" ink card on the right with company facts + consent TBC + links | Stack; parent card after pillars | Fade only |
| Skills | One line of chips, wraps | Wraps | None |
| FAQ | Narrow column (760px) of `<details>` | Full width | Height animation (JS-enhanced) |
| Final CTA | Ink band, big headline with lime highlight, badges + QR | Badges stacked | None |

## 4. Company page `/about` — layout spec (calm register: no tilt, no tape)
| § | Desktop | Mobile |
|---|---|---|
| Hero | Copy cols 1–7 (chip, H1 with one highlight, lede); right: 3 portrait mosaic (earners from Teenlancer community — captioned as such) ; fact pills: Mumbai · Shark Tank India S2 · 50L+ downloads · 4.1★ Google Play | Mosaic → 3-up strip under copy |
| Problem / mission | Large pull statement (step-4) + short paragraph in a 2-col layout | Stack |
| Founders | 2 equal cards: portrait slot (**TBC placeholder** monogram), name, "Co-founder" (Tier A), exact title TBC, LinkedIn link | Stack |
| Teenlancer engine | Ink section: statement H2, 4 role cards, featured story (Sarthak, Delhi, published quote + ₹3.9L+ earned; links to story) with photo | Stack |
| Journey | Horizontal timeline on a rule, 4 milestones: Founded (year TBC) · Jul 2022 first press profile · Shark Tank India S2 deal (₹50L, Amit Jain & Namita Thapar) · Nov 2026 50L+ downloads | Vertical |
| Backed by | 2 columns: Shark Tank thumbnail (click → official YouTube channel; exact episode URL TBC) + deal facts card | Stack |
| Press | 6 rows: outlet · year · headline · ↗ | Rows |
| How we work | 4 principle rows from Trust page | Stack |
| Next steps | 3 cards: Start earning (→/earn) · Work with us (careers↗) · Press & partnerships (email + For brands↗); registered office block | Stack |

## 5. Assets
| Source | Output |
|---|---|
| `assets/source/earners/*.jpg` | 4:5 crops, 320/480/720w, AVIF + WebP + JPEG, light warm grade |
| `assets/source/app-screens/*.webp` | 360/540/720w AVIF + WebP |
| `assets/source/press/sharktank-thumb.jpg` | 640/960/1280w AVIF + WebP + JPEG |
| logo SVG | inline SVG (currentColor), favicon set reused |
| OG images | 1200×630 per page, generated from HTML with Playwright, JPEG |
All `<img>` get `width`/`height`, `decoding="async"`, lazy except hero.

## 6. SEO implementation
Per `strategy/05`. Build reads `DEPLOY_TARGET` (`evaluation` default | `production`) and `SITE_URL` (Netlify `URL` env or explicit).
- evaluation: `<meta name="robots" content="noindex, nofollow">`, `_headers` adds `X-Robots-Tag: noindex, nofollow`, `robots.txt` = `Allow: /` (no sitemap — a Disallow would hide the noindex from crawlers; corrected in Phase 7), canonical = evaluation URL.
- production: robots `index, follow`, no X-Robots-Tag, normal robots.txt with sitemap, canonical `https://www.funngro.com/...`.
The noindex logic lives only in this repo's build; nothing touches funngro.com.

## 7. Netlify
`_redirects`: `/  /earn  302` · `/teen  /earn  301`. Pages built as `earn.html`, `about.html` (served at `/earn`, `/about`), `404.html`. `_headers`: security headers, cache rules, evaluation-only X-Robots-Tag.

## 8. QA gates (must pass before claiming done)
Screenshots at 360, 390, 768, 1024, 1440 compared to boards · Lighthouse mobile+desktop (both pages) · axe-core 0 violations · 0 console errors · redirects (/, /teen, unknown → 404) verified on the live deploy · metadata/JSON-LD checked from built HTML · ₹ renders in the brand font (computed font check).
