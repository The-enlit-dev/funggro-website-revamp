// Delivery checks on a live URL: compression, caching, fonts, social preview images, robots/sitemap content.
// Usage: NODE_USE_ENV_PROXY=1 node tests/delivery.mjs <baseUrl>
import fs from 'node:fs';
const base = process.argv[2] || 'https://funngro-revamp-evaluation.netlify.app';
const res = []; const ok = (n, p, i = '') => res.push([p ? 'PASS' : 'FAIL', n, i]);
const html = await (await fetch(base + '/earn')).text();
const css = html.match(/\/assets\/site\.[a-z0-9]+\.css/)[0];
const js = html.match(/\/assets\/main\.[a-z0-9]+\.js/)[0];
const targets = { html: '/earn', css, js, svg: '/logo.svg', font: '/assets/fonts/bricolage.woff2', avif: '/assets/img/screen-reward-540.avif', og: '/assets/img/og-earn.jpg' };
const table = [];
for (const [k, p] of Object.entries(targets)) {
  const r = await fetch(base + p, { headers: { 'accept-encoding': 'br, gzip' } });
  const buf = Buffer.from(await r.arrayBuffer());
  const row = { k, p, status: r.status, type: r.headers.get('content-type'), encoding: r.headers.get('content-encoding') || '-', cache: r.headers.get('cache-control'), bytes: buf.length };
  table.push(row);
  ok(`${k}: 200`, r.status === 200, String(r.status));
  if (['html', 'css', 'js', 'svg'].includes(k)) ok(`${k}: compressed (br/gzip)`, /br|gzip/.test(row.encoding), row.encoding);
  if (k === 'html') ok('html: revalidates (max-age=0)', /max-age=0/.test(row.cache), row.cache);
  if (['css', 'js', 'font', 'avif', 'og'].includes(k) && p.startsWith('/assets/')) ok(`${k}: long-lived immutable cache`, /max-age=31536000/.test(row.cache) && /immutable/.test(row.cache), row.cache);
}
// fonts: preloaded, swap, only 2 primary files + rupee subsets
ok('fonts preloaded (2)', (html.match(/rel="preload"[^>]+as="font"/g) || []).length === 2);
const cssText = await (await fetch(base + css)).text();
ok('all @font-face use font-display: swap', (cssText.match(/@font-face\{[^}]*\}/g) || []).filter((f) => /url\(/.test(f)).every((f) => /font-display:swap/.test(f)));
ok('rupee subset loaded via unicode-range', /unicode-range:U\+20B9/i.test(cssText));
// social images
for (const p of ['/earn', '/about']) {
  const h = await (await fetch(base + p)).text();
  const og = h.match(/property="og:image" content="([^"]+)"/)[1];
  const r = await fetch(og); const b = Buffer.from(await r.arrayBuffer());
  const w = b.readUInt16BE(b.indexOf(Buffer.from([0xff, 0xc0])) + 7), hh = b.readUInt16BE(b.indexOf(Buffer.from([0xff, 0xc0])) + 5);
  ok(`${p}: og:image 200 image/jpeg 1200×630`, r.status === 200 && /jpeg/.test(r.headers.get('content-type')) && w === 1200 && hh === 630, `${og} ${r.status} ${w}x${hh} ${b.length}B`);
  ok(`${p}: og:image is on the same (evaluation) host`, og.startsWith(base));
}
// robots + sitemap
const robots = await (await fetch(base + '/robots.txt')).text();
ok('robots.txt disallows all (evaluation)', /User-agent: \*\s+Disallow: \//.test(robots));
const sm = await (await fetch(base + '/sitemap.xml')).text();
fs.writeFileSync('qa/sitemap.live.xml', sm);
ok('sitemap lists exactly /earn and /about on this host', (sm.match(/<loc>/g) || []).length === 2 && sm.includes(`${base}/earn<`) && sm.includes(`${base}/about<`));
const hdr = (await fetch(base + '/earn')).headers;
ok('X-Robots-Tag noindex on evaluation', /noindex/.test(hdr.get('x-robots-tag') || ''), hdr.get('x-robots-tag'));
console.table(table);
for (const r of res) console.log(r.join('  '));
const f = res.filter((r) => r[0] === 'FAIL').length; console.log(`${res.length - f}/${res.length} passed`);
fs.writeFileSync('qa/delivery.json', JSON.stringify({ base, table, results: res }, null, 1));
process.exit(f ? 1 : 0);
