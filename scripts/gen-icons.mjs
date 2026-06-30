// Generates brand PWA icons (PNG) with a pure-JS encoder — no native deps.
// Design: brand-purple background + white ascending bar-chart motif.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  // scanlines with filter byte 0
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const BRAND = [124, 92, 255]; // #7c5cff
const WHITE = [255, 255, 255];

function makeIcon(size, { maskable = false } = {}) {
  const px = Buffer.alloc(size * size * 4);
  const set = (x, y, [r, g, b], a = 255) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    const i = (y * size + x) * 4;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
    px[i + 3] = a;
  };
  // background
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) set(x, y, BRAND);

  // ascending bar chart inside a safe content box
  const pad = Math.round(size * (maskable ? 0.26 : 0.2));
  const box = size - pad * 2;
  const bars = 3;
  const gap = Math.round(box * 0.1);
  const barW = Math.round((box - gap * (bars - 1)) / bars);
  const heights = [0.45, 0.7, 1.0];
  for (let b = 0; b < bars; b++) {
    const bw = barW;
    const bh = Math.round(box * heights[b]);
    const x0 = pad + b * (barW + gap);
    const y0 = pad + (box - bh);
    for (let y = y0; y < pad + box; y++) for (let x = x0; x < x0 + bw; x++) set(x, y, WHITE);
  }
  return encodePng(size, size, px);
}

mkdirSync('public', { recursive: true });
writeFileSync('public/pwa-192.png', makeIcon(192));
writeFileSync('public/pwa-512.png', makeIcon(512));
writeFileSync('public/maskable-512.png', makeIcon(512, { maskable: true }));
writeFileSync('public/apple-touch-icon.png', makeIcon(180, { maskable: true }));
writeFileSync('public/favicon-48.png', makeIcon(48));
console.log('icons written to public/');
