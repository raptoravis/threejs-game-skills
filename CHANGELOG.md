# Changelog

## 1.3.0

- **Image generator**: multi-provider support via `*_IMAGEGEN_MODEL` env vars — auto-discovers providers from `~/.env` with first-declared-wins priority. Supports Gemini (native), Dashscope (qwen-image2), Ark/Volcengine (doubao-seedream), and any OpenAI-compatible Images API.
- **Image generator**: `--provider` flag to force a specific provider, `--api-key` flag to override the active key.
- **Probe scripts**: both Three.js and Phaser director probes now scan `*_IMAGEGEN_MODEL` and report `IMAGEGEN_PROVIDERS=DASHSCOPE ARK` or `IMAGEGEN_PROVIDERS=MISSING`.
- **Audit scripts**: `has_external_blocker()` updated to treat `*_IMAGEGEN_MODEL` providers as valid image credentials alongside the legacy `GEMINI_API_KEY`.
- **Docs**: README, plugin README, and Cursor rules updated to document multi-provider image generation.

## 1.2.0

- feat(cursor): add Cursor IDE plugin support (rules + MCP)

## 1.1.0

- feat(phaser): add Phaser 2D game skill system with 5 skills (game director, gameplay systems, 2D graphics builder, debug profiler, QA/release) and 7 premium quality checklists

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
