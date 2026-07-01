// Generate the app's PWA icons + favicon PNGs by rasterizing the brand SVGs
// (public/brand/*) with headless Chromium. Single source of truth = the SVG,
// so all sizes stay pixel-consistent with the logo. Run: node scripts/gen-icons.mjs
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const rounded = readFileSync(join(pub, 'brand', 'icon-chart.svg'), 'utf8'); // rounded tile, transparent
const maskable = readFileSync(join(pub, 'brand', 'icon-chart-maskable.svg'), 'utf8'); // full-bleed

// transparent: rounded tile on transparent bg (any-purpose icons + favicon)
// opaque: full-bleed square (maskable + apple-touch, which mask/round themselves)
const TARGETS = [
  { file: 'favicon-48.png', size: 48, svg: rounded, transparent: true },
  { file: 'pwa-192.png', size: 192, svg: rounded, transparent: true },
  { file: 'pwa-512.png', size: 512, svg: rounded, transparent: true },
  { file: 'apple-touch-icon.png', size: 180, svg: maskable, transparent: false },
  { file: 'maskable-512.png', size: 512, svg: maskable, transparent: false },
];

const browser = await chromium.launch();
try {
  for (const t of TARGETS) {
    const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
    const html =
      `<!doctype html><meta charset="utf-8">` +
      `<style>*{margin:0;padding:0}html,body{width:${t.size}px;height:${t.size}px;background:transparent}` +
      `svg{display:block;width:${t.size}px;height:${t.size}px}</style>${t.svg}`;
    await page.setContent(html, { waitUntil: 'networkidle' });
    const buf = await page.screenshot({ omitBackground: t.transparent, type: 'png' });
    writeFileSync(join(pub, t.file), buf);
    await page.close();
    console.log(`✓ ${t.file} (${t.size}×${t.size})`);
  }
} finally {
  await browser.close();
}
