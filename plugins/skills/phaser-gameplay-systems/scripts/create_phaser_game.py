#!/usr/bin/env python3
"""Create a new Phaser game from the bundled scaffold.

Usage:
  python3 create_phaser_game.py <target-directory> [--force]
"""

import argparse
import json
import os
import shutil
import sys
from pathlib import Path


def get_skill_dir() -> Path:
    """Get the directory of this script's skill."""
    return Path(__file__).resolve().parent.parent


def get_scaffold_dir() -> Path:
    """Get the assets/phaser-vite-game scaffold directory."""
    return get_skill_dir() / "assets" / "phaser-vite-game"


EXCLUDE_DIRS = {"node_modules", "dist", "__pycache__", ".git"}
EXCLUDE_FILES = {".DS_Store", "Thumbs.db", "package-lock.json"}


def copy_scaffold(target_dir: Path, force: bool) -> None:
    """Copy the scaffold to the target directory, rewriting package name.

    Args:
        target_dir: Destination directory.
        force: Whether to overwrite an existing directory.
    """
    scaffold = get_scaffold_dir()

    if not scaffold.is_dir():
        print(f"ERROR: Scaffold directory not found at {scaffold}", file=sys.stderr)
        sys.exit(1)

    if target_dir.exists():
        if force:
            shutil.rmtree(target_dir)
        else:
            print(
                f"ERROR: Target directory '{target_dir}' already exists. Use --force to overwrite.",
                file=sys.stderr,
            )
            sys.exit(1)

    def ignore_func(directory: str, files: list[str]) -> set[str]:
        ignored = set()
        for f in files:
            if f in EXCLUDE_FILES:
                ignored.add(f)
            full = Path(directory) / f
            if full.is_dir() and f in EXCLUDE_DIRS:
                ignored.add(f)
        return ignored

    shutil.copytree(scaffold, target_dir, ignore=ignore_func)

    # Rewrite package.json name field
    proj_name = target_dir.resolve().name
    pkg_path = target_dir / "package.json"
    if pkg_path.exists():
        data = json.loads(pkg_path.read_text(encoding="utf-8"))
        data["name"] = proj_name
        pkg_path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

    print(f"Phaser game scaffold created at {target_dir}")
    print()
    print("Next steps:")
    print(f"  cd {target_dir}")
    print("  npm install")
    print("  npm run dev")


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(
        description="Create a new Phaser game from the bundled scaffold."
    )
    parser.add_argument("target", help="Target directory for the new game")
    parser.add_argument("--force", action="store_true", help="Overwrite existing directory")
    args = parser.parse_args(argv)

    target = Path(args.target).resolve()
    copy_scaffold(target, args.force)


if __name__ == "__main__":
    main()
