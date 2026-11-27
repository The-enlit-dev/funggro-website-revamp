# 02 — Three visual directions

Boards (1440px, real Funngro assets, Tier A/B facts only): `design/concepts/concept-*.png` (source HTML beside them — boards are design exploration, not production code).

| | **1 · Night Ledger** | **2 · Sticker Book** (recommended) | **3 · Clear Signal** |
|---|---|---|---|
| Idea | Evolve today's dark site into a cinematic editorial "financial paper at night" | A teen's notebook made premium: warm paper, ink, stickers, highlighter | Bright product-grade fintech; the app UI is the hero |
| Mood | Calm, serious, premium | Bold, human, playful, Indian Gen-Z | Clean, precise, trustworthy |
| Colour | Night #06130A, paper text, leaf CTA, ledger-gold ₹ | Paper #F6F1E7, ink #0E1A12, Funngro green, lime highlighter, sun stickers, mint | White/mist, ink, Funngro green buttons, deep-green links, forest feature blocks |
| Type | Fraunces (display) · Geist (body) · Geist Mono (₹) | Bricolage Grotesque (display) · Figtree (body) | Mona Sans (all) · IBM Plex Mono (data) |
| Imagery | Monochrome/duotone portraits, phone in glow | Polaroid "sticker" cards with tape, tilted phone, ₹ price-tag stickers, hand-drawn arrows | App screens in bento cards, data-viz ladder |
| Motion | Slow fades, number roll-ups, parallax | Springy sticker "drops", highlighter draws in, cards tilt on hover/drag | Product-demo micro-interactions, counters, step transitions |
| Teen appeal | Medium | **High** | Medium |
| Parent/brand trust | High | Medium–High (calmer Company-page register) | **High** |
| Distinctiveness vs AI templates | Low–medium (closest to today and to AI-builder look) | **High** | Medium (bento is now common) |
| Build risk | Low | Medium–high (needs careful craft to avoid looking childish) | Low–medium |
| Performance | Good (dark, few images) | Good if stickers are CSS/SVG, photos optimised | Very good |

## Recommendation: Concept 2 — Sticker Book
**Why (plain-language):**
- Funngro's audience is 14–25 and its biggest barrier is "this looks like a scam". Sticker Book looks *made by and for them*, while the real photos, real app screens and labelled numbers do the trust work.
- It is the clearest break from both the current site and the generic AI-template look — important for an evaluation.
- Funngro's own assets (amateur earner photos, app screenshots) look best in a collage system: white sticker borders make mismatched photos feel intentional.
- The Company page uses a **calmer register** (no rotation, fewer stickers, more whitespace) so parents and brands get credibility without losing the brand.

**Guardrails so it stays premium, not childish:**
- One playful device per screen (a sticker *or* a highlighter *or* an arrow) — never all at once.
- Strict grid underneath; rotation only ±2–8° and only on decorative layers, never on body text.
- Ink/paper base with colour in tiles; no rainbow.
- Hand-drawn elements are custom SVG paths, not a handwriting font.
- Respect `prefers-reduced-motion`; stickers appear statically.

**Alternative:** if you prefer lower risk, Concept 3 (Clear Signal) is the safest high-trust option; Concept 1 keeps the most continuity with the current site.

## Decision needed
Choose one direction (or a named combination, e.g. "Concept 2 for Teen, calmer Concept 2 for Company" — which is my recommendation). The design system (`03-design-system.md`) is written so foundations are shared and only the token set changes.
