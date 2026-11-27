// Checks built pages on a live URL: metadata, headings, JSON-LD, images alt, internal + external links.
// Usage: node tests/seo-links.cjs <baseUrl> [--expect-noindex]
const { chromium } = require('playwright');
const base = process.argv[2]; const expectNoindex = process.argv.includes('--expect-noindex');
const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); let fails = []; const links = new Set(); const report = {};
  for (const p of ['/earn', '/about']) {
    const res = await pg.goto(base + p, { waitUntil: 'networkidle' });
    const raw = await res.text(); // server HTML (no JS) — what crawlers get
    const d = await pg.evaluate(() => {
      const m = (s) => document.querySelector(s)?.getAttribute('content') ?? null;
      return {
        title: document.title, desc: m('meta[name=description]'), robots: m('meta[name=robots]'), canonical: document.querySelector('link[rel=canonical]')?.href,
        ogTitle: m('meta[property="og:title"]'), ogUrl: m('meta[property="og:url"]'), ogImage: m('meta[property="og:image"]'), twCard: m('meta[name="twitter:card"]'),
        lang: document.documentElement.lang, h1: [...document.querySelectorAll('h1')].map((e) => e.textContent.trim()),
        headings: [...document.querySelectorAll('h1,h2,h3,h4')].map((e) => +e.tagName[1]),
        imgsNoAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.src),
        imgsNoDims: [...document.images].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.src),
        jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
        links: [...document.querySelectorAll('a[href]')].map((a) => a.href),
      };
    });
    const skips = []; for (let i = 1; i < d.headings.length; i++) if (d.headings[i] - d.headings[i - 1] > 1) skips.push(`h${d.headings[i - 1]}→h${d.headings[i]}`);
    let ld = []; try { ld = d.jsonld.map((j) => JSON.parse(j)); } catch (e) { fails.push(`${p}: JSON-LD parse error`); }
    const types = ld.flatMap((x) => (x['@graph'] || [x]).map((g) => g['@type']));
    const checks = {
      'title 30–60 chars': d.title.length >= 30 && d.title.length <= 60,
      'description 70–160 chars': (d.desc || '').length >= 70 && (d.desc || '').length <= 160,
      'one h1': d.h1.length === 1, 'no heading level skips': skips.length === 0,
      'canonical = page URL': d.canonical === base + p, 'og:url = canonical': d.ogUrl === d.canonical, 'og:image absolute': /^https?:\/\//.test(d.ogImage || ''),
      'twitter card': d.twCard === 'summary_large_image', 'lang en-IN': d.lang === 'en-IN',
      [`robots ${expectNoindex ? 'noindex' : 'index'}`]: expectNoindex ? /noindex/.test(d.robots) : /index/.test(d.robots) && !/noindex/.test(d.robots),
      'all imgs have alt': d.imgsNoAlt.length === 0, 'all imgs have width/height': d.imgsNoDims.length === 0,
      'h1 present in server HTML (no JS)': /<h1[\s>]/.test(raw), 'JSON-LD in server HTML': raw.includes('application/ld+json'),
      'no unresolved placeholders': !/\{\{|%%/.test(raw),
    };
    for (const [k, v] of Object.entries(checks)) if (!v) fails.push(`${p}: ${k}`);
    report[p] = { ...d, jsonld: types, skips, checks, links: undefined };
    console.log(p, `title(${d.title.length})="${d.title}"`, `desc(${(d.desc || '').length})`, 'robots=' + d.robots, 'canonical=' + d.canonical, 'jsonld=' + types.join(','), 'h1=' + JSON.stringify(d.h1));
    d.links.forEach((l) => links.add(l.split('#')[0]));
  }
  // link check
  const results = [];
  for (const url of links) {
    if (url.startsWith('mailto:')) { results.push([url, 'mailto']); continue; }
    let status;
    try {
      const r = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (link-check)' }, signal: AbortSignal.timeout(25000) });
      status = r.status;
    } catch (e) { status = 'ERR ' + (e.cause?.code || e.message); }
    results.push([url, status]);
  }
  const bad = results.filter(([u, s]) => s !== 'mailto' && !(s >= 200 && s < 400));
  console.log(`links checked: ${results.length}, not OK: ${bad.length}`); bad.forEach(([u, s]) => console.log('  ', s, u));
  fs.mkdirSync('qa', { recursive: true }); fs.writeFileSync('qa/seo-links.json', JSON.stringify({ base, report, links: results, fails }, null, 1));
  console.log(fails.length ? 'FAILS:\n  ' + fails.join('\n  ') : 'all metadata checks passed');
  await b.close();
})();
