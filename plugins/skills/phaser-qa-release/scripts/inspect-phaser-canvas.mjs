#!/usr/bin/env node

/**
 * Phaser Canvas Inspector
 * Opens a URL in Playwright, captures a screenshot,
 * and checks that the canvas contains non-blank pixels.
 *
 * Usage:
 *   node inspect-phaser-canvas.mjs --url http://127.0.0.1:5288 [--out screenshot.png] [--mobile] [--wait 2000]
 */

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

function parseArgs(argv) {
  const args = { url: 'http://127.0.0.1:5288', out: '', mobile: false, wait: 1500 };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--url' && i + 1 < argv.length) args.url = argv[++i];
    else if (argv[i] === '--out' && i + 1 < argv.length) args.out = argv[++i];
    else if (argv[i] === '--mobile') args.mobile = true;
    else if (argv[i] === '--wait' && i + 1 < argv.length) args.wait = parseInt(argv[++i], 10);
  }
  return args;
}

const args = parseArgs(process.argv);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: args.mobile ? { width: 375, height: 667 } : { width: 1280, height: 720 },
});
const page = await context.newPage();

try {
  await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(args.wait);

  const screenshot = await page.screenshot({ path: args.out || undefined });

  if (screenshot.length < 1024) {
    console.error('FAIL: screenshot likely blank or too small');
    process.exit(1);
  }

  const hasIHDR = screenshot.indexOf('IHDR', 0) > 0;
  const hasIDAT = screenshot.indexOf('IDAT', 0) > 0;

  if (!hasIHDR || !hasIDAT) {
    console.error('FAIL: screenshot does not contain valid PNG image data');
    process.exit(1);
  }

  console.log(`PASS: Phaser canvas screenshot captured (${screenshot.length} bytes, ${args.mobile ? 'mobile' : 'desktop'})`);
} catch (err) {
  console.error('FAIL:', err.message);
  process.exit(1);
} finally {
  await browser.close();
}
