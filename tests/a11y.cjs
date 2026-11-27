// axe-core WCAG 2.0/2.1/2.2 A+AA + best-practice, both pages, mobile + desktop, plus the open mobile menu.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js', { paths: [process.cwd()] }), 'utf8');
const base = process.argv[2] || 'http://localhost:4173'; const out = process.argv[3] || 'qa/a11y';
(async () => {
  fs.mkdirSync(out, { recursive: true }); const b = await chromium.launch(); let total = 0; const all = {};
  const run = async (pg, label) => {
    await pg.addScriptTag({ content: axe });
    const r = await pg.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }));
    const v = r.violations.map((x) => ({ id: x.id, impact: x.impact, help: x.help, nodes: x.nodes.map((n) => n.target.join(' ') + ' :: ' + n.failureSummary.split('\n').slice(1, 2).join(' ')) }));
    all[label] = { violations: v, passes: r.passes.length, incomplete: r.incomplete.map((x) => x.id) }; total += v.length;
    console.log(label, 'violations=' + v.length, v.map((x) => `${x.id}(${x.impact},${x.nodes.length})`).join(' '), '| passes=' + r.passes.length, '| needs-review=' + r.incomplete.map((x) => x.id).join(','));
  };
  for (const p of ['earn', 'about', '404']) for (const [vn, vp] of [['mobile', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
    const pg = await (await b.newContext({ viewport: vp, isMobile: vn === 'mobile', reducedMotion: 'reduce', bypassCSP: true /* only so the axe script itself can be injected */ })).newPage();
    await pg.goto(`${base}/${p}`, { waitUntil: 'networkidle' });
    await pg.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
    await pg.waitForTimeout(500);
    await run(pg, `${p}.${vn}`);
    if (vn === 'mobile' && p === 'earn') { await pg.click('[data-menu-open]'); await pg.waitForTimeout(400); await run(pg, `${p}.mobile.menu-open`); }
  }
  fs.writeFileSync(path.join(out, 'axe-results.json'), JSON.stringify(all, null, 1));
  await b.close(); console.log('TOTAL violations', total); process.exit(total ? 1 : 0);
})();
