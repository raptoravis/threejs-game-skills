# 2D Visual Implementation Blueprint

Use this reference before making systematic visual changes to a Phaser 2D game.

## Pre-Flight Audit

1. Capture active-play screenshots (desktop + mobile).
2. Score all 10 visual-scorecard categories.
3. List the 3 lowest-scoring categories as priority targets.
4. Check render diagnostics: sprite count, draw calls, texture memory.
5. Identify what is procedurally generated vs. what needs external assets.

## Upgrade Order

Work in this order (each layer builds on the previous):

1. **Color palette** — Define 6-10 colors (2-3 neutrals, 2-3 primaries, 2 accents, 1-2 feedback colors). Every sprite, tile, and UI element references this palette.
2. **Background & parallax** — At least 2 scrolling layers behind gameplay. Sky/far background + midground terrain.
3. **Ground/tilemap** — Consistent tileset with at least 3 terrain variants per zone. Edge transitions, decoration tiles.
4. **Player sprite** — Spritesheet with at least idle (4 frames), run (6-8 frames), jump (2-3 frames), and one action frame.
5. **Enemy sprites** — At least 3 variants with idle + move/attack frames. Distinct silhouettes.
6. **Pickup sprites** — At least 2 variants with idle animation (bob, spin, or pulse).
7. **Particle VFX** — Event-driven: on-collect, on-hit, on-dash, on-spawn, on-death, on-boss-phase.
8. **UI/HUD polish** — Genre-specific layout, icon replacements, transition animations.
9. **2D lighting** — Light cones, ambient tint, day/night cycle, fog layers (if appropriate for genre).
10. **Post-processing** — Phaser 4 Filters pipeline: bloom, vignette, color grading (use sparingly).

## Asset Sourcing Decision

For each visual surface, decide:

| Surface | Procedural | threejs-image-generator | Hybrid |
|---|---|---|---|
| Player sprite sheet | Phaser Graphics + spritesheet packer | Gemini: character concept → sprite sheet | Concept art then pixel-art from concept |
| Enemy sprites | Procedural shapes + recolor variants | Gemini: enemy design → sprite sheet | Base shape procedural, details from generated |
| Tilemap/tileset | Procedural pattern tiles | Gemini: terrain texture → tile from texture | Generated texture, procedural tiling |
| Background plates | Gradient + procedural noise | Gemini: sky/landscape plates | Generated sky, procedural cloud layers |
| Pickup icons | Procedural shapes | Gemini: icon/item designs | Shape from generated concept |
| Logo/title | N/A — must be external | Gemini: game logo design | — |
| GUI elements | Procedural shapes with palette | Gemini: UI kit elements | — |
| Particle textures | Procedural circle/star/glow | Gemini: particle sprite sheet | — |

## Implementation Patterns

### Sprite Sheet Creation (Procedural)
```ts
// Generate texture programmatically, then use as spritesheet
const gfx = this.make.graphics({ x: 0, y: 0, add: false });
// Draw frames...
gfx.generateTexture('player-sheet', 256, 256);
// Add spritesheet frames
this.textures.get('player-sheet').add('idle-0', 0, 0, 0, 32, 32);
```

### Parallax Background
```ts
// Use tileSprites with different scroll factors for each layer
this.bgFar = this.add.tileSprite(400, 300, 800, 600, 'bg-far');
this.bgFar.setScrollFactor(0);
this.bgMid = this.add.tileSprite(400, 300, 800, 600, 'bg-mid');
this.bgMid.setScrollFactor(0);
// In update: move at different rates
this.bgFar.tilePositionX += 0.2;
this.bgMid.tilePositionX += 0.5;
```

### Particle System
```ts
const particles = this.add.particles(0, 0, 'particle-key', {
  speed: { min: 50, max: 150 },
  scale: { start: 1, end: 0 },
  lifespan: 500,
  quantity: 10,
  emitting: false,
});
// Trigger on event
particles.emitParticleAt(x, y, 10);
```

## Verification

After visual changes:
- Build passes (tsc + vite build).
- Desktop + mobile screenshots captured.
- Scorecard re-scored with before/after comparison.
- No category dropped below previous score.
- Render diagnostics reported.
