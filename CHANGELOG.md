# Changelog

## 1.0.4

- OpenCode: rewrote plugin entry from v0 `load(api)` to v1 factory API — skills now register via `config.skills.paths` + slash commands
- Codex: fixed `marketplace.json` `"source"` from `"."` to `"./plugins"` so Codex discovers the plugin
- Bumped all plugin.json / package.json versions to 1.0.4

## 1.0.3

- Restructured to tunan-style plugin layout: `plugins/skills/`, `plugins/.claude-plugin/`, `plugins/.codex-plugin/`, `plugins/.opencode/`
- Added `.mcp.json` with playwright and sequential-thinking MCP servers
- Added OpenCode JS plugin entry point at `.opencode/plugins/threejs-game-skills-plugin.js`
- Added `CLAUDE.md` root + plugin redirect files
- Added `CHANGELOG.md`

## 1.0.0

- Initial release with 9 Three.js game development skills
