#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "google-genai>=1.0.0",
#     "openai>=1.0.0",
#     "pillow>=10.0.0",
#     "requests>=2.28.0",
# ]
# ///
"""
Generate images using auto-discovered image generation providers.

Providers are discovered from *_IMAGEGEN_MODEL environment variables.
Priority follows declaration order in ~/.env (first-come-first-served).
If the primary provider fails (quota, error), the next is tried automatically.

Supported backends:
  - ARK  (Doubao/Seedream) — native HTTP to 火山引擎方舟
  - DASHSCOPE, other OpenAI-compatible — via OpenAI SDK Images API
  - GEMINI — Google Gemini via genai SDK

Usage:
    uv run generate_image.py --prompt "your image description" --filename "output.png" [--resolution 1K|2K|4K]
    uv run generate_image.py --provider ARK --prompt "..." --filename "output.png"  # force a provider
    uv run generate_image.py probe   # prints provider status and exits
"""

import argparse
import base64
import os
import sys
from io import BytesIO
from pathlib import Path


# ---------------------------------------------------------------------------
# .env loading — run before anything that reads os.environ
# ---------------------------------------------------------------------------

_HOME_ENV = Path.home() / ".env"


def _load_dotenv_from_home() -> None:
    """Load key=value pairs from ~/.env into os.environ (only if not already set)."""
    if not _HOME_ENV.exists():
        return
    try:
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
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Resolution mapping  (OpenAI-compatible size strings)
# ---------------------------------------------------------------------------

RESOLUTION_SIZES = {
    "1K": "1024x1024",
    "2K": "2048x2048",
    "4K": "4096x4096",
}

# OpenAI-compatible base URLs inferred from provider prefix.
# Also checked: {PREFIX}_BASE_URL env var at runtime.
BASE_URL_MAP = {
    "DASHSCOPE": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    "ARK": "https://ark.cn-beijing.volces.com/api/v3",
}


# ---------------------------------------------------------------------------
# Provider discovery — scan *_IMAGEGEN_MODEL, ordered by ~/.env
# ---------------------------------------------------------------------------

def _read_env_file(env_path: Path) -> list[dict]:
    """Parse a .env file, returning list of {key, value} in file order."""
    entries: list[dict] = []
    try:
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" not in line:
                    continue
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip()
                if key:
                    entries.append({"key": key, "value": value})
    except Exception:
        pass
    return entries


def discover_providers() -> list[dict]:
    """Find all image-gen providers from *_IMAGEGEN_MODEL env vars.

    Order: ~/.env declaration order first, then any remaining os.environ entries.
    Returns list of {prefix, api_key, model, base_url (optional), source}.
    """
    providers: list[dict] = []
    seen_prefixes: set[str] = set()

    # --- pass 1: walk ~/.env so declaration order is preserved ---
    if _HOME_ENV.exists():
        for entry in _read_env_file(_HOME_ENV):
            key = entry["key"]
            if not key.endswith("_IMAGEGEN_MODEL"):
                continue
            prefix = key[: -len("_IMAGEGEN_MODEL")]
            if not prefix or prefix in seen_prefixes:
                continue
            seen_prefixes.add(prefix)

            api_key = os.environ.get(f"{prefix}_API_KEY", "")
            model = entry["value"] or os.environ.get(key, "")
            if api_key and model:
                prov = {
                    "prefix": prefix,
                    "api_key": api_key,
                    "model": model,
                    "source": str(_HOME_ENV),
                }
                base_url = os.environ.get(f"{prefix}_BASE_URL", "")
                if base_url:
                    prov["base_url"] = base_url
                providers.append(prov)

    # --- pass 2: catch any *_IMAGEGEN_MODEL from os.environ not seen yet ---
    for key in sorted(os.environ.keys()):
        if not key.endswith("_IMAGEGEN_MODEL"):
            continue
        prefix = key[: -len("_IMAGEGEN_MODEL")]
        if not prefix or prefix in seen_prefixes:
            continue
        api_key = os.environ.get(f"{prefix}_API_KEY", "")
        model = os.environ.get(key, "")
        if api_key and model:
            seen_prefixes.add(prefix)
            prov = {
                "prefix": prefix,
                "api_key": api_key,
                "model": model,
                "source": "environment",
            }
            base_url = os.environ.get(f"{prefix}_BASE_URL", "")
            if base_url:
                prov["base_url"] = base_url
            providers.append(prov)

    # --- pass 3: legacy fallback — GEMINI_API_KEY without *_IMAGEGEN_MODEL ---
    if "GEMINI" not in seen_prefixes:
        gemini_key = os.environ.get("GEMINI_API_KEY", "")
        if gemini_key:
            providers.append({
                "prefix": "GEMINI",
                "api_key": gemini_key,
                "model": os.environ.get("GEMINI_IMAGEGEN_MODEL", "gemini-3-pro-image-preview"),
                "source": "GEMINI_API_KEY (legacy fallback)",
            })

    return providers


def detect_api_style(prefix: str) -> str:
    """Infer API style from provider prefix.

    Returns 'ark', 'gemini', or 'openai-image'.
    """
    p = prefix.upper()
    if p == "GEMINI":
        return "gemini"
    if p == "ARK":
        return "ark"
    return "openai-image"


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


def _resolve_input_resolution(input_image: str | None, cli_resolution: str | None) -> str:
    """Return the effective resolution string."""
    if cli_resolution:
        return cli_resolution
    if input_image:
        try:
            from PIL import Image as PILImage

            img = PILImage.open(input_image)
            w, h = img.size
            max_dim = max(w, h)
            if max_dim >= 3000:
                return "4K"
            elif max_dim >= 1500:
                return "2K"
            return "1K"
        except Exception as e:
            print(f"Error loading input image: {e}", file=sys.stderr)
            sys.exit(1)
    return "2K"  # production-reference default per SKILL.md


# ---------------------------------------------------------------------------
# ARK (Doubao/Seedream) — native HTTP
# ---------------------------------------------------------------------------

ARK_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"


def _generate_ark(
    provider: dict,
    prompt: str,
    input_image: str | None,
    resolution: str,
    output_path: Path,
) -> bool:
    """Generate via ARK/Doubao Seedream API (native HTTP). Returns True on success."""
    import requests
    from PIL import Image as PILImage

    api_key = provider["api_key"]
    model = provider["model"]

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

    if input_image:
        img = PILImage.open(input_image)
        buf = BytesIO()
        if img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")
        img.save(buf, format="PNG")
        image_b64 = base64.b64encode(buf.getvalue()).decode("ascii")
        payload["image"] = image_b64
        print(f"Editing image with ARK ({model}) at {resolution}…")
    else:
        print(f"Generating image with ARK ({model}) at {resolution}…")

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
        return True

    except Exception as e:
        print(f"ARK API error: {e}")
        return False


# ---------------------------------------------------------------------------
# Gemini backend
# ---------------------------------------------------------------------------

def _generate_gemini(
    provider: dict,
    prompt: str,
    input_image: str | None,
    resolution: str,
    output_path: Path,
) -> bool:
    """Generate / edit via Google Gemini multimodal API.  Returns True on success."""
    from google import genai
    from google.genai import types
    from PIL import Image as PILImage

    client = genai.Client(api_key=provider["api_key"])
    model = provider["model"]

    if input_image:
        input_img = PILImage.open(input_image)
        contents = [input_img, prompt]
        print(f"Editing image with Gemini ({model}) at {resolution}…")
    else:
        contents = prompt
        print(f"Generating image with Gemini ({model}) at {resolution}…")

    try:
        response = client.models.generate_content(
            model=model,
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
# OpenAI-compatible backend  (DASHSCOPE and others)
# ---------------------------------------------------------------------------

def _generate_openai_image(
    provider: dict,
    prompt: str,
    input_image: str | None,
    resolution: str,
    output_path: Path,
) -> bool:
    """Generate via OpenAI-compatible Images API.  Returns True on success."""
    from openai import OpenAI

    base_url = provider.get("base_url") or BASE_URL_MAP.get(provider["prefix"].upper(), "")
    client_kwargs: dict = {"api_key": provider["api_key"]}
    if base_url:
        client_kwargs["base_url"] = base_url

    client = OpenAI(**client_kwargs)
    model = provider["model"]
    size = RESOLUTION_SIZES.get(resolution, "2048x2048")

    if input_image:
        print(
            f"Editing image with {provider['prefix']} ({model}) at {resolution}…\n"
            "Note: OpenAI-compatible image editing support varies by provider.",
        )
    else:
        print(f"Generating image with {provider['prefix']} ({model}) at {resolution}…")

    try:
        response = client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            n=1,
        )
    except Exception as e:
        msg = str(e)
        if any(kw in msg for kw in ("429", "quota", "RESOURCE_EXHAUSTED", "rate_limit")):
            print(f"{provider['prefix']} API quota exceeded.")
        else:
            print(f"{provider['prefix']} API error: {e}")
        return False

    # Try URL first, then b64_json
    import requests as req
    from PIL import Image as PILImage

    choice = response.data[0]
    if choice.url:
        try:
            resp = req.get(choice.url, timeout=60)
            resp.raise_for_status()
            image = PILImage.open(BytesIO(resp.content))
        except Exception as e:
            print(f"Failed to download image: {e}")
            return False
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
        return True

    if choice.b64_json:
        image_data = base64.b64decode(choice.b64_json)
        _save_image(image_data, output_path)
        return True

    return False


# ---------------------------------------------------------------------------
# Provider dispatch
# ---------------------------------------------------------------------------

def _dispatch_generate(
    provider: dict,
    prompt: str,
    input_image: str | None,
    resolution: str,
    output_path: Path,
) -> bool:
    """Route to the correct generate function based on provider prefix."""
    api_style = detect_api_style(provider["prefix"])
    if api_style == "ark":
        return _generate_ark(provider, prompt, input_image, resolution, output_path)
    elif api_style == "gemini":
        return _generate_gemini(provider, prompt, input_image, resolution, output_path)
    else:
        return _generate_openai_image(provider, prompt, input_image, resolution, output_path)


# ---------------------------------------------------------------------------
# Probe command
# ---------------------------------------------------------------------------

def cmd_probe() -> None:
    """Print credential status for all discovered image-gen providers."""
    _load_dotenv_from_home()
    providers = discover_providers()

    if not providers:
        print("No image generation providers found.")
        return

    print(f"Found {len(providers)} image generation provider(s):")
    for i, p in enumerate(providers):
        label = "→" if i == 0 else " "
        extra = f"  base_url={p['base_url']}" if p.get("base_url") else ""
        print(f"  {label} [{p['prefix']}] model={p['model']}  (from {p['source']}){extra}")
    print(f"Active provider: [{providers[0]['prefix']}] {providers[0]['model']}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    # Step 0 — load ~/.env before anything else
    _load_dotenv_from_home()

    if len(sys.argv) > 1 and sys.argv[1] == "probe":
        cmd_probe()
        return

    parser = argparse.ArgumentParser(
        description="Generate images using auto-discovered image generation providers. "
                    "Providers are tried in ~/.env declaration order with automatic fallback."
    )
    parser.add_argument("--prompt", "-p", required=True, help="Image description / prompt")
    parser.add_argument("--filename", "-f", required=True, help="Output filename (e.g. assets/concepts/ship.png)")
    parser.add_argument("--input-image", "-i", help="Optional input image path for editing")
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
             "Prefer setting *_API_KEY in ~/.env instead.",
    )
    parser.add_argument(
        "--provider", "-P",
        help="Force a specific provider prefix (e.g. ARK, DASHSCOPE, GEMINI). "
             "Skips priority order and fallback.",
    )

    args = parser.parse_args()

    # ---- resolve providers ----
    providers = discover_providers()

    if not providers:
        print("Error: No image generation provider configured.", file=sys.stderr)
        print("", file=sys.stderr)
        print("Set at least one *_IMAGEGEN_MODEL + *_API_KEY pair in ~/.env, for example:", file=sys.stderr)
        print("  ARK_IMAGEGEN_MODEL=doubao-seedream-5-0-pro-260628", file=sys.stderr)
        print("  ARK_API_KEY=ark-…", file=sys.stderr)
        print("", file=sys.stderr)
        print("Or set GEMINI_API_KEY for legacy Gemini mode.", file=sys.stderr)
        sys.exit(1)

    # --provider flag overrides priority order (and skips fallback)
    if args.provider:
        match = next((p for p in providers if p["prefix"].upper() == args.provider.upper()), None)
        if match:
            providers = [match]
        else:
            print(f"Warning: provider '{args.provider}' not found. Using default priority.", file=sys.stderr)

    # --api-key flag overrides the first provider's key
    if args.api_key and providers:
        providers[0]["api_key"] = args.api_key

    # ---- output path ----
    output_path = Path(args.filename)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # ---- resolution ----
    resolution = _resolve_input_resolution(args.input_image, args.resolution)

    # ---- try providers in priority order ----
    for i, provider in enumerate(providers):
        if len(providers) > 1:
            label = "→" if i < len(providers) - 1 else ""
            print(f"\n{label} Trying provider [{i + 1}/{len(providers)}]: [{provider['prefix']}] {provider['model']}")

        success = _dispatch_generate(
            provider=provider,
            prompt=args.prompt,
            input_image=args.input_image,
            resolution=resolution,
            output_path=output_path,
        )

        if success:
            full_path = output_path.resolve()
            print(f"\n[OK] Image saved: {full_path}")
            print(f"  Provider used: [{provider['prefix']}] {provider['model']}")
            return

        if i < len(providers) - 1:
            print(f"  Provider '{provider['prefix']}' failed, falling back to next…")

    # All providers failed
    names = ", ".join(p["prefix"] for p in providers)
    print(f"\n[FAIL] Error: All providers failed ({names}).", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
