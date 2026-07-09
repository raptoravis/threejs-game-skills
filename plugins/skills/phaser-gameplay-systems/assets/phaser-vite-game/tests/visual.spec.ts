import { test, expect } from '@playwright/test';

test('canvas is nonblank', async ({ page }) => {
  await page.goto('http://127.0.0.1:5288');
  await page.waitForSelector('canvas', { timeout: 10000 });
  // Wait for first render
  await page.waitForTimeout(1500);

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);

  const screenshot = await page.screenshot();
  expect(screenshot.length).toBeGreaterThan(1024);
});

test('game renders HUD elements', async ({ page }) => {
  await page.goto('http://127.0.0.1:5288');
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(1500);

  const scoreEl = page.locator('#hud-score');
  await expect(scoreEl).toBeVisible();
  const targetEl = page.locator('#hud-target');
  await expect(targetEl).toBeVisible();
});

test('mobile viewport renders', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://127.0.0.1:5288');
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(1500);

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
});
