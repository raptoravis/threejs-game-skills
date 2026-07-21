---
name: babylon-aaa-graphics-builder
description: "Upgrade Babylon.js games from basic/prototype visuals to premium AAA-inspired browser graphics. Combines art-direction critique, procedural model building (MeshBuilder), Node Material Editor, PBR material systems, technical art, mandatory external asset sourcing decisions, threejs-3d-generator assets, babylon-image-generator concept/texture workflows, scene visual polish, material/texture libraries, world prop kits, shadow generators, DefaultRenderingPipeline VFX, render budgets, LOD/instancing, render pipeline, and visual scorecard gates. For premium games with characters, vehicles, ships, weapons, buildings, signature props, skies, textures, decals, logos, icons, or GUI art, load the relevant generator skills before deciding procedural assets are enough."
---

# Babylon.js AAA Graphics Builder

## Purpose

Take a Babylon.js game whose active screenshots are dominated by primitives, single flat planes, lost silhouettes, and missing atmosphere, and lift it through authored geometry, PBR materials, lighting design, post-processing, shadow mapping, and art-directed world building. A Babylon.js game with "less basic" visuals or a premium/AAA/showcase quality claim must pass the visual scorecard gates from `references/visual-scorecard.md`.

## Workflow

Load `references/visual-scorecard.md` and `references/implementation-blueprint.md` as the first actions before a graphics pass. Do not mark graphics `done` while either is skipped.

Load `references/node-material-recipes.md` when writing or tuning Node Materials (the Babylon equivalent of custom shaders). Load `references/pbr-recipes.md` when tuning PBR materials, scene lighting, shadow generators, or post-processing. Load `references/model-recipes.md` when building procedural geometry with MeshBuilder, SPS, or CSG. Load `references/technical-art.md` when optimizing render budgets, instancing, LOD, or mesh merging.

Track every loaded reference in a reference ledger.

1. Write a short visual brief from current screenshots: what reads, what disappears, what looks placeholder, what the viewer should feel.
2. List every visible surface or category that still looks basic.
3. Add missing Babylon graphics architecture: PBR material library, DynamicTexture factory, Node Material modules, procedural model builders, world prop layout, shadow generator config, post-processing pipeline, and render diagnostics.
4. Model authored forms per surface (`BABYLON.MeshBuilder.CreateBox/Sphere/Cylinder/Torus/TorusKnot/ExtrudeShape/Lathe`), then group into a world kit.
5. Upgrade every weak visible surface through the chain: authored form → PBR material (albedo, roughness, metallic, normal, AO) → lighting response (HemisphericLight + DirectionalLight + ShadowGenerator) → post-processing polish (DefaultRenderingPipeline).
6. Fill the external asset sourcing ledger before finalizing: what is procedural, what came from `threejs-3d-generator`/`babylon-image-generator`, and for every premium hero surface that remains procedural, provide the real blocker or credential probe output.
7. Add VFX only where needed for communication (trails, impacts, pickups, hazards), and do a readability pass — a game with 4+ particle emitters that hides the player's next threat is worse than one with none.
8. Re-score against the visual scorecard (`references/visual-scorecard.md`) using fresh active-play screenshots.
9. Apply technical art budget: render diagnostics (draw calls, mesh count, material count, texture memory), instancing strategy, LOD, and mobile-cap tuning.
10. Run the scorecard again and report every category that is still below 2 — premium/AAA is not claimed with any remaining <2 category.

## Upgrade Order

authored forms (MeshBuilder) → PBR materials (albedo, roughness, metallic) → lighting (Hemi + Directional + ShadowGenerator) → post-processing (DefaultRenderingPipeline) → VFX readability

Do not skip to post-processing before authored forms and materials are in place. "Do not make primitives look AAA by adding bloom alone."

## Asset Architecture (Babylon.js)

- **Material library**: one root `PBRMaterial` per surface type (player, enemy, pickup, wall, floor, prop). Variants cloned with different albedo/metallic.
- **DynamicTexture factory**: procedurally generate tiled floor textures, decals, and UI plates with `BABYLON.DynamicTexture`.
- **Node Material modules**: reusable Node Material graphs serialized as JSON for runtime loading.
- **Procedural builders**: factory functions that return `BABYLON.Mesh` from MeshBuilder calls (CreateBox, CreateSphere, CreateCylinder, CreateTorus, CreateTorusKnot, ExtrudeShape, CreateLathe).
- **Shadow architect**: one `DirectionalLight` shadow generator for the key light; additional shadow generators only for hero close-ups.
- **Post-processing pipeline**: `BABYLON.DefaultRenderingPipeline` configured with SSAO, bloom, sharpen, chromatic aberration as needed.
- **Diagnostics hook**: expose `window.__BABYLON_GAME_DIAGNOSTICS__` with mesh/material/texture counts and draw calls.

## Visual Scorecard

The 10-category scorecard lives in `references/visual-scorecard.md`. Score every category 0-4. Premium/AAA/showcase requires every category 2+, average 2.3+. Do not substitute a personal rubric. All categories need measured evidence: active-play screenshot, canvas-pixel metrics, or renderer diagnostics.

## External Asset Sourcing Gate

- Load `threejs-3d-generator` before recording "not-needed" when hero 3D surfaces exist.
- Load `babylon-image-generator` before recording "not-needed" when concept, texture, decal, sky, logo, icon, or GUI art need exists.
- Before claiming any API key is unavailable, run the credential probe and paste its `KEY=SET|MISSING` output.
- For premium hero surfaces, procedural-only is not a valid final answer without a `MISSING` probe line or a real API/network/quota error.
- Fill the external asset sourcing ledger before phase `done`.

## Technical Art

- **Render budget**: desktop ~300 draw calls, ~200 materials, ~60 textures; mobile ~150 draw calls, ~100 materials, ~40 textures. Over-budget rows are reported, not fatal.
- **Instancing**: `mesh.createInstance()` for repeat props.
- **LOD**: `mesh.addLODLevel()` or `mesh.simplify()` for distant meshes.
- **Mesh merging**: `BABYLON.Mesh.MergeMeshes()` for static groups.
- **SPS**: `BABYLON.SolidParticleSystem` for thousands of small particles/meshes.
- **Freeze**: `scene.freezeActiveMeshes()` and `material.freeze()` for static content.
- **DPR cap**: `engine.setHardwareScalingLevel()` on mobile.

## Final Response

Lead with the visual scorecard (before/after, average, categories below 2, auto-failures remaining). Include the reference ledger, external asset sourcing ledger, render diagnostics, changed files, screenshots/artifacts, commands, and remaining risks.
