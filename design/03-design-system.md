# 03 — Design system specification

Status: **draft for approval.** Foundations (spacing, grid, motion, components, accessibility) are direction-independent. Colour and type tokens are given for the recommended **Concept 2 — Sticker Book**; alternates for Concepts 1 and 3 are at the end. Final values are locked in Phase 3 after you choose.

Implementation: CSS custom properties in `tokens.css`; names below are the real variable names.

## 1. Principles
1. **Proof over promise** — every claim sits next to its evidence (screen, photo, source label).
2. **One idea per screen** — big type, few elements, generous space.
3. **Play with purpose** — playful devices guide attention; they never decorate for its own sake.
4. **Fast on a ₹10,000 phone** — design within the performance budget.
5. **Accessible by default** — WCAG 2.2 AA is a floor, not a goal.

## 2. Colour (Concept 2)
| Token | Hex | Role | Contrast (measured) |
|---|---|---|---|
| `--color-paper` | #F6F1E7 | Page background | — |
| `--color-paper-2` | #EDE6D6 | Alt section background | — |
| `--color-surface` | #FFFFFF | Cards, stickers | — |
| `--color-ink` | #0E1A12 | Primary text, dark sections, primary buttons | 15.9:1 on paper |
| `--color-muted` | #5B6B60 | Secondary text | 5.0:1 on paper |
| `--color-brand` | #07AB5F | Brand fills, accents (text on it = ink) | ink on brand 6.0:1; **white on brand 3.0:1 — not allowed for text** |
| `--color-brand-deep` | #067A41 | Links/text in green on light | 4.8:1 on paper |
| `--color-lime` | #C8F169 | Highlighter, tile, accent text on ink | 13.8:1 with ink |
| `--color-sun` | #FFC94A | ₹ price-tag stickers, tape, tile | 11.7:1 with ink |
| `--color-mint` | #9FE3BE | Tile | 12.1:1 with ink |
| `--color-coral` | #FF6B4A | Rare alert/“new” sticker only (decorative) | 6.3:1 on ink; not for text on paper |
| `--color-line` | rgba(14,26,18,.12) | Hairlines, grid paper | decorative |
| `--color-focus` | #0E1A12 + 3px #C8F169 halo | Focus ring | ≥3:1 vs adjacent |
Rules: text colours limited to ink, muted, brand-deep (on light) and paper/lime (on ink). Colour is never the only carrier of meaning.

## 3. Typography
Faces (OFL, self-hosted WOFF2, Latin + Latin-ext + ₹ U+20B9 subset; **₹ presence verified**):
- **Display:** Bricolage Grotesque variable (`wght` 600–800, `wdth` 75–100, `opsz` 12–96). Headings use `wdth` ~84, tracking −0.028em.
- **Body/UI:** Figtree variable (`wght` 400–800). Numerals: `font-variant-numeric: tabular-nums` for money.
- Fallback stack: `"Bricolage Grotesque", "Figtree", ui-sans-serif, system-ui, "Segoe UI", Roboto, "Noto Sans", sans-serif` with `size-adjust` metric overrides to prevent layout shift.
- Hindi (future): add Noto Sans Devanagari only on Hindi routes.

Fluid scale (min @360px → max @1440px), `clamp()`:
| Token | Size | Line-height | Use |
|---|---|---|---|
| `--step-hero` | 52 → 124px | 0.92 | H1 |
| `--step-5` | 40 → 76px | 0.95 | H2 |
| `--step-4` | 30 → 44px | 1.05 | Big numbers, H3 large |
| `--step-3` | 24 → 34px | 1.1 | H3 |
| `--step-2` | 20 → 24px | 1.3 | Lede, card titles |
| `--step-1` | 17 → 18px | 1.55 | Body |
| `--step-0` | 15 → 16px | 1.5 | UI, captions |
| `--step--1` | 13 → 14px | 1.45 | Labels, footnotes (min 13px) |
Measure: body max 64ch; lede max 52ch. One H1 per page; heading levels never skip.

## 4. Spacing, grid, breakpoints
- Base unit 4px. Scale `--space-1..12` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 200px. Section padding: `clamp(64px, 10vw, 160px)` vertical.
- Grid: 12 columns, gutter `clamp(16px, 2vw, 24px)`, max content width 1280px (+ side padding `clamp(16px, 5vw, 72px)`). Text columns span 6–7.
- Breakpoints (content-driven, mobile-first): `sm 480`, `md 768`, `lg 1024`, `xl 1280`. Container queries for cards.
- Phone safe areas respected (`env(safe-area-inset-*)`).

## 5. Shape, borders, depth
- Radii: `--radius-sm 8px` (chips), `--radius-md 14px` (buttons), `--radius-lg 22px` (tiles), `--radius-xl 42px` (phone frame), `--radius-pill 999px`.
- Borders: 2px ink on interactive/sticker elements; 1px `--color-line` for dividers.
- Depth = **hard offset shadows** (no blur): `--shadow-sticker: 6px 6px 0 var(--color-ink)`, `--shadow-btn: 4px 4px 0 var(--color-brand)`; pressed state removes the offset (button "presses down"). Company page uses `--shadow-flat: none` (calm register).
- Rotation tokens: `--tilt-xs 2deg`, `--tilt-sm 5deg`, `--tilt-md 8deg` — decorative layers only.

## 6. Imagery & iconography
- **Photos:** earner portraits in sticker cards (white 10px border, 2px ink outline, 4:5 crop, consistent warm grade via CSS `filter` or pre-processed). Founders/team: same card, no rotation.
- **App screens:** official screens in a CSS/SVG phone frame (no mock-up PNGs); max 2 phones per page.
- **Icons:** custom 24px line icons, 2px stroke, round caps (drawn as inline SVG sprite). No emoji in UI (🦈 replaced by a drawn icon).
- **Hand-drawn layer:** SVG arrows, underlines, circles — stroke-dashoffset animation.
- Formats: AVIF → WebP → JPEG, responsive `srcset` (400–1600w), explicit `width`/`height`, `loading="lazy"` except the LCP image (`fetchpriority="high"`).

## 7. Motion
| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 150ms | Hover, press |
| `--dur-base` | 280ms | Accordions, menus |
| `--dur-slow` | 600ms | Section reveals |
| `--ease-out` | cubic-bezier(.2,.8,.2,1) | Default |
| `--ease-spring` | cubic-bezier(.34,1.56,.64,1) | Sticker drops, tag pops |
Patterns: sticker "drop & settle" (scale .9→1 + rotate, spring); highlighter draws left→right; phone screen swaps in How-it-works (crossfade + 8px slide); ladder bars grow; number roll-up for stats (once, on enter).
Rules: animate only `transform`/`opacity`; reveal **groups**, not every element; nothing loops except an optional slow marquee (pausable); `prefers-reduced-motion: reduce` → no transforms, instant states; scroll-driven animations use CSS `animation-timeline` with IntersectionObserver fallback.

## 8. Components (with states)
| Component | Variants / notes | States |
|---|---|---|
| **Header** | Transparent over hero → paper with border on scroll; mobile full-screen sheet menu | default, scrolled, menu-open; focus trap in sheet |
| **Button** | Primary (ink fill, paper text, brand offset shadow), Secondary (paper fill, ink shadow), Text link | hover (shadow grows), active (pressed, shadow 0), focus-visible ring, disabled |
| **Store badges** | Official Google Play / App Store badge artwork (guideline-compliant) | focus ring |
| **QR block** | Desktop only (`lg+`), links to app; caption "Scan to get the app" | — |
| **Chip / proof pill** | Label chip (dot + text), Proof stat (number + source line + "as of") | — |
| **Work tile** | 4 colourways; icon, title, line, ₹ range tag | hover: tag tilts; whole-tile link optional |
| **Price tag sticker** | Sun fill, ink border, ₹ amount + label | decorative (`aria-hidden` when duplicated) |
| **Step + phone** | Numbered step list synced to a sticky phone (desktop); stacked with thumbnails (mobile) | active step highlighted |
| **Ladder** | 3 ascending stages, range, unlocks, footnote | stage selected (tabs semantics) |
| **Story card** | Sticker photo, name, city, quote, earnings | hover lift; carousel with buttons + keyboard + snap |
| **Safety card** | Icon, title, 1-line proof; "For parents" variant with company facts | — |
| **FAQ** | Native `<details>/<summary>`; animated height | open/closed, focus |
| **Timeline** | Horizontal scroll-linked (desktop), vertical (mobile) | — |
| **Founder card** | Large portrait, name, title, bio, LinkedIn | — |
| **Press item** | Outlet (wordmark-style text), year, headline, external link icon | hover underline |
| **CTA band** | Ink background, lime highlight headline, badges + QR | — |
| **Footer** | Link columns (accordions on mobile), legal entity, emails, socials | — |
| **Placeholder** | Visible dashed box for `{{client data}}` during review builds only | — |

## 9. Accessibility rules
WCAG 2.2 AA: contrast per table above; visible focus (3px lime halo + ink outline); targets ≥44×44px (24px absolute minimum per 2.5.8); skip link; landmarks; one H1; alt text written per image (decorative = empty alt); carousels operable by keyboard with visible controls and no auto-advance; accordions accessible by default via `<details>`; language `en-IN`; no information conveyed by motion/colour alone; zoom to 200% without loss; tested with axe + keyboard + VoiceOver/TalkBack spot checks.

## 10. Responsive behaviour summary
- **Mobile (360–767):** single column; hero type 52–64px; phone shown below copy at 70% width; stickers reduced to one; tiles become horizontal snap list; sticky phone becomes inline thumbnails; badges full width; no QR.
- **Tablet (768–1023):** two-column where content allows; tiles 2×2.
- **Desktop (1024+):** full collage hero, sticky phone scrollytelling, QR blocks, horizontal timeline.

## 11. Alternate token sets
**Concept 1 — Night Ledger:** bg #06130A, surface #0C1D12, text #E9F2EC (16.6:1), muted #9DB3A5 (8.5:1), CTA leaf #E1FEBE (17.3:1), ₹ gold #E8C27A (11.3:1), rules #1D3324. Type: Fraunces / Geist / Geist Mono. Shadows: soft blur + glow; radius pill buttons.
**Concept 3 — Clear Signal:** bg #FFFFFF, surface #F2F7F4, ink #0B1F14, muted #516158 (6.6:1 on white), button #07AB5F with ink text (5.7:1), links #067A41 (5.4:1 on white), feature #0B3D24, leaf #E1FEBE. Type: Mona Sans / IBM Plex Mono. Shadows: soft, low; radius 10–24px.
