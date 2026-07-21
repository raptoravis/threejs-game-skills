---
name: babylon-image-generator
description: "Generate and edit 2D image assets for Babylon.js games using auto-discovered image generation providers (ARK/Doubao Seedream, Dashscope, Gemini, or any OpenAI-compatible API). Thin mirror of threejs-image-generator — loads the Three.js version for full provider documentation and multi-provider fallback logic and adds Babylon-specific texture conventions and PBR material integration. Use for concept sheets, image-to-3D inputs, texture references, sky/background plates, decals, logos, icons, GUI art, title/menu art, thumbnails, and marketing stills."
---

# Babylon.js Image Generator (Thin Mirror)

## Purpose

Create game-useful 2D assets and references for Babylon.js projects. This is a thin mirror — see `threejs-image-generator/SKILL.md` for complete provider documentation (ARK/Doubao Seedream, Dashscope, Gemini), `.env` configuration, multi-provider fallback behavior, and image editing.

## Reference Gate

Load `threejs-image-generator/SKILL.md` for full provider documentation and multi-provider fallback logic.

## Babylon-Specific Integration

### Texture Use in PBRMaterial

Generated textures map directly to Babylon.js PBRMaterial slots:

```ts
const mat = new BABYLON.PBRMaterial('mat', scene);
mat.albedoTexture = new BABYLON.Texture('textures/concept_albedo.png', scene);
mat.metallicTexture = new BABYLON.Texture('textures/concept_metallic.png', scene);
mat.bumpTexture = new BABYLON.Texture('textures/concept_normal.png', scene);
mat.ambientTexture = new BABYLON.Texture('textures/concept_ao.png', scene);
```

### Environment / Skybox

```ts
const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 100 }, scene);
const skyMat = new BABYLON.StandardMaterial('skyMat', scene);
skyMat.backFaceCulling = false;
skyMat.disableLighting = true;
skyMat.reflectionTexture = new BABYLON.CubeTexture('textures/skybox', scene);
skyMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skybox.material = skyMat;
```

### GUI Art

Generated logos, icons, and menu art can be used in Babylon GUI via `BABYLON.GUI.Image`:

```ts
const logo = new BABYLON.GUI.Image('logo', 'assets/ui/logo.png');
logo.width = '200px';
logo.height = '80px';
ui.addControl(logo);
```

## Tool Script

Same as Three.js version — completely engine-agnostic:

```bash
python3 <this-skill-dir>/scripts/generate_image.py --prompt "..." --out-dir ./assets/textures/
```

The `generate_image.py` script is identical to the Three.js version.
