# Prompt Templates (Phaser Debug/Profile)

Load this reference only when the user asks for reusable prompts.

## Debug Blank Screen

```text
Debug this Phaser game: the canvas shows a blank/black screen.

Checklist:
1. Browser console errors?
2. Phaser game config: type, parent, physics enabled?
3. Scene keys match? All scenes registered in config?
4. preload() loads all assets? create() initializes game objects?
5. Canvas element exists and is visible in DOM?
6. Any opaque overlay scene covering the game?
```

## Debug Physics

```text
Debug Matter.js physics in this Phaser game.

1. Enable debug rendering: matter.debug = true.
2. Verify body shapes match sprite positions and sizes.
3. Check body labels for correct collision filtering.
4. Verify isStatic/isSensor flags.
5. Add collision event logging to verify handlers fire.
6. Check body count before/after scene restart.
```

## Performance Profile

```text
Profile the performance of this Phaser 2D game.

1. Record FPS at idle and peak gameplay.
2. Count active game objects per scene.
3. Count physics bodies and particle emitters.
4. Check texture memory.
5. Identify per-frame allocations in update().
6. Verify object pooling for frequently created objects.
7. Take Chrome DevTools Performance recording at peak gameplay.
8. Report: baseline metrics, bottlenecks, proposed fixes.
```

## Mobile Debug

```text
Debug mobile issues in this Phaser game.

1. Test on real device or Chrome device emulation.
2. Check viewport meta tag and ScaleManager config.
3. Verify touch input: tap, swipe, multi-touch all work.
4. Check touch target sizes (44x44pt minimum).
5. Test portrait + landscape.
6. Check for content hidden behind mobile browser chrome.
7. Verify 60fps on emulated mid-range mobile device.
```
