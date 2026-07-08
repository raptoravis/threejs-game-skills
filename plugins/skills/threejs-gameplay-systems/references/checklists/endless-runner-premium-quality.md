# Endless Runner Premium Quality Checklist

## Core Loop & Scrolling
- Scrolling uses fixed-timestep physics (60Hz baseline) with inter-frame interpolation; zero GC-induced stutter on the scroll plane.
- Curve/turn segments are authored, not infinite straight-line: camera path follows player position dynamically through bends with look-ahead rotation.
- Difficulty ramps through speed increase + obstacle density + pattern complexity + shorter rest gaps; not speed alone.
- Rest gaps between obstacle clusters never shrink to zero; breathing room is mandatory even at max difficulty.

## Obstacle Generation & Validation
- Segment templates are pre-authored and validated, not pure-random: every template must pass a solvability check proving at least one dodge path exists.
- At least 3 obstacle families with distinct silhouettes, colors/materials, and telegraphing (low barrier, gate/arch, moving/animated hazard).
- Obstacle spacing follows beat-timing (~400-600ms reaction windows at current speed) rather than fixed pixel distance; inconsistent spacing destroys muscle memory.
- Composite patterns (jump + lane-switch simultaneously) appear only after individual components are taught in isolation.

## Player & Controls
- Player avatar has a strong readable silhouette from the chase camera with visible subassemblies (body, limbs/treads, trail/afterimage, state feedback).
- Collision proxy is 15-20% smaller than visual mesh; near-miss zone (1.5-2x collision width) awards bonus score without killing.
- Input buffering: 80-120ms window stores the next queued input so slightly-early presses register.
- Out-of-bounds grace time: 100ms beyond lane edge before death triggers.
- Lane-switch input commits on the action frame; animation catches up via easeOutQuad in &lt;=150ms.
- Two-axis independence: lane-switch (left/right) and vertical dodge (jump/roll) are orthogonal; compound inputs are valid.
- Touch-only design: full-screen gesture zones (swipe for lane, swipe for jump/roll, tap for power-up). No virtual joysticks. Thumb never occludes the play area.

## Camera
- Horizontal offset: player at 30-40% screen position, 60-70% screen ahead for incoming obstacles ("look-ahead offset").
- Dynamic FOV: wider at high speed (danger signal), narrower at low speed (safety signal), synchronizing player psychological state with visual cue.
- Near-miss camera shake; spring-damped smooth follow through curves with roll on sharp turns.
- Shadow or ground marker directly below player for depth perception on landing.

## Rewards & Pickups
- At least 2 reward/interactable variants beyond one recolored pickup, readable at distance with collection feedback.
- Collectible density follows variable-ratio schedule: dense clusters → sparse gaps → dense clusters (more addictive than uniform distribution).
- Coin pickups play ascending pitch sequence on consecutive collects, reinforcing streak reward.

## World & Environment
- Themed environments that change within a 4-5 second window; unbroken horizon/sky gradient; parallax background layers.
- Foreground, midground, and background layers create speed and depth; not one flat lane.
- World segments include reusable procedural prop kits, not only stretched boxes.
- Skyline/world modules include rooflines, setbacks, signage/window bands, supports, cables, antennas, or parallax layers.

## Speed & Motion Feedback
- Speed effects reinforce motion while preserving the next lane decision: FOV kick, motion streaks/particles, environment whoosh.
- Death feedback: 0.1-0.15s hitstop → 0.3s slow-motion → camera shake → debris particles → screen-edge flash. Multi-channel event stack.
- Near-miss feedback: afterimage trail + score popup + camera micro-shake + wind-whoosh audio swell.

## HUD & Meta-Game
- HUD prioritizes run state: distance/progress, score/streak, health/shield (if any), boost/overdrive, fail/retry.
- HUD is not a grid of generic debug/stat cards.
- Mission system: 3 simultaneous objectives; completing all 3 awards +1 permanent multiplier. This creates cross-run investment beyond coin grinding.
- Permanent upgrade meta-game: multiplier increases, magnet, shield, head-start, special vehicles/characters earned with in-run currency.
- Continue/revive pricing curve: first revive cheap, second more expensive, third is final opportunity. Never infinite free revives.
- Milestone popups ("New Record!") occupy center for 1.5-2.0s then fade over 0.5s — never persistently obstruct.

## Mobile
- One-hand portrait mode is the default play posture; buttons and UI must accommodate single-hand reach.
- Discrete swipe lane-switching beats tilt controls (Subway Surfers lesson).
- Multi-touch separation: swipe + hold must not cause "button sticking" conflicts.
- Performance target: stable 60fps on 3-year-old Snapdragon-class devices. Object pooling mandatory for all runtime allocations.
- Haptic feedback: distinct intensities for lane-switch, near-miss, milestone, and death on Taptic/Linear motor devices.

## Audio
- Rhythm-synced engine/run sound conveying speed through BPM or pitch.
- Near-miss: amplified wind-whoosh even when visually not closer.
- Warning sting on obstacle approach with proximity-based pitch rise.
- Death: abrupt thick sound cut + low-pass filter snap (not fade).
- UI click, pickup, boost, milestone, and revive have distinct audio.

## Performance & Diagnostics
- Object pooling for all runtime allocations: segments, obstacles, pickups, particles, UI popups. Zero per-frame instantiation.
- Renderer diagnostics checked at max speed with full obstacle density and effects active.
- Worst-case segment performance is checked; no frame drops during segment transition.

## Playtest
- Game loop tested through: ramp-up → ordinary collection → hazard avoidance → near-miss chaining → failure → revive → restart.
- Solvability validation: every authored segment template proven passable; random combinations checked for impossible patterns.
- Near-miss scoring zone and input buffer tested at 30fps, 60fps, and 120fps for consistent feel.
