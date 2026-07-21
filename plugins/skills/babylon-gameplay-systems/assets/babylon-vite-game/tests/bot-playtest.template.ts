import { test } from '@playwright/test';

// Template for automated bot playtesting.
// Copy to tests/bot-playtest.spec.ts and customize.

test('bot playtest — complete a full run', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('canvas', { state: 'visible', timeout: 10_000 });

  const result = await page.evaluate(() => {
    const hooks = window.__BABYLON_GAME_TEST_HOOKS__;
    if (!hooks) return { error: '__BABYLON_GAME_TEST_HOOKS__ not available' };

    hooks.seed?.(42);
    hooks.setState?.('active-play');

    // Drive the game with scripted input
    // Customize this loop for your game
    const steps = 600;
    let score = 0;

    // Access diagnostics after each step
    for (let i = 0; i < steps; i++) {
      // Simulate input (implementation depends on game)
      const diag = window.__BABYLON_GAME_DIAGNOSTICS__;
      if (diag?.complete) break;
      score = diag?.score ?? 0;
    }

    return {
      frames: steps,
      score,
      complete: window.__BABYLON_GAME_DIAGNOSTICS__?.complete ?? false,
    };
  });

  console.log(JSON.stringify(result, null, 2));
});
