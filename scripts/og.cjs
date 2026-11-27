// One-off: renders 1200×630 Open Graph images with Playwright (run locally; outputs committed to src/images).
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs'); const os = require('os');
const R = (p) => 'file://' + path.resolve(p);
const page = (title, hl, sub, img) => `<!doctype html><html><head><style>
@font-face{font-family:B;src:url(${R('src/fonts/bricolage.woff2')});font-weight:500 800}
@font-face{font-family:B;src:url(${R('src/fonts/bricolage-rupee.woff2')});font-weight:500 800;unicode-range:U+20B9}
@font-face{font-family:F;src:url(${R('src/fonts/figtree.woff2')});font-weight:300 900}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#F6F1E7;font-family:F;color:#0E1A12;position:relative;overflow:hidden;
background-image:linear-gradient(rgba(14,26,18,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(14,26,18,.04) 1px,transparent 1px);background-size:32px 32px}
.logo{position:absolute;left:72px;top:60px;width:190px}
h1{position:absolute;left:72px;top:150px;width:650px;font:800 76px/1 B;letter-spacing:-.02em}
.hl{position:relative;z-index:0;white-space:nowrap}.hl:before{content:"";position:absolute;z-index:-1;left:-6px;right:-6px;top:.5em;bottom:.02em;background:#D2F28A;border-radius:8px;transform:rotate(-1.2deg)}
p{position:absolute;left:72px;bottom:64px;max-width:560px;font:600 26px F;color:#1C2A21}
.phone{position:absolute;right:120px;top:70px;width:270px;border-radius:36px;background:#0E1A12;padding:9px;transform:rotate(5deg);box-shadow:0 30px 60px -30px rgba(0,0,0,.5)}
.phone img{width:100%;border-radius:28px;display:block}
.card{position:absolute;right:300px;top:300px;width:190px;background:#FFFDF8;padding:9px 9px 12px;border:1.5px solid #0E1A12;border-radius:6px;transform:rotate(-6deg);box-shadow:0 20px 40px -24px rgba(0,0,0,.5);font:700 15px F}
.card img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;margin-bottom:8px}
</style></head><body><img class="logo" src="${R('src/public/logo.svg')}"><h1>${title.replace(hl, `<span class="hl">${hl}</span>`)}</h1><p>${sub}</p>
<div class="phone"><img src="${R('src/images/screen-reward-540.webp')}"></div><div class="card"><img src="${R(img[0])}">${img[1]}</div></body></html>`;
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const [file, html] of [
    ['og-earn.jpg', page('Earn your first income online, from real brands.', 'first income', 'Free to join · Ages 14–25 · Withdraw to UPI or bank', ['src/images/earner-yashraj-singh-480.jpg', 'Yash Raj Singh'])],
    ['og-about.jpg', page('Built so young Indians can earn for real.', 'earn for real.', 'Mumbai · As seen on Shark Tank India', ['src/images/earner-sarthak-320.jpg', 'Sarthak, Delhi'])],
  ]) { const tmp = path.join(os.tmpdir(), 'og-' + file + '.html'); fs.writeFileSync(tmp, html); await pg.goto('file://' + tmp, { waitUntil: 'load' }); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300); await pg.screenshot({ path: `src/images/${file}`, type: 'jpeg', quality: 86 }); console.log(file); }
  await b.close();
})();
