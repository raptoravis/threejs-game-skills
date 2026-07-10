---
name: phaser-debug-profiler
description: "Debug and profile Phaser 2D browser games. Combines scene debugging, render/runtime/loading/animation/resize/mobile input fixes, performance profiling, sprite counts, physics body counts, texture memory, draw calls, particle system cost, bundle size, and mobile DPR/input issues."
---

# Phaser Debug Profiler

## Purpose

Find root causes and optimize measured bottlenecks without breaking playability.

## Debug Workflow

Load `references/debug-profile-checklists.md` as the first action when debugging render/runtime/mobile issues, asset loading, audio loading/playback, animation, resize, input, blank canvas, physics/collision bugs, scene lifecycle bugs, or profiling performance. Track it in a reference ledger with yes/no, path, and failure reason. Do not mark the debug/profile phase complete while this reference is skipped for debug or profiling work.

Load `references/prompt-templates.md` only when the user asks for reusable debug/profile prompts or a task template.

1. Reproduce locally. Capture console errors, screenshots, and diagnostic data.
2. Read console/page/network errors.
3. Check canvas display size and drawing-buffer size, Phaser game config (`type`, `parent`, `scale` mode).
4. Check scene lifecycle order (Boot → Preload → Menu → Game → UI), preload completeness, and `this.scene.start` calls.
5. Check physics world setup (Matter.js enabled vs Arcade), body/sensor/static flags, collision handlers, and cleanup on shutdown.
6. Check input (`input.activePointers`, pointer/touch behavior), camera (bounds, follow, zoom, lerp), and audio context unlock/decode errors when audio is involved.
7. Check asset paths/texture atlas loading/CORS/base path, animation delta units, update order, and resize behavior.
8. Fix root cause in the owning scene/system with minimal change. Do not refactor working code as part of a debug pass.
9. Verify browser screenshot, nonblank canvas, console/page errors, and the broken path retested.

## Performance Workflow

1. Reproduce in the correct build mode (production preview where possible).
2. Record baseline: FPS/frame time (`game.loop.actualFps`), sprite count, physics body count, scene object count, draw calls, texture memory, bundle.
3. Identify CPU/GPU/memory bottleneck.
4. Optimize one thing at a time: object pooling, texture atlases, shared resources, tilemap culling, fewer/cheaper particle emitters, adaptive scale/DPR, explicit destruction.
5. Re-measure the same scenario and verify visuals/playability.

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
- Too many unique textures (use a texture atlas).
- Creating objects in `update()` (use object pools).
- No camera culling on tilemaps (enable culling).
- Frame-based movement instead of delta-based.
- Physics debug rendering left on in production.
- Too many active particle emitters or oversized particle textures.

### Mobile Issues
- Canvas not scaling (check ScaleManager `FIT` mode and `AUTO_CENTER`).
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

Lead with root cause or bottleneck. Report the reference ledger, checklist items used, files changed, baseline/post metrics, commands, screenshots/artifacts, broken paths retested, and residual risks.
