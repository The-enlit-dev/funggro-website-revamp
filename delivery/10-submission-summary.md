# 10 · Submission summary (ready to paste)

## Short version (≈100 words)
I redesigned Funngro's Teen page (`/earn`) and Company page (`/about`) as a fast, accessible static site. Research showed the live pages render only with JavaScript (an empty HTML shell for crawlers), use a fake `/teen` URL and contradict themselves on key facts, so the redesign uses only verified information and fixes those SEO problems. The approved "Sticker Book" design pairs warm paper, ink type and Funngro green with real earner photos and app screens. On the live evaluation site both pages score 100 for Lighthouse Performance and Accessibility, with zero axe-core violations; the production build scores 100 in all four categories.

**Live:** https://funngro-revamp-evaluation.netlify.app/earn · https://funngro-revamp-evaluation.netlify.app/about
**Code:** https://github.com/The-enlit-dev/funggro-website-revamp/pull/1

## Longer version
**Brief.** Create a two-page design for Funngro's Company and Teen pages.

**Research.** I crawled funngro.com with a headless browser and audited it with Lighthouse and axe-core. The "Teen" route (`/teen`) is a client-side redirect to `/earn`, and "Company" maps to `/about`. The site is a client-side-rendered React app: crawlers that don't run JavaScript see an empty page. I also found soft 404s, a canonical pointing to a redirecting host, reused homepage social tags, keyword-stuffed copy, and contradictory facts across Funngro's own pages (founder titles, founding year, user numbers, payout claims).

**Approach.** I built a verified-facts register and used only independently confirmed or consistently published facts. Unresolved items stay as visible placeholders rather than guesses. For example, Payal Jain's "Co-founder & CEO" title is confirmed by Entrackr, Inc42 and others, while Anik Jain is shown as "Co-founder" because his title differs across Funngro's own pages.

**Design.** I explored three directions and the client chose "Sticker Book", interpreted for a premium feel. Typefaces were checked for the ₹ glyph, which the live site's fonts lack, and colours were checked for WCAG contrast.

**Build.** Static HTML, modern CSS and about 4 KB of vanilla JavaScript; both pages work without JavaScript. Images are optimised (AVIF/WebP), fonts are self-hosted and subset, and the site is hosted on Netlify with clean URLs, a real 404, a strict Content-Security-Policy and long-term caching. The evaluation deploy is `noindex`; a separate production build is indexable.

**Results (measured).**
- Lighthouse on the live site (median of 3): Performance 100 and Accessibility 100 on both pages, mobile and desktop.
- Production build: 100/100/100/100.
- axe-core: 0 violations. Keyboard walk-through: all checks pass.
- Schema.org validator: 0 errors. Sitemap passes the official XSD.
- W3C HTML: 0 errors. Layouts verified from 320 to 1440 px.

**Outstanding.** Items only Funngro can supply: founder portraits, confirmation of Anik Jain's LinkedIn, parental-consent wording, the SucSEED relationship, consent to reuse earner stories, the QR target link and the Instagram handle. Netlify's free-plan badge is blocked by the CSP and slightly lowers Best Practices on the evaluation URL.

## Notes for the reviewer
- The repository name uses the brief's spelling ("funggro"); the brand is **Funngro**.
- The code is on the PR branch; `main` will contain it once the PR is merged.
- The evaluation site is intentionally hidden from search engines (`noindex`).
