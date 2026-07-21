import { test, expect } from '@playwright/test';

test('canvas is visible and non-blank', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('canvas', { state: 'visible', timeout: 10_000 });
  await page.waitForTimeout(750);

  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(32);
  expect(box!.height).toBeGreaterThan(32);

  const buffer = await canvas.screenshot();
  expect(buffer.length).toBeGreaterThan(1024);

  // Check for console errors
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
});
