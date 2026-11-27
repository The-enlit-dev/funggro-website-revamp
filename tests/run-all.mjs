// Runs the QA suite against BASE_URL (default: the evaluation deploy). Usage: BASE_URL=<url> npm test
import { execSync } from 'node:child_process';
const base = process.env.BASE_URL || 'https://funngro-revamp-evaluation.netlify.app';
const env = { ...process.env, NODE_PATH: execSync('npm root -g').toString().trim(), NODE_USE_ENV_PROXY: '1' };
const steps = [
  `node tests/screens.cjs ${base} qa/screens 320 360 390 768 1024 1280 1440`,
  `node tests/a11y.cjs ${base} qa/a11y`,
  `node tests/interactions.cjs ${base}`,
  `node tests/rupee.cjs ${base}`,
  `node tests/keyboard.cjs ${base}`,
  `node tests/functional.cjs ${base}`,
  `node tests/delivery.mjs ${base}`,
  `node tests/seo-links.cjs ${base} ${base.includes('netlify.app') || base.includes('localhost') ? '--expect-noindex' : ''}`,
];
let failed = 0;
for (const s of steps) {
  console.log(`\n$ ${s}`);
  try { execSync(s, { stdio: 'inherit', env }); } catch { failed++; }
}
console.log(failed ? `\n${failed} step(s) failed` : '\nall steps passed');
process.exit(failed ? 1 : 0);
