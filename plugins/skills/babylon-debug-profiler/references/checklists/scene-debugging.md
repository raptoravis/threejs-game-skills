# Scene Debugging Checklist (Babylon.js)

Use this for render/runtime bugs specific to Babylon.js scenes.

## Engine & Scene

- [ ] `new BABYLON.Engine(canvas, true)` created before scene.
- [ ] Only one `engine.runRenderLoop(...)` active.
- [ ] `scene.executeWhenReady()` used for initialization that needs loaded assets.
- [ ] `engine.resize()` called on window resize.
- [ ] Canvas CSS `width/height: 100%` and no competing sizing.

## Camera

- [ ] Camera type matches gameplay needs (ArcRotateCamera for orbit, UniversalCamera for FPS, FollowCamera for third-person).
- [ ] Camera `target` set.
- [ ] `camera.attachControl(canvas, true)` called.
- [ ] Near/far planes cover the scene (`camera.minZ`, `camera.maxZ`).
- [ ] `camera.fov` or `camera.orthoTop`/`orthoBottom` set correctly.
- [ ] Camera not inside a solid mesh.

## Lights

- [ ] At least one light source when non-emissive materials are used.
- [ ] Default setup: `HemisphericLight` (ambient/ground) + `DirectionalLight` (key light).
- [ ] Light `intensity` and `diffuse`/`specular` set.
- [ ] `light.setEnabled(true)`.
- [ ] Light `includedOnlyMeshes` or `excludedMeshes` not accidentally filtering.

## Meshes & Materials

- [ ] `mesh.isVisible = true`.
- [ ] `mesh.isEnabled()` returns true.
- [ ] Mesh position, rotation, scaling within camera frustum.
- [ ] `material.alpha` not set to 0.
- [ ] `material.alphaMode` correct (OPAQUE, BLEND, etc.).
- [ ] `material.backFaceCulling` appropriate.
- [ ] `material.wireframe = false`.
- [ ] PBRMaterial roughness/metallic within [0, 1].
- [ ] Textures loaded and `texture.hasAlpha` correct.
- [ ] Mesh not culled by `scene.freezeActiveMeshes()` when animated.

## Post-Processing

- [ ] `DefaultRenderingPipeline` or custom pipeline attached to the correct camera.
- [ ] Pipeline effects not all disabled.
- [ ] Render target size matches viewport or DPR.
- [ ] Post-process `autoClear` set appropriately.

## Common Root Causes

- Camera `target` is `(0,0,0)` but mesh is far away.
- `HemisphericLight` intensity too low (default 1.0 with groundColor black looks dark).
- Mesh scale is 0.001 (imported model in wrong coordinate system).
- `scene.clearColor` is black and camera is pointing at empty space.
- Material is `null` (mesh renders in wireframe or with error material).
- ArcRotateCamera `upperBetaLimit` or `lowerBetaLimit` constraining camera to ground.
- `scene.freezeActiveMeshes()` frozen animated meshes.
