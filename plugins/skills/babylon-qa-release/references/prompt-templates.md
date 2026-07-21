# Babylon.js QA/Release Prompt Templates

Reusable prompt templates packaged with this skill. Use only templates relevant to the current request.

---

# QA Pass Prompt

Use `babylon-qa-release` to verify this Babylon.js game.

Game URL:
Controls to test:
- Move:
- Action:
- Objective:

Check:
- Console/page errors.
- Canvas nonblank and visually varied.
- Desktop and mobile screenshots.
- Main input changes game state.
- Objective and fail/retry paths.
- HUD text fit, safe areas, touch targets.
- Renderer diagnostics when graphics changed.
- Physics body cleanup on restart when relevant.
- Audio unlock and loop cleanup when relevant.

---

# Release Prep Prompt

Use `babylon-qa-release` to prepare this Babylon.js game for release.

Ensure:
- Production build passes and preview works.
- Vite `base` matches target host.
- Babylon Inspector and debug UI gated or removed.
- Bundle and large assets reviewed.
- API keys absent from client code.
- Deploy command documented.
- Residual risks listed.
