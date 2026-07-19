#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "google-genai>=1.0.0",
#     "pillow>=10.0.0",
#     "requests>=2.28.0",
# ]
# ///
"""
Generate images using ARK (Doubao/Seedream) or Google Gemini image API.
Providers are tried in the order their keys appear in ~/.env.

Usage:
    uv run generate_image.py --prompt "your image description" --filename "output.png" [--resolution 1K|2K|4K]
    uv run generate_image.py --prompt "..." --filename "output.png" --provider ark   # force a specific provider
    uv run generate_image.py probe   # prints credential status and provider priority order
"""

import argparse
import base64
import os
import sys
from io import BytesIO
from pathlib import Path

# ---------------------------------------------------------------------------
# .env loading
# ---------------------------------------------------------------------------

_HOME_ENV = Path.home() / ".env"

# Provider detection: keys that indicate a provider, in the env file
_PROVIDER_KEYS = {
    "ARK_API_KEY": "ark",
    "GEMINI_API_KEY": "gemini",
}


def _load_dotenv_from_home() -> None:
    """Load key=value pairs from ~/.env into os.environ (only if not already set)."""
    if not _HOME_ENV.exists():
        return
    with open(_HOME_ENV, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip()
                if key and value and key not in os.environ:
                    os.environ[key] = value


def _get_provider_order() -> list[str]:
    """
    Read ~/.env and return provider names in the order their *_API_KEY lines
    first appear.  Falls back to env vars if the file is missing.
    """
    provider_key_map = dict(_PROVIDER_KEYS)

    if _HOME_ENV.exists():
        order: list[str] = []
        with open(_HOME_ENV, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key = line.partition("=")[0].strip()
                    if key in provider_key_map:
                        provider = provider_key_map[key]
                        if provider not in order:
                            order.append(provider)
        # Append any env-only providers not found in .env
        for key, provider in provider_key_map.items():
            if provider not in order and os.environ.get(key):
                order.append(provider)
        return order

    # No .env file — use env order
    explicit = os.environ.get("PROVIDER_ORDER", "")
    if explicit:
        return [p.strip() for p in explicit.split(",") if p.strip()]
    order = []
    for key, provider in provider_key_map.items():
        if os.environ.get(key) and provider not in order:
            order.append(provider)
    return order


# ---------------------------------------------------------------------------
# Shared image save helper
# ---------------------------------------------------------------------------

def _save_image(image_bytes: bytes, output_path: Path) -> None:
    """Save raw image bytes to `output_path`, handling PNG alpha / JPEG flatten."""
    from PIL import Image as PILImage

    image = PILImage.open(BytesIO(image_bytes))
    suffix = output_path.suffix.lower()

    if suffix in {".jpg", ".jpeg"}:
        if image.mode in ("RGBA", "LA", "P"):
            rgba = image.convert("RGBA")
            flat = PILImage.new("RGB", rgba.size, (255, 255, 255))
            flat.paste(rgba, mask=rgba.split()[3])
            flat.save(str(output_path), "JPEG", quality=92)
        else:
            image.convert("RGB").save(str(output_path), "JPEG", quality=92)
    else:
        if image.mode not in ("RGB", "RGBA"):
            has_alpha = "A" in image.mode or (
                image.mode == "P" and "transparency" in image.info
            )
            image = image.convert("RGBA" if has_alpha else "RGB")
        image.save(str(output_path), "PNG")
        if image.mode == "RGBA":
            print("Alpha channel preserved (RGBA PNG).")


# ---------------------------------------------------------------------------
# ARK (Doubao/Seedream) provider
# ---------------------------------------------------------------------------

ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"


def _ark_generate(
    prompt: str,
    output_path: Path,
    resolution: str,
    input_image_path: str | None = None,
) -> bool:
    """Generate via ARK/Doubao Seedream API. Returns True on success."""
    import requests
    from PIL import Image as PILImage

    api_key = os.environ.get("ARK_API_KEY", "")
    if not api_key:
        print("ARK_API_KEY not set, skipping ARK provider.")
        return False

    model = os.environ.get("ARK_IMAGE_MODEL", "doubao-seedream-5-0-pro-260628")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload: dict = {
        "model": model,
        "prompt": prompt,
        "n": 1,
        "size": resolution,
        "response_format": "b64_json",
    }

    if input_image_path:
        img = PILImage.open(input_image_path)
        buf = BytesIO()
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        img.save(buf, format="PNG")
        image_b64 = base64.b64encode(buf.getvalue()).decode("ascii")
        payload["image"] = image_b64
        print(f"Loaded input image for ARK: {input_image_path}")

    print(f"Calling ARK API (model={model}, resolution={resolution})…")

    try:
        resp = requests.post(
            f"{ARK_BASE_URL}/images/generations",
            headers=headers,
            json=payload,
            timeout=120,
        )

        if resp.status_code == 429:
            print(f"ARK API quota exceeded (429).")
            return False

        if not resp.ok:
            print(f"ARK API error {resp.status_code}: {resp.text[:500]}")
            return False

        data = resp.json()
        image_data: bytes | None = None

        if "data" in data and len(data["data"]) > 0:
            item = data["data"][0]
            if "b64_json" in item:
                image_data = base64.b64decode(item["b64_json"])
            elif "url" in item:
                img_resp = requests.get(item["url"], timeout=60)
                if img_resp.ok:
                    image_data = img_resp.content
                else:
                    print(f"Failed to download image from URL: {img_resp.status_code}")
                    return False

        if not image_data:
            print("ARK API returned no image data.")
            return False

        _save_image(image_data, output_path)
        print("ARK API: image saved.")
        return True

    except Exception as e:
        print(f"ARK API error: {e}")
        return False


# ---------------------------------------------------------------------------
# Gemini provider
# ---------------------------------------------------------------------------


def _gemini_generate(
    prompt: str,
    output_path: Path,
    resolution: str,
    input_image_path: str | None = None,
) -> bool:
    """Generate via Google Gemini image API. Returns True on success."""
    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        print("GEMINI_API_KEY not set, skipping Gemini provider.")
        return False

    client = genai.Client(api_key=api_key)

    # Build contents
    if input_image_path:
        input_image = PILImage.open(input_image_path)
        contents = [input_image, prompt]
        print(f"Loaded input image for Gemini: {input_image_path}")
    else:
        contents = prompt

    print(f"Calling Gemini API (model=gemini-3-pro-image-preview, resolution={resolution})…")

    try:
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=["TEXT", "IMAGE"],
                image_config=types.ImageConfig(image_size=resolution),
            ),
        )

        image_saved = False
        for part in response.parts:
            if part.text is not None:
                print(f"Gemini response: {part.text}")
            elif part.inline_data is not None:
                image_data = part.inline_data.data
                if isinstance(image_data, str):
                    image_data = base64.b64decode(image_data)
                _save_image(image_data, output_path)
                image_saved = True

        if image_saved:
            print("Gemini API: image saved.")
            return True
        else:
            print("Gemini API: no image in response.")
            return False

    except Exception as e:
        msg = str(e)
        if any(kw in msg for kw in ("429", "RESOURCE_EXHAUSTED", "quota")):
            print(f"Gemini API quota exceeded.")
        else:
            print(f"Gemini API error: {e}")
        return False


# ---------------------------------------------------------------------------
# Provider registry
# ---------------------------------------------------------------------------

_PROVIDERS = {
    "ark": _ark_generate,
    "gemini": _gemini_generate,
}


# ---------------------------------------------------------------------------
# Probe
# ---------------------------------------------------------------------------


def cmd_probe() -> None:
    """Print credential status and provider priority order."""
    _load_dotenv_from_home()

    for key, name in [("ARK_API_KEY", "ARK_API_KEY"), ("GEMINI_API_KEY", "GEMINI_API_KEY")]:
        status = "SET" if os.environ.get(key) else "MISSING"
        print(f"{name}={status}")

    order = _get_provider_order()
    print(f"PROVIDER_ORDER={','.join(order) if order else 'none'}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def _detect_resolution(
    explicit: str | None,
    input_image_path: str | None,
) -> str:
    """Determine output resolution.

    Priority: explicit --resolution > auto-detect from input image > "2K" default.
    """
    if explicit:
        return explicit
    if input_image_path:
        from PIL import Image as PILImage
        try:
            img = PILImage.open(input_image_path)
            max_dim = max(img.size)
            if max_dim >= 3000:
                return "4K"
            elif max_dim >= 1500:
                return "2K"
            return "1K"
        except Exception:
            pass
    return "2K"


def main():
    if len(sys.argv) > 1 and sys.argv[1] == "probe":
        cmd_probe()
        return

    # Step 0 — load ~/.env before anything else
    _load_dotenv_from_home()

    parser = argparse.ArgumentParser(
        description="Generate images using ARK (Doubao/Seedream) or Google Gemini API. "
                    "Providers are tried in the order their keys appear in ~/.env."
    )
    parser.add_argument("--prompt", "-p", required=True, help="Image description/prompt")
    parser.add_argument("--filename", "-f", required=True, help="Output filename (e.g. assets/concepts/ship.png)")
    parser.add_argument("--input-image", "-i", help="Optional input image path for editing/modification")
    parser.add_argument(
        "--resolution", "-r",
        choices=["1K", "2K", "4K"],
        default=None,
        help="Output resolution: 1K, 2K, or 4K. "
             "When omitted: auto-detect from input image, default to 2K.",
    )
    parser.add_argument(
        "--api-key", "-k",
        help="API key override (applied to the first attempted provider). "
             "Prefer setting ARK_API_KEY / GEMINI_API_KEY in ~/.env instead.",
    )
    parser.add_argument(
        "--provider",
        choices=["ark", "gemini"],
        help="Force a specific provider instead of following ~/.env order.",
    )

    args = parser.parse_args()

    # --- provider ordering ---
    if args.provider:
        provider_order = [args.provider]
    else:
        provider_order = _get_provider_order()

    if not provider_order:
        print("Error: No image generation provider configured.", file=sys.stderr)
        print("Set ARK_API_KEY and/or GEMINI_API_KEY in ~/.env or environment.", file=sys.stderr)
        sys.exit(1)

    # --- API key override ---
    if args.api_key:
        # Apply to the first provider in the list
        key_map = {"ark": "ARK_API_KEY", "gemini": "GEMINI_API_KEY"}
        first = provider_order[0]
        if first in key_map:
            os.environ[key_map[first]] = args.api_key
            print(f"Using --api-key for provider '{first}'")

    # --- resolution ---
    resolution = _detect_resolution(args.resolution, args.input_image)
    if args.resolution:
        print(f"Resolution: {resolution} (explicit)")
    elif args.input_image:
        print(f"Resolution: {resolution} (auto-detected from input image)")

    # --- output path ---
    output_path = Path(args.filename)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # --- try providers in order ---
    for i, provider in enumerate(provider_order):
        if provider not in _PROVIDERS:
            print(f"Warning: unknown provider '{provider}', skipping.")
            continue

        if len(provider_order) > 1:
            label = "→" if i < len(provider_order) - 1 else "→"
            print(f"\n{label} Trying provider [{i+1}/{len(provider_order)}]: {provider}")

        success = _PROVIDERS[provider](
            prompt=args.prompt,
            output_path=output_path,
            resolution=resolution,
            input_image_path=args.input_image,
        )

        if success:
            full_path = output_path.resolve()
            print(f"\n[OK] Image saved: {full_path}")
            print(f"  Provider used: {provider}")
            return

        if not (i == len(provider_order) - 1):
            print(f"  Provider '{provider}' failed, falling back to next…")

    # All providers failed
    print(f"\n[FAIL] Error: All providers failed ({', '.join(provider_order)}).", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
