#!/usr/bin/env python3
"""Audit a Phaser game director final report for required skill evidence."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


BASE_REQUIRED = [
    "skill-loading ledger",
    "reference ledger",
    "phase ledger",
    "gameplay systems",
    "2d graphics",
    "ui",
    "debug/profile",
    "qa/release",
]

PHYSICS_MARKERS = [
    "matter.js",
    "physics body",
    "collision",
]

PREMIUM_SCORECARD_2D = [
    "art direction",
    "hero/player",
    "enemies/obstacles",
    "rewards/interactables",
    "world/background",
    "sprite sheets",
    "color palette",
    "lighting",
    "vfx/motion",
    "ui/hud",
    "performance evidence",
    "average",
    "automatic failures",
]

PREMIUM_ASSET_SOURCING = [
    "external asset sourcing",
    "credential probe output",
    "gemini_api_key=",
    "image generator",
    "chosen sources",
    "hero/player",
    "world/background",
    "logos/icons/gui art",
]

PREMIUM_AUDIO = [
    "audio",
    "audio generator",
    "elevenlabs_api_key=",
]

EXTERNAL_OUTPUT_PATTERNS = [
    re.compile(r"\b[\w./-]*assets/(sprites|tilesets|concepts|textures|ui|images|backgrounds|audio)/[\w./-]+\.(png|jpg|jpeg|webp|mp3|wav|ogg|m4a)\b"),
    re.compile(r"\b[\w./-]+\.(png|jpg|jpeg|webp)\b"),
]

AUDIO_OUTPUT_PATTERNS = [
    re.compile(r"\b[\w./-]*assets/audio/[\w./-]+\.(mp3|wav|ogg|m4a)\b"),
]

NON_CREDENTIAL_BLOCKER_MARKERS = [
    "api error",
    "network error",
    "quota",
    "offline-only",
    "offline only",
    "user requested no external",
    "no external ai",
    "no external assets",
]

VERIFICATION_MARKERS = [
    "build",
    "console",
    "page error",
    "desktop",
    "mobile",
    "screenshot",
    "canvas",
    "pixel",
]


def normalize(text: str) -> str:
    text = text.lower()
    text = text.replace("skill loading ledger", "skill-loading ledger")
    text = text.replace("skill loaded ledger", "skill-loading ledger")
    text = text.replace("reference loading ledger", "reference ledger")
    text = text.replace("asset sourcing ledger", "external asset sourcing")
    text = text.replace("external asset ledger", "external asset sourcing")
    text = text.replace("threejs-image-generator", "image generator")
    text = text.replace("threejs-audio-generator", "audio generator")
    text = text.replace("phaser-gameplay-systems", "gameplay systems")
    text = text.replace("phaser-2d-graphics-builder", "2d graphics")
    text = text.replace("phaser-game-director", "game director")
    text = text.replace("phaser-debug-profiler", "debug/profile")
    text = text.replace("phaser-qa-release", "qa/release")
    text = text.replace("nano banana pro", "image generator")
    text = text.replace("nano banana", "image generator")
    text = text.replace("gemini image", "image generator")
    text = text.replace("phase-execution ledger", "phase ledger")
    text = text.replace("phase execution ledger", "phase ledger")
    text = text.replace("debug and profile", "debug/profile")
    text = text.replace("debug profile", "debug/profile")
    text = text.replace("qa and release", "qa/release")
    text = text.replace("qa release", "qa/release")
    text = text.replace("page errors", "page error")
    text = text.replace("spritesheet", "sprite sheet")
    text = text.replace("color palette", "color palette")
    return re.sub(r"\s+", " ", text)


def missing_markers(text: str, markers: list[str]) -> list[str]:
    return [marker for marker in markers if marker not in text]


def has_external_output_evidence(text: str) -> bool:
    return any(pattern.search(text) for pattern in EXTERNAL_OUTPUT_PATTERNS)


def has_audio_output_evidence(text: str) -> bool:
    return any(pattern.search(text) for pattern in AUDIO_OUTPUT_PATTERNS)


def has_external_blocker(text: str) -> bool:
    gemini_missing = "gemini_api_key=missing" in text
    non_credential_blocker = any(marker in text for marker in NON_CREDENTIAL_BLOCKER_MARKERS)
    return gemini_missing or non_credential_blocker


def has_audio_blocker(text: str) -> bool:
    return "elevenlabs_api_key=missing" in text or any(marker in text for marker in NON_CREDENTIAL_BLOCKER_MARKERS)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check that a Phaser director final report includes required ledgers, scorecard, and verification evidence."
    )
    parser.add_argument("report", help="Path to the markdown/text final report draft.")
    parser.add_argument(
        "--premium",
        action="store_true",
        help="Require the premium 2D visual scorecard and full verification evidence.",
    )
    parser.add_argument(
        "--physics",
        action="store_true",
        help="Require Matter.js physics diagnostics evidence.",
    )
    parser.add_argument(
        "--audio",
        action="store_true",
        help="Require generated/integrated audio evidence or a real blocker.",
    )
    args = parser.parse_args()

    report_path = Path(args.report)
    if not report_path.exists():
        print(f"Missing report file: {report_path}", file=sys.stderr)
        return 1

    text = normalize(report_path.read_text(encoding="utf-8"))
    missing = missing_markers(text, BASE_REQUIRED)

    if args.premium:
        missing.extend(missing_markers(text, PREMIUM_SCORECARD_2D))
        missing.extend(missing_markers(text, PREMIUM_ASSET_SOURCING))
        missing.extend(missing_markers(text, VERIFICATION_MARKERS))
        if not has_external_output_evidence(text) and not has_external_blocker(text):
            missing.append("real external asset evidence (sprite/tileset/background) or blocker")

    if args.physics:
        missing.extend(missing_markers(text, PHYSICS_MARKERS))

    if args.audio:
        missing.extend(missing_markers(text, PREMIUM_AUDIO))
        if not has_audio_output_evidence(text) and not has_audio_blocker(text):
            missing.append("real audio asset evidence or blocker")

    if missing:
        print("Director report audit failed. Missing required markers:")
        for marker in missing:
            print(f"- {marker}")
        return 1

    print("Director report audit passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
