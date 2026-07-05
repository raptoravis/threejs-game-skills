/**
 * Convert technical-analysis-report.html → PDF using Playwright (Chromium).
 * Run: node scripts/html_to_pdf.mjs
 */
import { chromium } from 'playwright';
import { readFileSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const htmlPath = resolve(root, 'technical-analysis-report.html');
const pdfPath = resolve(root, 'technical-analysis-report.pdf');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });

await page.pdf({
  path: pdfPath,
  format: 'A4',
  margin: { top: '20mm', bottom: '20mm', left: '22mm', right: '22mm' },
  printBackground: true,
});

await browser.close();

const size = statSync(pdfPath).size;
console.log(`PDF saved: ${pdfPath} (${size.toLocaleString()} bytes)`);
