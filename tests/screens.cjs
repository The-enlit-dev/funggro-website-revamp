// Usage: node tests/screens.cjs <baseUrl> <outDir> [widths...]
const { chromium } = require('playwright');
const fs = require('fs');
const [base = 'http://localhost:4173', out = 'qa/screens', ...ws] = process.argv.slice(2);
const widths = ws.length ? ws.map(Number) : [390, 1440];
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const report = [];
  for (const p of ['earn', 'about']) for (const w of widths) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 });
    const pg = await ctx.newPage(); const errs = []; const platform = [];
    // Errors raised inside Netlify's edge-injected 'Powered by Netlify' badge iframe (about:srcdoc) are blocked by our CSP by design; report them separately.
    pg.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') { (m.location().url === 'about:srcdoc' ? platform : errs).push(m.type() + ': ' + m.text().slice(0, 120)); } });
    pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
    pg.on('requestfailed', (r) => errs.push('failed: ' + r.url()));
    await pg.goto(`${base}/${p}`, { waitUntil: 'networkidle' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(1800);
    await pg.screenshot({ path: `${out}/${p}-${w}-fold.png` });
    // scroll through so reveals fire, then capture the full page
    await pg.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 220)); } scrollTo(0, 0); });
    await pg.waitForTimeout(900);
    await pg.screenshot({ path: `${out}/${p}-${w}-full.png`, fullPage: true });
    const m = await pg.evaluate((W) => ({ h: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth > W, layoutWidth: innerWidth,
      offenders: [...document.querySelectorAll('main *, header *, footer *')].filter((e) => { const r = e.getBoundingClientRect(); if (!r.width || e.closest('.rail, .work__rail, [aria-hidden="true"], .visually-hidden, dialog')) return false; return r.right > W + 1 || r.left < -1; }).slice(0, 5).map((e) => e.tagName + '.' + [...e.classList].join('.') + '<' + (e.parentElement.className || e.parentElement.tagName) + ' r=' + Math.round(e.getBoundingClientRect().right)),
      fontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + (f.unicodeRange || '')),
      rupeeFont: (() => { const el = document.querySelector('.money'); return el ? getComputedStyle(el).fontFamily : null; })() }), w);
    report.push({ page: p, width: w, ...m, errors: errs, platformInjectedErrors: platform });
    console.log(p, w, 'h=' + m.h, 'overflowX=' + m.overflowX, 'offenders=' + JSON.stringify(m.offenders), 'errors=' + errs.length, 'netlifyBadgeBlocked=' + platform.length, errs.slice(0, 3).join(' | '));
    await ctx.close();
  }
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
  await b.close();
})();
