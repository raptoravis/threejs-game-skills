# Game Feel Checklist

Use before claiming a game feels good, is juicy, is polished, or is premium. Pairs with references/game-feel.md.

- The primary verb produces a visible response within 100ms of input.
- Every scoring, pickup, damage, and death event has at least one visual and one audio response.
- Screenshake is trauma-based with the `trauma²` curve, per-second decay, and a hard cap (or a bounded one-shot `camera.shake()`).
- Trauma/shake magnitude scales with event weight (pickup subtle, explosion unmistakable).
- Hitstop scales the gameplay delta only; camera, shake, tweens, and HUD keep the real delta.
- Hitstop is never created via `scene.pause()` or `time.timeScale = 0`; only a gameplay-only delta is scaled.
- Hitstop is reserved for heavy contact, not fired on every minor event.
- The Phaser Scene `update(time, delta)` keeps running so the frozen moment stays visible.
- Squash-and-stretch preserves area and settles with an overshoot (easeOutBack / `Back.out`).
- Sprites have a fixed `origin` before scaling so squash does not drift the contact point.
- Zoom punch decays back to the base zoom (no permanent creep over the session).
- Camera flash (`camera.flash(...)`) is used for big one-frame events, not spammed on every hit.
- Impact flash restores the sprite via `clearTint()` and tweens alpha back to its base.
- Feedback never obscures the next player decision (shake/flash/hitstop stay readable).
- Gamepad rumble is feature-detected and matched in strength to the event.
- Repeated audio samples use rate/volume variance (via Phaser sound `rate` config or Web Audio) so they never sound identical.
- All gameplay and effect randomness routes through `createSeededRandom`, never `Math.random`.
- Time-based effects are driven by accumulated game time (`time`/`delta` from `update`), not wall clock.
- Each core event maps to a full feedback stack (see the tuning table), not a single cue.
