---
name: phaser-debug-profiler
description: "Debug and profile Phaser 2D browser games. Combines scene debugging, render/runtime/loading/animation/resize/mobile input fixes, performance profiling, sprite counts, physics body counts, texture memory, and mobile DPR/input issues."
---

# Phaser Debug Profiler

## Purpose

Diagnose and fix issues in Phaser 2D games: blank canvas, broken input, performance regressions, scene lifecycle bugs, physics issues, and mobile problems.

## Workflow

Load `references/debug-profile-checklists.md` as the first action for any debugging or profiling task. Track it in a reference ledger.

Load `references/prompt-templates.md` only when the user asks for reusable prompts.

1. Reproduce the issue. Capture console errors, screenshots, and diagnostic data.
2. Isolate the root cause: Scene lifecycle, physics, input, rendering, assets, or logic.
3. Fix with minimal change. Do not refactor working code as part of a debug pass.
4. Verify fix: issue no longer reproduces, no new regressions.
5. If performance issue: collect baseline metrics → apply fix → collect post metrics.
6. Report: root cause, fix, before/after metrics if performance.

## Common Issues

### Blank Canvas
- Scene not started (forgot `this.scene.start('NextScene')`).
- Missing `parent` in game config (canvas not attached to DOM).
- Phaser game config has `type: Phaser.HEADLESS` (should be `Phaser.AUTO` or `Phaser.CANVAS`).
- JavaScript error before scene `create()` completes.

### Physics Issues
- Matter.js not enabled in config (default is Arcade).
- Physics bodies not destroyed on scene shutdown.
- Collision event handlers accumulating across restarts.
- `isSensor: true` missing on trigger bodies.
- `isStatic: true` missing on wall/ground bodies.

### Performance Issues
- Too many unique textures (use texture atlas).
- Creating objects in `update()` (use object pools).
- No camera culling on tilemaps (enable culling).
- Frame-based movement instead of delta-based.
- Physics debug rendering left on in production.

### Mobile Issues
- Canvas not scaling (check ScaleManager config).
- Touch input not captured (check `input.activePointers`).
- Viewport meta tag missing.
- Touch targets too small (<44x44pt).

## Diagnostics

Expose via `window.__PHASER_GAME_DIAGNOSTICS__`:
- Current scene key
- FPS (from `game.loop.actualFps`)
- Body count (`matter.world.getAllBodies().length`)
- Active game objects in scene
- Input state
- Canvas dimensions

## Final Response

Report root cause, fix applied, before/after metrics (if performance), verified paths, and remaining issues.
