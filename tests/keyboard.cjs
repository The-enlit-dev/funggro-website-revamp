// Keyboard walk-through + visible focus + interaction latency (lab INP approximation).
// Usage: node tests/keyboard.cjs <baseUrl>
const { chromium } = require('playwright');
const fs = require('fs');
const base = process.argv[2] || 'http://localhost:4173';
const res = []; const ok = (n, p, i = '') => res.push([p ? 'PASS' : 'FAIL', n, i]);
const report = {};

(async () => {
  const b = await chromium.launch();
  for (const [vn, vp, mob] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    for (const p of ['/earn', '/about']) {
      const ctx = await b.newContext({ viewport: vp, isMobile: mob, reducedMotion: 'reduce' });
      const pg = await ctx.newPage();
      await pg.goto(base + p, { waitUntil: 'networkidle' });
      const expected = await pg.evaluate(() => [...document.querySelectorAll('a[href], button:not([disabled]), summary, [tabindex="0"]')]
        .filter((e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && !e.closest('dialog:not([open])') && !e.closest('[hidden]'); }).length);
      const stops = []; let noRing = []; let hidden = []; let platformStops = []; let seen = new Set();
      for (let i = 0; i < expected + 5; i++) {
        await pg.keyboard.press('Tab');
        await pg.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); // let :focus styles apply
        const info = await pg.evaluate(() => {
          const e = document.activeElement; if (!e || e === document.body) return null;
          const s = getComputedStyle(e); const r = e.getBoundingClientRect();
          const header = document.querySelector('[data-header]')?.getBoundingClientRect();
          const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none');
          const id = e.tagName + '|' + (e.getAttribute('href') || '') + '|' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30) + '|' + [...document.querySelectorAll('*')].indexOf(e);
          const platform = e.tagName === 'IFRAME' && !e.closest('main, header, footer, dialog'); // Netlify edge-injected badge frame
          const coveredByHeader = header && !e.closest('[data-header]') && !e.classList.contains('skip-link') && r.bottom <= header.bottom + 2;
          return { id, ring, platform, inView: r.bottom > 0 && r.top < innerHeight, coveredByHeader };
        });
        if (!info) break;
        if (seen.has(info.id)) break; // wrapped around
        seen.add(info.id);
        if (info.platform) { platformStops.push(info.id); continue; }
        stops.push(info.id);
        if (!info.ring) noRing.push(info.id);
        if (!info.inView || info.coveredByHeader) hidden.push(info.id);
      }
      const key = `${p} ${vn}`;
      report[key] = { expected, stops: stops.length, noRing, hidden, platformInjectedFocusStops: platformStops.length };
      ok(`${key}: Tab reaches every focusable element (${stops.length}/${expected})`, stops.length >= expected);
      ok(`${key}: every focus stop shows a focus indicator`, noRing.length === 0, noRing.slice(0, 3).join(' ; '));
      ok(`${key}: focused element scrolled into view, not under sticky header`, hidden.length === 0, hidden.slice(0, 3).join(' ; '));
      if (platformStops.length) console.log(`NOTE  ${key}: ${platformStops.length} focus stop(s) on Netlify's injected badge iframe (platform, not site code)`);
      await ctx.close();
    }
  }
  // Mobile menu focus containment
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true }); const pg = await ctx.newPage();
    await pg.goto(base + '/earn', { waitUntil: 'networkidle' });
    await pg.focus('[data-menu-open]'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
    let escaped = false;
    for (let i = 0; i < 25; i++) { await pg.keyboard.press('Tab'); if (await pg.evaluate(() => { const a = document.activeElement; return a && a !== document.body && !document.getElementById('menu').contains(a); })) { escaped = true; break; } }
    ok('mobile menu: keyboard opens it and focus stays inside while open', !escaped);
    await pg.keyboard.press('Escape');
    ok('mobile menu: Esc closes and returns focus', await pg.evaluate(() => !document.getElementById('menu').open && document.activeElement.hasAttribute('data-menu-open')));
    await ctx.close();
  }
  // Interaction latency (lab approximation of INP): max Event Timing duration across real clicks/keypresses
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const pg = await ctx.newPage();
    await pg.addInitScript(() => { window.__ev = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) window.__ev.push({ n: e.name, d: e.duration }); }).observe({ type: 'event', durationThreshold: 16, buffered: true }); });
    await pg.goto(base + '/earn', { waitUntil: 'networkidle' });
    await pg.tap('[data-menu-open]'); await pg.waitForTimeout(300); await pg.tap('[data-menu-close]'); await pg.waitForTimeout(300);
    for (const i of [0, 1, 2]) { const s = pg.locator('.faq__item summary').nth(i); await s.scrollIntoViewIfNeeded(); await s.tap(); await pg.waitForTimeout(250); }
    await pg.locator('[data-rail]').scrollIntoViewIfNeeded();
    await pg.locator('[data-rail]').evaluate((r) => r.scrollBy({ left: 300 }));
    await pg.waitForTimeout(400);
    const evE = await pg.evaluate(() => window.__ev);
    const maxEarn = Math.max(0, ...evE.map((e) => e.d));
    report.interactionLatency = { note: 'Event Timing durations ≥16 ms during taps on menu + FAQ (mobile emulation, no CPU throttling)', entries: evE };
    ok('interaction latency (lab INP approx.) < 200 ms', maxEarn < 200, evE.length ? `max ${maxEarn} ms over ${evE.length} slow-ish events` : 'all interactions under 16 ms (no Event Timing entries ≥16 ms)');
    await ctx.close();
  }
  fs.writeFileSync('qa/keyboard.json', JSON.stringify(report, null, 1));
  await b.close();
  for (const r of res) console.log(r.join('  '));
  const f = res.filter((r) => r[0] === 'FAIL').length; console.log(`${res.length - f}/${res.length} passed`); process.exit(f ? 1 : 0);
})();
