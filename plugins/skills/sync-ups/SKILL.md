---
name: sync-ups
description: "Sync this fork forward from the upstream threejs-game-skills repo (majidmanzarpour/threejs-game-skills). Pulls newly added skills and modifications to existing skills into plugins/skills/, preserves local-only skills (Phaser, genre checklists), records a content baseline so the next run syncs only the upstream diff. Use for 'sync upstream', 'pull upstream changes', 'update from upstream'."
---

# Sync Upstream (sync-ups)

## Purpose

Keep this fork up to date with the upstream Three.js game-skills repo without
clobbering the fork's own work. The fork differs from upstream in three ways
that make an ordinary `git merge` impossible:

1. **No shared git history** — this is a re-host, not a git fork.
2. **Different layout** — upstream keeps skills at `skills/`; this fork keeps
   them at `plugins/skills/`.
3. **Local-only content** — the fork adds 5 Phaser skills, genre/Phaser premium
   checklists, a `plugins/` wrapper, `install.ps1`, etc. These must survive
   every sync untouched.

So the sync is **content-based and path-mapped**, driven by a baseline manifest
that records exactly which upstream files were synced and at which commit.

## What gets synced

- **New skills** added upstream → copied into `plugins/skills/`.
- **New files inside existing skills** (new references, scripts, assets) → copied in.
- **Modifications to upstream-tracked files** → upstream wins, the local copy is
  overwritten. The report lists every overwritten file so local edits are
  visible (see "Local edits" below).
- **Deletions** upstream made → the matching local copy is removed.

## What is never touched

- Any file that does not exist upstream — the entire Phaser skill set, the
  genre/Phaser premium checklists, `plugins/AGENTS.md`, `install.ps1`,
  `.codex-plugin/`, `.opencode/`, `plugins/.claude-plugin/`, and this skill
  itself. The engine only ever writes paths that exist in the upstream tree, so
  local-only files are structurally safe.
- Root-level shared files (`README.md`, `install.sh`, `package.json`, `scripts/`,
  upstream `AGENTS.md`). The fork has customized these; they are out of scope for
  automatic sync. Review their upstream diff manually if needed.

## Phaser & genre mirror relationship (manual follow-up)

The fork's Phaser skills and genre checklists are **2D mirrors** of the Three.js
skills — they were originally authored against the Three.js versions. Upstream
has no Phaser content, so `sync_upstream.py` will never touch them; but when a
Three.js skill gains a new pattern, the Phaser mirror should be hand-updated to
match. This follow-up is manual and is the one piece of work the script cannot
do for you.

### Mirror map

| Phaser / local-only | Mirrors (Three.js) |
|---|---|
| `phaser-game-director` | `threejs-game-director` |
| `phaser-gameplay-systems` | `threejs-gameplay-systems` |
| `phaser-2d-graphics-builder` | `threejs-aaa-graphics-builder` |
| `phaser-debug-profiler` | `threejs-debug-profiler` |
| `phaser-qa-release` | `threejs-qa-release` |
| `threejs-gameplay-systems/.../checklists/<genre>-premium-quality.md` (13 local-only 3D genres) | `endless-runner-premium-quality.md` + `game-feel.md` / `game-design-level-design.md` |
| `phaser-gameplay-systems/.../checklists/<genre>-2d-premium-quality.md` (6 local-only 2D genre checklists: card-game-2d, platformer-2d, rpg-2d, rts-2d, tower-defense-2d, plus bullet-hell-premium-quality.md which has no `-2d-` infix) | same, in 2D form |

UI: Phaser reuses `threejs-game-ui-designer` (no Phaser UI skill). Generators:
Phaser reuses `threejs-image-generator` + `threejs-audio-generator` (no 3D).

### After each upstream sync, run this mirror follow-up

After `--apply`, use the report's MODIFY/ADD buckets as the work list. For each
Three.js skill that changed, diff it against its Phaser mirror and port
**patterns**, not content:

1. **SKILL.md path resolution** — `<this-skill-dir>` placeholder + Skill Path
   Ladder (5 levels, with `plugins/skills/<skill>` as the repo-source rung).
2. **Director architecture** — Runner Capability Check, Sibling Skill Loading,
   Reference Gate, the 4-ledger model, and `phase-playbook.md` naming.
3. **Reference loading gates** — any new `Load references/<file>.md before...`
   line in a Three.js SKILL.md → add the 2D-equivalent gate, and create the 2D
   reference file if it does not exist (translate 3D examples to Phaser/2D).
4. **Genre checklists** — ensure every local-only genre checklist still covers
   the universal cross-cutting sections the Three.js genre checklists expect
   (Performance, Mobile, Playtest, Accessibility, Audio, HUD).
5. **Scripts** — `probe_asset_credentials.sh` is engine-agnostic: keep it
   byte-identical with the Three.js version. `audit_reference_report.py` mirrors
   the Three.js structure but uses the 2D scorecard categories and image/audio
   (not 3D) markers. `inspect-phaser-canvas.mjs` mirrors the pixel-metrics block
   of `inspect-threejs-canvas.mjs`.

Always preserve Phaser/2D-specific content (Matter.js/Arcade, scene lifecycle,
FIT scaling, sprite/tilemap/parallax, texture atlases, object pooling). Port the
*pattern*; rewrite for 2D.

## How to run

All commands run from the repo root.

```bash
# 1) Dry-run: show the plan, change nothing. ALWAYS start here.
python plugins/skills/sync-ups/scripts/sync_upstream.py --status

# 2) Apply the upstream diff since the last baseline (normal incremental sync).
python plugins/skills/sync-ups/scripts/sync_upstream.py --apply

# 3) First run, or forced full re-sync: treat the manifest as empty and
#    reconcile every upstream file, then rewrite the baseline.
#    Preview the full reconcile first with --reconcile --status (no writes).
python plugins/skills/sync-ups/scripts/sync_upstream.py --reconcile --status
python plugins/skills/sync-ups/scripts/sync_upstream.py --reconcile --apply

# 4) After a manual sync: record current upstream HEAD as the baseline without
#    changing any files.
python plugins/skills/sync-ups/scripts/sync_upstream.py --reset-baseline
```

The script never commits. After `--apply`, review `git status` / `git diff` and
commit only when ready.

## Baseline

`plugins/skills/sync-ups/baseline.json` records:

- `upstream_sha` / `upstream_short` — the upstream commit synced
- `synced_at` — when
- `manifest` — `{ upstream_path: sha256_content_hash }` for every synced file

On the next run the engine fetches upstream, enumerates the current skill tree,
and diffs it against the manifest:

| upstream vs manifest | bucket  | action                         |
|----------------------|---------|--------------------------------|
| in upstream, not in manifest | ADD    | write to `plugins/skills/...`           |
| in both, hash differs       | MODIFY | overwrite local (upstream wins)        |
| in manifest, gone upstream, near-identical new file | RENAME | rename local, overwrite content |
| in manifest, gone upstream, no match | DELETE | remove local copy               |
| in both, hash equal         | SAME   | nothing                                 |

## Operator checklist (run this every time)

1. **Start with `--status`.** Read the SYNC REPORT.
2. **Scan "LOCAL EDITS OVERWRITTEN".** If a file there had local edits you need
   to keep, copy them aside from `git` before applying — upstream will overwrite
   them. (This bucket is empty on a clean first-run reconcile.)
3. **Scan "REVIEW: possible renames / duplicates".** This fires whenever a
   directory has both an upstream-only and a local-only file. Most are legitimate
   (e.g. upstream adds `game-feel.md` while the fork adds genre checklists in the
   same folder). But a true upstream rename shows up here too — see below.
4. **Apply** (`--apply`, or `--reconcile --apply` on first run).
5. **Resolve rename ripples** the engine cannot auto-fix (see below).
6. **Verify**: `git status`, spot-check a modified `SKILL.md`, optionally run the
   plugin's install/audit scripts if a synced script changed.
7. **Commit** when ready. The baseline is updated by the script as part of apply.

## Rename handling (the one manual step)

Git rename detection across the upstream/fork void is heuristic. When upstream
renames a file (e.g. `director-phase-os.md` → `phase-playbook.md`):

- The engine adds the new file (`phase-playbook.md`) and leaves the old local
  copy (`director-phase-os.md`) in place — it is local-only from the engine's
  view, so it will not delete it.
- The "REVIEW" section flags the pair.
- After confirming it is a rename (the upstream SKILL.md now references the new
  name), the operator:
  1. `git rm` the old file,
  2. updates any **local-only** files that still reference the old name
     (the synced SKILL.md self-corrects, but local-only skills like
     `phaser-game-director/SKILL.md` and docs do not),
  3. greps the repo for the old filename to catch every dangling reference:

     ```bash
     grep -rln "director-phase-os" --include="*.md" --include="*.yaml" .
     ```

On later incremental runs, if upstream renames again, the engine will detect it
from the manifest (the old path vanishes, a near-identical new path appears) and
perform the rename automatically.

## Troubleshooting

- **`git fetch` fails / wrong URL** — the script ensures the `upstream` remote
  exists and points at `https://github.com/majidmanzarpour/threejs-game-skills.git`.
  Re-run; it self-heals.
- **Want to re-sync everything from scratch** — delete `baseline.json` (or pass
  `--reconcile`) and run `--reconcile --apply`.
- **Upstream added a whole new skill** — it just appears under ADD and is copied
  into `plugins/skills/`. Add it to the engine routing in `plugins/AGENTS.md` if
  it changes how requests should be routed.
- **A synced script fails after update** — the upstream version is now source of
  truth; adapt local wrappers, do not revert the skill.

## See also

- `references/sync-methodology.md` — the three-way model, path mapping, and
  conflict rules in detail.
- `baseline.json` — the recorded baseline (written by the script).
