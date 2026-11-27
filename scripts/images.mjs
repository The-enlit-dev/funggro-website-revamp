// One-off image preparation: run `npm run images` locally; outputs are committed to src/images.
// Sources are official Funngro assets archived in assets/source (see research/06-verified-facts.md).
import sharp from 'sharp';
import QRCode from 'qrcode';
import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets/source';
const OUT = 'src/images';
const manifest = {};

async function variants(input, name, { widths, aspect, formats = ['avif', 'webp', 'jpg'], position = 'attention', modulate, fit = 'cover', background } = {}) {
  await fs.mkdir(OUT, { recursive: true });
  const meta = await sharp(input).metadata();
  const entry = { widths: [], formats, aspect: aspect ?? meta.width / meta.height };
  for (const w of widths) {
    if (w > meta.width * 1.05 && w !== widths[0]) continue; // never upscale beyond the smallest size
    const h = aspect ? Math.round(w / aspect) : Math.round(w * meta.height / meta.width);
    let img = sharp(input).rotate().resize(w, h, { fit, position, background });
    if (modulate) img = img.modulate(modulate);
    for (const f of formats) {
      const file = `${OUT}/${name}-${w}.${f}`;
      const o = f === 'avif' ? { quality: 46, effort: 6 } : f === 'webp' ? { quality: 74 } : { quality: 78, mozjpeg: true };
      await img.clone().toFormat(f === 'jpg' ? 'jpeg' : f, o).toFile(file);
    }
    entry.widths.push(w);
    entry.height = entry.height ?? {};
    entry.height[w] = h;
  }
  manifest[name] = entry;
  console.log(name, entry.widths.join(','));
}

const earners = {
  'anshika': 'anshika-pAAPWHhq.jpg', 'ashwani': 'ashwani-SiRn6cf8.jpg', 'sayyam-mehta': 'sayyam-mehta-AeEdVr_7.jpg',
  'yashraj-singh': 'yashraj-singh-B3L6hm7T.jpg', 'ankush-borana': 'ankush-borana-etwVzPar.jpg', 'sayandeep': 'sayandeep-CCDeXwxb.jpg',
  'sarthak': 'sarthak-JEn2W_Kg.jpg', 'ujjwal-dubey': 'ujjwal-dubey-CJkNhre1.jpg', 'swarnim-prateek': 'swarnim-prateek-DTj-8Wo4.jpg',
};
for (const [n, f] of Object.entries(earners)) {
  // gentle, consistent warm grade so mismatched amateur photos sit together
  await variants(`${SRC}/earners/${f}`, `earner-${n}`, { widths: [200, 320, 480, 720], aspect: 4 / 5, modulate: { saturation: 0.92, brightness: 1.02 } });
}
const screens = { home: 'screen-home-DvfQ0qPp.webp', reward: 'screen-reward-xa-KPYrd.webp', wallet: 'screen-wallet-CJr6gtJh.webp', journey: 'screen-journey-BJkQ-t9o.webp', tier: 'screen-tier-DYEG0bT7.webp' };
for (const [n, f] of Object.entries(screens)) {
  // journey/tier sources are wider than a phone screen: letterbox on their own background instead of cropping the sides
  const wide = { journey: { r: 2, g: 19, b: 9 }, tier: { r: 2, g: 24, b: 12 } }[n];
  await variants(`${SRC}/app-screens/${f}`, `screen-${n}`, { widths: [360, 540, 720], aspect: wide ? 600 / 1075 : undefined, formats: ['avif', 'webp'], position: wide ? 'centre' : 'top', fit: wide ? 'contain' : 'cover', background: wide });
}
await variants(`${SRC}/press/sharktank-thumb.jpg`, 'sharktank', { widths: [640, 960, 1280], aspect: 16 / 9, position: 'centre' });

// Official store badges (Google: trimmed PNG; Apple: official SVG kept as-is)
await sharp(`${OUT}/badges/google-play-badge.png`).extract({ left: 41, top: 41, width: 564, height: 168 }).toFile(`${OUT}/badges/google-play.png`);
// 2× the 52px display height
await sharp(`${OUT}/badges/google-play.png`).resize({ height: 104 }).webp({ quality: 90 }).toFile(`${OUT}/badges/google-play.webp`);

// QR → Google Play listing (canonical download link is a client requirement; Play chosen as most Indian users are on Android)
const PLAY = 'https://play.google.com/store/apps/details?id=com.wishbanc.funngro';
const svg = await QRCode.toString(PLAY, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#0E1A12', light: '#0000' } });
await fs.writeFile(`${OUT}/qr-google-play.svg`, svg);

await fs.writeFile(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1));
console.log('done');
