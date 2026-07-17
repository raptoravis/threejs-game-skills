#!/usr/bin/env node

/**
 * Phaser Canvas Inspector
 *
 * Opens a URL in Playwright, locates the first <canvas> (the Phaser game
 * canvas), captures a screenshot, verifies it contains non-blank pixels,
 * and computes objective pixel metrics that the 2D visual scorecard can
 * cite as "Measured Evidence".
 *
 * The pixel metrics (colorEntropyBits, edgeDensity, luminance percentiles,
 * dominantColorShare, ...) are pure PNG pixel analysis on a coarse luminance
 * grid. They are engine-agnostic and intentionally identical to the Three.js
 * inspector's metrics so 2D and 3D scores are directly comparable.
 *
 * Usage:
 *   node inspect-phaser-canvas.mjs [--url URL] [--out DIR] [--mobile] [--wait MS]
 *
 * Exit code is nonzero when the canvas is blank/low-variance or when the page
 * reports console/page errors.
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';

function parseArgs(argv) {
  const args = {
    url: 'http://127.0.0.1:5288',
    out: 'artifacts/canvas-inspection',
    mobile: false,
    wait: 1500,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--url') args.url = argv[++i];
    else if (value === '--out') args.out = argv[++i];
    else if (value === '--mobile') args.mobile = true;
    else if (value === '--wait') args.wait = Number(argv[++i]);
    else if (value === '-h' || value === '--help') {
      console.log(
        'Usage: inspect-phaser-canvas.mjs [--url URL] [--out DIR] [--mobile] [--wait MS]\n' +
          '  --out is a directory; both a PNG screenshot and a JSON metrics report are written there.',
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }

  return args;
}

const round = (value, digits) => Number(value.toFixed(digits));

// Objective pixel statistics used as "Measured Evidence" in the 2D visual
// scorecard. Computed on a coarse luminance grid so cost stays trivial.
// NOTE: this function is intentionally identical to the Three.js inspector's
// computePixelMetrics so 2D and 3D scores remain directly comparable. It only
// depends on the decoded PNG (engine-agnostic).
function computePixelMetrics(png) {
  const stepX = Math.max(1, Math.floor(png.width / 160));
  const stepY = Math.max(1, Math.floor(png.height / 90));
  const cols = Math.floor(png.width / stepX);
  const rows = Math.floor(png.height / stepY);
  const luminance = new Float64Array(cols * rows);
  const bucketCounts = new Map();
  let samples = 0;

  for (let gy = 0; gy < rows; gy += 1) {
    for (let gx = 0; gx < cols; gx += 1) {
      const offset = ((gy * stepY) * png.width + gx * stepX) * 4;
      const r = png.data[offset];
      const g = png.data[offset + 1];
      const b = png.data[offset + 2];
      luminance[gy * cols + gx] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const key = `${r >> 4},${g >> 4},${b >> 4}`;
      bucketCounts.set(key, (bucketCounts.get(key) ?? 0) + 1);
      samples += 1;
    }
  }

  const sorted = Array.from(luminance).sort((a, b) => a - b);
  const mean = sorted.reduce((sum, v) => sum + v, 0) / sorted.length;
  const p5 = sorted[Math.floor(sorted.length * 0.05)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];

  let entropy = 0;
  let dominant = 0;
  for (const count of bucketCounts.values()) {
    const p = count / samples;
    entropy -= p * Math.log2(p);
    dominant = Math.max(dominant, count);
  }

  let edges = 0;
  let checked = 0;
  for (let gy = 0; gy < rows - 1; gy += 1) {
    for (let gx = 0; gx < cols - 1; gx += 1) {
      const i = gy * cols + gx;
      const dx = Math.abs(luminance[i] - luminance[i + 1]);
      const dy = Math.abs(luminance[i] - luminance[i + cols]);
      if (Math.max(dx, dy) > 12) edges += 1;
      checked += 1;
    }
  }

  return {
    colorBuckets: bucketCounts.size,
    colorEntropyBits: round(entropy, 2),
    edgeDensity: round(edges / checked, 3),
    luminance: {
      mean: round(mean, 1),
      p5: round(p5, 1),
      p95: round(p95, 1),
      contrast: round(p95 - p5, 1),
    },
    dominantColorShare: round(dominant / samples, 3),
    nonBackgroundShare: round(1 - dominant / samples, 3),
  };
}

// Playwright's default headless is chromium_headless_shell, which ships no GPU
// backend and silently falls back to SwiftShader (CPU). Every frame-time and FPS
// number measured that way is software-rendered fiction. channel:'chromium' runs
// the full Chromium build in new headless mode against the real GPU.
async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'chromium' });
  } catch {
    console.error(
      'warning: channel:"chromium" is unavailable, falling back to the bundled headless shell.\n' +
        '  Rendering will be software (SwiftShader) and any FPS/frame-time evidence is invalid.\n' +
        '  Fix with: npx playwright install chromium',
    );
    return chromium.launch();
  }
}

// Records which GPU actually rasterized the run, so a software fallback can never
// masquerade as performance evidence again. Phaser's WebGL renderer is detected
// via the game canvas's own context; a Canvas2D-fallback game returns null (no
// GPU block), which is harmless — there is no WebGL FPS to misreport.
async function readGpuInfo(page) {
  const info = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    let gl = null;
    try {
      gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    } catch {
      gl = null;
    }
    if (!gl) return null;
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      vendor: debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
    };
  });

  if (!info?.renderer) {
    return { renderer: null, vendor: null, softwareRendered: null };
  }

  return {
    ...info,
    softwareRendered: /swiftshader|llvmpipe|software|basic render/i.test(info.renderer),
  };
}

async function sampleCanvas(page) {
  const locator = page.locator('canvas').first();
  const rect = await locator.boundingBox();
  if (!rect || rect.width < 32 || rect.height < 32) {
    return { ok: false, reason: 'canvas-too-small', rect };
  }

  const buffer = await locator.screenshot();
  const png = PNG.sync.read(buffer);
  let min = 255;
  let max = 0;
  let alphaPixels = 0;
  const colors = new Set();
  const stride = Math.max(1, Math.floor((png.width * png.height) / 4096));

  for (let pixel = 0; pixel < png.width * png.height; pixel += stride) {
    const offset = pixel * 4;
    const r = png.data[offset];
    const g = png.data[offset + 1];
    const b = png.data[offset + 2];
    const a = png.data[offset + 3];
    min = Math.min(min, r, g, b);
    max = Math.max(max, r, g, b);
    if (a > 0) alphaPixels += 1;
    colors.add(`${r >> 4},${g >> 4},${b >> 4},${a >> 6}`);
  }

  const variance = max - min;
  // Generic, engine-agnostic canvas size diagnostics. Phaser games may
  // optionally expose window.__PHASER_GAME_DIAGNOSTICS__ (body/sprite/texture
  // counts, etc.); it is not required and is surfaced only when present.
  const diagnostics = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      drawingBuffer: canvas
        ? { width: canvas.width, height: canvas.height }
        : null,
      game: window.__PHASER_GAME_DIAGNOSTICS__ ?? null,
    };
  });

  const ok = alphaPixels > 256 && (variance > 8 || colors.size > 3);
  return {
    ok,
    reason: ok ? 'nonblank' : 'low-variance',
    rect,
    drawingBuffer: diagnostics.drawingBuffer,
    alphaPixels,
    variance,
    colorBuckets: colors.size,
    metrics: computePixelMetrics(png),
    // 2D Phaser games have no renderer draw-call/triangle budget concept, so
    // renderBudget is intentionally omitted (no THREE/renderer coupling).
    diagnostics: diagnostics.game,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await mkdir(args.out, { recursive: true });

  const browser = await launchBrowser();
  const context = await browser.newContext(
    args.mobile
      ? { viewport: { width: 375, height: 667 } }
      : { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 },
  );
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  await page.waitForSelector('canvas', { state: 'visible', timeout: 10_000 });

  await page.waitForTimeout(args.wait);

  const mode = args.mobile ? 'mobile' : 'desktop';
  const gpu = await readGpuInfo(page);
  const result = await sampleCanvas(page);
  const screenshotPath = path.join(args.out, `${mode}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  if (gpu.softwareRendered) {
    console.error(
      `warning: this run rasterized on ${gpu.renderer} (software). Pixel checks ` +
        'remain valid; any FPS or frame-time reading from it does not.',
    );
  }

  const report = {
    url: args.url,
    mode,
    screenshotPath,
    gpu,
    result,
    consoleErrors,
    pageErrors,
  };

  await writeFile(
    path.join(args.out, `${mode}.json`),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await browser.close();

  console.log(JSON.stringify(report, null, 2));

  if (!result.ok || consoleErrors.length > 0 || pageErrors.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
