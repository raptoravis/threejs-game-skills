# Mobile Input Checklist (Babylon.js)

Use this for mobile render and input issues in Babylon.js games.

## Viewport & Canvas

- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">`.
- [ ] Canvas CSS: `width: 100%; height: 100%; display: block;`.
- [ ] `engine.resize()` called on `resize` and `orientationchange`.
- [ ] `engine.setHardwareScalingLevel()` appropriate for device.
- [ ] Safe-area insets respected in HUD positioning (`env(safe-area-inset-*)`).

## Touch Input

- [ ] `scene.onPointerDown` / `scene.onPointerMove` / `scene.onPointerUp` used for touch.
- [ ] `touch-action: none` on canvas to prevent browser gestures.
- [ ] Pointer capture released on `pointerup`/`pointercancel`.
- [ ] Multi-touch handled (two-finger vs single-finger differentiated).
- [ ] Virtual joystick / buttons sized ≥ 44×44 CSS px.
- [ ] Touch controls separated by ≥ 12px.
- [ ] `event.preventDefault()` only on consumed gestures, not all.

## Mobile Babylon.js Specific

- [ ] `BABYLON.TouchCamera` or ArcRotateCamera with touch inputs configured.
- [ ] `camera.panningSensibility` and `angularSensibility` tuned for mobile.
- [ ] No `keyboardObservable`-only controls (mobile has no keyboard).
- [ ] Post-processing reduced or adaptive on mobile.
- [ ] Particle count capped on mobile.
- [ ] Shadow maps disabled or single low-res on mobile.
- [ ] `engine.setHardwareScalingLevel(0.5–0.75)`.

## Common Mobile-Only Bugs

- [ ] Game starts but touch does nothing (keyboard-only input handling).
- [ ] Canvas too small or too large after rotation.
- [ ] HUD text unreadable on narrow screens.
- [ ] Double-tap zoom conflicts with game controls.
- [ ] Pull-to-refresh or swipe-back gesture stealing input.
- [ ] Audio not playing (requires user-gesture unlock on mobile).
- [ ] Babylon Inspector left enabled in production.
