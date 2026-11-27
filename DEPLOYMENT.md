# Deployment

Static site: `src/` → `npm run build` → `dist/`. Hosted on Netlify.

## Evaluation site (current)
- URL: https://funngro-revamp-evaluation.netlify.app (Netlify project `funngro-revamp-evaluation`)
- Built with `DEPLOY_TARGET=evaluation` (the default) → every page has `noindex, nofollow`, and an `X-Robots-Tag` header, so it never competes with funngro.com in search. robots.txt deliberately allows crawling (a `Disallow` would stop crawlers from seeing the noindex) and lists no sitemap.
- Deployed manually from this repo via the Netlify API:
  ```bash
  npm ci
  SITE_URL=https://funngro-revamp-evaluation.netlify.app npm run build
  NETLIFY_AUTH_TOKEN=<token> NETLIFY_SITE_ID=b811fb7d-b179-4c1a-bdd1-d3d601de0f0d scripts/deploy-netlify.sh
  ```

## Continuous deploys from GitHub (optional, needs a person)
In Netlify: Project configuration → Build & deploy → Link repository → `the-enlit-dev/funggro-website-revamp`. `netlify.toml` already sets `npm run build`, publish `dist`, Node 22 and `DEPLOY_TARGET=evaluation`. Netlify's `URL` variable is used for canonicals automatically.

## Production (only if Funngro adopts these pages on www.funngro.com)
```bash
npm run build:production      # DEPLOY_TARGET=production SITE_URL=https://www.funngro.com
```
This removes noindex, sends no X-Robots-Tag, writes an indexable robots.txt + sitemap, and sets canonicals to `https://www.funngro.com/earn` and `/about`. Do this only after all "To be confirmed" placeholders are resolved — the build lists them as `data-tbc` attributes (`grep -o 'data-tbc="[^"]*"' dist/*.html`).

## Netlify badge
Free-plan projects created after Aug 2026 get an edge-injected "Powered by Netlify" badge. Our Content-Security-Policy blocks it (it logs two console errors and lowers Lighthouse Best Practices to 92). To remove it: Project configuration → General → Powered by Netlify badge → off (may require a paid plan, per Netlify docs). We deliberately did not weaken the CSP.

## Regenerating assets (only when sources change)
```bash
pip install fonttools brotli && python3 scripts/fonts.py   # subset fonts → src/fonts
npm run images                                              # responsive images, badges, QR → src/images
node scripts/og.cjs                                         # OG images (needs Playwright)
```

## Tests
```bash
BASE_URL=https://funngro-revamp-evaluation.netlify.app npm test   # full suite (below), except Lighthouse
node tests/lighthouse.mjs <url> qa/lighthouse 3                  # Lighthouse, median of 3
```
Suite: `screens.cjs` (7 widths, overflow, console) · `a11y.cjs` (axe-core) · `interactions.cjs` · `rupee.cjs` · `keyboard.cjs` (focus walk, menu, INP approx.) · `functional.cjs` (links/buttons, LinkedIn new tabs, QR decode, store links) · `delivery.mjs` (compression, caching, fonts, OG, robots/sitemap) · `seo-links.cjs` (metadata, JSON-LD, links).
Local preview: `npm run serve` (port 4173; Netlify redirects/headers are not emulated locally).
(Playwright scripts are CommonJS and use the globally installed `playwright`; run with `NODE_PATH=$(npm root -g)` if needed.)

## Pre-production checklist (only with your approval — nothing is published to funngro.com by this repo)
1. Resolve placeholders: `grep -o 'data-tbc="[^"]*"' dist/*.html` (portraits are labelled "Official portrait to be supplied").
2. Funngro confirms Anik Jain's LinkedIn URL (site links `/in/anik-jain/`; independent sources give `/in/anik-jain-7966404`, which is used).
3. Funngro confirms reuse of earner stories/photos and the QR target link.
4. `npm run build:production` → verify `<meta name="robots" content="index, follow…">`, canonical `https://www.funngro.com/…`, no X-Robots-Tag in `dist/_headers`.
5. Deploy to the production host chosen by Funngro; keep the `/teen` → `/earn` 301; submit sitemap in Search Console; run Rich Results Test.
