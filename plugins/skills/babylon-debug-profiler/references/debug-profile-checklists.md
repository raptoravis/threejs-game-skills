# Babylon.js Debug And Profile Checklists

Use this for blank canvases, bad framing, runtime errors, asset/audio loading issues, animation/collision/input failures, mobile bugs, and performance optimization.

## Triage Order

1. Reproduce locally with the same command and URL the user used when possible.
2. Capture console, page, and network errors.
3. Confirm the app is serving the expected build, not another local server on the same port.
4. Identify the owner: engine, scene, camera, loop, assets, audio, input, physics, UI, CSS, build/base path, or performance.
5. Fix the root cause in the owning module.
6. Retest the exact broken path.

## Blank Or Bad Canvas

Check in this order:

- Canvas exists in the DOM.
- Canvas CSS size is nonzero and visible.
- Babylon.js Engine created successfully with the canvas.
- Engine is rendering inside exactly one runRenderLoop.
- Camera (ArcRotateCamera, UniversalCamera, etc.) has correct target, alpha/beta/radius or position, near/far, and points at visible content.
- Scene has visible meshes at expected transforms and scale.
- `scene.clearColor` or `scene.fogMode` is not matching object color.
- Materials are visible: alpha, backFaceCulling, wireframe, isVisible flags.
- Lights exist when non-emissive materials need them (Hemi + Directional default).
- Resize updates engine and camera.
- CSS overlays are not covering the canvas.
- Post-processing pipeline output is correctly attached.

## Asset Loading (Babylon.js)

Check:

- URLs and Vite base path.
- Files in `public/` or imported asset paths.
- `SceneLoader.ImportMesh` / `SceneLoader.Append` with correct root URL and filename.
- CORS and MIME type errors.
- glTF external buffers/textures.
- `scene.executeWhenReady()` or asset `onReady` promise resolution.
- Async load state, loading UI, error fallback, and retry behavior.
- Disposal of replaced assets with `mesh.dispose()` / `material.dispose()`.

For generated/imported GLB/GLTF assets, also check file size, URL casing, Vite public/import path, Draco/Meshopt requirements, scene scale, pivot/origin, bounds, texture dimensions, material count, animation group names, and whether generated download URLs were saved before expiring.

## Audio Loading And Playback

Check:

- Audio files exist at runtime URLs and have compatible MIME types.
- `BABYLON.Engine.audioEngine` is available and unlocked from a user gesture.
- `BABYLON.Sound` creation succeeds without silent decode failures.
- SFX triggers are event-driven and not firing every frame.
- Ambience/music loops stop on pause, restart, and scene teardown.
- Mute/volume state controls every group via `sound.setVolume()`.
- Page visibility pause/resume does not stack duplicate sources.
- Mobile browser unlock behavior is tested when mobile is in scope.

## Animation, Loop, And Physics

Check:

- `scene.registerBeforeRender` and `scene.registerAfterRender` callbacks are cleaned up on scene dispose.
- Delta time from `scene.getEngine().getDeltaTime()` is in milliseconds.
- Delta clamping for tab sleep and frame spikes.
- Fixed-step physics accumulator if Havok physics is timing-sensitive.
- Havok plugin initialized (`await HavokPhysics()`) before creating bodies.
- Physics aggregate owns body creation and disposal.
- Collision proxies match visual mesh scale, rotation, and offset.
- `PhysicsBody.setMotionType()` is correct (STATIC, DYNAMIC, ANIMATED).
- High-speed tunneling and spawn overlap checked.
- Sensors/triggers have active `onCollide` observers.
- Kinematic moving platforms update physics bodies, not only visual meshes.
- Restart cleanup for entities, observers, timers, effects, and physics bodies.
- Imported model animation groups exist, clips are bound, and animation groups are stopped/cleaned up on restart.

## Input And Mobile Bugs

Check:

- Keyboard focus and prevented default only where needed.
- `scene.onPointerDown`, `onPointerMove`, `onKeyboardObservable` attached correctly.
- `touch-action` CSS and viewport meta.
- Page scroll stealing gestures.
- Device pixel ratio causing tiny controls or high GPU cost.
- Safe-area insets.
- Orientation/resize after rotation updates engine size.
- Desktop input still works after mobile controls are added.
- UI controls emit game intents and do not directly duplicate simulation rules.

## Performance Profiling Order

Measure in production preview when user-facing performance matters.

1. Establish scenario: viewport, DPR, route, gameplay state, camera view, mobile/desktop.
2. Baseline:
   - FPS/frame time from `engine.getFps()`.
   - Draw calls (active meshes × materials mode).
   - Active meshes count.
   - Materials count.
   - Textures count.
   - Render targets/post passes.
   - JS heap or memory estimate when available.
   - Bundle and large assets when relevant.
   - Imported model file sizes, animation groups, and texture dimensions when generated 3D assets were added.
   - Physics body count and step cost when physics changed.
3. Classify bottleneck:
   - CPU: simulation, allocations, pathfinding, physics, animation, UI layout.
   - GPU draw: draw calls, material switches, too many unique meshes.
   - GPU fragment: overdraw, post-processing, high DPR, transparent particles.
   - GPU vertex: high triangle count, dense shadows, unmerged meshes.
   - Memory: textures, render targets, undisposed resources.
   - Network/bundle: large dependencies or assets.
4. Apply one optimization.
5. Re-measure the same scenario.
6. Check visual/playability regression.

## Preferred Optimizations

- InstancedMesh / SPS (Solid Particle System) for repeated detail.
- Shared geometries/materials/textures.
- Object pools for effects, bullets, pickups, and debris.
- `scene.freezeActiveMeshes()` for static geometry.
- LOD via `mesh.simplify()` or manual LOD groups.
- DPR cap via `engine.setHardwareScalingLevel()` or adaptive quality.
- Cheaper shadows: fewer casters, smaller maps, Poisson/ESM instead of PCF.
- Limited post-processing passes; prefer DefaultRenderingPipeline for essentials.
- Texture atlases, compression (KTX2), reuse, and mipmaps.
- Avoid per-frame allocations and unnecessary `scene.registerBeforeRender` callbacks.
- Reduce physics cost with simple colliders, sleeping, fewer dynamic bodies, collision groups, and narrower sensors before removing important gameplay.
- Dispose meshes, materials, textures, render targets, and audio resources.
- Use `babylon-3d-generator` face limits, smart-low-poly, conversion, lower texture size/quality, or simpler imported variants before deleting important hero readability.

## Renderer Diagnostics Snippet

When possible, expose a diagnostic object:

```ts
window.__BABYLON_GAME_DIAGNOSTICS__ = {
  engine: engine.getInfo(),
  get scene() {
    return {
      activeMeshes: scene.meshes.length,
      materials: scene.materials?.length ?? 0,
      textures: scene.textures?.length ?? 0,
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

## Bug Report Format

```text
Issue:
Reproduction:
Expected:
Actual:
Root cause:
Fix:
Verification:
Residual risk:
```

## Common Mistakes

- Guessing without reproducing.
- Optimizing development-server performance instead of production preview.
- Removing visual detail before checking DPR, post, shadows, instancing, or culling.
- Fixing symptoms in CSS when engine/camera sizing is wrong.
- Adding mobile controls without testing pointer cancel and safe areas.
- Ignoring console/page errors because the canvas appears nonblank.
- Shipping an imported model without checking scale, pivot, collision, animation groups, texture memory, or mobile cost.
- Forgetting to dispose Babylon.js resources (meshes, materials, textures) on scene teardown.
- Using `scene.registerBeforeRender` without cleanup, causing callback leaks across scene transitions.
