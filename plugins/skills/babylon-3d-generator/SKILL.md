---
name: babylon-3d-generator
description: "Generate, texture, rig, animate, stylize, convert, and download 3D assets for Babylon.js games using the Tripo API. Thin mirror of threejs-3d-generator — loads the Three.js version for full API documentation and adds Babylon-specific GLB/GLTF import, material conversion, and animation group handling. Use for text-to-3D, image-to-3D, game-ready GLB/FBX assets, characters, creatures, buildings, props, weapons, terrain pieces, auto-rigging, animation retargeting, model texturing, LEGO/voxel/Minecraft-style stylization, low-poly/quad conversion, and browser asset pipelines."
---

# Babylon.js 3D Generator (Thin Mirror)

## Purpose

Create production-oriented 3D assets for Babylon.js games via the Tripo API. This is a thin mirror — see `threejs-3d-generator/SKILL.md` for complete Tripo API documentation, model versions, endpoint details, and multi-step workflows.

## Reference Gate

Load `threejs-3d-generator/SKILL.md` for full Tripo API documentation.
Load `threejs-3d-generator/references/api-notes.md` for provider API details.
Load `threejs-3d-generator/references/image-generator-workflows.md` for image-to-3D workflows.
Load this skill's `references/babylon-integration.md` for Babylon-specific import pipeline.

## Babylon-Specific Integration

### Import GLB/GLTF

```ts
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

const result = await BABYLON.SceneLoader.ImportMeshAsync(
  '',                    // mesh names filter (empty = all)
  'assets/models/',      // base path
  'hero.glb',            // filename
  scene                  // target scene
);

const rootMesh = result.meshes[0];
// result.animationGroups[] contains all animation data
```

### Material Conversion

Tripo's glTF PBR outputs map directly to Babylon:

| glTF PBR Slot | Babylon PBRMaterial Property |
|---|---|
| `baseColorTexture` | `albedoTexture` |
| `metallicRoughnessTexture` | `metallicTexture` |
| `normalTexture` | `bumpTexture` |
| `occlusionTexture` | `ambientTexture` |
| `emissiveTexture` | `emissiveTexture` |

Babylon's `PBRMaterial` is glTF-compatible; imported GLB models auto-convert.

### Coordinate System

- Babylon.js uses Y-up, left-handed (same as glTF).
- Tripo models generally export in glTF's Y-up convention — no rotation needed.

### Animation Groups

```ts
for (const group of result.animationGroups) {
  group.start(true);  // loop
  // group.stop();
  // group.play(false);
  // group.speedRatio = 1.5;
}
```

### Simplified Collision Proxy

```ts
// Create a simplified physics body from imported mesh
const boundingInfo = rootMesh.getBoundingInfo();
const box = BABYLON.MeshBuilder.CreateBox('collider', {
  width: boundingInfo.boundingBox.extendSize.x * 2,
  height: boundingInfo.boundingBox.extendSize.y * 2,
  depth: boundingInfo.boundingBox.extendSize.z * 2,
}, scene);
box.isVisible = false; // invisible collider
```

## Tool Script

```bash
python3 <this-skill-dir>/scripts/babylon_3d_asset.py --task-id <TASK_ID> \
  --out-dir ./my-game/public/assets/models/
```

## Credential Probe

Same Tripo API key as Three.js version. Run the shared probe script:

```bash
bash <babylon-game-director-skill-dir>/scripts/probe_asset_credentials.sh
```
