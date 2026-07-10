#!/usr/bin/env python3
"""
sync_upstream.py — Incremental upstream sync engine for the threejs-game-skills fork.

Upstream repo : https://github.com/majidmanzarpour/threejs-game-skills
Upstream skill root : skills/
Local skill root    : plugins/skills/

This fork is a *re-host* (no shared git history with upstream) and uses a
different layout (plugins/ wrapper + extra Phaser skills). A plain `git merge`
therefore cannot work. Instead we sync purely on content, driven by a baseline
manifest that records exactly which upstream skill files were synced last time
and at which upstream commit.

Model
-----
The baseline (plugins/skills/sync-ups/baseline.json) stores:
  - upstream commit SHA at last sync
  - a manifest: { upstream_relative_path: content_hash } for every skill file
    that came from upstream

On each run we fetch upstream, enumerate its current skill tree, and diff it
against the manifest. Every upstream skill file falls into exactly one bucket:

  ADD      in upstream now, not in manifest           -> write to local
  MODIFY   in both, hash differs                      -> overwrite local (upstream wins)
  RENAME   manifest entry vanished AND a new upstream file is near-identical
           -> rename local file, then overwrite with upstream content
  DELETE   manifest entry vanished, no rename match   -> remove the local copy
  SAME     in both, hash equal                        -> nothing

Local-only files (Phaser skills, local checklists, this skill itself) are NEVER
in the upstream tree, so they are never enumerated and never touched. They are
reported for visibility only.

Usage
-----
  python sync_upstream.py --status        # dry-run: show plan, change nothing
  python sync_upstream.py --apply         # incremental: apply diff since baseline
  python sync_upstream.py --reconcile --apply   # first run / forced: treat manifest
                                                # as empty, full sync to upstream HEAD,
                                                # then (re)write baseline
  python sync_upstream.py --reset-baseline     # write baseline = current upstream HEAD
                                                # without changing files (after a manual
                                                # sync)

Exit code 0 always; the report is the source of truth. Conflicts / review items
are surfaced in the report, not via non-zero exit, so the skill runner can read
them.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Iterable

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #
UPSTREAM_REMOTE = "upstream"
UPSTREAM_URL = "https://github.com/majidmanzarpour/threejs-game-skills.git"
UPSTREAM_BRANCH = "main"

# Path roots (relative to repo root).
UPSTREAM_SKILLS_DIR = "skills"            # inside the upstream repo
LOCAL_SKILLS_DIR = Path("plugins/skills") # inside this repo

# Baseline file lives inside this skill (local-only, never synced).
BASELINE_FILE = LOCAL_SKILLS_DIR / "sync-ups" / "baseline.json"

# Rename detection: two files are considered the same (renamed) when their
# normalized content similarity is at least this high.
RENAME_THRESHOLD = 0.80


# --------------------------------------------------------------------------- #
# Git helpers
# --------------------------------------------------------------------------- #
def git(*args: str, capture_bytes: bool = False, check: bool = True) -> bytes | str:
    """Run a git command in the repo root and return its stdout."""
    cmd = ["git", *args]
    proc = subprocess.run(
        cmd,
        capture_output=True,
        check=False,
    )
    if check and proc.returncode != 0:
        raise RuntimeError(
            f"git {' '.join(args)} failed ({proc.returncode}):\n"
            f"{proc.stderr.decode('utf-8', 'replace')}"
        )
    return proc.stdout if capture_bytes else proc.stdout.decode("utf-8", "replace")


def repo_root() -> Path:
    return Path(git("rev-parse", "--show-toplevel").strip())


def ensure_upstream_remote() -> None:
    remotes = git("remote").split()
    if UPSTREAM_REMOTE not in remotes:
        print(f"[setup] adding remote '{UPSTREAM_REMOTE}' -> {UPSTREAM_URL}")
        git("remote", "add", UPSTREAM_REMOTE, UPSTREAM_URL)
    # Keep the URL correct if it was added differently before.
    git("remote", "set-url", UPSTREAM_REMOTE, UPSTREAM_URL)


def fetch_upstream() -> str:
    """Fetch upstream branch and return its resolved commit SHA."""
    print(f"[fetch] {UPSTREAM_REMOTE}/{UPSTREAM_BRANCH} ...")
    git("fetch", UPSTREAM_REMOTE, UPSTREAM_BRANCH)
    sha = git("rev-parse", f"{UPSTREAM_REMOTE}/{UPSTREAM_BRANCH}").strip()
    short = git("rev-parse", "--short", sha).strip()
    subject = git("log", "-1", "--format=%s", sha).strip()
    print(f"[fetch] upstream HEAD = {short} ({sha})  '{subject}'")
    return sha


def upstream_tree(upstream_sha: str) -> dict[str, str]:
    """Return {upstream_relative_path: blob_sha} for every file under skills/."""
    out = git(
        "ls-tree", "-r", "--format=%(path)%x09%(objectname)", upstream_sha,
    )
    tree: dict[str, str] = {}
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        path, blob = line.split("\t")
        # Only sync the skills/ subtree.
        if path.startswith(UPSTREAM_SKILLS_DIR + "/"):
            tree[path] = blob
    return tree


def read_blob(blob_sha: str) -> bytes:
    return git("cat-file", "blob", blob_sha, capture_bytes=True, check=True)


def content_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


# --------------------------------------------------------------------------- #
# Path mapping
# --------------------------------------------------------------------------- #
def map_to_local(upstream_path: str) -> Path:
    """skills/foo/bar.md -> plugins/skills/foo/bar.md"""
    rel = upstream_path[len(UPSTREAM_SKILLS_DIR) + 1:]  # strip "skills/"
    return LOCAL_SKILLS_DIR / rel


# --------------------------------------------------------------------------- #
# Rename detection
# --------------------------------------------------------------------------- #
def normalize_text(data: bytes) -> str:
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        return data.decode("latin-1", "replace")


def similarity(a: bytes, b: bytes) -> float:
    import difflib
    ta, tb = normalize_text(a), normalize_text(b)
    return difflib.SequenceMatcher(None, ta, tb).ratio()


# --------------------------------------------------------------------------- #
# Plan computation
# --------------------------------------------------------------------------- #
def classify(
    current_tree: dict[str, str],
    manifest: dict[str, str],
    upstream_sha: str,
) -> dict[str, list]:
    """Diff the upstream tree against the baseline manifest.

    The manifest stores a sha256 content hash per path; current_tree stores the
    upstream git blob sha. To compare a shared path we read the current blob and
    hash it.
    """
    adds: list[str] = [p for p in current_tree if p not in manifest]
    gone: list[str] = [p for p in manifest if p not in current_tree]

    modifies: list[str] = []
    sames: list[str] = []
    for p in current_tree:
        if p not in manifest:
            continue
        cur_hash = content_hash(read_blob(current_tree[p]))
        (modifies if cur_hash != manifest[p] else sames).append(p)

    # Rename detection among `gone` vs `adds`.
    renames: list[tuple[str, str, float]] = []
    unresolved_gone: list[str] = []
    unresolved_adds: list[str] = []

    if gone and adds:
        # manifest stores content_hash, not a git blob sha, so we cannot fetch
        # the old upstream blob by hash. For rename detection we compare the
        # LOCAL copy of the gone file (it still exists locally until we delete
        # it) against the new upstream blob.
        add_blob = {p: read_blob(current_tree[p]) for p in adds}
        used_adds: set[str] = set()
        root = repo_root()
        for g in gone:
            local_file = root / map_to_local(g)
            gdata = local_file.read_bytes() if local_file.exists() else b""
            best_p, best_s = None, 0.0
            for a in adds:
                if a in used_adds:
                    continue
                s = similarity(gdata, add_blob[a])
                if s > best_s:
                    best_s, best_p = s, a
            if best_p is not None and best_s >= RENAME_THRESHOLD:
                renames.append((g, best_p, round(best_s, 3)))
                used_adds.add(best_p)
            else:
                unresolved_gone.append(g)
        unresolved_adds = [a for a in adds if a not in used_adds]
    else:
        unresolved_gone = list(gone)
        unresolved_adds = list(adds)

    return {
        "ADD": unresolved_adds,
        "MODIFY": modifies,
        "RENAME": renames,            # list of (old, new, score)
        "DELETE": unresolved_gone,
        "SAME": sames,
    }


# --------------------------------------------------------------------------- #
# Conflict detection (local edits to upstream-tracked paths)
# --------------------------------------------------------------------------- #
def detect_local_edits(upstream_tree: dict[str, str], root: Path) -> list[str]:
    """Flag upstream-tracked files whose local working copy differs from the
    upstream blob even before this sync (i.e. local has divergent edits).
    Upstream still wins on apply; this is reported so edits aren't lost silently.
    """
    edited: list[str] = []
    for up_path, blob in upstream_tree.items():
        local_file = root / map_to_local(up_path)
        if not local_file.exists():
            continue
        if content_hash(local_file.read_bytes()) != content_hash(read_blob(blob)):
            edited.append(up_path)
    return edited


def detect_coexist_conflicts(upstream_tree: dict[str, str], root: Path) -> list[str]:
    """Flag directories where an upstream-only file and a local-only file sit
    side by side — a likely rename / duplicate the operator should eyeball
    (e.g. director-phase-os.md vs phase-playbook.md).
    """
    # Map local-relative-dir (posix) -> set of upstream basenames in that dir.
    from collections import defaultdict
    up_by_dir: dict[str, set[str]] = defaultdict(set)
    for p in upstream_tree:
        rel_dir = map_to_local(p).parent.as_posix()
        up_by_dir[rel_dir].add(Path(p).name)

    flags: list[str] = []
    root_resolved = root.resolve()
    for local_dir, _dirs, files in os.walk(root / LOCAL_SKILLS_DIR):
        rel_posix = Path(local_dir).resolve().relative_to(root_resolved).as_posix()
        up_names = up_by_dir.get(rel_posix, set())
        local_names = set(files)
        local_only = local_names - up_names
        up_only = up_names - local_names
        if local_only and up_only:
            flags.append(
                f"{rel_posix}: upstream-only {sorted(up_only)} | local-only {sorted(local_only)}"
            )
    return flags


# --------------------------------------------------------------------------- #
# Apply
# --------------------------------------------------------------------------- #
def apply_plan(plan: dict, current_tree: dict[str, str], root: Path) -> dict:
    """Write changes into the working tree. Returns counts."""
    counts = {"ADD": 0, "MODIFY": 0, "RENAME": 0, "DELETE": 0}

    # RENAME: delete old local path first, then write new content.
    for old, new, score in plan["RENAME"]:
        old_local = root / map_to_local(old)
        if old_local.exists():
            old_local.unlink()
            print(f"[R] rename-remove {old}  (->{new}, sim={score})")
        _write_file(root / map_to_local(new), read_blob(current_tree[new]))
        print(f"[R] rename-write  {new}")
        counts["RENAME"] += 1

    # ADD + MODIFY both write upstream content to the mapped local path.
    for p in plan["ADD"]:
        _write_file(root / map_to_local(p), read_blob(current_tree[p]))
        print(f"[A] {p}")
        counts["ADD"] += 1
    for p in plan["MODIFY"]:
        _write_file(root / map_to_local(p), read_blob(current_tree[p]))
        print(f"[M] {p}")
        counts["MODIFY"] += 1

    # DELETE: remove the local copy of an upstream-tracked file that upstream
    # dropped. Guard: only delete if the local file still looks like the
    # upstream-tracked path (never touch a local-only file).
    for p in plan["DELETE"]:
        local_file = root / map_to_local(p)
        if local_file.exists():
            local_file.unlink()
            print(f"[D] {p}")
            counts["DELETE"] += 1
        else:
            print(f"[D] {p} (already absent)")

    return counts


def _write_file(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


# --------------------------------------------------------------------------- #
# Baseline
# --------------------------------------------------------------------------- #
def load_baseline(root: Path) -> dict | None:
    f = root / BASELINE_FILE
    if not f.exists():
        return None
    return json.loads(f.read_text(encoding="utf-8"))


def write_baseline(root: Path, upstream_sha: str, current_tree: dict[str, str], mode: str, notes: str = "") -> None:
    manifest = {p: content_hash(read_blob(blob)) for p, blob in current_tree.items()}
    short = git("rev-parse", "--short", upstream_sha).strip()
    subject = git("log", "-1", "--format=%s", upstream_sha).strip()
    baseline = {
        "upstream_url": UPSTREAM_URL,
        "upstream_remote": UPSTREAM_REMOTE,
        "upstream_branch": UPSTREAM_BRANCH,
        "upstream_sha": upstream_sha,
        "upstream_short": short,
        "upstream_subject": subject,
        "synced_at": _dt.datetime.now().astimezone().isoformat(timespec="seconds"),
        "mode": mode,
        "skills_root_upstream": UPSTREAM_SKILLS_DIR,
        "skills_root_local": LOCAL_SKILLS_DIR.as_posix(),
        "manifest_size": len(manifest),
        "notes": notes,
        "manifest": manifest,
    }
    out = root / BASELINE_FILE
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(baseline, indent=2, sort_keys=True), encoding="utf-8")
    print(f"[baseline] wrote {out.relative_to(root)} @ {short} ({len(manifest)} files)")


# --------------------------------------------------------------------------- #
# Report
# --------------------------------------------------------------------------- #
def print_report(
    upstream_sha: str,
    plan: dict,
    counts: dict | None,
    local_edits: list[str],
    coexist: list[str],
    baseline: dict | None,
    applied: bool,
) -> None:
    short = git("rev-parse", "--short", upstream_sha).strip()
    print("\n" + "=" * 72)
    print(f"SYNC REPORT  (upstream {short})")
    print("=" * 72)
    base_sha = baseline.get("upstream_short") if baseline else "<none — first run>"
    print(f"baseline       : {base_sha}")
    print(f"upstream HEAD  : {short}")
    print(f"mode           : {'APPLIED' if applied else 'DRY-RUN (--status)'}")
    print(
        f"plan           : ADD={len(plan['ADD'])} MODIFY={len(plan['MODIFY'])} "
        f"RENAME={len(plan['RENAME'])} DELETE={len(plan['DELETE'])} SAME={len(plan['SAME'])}"
    )
    if counts:
        print(f"applied        : ADD={counts['ADD']} MODIFY={counts['MODIFY']} "
              f"RENAME={counts['RENAME']} DELETE={counts['DELETE']}")

    def bucket(title: str, items: Iterable, key=None):
        items = sorted(items, key=key) if items else []
        if not items:
            return
        print(f"\n--- {title} ({len(items)}) ---")
        for it in items:
            print(f"  {it}")

    bucket("ADD (new from upstream)", plan["ADD"])
    bucket("MODIFY (upstream updated; upstream wins)", plan["MODIFY"])
    if plan["RENAME"]:
        print(f"\n--- RENAME ({len(plan['RENAME'])}) ---")
        for old, new, score in plan["RENAME"]:
            print(f"  {old}  ->  {new}   (similarity {score})")
    bucket("DELETE (upstream removed)", plan["DELETE"])

    if local_edits:
        print(f"\n--- LOCAL EDITS OVERWRITTEN ({len(local_edits)}) ---")
        print("These upstream-tracked files had local changes that upstream overwrote.")
        print("Review the git diff if any local edits must be preserved.")
        for p in local_edits:
            print(f"  {p}")

    if coexist:
        print(f"\n--- REVIEW: possible renames / duplicates ({len(coexist)}) ---")
        print("Upstream-only and local-only files coexist in the same directory.")
        print("Confirm these are not unintended duplicates before committing.")
        for c in coexist:
            print(f"  {c}")

    if not (plan["ADD"] or plan["MODIFY"] or plan["RENAME"] or plan["DELETE"]):
        print("\n(no upstream changes since baseline — already up to date)")
    print("=" * 72)


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main(argv: list[str]) -> int:
    ap = argparse.ArgumentParser(description="Sync upstream threejs-game-skills into this fork.")
    ap.add_argument("--status", action="store_true", help="dry-run; print plan, change nothing")
    ap.add_argument("--apply", action="store_true", help="apply the incremental diff since baseline")
    ap.add_argument("--reconcile", action="store_true",
                    help="ignore the existing manifest and full-sync to upstream HEAD (first run / forced)")
    ap.add_argument("--reset-baseline", action="store_true",
                    help="write baseline = current upstream HEAD without changing files")
    args = ap.parse_args(argv)

    if not (args.status or args.apply or args.reconcile or args.reset_baseline):
        args.status = True  # default to dry-run

    root = repo_root()
    os.chdir(root)

    ensure_upstream_remote()
    upstream_sha = fetch_upstream()
    current_tree = upstream_tree(upstream_sha)
    baseline = load_baseline(root)

    # --- reset-baseline: just record, don't touch files ---
    if args.reset_baseline:
        write_baseline(root, upstream_sha, current_tree, mode="reset-baseline",
                       notes="baseline recorded without applying file changes")
        return 0

    # Determine manifest to diff against.
    if args.reconcile or baseline is None:
        manifest = {}
        mode = "reconcile"
        if baseline is None:
            print("[plan] no baseline found -> first-run full reconcile")
        else:
            print("[plan] --reconcile -> ignoring existing manifest, full sync")
    else:
        manifest = baseline.get("manifest", {})
        mode = "incremental"
        print(f"[plan] incremental from baseline {baseline.get('upstream_short')}")

    plan = classify(current_tree, manifest, upstream_sha)

    # Pre-apply diagnostics (computed against current upstream, independent of mode).
    local_edits = detect_local_edits(current_tree, root)
    coexist = detect_coexist_conflicts(current_tree, root)

    counts = None
    applied = False
    # --apply is the only write switch. --reconcile only selects the manifest
    # source (full sync vs incremental); combine with --status to preview a
    # full reconcile without writing, or with --apply to write it.
    if args.apply:
        counts = apply_plan(plan, current_tree, root)
        applied = True
        write_baseline(
            root, upstream_sha, current_tree, mode=mode,
            notes="first full reconcile" if mode == "reconcile" else "incremental sync",
        )

    print_report(upstream_sha, plan, counts, local_edits, coexist, baseline, applied)

    if not applied:
        print("\n(dry-run; re-run with --apply to write changes, or --reconcile --apply for first run)")
    else:
        print("\nDone. Working tree modified — review with `git status` / `git diff`.")
        print("Commit only when ready (this script does not commit).")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
