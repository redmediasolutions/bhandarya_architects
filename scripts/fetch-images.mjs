/**
 * Downloads all site images from the live WordPress site into public/uploads/
 * so the Astro site is fully self-contained.
 * Runs automatically after `npm install`, or manually: `npm run fetch-images`
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://bhandaryarchitects.com/wp-content/uploads/';
const OUT = join(ROOT, 'public', 'uploads');

const FILES = [
  // Branding
  '2026/03/Link.svg',
  // Homepage — hero slideshow
  '2026/05/1.webp', '2026/05/2.webp', '2026/05/3.webp',
  // Homepage — journey slider
  '2026/05/4.webp', '2026/05/5.webp', '2026/05/7.webp', '2026/05/8.webp',
  '2026/05/9.webp', '2026/05/10.webp', '2026/05/11.webp',
  // Homepage — featured project cards
  '2026/05/Copy-of-02.webp', '2026/05/Copy-of-04.png', '2026/05/Container-2.jpg',
  // Projects page
  '2026/03/Screenshot-2026-03-25-154852.png',
  '2026/05/Copy-of-01.webp', '2026/05/Copy-of-01.png',
  // About page
  '2026/03/Screenshot-2026-03-25-153944.png',
  '2026/03/photo-1506794778202-cad84cf45f1d.avif',
  // Samudra — completed gallery
  '2026/05/Copy-of-11-1024x683.webp', '2026/05/Copy-of-10-1024x683.webp',
  '2026/05/Copy-of-08-1024x683.webp', '2026/05/Copy-of-07-1024x682.webp',
  '2026/05/Copy-of-05-1024x683.webp', '2026/05/Copy-of-06-1024x683.webp',
  '2026/05/Copy-of-09-1024x683.webp', '2026/05/Copy-of-04-1024x683.webp',
  '2026/05/Copy-of-03-1024x683.webp', '2026/05/Copy-of-02-1024x683.webp',
  '2026/05/Copy-of-01-1024x576.webp',
  // Samudra — construction stage
  '2026/05/01-scaled.webp', '2026/05/02.webp', '2026/05/03-scaled.webp',
  '2026/05/04-scaled.webp', '2026/05/05-scaled.webp', '2026/05/06-scaled.webp',
  '2026/05/07-scaled.webp', '2026/05/08-scaled.webp', '2026/05/09-scaled.webp',
  '2026/05/10-1-scaled.webp', '2026/05/11-1.webp', '2026/05/12-scaled.webp',
  '2026/05/13-scaled.webp',
  // Kutira — hero + gallery
  '2026/05/Copy-of-01-1.webp',
  '2026/05/Copy-of-01-1-1024x683.webp', '2026/05/Copy-of-02-1-1024x682.webp',
  '2026/05/Copy-of-03-1-1024x682.webp', '2026/05/Copy-of-04-1-683x1024.webp',
  '2026/05/Copy-of-05-1.webp', '2026/05/Copy-of-06-1-683x1024.webp',
  '2026/05/Copy-of-07-1-1024x683.webp', '2026/05/Copy-of-08-1-1024x683.webp',
  '2026/05/Copy-of-09-1-1024x683.webp', '2026/05/Copy-of-10-1-1024x683.webp',
  '2026/05/Copy-of-11-1-1024x768.webp', '2026/05/Copy-of-12-1024x683.webp',
  '2026/05/Copy-of-13-683x1024.webp', '2026/05/Copy-of-14-1024x683.webp',
  '2026/05/Copy-of-15-683x1024.webp', '2026/05/Copy-of-16-1024x683.webp',
  '2026/05/Copy-of-17-1024x683.webp', '2026/05/Copy-of-18-1024x683.webp',
  '2026/05/Copy-of-19-683x1024.webp', '2026/05/Copy-of-20-1024x683.webp',
  '2026/05/Copy-of-21-1024x683.webp',
  // Kutira — slider
  '2026/05/18-1-scaled.webp', '2026/05/20-1-scaled.webp',
];

let ok = 0, skipped = 0, failed = 0;

for (const file of FILES) {
  const dest = join(OUT, file);
  try {
    await access(dest);
    skipped++;
    continue;
  } catch { /* not downloaded yet */ }
  try {
    const res = await fetch(BASE + file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    ok++;
    console.log(`downloaded ${file}`);
  } catch (err) {
    failed++;
    console.warn(`FAILED ${file} — ${err.message}`);
  }
}

console.log(`\nImages: ${ok} downloaded, ${skipped} already present, ${failed} failed.`);
if (failed > 0) {
  console.warn('Some images failed to download. Re-run with: npm run fetch-images');
}
