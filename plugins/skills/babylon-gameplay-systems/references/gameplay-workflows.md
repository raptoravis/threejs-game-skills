# Babylon.js Gameplay Workflows

Reference for Babylon.js-specific gameplay implementation patterns.

## Scaffold Architecture

Generated projects follow this structure:

```
src/
├── main.ts              # Entry: Engine + Scene + Game.start()
├── core/
│   ├── InputController.ts   # Keyboard + touch input
│   ├── Loop.ts              # runRenderLoop wrapper with delta
│   └── Renderer.ts          # Engine factory + resize
├── entities/
│   ├── Player.ts
│   └── Pickup.ts
├── game/
│   └── Game.ts              # Scene setup, update, render, dispose
├── systems/
│   ├── AudioSystem.ts       # Web Audio procedural SFX
│   ├── CameraRig.ts         # ArcRotateCamera follow
│   ├── CollisionSystem.ts   # AABB/sphere overlap
│   ├── DebugTools.ts        # lil-gui + Babylon Inspector
│   └── Hud.ts               # DOM overlay HUD
└── utils/
    ├── dispose.ts           # Recursive disposal helper
    └── random.ts            # Seeded PRNG for deterministic tests
```

## Babylon Engine Setup

```ts
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

// After scene creation:
engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener('resize', () => engine.resize());
```

## Scene Lifecycle

- **Creation**: `new BABYLON.Scene()` — constructor creates lights, meshes, materials.
- **Running**: `engine.runRenderLoop()` — continuous update + render.
- **Disposal**: `scene.dispose()` — removes all meshes, materials, textures, lights, and observers. Must be called before creating a new scene to avoid leaks.

## Camera Setup (Default: ArcRotateCamera)

```ts
const camera = new BABYLON.ArcRotateCamera(
  'camera', -Math.PI / 2, 1.15, 14, BABYLON.Vector3.Zero(), scene
);
camera.lowerRadiusLimit = 6;
camera.upperRadiusLimit = 22;
camera.inputs.clear(); // Disable default mouse/touch input when auto-following
```

For FPS: `BABYLON.UniversalCamera('fps', position, scene)`.

## Lighting Defaults

```ts
// Ambient + ground fill
const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
hemi.diffuse = BABYLON.Color3.FromHexString('#F6F1DF');
hemi.groundColor = BABYLON.Color3.FromHexString('#2B322D');

// Key light with shadows
const sun = new BABYLON.DirectionalLight('sun', direction, scene);
const shadowGen = new BABYLON.ShadowGenerator(2048, sun);
shadowGen.useBlurExponentialShadowMap = true;
```

## PBR Material Default

```ts
const mat = new BABYLON.PBRMaterial('mat', scene);
mat.albedoColor = BABYLON.Color3.FromHexString('#4A90D9');
mat.roughness = 0.45;
mat.metallic = 0.3;
```

## Diagnostics Hook

Expose `window.__BABYLON_GAME_DIAGNOSTICS__` and `window.__BABYLON_GAME_TEST_HOOKS__` for canvas inspection and deterministic testing.

## Mobile & Resize

- `engine.setHardwareScalingLevel(1 / dpr)` to cap rendering resolution.
- `engine.resize()` on window resize.
- `touch-action: none` on canvas CSS.
- Virtual stick + dash button for mobile input.
