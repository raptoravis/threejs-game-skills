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
