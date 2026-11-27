// Prepares images for the SEO audit report (delivery/report-assets). Run: node scripts/report-assets.cjs
const path = require('path'); const fs = require('fs');
const sharp = require(path.resolve('node_modules/sharp'));
const { chromium } = require('playwright');
const OUT = 'delivery/report-assets';
const jobs = [
  // original funngro.com (captured 27 Nov 2026, Phase 1)
  ['research/screenshots/teen.desktop.fold.png', 'original-earn-desktop.jpg', 1400],
  ['research/screenshots/about.desktop.fold.png', 'original-about-desktop.jpg', 1400],
  ['research/screenshots/teen.mobile.fold.png', 'original-earn-mobile.jpg', 520],
  // redesign (live evaluation site, captured 27 Nov 2026, Phase 7)
  ['delivery/screenshots/earn-desktop-1440-fold.png', 'redesign-earn-desktop.jpg', 1400],
  ['delivery/screenshots/about-desktop-1440-fold.png', 'redesign-about-desktop.jpg', 1400],
  ['delivery/screenshots/earn-mobile-390-fold.png', 'redesign-earn-mobile.jpg', 520],
  ['delivery/screenshots/about-mobile-390-fold.png', 'redesign-about-mobile.jpg', 520],
  ['delivery/screenshots/about-founders-desktop-1440.png', 'redesign-founders-desktop.jpg', 1400],
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [src, name, w] of jobs) {
    await sharp(src).resize({ width: w, withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/${name}`);
    console.log(name, (fs.statSync(`${OUT}/${name}`).size / 1024).toFixed(0) + ' KB');
  }
  // Lighthouse score panels from the real reports
  const b = await chromium.launch();
  for (const [rep, name] of [['qa/lighthouse/earn.mobile.html', 'lighthouse-live-earn-mobile.png'], ['qa/lighthouse/about.mobile.html', 'lighthouse-live-about-mobile.png'], ['qa/lighthouse-local-production/earn.mobile.html', 'lighthouse-production-earn-mobile.png']]) {
    const pg = await b.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });
    await pg.goto('file://' + path.resolve(rep)); await pg.waitForTimeout(1500);
    // light theme + no 'all 100s' fireworks animation, for a clean static capture
    await pg.evaluate(() => { document.querySelectorAll('.lh-dark').forEach((e) => e.classList.remove('lh-dark')); document.querySelectorAll('[class*="firework"]').forEach((e) => e.remove()); document.querySelectorAll('.lh-score100').forEach((e) => e.classList.remove('lh-score100')); });
    await pg.waitForTimeout(300);
    const el = await pg.$('.lh-scores-header') || await pg.$('.lh-scores-container');
    await el.screenshot({ path: `${OUT}/${name}` });
    await sharp(`${OUT}/${name}`).resize({ width: 1400, withoutEnlargement: true }).toFile(`${OUT}/${name}.tmp`); fs.renameSync(`${OUT}/${name}.tmp`, `${OUT}/${name}`);
    console.log(name); await pg.close();
  }
  await b.close();
})();
