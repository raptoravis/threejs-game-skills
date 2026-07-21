# Visual Test Harness Checklist

Use this when the game warrants screenshot baselines or visual regression testing.

## When To Add A Harness

- Premium/AAA/showcase graphical claims.
- Release-ready UI work (HUD, menus, overlays).
- Generated 3D/image asset integration.
- Repeated visual regression risk from refactors or asset updates.

## Harness Setup

- [ ] Deterministic hooks exposed via `window.__BABYLON_GAME_TEST_HOOKS__`:
  - `setState(name)` — force a specific game state.
  - `seed(n)` — set random seed for reproducible layouts.
  - `disableParticles()` / `disablePostProcessing()` — isolate visuals.
- [ ] Visual baselines captured for each state (desktop + mobile when relevant).
- [ ] Baselines stored in `tests/baselines/` (git-tracked for small projects, CI-stored for large).
- [ ] Compare command documented: `npx playwright test tests/visual.spec.ts --update-snapshots`.

## States To Cover

Minimum meaningful states:
- [ ] Active desktop play (gameplay visible, HUD on).
- [ ] Active mobile play (when mobile is in scope).
- [ ] Pause menu.
- [ ] Fail/retry screen.
- [ ] Win/complete screen.
- [ ] Any state with generated 3D assets visible.
- [ ] Any state with UI-heavy layout.

## Playwright Config

- [ ] Screenshot comparisons use deliberate thresholds (not pixel-perfect).
- [ ] `maxDiffPixels` or `threshold` set based on determinism expectations.
- [ ] Anti-aliasing differences across GPUs accounted for in thresholds.
- [ ] Masks applied for timers, scores, or non-deterministic elements.
- [ ] Flake risks documented (particles, dynamic lighting, animation frames).

## Skip Reasons

Record the skip decision with one of:
- Game is too early in development.
- Scene is not deterministic enough (live physics, procedural generation, time-dependent effects).
- Coverage by canvas-pixel smoke checks and interaction tests is sufficient.
- User declined visual test harness.
