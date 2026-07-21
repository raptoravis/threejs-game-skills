# Director Phase Playbook (Babylon.js)

The canonical phase specification for `babylon-game-director`. Load this file at planning time for broad work. When a sibling skill file is loaded, that sibling owns its phase's workflow and this file supplies phase entry/exit evidence, ledger templates, and gate details. When a sibling `SKILL.md` cannot be loaded, the matching phase section here is the fallback procedure — record the missing path and reason in the ledger; the fallback is never a reason to skip attempting sibling loading first.

Path resolution for every file named here uses the Skill Path Ladder in `babylon-game-director/SKILL.md`.

## Non-Negotiable Rules

- Do not claim another skill was invoked unless the runner actually invoked it; "loaded" means its file was read into context.
- Broad 3D game builds start with a compact game design brief, core loop contract, and level/encounter plan before implementation.
- Load each phase's required reference files at phase entry, not at final judgment. A phase cannot be `done` if its required references were skipped.
- Record an external asset sourcing ledger before the graphics phase; run the credential probe before claiming any generator key is unavailable.
- Premium graphics phases include a readability and VFX pass, not only visual polish.
- QA phases decide whether a visual test harness is warranted and report added/extended/skipped evidence.
- A broad request is not complete at first playable slice when the user asked for premium, AAA, polished, showcase, complete, release-ready, or "less basic".
- Prefer a small authored vertical slice over a larger placeholder scene. Treat generic primitives, flat plane arenas, default-texture HUDs, and unchecked post-processing as prototype placeholders.
- Verify through browser evidence before calling the game done.

## Ledger Templates

Compaction rule (from `SKILL.md`): report every row with meaningful state; collapse consecutive `not-needed` rows into one line naming them.

```text
Skill-loading ledger:
- Director: active
- Babylon gameplay systems: yes/no, path or reason:
- Babylon AAA graphics: yes/no, path or reason:
- UI: yes/no, path or reason:
- Babylon debug/profile: yes/no, path or reason:
- Babylon QA/release: yes/no, path or reason:
- 3D generator: yes/no/not-needed, path or reason:
- Image generator: yes/no/not-needed, path or reason:
- Audio generator: yes/no/not-needed, path or reason:

External asset sourcing ledger:
- Credential probe output:
- Hero/player source:
- Enemies/bosses source:
- Signature props/pickups source:
- World/environment source:
- Sky/background source:
- Logos/icons/GUI art source:
- Audio/SFX/voice source:
- Chosen sources per surface: procedural / threejs-3d-generator / babylon-image-generator / hybrid
- 3D assets generated: yes/no, outputs (task IDs / file paths) or skip reason:
- Image assets generated: yes/no, outputs or skip reason:
- Audio assets generated: yes/no/not-needed, outputs or skip reason:

Reference ledger: one yes/no/not-needed row with path or reason per required
reference that applies to the task (see Required References below).

Phase ledger:
- Gameplay systems: pending/running/done/skipped - evidence:
- External asset sourcing: pending/running/done/skipped - evidence:
- AAA graphics: pending/running/done/skipped - evidence:
- UI: pending/running/done/skipped - evidence:
- Debug/profile: pending/running/done/skipped - evidence:
- QA/release: pending/running/done/skipped - evidence:
```

Mark a phase `done` only after implementation plus verification evidence. If a phase is skipped, state why it is out of scope or blocked.

## Required References

Load these files before the matching phase starts:

- Gameplay systems: `babylon-gameplay-systems/references/gameplay-workflows.md`
- Game design and level design: `babylon-gameplay-systems/references/game-design-level-design.md`
- Physics selection: `babylon-gameplay-systems/references/physics-engine-selection.md`
- Game feel: `babylon-gameplay-systems/references/game-feel.md`
- AAA graphics: `babylon-aaa-graphics-builder/references/visual-scorecard.md`, `references/implementation-blueprint.md`, `references/model-recipes.md`
- Node Material/shaders: `babylon-aaa-graphics-builder/references/node-material-recipes.md`
- PBR/rendering: `babylon-aaa-graphics-builder/references/pbr-recipes.md`
- Technical art: `babylon-aaa-graphics-builder/references/technical-art.md`
- UI: `threejs-game-ui-designer/references/ui-patterns.md` + `babylon-game-ui-designer/references/babylon-gui-patterns.md`
- Debug/profile: `babylon-debug-profiler/references/debug-profile-checklists.md`
- QA/release: `babylon-qa-release/references/qa-release-checklists.md`
- 3D generator: `threejs-3d-generator/references/api-notes.md`
- Image generator: `threejs-image-generator/SKILL.md`
- Audio generator: `threejs-audio-generator/SKILL.md`

## Phase Gates

### Discovery / Gameplay
Entry: user request. Exit: playable loop, design brief, core loop contract, level/encounter plan, game feel tuned, verified by build + browser + screenshot. First playable slice must control correctly.

### External Asset Sourcing
Entry: credential probe + generator SKILL.md loaded. Exit: per-surface source decision recorded, task IDs or real blocker evidence for hero surfaces, ledger filled.

### AAA Graphics
Entry: active-play screenshot, visual scorecard baseline. Exit: every visible surface upgraded through form→material→lighting→post chain, scorecard filled with >=2 in every category.

### UI
Entry: HUD/menu layout needed. Exit: readable UI at desktop + mobile, safe areas respected, touch targets sized.

### Debug/Profile
Entry: bugs or performance concern. Exit: root causes fixed or bottlenecks improved with before/after evidence.

### QA/Release
Entry: game playable. Exit: production build tested, canvas verified, visual harness decision, release notes.

## Completion Gate

All phases `done` or `skipped` with reason. Ledgers reported. Scorecard >= 2 all categories. Report audited. Premium = every surface category >= 2 and average >= 2.3.
