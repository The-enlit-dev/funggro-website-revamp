# 09 · Deployment instructions and pre-production checklist

Complete technical guide: `DEPLOYMENT.md` (repository root). Summary:

## How the site is built
```bash
npm ci
npm run build                 # evaluation build (default) → dist/ — noindex everywhere
npm run build:production      # indexable build for www.funngro.com — only with approval
npm run serve                 # local preview at http://localhost:4173
```
`DEPLOY_TARGET` controls indexing: `evaluation` (default) adds `noindex, nofollow` (meta + `X-Robots-Tag`) and a robots.txt that allows crawling (so crawlers can see the noindex) without a sitemap; `production` removes the noindex signals, writes an indexable robots.txt + sitemap and sets canonicals to `https://www.funngro.com/earn` and `/about`.

## Evaluation site (current)
- https://funngro-revamp-evaluation.netlify.app (Netlify project `funngro-revamp-evaluation`), deployed via the Netlify API with `scripts/deploy-netlify.sh`.
- Routing: `/` → `/earn` (302), `/teen` → `/earn` (301), `/earn/` and `/earn.html` → `/earn` (301), unknown paths → 404 page.
- Optional: link the GitHub repository in Netlify (Project configuration → Build & deploy) for automatic deploys; `netlify.toml` is ready.
- Optional: turn off the "Powered by Netlify" badge (Project configuration → General) to remove two console errors and an empty keyboard focus stop.

## Testing
```bash
BASE_URL=https://funngro-revamp-evaluation.netlify.app npm test   # full QA suite
node tests/lighthouse.mjs <url> qa/lighthouse 3                  # Lighthouse, median of 3
```

## Pre-production checklist (do not start without the project owner's approval)
- [ ] Funngro confirms every item in `08-funngro-confirmation-items.md`
- [ ] Replace placeholders — list them with `grep -o 'data-tbc="[^"]*"' dist/*.html`; replace founder monograms with approved portraits
- [ ] Update Anik Jain's LinkedIn in `src/pages/about.html` and `src/site.config.json` if Funngro specifies a different URL
- [ ] Refresh store figures and their date in `src/site.config.json`
- [ ] `npm run build:production`; confirm `<meta name="robots" content="index, follow…">`, canonicals on `https://www.funngro.com/`, and no `X-Robots-Tag` in `dist/_headers`
- [ ] Run the QA suite and Lighthouse against a staging URL of the production build
- [ ] Deploy to Funngro's chosen host; keep the `/teen` → `/earn` 301 and confirm other site routes still work
- [ ] Register the sitemap in Google Search Console; run Google's Rich Results Test
- [ ] Keep the evaluation site `noindex` (or retire it) so it never competes with funngro.com
