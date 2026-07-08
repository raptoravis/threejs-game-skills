# FPS Premium Quality Checklist

## Weapon System
- Weapon set includes at least 3 distinct weapon types with unique firing loops: fire rate (semi/burst/auto), magazine capacity + reload timing, and spread/bloom that degrades over sustained fire.
- Hitscan + projectile hybrid: raycast for hit registration (instant feedback), separate projectile entity for visual tracer. Pure physics projectiles for every bullet is a performance disaster.
- ADS (Aim Down Sights): toggle/hold that narrows FOV, reduces spread, slows movement, optionally swaps scope camera. Separate world-FOV and viewmodel-FOV.
- First shot from any non-shotgun weapon always goes exactly where crosshair points — regardless of movement state or prior recoil. Breaking this creates "the game ate my shot" feeling.
- Damage falloff curves per weapon class + headshot multiplier (1.5x-3x depending on weapon). These two parameters are the minimum for weapon role differentiation.
- Reload: active, interruptible by weapon swap; magazine count updates on the magazine-seated animation frame (not start/end). Tactical reload (rounds in chamber, no bolt pull) vs. dry reload (full cycle with bolt).

## Recoil System
- Three interacting sub-systems: (1) visual weapon bounce — auto-resets between shots; (2) deterministic pattern recoil — learnable spray pattern, does NOT auto-reset (player compensation agency); (3) spread bloom — accuracy cone that widens with sustained fire then recovers. Visual recoil and camera recoil must be decoupled.
- Crosshair dynamically mirrors spread cone state in real-time: expands with recoil, contracts with recovery, changes color on enemy hit vs. ally vs. environment. Static crosshair loses 70% of its design value.
- Recoil modifiers per attachment (compensator, grip, stock) with visible crosshair change.

## Camera & Movement
- Camera hierarchy: PlayerRoot (collision + world movement) → PlayerBody (Y-rotation only) → CameraPivot (X-pitch) → Camera (Z-roll for shake). Camera must NEVER be a direct child of player root.
- Raw input only: no smoothing, no acceleration, no dead zone on mouse. Frame-rate independent via deltaTime.
- FOV changes are designed effects: wider during sprint, narrower during ADS, subtle pulse on damage taken.
- Separate sensitivity sliders for hip-fire, ADS, and scope levels.

## Hit Registration & Feedback
- Hit registration uses fired-frame history: store reticle position for last 3-5 frames; award borderline hits that latency would have missed.
- Near-miss leniency curve: borderline misses mapped to hit probability curve. Applied before trigger pull, never after.
- Hit feedback per bullet: (a) crosshair hit marker flash, (b) damage number/directional indicator, (c) material-differentiated hit sound (metal ping vs. flesh thud vs. concrete crack), (d) enemy flinch/hit reaction. On kill: distinct kill sound + killfeed entry + optional hitstop (1-3 frames for sniper/melee).
- Death recap/killcam: in single-player, show what killed you (source, damage type, direction). In multiplayer, killcam from enemy perspective. Deaths that teach nothing are wasted frustration.

## Weapon Audio
- 5-layer gunfire architecture: (1) transient crack, (2) body, (3) sub/LFE bass, (4) mechanical clicks/bolts (plays ~100-150ms before transient for physical weight), (5) environmental tail. 3-6 randomized variations per layer.
- Distant gunfire uses filtered, distinct versions — ally at 50m sounds different from point-blank.
- Empty-magazine audio differentiation: last 2-3 rounds audibly change (higher pitch, metallic ping). Muscle-memory training embedded in audio.
- Audio priority mixing: incoming damage > enemy footsteps within 10m > ally footsteps > ambient. Critical sounds duck or cut through all other audio.

## Enemy Set & AI
- At least 3 enemy archetypes with distinct silhouettes, movement patterns, threat levels, and death behaviors.
- Enemy AI includes detection states (idle, suspicious, alert), pursuit, cover usage/evasion, attack telegraph, hit reaction, death.
- Enemy telegraphs readable before damage lands; player has reaction window.
- Enemy group behavior: turn-taking (1-2 attack at a time), off-screen attack cooldowns, aggro redistribution.

## Level Design
- Level includes verticality, varied engagement distances, cover points, readable landmarks.
- Spawn logic avoids player line-of-sight; no spawn-camping dead zones.
- Combat corridor principle: vertical column down screen center never obscured by weapon animations. Reload, firing recoil, weapon sway all happen below and to sides.

## HUD
- Crosshair: dynamic, weapon-class-specific shape (cross for rifles, circle for shotguns, chevron for precision), real-time spread/recoil/state indicator.
- Ammo: current magazine large + reserves small, co-located with weapon model. Diegetic on-weapon display preferred.
- Health: peripheral, animated, low-health urgency cues at <25% (screen-edge red, audio heartbeat).
- Minimap/compass, killfeed (recent 4-5 kills with weapon icon), objective marker with on-screen direction.
- Elements must be peripheral-scannable — never require staring away from crosshair.

## Mobile
- Dual-thumb virtual sticks are baseline but suffer from screen occlusion (30-40%) and claw-grip strain. Gyro/tilt assist for fine aiming is essential for precision.
- Dedicated fire button separate from aim zone; tap-to-shoot on aim area causes accidental discharge.
- Touch tracking must follow the finger; snap-back only on finger lift.
- Customizable HUD layout: players must reposition/resize every on-screen control.
- Auto-fire option for accessibility with configurable burst length.
- Input buffering and configurable aim-assist to compensate for inherently higher touch latency.

## Performance
- Object pooling for projectiles, impact VFX, shell casings. Zero per-frame instantiation during firefights.
- Renderer diagnostics checked under maximum combat load (peak enemies + VFX + level draw calls).

## Playtest
- Game loop tested through: exploration → engagement → resource pressure → elimination → wave/room clear → fail/retry.
- First-shot accuracy verified at all movement states and recoil stages.
- Hit registration leniency tested at 30fps, 60fps, and 144fps.
