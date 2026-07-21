# Physics Engine Selection (Babylon.js)

Load this before adding or changing physics-heavy gameplay in a Babylon.js game. The default choice is Havok, with Cannon.js as a JS-only fallback.

## Decision Tree

1. **Does the game need continuous physics simulation?**
   - No → Use custom collision (AABB, sphere, raycasting). Simpler, predictable, no WASM.
   - Yes → Go to step 2.

2. **Do you need any of these?**
   - Rigid body dynamics (stacking, rolling, bouncing with realistic friction/restitution)
   - Constraints (hinges, springs, ragdolls)
   - Triggers/sensors with overlap events
   - CCD (continuous collision detection) for high-speed projectiles
   - Character controllers with slope/step handling
   - Vehicle physics with wheel colliders
   - Many simultaneous contacts
   → Yes → Use Havok. Go to step 3.
   → No, just simple gravity + AABB/sphere collisions → Use Cannon.js or custom collision.

3. **Constraints on WASM?**
   - Target platform doesn't support WASM → Use Cannon.js with `@babylonjs/cannon` adapter.
   - Bundle size is critical and the user explicitly asked to avoid WASM → Use Cannon.js.
   - Otherwise → Use Havok.

## Havok Setup

```ts
import HavokPhysics from '@babylonjs/havok';
import { HavokPlugin } from '@babylonjs/core';

const havokInstance = await HavokPhysics();
const havokPlugin = new HavokPlugin(true, havokInstance);
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), havokPlugin);
```

Key considerations:
- Havok is WASM (~2.5 MB). It loads asynchronously.
- Physics bodies use `PhysicsAggregate` for simple setup, or manual `PhysicsBody` + `PhysicsShape` for complex.
- Fixed timestep recommended: configure via `scene.getPhysicsEngine()!.setTimeStep(1/60)`.
- CCD is per-body: `body.setMotionType(BABYLON.PhysicsMotionType.DYNAMIC)` and configure shape CCD margin.

## Cannon.js Setup (Fallback)

```ts
import * as CANNON from 'cannon-es';
import { CannonJSPlugin } from '@babylonjs/core';

window.CANNON = CANNON;
const cannonPlugin = new CannonJSPlugin();
scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), cannonPlugin);
```

Key considerations:
- Pure JavaScript, no WASM dependency.
- Simpler solver, less stable stacking.
- Suitable for < 50 bodies with simple shapes.

## Custom Collision

For arcade triggers, grid-aligned movement, turn-based games, card games, or prototype-scale interactions where authored feel matters more than simulation:

- Use `mesh.intersectsMesh()` for AABB overlap checks.
- Use `BABYLON.BoundingSphere` + manual distance for sphere overlap.
- Use `scene.pick()` / `scene.multiPick()` for raycasting.
- Use `scene.createOrUpdateSelectionOctree()` for spatial partitioning.

## Common Physics Mistakes (Babylon.js)

- Calling `scene.enablePhysics()` after creating bodies (bodies created before physics is enabled are ignored).
- Forgetting to await `HavokPhysics()` before enabling Havok plugin.
- Using `mesh.position` to move physics bodies instead of `body.setLinearVelocity()` or applying forces.
- Not disposing physics bodies on entity removal.
- Physics body and visual mesh scale mismatch.
- Missing collision group / mask configuration causing unexpected interactions.
- High-speed tunneling without CCD or smaller timestep.
- Enabling physics on imported models without checking scale — Havok expects meters.
