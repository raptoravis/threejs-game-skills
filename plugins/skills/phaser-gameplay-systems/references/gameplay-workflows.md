# Gameplay Workflows (Phaser)

Use this reference for first playable slices, architecture, mechanics, entities, controls, camera, physics, audio hooks, and game-feel iteration in Phaser 2D games.

## First Playable Slice

The first slice must be playable, not just rendered.

1. Inspect folder, scripts, dependencies, current renderer, app entrypoint, CSS, assets, and tests.
2. Define the loop in one sentence: verb, objective, pressure, reward, fail/retry.
3. Implement only the mechanics needed for that loop:
   - Phaser game config and Scenes (Boot → Game → UI)
   - update loop with delta-based movement
   - input intents (keyboard + touch)
   - player entity with Matter.js physics body
   - one obstacle/enemy or challenge
   - one reward/progress path
   - collision/trigger checks (Matter.js collision events)
   - score/status state
   - fail/retry state
   - minimal HUD state (DOM overlay or UI Scene)
   - one audio/VFX feedback hook
4. Add diagnostics when possible:
   - `window.__PHASER_GAME_DIAGNOSTICS__`
   - current scene and state
   - player position/velocity
   - active body count
   - input intents
5. Verify build, browser, console/page errors, screenshot, nonblank canvas, and one real input path.

Reject a slice that cannot be controlled or restarted.

## Architecture Boundaries

Prefer simple modules once the prototype grows beyond one file:

- `main.ts`: Phaser game config, scene registration, DOM bootstrap.
- `scenes/`: BootScene (preload), GameScene (core gameplay), UIScene (HUD overlay), MenuScene (title).
- `core/`: InputController (keyboard/touch → game intents), GameLoop diagnostics types.
- `entities/`: Player, Enemy, Pickup, Projectile — game objects with physics bodies.
- `systems/`: PhysicsSystem (Matter.js), AudioSystem, Hud (DOM overlay), CameraSystem, SpawnSystem.
- `utils/`: dispose helpers, object pooling utilities.

Keep update order explicit:

```text
input → physics step (Matter.js internal) → gameplay systems → animation/VFX → camera → HUD → render (Phaser internal)
```

Do not invent abstractions before the mechanics need them. Do extract duplicated entity, input, collision, and asset logic once multiple features share it.

## Scene Lifecycle

Phaser scenes follow a fixed lifecycle:

| Method | When Called | Purpose |
|---|---|---|
| `constructor()` | Once, at game creation | Set scene key, config |
| `init(data)` | Every scene start | Reset state variables from data passed by caller |
| `preload()` | Once per scene start | Queue assets for download |
| `create(data)` | After preload finishes | Build game objects from loaded assets |
| `update(time, delta)` | Every frame | Game logic. Always use `delta` for movement |

**Critical rule**: Reset custom state in `init()` or `create()`, NOT in the constructor. Constructors run once; `init()`/`create()` run every time the scene restarts.

Cross-scene communication:
- `this.registry.set('key', value)` / `this.registry.get('key')` — persistent key-value store
- `this.game.events.emit('eventName', data)` / `this.game.events.on('eventName', handler)` — global event bus
- `this.scene.start('Target', { data })` — pass data to next scene via init(data)

## Input And Intent

- Convert keyboard, pointer, and touch into game intents: left, right, up, down, action1, action2, etc.
- Use `scene.input.keyboard.createCursorKeys()` for arrow keys and `addKeys('W,A,S,D')` for WASD.
- Keep input collection separate from simulation.
- Support both desktop and mobile when the user asks for a browser game unless explicitly desktop-only.
- Use Phaser's built-in `pointerdown`/`pointerup` and `pointermove` for touch.
- Handle pointer release/cancel/blur so controls do not stick.
- Preserve focus and restart controls after fail/pause.

## Camera And Controls

Tune controls and camera together.

- Movement: acceleration, deceleration, friction, turn rate, max speed, jump/gravity/dash.
- Camera: follow target, deadzone, lerp/smoothing, look-ahead in movement direction.
- Readability: next objective visible, player centered enough, threats not hidden by UI.
- Feedback: hit pause, camera shake, indicator pulse, audio pitch, VFX emission point.
- Accessibility: avoid excessive shake, strobe, and uncontrollable motion.

Use `lil-gui` for live constants when repeated tuning is likely, but gate debug UI from release.

## Collision And Physics

Phaser bundles two physics engines:

1. **Arcade Physics**: AABB and circle collision only. Lightweight. Good for simple platformers and shooters.
2. **Matter.js**: Full rigid-body simulation. Sensors, constraints, compound bodies, CCD. Bundled in Phaser — no extra npm package needed.

When physics is in scope, also load `references/physics-engine-selection.md` before choosing an engine.

Rules:
- Enable Matter.js via `physics: { default: 'matter' }` in game config.
- Keep collision proxies simple: use `rectangle`, `circle`, `polygon` shapes via `this.matter.add.sprite()` or `this.matter.add.gameObject()`.
- Use `isSensor: true` for triggers, pickups, and detection zones.
- Use `isStatic: true` for ground, walls, and platforms.
- Label bodies with meaningful labels for collision filtering.
- Use `this.matter.world.on('collisionstart', ...)` for collision events.
- Destroy physics bodies and remove event listeners on scene shutdown.
- Tune `restitution`, `friction`, `frictionAir`, `density` per body type.
- Use `Phaser.Math.Clamp` for position clamping within bounds.

## Gameplay Implementation Loop

For each mechanic:

1. Add state/data.
2. Add simulation/update.
3. Add visual representation (sprite, shape, animation).
4. Add feedback: UI, audio, VFX, camera, animation.
5. Add diagnostics.
6. Verify with real input and one failing edge case.

Examples:
- Pickup: spawn data, collision sensor, score state, collect tween/VFX/audio, HUD pulse, cleanup.
- Hazard: telegraph animation, movement/update, collision body, damage/fail state, hit feedback, restart.
- Combo: timer/state, reward multiplier, UI badge, audio ramp, reset rules.
- Weapon/action: cooldown, projectile spawn, impact feedback, ammo/charge UI, target readability.

## Game Feel Pass

Run several short loops and tune one axis at a time:

- Movement speed and acceleration.
- Jump height, gravity, and air control.
- Camera follow lag and deadzone.
- Reaction windows and obstacle spacing.
- Dash/boost cooldowns.
- Pickup magnetism and reward timing.
- Hit feedback and restart speed.
- Difficulty ramp and pacing.

Record meaningful constants changed. If the game feels worse after a pass, revert or reduce the last tuning change instead of layering compensating changes.

## Audio Hooks

Use lightweight Web Audio or Phaser's SoundManager:

- UI click/pause/retry.
- Pickup/score.
- Damage/fail.
- Boost/speed.
- Combo/milestone.
- Ambient loop when appropriate.

Audio should reflect state, not play random decoration. Respect mute and reduced-motion/accessibility settings when present.

## Diagnostics

Expose via `window.__PHASER_GAME_DIAGNOSTICS__`:

- frame count and elapsed time
- current scene
- player position/velocity
- score / target score
- active body count
- input intents
- tunable constants when using debug GUI

Diagnostics should be easy to disable or gate for release.

## Verification

Minimum evidence after meaningful gameplay work:

- `npm run build` or equivalent.
- Local browser run.
- Console/page error check.
- Nonblank canvas pixel check.
- Desktop screenshot.
- Mobile screenshot when in scope.
- Main input path tested.
- Objective progression tested.
- Fail/retry tested when relevant.

## Common Failures

- Static scene instead of game.
- Multiple scenes updating bodies independently causing conflicts.
- Camera follows wrong target or lags behind fast movement.
- Mechanic cannot be triggered from real input.
- HUD/audio/VFX do not reflect state changes.
- Frame-based movement instead of delta-based.
- Restart leaves stale game objects, timers, listeners, or physics bodies.
- Mobile input works visually but does not emit game intents.
- Imported spritesheet has wrong frame dimensions or pivot.
- Physics bodies persist after scene shutdown.
- Collision event handlers not cleaned up.
