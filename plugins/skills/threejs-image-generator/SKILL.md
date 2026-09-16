---
name: threejs-image-generator
description: "Generate and edit 2D image assets for Three.js games using auto-discovered image generation providers (ARK/Doubao Seedream, Dashscope, Gemini, or any OpenAI-compatible API). Providers are configured via *_IMAGEGEN_MODEL + *_API_KEY env vars, with priority from ~/.env declaration order. Falls back through providers automatically on quota/error. Use for concept sheets, image-to-3D inputs, texture references, sky/background plates, decals, logos, icons, GUI art, title/menu art, thumbnails, marketing stills, and source images that feed threejs-3d-generator. Also use for direct image editing when the user provides an image path."
---

# Three.js Image Generator

The 2D layer for Three.js games: concepts, textures, decals, UI art, and the source images that feed `threejs-3d-generator` for image-to-3D.

Resolve `<this-skill-dir>` from the actual loaded skill file. Resolve sibling skills beside it first, then use the runner's discovered paths. Do not mix installed versions or assume a particular home directory.

## When to use

- Image-to-3D references: characters, creatures, buildings, ships, cars, weapons, props, pickups, terrain modules.
- Texture and material references: terrain, road, rock, sand, metal, sci-fi panels, trim sheets, decals, hazard labels, signs.
- Environment plates: skies, backdrops, city horizons, nebulas, menu backgrounds, parallax layers.
- UI art: logos, faction marks, icons, item cards, ability badges, cockpit decals, GUI panels, title art.
- Editing an existing image: style variants, cleanup, palette alignment, concept refinement.

For premium graphics work with generation in scope, generate the high-value 2D surfaces rather than defaulting to hand-coded CSS and flat colors. Respect explicitly procedural art and external-service restrictions. Choose assets from the game's design, not a fixed quota of logos, skies, or icons.

## API keys & providers

The script auto-loads `~/.env` on startup and discovers providers from `*_IMAGEGEN_MODEL` env vars. Priority follows declaration order in `~/.env` — the first declared provider wins; if it fails (quota or error), the next provider is tried automatically. Keys never go in skill files, game code, or reports.

### Multi-provider setup (~/.env)

```bash
# ARK / Volcengine (ByteDance) — declared first → used by default
ARK_API_KEY=ark-…
ARK_IMAGEGEN_MODEL=doubao-seedream-5-0-pro-260628

# Dashscope (Alibaba)
DASHSCOPE_API_KEY=sk-…
DASHSCOPE_IMAGEGEN_MODEL=qwen-image2-pro

# Gemini (Google) — legacy; also works standalone with GEMINI_API_KEY
GEMINI_API_KEY=…
```

Supported backends: ARK/Doubao Seedream (native HTTP), Google Gemini (native), and any OpenAI-compatible Images API (Dashscope, etc.). Optional `{PREFIX}_BASE_URL` overrides the auto-inferred OpenAI-compatible endpoint.

### Override at runtime

- `--provider ARK` — force a specific provider, ignoring priority order and fallback.
- `--api-key sk-…` — override the active provider's API key.

### Credential probe

Step 0, before declaring any provider unavailable: run this skill's own probe and paste its literal output into the report.

```bash
uv run <this-skill-dir>/scripts/generate_image.py probe
```

Keys defined only in a shell profile can be absent from the process env. If the plain probe unexpectedly prints MISSING, use `threejs-game-director/scripts/probe_asset_credentials.sh`, which sources the profile and probes all providers.

## Commands

Run from the game project so output lands in it:

```bash
uv run <this-skill-dir>/scripts/generate_image.py \
  --prompt "your image description" --filename assets/concepts/output.png --resolution 2K

uv run <this-skill-dir>/scripts/generate_image.py \
  --input-image assets/concepts/ship.png \
  --prompt "battle-worn red racing livery with clearer material zones" \
  --filename assets/concepts/ship-red-livery.png --resolution 2K
```

Resolution: `1K` for quick concepts, icons, and draft sheets · `2K` (the default) for production references, image-to-3D, textures, backgrounds, UI panels · `4K` for hero splash art, high-detail texture references, and large sky plates.

## Prompt patterns

Image-to-3D reference:
> Create a clean 3D-generation reference image of [asset]. Centered single object, full object visible, plain light background, readable silhouette, clear material zones, game-ready [genre/style], no motion blur, no cropped parts, no text.

Riggable character or creature:
> Create a full-body [T-pose / A-pose / side-view creature] reference for 3D rigging: [details]. Symmetric stance, visible hands/feet/limbs, plain background, readable costume and anatomy layers, no weapon fused to hands.

Texture or material:
> Create a seamless game texture reference for [surface]. Orthographic top-down, PBR-friendly albedo, clear material variation, no perspective, no baked strong shadows, [style details].

Logo, icon, or UI art:
> Create a crisp game UI [logo/icon/badge/panel] for [faction/item/ability]. Transparent-friendly silhouette, high contrast at small size, [genre styling], no tiny unreadable text.

Sky or background:
> Create a wide game background plate of [environment]. Layered depth, readable horizon, [time/weather/style], suitable behind a real-time Three.js scene, no foreground subject.

## Integration

Save concepts and image-to-3D sources under `assets/concepts/`; textures, decals, icons, and GUI sources under `assets/textures/`, `assets/decals/`, or `assets/ui/`. Hand image-to-3D sources to `threejs-3d-generator` by path.

Convert PNGs to runtime formats deliberately: PNG where alpha matters (UI, icons, decals), JPG/WebP/KTX2 for larger opaque textures where the pipeline supports it. The API is a tooling step — never called from game code.

Inspect the image before spending on image-to-3D or dependent variants. Check how runtime images look in the game, not just that the file was written. Preserve useful existing images when the user changes requirements, and update the project note instead of regenerating everything.

## Recovery

For coordinated games use the director's `references/asset-recovery.md`. Missing credentials or exhausted credits permit an honest local alternative; a transient error does not. Distinguish invalid input and authentication from service failures. Do not blindly retry an uncertain paid generation: preserve existing files and reconcile the provider result first. This command has no Tripo-style task resume interface. Continue independent game work while only the dependent image work is blocked.

## Report

Credential probe output, active provider and whether fallback occurred, prompt and purpose, output path, resolution, whether it was used directly, edited further, or handed to `threejs-3d-generator`, and any remaining work such as compression, UV assignment, alpha cleanup, or atlas packing.
