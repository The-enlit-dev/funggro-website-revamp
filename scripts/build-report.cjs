// Builds delivery/Funngro-Website-SEO-Audit-Report.pdf from the Markdown source.
// Usage: NODE_PATH=$(npm root -g) node scripts/build-report.cjs
const fs = require('fs'); const path = require('path');
const { marked } = require(path.resolve('node_modules/marked'));
const { chromium } = require('playwright');
const DIR = path.resolve('delivery');
const SRC = path.join(DIR, 'Funngro-Website-SEO-Audit-Report.md');
const OUT_PDF = path.join(DIR, 'Funngro-Website-SEO-Audit-Report.pdf');
const font = (f) => 'file://' + path.resolve('src/fonts', f);

let md = fs.readFileSync(SRC, 'utf8');
marked.setOptions({ gfm: true, breaks: false });
let body = marked.parse(md);
// Inline SVG diagrams so they use the report fonts
body = body.replace(/<img class="diagram" src="([^"]+\.svg)" alt="([^"]*)">/g, (_, src, alt) =>
  `<figure class="diagram">${fs.readFileSync(path.join(DIR, src), 'utf8').replace('<svg ', `<svg aria-label="${alt}" `)}</figure>`);
// Selected sections start on a new page
for (const n of ['1. Executive summary', '10. Audit findings', '12. Changes implemented', '14. Testing results']) body = body.replace(new RegExp('<h2([^>]*)>(' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')'), '<h2 class="newpage"$1>$2');
// Make bare URLs in tables/lists clickable
const codes = []; body = body.replace(/<code>[\s\S]*?<\/code>/g, (m) => { codes.push(m); return `\u0000${codes.length - 1}\u0000`; });
body = body.replace(/(^|[\s(>])(https?:\/\/[^\s<)\u0000]+)/g, (m, pre, url) => `${pre}<a href="${url}">${url}</a>`);
body = body.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[+i]);
// References section in a compact style
body = body.replace(/(<h2[^>]*>17\. Sources and references<\/h2>)([\s\S]*)$/, '$1<div class="refs">$2</div>');

const css = `
@font-face{font-family:"Bricolage Grotesque";src:url(${font('bricolage.woff2')});font-weight:500 800}
@font-face{font-family:"Bricolage Grotesque";src:url(${font('bricolage-rupee.woff2')});font-weight:500 800;unicode-range:U+20B9}
@font-face{font-family:Figtree;src:url(${font('figtree.woff2')});font-weight:300 900}
@font-face{font-family:Figtree;src:url(${font('figtree-rupee.woff2')});font-weight:300 900;unicode-range:U+20B9}
@page{size:A4;margin:18mm 16mm 18mm 16mm}
@page:first{margin:0}
:root{--ink:#0E1A12;--ink2:#1C2A21;--muted:#56655B;--paper:#F6F1E7;--paper2:#EFE8D9;--line:#d9d2c3;--green:#07AB5F;--deep:#067A41;--lime:#D2F28A}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font:400 10.2pt/1.55 Figtree,Arial,sans-serif;color:var(--ink);margin:0}
h1,h2,h3{font-family:"Bricolage Grotesque",Arial,sans-serif;font-weight:800;letter-spacing:-.01em;line-height:1.15;color:var(--ink)}
h2{font-size:19pt;margin:22pt 0 10pt;padding-top:4pt;break-after:avoid}
h2.newpage{break-before:page;margin-top:0}
h2,h3{break-inside:avoid}
.refs{font-size:8.4pt;line-height:1.42}.refs h3{font-size:10.5pt;margin:10pt 0 4pt}.refs li{margin:0 0 2pt}
h2::before{content:"";display:block;width:34pt;height:5pt;border-radius:3pt;background:var(--green);margin-bottom:9pt}
h3{font-size:12.5pt;margin:16pt 0 6pt;break-after:avoid}
h3+table,h3+p,h3+ul,h3+ol{break-before:avoid}
p{margin:0 0 8pt;orphans:3;widows:3}
ul,ol{margin:0 0 8pt;padding-left:16pt} li{margin:0 0 3pt}
strong{font-weight:700}
a{color:var(--deep);text-decoration:none;word-break:break-word}
th code{background:rgba(246,241,231,.18);color:#F6F1E7}
code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:8.6pt;background:var(--paper2);padding:.5pt 3pt;border-radius:3pt}
table{width:100%;border-collapse:collapse;margin:6pt 0 12pt;font-size:8.8pt;line-height:1.4;break-inside:auto}
thead{display:table-header-group}
tr{break-inside:avoid}
th{background:var(--ink);color:var(--paper);text-align:left;font-weight:700;padding:5pt 6pt}
td{padding:4.5pt 6pt;border-bottom:.6pt solid var(--line);vertical-align:top}
tbody tr:nth-child(even) td{background:#FBF8F2}
figure{margin:8pt 0 12pt;break-inside:avoid}
figure.diagram svg{width:100%;height:auto;display:block}
figure img{width:100%;display:block;border:.8pt solid var(--line);border-radius:4pt}
figcaption{font-size:8pt;color:var(--muted);margin-top:4pt}
.figrow{display:flex;gap:10pt;margin:8pt 0 12pt;break-inside:avoid}
.figrow figure{flex:1;margin:0}
.figrow--mobile figure{flex:0 0 31%}
.figrow--mobile{justify-content:center}
.figrow--lh{flex-direction:column;gap:8pt}
.figrow--lh img{border:none}
figure.wide img{max-height:120mm;object-fit:contain;background:#fff}
.serp{border:.8pt solid var(--line);border-radius:8pt;padding:10pt 12pt;margin:8pt 0 12pt;background:#fff;break-inside:avoid;font-family:Arial,sans-serif}
.serp-label{font:600 7.6pt Figtree,Arial,sans-serif;color:var(--muted);text-transform:none;margin-bottom:6pt}
.serp-url{font-size:9pt;color:#4d5156;margin:0}
.serp-title{font-size:13.5pt;color:#1a0dab;margin:2pt 0}
.serp-desc{font-size:9.4pt;color:#4d5156;margin:0}
/* cover */
.cover{height:297mm;padding:30mm 22mm 20mm;background:var(--paper);position:relative;break-after:page;
  background-image:linear-gradient(rgba(14,26,18,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(14,26,18,.04) 1px,transparent 1px);background-size:9mm 9mm}
.cover .cover-kicker{display:inline-block;font:700 9pt Figtree;padding:4pt 10pt;border:1.2pt solid var(--ink);border-radius:20pt;background:#fff;margin-bottom:18mm}
.cover h1{font-size:40pt;line-height:1.02;margin:0 0 8mm;max-width:150mm}
.cover h1::after{content:"";display:block;width:62mm;height:9pt;background:var(--lime);margin-top:5mm;border-radius:3pt}
.cover .cover-sub{font-size:13pt;line-height:1.5;color:var(--ink2);max-width:150mm;margin-bottom:14mm}
.cover table.cover-meta{width:100%;font-size:9.6pt;border-top:1.4pt solid var(--ink)}
.cover table.cover-meta td{background:transparent!important;padding:7pt 4pt;border-bottom:.6pt solid #cfc7b6}
.cover table.cover-meta td:first-child{width:44mm;font-weight:700;color:var(--muted)}
.cover .cover-note{position:absolute;left:22mm;right:22mm;bottom:20mm;font-size:8.8pt;color:var(--muted);border-left:3pt solid var(--green);padding-left:8pt}
.toc{break-after:page}
.toc h2{break-before:avoid}
.toc ol{font-size:11pt;line-height:1.9;columns:1}
`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Funngro Website SEO Audit Report</title><style>${css}</style></head><body>${body}</body></html>`;
const tmpHtml = path.join(DIR, '.report-build.html');
fs.writeFileSync(tmpHtml, html);

(async () => {
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.goto('file://' + tmpHtml, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  const missing = await pg.$$eval('img', (is) => is.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
  if (missing.length) { console.error('MISSING IMAGES', missing); process.exit(1); }
  await pg.pdf({
    path: OUT_PDF, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `<div style="width:100%;font:7.5pt Arial,sans-serif;color:#56655B;padding:0 16mm;display:flex;justify-content:space-between"><span>Funngro Website SEO Audit Report · 27 November 2026</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`,
  });
  await b.close(); fs.unlinkSync(tmpHtml);
  console.log('PDF written', OUT_PDF, (fs.statSync(OUT_PDF).size / 1024).toFixed(0) + ' KB');
})();
