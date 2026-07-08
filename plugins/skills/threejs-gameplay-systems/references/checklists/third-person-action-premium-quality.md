# Third-Person Action Premium Quality Checklist

## Combat System
- Player character has readable silhouette from follow camera with visible body, limbs, gear/armor, and weapon/action tool.
- Animation set: idle, walk, run, jump, light attack, heavy attack, dodge/roll, block/parry, hit/react, and at least one special ability. All animations from same skeleton and timing conventions — third-person exposes every blend artifact.
- Input buffering: 150-300ms window stores the next queued input so slightly-early presses still chain combos. Without this, combat feels "unresponsive."
- Animation cancel windows during recovery frames only — never during startup or active hitbox frames. Cancel hierarchy: dodge-cancel from recovery (always), block-cancel from idle and light attack recovery (never heavy), parry-cancel has tightest window.
- i-Frames (invincibility frames) on dodge: 11-17 frames at 30fps (0.37-0.57s), precisely mapped to animation frames via animation events. Equipment/weight class modifies i-frame count (light roll vs. fat roll).
- Directional dodge outcomes differ: forward dodge = fewer i-frames but positions behind enemy; backward dodge = most i-frames but retreats. Four-way identical dodge removes spatial decision-making.
- Active hitbox frames must align with weapon's visible arc. If sword visually passes through enemy without registering, or registers after passing, trust dissolves instantly.

## Combo & Style
- Combo tree data structure: each node has multiple children accessed via different inputs (light, heavy, directional+light, pause+light). Not just light-light-light forward chain.
- Style meter judges variety in real-time, not efficiency. Higher ranks = more currency = faster unlocks. Dead-weight style meter that affects nothing undermines the core fantasy.
- Hitstop/frame-freeze (1-3 frames) on heavy hits, counters, parries, and killing blows — borrowed from fighting games, dramatically increases impact weight.
- Layered hit feedback per attack: (a) hit VFX (sparks/blood/energy by damage type), (b) impact sound (material + damage-type differentiated), (c) camera shake (scaled by damage magnitude), (d) controller haptics, (e) hitstop on heavy hits. All five fire within the same frame.

## Stagger & Poise
- Stagger/poise system: every attack has stagger damage; every character has poise threshold. Exceeding threshold = stagger state (interrupted, vulnerable). Prevents combat from being "two health bars trading hits."
- Enemy hit reactions: light and heavy stagger in 4+ directions (front/back/left/right), launch, knockdown, ground get-up, wall bounce. Direction calculated from attack vector dot product with enemy facing.
- Transition from hit-reaction animation to ragdoll on death is a critical polish point; ragdoll alone communicates "dead," not "got hit."

## Enemy Design
- At least 4 archetypes: melee grunt, ranged attacker, heavy/tank, elite/boss with distinct attack patterns.
- Enemy attack telegraphs: minimum 300ms (ideally 500-800ms) of distinct startup animation before active hitbox frames. Consistent visual language: windup communicates direction, range, timing, and counter-type required (block/parry/dodge).
- Enemy group behavior: turn-taking (1-2 attack simultaneously max), off-screen attack cooldowns, aggro redistribution. Without this, group fights become "everyone attacks at once and you die instantly."
- Boss encounters: multiple phases with distinct attack patterns, arena changes, clear phase-transition feedback.

## Camera
- Third-person spring-arm camera with collision detection: raycast retraction with smooth interpolation (not instant snap). Zero perceivable wall-clip jitter.
- Lock-on: smooth target tracking, distance-based break range (1.5x visual acquisition range), grace period before auto-break on LOS loss. Target cycle on right-stick flick.
- Camera framing keeps both player and locked target visible. Distance offset options (close/medium/far).
- Root motion for committed actions (dodge rolls, attack lunges, vaults); in-place animation + code-driven displacement for locomotion. Mixing incorrectly creates instant foot-sliding.

## Player Feedback
- Parry feedback loop: distinct VFX (sparks with ring-flash) + distinct SFX (metallic clang, different from block) + brief time-slow/hitstop + guaranteed stagger/riposte window.
- Death as learning tool: death screen shows what killed you (enemy name, attack name), damage type, ideally replay/camera pan to killing blow. Corpse-run currency marker visible on HUD at all times, recoverable after quit+reload.
- Recovery frames visually indicated: distinct recovery pose, ghost-effect on cancelable frames, or subtle VFX when cancel window opens.

## HUD
- Health bar (top-left or bottom-center, numeric overlay), stamina bar (below health, color-coded, flashes on depletion).
- Lock-on indicator (target icon + health bar above locked enemy).
- Style meter (real-time letter grade D-SSS, center-right, gates currency gain).
- Weapon/ability display (bottom-right, current weapon + cooldown-ready abilities).
- Boss health bar (top-center, name + phase markers).

## Mobile
- Dual-stick virtual controls are worse here than FPS — even more simultaneous inputs needed (move + camera + light + heavy + dodge + block + jump).
- Tap-to-target as camera alternative: tap enemy to lock on, tap elsewhere to move camera.
- Gesture-based ability triggers: directional swipes trigger different abilities (up = special 1, right = special 2, down = item, left = dodge).
- Auto-combo accessibility option: repeated taps chain through preset sequence; directional input modifies.
- Gyro camera for fine aiming and lock-on targeting.
- Controller support as first-class input method.

## Performance
- Object pooling for hit VFX, damage numbers, projectile attacks, temporary spawned objects.
- Renderer diagnostics checked during peak combat (player + 4+ enemies + VFX + arena draw calls).

## Playtest
- Game loop tested through: exploration → basic combat → multi-enemy engagement → resource management → boss fight → victory/fail.
- Input buffering and i-frame consistency tested at 30fps and 60fps.
- Cancel hierarchy verified: dodge-cancel, block-cancel, parry-cancel windows all function per-move as documented.
