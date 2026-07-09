---
name: phaser-gameplay-systems
description: "Build and iterate playable Phaser 2D game systems. Combines starter scaffold creation, architecture, gameplay implementation, and game-feel tuning. Use for first playable slices, new Vite/TypeScript/Phaser game setup, scene management, entity systems, input, Matter.js physics, scoring, objectives, audio hooks, camera, controls, difficulty, feedback, and maintainable structure."
---

# Phaser Gameplay Systems

## Purpose

Create or evolve a playable 2D browser game loop with clear Scene ownership, responsive controls, deterministic update order, and verified player-facing behavior.

## Use When

Starting a new 2D game, repairing a weak prototype, adding mechanics/entities, designing architecture, tuning camera/controls, implementing rules/objectives, or improving game feel.

## Workflow

Load `references/gameplay-workflows.md` as the first action when the task includes first playable setup, architecture, mechanics, entities, input, camera, collision/physics, scoring, objectives, feedback, or feel tuning.

Load `references/physics-engine-selection.md` before adding or changing physics, collision-heavy gameplay, platformer physics, physics puzzles, projectile physics, sensors, or physics QA. Track both references in a reference ledger with yes/no, path, and failure reason. Do not mark the gameplay phase complete while a required reference is skipped.

Load `references/checklists/new-game-definition-of-done.md` before claiming a new game or first playable slice is complete.

Load `references/checklists/platformer-2d-premium-quality.md` for 2D platformer work.
Load `references/checklists/rpg-2d-premium-quality.md` for 2D RPG or action-RPG work.
Load `references/checklists/tower-defense-2d-premium-quality.md` for 2D tower defense work.
Load `references/checklists/card-game-2d-premium-quality.md` for card game work.
Load `references/checklists/bullet-hell-premium-quality.md` for bullet hell / shoot-em-up work.
Load `references/checklists/rts-2d-premium-quality.md` for 2D RTS work.

Load `references/prompt-templates.md` only when the user asks for reusable prompts, starter prompts, or a task template.

Load `threejs-audio-generator` when implementing real SFX, ambience, UI sounds, voice/TTS, or audio cleanup beyond simple placeholder hooks. Gameplay code should emit audio events; the audio skill should generate or process the actual assets and define the runtime audio matrix.

1. Inspect project structure, scripts, dependencies, current loop, input, camera, entities, state, UI, and diagnostics.
2. Define the one-sentence playable loop: verb, objective, feedback, fail/retry.
3. Choose Scene boundaries: `BootScene` (minimal preload), `GameScene` (core gameplay), `UIScene` (HUD overlay), plus `MenuScene`/`PreloadScene` as needed.
4. Implement mechanics in playable increments: input, state, entity, collision/physics, feedback, HUD/audio hook, diagnostics.
5. Tune feel: movement, acceleration, jump/gravity, camera follow/deadzone, impact, cooldowns, difficulty, restart loop.
6. Keep `update(time, delta)` allocation-light and update order explicit. Always use `delta` for frame-rate-independent movement.
7. Verify with build, browser, screenshot, canvas pixels, console/page errors, and one real input path.

## Packaged Scaffold

Use the bundled scaffold when starting a new project or when the user asks for a starter game:

```bash
python3 <this-skill-dir>/scripts/create_phaser_game.py ./my-game
```

The script copies `assets/phaser-vite-game/`, rewrites the project name in `package.json` and `package-lock.json`, and keeps generated games self-contained with their own visual test and canvas-inspection script. Use `--force` only when the target directory may be overwritten.

## Library Guidance

- Use TypeScript, Vite, Phaser modules.
- Phaser 4 is the default target. Use `phaser@^4.2.0` from npm.
- Matter.js is Phaser's built-in physics engine. Enable via `physics: { default: 'matter' }`. No separate npm package needed.
- Arcade Physics for simple AABB/circle collision when authored feel matters more than simulation.
- Custom collision for grid-aligned movement, card games, and turn-based games that do not need a physics engine.
- `lil-gui` for live-tuned constants when useful.
- Web Audio for runtime playback and procedural feedback; `threejs-audio-generator` for generated game audio assets.
- Use Phaser's ScaleManager with `FIT` mode for responsive/mobile-friendly sizing.

## Common Failure Modes

- Static scene instead of playable loop.
- Mechanic compiles but cannot be triggered by real input.
- Camera/controls feel delayed or hide the next decision.
- State changes do not drive UI/audio/VFX.
- Architecture abstractions appear before mechanics need them.
- Frame-based movement instead of delta-based (breaks at different refresh rates).
- Scene restart leaves stale game objects, timers, listeners, or physics bodies.
- Physics bodies not destroyed on scene shutdown.

## Final Response

Report the reference ledger, gameplay checklist outcome, behavior, controls, changed files, architecture choices, tuned values, verification evidence, artifacts, and remaining edge cases.
