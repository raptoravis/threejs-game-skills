# QA & Release Checklists (Phaser 2D)

Use this reference for QA verification and release readiness of Phaser 2D games.

## Visual Verification

- [ ] Game loads in browser with no JavaScript errors in console.
- [ ] Canvas is visible and sized correctly.
- [ ] First screen is playable game or menu, not blank or loading forever.
- [ ] All scenes render correctly: Boot, Preload, Menu, Game, UI.
- [ ] Scene transitions are smooth (no flicker, no dead frames, no stuck loading).
- [ ] Sprites render at correct positions and scales.
- [ ] Text is readable at all supported resolutions.
- [ ] UI elements do not overlap or clip.
- [ ] Colors and contrast are acceptable on both desktop and mobile screens.

## Headless WebGL Caveats

Phaser renders on WebGL by default (with a Canvas2D fallback). When a Phaser
game runs on WebGL, the headless-rendering rules below apply; a Canvas2D-fallback
build has no WebGL FPS to misreport, so its `gpu` block is null and these caveats
do not change pixel/functional evidence.

- Always launch Chromium with `channel: 'chromium'` (`inspect-phaser-canvas.mjs` does). Playwright's default headless is `chromium_headless_shell`, which ships no GPU backend and silently falls back to SwiftShader (CPU). This is a launch-config bug, not a headless limitation: the shell renders a WebGL scene several times slower than `channel: 'chromium'`, which runs the full Chromium build against the real GPU — one line of config.
- Verify the GPU before reporting any FPS; never assume it. `inspect-phaser-canvas.mjs` records a `gpu` block (`renderer`, `vendor`, `softwareRendered`) in its JSON report — check it. If `softwareRendered` is true, the run fell back to CPU and its FPS/frame-time numbers are not performance evidence; pixel and functional checks are still valid. Fix the fallback with `npx playwright install chromium` rather than caveating the number.
- Run Playwright suites with `workers: 1` for WebGL Phaser games. Parallel contexts contend for the GPU, and the frame-time collapse makes game time drift from wall time, flaking timed phases and screenshot baselines.
- Headless FPS on a verified real GPU is still not a phone. Treat it as a desktop-GPU signal and validate mobile targets on real hardware.

## Playtest QA

- [ ] Core loop completes: player can achieve the main objective.
- [ ] All input paths work: keyboard, mouse, touch.
- [ ] Player can fail and retry without refreshing the page.
- [ ] Scene restart leaves no stale game objects, physics bodies, timers, or event listeners.
- [ ] Game works at 30fps, 60fps, and 120fps (timing is delta-based).
- [ ] All game states tested: menu, playing, paused, win, lose, game-over.
- [ ] Score/state HUD updates correctly through all transitions.
- [ ] Audio plays when triggered and stops when scene changes.

## Release Checklist

- [ ] `npm run build` passes with no TypeScript or Vite errors.
- [ ] Production build tested via `npm run preview`.
- [ ] Bundle size reviewed: main JS, Phaser bundle, total dist size.
- [ ] `matter.debug: false` in production config.
- [ ] Debug GUI (`lil-gui`) removed or gated behind flag.
- [ ] `window.__PHASER_GAME_DIAGNOSTICS__` gated or removed in production.
- [ ] Physics debug rendering disabled.
- [ ] Console.log/debug statements removed or gated.
- [ ] Source maps enabled for production debugging (or explicitly disabled if size-critical).
- [ ] index.html has proper meta tags (viewport, charset, title).
- [ ] Favicon and PWA manifest present (if progressive web app).
- [ ] Release notes written (version, changes, known issues).

## Responsive & Mobile

- [ ] Game renders correctly at: 1920x1080, 1280x720, 375x667, 414x896.
- [ ] Phaser ScaleManager mode is intentional (FIT for fixed-resolution games).
- [ ] Touch input works: tap, swipe, multi-touch where applicable.
- [ ] Touch targets >= 44x44 logical pixels.
- [ ] No content hidden behind mobile browser chrome (safe areas respected).
- [ ] Portrait and landscape both tested (if supported).
- [ ] No auto-play audio issues on mobile (requires user gesture first).
