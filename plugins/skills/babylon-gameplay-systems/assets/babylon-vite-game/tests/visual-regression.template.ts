import { test, expect } from '@playwright/test';

// Template for visual regression testing.
// Copy to tests/visual.spec.ts and customize.

test.describe('visual regression', () => {
  test('active-play screenshot matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas', { state: 'visible', timeout: 10_000 });

    // Set deterministic state
    await page.evaluate(() => {
      const hooks = window.__BABYLON_GAME_TEST_HOOKS__;
      hooks?.seed?.(1);
      hooks?.setState?.('active-play');
      hooks?.setPausedForScreenshot?.(true);
      hooks?.setReducedMotion?.(true);
    });

    await page.waitForTimeout(500);
    const screenshot = await page.screenshot({ fullPage: true });
    expect(screenshot).toMatchSnapshot('active-play-desktop.png', {
      maxDiffPixelRatio: 0.02,
    });
  });
});
