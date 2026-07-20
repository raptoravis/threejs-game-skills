#!/usr/bin/env python3
"""Audit a Phaser 2D game director final report for required skill evidence."""

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

# Required by default; skip with --no-design for debug/perf/QA-only reports.
DESIGN_REQUIRED = [
    "game design brief",
    "core loop",
    "level/encounter plan",
]

PHYSICS_MARKERS = [
    "physics engine",
    "timestep",
    "collider",
]

# Phaser 2D visual scorecard categories (see
# phaser-2d-graphics-builder/references/visual-scorecard.md).
PREMIUM_SCORECARD = [
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
    "measured evidence",
    "fresh-eyes review",
    "average",
    "automatic failures",
]

PREMIUM_ASSET_SOURCING = [
    "external asset sourcing",
    "credential probe output",
    "gemini_api_key=",
    "elevenlabs_api_key=",
    "image generator",
    "audio generator",
    "chosen sources",
    "hero/player",
    "background/tileset",
]

# 2D performance diagnostics (no 3D render budget; sprite/body/draw-call counts).
PREMIUM_PERF_DIAGNOSTICS = [
    "sprite count",
    "body count",
]

PREMIUM_VISUAL_HARNESS = [
    "visual test harness",
]

PREMIUM_AUDIO = [
    "audio",
    "audio generator",
    "elevenlabs_api_key=",
]

EXTERNAL_OUTPUT_PATTERNS = [
    re.compile(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b"),
    re.compile(r"\b[\w./-]*assets/(sprites|concepts|textures|tilesets|ui|images|audio)/[\w./-]+\.(png|jpg|jpeg|webp|gif|mp3|wav|ogg|m4a|atlas|json)\b"),
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
    text = text.replace("gameplay brief", "game design brief")
    text = text.replace("design brief", "game design brief")
    text = text.replace("playable loop", "core loop")
    text = text.replace("level plan", "level/encounter plan")
    text = text.replace("encounter plan", "level/encounter plan")
    text = text.replace("level and encounter plan", "level/encounter plan")
    text = text.replace("visual harness", "visual test harness")
    text = text.replace("screenshot baseline", "visual test harness")
    text = text.replace("threejs-image-generator", "image generator")
    text = text.replace("threejs-audio-generator", "audio generator")
    text = text.replace("image-generator", "image generator")
    text = text.replace("audio-generator", "audio generator")
    text = text.replace("nano banana pro", "image generator")
    text = text.replace("nano banana", "image generator")
    text = text.replace("nanobanana", "image generator")
    text = text.replace("nano-banana", "image generator")
    text = text.replace("phase-execution ledger", "phase ledger")
    text = text.replace("phase execution ledger", "phase ledger")
    text = text.replace("debug and profile", "debug/profile")
    text = text.replace("debug profile", "debug/profile")
    text = text.replace("qa and release", "qa/release")
    text = text.replace("qa release", "qa/release")
    text = text.replace("page errors", "page error")
    text = text.replace("fresh eyes review", "fresh-eyes review")
    text = text.replace("fresh-eyes scorecard review", "fresh-eyes review")
    text = text.replace("independent reviewer scores", "fresh-eyes review")
    text = text.replace("adversarial self-review", "fresh-eyes review")
    text = text.replace("measured visual evidence", "measured evidence")
    text = text.replace("inspector metrics", "measured evidence")
    text = text.replace("2-d graphics", "2d graphics")
    text = text.replace("2 d graphics", "2d graphics")
    text = text.replace("phaser-2d-graphics-builder", "2d graphics")
    return re.sub(r"\s+", " ", text)


def marker_pattern(marker: str) -> re.Pattern[str]:
    """Match markers on word boundaries so short markers like 'ui' cannot be
    satisfied incidentally by substrings of unrelated words (e.g. 'build')."""
    prefix = r"\b" if re.match(r"\w", marker) else ""
    suffix = r"\b" if re.search(r"\w$", marker) else ""
    return re.compile(prefix + re.escape(marker) + suffix)


def missing_markers(text: str, markers: list[str]) -> list[str]:
    return [marker for marker in markers if not marker_pattern(marker).search(text)]


def has_external_output_evidence(text: str) -> bool:
    return any(pattern.search(text) for pattern in EXTERNAL_OUTPUT_PATTERNS)


def has_audio_output_evidence(text: str) -> bool:
    return any(pattern.search(text) for pattern in AUDIO_OUTPUT_PATTERNS)


def has_external_blocker(text: str) -> bool:
    # Phaser external assets are 2D image (Gemini or *_IMAGEGEN_MODEL providers) and audio (ElevenLabs).
    gemini_missing = "gemini_api_key=missing" in text
    imagegen_missing = "imagegen_providers=missing" in text
    image_credentials_missing = gemini_missing and imagegen_missing
    both_credentials_missing = image_credentials_missing and "elevenlabs_api_key=missing" in text
    non_credential_blocker = any(marker in text for marker in NON_CREDENTIAL_BLOCKER_MARKERS)
    return both_credentials_missing or non_credential_blocker


def has_audio_blocker(text: str) -> bool:
    return "elevenlabs_api_key=missing" in text or any(marker in text for marker in NON_CREDENTIAL_BLOCKER_MARKERS)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check that a Phaser 2D director final report includes required ledgers, scorecard, and verification evidence."
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
        help="Require physics engine choice (Matter.js/Arcade) and diagnostics evidence.",
    )
    parser.add_argument(
        "--audio",
        action="store_true",
        help="Require generated/integrated audio evidence or a real blocker.",
    )
    parser.add_argument(
        "--no-design",
        action="store_true",
        help="Skip game-design markers (design brief, core loop, level/encounter plan) for debug/perf/QA-only reports.",
    )
    args = parser.parse_args()

    report_path = Path(args.report)
    if not report_path.exists():
        print(f"Missing report file: {report_path}", file=sys.stderr)
        return 1

    text = normalize(report_path.read_text(encoding="utf-8"))
    missing = missing_markers(text, BASE_REQUIRED)
    if not args.no_design:
        missing.extend(missing_markers(text, DESIGN_REQUIRED))

    if args.premium:
        missing.extend(missing_markers(text, PREMIUM_SCORECARD))
        missing.extend(missing_markers(text, PREMIUM_ASSET_SOURCING))
        missing.extend(missing_markers(text, PREMIUM_PERF_DIAGNOSTICS))
        missing.extend(missing_markers(text, PREMIUM_VISUAL_HARNESS))
        missing.extend(missing_markers(text, VERIFICATION_MARKERS))
        if not has_external_output_evidence(text) and not has_external_blocker(text):
            missing.append("real external asset evidence or blocker")
        if "not-needed" in text and "procedural" in text and not has_external_output_evidence(text) and not has_external_blocker(text):
            missing.append("procedural/not-needed requires external output evidence or blocker")

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
