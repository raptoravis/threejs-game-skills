---
name: phaser-2d-graphics-builder
description: "Upgrade Phaser 2D games from basic/prototype visuals to premium visuals. Combines art-direction critique, sprite sheet design, tilemap construction, parallax backgrounds, particle VFX, 2D lighting/shaders, color palette systems, and visual scorecard gates. For premium 2D games with characters, enemies, props, backgrounds, spritesheets, UI art, or particle effects, load threejs-image-generator for concept/texture workflows before deciding procedural assets are enough."
---

# Phaser 2D Graphics Builder

## Purpose

Upgrade Phaser 2D game visuals from prototype to premium. Score active-play screenshots, build sprite/tilemap/particle systems, and do not call prototype sprites premium.

## Use When

Screenshots still look basic across multiple visual surfaces: default rectangle/circle sprites, flat backgrounds, missing particle effects, inconsistent color palettes, or prototype UI.

## Workflow

Load `references/visual-scorecard.md` as the first action when upgrading visuals, claiming premium/showcase quality, or assessing current visual state. Score all 10 categories against active-play screenshots with per-category justification. Track it in a reference ledger with yes/no, path, and failure reason. Do not mark the graphics phase complete while this reference is skipped.

Load `references/implementation-blueprint.md` before making systematic visual changes.

Load `references/sprite-recipes.md` when designing or upgrading character/enemy/prop sprites, spritesheets, or sprite animations.

Load `references/tilemap-recipes.md` when building or upgrading tilemaps, parallax backgrounds, or level environment visuals.

Load `references/particle-recipes.md` when adding or upgrading particle VFX, screen effects, or 2D lighting.

Load `references/prompt-templates.md` only when the user asks for reusable prompts or a task template.

Load `threejs-image-generator` when the game includes or should include concept/reference images, sprite sheet art, texture references, background plates, logo/marks, icons, or GUI art. Do this before deciding those assets are not needed.

1. Capture active-play screenshots (desktop + mobile if in scope).
2. Score current state with the 2D visual scorecard (10 categories, 0-3 scale).
3. Identify the 3 lowest-scoring categories as priority targets.
4. Design upgrades: sprites, tilemaps, parallax, particles, palette, lighting.
5. Implement upgrades and capture new screenshots.
6. Re-score and verify improvement.
7. Report before/after scorecard with evidence.

## Common Failure Modes

- Recoloring the same rectangle/circle primitive and calling it "art direction."
- Adding one particle emitter and calling VFX "done."
- Flat single-color background with no parallax or depth.
- No shared color palette — every asset uses ad-hoc colors.
- Spritesheet frames misaligned or inconsistently sized.
- Particles obscure gameplay (too large, too opaque, too numerous).
- No mobile screenshot validation (colors/contrast differ on mobile screens).

## Final Response

Report the before/after visual scorecard, changed files, asset sources (procedural / image-generator / hybrid), render diagnostics, and remaining visual gaps.
