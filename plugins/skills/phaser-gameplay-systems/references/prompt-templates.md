# Prompt Templates (Phaser Gameplay)

Load this reference only when the user asks for reusable prompts, starter prompts, or a task template.

## New 2D Game Starter

```text
Build a first playable slice of a 2D game using Phaser 4 + TypeScript + Vite + Matter.js.

Genre: <genre>
Core loop: <one-sentence verb + objective + feedback + fail/retry>

Scaffold the project with the Phaser game config, BootScene → GameScene → UIScene, Matter.js physics,
keyboard + touch input, a player entity with physics body, one obstacle/enemy type, one reward/pickup type,
collision handling, score HUD, Web Audio feedback, and diagnostics via window.__PHASER_GAME_DIAGNOSTICS__.

Verify with build, browser, nonblank canvas screenshot, and one real input path.
```

## Add Entity

```text
Add a <entity-name> entity to the Phaser game.

Requirements:
- Visual: <sprite shape, color, size>
- Physics: <body type, isStatic/isSensor, collision properties>
- Behavior: <movement pattern, state machine, interaction>
- Feedback: <audio hook, VFX, animation>

Follow the existing entity pattern in src/entities/. Use Matter.js bodies with labels.
Add diagnostics exposure. Verify with real input.
```

## Add Mechanic

```text
Add a <mechanic-name> mechanic to the Phaser game.

Core mechanic: <what changes, what triggers it, what the player sees/hears>

Implementation checklist:
- [ ] Add state/data in GameScene
- [ ] Add simulation/update in update()
- [ ] Add visual representation (sprites, shapes, tweens)
- [ ] Add feedback (UI update, audio hook, VFX, camera effect)
- [ ] Add diagnostics exposure
- [ ] Verify with real input and one failing edge case
```

## Tune Game Feel

```text
Tune the game feel of the Phaser game. Run several short playtest loops and adjust one axis at a time:

- Movement speed, acceleration, friction
- Jump height, gravity, air control
- Camera follow lag, deadzone
- Dash/boost cooldown, duration, multiplier
- Pickup magnetism radius, collect animation duration
- Hit feedback duration, screen shake intensity
- Difficulty ramp: spawn rate, speed increase, complexity

Record each changed constant. Revert if feel gets worse.
```

## Physics QA

```text
Run physics QA on the Phaser game:

1. Verify Matter.js is configured correctly (gravity, sleeping, debug).
2. Count active bodies and colliders at peak gameplay.
3. Test high-speed movement for tunneling.
4. Test scene restart: all bodies destroyed, no stale collision listeners.
5. Test mobile/low-FPS: clamp delta, verify physics stability.
6. Toggle debug rendering on/off: verify body shapes match visuals.
7. Report: engine (Matter.js), body count, sensor count, collision groups, risks.
```
