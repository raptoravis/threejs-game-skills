# Director Phase Playbook (Phaser 2D)

The canonical phase specification for `phaser-game-director`. Load this file at planning time for broad work. When a sibling skill file is loaded, that sibling owns its phase's workflow and this file supplies phase entry/exit evidence, ledger templates, and gate details. When a sibling `SKILL.md` cannot be loaded, the matching phase section here is the fallback procedure — record the missing path and reason in the ledger; the fallback is never a reason to skip attempting sibling loading first.

Path resolution for every file named here uses the Skill Path Ladder in `phaser-game-director/SKILL.md`.

## Non-Negotiable Rules

- Do not claim another skill was invoked unless the runner actually invoked it; "loaded" means its file was read into context.
- Broad 2D game builds start with a compact game design brief, core loop contract, and level/encounter plan before implementation.
- Load each phase's required reference files at phase entry, not at final judgment. A phase cannot be `done` if its required references were skipped.
- Record an external asset sourcing ledger before the graphics phase; run the credential probe before claiming any generator key is unavailable.
- Premium graphics phases include a readability and palette/animation pass, not only visual polish.
- QA phases decide whether a visual test harness is warranted and report added/extended/skipped evidence.
- A broad request is not complete at first playable slice when the user asked for premium, polished, showcase, complete, release-ready, or "less basic".
- Prefer a small authored vertical slice over a larger placeholder scene. Treat generic rectangle/circle sprites, flat single-layer backgrounds, default text HUDs, and unchecked particle clutter as prototype placeholders.
- Verify through browser evidence before calling the game done.

## Ledger Templates

Compaction rule (from `SKILL.md`): report every row with meaningful state; collapse consecutive `not-needed` rows into one line naming them.

```text
Skill-loading ledger:
- Director: active
- Phaser gameplay systems: yes/no, path or reason:
- Phaser 2D graphics: yes/no, path or reason:
- UI: yes/no, path or reason:
- Phaser debug/profile: yes/no, path or reason:
- Phaser QA/release: yes/no, path or reason:
- Image generator: yes/no/not-needed, path or reason:
- Audio generator: yes/no/not-needed, path or reason:

External asset sourcing ledger:
- Credential probe output:
- Hero/player sprite source:
- Enemies/hazards source:
- Signature props/pickups source:
- Background/parallax/tileset source:
- Particle/VFX source:
- Logos/icons/GUI art source:
- Audio/SFX/voice source:
- Chosen sources per surface: procedural / threejs-image-generator / threejs-audio-generator / hybrid
- Image assets generated: yes/no, outputs (task IDs / file paths) or skip reason:
- Audio assets generated: yes/no/not-needed, outputs or skip reason:

Reference ledger: one yes/no/not-needed row with path or reason per required
reference that applies to the task (see Required References below).

Phase ledger:
- Gameplay systems: pending/running/done/skipped - evidence:
- External asset sourcing: pending/running/done/skipped - evidence:
- 2D graphics: pending/running/done/skipped - evidence:
- UI: pending/running/done/skipped - evidence:
- Debug/profile: pending/running/done/skipped - evidence:
- QA/release: pending/running/done/skipped - evidence:
```

Mark a phase `done` only after implementation plus verification evidence. If a phase is skipped, state why it is out of scope or blocked.

## Allowed External-Generation Skip Reasons

After the relevant generator skills are loaded, actual external generation may be skipped only when:

- The user explicitly requested no external AI/assets or offline-only output.
- Credential probe output shows the relevant key is `MISSING`.
- A real API/network/quota error occurs after an attempted generation command; include the command and error summary.
- The surface is a repeated low-value sprite better handled by object pooling/procedural tiles.
- A non-hero repeated/support surface already scores 2+ and the ledger explains why external generation would not improve the active screenshot.

Do not write `not-needed` for a generator skill before loading it when trigger surfaces are present. The hero-surface evidence rule is in `phaser-game-director/SKILL.md` (External Asset Sourcing Gate).

## Required References

Load these files before the matching phase starts:

- Gameplay systems: `phaser-gameplay-systems/references/gameplay-workflows.md`
- Game design and level design, for broad new-game creation, major gameplay upgrades, level/wave/encounter work, progression/difficulty work, or premium gameplay claims: `phaser-gameplay-systems/references/game-design-level-design.md`
- Game feel, for feel/juice/impact tuning or any premium/polished gameplay claim: `phaser-gameplay-systems/references/game-feel.md`
- Physics selection, when physics/collision-heavy gameplay is in scope (Matter.js vs Arcade): `phaser-gameplay-systems/references/physics-engine-selection.md`
- New-game checklist, when creating a game or first playable slice: `phaser-gameplay-systems/references/checklists/new-game-definition-of-done.md`
- Game design and level design checklist, when creating a game, upgrading major gameplay, designing levels/encounters, or claiming premium gameplay: `phaser-gameplay-systems/references/checklists/game-design-level-design.md`
- Game feel checklist, when tuning feel or claiming premium gameplay: `phaser-gameplay-systems/references/checklists/game-feel.md`
- Genre premium checklist matching the game, when building or upgrading a genre title: the matching `phaser-gameplay-systems/references/checklists/<genre>-premium-quality.md` (2D platformer, 2D RPG, tower defense, card game, bullet hell, RTS) or the 3D genre checklists under `threejs-gameplay-systems/references/checklists/` when the project is 3D
- 2D graphics, for any graphics phase: `phaser-2d-graphics-builder/references/visual-scorecard.md`, `phaser-2d-graphics-builder/references/implementation-blueprint.md`, `phaser-2d-graphics-builder/references/sprite-recipes.md`, and `phaser-2d-graphics-builder/references/tilemap-recipes.md`
- Particle/VFX cookbook, for premium/showcase graphics or custom particle/feedback work: `phaser-2d-graphics-builder/references/particle-recipes.md`
- UI: `threejs-game-ui-designer/references/ui-patterns.md`
- UI checklists, when UI/HUD/menu/touch layout is in scope: `threejs-game-ui-designer/references/checklists/game-ui-quality.md`, `threejs-game-ui-designer/references/checklists/hud-readability.md`, and `threejs-game-ui-designer/references/checklists/responsive-ui-fit.md`
- Debug/profile: `phaser-debug-profiler/references/debug-profile-checklists.md`
- QA/release: `phaser-qa-release/references/qa-release-checklists.md`, plus for final verification `threejs-qa-release/references/checklists/visual-verification.md`, `threejs-qa-release/references/checklists/playtest-qa.md`, and `threejs-qa-release/references/checklists/release.md` (shared with the Three.js QA skill)
- Image generator, when loaded by the external asset sourcing gate: `threejs-image-generator/references/image-generator-workflows.md` (resolved through the path ladder; the Phaser director reuses the Three.js image generator)
- Audio generator, when loaded for a game: `threejs-audio-generator/references/audio-workflows.md`

Prompt templates are packaged in `references/prompt-templates.md` under the director and relevant sibling skills. Load them only when the user asks for a reusable prompt or task template.

## Phase 1: Discovery And Playable Contract

- Inspect package scripts, dependencies, app structure, Phaser game config, ScaleManager mode, scene list and lifecycle (Boot/Preload/Menu/Game/UI), input, camera, UI, diagnostics, and existing screenshots.
- Define the design brief: player promise, target feeling, primary verb, objective, pressure, reward/progression, fail/retry, skill expression, and non-goals.
- Define the core loop contract: player verb, objective, pressure, reward, fail state, restart.
- Define the first level/encounter plan: spatial format, player start, first decision, first threat, first reward, landmarks, escalation, recovery beats, and readability.
- Define target devices and performance budget. If absent, assume desktop plus mobile browser and FIT scaling with safe-area handling.
- Identify the highest-risk surfaces: blank/broken canvas, no playable loop, weak controls, basic sprite art, unreadable UI, or unverified release.

Exit evidence: current scripts/dependencies known; game design brief, core loop contract, and level/encounter plan stated; phase ledger initialized.

For a new project, use the gameplay skill's packaged scaffold creator:

```bash
python3 <phaser-gameplay-systems-skill-dir>/scripts/create_phaser_game.py ./my-game
```

## Phase 2: Gameplay Systems

Build or repair the playable loop before visual depth.

- Add Phaser game config, scene lifecycle (Boot → Preload → Menu → Game → UI), update loop, input intents, state machine, entities, collision or physics, scoring/progression, fail/retry, HUD state, audio/VFX hooks, and diagnostics.
- Implement from the design brief and level/encounter plan. Do not bolt mechanics onto a static scene after the fact. If the level/wave/arena is decorative rather than decision-shaping, return to the plan before adding art.
- If the game is physics-heavy, load the physics selection reference and choose explicitly: Matter.js for simulated rigid bodies/sensors, Arcade for authored AABB/circle overlap feel; turn on debug render during tuning.
- Keep ownership boundaries clear: `core`, `scenes`, `entities`, `systems`, `assets`, `ui`, `tests`.
- Tune movement, camera, acceleration, cooldowns, difficulty, and restart through short play loops. Apply the game-feel reference (hitstop, screenshake, easing, impact feedback, squash/stretch) for premium/polished gameplay claims.
- Use object pooling for frequently created/destroyed objects (enemies, projectiles, particles); avoid per-frame texture allocations and duplicate state in hot paths.

Exit evidence: build/typecheck passes; browser opens with nonblank canvas; main control path changes state; objective or score progresses; fail/retry path exists when relevant; game design/level checklist outcome reported for broad builds; game-feel checklist outcome reported for premium gameplay claims; physics engine choice, body/sensor counts, debug render state, and restart cleanup reported when physics is in scope; new-game checklist outcome reported for new games.

## Phase 3: External Asset Sourcing

Run before the premium graphics pass when trigger surfaces exist.

- Run the credential probe and paste output.
- Load `threejs-image-generator` and/or `threejs-audio-generator` when their trigger surfaces exist, plus their required references.
- Decide source per high-value surface: procedural / threejs-image-generator / threejs-audio-generator / hybrid.
- Generate at least one high-value external output for premium hero surfaces unless the probe or an attempted generation shows a real blocker.
- Record task IDs, downloaded sprite/tileset/background/audio output paths, or blocker evidence.

Exit evidence: credential probe output; generator rows in the skill-loading and reference ledgers; filled asset sourcing ledger; external outputs or blocker evidence.

## Phase 4: 2D Graphics

Use when screenshots look basic or the user asks for premium quality.

- Score active-play screenshots across the 2D visual scorecard categories before and after.
- Add production 2D graphics architecture: sprite sheet / texture atlas pipeline, tilemap system, palette, particle system, parallax layers, animation state, diagnostics.
- Upgrade all visible surfaces, not only the player: hero sprite, hazards, rewards, ground/tiles, foreground props, background/parallax layers, interactable telegraphs, palette variation, and state VFX.
- Replace generic shapes with authored sprites; use texture atlases to minimize draw calls; avoid loading many individual sprite images.
- Use the generator skills per the asset sourcing ledger; complete Phase 3 before deciding procedural shapes are enough.

Exit evidence: before/after 2D scorecard with all categories, average, and automatic failures remaining; measured evidence from canvas-inspector metrics (sprite count, body count, draw calls, pixel statistics) cited for the categories they support; active desktop and mobile screenshots; no scorecard category below 2 for premium claims.

## Phase 5: UI

Use when HUD/menu/interface craft affects quality or readability.

- Inventory gameplay, pause, settings, fail/retry, milestone/win, loading/error, and touch states.
- Replace utility stat-card grids with game-specific meters, compact clusters, icons, badges, alerts, cooldown rings, diegetic labels, and stateful overlays.
- Use stable dimensions, safe-area padding, fixed-width numeric fields, text fit, and responsive constraints. Prefer a parallel UI Scene for DOM-independent HUD.
- Wire UI to game state; avoid duplicated game rules inside UI code. UI must never block the player, threats, pickups, next decision, or critical touch controls.

Exit evidence: desktop and mobile screenshots for relevant states; text-fit and overlap check; touch target and safe-area check when mobile is in scope; UI checklist outcomes.

## Phase 6: Debug And Profile

Use whenever the canvas is blank/broken, interaction fails, mobile behavior breaks, or visual changes add cost.

- Reproduce locally and read console/page/network errors.
- Check Phaser game config, ScaleManager mode, canvas CSS vs drawing-buffer size, scene lifecycle order, preload completeness, input, camera, physics world setup, transforms, and resize behavior.
- For performance, measure production preview where possible: FPS/frame time, sprite count, physics body count, scene object count, draw calls, texture memory, bundle, and expensive particle systems.
- Optimize one bottleneck at a time using object pooling, texture atlases, shared resources, culling, fewer emitters, adaptive scale, and explicit destruction.

Exit evidence: root cause or measured bottleneck stated; baseline/post metrics when optimizing; broken path retested.

## Phase 7: QA And Release

Use before calling broad work complete.

- Run build/typecheck; start dev or preview server; check console/page/network errors.
- Capture active desktop and mobile screenshots; sample canvas pixels for nonblank and varied output using the generated game's `npm run inspect:canvas` or:

```bash
node <phaser-qa-release-skill-dir>/scripts/inspect-phaser-canvas.mjs --url http://127.0.0.1:5288
```

- Trigger main input, objective progression, fail/retry, and recent risky paths.
- Verify HUD text fit, safe areas, touch targets, resize, and mobile input.
- Decide whether to add or extend a visual test harness (Playwright screenshot baselines with deterministic test hooks); report added/extended/skipped.
- Run the bot playtest for release-ready gameplay claims; report time-to-first-fail, progression, and softlock evidence.
- For premium claims, run the fresh-eyes 2D scorecard review per `phaser-2d-graphics-builder/references/visual-scorecard.md`.
- For release, verify production preview, base path, static assets, debug gating, bundle/large assets, and deployment assumptions.

Exit evidence: commands run with pass/fail; URL used; screenshot/artifact paths; inspector metrics JSON; visual test harness decision with states covered, thresholds, and flake risks; bot playtest results when run; issues fixed or listed with owners; residual risks.

## Completion Gate

For premium/showcase claims, all of these must be true:

- Skill-loading, reference, and external asset sourcing ledgers are present.
- Credential probe output plus external output evidence or blocker evidence is present for premium asset-category claims.
- Playable loop works through real input; game design brief, core loop contract, and level/encounter plan are reported for broad builds.
- Active-play screenshots exist for desktop and mobile.
- 2D visual scorecard uses the authored rubric, cites measured evidence, has no category below 2, and averages at least 2.3.
- A fresh-eyes review pass confirmed or corrected the scorecard (subagent review, or the adversarial self-review fallback).
- HUD/menu states are readable and responsive.
- Body count, sprite count, and scene-object diagnostics exist after graphics or physics changes.
- Visual test harness decision is reported; bot playtest evidence exists for release-ready gameplay claims.
- Build and browser QA passed or blockers are clearly reported.
- Physics-heavy games include engine choice (Matter.js/Arcade), body/sensor counts, debug render state, and restart cleanup evidence.

If any gate fails, continue iterating or report the exact blocker instead of calling the game premium.
