---
name: babylon-debug-profiler
description: "Debug and profile Babylon.js browser games. Combines scene debugging, render/runtime/loading/animation/resize/mobile input fixes, performance profiling, draw calls, meshes, materials, textures, memory, shader/post-processing cost, bundle size, and mobile DPR/input issues. Use for blank canvas, runtime errors, asset loading failures, physics bugs, mobile input problems, or performance optimization in Babylon.js games."
---

# Babylon.js Debug Profiler

## Purpose

Find root causes and optimize measured bottlenecks without breaking playability.

## Debug Workflow

Load `references/debug-profile-checklists.md` as the first action when debugging render/runtime/mobile issues, asset loading, audio loading/playback, animation, resize, input, blank canvas, physics/collision bugs, or profiling performance. Track it in a reference ledger with yes/no, path, and failure reason. Do not mark the debug/profile phase complete while this reference is skipped for debug or profiling work.

Load `references/checklists/scene-debugging.md` for render/runtime bug diagnosis, `references/checklists/performance-profile.md` for profiling work, and `references/checklists/mobile-input.md` for mobile render/input issues. Load `references/prompt-templates.md` only when the user asks for reusable debug/profile prompts or a task template.

1. Reproduce locally.
2. Read console/page/network errors.
3. Check canvas display size and engine rendering resolution.
4. Check Engine/Scene ownership and runRenderLoop lifecycle.
5. Check camera type (ArcRotateCamera, UniversalCamera), target, alpha/beta/radius or position, near/far, lights, materials, scene contents, transforms.
6. Check asset paths/SceneLoader/CORS/base path.
7. Check animation delta units, physics/update order, fixed timestep, collider/body ownership (Havok/Cannon.js), input listeners, pointer/touch behavior, resize, and audio engine unlock/decode errors when audio is involved.
8. Fix root cause in owning module.
9. Verify browser screenshot, nonblank canvas, console/page errors, and broken path.

## Performance Workflow

1. Reproduce in correct build mode.
2. Record baseline: FPS/frame time, draw calls, active meshes, materials, textures, memory, bundle.
3. Identify CPU/GPU/memory/network bottleneck.
4. Optimize one thing at a time: instancing, shared resources, frustum culling, LOD, DPR cap, cheaper shadows/post, texture discipline, mesh merging.
5. Re-measure same scenario and verify visuals/playability.

## Babylon.js-Specific Diagnostics

### Inspector

Toggle the Babylon.js Inspector for runtime scene debugging:

```ts
scene.debugLayer.show({ embedMode: true });
```

Or pass `?babylonDebug=true` in the URL if the scaffold enables it.

### Diagnostic Object

When possible, expose a diagnostic object on `window`:

```ts
window.__BABYLON_GAME_DIAGNOSTICS__ = {
  engine: engine.getInfo(),  // webglVersion, vendor, renderer
  get scene() {
    return {
      activeMeshes: scene.meshes.length,
      materials: scene.materials?.length ?? 0,
      textures: scene.textures?.length ?? 0,
      lights: scene.lights?.length ?? 0,
      cameras: scene.cameras?.length ?? 0,
      drawCalls: engine.drawCalls?.current ?? null,
      fps: engine.getFps(),
    };
  },
  get state() {
    return game.getDebugState();
  },
};
```

For physics-heavy games (Havok), add:

```ts
physics: {
  engine: 'havok',
  timestep: 1 / 60,
  bodies: havokPlugin?.physicsBodies?.length ?? 0,
}
```

### Babylon.js-Specific Performance Notes

- Use `Mesh.INSTANCING` or `SPS` (Solid Particle System) for repeated detail.
- Use `scene.freezeActiveMeshes()` for static geometry.
- Use `mesh.material?.freeze()` for static materials.
- Use `scene.skipFrustumClipping` carefully — default frustum culling is free.
- Use `HardwareScalingLevel` to cap rendering resolution (`engine.setHardwareScalingLevel(0.5)`).
- Babylon.js 7+ exposes `engine.drawCalls` and `engine._drawCalls.current` per-frame.
- Use `mesh.simplify()` for automatic LOD generation.
- Use `ShadowGenerator.useBlurExponentialShadowMap = true` for cheaper soft shadows.
- Merge static meshes with `Mesh.MergeMeshes()`.
- Dispose unused textures, materials, and meshes to reclaim GPU memory.
- Avoid `scene.registerBeforeRender()` leaks; use `observable.removeCallback()`.

## Final Response

Lead with root cause or bottleneck. Report the reference ledger, checklist items used, files changed, baseline/post metrics, commands, screenshots/artifacts, broken paths retested, and residual risks.
