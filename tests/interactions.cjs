// Interaction & navigation checks on a live/base URL.
const { chromium } = require('playwright');
const base = process.argv[2] || 'http://localhost:4173';
const results = []; const ok = (name, pass, info = '') => { results.push([pass ? 'PASS' : 'FAIL', name, info]); };
(async () => {
  const b = await chromium.launch();
  // --- mobile menu ---
  let ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  let pg = await ctx.newPage();
  await pg.goto(base + '/earn', { waitUntil: 'networkidle' });
  await pg.click('[data-menu-open]');
  ok('mobile menu opens', await pg.$eval('#menu', (d) => d.open));
  ok('menu toggle aria-expanded=true', (await pg.getAttribute('[data-menu-open]', 'aria-expanded')) === 'true');
  ok('focus moved into menu', await pg.evaluate(() => document.getElementById('menu').contains(document.activeElement)));
  await pg.keyboard.press('Escape');
  ok('Esc closes menu', !(await pg.$eval('#menu', (d) => d.open)));
  ok('focus returns to toggle', await pg.evaluate(() => document.activeElement?.hasAttribute('data-menu-open')));
  await pg.click('[data-menu-open]'); await pg.click('#menu nav a[href="/about"]');
  await pg.waitForURL('**/about'); ok('menu link navigates to /about', pg.url().endsWith('/about'));
  ok('About marked aria-current in nav', (await pg.$$eval('[aria-current="page"]', (els) => els.map((e) => e.textContent.trim()))).some((t) => t.startsWith('About')));
  // story rail on mobile is swipe/scroll: verify horizontal scrollability
  await pg.goto(base + '/earn', { waitUntil: 'networkidle' });
  const rail = await pg.$eval('[data-rail]', (r) => ({ sw: r.scrollWidth, cw: r.clientWidth, tab: r.tabIndex }));
  ok('story rail scrolls horizontally + focusable', rail.sw > rail.cw && rail.tab === 0, JSON.stringify(rail));
  await ctx.close();

  // --- desktop ---
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); pg = await ctx.newPage();
  await pg.goto(base + '/earn', { waitUntil: 'networkidle' });
  ok('desktop nav visible, burger hidden', (await pg.isVisible('.nav')) && !(await pg.isVisible('.site-header [data-menu-open]')));
  await pg.keyboard.press('Tab'); ok('first Tab focuses skip link', await pg.evaluate(() => document.activeElement.classList.contains('skip-link')));
  await pg.keyboard.press('Enter'); ok('skip link targets #main', pg.url().endsWith('#main'));
  await pg.click('.site-header .header-cta'); await pg.waitForTimeout(900);
  ok('"Get the app" scrolls to download section', await pg.evaluate(() => { const r = document.getElementById('get-app').getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }));
  // steps sync
  await pg.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  for (const i of [0, 1, 2, 3]) {
    await pg.$eval(`[data-step="${i}"]`, (el) => el.scrollIntoView({ block: 'center' })); await pg.waitForTimeout(500);
    const st = await pg.evaluate(() => ({ step: [...document.querySelectorAll('[data-step]')].findIndex((s) => s.classList.contains('is-active')), screen: [...document.querySelectorAll('[data-step-screens] picture')].findIndex((p) => p.classList.contains('is-active')) }));
    ok(`step ${i + 1} active + phone screen synced`, st.step === i && st.screen === i, JSON.stringify(st));
  }
  // rail buttons
  await pg.$eval('[data-rail]', (el) => el.scrollIntoView({ block: 'center' })); await pg.waitForTimeout(300);
  ok('rail controls visible', await pg.isVisible('[data-rail-controls]'));
  ok('prev disabled at start', await pg.$eval('[data-rail-prev]', (b) => b.disabled));
  await pg.click('[data-rail-next]'); await pg.waitForTimeout(700);
  ok('next scrolls the rail', (await pg.$eval('[data-rail]', (r) => r.scrollLeft)) > 50);
  ok('prev enabled after scrolling', !(await pg.$eval('[data-rail-prev]', (b) => b.disabled)));
  // FAQ
  const faq = pg.locator('.faq__item summary').first(); await faq.scrollIntoViewIfNeeded(); await faq.click();
  ok('FAQ item opens', await pg.$eval('.faq__item', (d) => d.open));
  await pg.locator('.faq__item summary').nth(1).click(); await pg.waitForTimeout(200);
  ok('FAQ exclusive accordion (name=faq): first closes', !(await pg.$eval('.faq__item', (d) => d.open)));
  // nav between pages
  await pg.click('.nav a[href="/about"]'); await pg.waitForURL('**/about'); ok('desktop nav → /about', pg.url().endsWith('/about'));
  await pg.click('.next-card[href="/earn"]'); await pg.waitForURL('**/earn'); ok('About → "Start earning" → /earn', pg.url().endsWith('/earn'));
  // no-JS rendering
  await ctx.close(); ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }); pg = await ctx.newPage();
  for (const p of ['/earn', '/about']) {
    await pg.goto(base + p);
    const vis = await pg.evaluate(() => { const els = [...document.querySelectorAll('[data-reveal]')]; return els.length && els.every((e) => getComputedStyle(e).opacity === '1'); });
    ok(`no-JS: ${p} content fully visible`, vis);
  }
  await b.close();
  for (const r of results) console.log(r.join('  '));
  const f = results.filter((r) => r[0] === 'FAIL').length; console.log(`${results.length - f}/${results.length} passed`); process.exit(f ? 1 : 0);
})();
