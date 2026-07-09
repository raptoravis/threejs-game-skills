# Prompt Templates (Phaser 2D Graphics)

Load this reference only when the user asks for reusable prompts, starter prompts, or a task template.

## Visual Audit

```text
Audit the current visuals of this Phaser 2D game. Capture active-play screenshots (desktop + mobile) and score all 10 categories of the 2D visual scorecard. Report the 3 lowest-scoring categories with specific observations and proposed upgrades.
```

## Sprite Sheet Upgrade

```text
Upgrade the <entity-type> sprite sheet. Current state: <placeholder description>.

Requirements:
- Resolution: <16x16 / 32x32 / 64x64>
- Frames: idle (4), run (6-8), jump (2-3), action (3-5), hurt (2)
- Colors: use ONLY the shared game palette
- Export: single spritesheet PNG + animation config JSON

Generate the sprite sheet or provide detailed pixel-art specifications.
```

## Tilemap Visual Upgrade

```text
Upgrade the tilemap visuals for <zone/biome name>.

Current state: <placeholder description>.

Requirements:
- Tileset: at least 3 terrain variants + 5 decoration props + edge/transition tiles
- Parallax: 2+ background layers at different scroll rates
- Color palette: consistent with game palette
- Collision: distinct visual for walkable vs. blocked tiles
```

## Particle VFX Pass

```text
Add event-driven particle VFX to this Phaser 2D game.

Events to cover:
- Player dash: streak particles behind movement direction
- Pickup collect: burst + score popup
- Enemy hit: flash + small knockback particles
- Enemy death: larger burst + screen shake (if boss/large enemy)
- Combo/milestone: screen-edge particles + text animation

Requirements:
- All emitters bounded (maxParticles set)
- No particle >16px texture size
- BlendMode intentional per effect
- Emitters destroyed on scene shutdown
```

## Color Palette Unification

```text
Unify the color palette across all sprites, tiles, UI, and particles in this Phaser 2D game.

Requirements:
- Define 6-10 shared palette colors in src/config/Palette.ts
- Replace all ad-hoc colors in sprites, tiles, UI, and particles with palette references
- Ensure colorblind-friendly differentiation (shape + brightness, not hue alone)
- Verify palette works on both desktop and mobile screenshots
```
