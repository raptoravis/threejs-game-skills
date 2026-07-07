# Three.js Game Skills

This project provides self-contained skills for building playable, polished Three.js browser games.

## Structure

- `plugins/AGENTS.md` -- main agent instructions (detailed)
- `plugins/skills/` -- 9 game development skills (director, gameplay, AAA graphics, UI, debug, QA, 3D, image, audio)
- `plugins/.codex-plugin/` -- Codex plugin manifest
- `plugins/.claude-plugin/` -- Claude Code plugin manifest
- `plugins/.opencode/` -- OpenCode V2 plugin (adds custom tools: threejs_list_skills, threejs_scaffold_game, threejs_verify_visual)
- `.opencode/` -- OpenCode V2 package root (auto-discovered plugin entry, dependencies, config)
- `plugins/.mcp.json` -- MCP server configuration

## Quick Start

Load `@plugins/AGENTS.md` or read `plugins/AGENTS.md` for the full agent instructions.

For platform-specific plugin manifests:

- **Codex**: reads `plugins/.codex-plugin/plugin.json`
- **Claude Code**: reads `plugins/.claude-plugin/plugin.json`
- **OpenCode**: reads `plugins/.opencode/opencode.json` and loads the V2 plugin at `.opencode/plugins/threejs-game-skills-plugin.js`
- **Reasonix**: install via `npx threejs-game-skills`
