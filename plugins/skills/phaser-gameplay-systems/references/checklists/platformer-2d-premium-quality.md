# 2D Platformer Premium Quality Checklist

Based on Celeste, Hollow Knight, Dead Cells, Super Meat Boy, and genre-wide best practices. Every item references concrete timing windows, pixel margins, or design rules extracted from premium platformers.

## Movement & Jump — The Exact Numbers

Celeste developer Matt Thorson's public controller analysis established the gold standard for platformer game feel. These values are at 60fps reference:

- Coyote time: 5 frames (~83ms) grace window after leaving platform edge where jump still registers. Industry range: 4-8 frames (67-133ms).
- Jump input buffering: 4 frames (~67ms) before landing where jump input is cached and executed on the exact touchdown frame. Industry range: 3-10 frames (50-167ms).
- Both windows together frame every landing — missing either makes controls feel "unresponsive."
- All timing windows in milliseconds, never frame counts. `coyoteTimeMs = 80` not `coyoteFrames = 5`. Frame-based values break across refresh rates (30/60/120/144Hz).
- Variable jump height: hold duration determines apex. On button release, set upward velocity to a fraction of current velocity (commonly 0.4-0.55×) to cut the jump short. This single multiplier is the most-tuned value in the controller.
- Halved gravity at jump peak: when vertical velocity is near zero (within ~20px/s), gravity is reduced to 0.5× for 2-3 frames. This creates a "hang time" feel that makes landing adjustments possible without making jumps floaty.
- Jump arc documented: max jump height (px), min jump height (tap vs hold), max horizontal distance (px). All platform spacing is calculated from these numbers, never eyeballed.
- Air control: limited but perceptible trajectory adjustment mid-air. Typically 0.3-0.6× ground acceleration in air. Zero air control is fatal — it makes every jump a commitment the player cannot adjust.
- Movement state machine: idle → run → jump → fall → land with explicit transitions. Wall-slide when touching wall while falling. Dash when button pressed (cooldown gated). Each state has defined entry/exit conditions and cancel rules.
- Deceleration (stop-on-release friction) matters more for "crispness" than acceleration. Target: player stops within 3-5 frames of releasing input at max speed.
- Ground acceleration curve: ease-in to full speed over 6-12 frames. Instant speed changes feel robotic.

## Advanced Movement Abilities

- Wall-jump: force direction (horizontal reflection + vertical boost), input window (4-6 frames after pressing jump near wall), 2px forgiveness margin from wall surface. Super wall-jump variants have larger forgiveness (5px in Celeste).
- Wall-slide: constant downward speed (typically 40-60% of max fall speed), distinct visual/audio state. Friction tuned separately from ground friction.
- Dash/air-dash: instant velocity impulse with 4-8 frames of invincibility, cooldown (0.3-0.8s), direction locked to input or 8-way. Distinguish ground dash (can cancel into jump) from air dash (consumes air action).
- Double-jump: second jump available in air. Full-height or reduced-height (commonly 0.7-0.85× primary jump). Visual state change (particle burst, double-jump sprite) on activation. Refreshes on landing or wall-grab.
- Crouch/slide: reduces hitbox height, enables passage through low gaps. Slide preserves momentum on slopes. Slide-jump extends jump distance.
- Stamina system (if used): regenerates after 0.3-0.5s of not climbing/dashing. Partial refund on certain actions (wall-jump from climb refunds climb stamina cost). Visual meter near player.

## Corner & Edge Correction

These are the "hidden helpers" that separate premium from amateur platformers:

- Jump corner correction: if player bonks head on a ceiling corner during jump, nudge horizontally by 1-3px to slip past. This prevents forehead-height obstacles from blocking the player unfairly.
- Dash corner correction: if dash clips a platform corner, pop player up onto the ledge instead of stopping dead.
- Semi-solid/one-way platform bump: if dashing horizontally through a one-way platform from the side, push player to the top side rather than trapping them inside.
- Edge detection + auto-step: raycast at platform edge — if player foot-to-surface distance < threshold (typically 4-8px), auto-nudge player onto platform. Not just "touch edge = slide off."
- Platform-top magnetism: toe barely touches edge (2-4px overlap) → player is pulled up, not pushed off. Precision punishment kills the platformer genre.
- Lift/moving-platform momentum storage: platform velocity carries into player jump for 3-5 frames after leaving the platform. Without this, jumping on moving platforms feels disconnected.

## Tilemap & Level Design

- Collision layers: at minimum ground, one-way-platforms, hazards, slopes, and decoration-only (no collision).
- One-way platforms: pass through from below, land on top. Player holds "down" + jump to drop through. Input window for drop-through explicitly defined (100-150ms).
- Slope handling: at least 3 slope angles (gentle ≤22.5°, medium 22.5°-45°, steep >45°). Player slides down steep slopes, walks up gentle slopes. No snagging at slope-to-flat transitions.
- Platform types: at least 5 — static, moving/patrol, crumble/temporary, conveyor (directional velocity), bouncy (spring/boost), slippery (reduced friction).
- Moving platforms: player inherits platform velocity via momentum storage. Platform movement must use fixed physics step or interpolation — variable-delta movement causes jitter.
- Conveyor belts: directional velocity component added while player stands on them. `player.vx += conveyorSpeed * dt`. Visual arrows/particles on belt surface.
- Water/liquid zones: reduced gravity (0.3-0.5×), altered movement speed (0.5-0.7×), breath timer if submerged >3s, distinct visual treatment (blue tint, wavy distortion), surface splash on entry/exit.
- Wind zones: constant or varying horizontal force applied to player. Visual indicator (drifting particles, bent vegetation).
- Crumbling platforms: shake for 200-400ms, then fall after 100-300ms delay. Player can still jump off during shake phase. Respawn after 3-5s or on screen exit/re-entry.
- Difficulty ramps through: gap width (calculated from documented jump distance), platform spacing (horizontal + vertical), timing pressure (crumbling, moving), hazard density, and introduction of new hazard types. All values derived from documented jump parameters, not eyeballed.
- Level segments: foreground (platforms + hazards + player), midground (props + depth indicators), background (2+ parallax layers).
- Each level/zone: unique visual identity (tileset + color palette), a primary mechanic theme (what the level teaches), and an emotional position in the overall arc (tutorial → escalation → climax → palette-cleanser → finale).

## Hazards & Enemies

- Hazard types: at least 4 — static (spikes, lava, sawblades), patrol (moving saw/enemy on fixed path), reactive (triggered by player proximity/timer), environmental (rising lava, collapsing ceiling, chasing wall).
- Enemy archetypes: at least 5 — ground patrol (walks back and forth), flyer (bobs up/down or circles), charger (notices player and rushes), shooter (fires projectiles at intervals), grappler (attaches to surfaces, moves along them).
- Enemy telegraphing: every attack has a wind-up animation (200-500ms) with distinct visual and/or audio cue. Damage zone appears before hurtbox activates.
- Stomp/goomba-stomp: jumping on enemy head from above defeats it. Player bounces upward (50-70% of jump height) on stomp. Must have coyote-time-like margin: 2-4px forgiveness above enemy head.
- Contact damage: touching enemy from side or below hurts player. Invincibility frames after taking damage: 60-90 frames (1-1.5s at 60fps) with visual flashing (sprite alpha oscillation at ~10Hz). Knockback: fixed impulse away from damage source.
- Enemy variety rule: every enemy type must appear in a safe context first (no pits/hazards nearby) so the player can learn its pattern without punishment.

## Collectibles & Teaching

- Collectibles as navigation teachers: placed to draw the eye (sparkle particle, subtle glow), grade by value/color (common=small glow → rare=pulsing aura), form breadcrumb trails to secrets and the critical path. Never randomly scattered.
- Collectible types: at least 4 — common/score (abundant, defines path), rare/health-bonus (off-path, rewards exploration), key/unlock/progress-token (gates content), secret/hidden (requires advanced movement tech).
- "Teaching area" per new ability: a safe gated zone where only the target mechanic works. Cannot die, cannot fail. Level geometry teaches the mechanic (jump here to learn jump height, dash here to learn dash distance). No text popups. Portal 2's concept.
- The first instance of every hazard type is telegraphed with extreme generosity (extra space, no time pressure, no combination with other threats).
- Secret areas: hidden behind breakable walls (visual crack or different tile), reachable only via advanced movement tech (wall-jump chain, dash precision, pogo), or discovered through environmental clues (different colored tile, suspicious dead-end). Rewarded with rare collectibles or lore.

## Checkpoint & Death

- Checkpoint spacing: 20-40 seconds of gameplay. Crisper games (Super Meat Boy) use 5-15s per screen. Exploration games (Hollow Knight) use 30-60s with benches.
- Respawn time: <1.5 seconds from death to control. Death animation 300-500ms → instant respawn at checkpoint (no loading screen, no transition). Death penalty is lost progress since checkpoint, not time.
- Checkpoint visual states: inactive (dim/grey), active (lit/glowing — touched by player), respawn-point (pulsing — where player will appear).
- Death recap: brief freeze-frame (100-200ms) on death with cause visible (spike contact, enemy hit, fell in pit). Player knows exactly why they died.
- Death counter: optional per-screen death tally shown on respawn. Motivates and amuses rather than punishes. (Celeste popularized this.)
- Lives system: infinite lives with checkpoint respawn is the modern standard. Limited lives + game-over belongs to arcade-retro style — if used, make it an explicit, documented design choice.

## Camera

- Camera follow: horizontal lead in movement direction (look-ahead offset proportional to velocity, typically 0.3-0.5× speed projected 0.5-1.0s ahead) + vertical look-ahead when jumping/falling.
- Dead zone: rectangular zone around player where camera does not move. Typical: 15-25% of screen width horizontally, 10-20% vertically. Eliminates micro-jitter from idle animation and small adjustments.
- Smooth interpolation (lerp): separately tunable horizontal lag (0.05-0.15) and vertical lag (0.08-0.2). Vertical should be slightly laggier to avoid seasickness from constant jump-bob.
- Camera bounds: clamped to level edges. No showing void beyond level geometry. Transition zone at edges: camera stops but player can move to edge of screen.
- Look-ahead: camera anticipates landing zone when falling (look-down bias 0.2-0.3× screen height below player). Player needs to see where they will land.
- Screen shake on: player damage (mild, 2-3px), enemy defeat (moderate, 3-5px), boss slam (heavy, 5-8px), ground-pound (moderate-heavy), explosion (moderate). Shake intensity, duration, and falloff configurable per event. Disable via accessibility setting.
- Parallax backgrounds: at least 3 layers — far (0.05-0.15× camera), mid (0.2-0.4×), near (0.5-0.7×). Each layer tiles seamlessly and extends beyond camera bounds.

## HUD

- Minimal: health (hearts/icons, not a bar — platformer convention), collectible count per level (e.g., "3/8 gems"), boss health bar (appears during boss fight at top of screen).
- All elements combined: <8% of core play area occluded. Corner placement preferred.
- Score/stats visible but not distracting. Timed levels: prominent countdown with urgency cues (audio tick, color shift at <10s).
- Collection feedback: "+1" float-up text, collect sound, brief HUD icon pulse.
- Checkpoint activation: distinct sound + visual pulse on HUD or checkpoint sprite.
- Ability cooldown/recharge: meter or icon near player or in HUD corner. Dashing: brief icon grey-out during cooldown. Stamina: segmented bar depleting and refilling.

## Mobile

- Touch controls: virtual d-pad/joystick (left side) + jump button + dash/action button (right side). 44×44pt minimum per hit area, 12pt minimum spacing between buttons.
- Auto-run option: player runs by default, left/right buttons change direction. Eliminates need to hold a run button.
- Swipe gestures as alternatives: swipe-up = jump, swipe-down = slide/drop-through, swipe-left/right = dash direction. Reduces button count.
- Left-handed/right-handed mirror layout: all controls swappable in settings. Preset layouts for common preferences.
- Increased camera lead on mobile: 1.3-1.5× desktop look-ahead values to compensate for thumb-obscured view ahead.
- Platform widths and jump tolerances: 1.5-2× more generous than desktop to compensate for touch imprecision.
- Portrait mode viable for vertically-oriented levels; landscape with full relayout for horizontal levels.

## Audio

- Three layers: environmental (zone ambience with seamless loop), feedback (footsteps — varied by terrain material, collect, jump, dash, hurt, land with pitch variation pool to prevent exact repetition), music (dynamic layers — safe exploration = base track, hazard approach/threat = add percussion layer, boss = full orchestration).
- Jump sound varies by effort: small hop = light sound, full-height jump = stronger, double-jump = distinct.
- Dash: whoosh with pitch bend matching direction.
- Landing: impact sound proportional to fall distance (soft → heavy thud).
- Collectible pickup: ascending chime — pitch increases with each collected in sequence.
- Checkpoint: warm, reassuring chord.
- Player hurt: sharp dissonant sound + brief audio duck of other sounds.
- Death: brief sting followed by silence — clean, not punishing.
- Boss: phase transition sting, health-threshold audio cues.

## Accessibility

Celeste's Assist Mode established the modern standard:

- Game speed: adjustable 50-100% in 10% increments.
- Infinite stamina: toggle for climbing sections.
- Air dashes: adjustable (1 to infinite).
- Invincibility: toggle.
- Assist mode does not lock achievements or progress.
- No "easy mode" stigma — settings are for everyone.
- Additional: high-contrast mode (player outline, hazard highlight), screen shake intensity slider, disable screen flash/strobe, colorblind-friendly hazard differentiation (shape + icon + brightness, not color alone), remappable controls including keyboard + gamepad.

## Performance

- Tilemap culling: Phaser's `setCullPadding(1, 1)` or equivalent enabled. Only visible tiles rendered.
- Object pooling for: enemies, projectiles, collectible particles, damage numbers, checkpoints. Pool pre-allocated at scene start — zero instantiation during gameplay.
- Physics body count: maximum 200 active Matter.js bodies at any time. Bodies beyond camera bounds (+20% margin) are destroyed or put to sleep.
- Texture atlas mandatory for tilesets and entity sprites: no individual image files per tile/sprite.
- Particle count: maximum 500 concurrent particles. Each emitter has explicit `maxParticles` set.
- Fixed physics timestep (1/60) with accumulator. Physics step decoupled from render frame rate.
- Render diagnostics at peak: max enemies + max particles + boss fight + all parallax layers visible.

## Playtest

- Full loop: run → jump → wall-jump → dash → collect → stomp enemy → take damage → reach checkpoint → die → respawn → defeat boss → level complete.
- Coyote time + input buffer validated at 30fps, 60fps, 120fps, 144fps. Delta-based timing ensures consistent feel.
- Every platform type tested: static, moving, crumble, conveyor, bouncy, slippery, one-way.
- Slope transitions tested: flat→slope, slope→flat, slope→slope (angle change), slope→wall.
- Corner correction: head-bonk slip, dash-corner pop-up, semi-solid bump all tested.
- Every enemy type tested: first encounter safe context, telegraph readable, stomp margin works, contact damage + i-frames correct.
- Mobile controls tested on real touch device (not just emulator).
- Accessibility: Assist Mode toggles tested individually and in combination.
