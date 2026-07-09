# Sprite Recipes (Phaser 2D)

Use this reference when designing or upgrading character, enemy, and prop sprites in Phaser 2D games.

## Sprite Design Process

1. Define the character/enemy/prop concept (silhouette, role, size in pixels).
2. Choose a resolution: 16x16 (retro), 32x32 (pixel art standard), 64x64 (detailed), or larger (HD 2D).
3. Block out the silhouette with 3-5 base colors from the game's color palette.
4. Add 2-3 shading colors per base color (highlight, mid, shadow).
5. Animate key frames (see animation section below).
6. Export as spritesheet (TexturePacker or manual layout).

## Minimum Frame Sets by Entity Type

### Player Character
- Idle: 4 frames (breathing bob, slight movement)
- Run/walk: 6-8 frames (full stride cycle)
- Jump: 2-3 frames (launch, apex, fall)
- Action (attack/slash/shoot): 3-5 frames
- Hurt: 2 frames (flash frame + recoil)
- Optional: wall-slide, dash, crouch, victory pose

### Enemy (per archetype)
- Idle: 2-4 frames
- Move: 4-6 frames
- Attack: 3-5 frames (must include telegraph/wind-up before impact frame)
- Hurt: 2 frames
- Death: 3-4 frames (crumble, fade, explode)

### Pickup/Item
- Idle: 4-8 frames (bob, float, sparkle, rotate)
- Collect: 2-3 frames (flash, scale-up, fade)

### Projectile
- Travel: 2-4 frames (spin or trail animation)
- Impact: 3-4 frames (explosion, spark, dissipate)

## Sprite Sheet Organization

- Single spritesheet file per entity or per entity category.
- All frames for one entity in a single row or contiguous block.
- Consistent frame size across the sheet (all frames same width × height).
- Name convention: `entity-state-frame` (e.g., `player-run-0`, `player-run-1`).
- Spacing: 1-2px gap between frames to prevent bleed at scaled resolutions.

## Animation Configuration (Phaser)

```ts
// Create animation from spritesheet frames
this.anims.create({
  key: 'player-run',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
  frameRate: 12,
  repeat: -1, // loop
});

this.anims.create({
  key: 'player-jump',
  frames: this.anims.generateFrameNumbers('player', { start: 8, end: 10 }),
  frameRate: 10,
  repeat: 0, // play once
});

// Play on sprite
sprite.play('player-run');
```

## Color Palette Rules

- Every sprite uses ONLY colors from the shared game palette (6-10 colors).
- Define palette in a single source file: `src/config/Palette.ts`.
- Export as hex values: `export const PALETTE = { primary: '#4ec9b0', dark: '#2a2c25', ... }`.
- No ad-hoc colors in individual sprite files.
- Feedback colors (damage red, heal green, collect gold) use palette accent colors.

## Sprite Quality Checklist

- [ ] Silhouette readable at game resolution (recognizable shape without color).
- [ ] Animation frames tested at actual game speed.
- [ ] Hitbox/hurtbox is smaller than visual sprite (enemy) or centered (player).
- [ ] No leftover pixels outside intended frame bounds.
- [ ] Consistent light direction across all sprites in a scene.
- [ ] Outline (if used) is consistent width (1-2px) across all entities.
- [ ] Colorblind-friendly differentiation: shape + brightness, not just hue.
