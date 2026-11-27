# Deployment

Static site: `src/` → `npm run build` → `dist/`. Hosted on Netlify.

## Evaluation site (current)
- URL: https://funngro-revamp-evaluation.netlify.app (Netlify project `funngro-revamp-evaluation`)
- Built with `DEPLOY_TARGET=evaluation` (the default) → every page has `noindex, nofollow`, an `X-Robots-Tag` header and a Disallow-all robots.txt, so it never competes with funngro.com in search.
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
npm run serve &                                   # local preview at :4173 (no redirects/headers locally)
node tests/screens.cjs  <url> qa/screens 320 390 768 1024 1440
node tests/a11y.cjs     <url> qa/a11y
node tests/interactions.cjs <url>
node tests/rupee.cjs    <url>
node tests/seo-links.cjs <url> --expect-noindex
node tests/lighthouse.mjs <url> qa/lighthouse 3
```
(Playwright scripts are CommonJS and use the globally installed `playwright`; run with `NODE_PATH=$(npm root -g)` if needed.)
