// Static build: partials + <picture> generation + CSS bundling + SEO files.
// Env: DEPLOY_TARGET = "evaluation" (default, noindex) | "production" (indexable)
//      SITE_URL = absolute origin. Defaults: Netlify's URL env (evaluation) or productionUrl (production).
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { bundle } from 'lightningcss';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const cfg = JSON.parse(await fs.readFile(path.join(SRC, 'site.config.json'), 'utf8'));
const manifest = JSON.parse(await fs.readFile(path.join(SRC, 'images/manifest.json'), 'utf8'));

const TARGET = process.env.DEPLOY_TARGET === 'production' ? 'production' : 'evaluation';
const SITE_URL = (process.env.SITE_URL || (TARGET === 'production' ? cfg.productionUrl : process.env.URL) || 'http://localhost:4173').replace(/\/$/, '');
const INDEXABLE = TARGET === 'production';
console.log(`build: target=${TARGET} site=${SITE_URL} indexable=${INDEXABLE}`);

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(path.join(DIST, 'assets'), { recursive: true });

const hash = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);
async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const e of await fs.readdir(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) await copyDir(a, b); else if (e.name !== 'manifest.json' && !e.name.endsWith('-badge.png')) await fs.copyFile(a, b);
  }
}

// ---------- CSS ----------
const { code: css } = bundle({ filename: path.join(SRC, 'styles/main.css'), minify: true, targets: { chrome: 100 << 16, safari: 15 << 16, firefox: 100 << 16 } });
const cssName = `site.${hash(css)}.css`;
await fs.writeFile(path.join(DIST, 'assets', cssName), css);

// ---------- JS ----------
const jsNames = {};
for (const f of await fs.readdir(path.join(SRC, 'scripts'))) {
  const buf = await fs.readFile(path.join(SRC, 'scripts', f));
  const name = f.replace(/\.js$/, `.${hash(buf)}.js`);
  jsNames[f] = name;
  await fs.writeFile(path.join(DIST, 'assets', name), buf);
}

// ---------- static assets ----------
await copyDir(path.join(SRC, 'images'), path.join(DIST, 'assets/img'));
await copyDir(path.join(SRC, 'fonts'), path.join(DIST, 'assets/fonts'));
await copyDir(path.join(SRC, 'public'), DIST);

// ---------- helpers ----------
function picture(attrs) {
  const name = attrs.name, m = manifest[name];
  if (!m) throw new Error(`no image ${name}`);
  const sizes = attrs.sizes || '100vw';
  const eager = 'eager' in attrs;
  const fmts = m.formats;
  const fallbackFmt = fmts.includes('jpg') ? 'jpg' : 'webp';
  const src = (f) => m.widths.map((w) => `/assets/img/${name}-${w}.${f} ${w}w`).join(', ');
  const w0 = m.widths[Math.min(1, m.widths.length - 1)];
  const sources = fmts.filter((f) => f !== fallbackFmt).map((f) => `<source type="image/${f}" srcset="${src(f)}" sizes="${sizes}">`).join('');
  const cls = attrs.class ? ` class="${attrs.class}"` : '';
  return `<picture${attrs.pclass ? ` class="${attrs.pclass}"` : ''}>${sources}<img src="/assets/img/${name}-${w0}.${fallbackFmt}" srcset="${src(fallbackFmt)}" sizes="${sizes}" width="${w0}" height="${m.height[w0]}" alt="${attrs.alt ?? ''}"${cls} decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}></picture>`;
}
const parseAttrs = (s) => Object.fromEntries([...s.matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map((m) => [m[1], m[2] ?? '']));

function jsonLd(page) {
  const url = `${SITE_URL}${cfg.pages[page].path}`;
  const org = {
    '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: cfg.name, legalName: cfg.legalName, url: SITE_URL,
    logo: `${SITE_URL}/logo-square.png`, email: cfg.email,
    address: { '@type': 'PostalAddress', ...cfg.address }, sameAs: cfg.sameAs,
  };
  const crumbs = (name) => ({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name, item: url }] });
  let graph;
  if (page === 'earn') {
    graph = [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: cfg.pages.earn.title, description: cfg.pages.earn.description, inLanguage: 'en-IN', isPartOf: { '@id': `${SITE_URL}/#website` }, publisher: { '@id': `${SITE_URL}/#organization` } },
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: cfg.name, publisher: { '@id': `${SITE_URL}/#organization` } },
      org,
      { '@type': 'MobileApplication', name: 'Funngro', operatingSystem: 'Android, iOS', applicationCategory: 'FinanceApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, installUrl: cfg.playUrl, sameAs: [cfg.playUrl, cfg.appStoreUrl], publisher: { '@id': `${SITE_URL}/#organization` } },
      crumbs('Earn'),
      { '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ];
  } else if (page === 'about') {
    graph = [
      { '@type': 'AboutPage', '@id': `${url}#webpage`, url, name: cfg.pages.about.title, description: cfg.pages.about.description, inLanguage: 'en-IN', about: { '@id': `${SITE_URL}/#organization` } },
      { ...org, foundingDate: cfg.foundingDate, founder: cfg.founders.map((f) => ({ '@type': 'Person', name: f.name, jobTitle: f.jobTitle, sameAs: f.sameAs, worksFor: { '@id': `${SITE_URL}/#organization` } })) },
      crumbs('About'),
    ];
  } else return '';
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

// FAQ is defined in the page as data-faq blocks; extracted here so JSON-LD always matches visible text.
let FAQ = [];
const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function render(page) {
  let html = await fs.readFile(path.join(SRC, 'pages', `${page}.html`), 'utf8');
  // includes (one level of nesting is enough here)
  for (let i = 0; i < 3; i++) {
    html = await replaceAsync(html, /<!--#include ([\w-]+) -->/g, async (_, n) => fs.readFile(path.join(SRC, 'partials', `${n}.html`), 'utf8'));
  }
  html = html.replace(/<!--#pic ([^>]*?)-->/g, (_, a) => picture(parseAttrs(a)));
  FAQ = [...html.matchAll(/<details class="faq__item"[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<div class="faq__a">([\s\S]*?)<\/div>/g)].map((m) => [stripTags(m[1]), stripTags(m[2])]);
  const p = cfg.pages[page];
  const vars = {
    TITLE: p.title, DESCRIPTION: p.description, CANONICAL: `${SITE_URL}${p.path}`, OG_IMAGE: `${SITE_URL}/assets/img/${p.ogImage}`, OG_ALT: p.ogAlt,
    ROBOTS: INDEXABLE ? 'index, follow, max-image-preview:large' : 'noindex, nofollow',
    CSS: `/assets/${cssName}`, JS_MAIN: `/assets/${jsNames['main.js']}`,
    JSONLD: jsonLd(page), PLAY: cfg.playUrl, APPSTORE: cfg.appStoreUrl, LIVE: cfg.liveSite, EMAIL: cfg.email, SAFETY_EMAIL: cfg.safetyEmail,
    LEGAL: cfg.legalName, PLAY_RATING: cfg.store.playRating, PLAY_REVIEWS: cfg.store.playReviews, PLAY_DOWNLOADS: cfg.store.playDownloads,
    AS_OF: cfg.store.asOf, AS_OF_ISO: cfg.store.asOfIso, YEAR: '2026', PAGE: page,
  };
  html = html.replace(/%%(\w+)%%/g, (m, k) => { if (!(k in vars)) throw new Error(`unknown var ${k} in ${page}`); return vars[k]; });
  if (page === '404') html = html.replace(/<link rel="canonical"[^>]*>\n?/, '');
  if (/\{\{|%%/.test(html)) throw new Error(`unresolved template token in ${page}`);
  await fs.writeFile(path.join(DIST, `${page}.html`), html);
  console.log(`page ${page}.html ${(html.length / 1024).toFixed(1)} KB`);
}
async function replaceAsync(str, re, fn) {
  const parts = []; let last = 0;
  for (const m of str.matchAll(re)) { parts.push(str.slice(last, m.index), await fn(...m)); last = m.index + m[0].length; }
  parts.push(str.slice(last)); return parts.join('');
}

for (const page of ['earn', 'about', '404']) await render(page);

// ---------- Netlify + SEO files ----------
await fs.writeFile(path.join(DIST, '_redirects'), [
  '# Root has no page of its own in this two-page build: send visitors to the Teen page (temporary).',
  '/          /earn    302',
  '# Legacy route on the live site',
  '/teen      /earn    301',
  '/teen/     /earn    301',
  '# Avoid duplicate .html URLs',
  '/earn.html  /earn   301!',
  '/about.html /about  301!',
  '',
].join('\n'));

const security = [
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  X-Frame-Options: DENY',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()',
  '  Strict-Transport-Security: max-age=31536000; includeSubDomains',
  "  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
];
await fs.writeFile(path.join(DIST, '_headers'), [
  '/*', ...security, ...(INDEXABLE ? [] : ['  X-Robots-Tag: noindex, nofollow']),
  '/assets/*', '  Cache-Control: public, max-age=31536000, immutable',
  '/*.html', '  Cache-Control: public, max-age=0, must-revalidate',
  '',
].join('\n'));

await fs.writeFile(path.join(DIST, 'robots.txt'), INDEXABLE
  ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  : `# Evaluation deployment — not for indexing. The official site is ${cfg.productionUrl}\nUser-agent: *\nDisallow: /\n`);
const today = new Date().toISOString().slice(0, 10);
await fs.writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['earn', 'about'].map((p) => `  <url><loc>${SITE_URL}${cfg.pages[p].path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log('done');
