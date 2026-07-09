# Debug & Profile Checklists (Phaser 2D)

Use this reference for debugging and profiling Phaser 2D games.

## Scene Debugging

When the game shows blank screen, crashes, or behaves incorrectly:

- [ ] Check browser console for JavaScript errors.
- [ ] Verify Phaser game config: `type`, `parent`, `width`, `height`, `physics`.
- [ ] Verify scene keys match between `scene.start()`, `scene.launch()`, and config scene array.
- [ ] Verify `preload()` loads all required assets before `create()`.
- [ ] Verify `create()` initializes all game objects and systems.
- [ ] Check `update()` runs: add `console.log` or increment visible counter.
- [ ] Check scene lifecycle: `init()` resets state, `shutdown()` cleans up listeners/bodies.
- [ ] Check cross-scene data via `registry` or `game.events`.
- [ ] Verify canvas element exists in DOM and is visible (`display: none` or `visibility: hidden` kills rendering).
- [ ] Check if another scene is covering the game (UI scene with opaque background).

## Physics Debugging

- [ ] Enable Matter.js debug rendering: `matter: { debug: true }` in physics config.
- [ ] Verify body shapes match sprite positions.
- [ ] Check body labels for collision filtering.
- [ ] Check `isStatic`, `isSensor` flags on each body.
- [ ] Verify collision handlers fire: add `console.log` in `collisionstart` event.
- [ ] Count bodies before and after scene restart (should be equal or lower).
- [ ] Check gravity direction and magnitude.
- [ ] Verify `frictionAir`, `friction`, `restitution` values are intentional.

## Performance Profiling

- [ ] Record baseline FPS (`game.loop.actualFps`) at idle and peak gameplay.
- [ ] Count active game objects per scene.
- [ ] Count physics bodies (`matter.world.getAllBodies().length`).
- [ ] Count concurrent particle emitters and particles.
- [ ] Check texture memory: unique textures loaded, total texture size.
- [ ] Verify object pooling for frequently created/destroyed objects.
- [ ] Verify tilemap culling is active.
- [ ] Check update() for per-frame allocations (avoid `new` in hot path).
- [ ] Use Chrome DevTools Performance tab to identify long frames.
- [ ] Target: 60fps stable at peak gameplay, <100 physics bodies, <500 sprites.

## Mobile Debugging

- [ ] Test on real mobile device or Chrome DevTools device emulation.
- [ ] Verify viewport meta tag in index.html.
- [ ] Check ScaleManager mode (FIT, RESIZE, etc.).
- [ ] Verify touch input: test tap, swipe, multi-touch.
- [ ] Check touch target sizes (minimum 44x44 logical pixels).
- [ ] Verify no content hidden behind mobile browser chrome.
- [ ] Test portrait and landscape orientations.
- [ ] Check FPS on lower-end mobile (use CPU throttling in DevTools).
