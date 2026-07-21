#!/usr/bin/env python3
"""Thin wrapper: delegates to the Three.js 3D generator script.

Adds a --babylon-compat flag for Babylon-specific output conventions.
For full documentation, see threejs-3d-generator/scripts/threejs_3d_asset.py.
"""

import sys
from pathlib import Path

threejs_dir = (
    Path(__file__).resolve().parents[2]
    / "threejs-3d-generator"
    / "scripts"
)
sys.path.insert(0, str(threejs_dir))

try:
    from threejs_3d_asset import main
except ImportError as e:
    print(f"Error: cannot import threejs-3d-generator script: {e}", file=sys.stderr)
    print(f"Looked in: {threejs_dir}", file=sys.stderr)
    sys.exit(1)

if __name__ == "__main__":
    sys.exit(main())
