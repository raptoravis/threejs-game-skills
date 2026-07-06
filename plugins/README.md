# Three.js Game Skills

Self-contained skills for building playable, polished Three.js browser games.

## Skills

| Skill | Description |
| --- | --- |
| `threejs-game-director` | Primary entrypoint for complete game builds and orchestration |
| `threejs-gameplay-systems` | Playable loop, architecture, mechanics, entities, controls, camera, physics |
| `threejs-aaa-graphics-builder` | Visual scorecard, asset architecture, models, materials, VFX, render polish |
| `threejs-game-ui-designer` | HUDs, menus, overlays, responsive UI, icons, safe areas |
| `threejs-debug-profiler` | Scene/runtime/render bugs, mobile bugs, performance profiling |
| `threejs-qa-release` | Browser QA, screenshots, canvas pixels, responsive checks, production build |
| `threejs-3d-generator` | Tripo API text/image-to-3D, texture, auto-rig, animation, conversion |
| `threejs-image-generator` | Gemini image generation for concepts, textures, decals, icons, GUI art |
| `threejs-audio-generator` | ElevenLabs SFX, ambience, UI sounds, voice/TTS, audio integration |

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
