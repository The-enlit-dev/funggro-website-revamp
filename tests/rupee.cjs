// Verifies which actual font file renders the ₹ glyph (Chrome DevTools: CSS.getPlatformFontsForNode)
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:4173';
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage(); let fail = 0;
  for (const [path, sel] of [['/earn', '.tile__range .money'], ['/earn', '.ladder__note .money'], ['/earn', '.hero__tag .money'], ['/about', '.deal .money']]) {
    await pg.goto(base + path, { waitUntil: 'networkidle' }); await pg.evaluate(() => document.fonts.ready);
    const cdp = await pg.context().newCDPSession(pg);
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: sel });
    const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
    const text = await pg.$eval(sel, (e) => e.textContent);
    const ok = fonts.every((f) => /Bricolage|Figtree/i.test(f.familyName));
    if (!ok) fail++;
    console.log(ok ? 'PASS' : 'FAIL', path, sel, JSON.stringify(text), fonts.map((f) => `${f.familyName}(${f.glyphCount} glyphs, web=${!f.isCustomFont ? 'no' : 'yes'})`).join(', '));
  }
  await b.close(); process.exit(fail ? 1 : 0);
})();
