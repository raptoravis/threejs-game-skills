# Three.js + Phaser Game Skills

Self-contained skills for building playable, polished Three.js 3D and Phaser 2D browser games.

## Skills

### Three.js (3D)

| Skill | Description |
| --- | --- |
| `threejs-game-director` | Primary entrypoint for complete 3D game builds and orchestration |
| `threejs-gameplay-systems` | Playable loop, architecture, mechanics, entities, controls, camera, physics |
| `threejs-aaa-graphics-builder` | Visual scorecard, asset architecture, models, materials, VFX, render polish |
| `threejs-game-ui-designer` | HUDs, menus, overlays, responsive UI, icons, safe areas (shared: 3D + 2D) |
| `threejs-debug-profiler` | Scene/runtime/render bugs, mobile bugs, performance profiling |
| `threejs-qa-release` | Browser QA, screenshots, canvas pixels, responsive checks, production build |
| `threejs-3d-generator` | Tripo API text/image-to-3D, texture, auto-rig, animation, conversion |
| `threejs-image-generator` | Gemini image generation for concepts, textures, decals, icons, GUI art (shared: 3D + 2D) |
| `threejs-audio-generator` | ElevenLabs SFX, ambience, UI sounds, voice/TTS, audio integration (shared: 3D + 2D) |

### Phaser (2D)

| Skill | Description |
| --- | --- |
| `phaser-game-director` | Primary entrypoint for complete 2D game builds and orchestration |
| `phaser-gameplay-systems` | Playable loop, scenes, entities, input, Matter.js physics, camera, game feel |
| `phaser-2d-graphics-builder` | 2D visual scorecard, sprites, tilemaps, parallax, particles, palette, lighting |
| `phaser-debug-profiler` | Scene/physics bugs, mobile bugs, performance profiling for Phaser |
| `phaser-qa-release` | Browser QA, screenshots, canvas pixels, responsive checks, production build |

## Platform Support

- **Codex**: reads `.codex-plugin/plugin.json` (native plugin or file copy)
- **Claude Code**: reads `.claude-plugin/plugin.json` (native plugin or file copy)
- **OpenCode**: npm package `threejs-game-skills` or local `.opencode/opencode.json`
- **Reasonix**: `npx threejs-game-skills` or file copy

## Install

```bash
# All platforms
npx threejs-game-skills

# Platform-specific (from repo clone)
./install.sh --all
./install.ps1 -All
```

## License

MIT
