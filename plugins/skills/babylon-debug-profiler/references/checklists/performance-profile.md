# Performance Profile Checklist (Babylon.js)

Use this for profiling Babylon.js games. Measure in production preview mode.

## Pre-Measurement Setup

- [ ] Use production build (`npm run build && npm run preview`).
- [ ] Close other GPU-heavy apps.
- [ ] Disable Babylon Inspector (`scene.debugLayer.hide()`).
- [ ] Note OS, browser, GPU, and viewport.
- [ ] Set a fixed DPR via `engine.setHardwareScalingLevel(1)` or known cap.

## Baseline Metrics

```text
FPS (avg 5s):      from engine.getFps()
Frame time:        from engine.getDeltaTime()
Active meshes:     scene.meshes.length
Materials:         scene.materials.length
Textures:          scene.textures.length
Draw calls:        engine.drawCalls?.current
Lights:            scene.lights.length
Render targets:
Post passes:
Bundle size (gzip):
JS heap (est):
```

## Physics Diagnostics (Havok)

```text
Physics bodies:    havokPlugin?.physicsBodies?.length
Timestep:          fixedStep
Sleeping bodies:
Collision pairs:
```

## Bottleneck Checklist

### CPU
- [ ] Too many `scene.registerBeforeRender` callbacks.
- [ ] Physics step cost exceeding 10ms.
- [ ] Pathfinding / AI running every frame instead of staggered.
- [ ] Per-frame allocations (object creation, array spreads).
- [ ] Animation evaluation cost on too many bone-driven meshes.
- [ ] UI layout recalculations.

### GPU — Draw Calls
- [ ] Too many unique meshes (target < 1000 for desktop, < 500 for mobile).
- [ ] Each submesh with unique material adds a draw call.
- [ ] Instances or SPS not used for repeated detail.
- [ ] Static meshes not frozen (`scene.freezeActiveMeshes()`).

### GPU — Fragment
- [ ] High overdraw from stacked transparent objects.
- [ ] High DPR rendering (try `engine.setHardwareScalingLevel(0.75)`).
- [ ] Too many post-processing passes.
- [ ] Shadow maps with large resolution or many casters.
- [ ] Large particle systems with many active emitters.

### GPU — Vertex
- [ ] High-poly imported models without LOD.
- [ ] Shadow casters on high-poly meshes.
- [ ] Meshes never culled (always in frustum).
- [ ] Unmerged static meshes.

### Memory
- [ ] Undisposed textures on scene teardown.
- [ ] Undisposed meshes/materials.
- [ ] Render target leaks.
- [ ] Large imported textures (4096+).

## Optimization Order (Babylon.js)

1. **Meshes**: `Mesh.MergeMeshes()` for static, `InstancedMesh` for repeated dynamic, SPS for particles.
2. **Materials**: share materials, `material.freeze()`.
3. **Textures**: KTX2 compression, reduce resolution, share/reuse.
4. **Shadows**: fewer casters, smaller maps, PCF → Poisson/ESM, `refreshRate` for static shadows.
5. **Post**: consolidate into one `DefaultRenderingPipeline`.
6. **DPR**: `engine.setHardwareScalingLevel(0.5–0.75)` on mobile.
7. **LOD**: `mesh.simplify()` or `BABYLON.MeshLODLevel`.
8. **Culling**: octree for static scene (`scene.createOrUpdateSelectionOctree()`).
9. **Physics**: simple colliders, reduce bodies, collision groups.
10. **Dispose**: clean up on scene transition.
