#!/usr/bin/env node
// Babylons.js canvas inspector — mirrors the QA skill's inspect-babylon-canvas.mjs.
// This copy lives in the scaffold so generated games are self-contained.
import { chromium, devices } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';

function parseArgs(argv) {
  const args = { url: 'http://127.0.0.1:5388', out: 'artifacts/canvas-inspection', mobile: false, wait: 750 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--url') args.url = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
    else if (argv[i] === '--mobile') args.mobile = true;
    else if (argv[i] === '--wait') args.wait = Number(argv[++i]);
  }
  return args;
}

const round = (v, d) => Number(v.toFixed(d));

function computeMetrics(png) {
  const stepX = Math.max(1, Math.floor(png.width / 160));
  const stepY = Math.max(1, Math.floor(png.height / 90));
  const cols = Math.floor(png.width / stepX), rows = Math.floor(png.height / stepY);
  const lum = new Float64Array(cols * rows), buckets = new Map();
  let samples = 0;
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const off = ((gy * stepY) * png.width + gx * stepX) * 4;
      const r = png.data[off], g = png.data[off + 1], b = png.data[off + 2];
      lum[gy * cols + gx] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      buckets.set(`${r >> 4},${g >> 4},${b >> 4}`, (buckets.get(`${r >> 4},${g >> 4},${b >> 4}`) ?? 0) + 1);
      samples++;
    }
  }
  const sorted = Array.from(lum).sort((a, b) => a - b);
  const mean = sorted.reduce((s, v) => s + v, 0) / sorted.length;
  const p5 = sorted[Math.floor(sorted.length * 0.05)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  let entropy = 0, dominant = 0;
  for (const c of buckets.values()) { const p = c / samples; entropy -= p * Math.log2(p); dominant = Math.max(dominant, c); }
  let edges = 0, checked = 0;
  for (let gy = 0; gy < rows - 1; gy++) {
    for (let gx = 0; gx < cols - 1; gx++) {
      if (Math.max(Math.abs(lum[gy * cols + gx] - lum[gy * cols + gx + 1]), Math.abs(lum[gy * cols + gx] - lum[(gy + 1) * cols + gx])) > 12) edges++;
      checked++;
    }
  }
  return { colorBuckets: buckets.size, colorEntropyBits: round(entropy, 2), edgeDensity: round(edges / checked, 3), luminance: { mean: round(mean, 1), p5: round(p5, 1), p95: round(p95, 1), contrast: round(p95 - p5, 1) }, dominantColorShare: round(dominant / samples, 3), nonBackgroundShare: round(1 - dominant / samples, 3) };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(args.out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chromium' }).catch(() => chromium.launch());
  const ctx = await browser.newContext(args.mobile ? { ...devices['iPhone 13'] } : { viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  const consoleErr = [], pageErr = [];
  page.on('console', m => { if (m.type() === 'error') consoleErr.push(m.text()); });
  page.on('pageerror', e => pageErr.push(e.message));
  await page.goto(args.url, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { state: 'visible', timeout: 10000 });
  await page.waitForTimeout(args.wait);
  const buf = await page.locator('canvas').first().screenshot();
  const png = PNG.sync.read(buf);
  let min = 255, max = 0, alphaPx = 0;
  const colors = new Set();
  const stride = Math.max(1, Math.floor((png.width * png.height) / 4096));
  for (let px = 0; px < png.width * png.height; px += stride) {
    const off = px * 4;
    min = Math.min(min, png.data[off], png.data[off + 1], png.data[off + 2]);
    max = Math.max(max, png.data[off], png.data[off + 1], png.data[off + 2]);
    if (png.data[off + 3] > 0) alphaPx++;
    colors.add(`${png.data[off] >> 4},${png.data[off + 1] >> 4},${png.data[off + 2] >> 4}`);
  }
  const ok = alphaPx > 256 && (max - min > 8 || colors.size > 3);
  const mode = args.mobile ? 'mobile' : 'desktop';
  const report = { url: args.url, mode, ok, reason: ok ? 'nonblank' : 'low-variance', metrics: computeMetrics(png), consoleErrors: consoleErr, pageErrors: pageErr };
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  if (!ok || consoleErr.length > 0 || pageErr.length > 0) process.exit(1);
}
main().catch(e => { console.error(e); process.exit(1); });
