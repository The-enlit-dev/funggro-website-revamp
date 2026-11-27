# QA report — redesigned `/earn` and `/about`

Tested **2026-11-27** against the live evaluation deploy **https://funngro-revamp-evaluation.netlify.app** (Netlify deploy `6b08fd453243e162f6b265ab`) unless marked "local". Every result below comes from a command in `tests/`; raw outputs are in this folder.

| Check | Tool / script | Result |
|---|---|---|
| Responsive layout, 7 widths (320, 360, 390, 768, 1024, 1280, 1440) × 2 pages | `tests/screens.cjs` (Playwright) | **Pass** — no element extends past the viewport at any width; screenshots in `screens/` |
| Console errors from our code | `tests/screens.cjs` | **0** on every page/width |
| Console errors from the platform | same | 2 per page — Netlify's edge-injected "Powered by Netlify" badge iframe is blocked by our CSP (documented Netlify behaviour; badge simply doesn't show). Not our code. Remove by turning the badge off in Netlify (see DEPLOYMENT.md) |
| Accessibility — axe-core 4.x, WCAG 2.0/2.1/2.2 A+AA + best practice | `tests/a11y.cjs` | **0 violations** on /earn, /about, /404 at 390 and 1440, plus mobile menu open (`a11y/axe-results.json`) |
| Contrast items axe could not auto-verify (text over grid texture/highlighter) | manual calculation | All ≥ AA: worst case muted text over grid line 5.1:1; ink on lime 14.3:1 |
| Interactions & navigation | `tests/interactions.cjs` | **26/26 pass** — menu open/Esc/focus return, aria-current, skip link, CTA anchor, steps↔phone sync (4/4), rail buttons, exclusive FAQ, page-to-page nav, no-JS rendering |
| Redirects & status codes | curl | `/`→`/earn` **302**; `/teen`, `/teen/`→`/earn` **301**; `/earn/`, `/about/`, `/earn.html`, `/about.html` → clean URL **301**; unknown path **404** (custom page) |
| Evaluation noindex | curl + `tests/seo-links.cjs` | `<meta name="robots" content="noindex, nofollow">`, `X-Robots-Tag: noindex, nofollow`, robots.txt `Disallow: /` — present on the evaluation deploy only |
| Production build stays indexable (local) | `npm run build:production` + Lighthouse | robots `index, follow`, canonical `https://www.funngro.com/...`, no X-Robots-Tag, Lighthouse SEO **100** |
| SEO metadata | `tests/seo-links.cjs` | **All checks pass** (title/description length, single H1, no heading skips, canonical, OG/Twitter, lang, alt + dimensions on all images, H1 + JSON-LD present in server HTML, no unresolved placeholders) |
| Links (31 unique) | `tests/seo-links.cjs` + browser re-check | 27 OK. 4 not verifiable from here: LinkedIn ×3 (bot wall / login wall) and IBS Intelligence (403 to automated clients, URL confirmed by search). All four are copied from funngro.com |
| ₹ glyph rendered by brand fonts | `tests/rupee.cjs` (Chrome DevTools platform-fonts) | **Pass** 4/4 — Bricolage Grotesque / Figtree web fonts render ₹; no system fallback |
| HTML validity | W3C Nu validator (vnu.jar) | **0 errors**; 26 warnings, all "role=list is unnecessary" (kept deliberately for Safari/VoiceOver list semantics) — `html-validation.txt` |
| Security headers | curl | CSP (no inline script/style), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy |
| Caching | curl | hashed assets `max-age=31536000, immutable`; HTML `max-age=0, must-revalidate` |

## Lighthouse (live, median of 3 runs)
| Page | Form | Perf | A11y | Best pr. | SEO | FCP | LCP | TBT | CLS | Weight |
|---|---|---|---|---|---|---|---|---|---|---|
| /earn | mobile | **100** (99/100/100) | 100 | 92* | 69† | 0.9 s | 0.9 s | 70 ms | 0 | 245 KiB |
| /earn | desktop | **100** | 100 | 92* | 69† | 0.3 s | 0.3 s | 0 ms | 0 | 219 KiB |
| /about | mobile | **100** | 100 | 92* | 69† | 0.9 s | 0.9 s | 20 ms | 0 | 214 KiB |
| /about | desktop | **100** | 100 | 92* | 69† | 0.3 s | 0.3 s | 0 ms | 0 | 199 KiB |

\* Best Practices loses points only for "errors in console" / "issues" caused by the blocked Netlify badge. Local build without the badge: **100**.
† SEO 69 is the intended consequence of `noindex` on the evaluation deploy ("page is blocked from indexing"). Same pages built for production (local): **SEO 100**.
Lab data from a cloud container — not field (CrUX) data. Reports: `lighthouse/*.html`.

Remaining Lighthouse suggestions (not fixed, low impact): image-delivery estimates ~47 KiB on mobile (mainly one detailed earner photo that compresses poorly at 2.6× DPR); badge script cache lifetime (Netlify's script, not ours).

## Comparison with the approved concept board
`comparison/teen-hero-board-vs-built.png`, `comparison/company-hero-board-vs-built.png`.
Matches: paper + grid texture, ink type, lime highlighter on one phrase, tilted phone + two sticker photo cards + ₹ tag + drawn arrow, hard-shadow ink buttons, proof pills, ink "work" section with four tinted tiles, calm Company register with photo mosaic and fact pills.
Intentional differences (premium interpretation / facts policy): official store badges + desktop QR instead of text buttons; ₹ tag shows a published range ("₹200–1,500, brand promotion") instead of the invented "+₹220"; 🦈 emoji replaced by a drawn icon; looser headline tracking; founder portraits shown as labelled placeholders (no photos supplied).

## Issues found during QA and fixed
| Issue | Fix |
|---|---|
| Headline too large/tight; proof pills below the fold at 1440×900 | Hero scale 96→84px, tracking −0.03→−0.02em |
| Light text on lime highlight in the CTA (illegible) | Highlighted text forced to ink on dark sections |
| Mobile horizontal overflow on /about (lede, pills, mosaic, deal table) — hidden by `overflow-x: clip` | `min-width: 0` on grid children, `minmax(0,1fr)` tracks, deal rows stack < 480px; QA script now detects off-viewport elements against the configured width |
| Header overflow at 320/360px | Smaller logo + compact CTA < 416px; CTA hidden < 358px (menu has store badges) |
| Footer email widened grid at 320px | `overflow-wrap: anywhere` |
| Inactive How-it-works steps at 38% opacity failed contrast (2.2:1) | Dimmed with muted colour instead (5.4:1) |
| Journey/tier app screens cropped at the sides | Letterboxed on their own background colour |
| Duplicate `.html` URLs returned 200 | 301 to clean URLs |

## Not tested / limits
- Real devices (iOS Safari, low-end Android) — emulated in Chromium only.
- Screen readers (VoiceOver/TalkBack) — structure verified by axe and manual markup review, not with a screen reader.
- Google Rich Results Test — manual tool, not run; JSON-LD parsed and type-checked by script.
- Field Core Web Vitals — none exist for a new evaluation URL.
