# Director Phase OS (Phaser 2D)

Use this reference only after `phaser-game-director` has attempted to load the relevant sibling public skill files and one or more files were unavailable. This file is the fallback operating system, not a reason to skip sibling skill loading.

## Non-Negotiable Rules

- Do not claim another public skill was invoked unless its `SKILL.md` was actually loaded or the runner explicitly invoked it.
- For broad 2D game work, try to load all five sibling public skill files before implementation: gameplay systems, 2D graphics, UI designer, debug profiler, and QA release.
- When external 2D assets would help, also try to load `threejs-image-generator`; when SFX/ambience/voice would help, also try to load `threejs-audio-generator`.
- Before claiming a missing generator credential, run the director credential probe and paste the literal SET/MISSING output.
- Record an external asset sourcing ledger before the graphics phase.
- Record sibling skill loading paths or failure reasons in the ledger.
- Load each phase's required reference files at phase entry. Do not defer references.
- A phase cannot be marked `done` if its required references were skipped.
- A broad game request is not complete after a first playable slice when the user asked for premium, polished, showcase, or "less basic".
- Keep an execution ledger with phases, evidence, skipped work, and blockers.

## Phases

### Phase 1: Discovery And Playable Contract

Inspect project, state the one-sentence playable loop, initialize ledgers.

Exit evidence: folder structure, scripts, dependencies known. Loop stated in one sentence. Ledgers initialized.

### Phase 2: Gameplay Systems

Build or repair the playable loop. Use Phaser scene lifecycle. Matter.js physics for collision.

Required references: `phaser-gameplay-systems/references/gameplay-workflows.md`, `phaser-gameplay-systems/references/physics-engine-selection.md`, `phaser-gameplay-systems/references/checklists/new-game-definition-of-done.md`, and the genre-specific premium checklist.

Exit evidence: Build passes. Browser shows nonblank canvas. Controls work. Objective progresses. Fail/retry exists.

### Phase 3: External Asset Sourcing

Before the graphics phase, run credential probe, fill asset sourcing ledger.

Required references: `threejs-image-generator/references/...` (if loaded), `threejs-audio-generator/references/audio-workflows.md` (if loaded).

Exit evidence: Credential probe output. Asset sourcing ledger filled. External outputs or blocker evidence present.

### Phase 4: 2D Graphics

Score active-play screenshots, upgrade sprites/tilemaps/particles/palette.

Required references: `phaser-2d-graphics-builder/references/visual-scorecard.md`, `phaser-2d-graphics-builder/references/implementation-blueprint.md`, `phaser-2d-graphics-builder/references/sprite-recipes.md`.

Exit evidence: Before/after 2D visual scorecard (10 categories). No category below 2 for premium. Desktop + mobile screenshots. Render diagnostics.

### Phase 5: UI

Polish HUD, menus, overlays. Verify responsive fit and touch targets.

Required references: `threejs-game-ui-designer/references/ui-patterns.md`, game UI quality checklists.

Exit evidence: Desktop + mobile screenshots with UI visible. Text-fit/overlap check. Touch target check.

### Phase 6: Debug And Profile

Fix blank canvas, broken input, performance regressions.

Required references: `phaser-debug-profiler/references/debug-profile-checklists.md`.

Exit evidence: Root cause stated. Baseline/post metrics. Broken path retested.

### Phase 7: QA And Release

Final verification: build, screenshots, canvas pixels, main path, release notes.

Required references: `phaser-qa-release/references/qa-release-checklists.md`.

Exit evidence: Build/typecheck passes. Screenshots + canvas pixel check. Main path triggered. HUD verified. Release notes.
