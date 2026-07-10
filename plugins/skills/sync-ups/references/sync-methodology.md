# Sync Methodology

Why the sync works the way it does, and the rules behind each decision.

## The three-way model

There are three parties:

| Party            | Location                              | Role                         |
|------------------|---------------------------------------|------------------------------|
| Upstream         | `majidmanzarpour/threejs-game-skills` | Source of truth for the 9 Three.js skills |
| Shared skills    | `plugins/skills/<threejs-*>` (local)  | Mirror of upstream; local is behind |
| Local-only       | `plugins/skills/<phaser-*>`, checklists, wrapper, `install.ps1`, this skill | Fork's own work; never synced |

The fork is a **re-host**: it copied upstream's skill content at some point, then
added its own skills and restructured into `plugins/`. There is **no common git
ancestor**, so `git merge` / `cherry-pick` cannot relate the two histories. The
only reliable signal is file content.

## Why upstream wins on the shared skills

Investigation at sync-skill creation time showed every differing shared file has
the upstream version **newer** (e.g. upstream migrated from hardcoded
`~/.claude/skills/...` paths to a `<this-skill-dir>` placeholder + a "Skill Path
Ladder", and hardened credential probes). The fork did not add meaningful content
to these files — it restructured layout and added Phaser skills. So for
upstream-tracked paths, upstream content is authoritative and overwriting local
is the correct direction.

If that ever changes (the fork starts intentionally editing a shared skill), the
"LOCAL EDITS OVERWRITTEN" report bucket makes the overwrite visible so the edit
can be re-applied or the file forked into a local-only name.

## Path mapping

```
upstream:  skills/<name>/<rest...>
local:     plugins/skills/<name>/<rest...>
```

Only the `skills/` → `plugins/skills/` prefix changes. Skill-internal paths are
identical, which is why upstream's `<this-skill-dir>` placeholder style is layout-
agnostic and survives the remap.

## Why a manifest baseline (not just a commit SHA)

A commit SHA alone tells us "where we synced to" but not "what we synced". The
manifest gives per-file state, which is what makes ADD/MODIFY/DELETE/RENAME
precise and rename-detection possible. On each run:

1. `git fetch upstream main`
2. enumerate upstream's `skills/` tree at the new HEAD
3. diff against the manifest
4. apply the four buckets with path mapping

A commit SHA is still recorded for human traceability and for `git log upstream`.

## Conflict rules

1. **Upstream-only + local-only in the same directory** → reported as REVIEW.
   Usually benign (independent additions). True upstream renames show here too;
   resolve by confirming the new name is referenced upstream and removing the
   old local file plus its references.
2. **Local edits to an upstream-tracked file** → reported as LOCAL EDITS
   OVERWRITTEN. Upstream still wins; the report exists so nothing is lost
   silently.
3. **Deletions upstream** → applied to the local copy, but only for paths the
   manifest confirms came from upstream. A local-only file is never deleted.

## What is deliberately out of scope

- **The Phaser skills and genre checklists.** They are local-only 2D mirrors of
  the Three.js skills (see the mirror map in `sync-ups/SKILL.md`). Upstream has
  no Phaser content, so they are never enumerated and never touched by the sync
  engine. They require a **manual mirror follow-up** after each upstream sync:
  when a Three.js skill gains a new pattern (path ladder, reference gate,
  director architecture, genre-checklist section), port that pattern into the
  Phaser mirror, rewriting for 2D. The script's MODIFY/ADD report is the work
  list for that pass.
- **Root shared files** (`README.md`, upstream `AGENTS.md`, `install.sh`,
  `package.json`, `scripts/`). The fork has heavily customized these (Codex/OpenCode
  plugin manifests, `install.ps1`, version bumps). Automatic overwrite would
  destroy that work. Diff them by hand against `upstream/main` if a relevant
  upstream change appears.
- **Committing.** The engine writes to the working tree only. Staging/committing
  is the operator's call (and per repo policy, happens only on explicit
  instruction).
