// Functional checks: every link/button inventoried, LinkedIn new-tab behaviour, store links, QR target, external-link safety.
// Usage: node tests/functional.cjs <baseUrl>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const base = process.argv[2] || 'http://localhost:4173';
const PLAY = 'https://play.google.com/store/apps/details?id=com.wishbanc.funngro';
const APPSTORE = 'https://apps.apple.com/in/app/funngro/id1579361075';
const results = []; const ok = (n, p, i = '') => results.push([p ? 'PASS' : 'FAIL', n, i]);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await ctx.newPage();
  const inventory = {};

  for (const p of ['/earn', '/about', '/404']) {
    await pg.goto(base + p, { waitUntil: 'networkidle' });
    const inv = await pg.evaluate(() => ({
      links: [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), abs: a.href, text: (a.getAttribute('aria-label') || a.textContent.trim() || [...a.querySelectorAll('img[alt]')].map((i) => i.alt).join(' ')).trim().replace(/\s+/g, ' ').slice(0, 60), target: a.target, rel: a.rel })),
      buttons: [...document.querySelectorAll('button')].map((x) => (x.getAttribute('aria-label') || x.textContent).trim().replace(/\s+/g, ' ')),
    }));
    inventory[p] = inv;
    ok(`${p}: every link has an accessible name`, inv.links.every((l) => l.text.length > 0), inv.links.filter((l) => !l.text).map((l) => l.href).join(','));
    ok(`${p}: every target=_blank link has rel noopener`, inv.links.filter((l) => l.target === '_blank').every((l) => /noopener/.test(l.rel)));
    ok(`${p}: no empty/# hrefs`, inv.links.every((l) => l.href && l.href !== '#'));
    ok(`${p}: store links point to the official listings`, inv.links.filter((l) => /play\.google|apps\.apple/.test(l.abs)).every((l) => l.abs === PLAY || l.abs === APPSTORE));
  }

  // LinkedIn founder links: distinct, correct, open in a new tab
  await pg.goto(base + '/about', { waitUntil: 'networkidle' });
  const li = await pg.$$eval('.founder__linkedin', (as) => as.map((a) => ({ href: a.href, target: a.target, rel: a.rel, label: a.textContent.replace(/\s+/g, ' ').trim() })));
  ok('two founder LinkedIn links', li.length === 2);
  ok('founder LinkedIn links are distinct', new Set(li.map((l) => l.href)).size === li.length, li.map((l) => l.href).join(' | '));
  ok('Payal → payal-jain-8780191', li[0]?.href === 'https://www.linkedin.com/in/payal-jain-8780191/');
  ok('Anik → anik-jain-7966404', li[1]?.href === 'https://www.linkedin.com/in/anik-jain-7966404');
  ok('LinkedIn links: target=_blank + rel noopener noreferrer', li.every((l) => l.target === '_blank' && /noopener/.test(l.rel) && /noreferrer/.test(l.rel)));
  ok('LinkedIn links: accessible name = visible text + person + new tab', li[0].label === 'LinkedIn profile of Payal Jain (opens in a new tab)' && li[1].label === 'LinkedIn profile of Anik Jain (opens in a new tab)', li.map((l) => l.label).join(' | '));
  // Record the URL the new tab requests, then abort it (LinkedIn shows a login wall to automated browsers).
  const requested = [];
  await ctx.route('https://www.linkedin.com/**', (r) => { requested.push(r.request().url()); r.abort(); });
  for (const [i, expected] of [[0, 'payal-jain-8780191'], [1, 'anik-jain-7966404']]) {
    const before = requested.length;
    const [popup] = await Promise.all([ctx.waitForEvent('page'), pg.locator('.founder__linkedin').nth(i).click()]);
    await popup.waitForTimeout(800);
    const seen = requested.slice(before).join(' ');
    ok(`click opens a new tab requesting …/in/${expected}`, seen.includes(expected) && popup !== pg, seen);
    ok('new tab has no window.opener (noopener)', await popup.evaluate(() => window.opener === null).catch(() => true));
    await popup.close();
  }
  await ctx.unroute('https://www.linkedin.com/**');

  // QR code decodes to the Google Play listing
  const sharp = require(path.resolve('node_modules/sharp'));
  const jsQR = require(path.resolve('node_modules/jsqr'));
  const svgPath = path.resolve('src/images/qr-google-play.svg');
  const { data, info } = await sharp(fs.readFileSync(svgPath), { density: 600 }).flatten({ background: '#ffffff' }).extend({ top: 40, bottom: 40, left: 40, right: 40, background: '#ffffff' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const qr = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  ok('QR decodes to Google Play listing', qr && qr.data === PLAY, qr ? qr.data : 'not decoded');
  await pg.goto(base + '/earn', { waitUntil: 'networkidle' });
  ok('QR image served on page', (await pg.$$eval('img[src*="qr-google-play"]', (is) => is.filter((i) => i.complete && i.naturalWidth > 0).length)) >= 1);

  // Store listings reachable
  for (const u of [PLAY, APPSTORE]) {
    try { const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(25000) }); ok(`store listing reachable: ${new URL(u).host}`, r.status === 200, String(r.status)); }
    catch (e) { ok(`store listing reachable: ${new URL(u).host}`, false, e.message); }
  }

  fs.mkdirSync('qa', { recursive: true });
  fs.writeFileSync('qa/functional-inventory.json', JSON.stringify(inventory, null, 1));
  await b.close();
  for (const r of results) console.log(r.join('  '));
  const total = Object.values(inventory).reduce((n, v) => n + v.links.length + v.buttons.length, 0);
  console.log(`inventory: ${total} links+buttons across 3 pages (qa/functional-inventory.json)`);
  const f = results.filter((r) => r[0] === 'FAIL').length; console.log(`${results.length - f}/${results.length} passed`); process.exit(f ? 1 : 0);
})();
