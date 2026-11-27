// Usage: node tests/lighthouse.mjs <baseUrl> <outDir> [runs=3]
// Runs Lighthouse (mobile default throttling + desktop preset) for /earn and /about; reports the median run by performance score.
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs';

const [base = 'http://localhost:4173', out = 'qa/lighthouse', runsArg = '3'] = process.argv.slice(2);
const RUNS = Number(runsArg);
fs.mkdirSync(out, { recursive: true });
const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH || '/opt/pw-browsers/chromium', chromeFlags: ['--headless=new', '--no-sandbox'] });
const summary = [];
for (const page of ['earn', 'about']) for (const form of ['mobile', 'desktop']) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const r = await lighthouse(`${base}/${page}`, { port: chrome.port, output: ['json', 'html'], logLevel: 'error' }, form === 'desktop' ? desktopConfig : undefined);
    runs.push(r);
  }
  runs.sort((a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score);
  const med = runs[Math.floor(runs.length / 2)];
  fs.writeFileSync(`${out}/${page}.${form}.html`, med.report[1]);
  fs.writeFileSync(`${out}/${page}.${form}.json`, med.report[0]);
  const c = med.lhr.categories, a = med.lhr.audits;
  const row = {
    page, form, runs: RUNS,
    performance: Math.round(c.performance.score * 100), accessibility: Math.round(c.accessibility.score * 100),
    bestPractices: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
    FCP: a['first-contentful-paint'].displayValue, LCP: a['largest-contentful-paint'].displayValue, TBT: a['total-blocking-time'].displayValue,
    CLS: a['cumulative-layout-shift'].displayValue, SI: a['speed-index'].displayValue, bytes: a['total-byte-weight'].displayValue,
    allPerf: runs.map((r) => Math.round(r.lhr.categories.performance.score * 100)),
    failing: Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && ['numeric', 'binary', 'metricSavings'].includes(x.scoreDisplayMode)).map((x) => x.id),
  };
  summary.push(row);
  console.log(JSON.stringify(row));
}
fs.writeFileSync(`${out}/summary.json`, JSON.stringify(summary, null, 1));
await chrome.kill();
