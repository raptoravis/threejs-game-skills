# Babylon.js Gameplay Prompt Templates

---

# New Game Prompt

Use `babylon-gameplay-systems` to scaffold and build a Babylon.js game.

Genre:
Target feeling:
Core verb:
Objective:
Pressure:
Reward:
Player expression:

Requirements:
- Use the packaged scaffold (`create_babylon_game.py`).
- Use `@babylonjs/core` with TypeScript and Vite.
- Default camera: ArcRotateCamera for third-person, UniversalCamera for FPS.
- Default lights: HemisphericLight + DirectionalLight with ShadowGenerator.
- Use PBRMaterial for hero surfaces; StandardMaterial for simple props.
- Prefer Havok for physics unless the task fits custom collision.
- Expose `__BABYLON_GAME_DIAGNOSTICS__` and `__BABYLON_GAME_TEST_HOOKS__`.
- Verify with build, browser, screenshot, canvas pixels.

---

# Upgrade Gameplay Prompt

Use `babylon-gameplay-systems` to upgrade this Babylon.js game's mechanics.

Current issues:
Improvements needed:

Requirements:
- Write a design brief and level plan before implementation.
- Implement one mechanic at a time.
- Tune feel with camera lag, acceleration, and feedback.
- Verify each step with a real input path.
