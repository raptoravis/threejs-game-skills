---
name: threejs-image-generator
description: "Generate and edit 2D image assets for Three.js games using auto-discovered image generation providers (ARK/Doubao Seedream, Dashscope, Gemini, or any OpenAI-compatible API). Providers are configured via *_IMAGEGEN_MODEL + *_API_KEY env vars, with priority from ~/.env declaration order. Falls back through providers automatically on quota/error. Use for concept sheets, image-to-3D inputs, texture references, sky/background plates, decals, logos, icons, GUI art, title/menu art, thumbnails, marketing stills, and source images that feed threejs-3d-generator. Also use for direct image editing when the user provides an image path."
---

# Three.js Image Generator

## Purpose

Create game-useful 2D assets and references for Three.js projects. This skill is the image-generation layer for the Three.js game system: it produces concepts, textures, decals, UI art, and 2D inputs that can be handed to `threejs-3d-generator` for image-to-3D model creation.

**Multi-provider with fallback**: Providers are auto-discovered from `*_IMAGEGEN_MODEL` environment variables (e.g. `ARK_IMAGEGEN_MODEL`, `DASHSCOPE_IMAGEGEN_MODEL`, …). Priority follows declaration order in `~/.env` — the first declared provider wins. If the primary provider fails (quota exhausted, error), the next provider is tried automatically. Supported backends: ARK/Doubao Seedream (native), Google Gemini (native), and any OpenAI-compatible Images API (Dashscope, etc.).

Resolve `<this-skill-dir>` in the commands below in this order: `~/.claude/skills/threejs-image-generator`, `~/.codex/skills/threejs-image-generator`, `~/.agents/skills/threejs-image-generator`, or repo `skills/threejs-image-generator`.

## When To Use

Use this skill before procedural-only fallback when a Three.js game needs:

- 2D-to-3D reference images for `threejs-3d-generator`: characters, creatures, buildings, ships, cars, weapons, props, pickups, terrain modules.
- Texture and material references: terrain, road, rock, sand, metal, sci-fi panels, trim sheets, decals, hazard labels, signs.
- Environment images: skies, backdrops, city horizons, nebula plates, menu backgrounds, parallax layers.
- UI art: logos, faction marks, icons, item cards, ability badges, cockpit decals, GUI panels, title art.
- Existing-image edits, style variants, cleanup, palette alignment, or concept sheet refinements.

For premium/AAA/showcase graphics work, generate at least one relevant image for high-value 2D surfaces or image-to-3D inputs unless the credential probe or a real generation attempt shows a blocker.

## API Keys & Providers

The script **automatically loads `~/.env`** on startup. Never store API keys in skill files or browser/game code, and never paste a key value into a report.

### Multi-provider setup (~/.env)

Configure one or more providers in `~/.env`. Each provider needs a `{PREFIX}_API_KEY` and a `{PREFIX}_IMAGEGEN_MODEL` pair. The **first declared** `*_IMAGEGEN_MODEL` in the file wins. If it fails (quota, error), the next provider is tried automatically.

```bash
# ARK / Volcengine (ByteDance) — declared first → used by default
ARK_API_KEY=ark-…
ARK_IMAGEGEN_MODEL=doubao-seedream-5-0-pro-260628

# Dashscope (Alibaba)
DASHSCOPE_API_KEY=sk-…
DASHSCOPE_IMAGEGEN_MODEL=qwen-image2-pro

# Gemini (Google) — legacy; also works standalone with GEMINI_API_KEY
GEMINI_API_KEY=…
# No GEMINI_IMAGEGEN_MODEL needed — falls back to gemini-3-pro-image-preview
```

Optional: set `{PREFIX}_BASE_URL` to override the auto-inferred OpenAI-compatible endpoint (for Dashscope and other OpenAI-compatible providers).

### Provider Details

| Provider | API | Notes |
|----------|-----|-------|
| `ARK` | 火山引擎方舟 (native HTTP) | Seedream models. Supports text-to-image and image-to-image. Handles 429 quota errors gracefully. |
| `DASHSCOPE` | 阿里云 Dashscope (OpenAI-compatible) | qwen-image2 and similar models. |
| `GEMINI` | Google Gemini (native genai SDK) | gemini-3-pro-image-preview. Supports text+image input for editing. |

### Override at runtime

- `--provider ARK` — force a specific provider, ignoring priority order and fallback.
- `--api-key sk-…` — override the active provider's API key.

### Credential probe

Step 0, before declaring any provider unavailable: run this skill's own probe and paste its literal output into the report.

```bash
uv run <this-skill-dir>/scripts/generate_image.py probe
```

Example output:
```
Found 2 image generation provider(s):
  → [ARK] model=doubao-seedream-5-0-pro-260628  (from /home/user/.env)
    [DASHSCOPE] model=qwen-image2-pro  (from /home/user/.env)
Active provider: [ARK] doubao-seedream-5-0-pro-260628
```

If no `*_IMAGEGEN_MODEL` is configured, the probe falls back to checking legacy keys:
```
GEMINI_API_KEY=SET  (legacy — no *_IMAGEGEN_MODEL providers found)
```

`No *_IMAGEGEN_MODEL providers and no legacy API keys` is only a valid skip/blocker reason when this probe output is shown. Keys defined only in a shell profile can be absent from the process env; if the plain probe prints MISSING unexpectedly, wrap it: `zsh -lc 'source ~/.zprofile 2>/dev/null || true; source ~/.zshrc 2>/dev/null || true; uv run <this-skill-dir>/scripts/generate_image.py probe'`. When the director skill is loaded, prefer `threejs-game-director/scripts/probe_asset_credentials.sh`, which probes all three asset keys at once.

## Tool Script

Run from the user's current project directory so output lands in the game project:

```bash
# Uses provider priority from ~/.env (first key wins); auto-fallbacks on failure
uv run <this-skill-dir>/scripts/generate_image.py --prompt "your image description" --filename assets/concepts/output.png --resolution 2K
```

Override provider selection (skips fallback):

```bash
uv run <this-skill-dir>/scripts/generate_image.py --provider ARK --prompt "…" --filename output.png
uv run <this-skill-dir>/scripts/generate_image.py --provider GEMINI --prompt "…" --filename output.png
```

Edit an existing image:

```bash
uv run <this-skill-dir>/scripts/generate_image.py \
  --input-image assets/concepts/ship.png \
  --prompt "turn this into a battle-worn red racing livery with clearer material zones" \
  --filename assets/concepts/ship-red-livery.png \
  --resolution 2K
```

Resolution mapping:

- `1K`: quick concepts, icons, draft sheets.
- `2K`: default production reference for image-to-3D, textures, backgrounds, UI panels. This is also the script default when `--resolution` is omitted.
- `4K`: hero splash/title art, high-detail texture references, large sky/background plates.

## Prompt Patterns

Image-to-3D reference:

```text
Create a clean 3D-generation reference image of [asset]. Centered single object, full object visible, plain light background, readable silhouette, clear material zones, game-ready [genre/style], no motion blur, no cropped parts, no text.
```

Riggable character/creature reference:

```text
Create a full-body [T-pose/A-pose/side-view creature] reference for 3D rigging: [details]. Symmetric stance, visible hands/feet/limbs, plain background, readable costume/anatomy layers, no weapon fused to hands.
```

Texture/material reference:

```text
Create a seamless game texture reference for [surface]. Orthographic/top-down, PBR-friendly albedo, clear material variation, no perspective, no baked strong shadows, [style/material details].
```

Logo/icon/UI art:

```text
Create a crisp game UI [logo/icon/badge/panel] for [faction/item/ability]. Transparent-friendly silhouette, high contrast at small size, [genre styling], no tiny unreadable text.
```

Sky/background:

```text
Create a wide game background plate of [environment]. Layered depth, readable horizon, [time/weather/style], suitable behind a real-time Three.js scene, no foreground subject.
```

## Three.js Integration Rules

- Save concepts and image-to-3D sources under `assets/concepts/`.
- Save textures, decals, icons, and GUI source images under `assets/textures/`, `assets/decals/`, or `assets/ui/`.
- For image-to-3D, hand the saved image path to `threejs-3d-generator` and record the chain in the external asset ledger.
- Do not call the image API from client-side game code.
- Convert generated PNGs into runtime formats deliberately: PNG for alpha/UI, JPG/WebP/KTX2 for larger opaque textures where the project pipeline supports it.
- Verify how the image appears in game, not only that the file exists.

## Required Report

Report:

- Credential probe output (provider list with priority).
- Active provider used and whether fallback occurred.
- Prompt and purpose.
- Output path.
- Resolution.
- Whether the image was used directly, edited further, or handed to `threejs-3d-generator`.
- Any remaining integration work such as compression, UV assignment, alpha cleanup, or atlas packing.

Do not mark a premium graphics phase complete if the needed image outputs are missing and the only justification is "procedural is enough" for high-value UI, texture, sky, decal, logo, or image-to-3D surfaces.
