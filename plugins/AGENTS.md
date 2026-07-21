# Agent Instructions

This repo contains plugin assets for Three.js, Phaser, and Babylon.js browser-game development, organized for Claude Code, Codex, OpenCode, Reasonix, and Cursor.

## Engine Routing

Route game requests by engine based on genre and user intent:

- **Three.js (3D)**: FPS, racing, flight combat, 3D platformer, third-person action, endless runner (3D), physics puzzles (3D), survival/crafting (3D).
- **Babylon.js (3D)**: FPS, racing, flight combat, 3D platformer, third-person action, endless runner (3D), physics puzzles (3D), survival/crafting (3D). When the user requests "babylon", "babylonjs", or "babylon.js", route to `babylon-game-director`.
- **Phaser (2D)**: 2D platformer, RPG (top-down/isometric), tower defense, card game, bullet hell / shoot-em-up, RTS, narrative games, SLG/strategy.
- **Ambiguous requests**: If the user does not name an engine, ask "3D or 2D?" or infer from genre keywords (橫版=Phaser, 第一人称=Three.js, 卡牌=Phaser, 赛车=Three.js, etc.).
- **Explicit engine requests**: "use threejs", "use babylon", "use phaser", "3D game", "2D game" → route to the matching director.
- **Coexistence**: All three engine skill sets coexist. Do not delete or degrade Three.js skills when adding Phaser or Babylon skills, and vice versa.

## Default Technical Stack (Three.js)

- Prefer TypeScript, Vite, npm package imports, and Three.js modules.
- Use `three/addons/...` for official controls, loaders, and post-processing helpers.
- Use simple custom collision for arcade triggers and prototype-scale interactions.
- Use Rapier as the default robust physics engine for serious Three.js browser games with rigid bodies, sensors, balls, ramps, moving platforms, many contacts, or high-speed collisions.
- Use `cannon-es` only as a lightweight JavaScript fallback for small/simple rigid-body scenes when avoiding WASM matters.
- Load `plugins/skills/threejs-gameplay-systems/references/physics-engine-selection.md` before adding or changing physics-heavy gameplay.
- Use `lil-gui` for local tuning when it materially speeds iteration.
- Use a lightweight HUD or `stats.js` for frame diagnostics when performance is in scope.
- Treat WebGPU as conditional. Use Three.js `WebGPURenderer` only when the project benefits from it and keep a WebGL/WebGL2 fallback path.

## Default Technical Stack (Phaser 2D)

- Prefer TypeScript, Vite, npm package imports, and Phaser 4 modules (`phaser@^4.2.0`).
- Use Phaser's Scene lifecycle: `BootScene → PreloadScene → MenuScene → GameScene → UIScene`.
- Use Matter.js as the default physics engine (bundled with Phaser, no extra package). Enable via `physics: { default: 'matter' }` in game config.
- Use Arcade Physics only for simple AABB/circle overlap games where authored feel matters more than simulation.
- Use custom collision for grid-aligned movement, card games, and turn-based games that do not need a physics engine.
- Load `plugins/skills/phaser-gameplay-systems/references/physics-engine-selection.md` before adding or changing physics-heavy 2D gameplay.
- Use `lil-gui` for local tuning when it materially speeds iteration.
- Use a lightweight HUD via DOM overlay or parallel UI Scene.
- Use Phaser's ScaleManager with `FIT` mode for responsive/mobile-friendly sizing.
- Use texture atlases to minimize draw calls; avoid loading many individual sprite images.
- Use object pooling for frequently created/destroyed game objects (enemies, projectiles, particles).

## Game Quality Bar

- For broad requests to build, upgrade, polish, or finish a Three.js game, route through `threejs-game-director` first. The user should not have to name every specialist skill.
- Public Three.js skills are consolidated around the director plus specialist systems: gameplay, AAA graphics, UI, debug/profile, QA/release, 3D generation, image generation, and audio generation.
- In Claude-style skill runners, do not assume a director skill can literally invoke other skills. The director must attempt to load sibling public `SKILL.md` files first, report a skill-loading ledger, and use the bundled phase OS only for files that cannot be loaded.
- For broad/premium director work, the director must load each phase's required `references/*.md` files at phase entry and report a reference ledger. A phase is not done if its required references were skipped.
- Premium/AAA/showcase claims must include the filled visual scorecard from `plugins/skills/threejs-aaa-graphics-builder/references/visual-scorecard.md`, including average score and automatic failures remaining. Do not substitute an improvised rubric.
- When shell tools are available, run `plugins/skills/threejs-game-director/scripts/audit_reference_report.py --premium <report.md>` against the final evidence report before claiming premium, AAA, showcase, complete, release-ready, or "less basic" success.
- Build a playable loop first. A static scene is not done.
- Do not stop at first playable slice when the user asked for premium, AAA, polished, complete, release-ready, or showcase quality.
- Keep scene setup, loop, input, systems, entities, UI, assets, and debug tools separated once the prototype grows beyond a single simple file.
- Tune movement, camera, collisions, feedback, and HUD through short playtest loops.
- For physics-heavy games, report engine choice, fixed timestep, collider strategy, sensors, CCD use, body/collider counts, and restart cleanup evidence.
- Avoid decorative-only UI, generic purple gradients, particle clutter, and unchecked post-processing.
- Keep mobile input and resize behavior in the first implementation path, not as a final afterthought.
- Use screenshot-based art-direction critique when visual priorities are unclear.
- Use `threejs-aaa-graphics-builder` when screenshots still look basic across multiple visual surfaces. Do not split that broad graphics problem into isolated small polish tasks.
- Use focused UI passes for HUDs, menus, text fit, icon controls, and safe-area layout instead of treating interface craft as generic polish.
- Use focused procedural-model passes for scratch-built assets, prop kits, material variation, instancing, LOD, and renderer-count-aware detail.
- For premium/AAA/showcase/high-fidelity/less-basic work with characters, vehicles, ships, weapons, buildings, signature props, skies, textures, decals, logos, icons, GUI art, SFX, ambience, or voice, load `threejs-3d-generator`, `threejs-image-generator`, and/or `threejs-audio-generator` before deciding procedural/generated assets are unnecessary.
- Run the director credential probe before claiming 3D/image/audio generation credentials are unavailable. A missing key is not a valid blocker unless the SET/MISSING probe output is reported.
- Report an external asset sourcing ledger for premium graphics work: procedural / threejs-image-generator / threejs-3d-generator / hybrid per high-value surface, plus task IDs/output paths or real blocker evidence.
- For premium hero surfaces, procedural-only is not a valid final answer unless credential probe output or attempted generation shows a real blocker.
- Use `threejs-3d-generator` for high-value external AI-generated 3D assets, auto-rigging, animation, texture, conversion, and GLB/FBX game asset workflows.
- Use `threejs-image-generator` before `threejs-3d-generator` when 2D concept/reference images, T-pose/A-pose character sheets, texture references, decals, logos, icons, skies, backgrounds, or GUI art would improve the result.
- Use `threejs-audio-generator` for game SFX, ambience loops, UI sounds, announcer/dialogue, voice conversion, and audio cleanup.
- Treat generic stat-card HUDs, cube obstacles, and skyline boxes as prototype placeholders unless the user explicitly wants that style.
- Require active-play screenshot scoring for premium/AAA claims. A build is not premium if the visual scorecard has any category below 2.

## 2D Game Quality Bar (Phaser)

- For broad requests to build, upgrade, polish, or finish a Phaser 2D game, route through `phaser-game-director` first.
- Public Phaser skills are consolidated around the director plus specialist systems: gameplay, 2D graphics, UI, debug/profile, and QA/release.
- In Claude-style skill runners, the director must attempt to load sibling public `SKILL.md` files first, report a skill-loading ledger, and use the bundled phase OS only for files that cannot be loaded.
- For broad/premium director work, the director must load each phase's required `references/*.md` files at phase entry and report a reference ledger.
- Premium/showcase 2D claims must include the filled 2D visual scorecard from `plugins/skills/phaser-2d-graphics-builder/references/visual-scorecard.md`, including average score and automatic failures remaining.
- When shell tools are available, run `plugins/skills/phaser-game-director/scripts/audit_reference_report.py --premium <report.md>` against the final evidence report.
- Build a playable loop first. A static scene is not done.
- Keep Boot/Game/UI scene separation from the first prototype.
- Tune movement, physics, camera, collision, feedback, and HUD through short playtest loops.
- For physics-heavy games, report engine choice (Matter.js/Arcade), body count, sensor count, debug rendering state, and restart cleanup evidence.
- Avoid decorative-only UI, generic shape sprites, and unchecked particle systems.
- Keep mobile input and FIT scaling behavior in the first implementation path.
- Use `phaser-2d-graphics-builder` when screenshots still look basic across multiple visual surfaces.
- Use focused UI passes for HUDs, menus, text fit, icon controls, and safe-area layout.
- Use focused sprite/tilemap passes for character sprites, enemy sprites, prop kits, tile variants, and parallax backgrounds.
- For premium/showcase/high-fidelity/less-basic 2D work with character sprites, enemy sprites, prop sprites, backgrounds, logos, icons, GUI art, SFX, ambience, or voice, load `threejs-image-generator` and/or `threejs-audio-generator` before deciding procedural/generated assets are unnecessary.
- Run the director credential probe before claiming 2D image/audio generation credentials are unavailable.
- Report an external asset sourcing ledger for premium 2D graphics work: procedural / image-generator / hybrid per high-value surface.
- Use `threejs-image-generator` for sprite sheet art, tile textures, background plates, logo designs, and GUI art.
- Use `threejs-audio-generator` for game SFX, ambience loops, UI sounds, and audio cleanup.
- Treat generic rectangle/circle sprites, flat backgrounds, and default UI as prototype placeholders.
- Require active-play screenshot scoring for premium claims. A build is not premium if the 2D visual scorecard has any category below 2.

## Verification Bar

For meaningful Three.js changes, gather evidence before claiming success:

- `npm run build`
- a local dev or preview server opened in a browser
- browser console and page error check
- Playwright screenshot
- canvas nonblank pixel check
- at least one desktop and one mobile viewport
- interaction check for the main control path
- performance snapshot when draw calls, asset counts, shaders, or post-processing changed
- UI text-fit, overlap, safe-area, and touch-target evidence when interface layout changed
- renderer diagnostics when procedural model fidelity, material count, or repeated props changed
- external asset sourcing ledger when premium graphics include high-value 3D or 2D asset categories
- credential probe output plus real external asset outputs or blocker evidence for premium asset-category claims
- visual scorecard before/after when the user asks for premium, AAA, showcase, or "less basic" graphics

Use the scaffold's `npm run verify:visual` and `npm run inspect:canvas` when available, or `plugins/skills/threejs-qa-release/scripts/inspect-threejs-canvas.mjs` from this repo.

## Verification Bar (Phaser 2D)

For meaningful Phaser 2D changes, gather evidence before claiming success:

- `npm run build`
- a local dev or preview server opened in a browser
- browser console and page error check
- Playwright screenshot
- canvas nonblank pixel check via `inspect-phaser-canvas.mjs`
- at least one desktop and one mobile viewport
- interaction check for the main control path
- performance snapshot when sprite counts, physics bodies, or particle systems changed
- UI text-fit, overlap, safe-area, and touch-target evidence when interface layout changed
- body count and scene diagnostics when physics complexity changed
- external asset sourcing ledger when premium graphics include high-value 2D asset categories
- credential probe output plus real external asset outputs or blocker evidence for premium asset-category claims
- 2D visual scorecard before/after when the user asks for premium, showcase, or "less basic" graphics

Use the scaffold's `npm run verify:visual` and `npm run inspect:canvas` when available, or `plugins/skills/phaser-qa-release/scripts/inspect-phaser-canvas.mjs` from this repo.

## Default Technical Stack (Babylon.js)

- Prefer TypeScript, Vite, npm package imports, and `@babylonjs/core` modules.
- Use `BABYLON.Engine` for WebGL/WebGPU context creation.
- Use `BABYLON.Scene` for scene graph management.
- Use `BABYLON.ArcRotateCamera` for orbit/third-person; `BABYLON.UniversalCamera` for FPS.
- Use `BABYLON.HemisphericLight` for ambient/ground fill; `BABYLON.DirectionalLight` with `BABYLON.ShadowGenerator` for key light.
- Use Havok (`@babylonjs/havok`) as the default robust 3D physics engine.
- Use Cannon.js (`cannon-es` with `@babylonjs/core` CannonJSPlugin) only as a lightweight JS fallback.
- Use `BABYLON.PBRMaterial` for physically-based rendering; `BABYLON.StandardMaterial` for simpler materials.
- Use Node Material Editor for visual shader authoring; serialize as JSON for runtime.
- Use `BABYLON.DefaultRenderingPipeline` for post-processing (SSAO, bloom, DOF, sharpen, chromatic aberration).
- Use `BABYLON.GUI` (`@babylonjs/gui`) for in-game UI; DOM overlay for text-heavy/accessible HUDs.
- Use `lil-gui` for local tuning; Babylon Inspector (`scene.debugLayer.show()`) for scene debugging.
- Use `@babylonjs/loaders` for glTF/GLB/FBX/OBJ asset loading.
- Keep scene setup, loop, input, systems, entities, UI, assets, and debug tools separated.

## Game Quality Bar (Babylon.js)

- For broad requests to build, upgrade, polish, or finish a Babylon.js game, route through `babylon-game-director` first.
- Public Babylon.js skills are consolidated around the director plus specialist systems: gameplay, AAA graphics, UI, debug/profile, QA/release, 3D generation, image generation, and audio generation.
- In Claude-style skill runners, the director must attempt to load sibling public `SKILL.md` files first, report a skill-loading ledger, and use the bundled phase OS only for files that cannot be loaded.
- For broad/premium director work, the director must load each phase's required `references/*.md` files at phase entry and report a reference ledger.
- Premium/AAA/showcase claims must include the filled visual scorecard from `plugins/skills/babylon-aaa-graphics-builder/references/visual-scorecard.md`.
- When shell tools are available, run `plugins/skills/babylon-game-director/scripts/audit_reference_report.py --premium <report.md>`.
- Build a playable loop first. A static scene is not done.
- Keep Engine, Scene, systems, entities, UI, assets, and debug tools separated.
- Tune movement, camera, collisions, feedback, and HUD through short playtest loops.
- For physics-heavy games, report Havok/Cannon.js choice, timestep, impostor strategy, body count, and restart cleanup evidence.
- Avoid decorative-only UI, generic purple gradients, particle clutter, and unchecked post-processing.
- Keep mobile input and resize behavior in the first implementation path.
- Use `babylon-aaa-graphics-builder` when screenshots still look basic.
- For premium work with characters, vehicles, ships, weapons, buildings, props, skies, textures, decals, logos, icons, GUI art, SFX, ambience, or voice, load relevant generator skills before deciding procedural/generated assets are unnecessary.
- Run the director credential probe before claiming credentials are unavailable.
- Require active-play screenshot scoring for premium/AAA claims.

## Verification Bar (Babylon.js)

For meaningful Babylon.js changes, gather evidence before claiming success:

- `npm run build`
- a local dev or preview server opened in a browser
- browser console and page error check
- Playwright screenshot
- canvas nonblank pixel check via `inspect-babylon-canvas.mjs`
- at least one desktop and one mobile viewport
- interaction check for the main control path
- performance snapshot when mesh counts, material counts, shadow maps, or post-processing changed
- UI text-fit, overlap, safe-area, and touch-target evidence when interface layout changed
- renderer diagnostics when procedural model fidelity, material count, or repeated props changed
- external asset sourcing ledger when premium graphics include high-value 3D asset categories
- credential probe output plus real external asset outputs or blocker evidence for premium asset-category claims
- visual scorecard before/after when the user asks for premium, AAA, showcase, or "less basic" graphics

Use the scaffold's `npm run verify:visual` and `npm run inspect:canvas` when available, or `plugins/skills/babylon-qa-release/scripts/inspect-babylon-canvas.mjs` from this repo.
