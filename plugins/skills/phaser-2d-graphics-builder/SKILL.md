---
name: phaser-2d-graphics-builder
description: "Upgrade Phaser 2D games from basic/prototype visuals to premium visuals. Combines art-direction critique, sprite sheet design, tilemap construction, parallax backgrounds, particle VFX, 2D lighting/shaders, color palette systems, mandatory external asset sourcing decisions, threejs-image-generator concept/texture workflows, and visual scorecard gates. For premium 2D games with characters, enemies, props, backgrounds, spritesheets, logos, icons, GUI art, or particle effects, load the relevant generator skills before deciding procedural assets are enough."
---

# Phaser 2D Graphics Builder

## Purpose

Own the production 2D graphics pass. Convert basic screenshots into authored, high-density, performance-aware visual experiences. Do not call prototype sprites premium.

## Use When

Screenshots still look basic across multiple visual surfaces: default rectangle/circle sprites, flat single-layer backgrounds, missing particle effects, inconsistent color palettes, generic UI, or the user asks for premium, showcase, high-fidelity, or less-basic 2D graphics.

## Required References

These references are required phase-entry gates, not optional reading:

- Load `references/visual-scorecard.md` before scoring, judging completion, or making any premium/showcase claim.
- Load `references/implementation-blueprint.md` before changing graphics architecture, sprite pipelines, tilemap systems, particle systems, palette systems, diagnostics, or broad visual systems.
- Load `references/sprite-recipes.md` before building or upgrading hero/player, enemy, hazard, pickup, prop, or background sprites, spritesheets, or sprite animations.
- Load `references/tilemap-recipes.md` before changing tilemaps, parallax layers, level environment visuals, or background composition.
- Load `references/particle-recipes.md` before adding or upgrading particle VFX, screen effects, 2D lighting, or feedback juice.
- Load `references/prompt-templates.md` only when the user asks for reusable prompts, a graphics-pass prompt, or a task template.

For broad "still looks basic", premium, showcase, high-fidelity, or less-basic 2D graphics work, load all five references as the first action in the phase. Track them in a reference ledger with yes/no, path, and failure reason. Do not mark the graphics phase complete while any required reference is skipped.

External asset sourcing gate:

- For premium/showcase/high-fidelity/less-basic 2D graphics with concept needs, sprite sheet art, texture references, background plates, decals, logos, faction marks, icons, GUI art, title/menu art, or tile/tileset plates, load `threejs-image-generator` before deciding 2D external assets are not needed.
- Run the director credential probe before using `key unavailable` as a skip reason and paste the SET/MISSING output.
- Create an asset sourcing ledger for each high-value surface: procedural / threejs-image-generator / hybrid, plus outputs or skip reason.
- `not-needed` is valid only after the relevant skill was loaded and the ledger explains why external generation would not improve a non-hero support surface, or why the credential probe or attempted generation shows a real blocker.
- For premium hero surfaces (player sprite, boss, signature prop, hero background), procedural-only is not an allowed final answer unless there is real blocker evidence. At least one high-value surface must show an image generator output path, sprite sheet, or documented hybrid chain.

## Workflow

1. Capture or inspect active desktop/mobile screenshots.
2. Score visuals with the 2D visual scorecard (all categories, 0-3 scale) against active-play screenshots with per-category justification.
3. Identify the lowest-scoring categories as priority targets.
4. Add missing 2D graphics architecture: sprite sheet / texture atlas pipeline, tilemap system, palette system, parallax layers, particle system, 2D lighting, animation state, diagnostics.
5. Run the credential probe, then fill the external asset sourcing ledger per surface: procedural Phaser factory, `threejs-image-generator` 2D reference/sprite/background, or a hybrid.
6. Upgrade every weak visible surface, not only one hero sprite: hero, hazards, rewards, ground/tiles, foreground props, background/parallax layers, interactable telegraphs, palette variation, state VFX.
7. Add palette/lighting/particle polish after authored sprites and tilemaps exist.
8. Add event-driven particle VFX tied to gameplay state; keep particles readable (never obscure gameplay).
9. Re-score screenshots against the calibration anchors, citing the inspector's measured metrics (sprite count, body count, draw calls). Continue until every premium category is at least 2/3 or report exact blockers.
10. Run the fresh-eyes review per `references/visual-scorecard.md` before finalizing premium/showcase claims.
11. Verify desktop/mobile screenshots, console/page errors, canvas pixels, performance diagnostics, and playability.

## Core Rule

Do not make rectangles look premium by adding particles. First build authored sprites, then tilemaps and palette, then lighting/particles/effects.

## Common Failure Modes

- Recoloring the same rectangle/circle primitive and calling it "art direction."
- Adding one particle emitter and calling VFX "done."
- Flat single-color background with no parallax or depth.
- No shared color palette — every asset uses ad-hoc colors.
- Spritesheet frames misaligned or inconsistently sized; many individual sprite images instead of a texture atlas.
- Particles obscure gameplay (too large, too opaque, too numerous).
- No mobile screenshot validation (colors/contrast differ on mobile screens).

## Final Response

Report the reference ledger, credential probe output, external asset sourcing ledger, score before/after, production surfaces upgraded, files changed, screenshots/artifacts, performance diagnostics (sprite/body/draw-call counts), VFX readability tradeoffs, and remaining blockers. For premium/showcase claims, include the filled 2D visual scorecard exactly as defined in `references/visual-scorecard.md`, including average and automatic failures remaining.
