# Particle & VFX Recipes (Phaser 2D)

Use this reference when adding or upgrading particle VFX, screen effects, or 2D lighting in Phaser games.

## Particle System Basics

Phaser 4 uses `this.add.particles(x, y, textureKey, config)`.

```ts
const emitter = this.add.particles(0, 0, 'particle', {
  speed: { min: 50, max: 150 },
  angle: { min: 0, max: 360 },
  scale: { start: 0.8, end: 0 },
  alpha: { start: 1, end: 0 },
  lifespan: 500,
  quantity: 10,
  emitting: false,
});
```

### Particle Texture Types
- Circle/glow: general-purpose sparks, magic, fire
- Star/diamond: collectibles, power-ups
- Line/streak: speed trails, slash effects
- Ring: shockwaves, explosions
- Custom sprite: game-specific effects

## Event-Driven VFX Recipes

### Player Dash
```ts
dashEmitter.emitParticleAt(player.x, player.y, 12);
// Streak particles behind player direction
```

### Pickup Collection
```ts
collectEmitter.emitParticleAt(pickup.x, pickup.y, 8);
// Burst outward in pickup color
// Scale: start 1, end 0
// Add score popup text tween
```

### Enemy Hit
```ts
hitEmitter.emitParticleAt(enemy.x, enemy.y, 5);
// White flash on enemy sprite (50ms tint)
// Small knockback tween
// Damage number float-up
```

### Enemy Death
```ts
deathEmitter.emitParticleAt(enemy.x, enemy.y, 20);
// Larger burst, enemy-color particles
// Scale: start 1.5, end 0
// Lifespan: 800ms
// Add screen shake if large enemy
```

### Boss Phase Transition
```ts
// Screen-clearing radial burst from boss center
// Particles fly outward, change color for new phase
// Flash overlay (white → fade 500ms)
// New background tint
```

### Projectile Impact
```ts
impactEmitter.emitParticleAt(hit.x, hit.y, 6);
// Ring particle expanding outward (shockwave)
// Small directional sparks in hit normal direction
```

### Combo / Score Milestone
```ts
// Central burst + screen-edge particles
// Combo text scale-up tween with bounce ease
// Brief screen flash (subtle, at screen edges only)
```

## 2D Lighting Recipes

### Light Cone / Torch
```ts
// Use a radial gradient sprite with additive blending
const light = this.add.image(x, y, 'light-glow');
light.setBlendMode(Phaser.BlendModes.ADD);
light.setAlpha(0.6);
light.setDepth(100);
```

### Day/Night Overlay
```ts
// Full-screen rectangle with alpha varying by time
const overlay = this.add.rectangle(0, 0, width, height, 0x000033);
overlay.setOrigin(0, 0);
overlay.setDepth(99);
overlay.setAlpha(0); // 0 = day, 0.5 = dusk, 0.8 = night
```

### Vignette
```ts
// Dark gradient at screen edges, transparent center
const vignette = this.add.image(width / 2, height / 2, 'vignette');
vignette.setDepth(101);
vignette.setAlpha(0.3);
```

### Fog Layers
```ts
// Semi-transparent scrolling cloud sprites between parallax layers
const fog = this.add.tileSprite(0, 0, width, height, 'fog-texture');
fog.setOrigin(0, 0);
fog.setAlpha(0.15);
fog.setBlendMode(Phaser.BlendModes.NORMAL);
fog.setDepth(5);
// In update: fog.tilePositionX += 0.1;
```

## VFX Quality Checklist

- [ ] No particle obscures gameplay-critical information (player, enemy telegraphs, UI).
- [ ] Particle count bounded per emitter (maxParticles set).
- [ ] Emitters stop and are destroyed on scene shutdown.
- [ ] Particle textures are small (4-16px) and use texture atlas.
- [ ] Screen shake has configurable intensity and is disabled when accessibility setting is on.
- [ ] Flashing/strobe effects are below 3 flashes/second threshold.
- [ ] BlendMode used intentionally (ADD for glow/fire, NORMAL for debris, MULTIPLY for shadows).
- [ ] Particle system performance tested at peak concurrent emitters.
