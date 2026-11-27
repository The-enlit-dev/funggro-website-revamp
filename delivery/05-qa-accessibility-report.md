# 05 · Final QA & accessibility report

**Final verification run:** 27 Nov 2026, 04:54–05:00 UTC, against the live evaluation deploy https://funngro-revamp-evaluation.netlify.app (Netlify deploy `6b090ca38c025a4dcdb877d0`, the current production deploy of the evaluation project). Command: `BASE_URL=… npm test` → **all steps passed (exit 0)**. Full log: `qa/final-run-2026-11-27.log`; detailed report: `qa/QA-REPORT.md`.

## Results
| Area | What was checked | Tool | Result |
|---|---|---|---|
| Responsive layout | `/earn` and `/about` at 320, 360, 390, 768, 1024, 1280, 1440 px | Playwright (`screens.cjs`) | **Pass** — no element extends past the viewport |
| Console | Errors from site code | Playwright | **0** on every page and width |
| Accessibility | WCAG 2.0/2.1/2.2 A + AA + best practice — `/earn`, `/about`, `/404`, mobile + desktop, mobile menu open | axe-core (`a11y.cjs`) | **0 violations** |
| Keyboard | Every focusable element reached; visible focus indicator on every stop; nothing hidden under the sticky header; menu keeps focus while open; Esc closes and returns focus | `keyboard.cjs` | **15/15** |
| Contrast | Text over textures/highlights that axe can't compute | manual calculation | All ≥ WCAG AA (lowest 5.1:1) |
| Interactions | Menu, skip link, "Get the app" anchor, How-it-works phone sync (4 steps), stories carousel, FAQ, cross-page navigation, **JavaScript disabled** | `interactions.cjs` | **26/26** |
| Buttons & links | 150 links/buttons inventoried: accessible names, no empty links, safe new-tab links, official store URLs, **founder LinkedIn links open the right, distinct profiles in new tabs**, **QR decodes to Google Play**, store listings return 200 | `functional.cjs` | **26/26** |
| Delivery | Brotli compression, cache headers, font preload + `swap`, ₹ font subset, OG images 1200×630, robots/sitemap, `X-Robots-Tag` | `delivery.mjs` | **27/27** |
| ₹ glyph | Rendered by the brand web fonts, not a fallback | Chrome DevTools platform fonts (`rupee.cjs`) | **4/4** |
| SEO metadata | Titles, descriptions, canonical, OG/Twitter, one H1, heading order, alt + dimensions, server-rendered content, no unresolved template tokens | `seo-links.cjs` | **All pass** |
| HTML | W3C Nu validator | vnu.jar | **0 errors** (only intentional "role=list" warnings) |
| Routing | `/`→`/earn` 302; `/teen`→`/earn` 301; trailing slash / `.html` → clean URL 301; unknown → 404 page | curl | **Pass** |
| Indexing | Evaluation site `noindex` (meta + header + robots.txt) | curl, `delivery.mjs` | **Pass — retained** |

## Fixed during Phase 7
While capturing the delivery screenshots, the mobile proof pills showed the TV icon and hid the ★ next to "4.1" (CSS selector logic was inverted). Fixed, redeployed, and the full suite above was re-run on the fixed deploy.

## Known items (not site defects)
| Item | Effect | Resolution |
|---|---|---|
| Netlify "Powered by Netlify" badge (free plan, injected by Netlify at the edge) | Blocked by our CSP: 2 console errors per page, Lighthouse Best Practices 92, one empty keyboard focus stop on its iframe | Turn off in Netlify: Project configuration → General → Powered by Netlify badge |
| LinkedIn ×3, IBS Intelligence | Return 403/999 to automated link checks | Sources documented; open normally for people |

## Not tested (limits)
Physical iOS/Android devices · screen readers (VoiceOver/TalkBack) · Google Rich Results Test · real-user (field) Core Web Vitals.
