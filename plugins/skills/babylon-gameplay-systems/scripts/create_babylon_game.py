#!/usr/bin/env python3
"""Scaffold a new Babylon.js + Vite + TypeScript game project.

Copies assets/babylon-vite-game/ to the target directory, rewrites the
project name in package.json, and creates a ready-to-run starter game.

Usage:
  python3 create_babylon_game.py ./my-game
  python3 create_babylon_game.py ./my-game --force
"""

import argparse
import json
import shutil
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Scaffold a Babylon.js + Vite + TypeScript game."
    )
    parser.add_argument("target", type=Path, help="Target project directory")
    parser.add_argument(
        "--force", action="store_true", help="Overwrite the target directory"
    )
    args = parser.parse_args()

    skill_dir = Path(__file__).resolve().parent.parent
    template_dir = skill_dir / "assets" / "babylon-vite-game"
    target = args.target.resolve()

    if not template_dir.is_dir():
        print(f"Error: template not found at {template_dir}", file=sys.stderr)
        return 1

    if target.exists():
        if not args.force:
            print(
                f"Target {target} already exists. Use --force to overwrite.",
                file=sys.stderr,
            )
            return 1
        shutil.rmtree(target)

    ignore = shutil.ignore_patterns("node_modules", "dist", "__pycache__", ".DS_Store")
    shutil.copytree(template_dir, target, ignore=ignore)

    # Rewrite project name in package.json
    pkg_path = target / "package.json"
    if pkg_path.exists():
        pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
        pkg["name"] = target.name
        pkg_path.write_text(
            json.dumps(pkg, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    print(f"Babylon.js game scaffolded at {target}")
    print("Next steps:")
    print(f"  cd {target.name}")
    print("  npm install")
    print("  npm run dev")
    return 0


if __name__ == "__main__":
    sys.exit(main())
