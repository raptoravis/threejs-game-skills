# Game Feel

Use this reference when a game "works" but does not feel good: the primary verb lands without weight, hits read as bookkeeping, pickups vanish silently. Game feel (juice) is the layer of response, contact feedback, and audio-visual sync that turns correct mechanics into satisfying ones.

Game feel is state communication, not decoration. Apply effects in this order of operations; each layer depends on the one before it:

1. Input latency: the primary verb must produce a visible response within ~100ms. Fix this first; no amount of juice hides a laggy control.
2. Response curves: acceleration, easing, and overshoot on the player's own motion.
3. Contact feedback: what happens at the moment of impact, pickup, or score (flash, squash, hitstop, shake).
4. Camera: shake, zoom punch, and pan that amplify contact without hiding the field of play.
5. Audio-visual sync: sound fires on the same frame as the visual, with pitch/volume variance so repeats stay alive.

Readability rule: feedback must clarify game state, never obscure the next decision. If shake, flash, or hitstop hides the thing the player must react to next, it is a bug, not polish. Scale every effect so the strongest events (death, explosion) are unmistakable and the weakest (pickup) stay subtle.

All code below is copy-pasteable, strict-TS clean, and matches the Phaser 4 scaffold (`phaser@^4.2.0`, Scene lifecycle, `update(time, delta)`, `createSeededRandom`). Code lives inside a Scene context; `this` refers to the owning `Phaser.Scene`.

## Tween / Easing Helper

Phaser ships a built-in tween manager (`this.tweens.add(...)`), but a deterministic, delta-driven helper updated inside `update(time, delta)` is useful when you want feel tweens to stay live during hitstop (where you scale the gameplay delta but keep feedback on the real delta). The three curves below cover 90% of feel work.

```ts
export type Easing = (t: number) => number;

export const easeInQuad: Easing = (t) => t * t;
export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutBack: Easing = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

interface ActiveTween {
  elapsed: number;
  duration: number;
  easing: Easing;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}

export class TweenManager {
  private readonly tweens: ActiveTween[] = [];

  tween(
    durationSec: number,
    onUpdate: (value: number) => void,
    easing: Easing = easeOutCubic,
    onComplete?: () => void,
  ): void {
    this.tweens.push({ elapsed: 0, duration: durationSec, easing, onUpdate, onComplete });
  }

  update(deltaSec: number): void {
    for (let i = this.tweens.length - 1; i >= 0; i -= 1) {
      const t = this.tweens[i];
      t.elapsed += deltaSec;
      const k = Math.min(t.elapsed / t.duration, 1);
      t.onUpdate(t.easing(k));
      if (t.elapsed >= t.duration) {
        t.onComplete?.();
        this.tweens.splice(i, 1);
      }
    }
  }
}
```

Update the manager with the **real** delta in seconds (feedback must stay live during hitstop). `easeOutBack` returns values above 1 near the end; that overshoot is the bounce. When hitstop is not a concern, prefer Phaser's native `this.tweens.add({ targets, ..., duration, ease, onComplete })` for scene-managed cleanup.

## Trauma-Based Screenshake

Add trauma on events; shake is `trauma²` so small events barely move the camera and big ones snap hard. Trauma decays linearly per second and is hard-capped. Phaser's `this.cameras.main.shake(duration, intensity)` is fine for one-shot shakes, but a trauma rig gives you stacking, decay control, and deterministic noise. Drive the noise from accumulated game time (deterministic), not wall clock.

```ts
import Phaser from 'phaser';

const TRAUMA_MAX = 1;
const TRAUMA_DECAY = 1.4; // trauma units per second
const MAX_OFFSET = 14; // pixels at full shake
const MAX_ROLL = 0.06; // radians at full shake

// Deterministic value noise in [-1, 1]; per-axis seed keeps axes independent.
function pseudoNoise(t: number, seed: number): number {
  const x = Math.sin(t * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

export class ShakeRig {
  private trauma = 0;
  private time = 0;

  addTrauma(amount: number): void {
    this.trauma = Math.min(TRAUMA_MAX, this.trauma + amount);
  }

  // Call every frame AFTER the camera follow/scroll has been applied.
  update(deltaSec: number, camera: Phaser.Cameras.Scene2D.Camera): void {
    this.time += deltaSec;
    this.trauma = Math.max(0, this.trauma - TRAUMA_DECAY * deltaSec);
    if (this.trauma <= 0) return;
    const shake = this.trauma * this.trauma;
    const freq = this.time * 32;
    // Additive pixel offset + roll. Camera follow re-derives scrollX/scrollY
    // each frame, so the offset does not accumulate across frames.
    camera.scrollX += MAX_OFFSET * shake * pseudoNoise(freq, 1);
    camera.scrollY += MAX_OFFSET * shake * pseudoNoise(freq, 2);
    camera.rotation += MAX_ROLL * shake * pseudoNoise(freq, 3);
  }
}
```

Recommended trauma per event: pickup `0.15`, hit `0.4`, explosion `0.7`. Cap at `1.0` so stacked events cannot fling the camera. The additive offset does not accumulate because the camera follow re-derives `scrollX`/`scrollY` from the follow target every frame, and Phaser's internal camera render applies rotation on top.

For simpler one-shot shakes where stacking control is not needed, `this.cameras.main.shake(120, 0.012)` is acceptable, but it cannot be layered cleanly with hitstop or a deterministic seed.

## Hitstop

A brief freeze on heavy contact sells weight. Scale the gameplay delta, never pause the Phaser game or the Scene's `update`. Phaser's `this.time.timeScale` scales the whole Scene clock (including tweens and timers), which is usually NOT what you want for feel — feedback must keep moving. Instead, scale a gameplay-only delta and feed the real delta to camera, shake, tweens, and HUD.

```ts
// Fields on GameScene:
private timeScale = 1;
private hitstopRemaining = 0;

hitstop(durationMs: number, scale = 0.05): void {
  this.hitstopRemaining = Math.max(this.hitstopRemaining, durationMs / 1000);
  this.timeScale = scale;
}

update(time: number, deltaMs: number): void {
  const delta = deltaMs / 1000; // seconds

  if (this.hitstopRemaining > 0) {
    this.hitstopRemaining -= delta; // decay in REAL time
    if (this.hitstopRemaining <= 0) this.timeScale = 1;
  }
  const gameplayDelta = delta * this.timeScale;

  // Gameplay reads the scaled delta so the world crawls...
  this.player.update(gameplayDelta, this.input, this.tuning);

  // ...but camera, shake, tweens, and HUD read the REAL delta so feedback stays live.
  this.cameraSystem.update(delta);
  this.shakeRig.update(delta, this.cameras.main);
  this.tweens.update(delta);
}
```

Recommended: 60-90ms at `0.05` scale on heavy hits only. Never set `this.scene.pause()` or `this.time.timeScale = 0` to create the freeze — pausing stops tweens, timers, and the render draw so the frozen moment is never visible and feedback dies. Only the gameplay delta is scaled; the Scene keeps running.

If you do want a Scene-wide slow-mo (not hitstop), `this.time.timeScale = 0.2` is valid, but be aware it also scales Phaser tweens and timers — use the explicit gameplay-delta split above when feedback must stay snappy.

## Squash-and-Stretch

Deform on impact or jump, then overshoot back with `easeOutBack`. In 2D there are two scale axes (x, y); preserve area by scaling one axis by `s` and the other by `1 / s`.

```ts
import Phaser from 'phaser';
import { TweenManager, easeOutBack } from './tweenManager';

// Impact squash (squashY < 1 flattens vertically and widens horizontally).
// Jump stretch uses squashY > 1 to elongate vertically and narrow horizontally.
squash(
  target: Phaser.GameObjects.Sprite,
  tweens: TweenManager,
  squashY = 0.85,
  durationSec = 0.18,
): void {
  const startX = 1 / squashY; // area-preserving counter-scale
  tweens.tween(
    durationSec,
    (t) => {
      const y = squashY + (1 - squashY) * t; // squashY -> 1
      const x = startX + (1 - startX) * t; // stretch -> 1
      target.setScale(x, y);
    },
    easeOutBack, // overshoot past 1 gives the bouncy settle
  );
}
```

Use ~1.15 stretch on jump takeoff and ~0.9 squash on landing, both returning over ~180ms. The equivalent with Phaser's native tween:

```ts
this.tweens.add({
  targets: sprite,
  scaleY: { from: 0.85, to: 1 },
  scaleX: { from: 1 / 0.85, to: 1 },
  duration: 180,
  ease: 'Back.out',
});
```

Set the sprite's `originY` to a fixed value (e.g. `0.5` or `1` for ground-aligned sprites) before scaling, or the squash will drift the sprite off its contact point.

## Camera Shake / Zoom Punch

An additive zoom bump reads as acceleration or shock. Phaser camera `zoom` is multiplicative on the base zoom; decay the punch toward 0 with a ~200ms time constant and add it to the base each frame.

```ts
import Phaser from 'phaser';

export class CameraSystem {
  private baseZoom = 1;
  private zoomPunch = 0; // additive, applied as multiplier offset

  constructor(private camera: Phaser.Cameras.Scene2D.Camera) {
    this.baseZoom = camera.zoom;
  }

  punchZoom(amount: number): void {
    // additive, clamped. Higher zoom = zoom-in = punch effect.
    this.zoomPunch = Math.min(0.2, this.zoomPunch + amount);
  }

  update(deltaSec: number): void {
    if (this.zoomPunch <= 0.001) return;
    this.zoomPunch *= Math.exp(-deltaSec / 0.2);
    if (this.zoomPunch < 0.001) this.zoomPunch = 0;
    this.camera.zoom = this.baseZoom + this.zoomPunch;
  }
}
```

Recommended `+0.04..0.08` zoom on boost, dash, or hit. Phaser applies `camera.zoom` directly each render, so no projection-matrix update call is needed (unlike a 3D perspective camera). Combine with `this.cameras.main.flash(120, 255, 255, 255)` for a full-frame white flash on big events.

For directional camera kick on impact, apply a one-shot scroll offset via `this.cameras.main.pan(...)` with a short duration, or nudge `scrollX/scrollY` in the impact direction and let the camera follow re-center on the next frame.

## Impact Flash

Pulse a tint/alpha on the hit sprite and tween it back. Store the base value once; the clearest 2D flash is a white tint via `setTint(0xffffff)` coupled with a brief alpha boost, or a dedicated flash frame in the sprite atlas.

```ts
import Phaser from 'phaser';
import { TweenManager, easeOutCubic } from './tweenManager';

flashHit(
  sprite: Phaser.GameObjects.Sprite,
  tweens: TweenManager,
  peakAlpha = 1,
  durationSec = 0.22,
): void {
  const base = (sprite.getData('baseAlpha') as number | null) ?? sprite.alpha;
  sprite.setData('baseAlpha', base);
  sprite.setAlpha(peakAlpha);
  sprite.setTintFill(0xffffff); // solid white tint fill
  tweens.tween(
    durationSec,
    (t) => {
      sprite.setAlpha(base + (peakAlpha - base) * (1 - t)); // peak -> base
    },
    easeOutCubic,
    () => {
      sprite.clearTint();
      sprite.setAlpha(base);
    },
  );
}
```

`setTintFill(0xffffff)` replaces the sprite pixels with solid white (ignores texture color); `clearTint()` restores the original texture. For sprites without a tint-friendly texture, layer a white duplicate sprite on top and tween its alpha from `1 -> 0`.

For big events (explosion, death), add a one-frame full-screen white flash via Phaser's camera flash: `this.cameras.main.flash(100, 255, 255, 255)`. This never touches your sprite pipeline and stays cheap.

## Pickup Pop

Collected items should pop, rise, and fade rather than blink out. In Phaser, animate the sprite's scale and y-position, then tween alpha to 0 and deactivate it (pool it, do not destroy if pickups recur).

```ts
import Phaser from 'phaser';
import { TweenManager, easeOutCubic } from './tweenManager';

playPickupPop(
  sprite: Phaser.GameObjects.Sprite,
  tweens: TweenManager,
): void {
  const startY = sprite.y;
  const startXScale = sprite.scaleX;
  const startYScale = sprite.scaleY;
  tweens.tween(
    0.28,
    (t) => {
      const s = 1 + 0.6 * (1 - t); // 1.6 -> 1.0 (relative pop)
      sprite.setScale(startXScale * s, startYScale * s);
      sprite.y = startY - t * 24; // rise in pixels
      sprite.setAlpha(1 - t); // fade
    },
    easeOutCubic,
    () => {
      sprite.setActive(false).setVisible(false);
      // Return to pool instead of destroy() if pickups recur.
    },
  );
}
```

The native Phaser equivalent:

```ts
this.tweens.add({
  targets: sprite,
  scaleX: { from: sprite.scaleX * 1.6, to: sprite.scaleX },
  scaleY: { from: sprite.scaleY * 1.6, to: sprite.scaleY },
  y: sprite.y - 24,
  alpha: 0,
  duration: 280,
  ease: 'Cubic.out',
  onComplete: () => sprite.setActive(false).setVisible(false),
});
```

Punch the HUD counter on the same event. For a DOM-overlay HUD, reuse a WAAPI pattern:

```ts
punchScore(scoreElement: HTMLElement): void {
  scoreElement.animate(
    [{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
    { duration: 120, easing: 'ease-out' },
  );
}
```

For a Phaser-text HUD inside a UIScene, tween the `Text` game object's scale:

```ts
this.tweens.add({
  targets: scoreText,
  scale: { from: 1.2, to: 1 },
  duration: 120,
  ease: 'Cubic.out',
});
```

## Gamepad Rumble

Feature-detect `vibrationActuator`; `playEffect` returns a promise that may reject on unsupported hardware, so swallow it. This is the same Web API regardless of engine.

```ts
export function rumble(durationMs: number, strong = 0.6, weak = 0.3): void {
  const pads = navigator.getGamepads?.() ?? [];
  for (const pad of pads) {
    const actuator = pad?.vibrationActuator;
    if (!actuator) continue; // optional chaining covers older browsers
    void actuator.playEffect('dual-rumble', {
      duration: durationMs,
      strongMagnitude: strong,
      weakMagnitude: weak,
    });
  }
}
```

Match rumble to the hit: light (180ms, 0.3) on pickups, heavy (250ms, 0.9) on death or explosion.

## Audio Feel Coupling

Identical repeated samples feel cheap: the ear detects the exact repeat as artificial (the "machine-gun" effect). Vary pitch per playback, and duck ambient/music while hitstop holds so the impact reads. Use Phaser's `this.sound.add(key)` / `sound.play(key, config)` with a `rate` (playbackRate) variance, or drive raw Web Audio for fine control.

```ts
import Phaser from 'phaser';

// AudioSystem: pitch-vary each shot; duck holds during hitstop.
export class AudioSystem {
  private duck = 1;

  constructor(private soundManager: Phaser.Sound.BaseSoundManager) {}

  // rng is the seeded RNG so pitch variance stays deterministic under test.
  play(key: string, rng: () => number, baseVolume = 0.8): void {
    const rate = 1 + (rng() - 0.5) * 0.12; // +/-6% pitch
    this.soundManager.play(key, {
      rate,
      volume: baseVolume * this.duck,
    });
  }

  setDuck(value: number): void {
    this.duck = value; // e.g. 0.6 while hitstop is active, 1 otherwise
  }
}
```

For raw Web Audio control (outside Phaser's sound manager), use `AudioContext` with a `playbackRate.value` of `1 + (rng() - 0.5) * 0.12` and a gain node scaled by `this.duck`. Pass `this.rng` (the seeded RNG) as the `rng` argument so pitch variance stays deterministic under test.

## Tuning Table

Map each event to a full feedback stack. Stronger events get more layers and higher magnitudes.

| Event          | Feedback stack                                                                 |
| -------------- | ------------------------------------------------------------------------------ |
| Pickup         | pickup pop + HUD counter punch + pitch-varied chime + `0.15` trauma            |
| Player hit     | hitstop 70ms + `0.4` trauma + impact flash + rumble (180ms) + HUD pulse        |
| Enemy killed   | hitstop 40ms + `0.3` trauma + impact flash + pitch-varied boom                 |
| Boost / dash   | zoom punch +0.06 + stretch (1.15) + whoosh + light rumble                      |
| Jump / land    | stretch on takeoff, squash (0.9) on landing + step audio + `0.2` trauma on land |
| Explosion      | hitstop 90ms + `0.7` trauma + camera white flash + zoom punch +0.08 + heavy rumble |

## Anti-Patterns

- Constant camera shake, or shake with no decay: nauseating and it hides the play field. Phaser's `camera.shake()` with long durations is a common offender.
- Trauma added without the `trauma²` curve or the hard cap: small events feel violent, stacked events fling the camera.
- Hitstop via `this.scene.pause()` or `this.time.timeScale = 0`: this stops tweens, timers, and the render so feedback dies and the frozen moment is invisible. Scale a gameplay-only delta instead.
- Hitstop on every minor event: the game feels laggy instead of weighty. Reserve it for heavy contact.
- Feedback that blocks or delays input: never gate the primary verb behind an animation finishing.
- Effects driven by wall clock or the raw gameplay delta: they desync from the simulation and break during hitstop or on frame drops. Drive time-based effects from accumulated game time passed through `update(time, delta)`; drive feedback tweens/camera from the real render delta.
- Tint flash without restoring via `clearTint()`: the sprite stays white forever.
- `Math.random` in any gameplay or effect path: it breaks the deterministic test hooks and screenshot baselines.
- Sprite squash without a fixed `origin`: the sprite drifts off its contact point during the deform.
- Zoom punch added to `camera.zoom` without decaying back to the base: the camera creeps in over the session.

## Determinism

Route **all** randomness — pitch variance, spawn jitter, shake seeds if you seed them — through `createSeededRandom` (see `src/utils/random.ts`), never `Math.random`. Drive time-based effects (shake noise, ambient motion) from accumulated game time passed through `update(time, delta)` (the `time` argument in milliseconds, or a seconds accumulator you derive from `delta`), not `performance.now()` or `Date.now()`. This keeps the `seed()` and `setReducedMotion()` test hooks reproducible so visual baselines and bot playtests stay stable.

Prefer the explicit `TweenManager` updated with the real delta over Phaser's scene tween manager when determinism across hitstop is required, because `this.tweens` is itself driven by `this.time` and will slow down under `this.time.timeScale`.
