# Physics Engine Selection (Phaser)

Use this reference before adding or changing physics, collision-heavy gameplay, platformer physics, physics puzzles, projectile physics, sensors, or physics QA in Phaser games.

## Current Recommendation

Default to this ladder:

1. **Custom collision**: Grid-aligned movement, turn-based games, card games, simple overlap checks — where no physics simulation is needed.
2. **Matter.js** (default): Full rigid-body physics bundled with Phaser. Sensors, constraints, compound bodies, CCD via `plugins: { sleep: true }`. Best for platformers, physics puzzles, projectile-heavy games, and any 2D game needing realistic collision response.
3. **Arcade Physics**: AABB and circle collision only. Lightweight, fast. Good for simple platformers, bullet hell, and top-down games where only overlap detection matters.

For most new premium 2D Phaser games with real physics, choose Matter.js.

## Why Matter.js Is The Default

Matter.js is a 2D rigid-body physics engine bundled inside Phaser (no separate npm install). It supports rigid bodies, colliders, sensors, collision events, forces/impulses, friction/restitution, constraints, sleeping, and continuous collision detection. It is the best default for 2D Phaser games because:

1. Zero extra dependencies — ships with Phaser.
2. Full TypeScript support via Phaser's type definitions.
3. Sensor support for triggers, pickups, and detection zones.
4. Debug rendering built in (`debug: true` in matter config).
5. Body labels for collision filtering.
6. Compound bodies for complex shapes.

## Choose By Game Type

Use custom collision:
- Card games, grid-based strategy, turn-based games.
- Simple menu/UI interactions.
- Grid-aligned movement where physics feel is undesirable.

Use Arcade Physics:
- Simple 2D platformers with basic jump/gravity.
- Bullet hell / shoot-em-ups needing only projectile-vs-enemy overlap.
- Top-down games with simple AABB collision.
- Games where maximum performance with many bodies is needed.

Use Matter.js:
- 2D platformers with complex physics (ramps, moving platforms, conveyors, water).
- Physics puzzles (stacking, balancing, chain reactions).
- Games needing sensors for triggers, pickups, or detection zones.
- Projectile games needing realistic bounce, ricochet, or trajectory.
- Games with constraints (springs, ropes, pin joints).
- RTS-style collision between many units.
- Tower defense with physics-based projectiles.

## Matter.js Setup Pattern

Enable in game config:

```ts
const config: Phaser.Types.Core.GameConfig = {
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 1 },
      enableSleeping: true,
      debug: false, // Set true during development
    },
  },
};
```

Create bodies:

```ts
// Sprite with default rectangle body
const player = this.matter.add.sprite(400, 300, 'player');

// Image with custom circle body
const ball = this.matter.add.image(400, 100, 'ball', undefined, {
  shape: { type: 'circle', radius: 24 },
});

// Static rectangle (ground/platform)
this.matter.add.rectangle(400, 580, 800, 40, { isStatic: true });

// Sensor for pickups/triggers
this.matter.add.rectangle(400, 200, 32, 32, { isStatic: true, isSensor: true });

// Add physics to existing game object
this.matter.add.gameObject(existingSprite, {
  restitution: 0.5,
  friction: 0.1,
  frictionAir: 0.02,
  density: 0.001,
});
```

Collision detection:

```ts
this.matter.world.on('collisionstart', (event) => {
  for (const pair of event.pairs) {
    const { bodyA, bodyB } = pair;
    if (bodyA.label === 'player' && bodyB.label === 'pickup-0') {
      // Handle pickup
    }
  }
});
```

Tuning per body:
- `restitution` (0-1): Bounciness. 0 = no bounce, 1 = perfect bounce.
- `friction` (0-1): Surface friction. Higher = more grip.
- `frictionAir` (0-1): Air resistance. Higher = faster slowdown.
- `density`: Mass per area. Heavier objects push lighter ones.

## Architecture Rules

- Put physics ownership in `systems/PhysicsSystem` or equivalent.
- Do not create physics bodies inside render code.
- Label every body (`body.label = 'player'`, `body.label = 'enemy'`, etc.) for collision filtering.
- Dispose physics bodies and remove collision listeners on scene shutdown.
- Update order: input intents → Matter.js internal step → game state/collisions → VFX/camera → HUD → render.
- Keep a debug toggle (`matter: { debug: true }`) for body outlines, velocities, and collision pairs.
- Use `isStatic: true` for ground, walls, and non-moving platforms.
- Use `isSensor: true` for pickups, goals, checkpoints, triggers, and damage zones.
- Use collision categories and groups for complex filtering.

## Verification Requirements

For physics work, verify:
- Build/typecheck.
- Browser run with console/page error check.
- Real input changes body state.
- Collision/trigger path works.
- Scene restart removes or resets physics bodies.
- High-speed movement does not tunnel.
- Mobile/low-FPS frame spikes do not break simulation.
- Physics diagnostics: engine used, body count, collision count, sensor count, debug rendering tested.

## Common Failures

- Forgetting to enable Matter.js in game config (Arcade is the default).
- Physics bodies persisting after scene shutdown.
- Detailed sprites used as collision shapes (use simple primitives).
- Fast projectiles tunneling because no CCD/sleep config.
- Sensors missing `isSensor: true`.
- Static bodies moving because they should be kinematic.
- Collision event handlers accumulating across scene restarts.
