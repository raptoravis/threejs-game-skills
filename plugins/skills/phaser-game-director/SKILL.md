---
name: phaser-game-director
description: "Primary entrypoint for complete Phaser 2D browser game creation, premium iteration, and automatic phase orchestration. Use by default for build-a-2D-game, upgrade, polish, premium, high-fidelity, from-scratch, platformer, RPG, tower defense, card game, bullet hell, RTS, release-ready, or showcase requests. For broad work, first load sibling public skill files for gameplay systems, 2D graphics, UI, debug/profile, and QA/release. For premium 2D games with characters, enemies, props, backgrounds, spritesheets, logos, icons, GUI art, audio/SFX/voice needs, or less-basic graphics, load threejs-image-generator and/or threejs-audio-generator before deciding generated assets are unnecessary. Keep skill-loading, reference, asset-sourcing, and phase-execution ledgers so users do not choose skills manually."
---

# Phaser Game Director

## Purpose

Own the end-to-end 2D game outcome. Build the playable loop, route through the right phases, verify evidence, and do not call prototype-quality work premium.

## Claude Compatibility Rule

Claude-style skill runners may invoke only this skill when the user runs `/phaser-game-director`. Do not claim other skills were invoked unless the runner actually invoked them. For broad work, you must still try to load the sibling public `SKILL.md` files with filesystem read tools before planning or editing, then load each phase's required reference files before that phase starts. If a sibling `SKILL.md` cannot be loaded, then use `references/director-phase-os.md` as the fallback for that phase and record the failure.

## Mandatory Sibling Skill Loading

For complete, premium, polished, high-fidelity, showcase, from-scratch, upgrade, or release-ready 2D game work, load these sibling skill files before implementation:

- `phaser-gameplay-systems/SKILL.md`
- `phaser-2d-graphics-builder/SKILL.md`
- `threejs-game-ui-designer/SKILL.md`
- `phaser-debug-profiler/SKILL.md`
- `phaser-qa-release/SKILL.md`

For premium, high-fidelity, showcase, complete, release-ready, or "less basic" 2D game work, load this skill when the game includes or should include concept/reference images, sprite sheet art, texture references, backgrounds, logos, marks, icons, decals, GUI art, title/menu art, or 2D images for concept workflows. Do this before deciding those assets are not needed:

- `threejs-image-generator/SKILL.md`

For premium, high-fidelity, showcase, complete, release-ready, or "less basic" 2D game work, load this skill when the game includes or should include SFX, ambience, UI sounds, interaction audio, announcer/dialogue, scratch-performance voice conversion, or audio cleanup. Do this before deciding generated audio is not needed:

- `threejs-audio-generator/SKILL.md`

Try paths in this order:

1. Sibling installed path: `../<skill-name>/SKILL.md`
2. Claude default path: `~/.claude/skills/<skill-name>/SKILL.md`
3. Codex default path: `~/.codex/skills/<skill-name>/SKILL.md`
4. General agents path: `~/.agents/skills/<skill-name>/SKILL.md`
5. Repository source path: `plugins/skills/<skill-name>/SKILL.md`

For narrow director-invoked work, load the directly relevant sibling skill and `phaser-qa-release`. For broad game creation or premium iteration, load all five. Do not skip sibling loading just because this director contains a summarized phase OS.

## External Asset Sourcing Gate

Do not decide "image generator not needed" or "audio generator not needed" before loading the relevant skill files when the trigger categories are present.

Before claiming an API key is unavailable, run the credential probe and paste its literal output in the report:

```bash
bash <director-skill-dir>/scripts/probe_asset_credentials.sh
```

Expected output shape:

```text
TRIPO_API_KEY=SET|MISSING
GEMINI_API_KEY=SET|MISSING
ELEVENLABS_API_KEY=SET|MISSING
```

The probe sources the user's shell profiles and prints only SET/MISSING markers, never secret values. `key unavailable` is not a valid skip reason unless this probe output is shown.

## Ledgers

Track three ledgers for every broad or premium game request:

### Skill-Loading Ledger

```text
Sibling skill files loaded:
- Phaser gameplay systems: yes/no, path or reason:
- Phaser 2D graphics: yes/no, path or reason:
- UI designer: yes/no, path or reason:
- Phaser debug/profile: yes/no, path or reason:
- Phaser QA/release: yes/no, path or reason:
- Image generator: yes/no/not-needed, path or reason:
- Audio generator: yes/no/not-needed, path or reason:
```

### Reference Ledger

```text
Required references loaded:
- gameplay-workflows: yes/no, path:
- physics-engine-selection: yes/no, path or reason not needed:
- new-game-definition-of-done: yes/no, path:
- <genre> premium checklist: yes/no, path or reason not loaded:
- 2d-visual-scorecard: yes/no, path:
- implementation-blueprint: yes/no, path:
- ui-patterns: yes/no, path:
- debug-profile-checklists: yes/no, path:
- qa-release-checklists: yes/no, path:
```

### Phase Execution Ledger

```text
Phases executed:
1. Discovery/contract: done/skipped, evidence:
2. Gameplay systems: done/skipped, evidence:
3. Asset sourcing: done/skipped, evidence:
4. 2D graphics: done/skipped, evidence:
5. UI: done/skipped, evidence:
6. Debug/profile: done/skipped, evidence:
7. QA/release: done/skipped, evidence:
```

## Phase Routing

Route phases to the appropriate specialist skills:

| Phase | Specialist Skill |
|---|---|
| Discovery & playable contract | `phaser-game-director` (this skill) |
| Gameplay systems | `phaser-gameplay-systems` |
| External asset sourcing | `threejs-image-generator`, `threejs-audio-generator` |
| 2D graphics | `phaser-2d-graphics-builder` |
| UI | `threejs-game-ui-designer` |
| Debug & profile | `phaser-debug-profiler` |
| QA & release | `phaser-qa-release` |

## Premium Completion Rule

For premium/showcase 2D game claims, all of these must be true:

- Skill-loading ledger + reference ledger present
- External asset sourcing ledger present (when trigger surfaces exist)
- Credential probe output + external output/blocker evidence present
- Playable loop works through real input
- Active-play screenshots for desktop + mobile
- 2D visual scorecard: no category below 2, average >= 2.3
- HUD/menu states readable and responsive
- At least one high-value visual surface has external asset evidence (image generator output path, sprite sheet, or documented hybrid chain)

## Required Verification

For broad/premium work, verify before claiming done:

- `npm run build` passes
- Local browser run with console/page error check
- Playwright screenshot captured
- Canvas nonblank pixel check via `inspect-phaser-canvas.mjs`
- Desktop + mobile viewport screenshots
- Main input path tested through real interaction
- Performance snapshot: body count, sprite count, scene object count
- UI text-fit, overlap, safe-area, and touch-target check when UI changed

## Final Response

Report the skill-loading ledger, reference ledger, asset sourcing ledger (when applicable), phase execution ledger, 2D visual scorecard (before/after when graphics changed), controls, verified behavior, changed files, and remaining gaps.
