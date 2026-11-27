// Captures delivery screenshots from the LIVE evaluation site. Usage: node scripts/capture-delivery-screens.cjs <baseUrl>
const { chromium } = require('playwright');
const base = process.argv[2] || 'https://funngro-revamp-evaluation.netlify.app';
const out = 'delivery/screenshots';
(async () => {
  const b = await chromium.launch();
  const shots = [];
  for (const [label, vp, mobile, dsfFold] of [['desktop-1440', { width: 1440, height: 900 }, false, 2], ['tablet-768', { width: 768, height: 1024 }, false, 2], ['mobile-390', { width: 390, height: 844 }, true, 2]]) {
    for (const p of ['earn', 'about']) {
      for (const [kind, dsf] of [['fold', dsfFold], ['full', 1]]) {
        if (label === 'tablet-768' && kind === 'fold') continue;
        const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dsf, isMobile: mobile, hasTouch: mobile });
        const pg = await ctx.newPage();
        await pg.goto(`${base}/${p}`, { waitUntil: 'networkidle' });
        await pg.evaluate(() => document.fonts.ready);
        await pg.waitForTimeout(2200); // let hero sticker/highlighter animations settle
        if (kind === 'full') {
          await pg.evaluate(async () => { document.documentElement.style.scrollBehavior = 'auto'; for (let y = 0; y < document.body.scrollHeight; y += 350) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 200)); } scrollTo(0, 0); });
          await pg.waitForTimeout(1000);
        }
        const file = `${out}/${p}-${label}-${kind}.png`;
        await pg.screenshot({ path: file, fullPage: kind === 'full' });
        shots.push(file); await ctx.close();
      }
    }
  }
  // Founder section close-ups
  for (const [label, vp, mobile] of [['desktop-1440', { width: 1440, height: 900 }, false], ['mobile-390', { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: mobile, reducedMotion: 'reduce' }); const pg = await ctx.newPage();
    await pg.goto(`${base}/about`, { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
    const file = `${out}/about-founders-${label}.png`; await (await pg.$('.founders')).screenshot({ path: file }); shots.push(file); await ctx.close();
  }
  console.log(new Date().toISOString(), 'captured', shots.length, 'screenshots from', base); console.log(shots.join('\n'));
  await b.close();
})();
