#!/usr/bin/env python3
"""Thin wrapper: delegates to the Three.js audio generator script.

For full documentation, see threejs-audio-generator/scripts/threejs_audio_asset.py.
"""

import sys
from pathlib import Path

threejs_dir = (
    Path(__file__).resolve().parents[2]
    / "threejs-audio-generator"
    / "scripts"
)
sys.path.insert(0, str(threejs_dir))

try:
    from threejs_audio_asset import main
except ImportError as e:
    print(f"Error: cannot import threejs-audio-generator script: {e}", file=sys.stderr)
    print(f"Looked in: {threejs_dir}", file=sys.stderr)
    sys.exit(1)

if __name__ == "__main__":
    sys.exit(main())
