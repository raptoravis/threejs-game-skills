# 3D Platformer Premium Quality Checklist

## Movement & Jump
- Movement kit: run, jump (variable height — hold duration determines apex), double-jump or air-action, and at least one special traversal ability (wall-jump, glide, grapple, dash, ground-pound).
- Coyote time: 5-10 frames (83-167ms) grace window after leaving platform edge where jump still registers.
- Input buffering: 6-10 frames (100-167ms) before landing where jump input is cached and executed on touchdown. Both windows together frame every landing — missing either makes controls feel "unresponsive."
- All timing windows use milliseconds, not frames — a 150ms coyote time is ~5 frames at 30fps, ~9 at 60fps, ~18 at 120fps. Frame-based values change feel across refresh rates.
- Jump arc is documented: max jump height (meters), max horizontal distance (meters), air-control reachable area curvature. Platform spacing is calculated from these numbers, not eyeballed.
- Air control: limited but perceptible trajectory adjustment mid-air. Zero air control is fatal in 3D space.
- Movement state machine: walk/run/crouch/slide/jump/double-jump/wall-jump/dash with clear, cancelable transitions. Deceleration (stop-on-release) matters more for "crispness" than acceleration.

## Camera
- Camera modes: follow (biased ahead), fixed-angle (specific challenges), manual (right-stick for exploration). Smooth transitions between modes.
- Predictive framing: camera anticipates movement direction rather than trailing behind. If player is running right, camera leads right.
- Occlusion detection: geometry between camera and player fades to transparency; camera retracts smoothly, never snaps.
- Dead zone: small camera-angle changes do not cause jitter.
- Camera recenter delay: when player releases right stick, camera auto-returns to behind-player over configurable time (0.5s-2s). This parameter dramatically affects game feel and is almost never in amateur checklists.
- Dedicated "look down" button or right-stick-flick-down: instant top-down view for judging shadow position during precision landings.

## Collision & Edge Detection
- Player collision proxy is smaller than visual model; enemy collision proxy is smaller than visual model.
- Edge detection + auto-step: raycast at platform edge — if player foot-to-surface distance < threshold, auto-nudge player onto platform. Not just "touch edge = slide off."
- Platform-top "magnetism": toe barely touches edge → player is pulled up, not pushed off. Precision punishment kills the genre.
- Shadow/reticle under player: dynamic drop-shadow is the player's only depth-perception tool in 3D space. Must be visible in ALL lighting conditions. Dark levels need alternative (ground ring marker, glow disc).

## Platform & Hazard Design
- Platform types: at least 4 — static, moving/patrol, crumble/temporary, hazard/slippery/bouncy.
- Difficulty ramps through height, gap width, movement speed, timing pressure, and hazard density — all calculated from documented jump parameters.
- Hazards: at least 3 types — static (spikes/lava), patrol (moving enemy/crusher), reactive (triggered trap/chase sequence).
- Checkpoint spacing: 30-60 seconds of gameplay between checkpoints. Respawn in <2 seconds. Death penalty is time, not progress.

## Collectibles & Teaching
- Collectibles as navigation teachers: placed to draw the eye (distant sparkle), grade by value/color, form "breadcrumb trails" to secrets and main path. Not randomly scattered.
- At least 3 collectible types: common/score, rare/health/bonus, key/unlock/progress token.
- "Teaching area" per new ability: a safe gated zone where only the target mechanic works (can't die, can't fail), using level geometry to teach (not text popups). Portal 2's Ki stage standard.

## World & Environment
- World zones/biomes: distinct visual themes, platform materials, hazard palettes, sky/background layers.
- Level segments include foreground platforms, midground traversal props, background vista elements for depth.
- Every level has: unique visual identity, a mechanic theme, and an emotional position in the overall arc.
- The distant vista always shows where you are going next.

## HUD
- Minimal: health (hearts/lives), collectible count (current level/total), current objective (if quest system), optional minimap. All elements should not occlude >5% of core play area.
- Collection, checkpoint, ability-use, hazard-hit, and level-complete have distinct audio/visual feedback.

## Mobile
- Abandon virtual joysticks: auto-run + left/right swipe for direction change + swipe-up jump + swipe-down slide.
- Camera automation is essential — player has no spare finger for manual camera. Predictive follow must be excellent.
- Platform widths and jump tolerances 2-3x more generous than desktop to compensate for touch imprecision.
- Left-handed/right-handed swappable mirror layout.
- Portrait mode is viable for vertically-oriented 3D platforming; landscape needs full relayout.

## Audio
- Three layers: environmental (zone ambience), feedback (collect/attack/hurt/jump with pitch variation or random pools to prevent repetition), music (dynamic — safe zone low → enemy approach adds percussion → boss full orchestration).
- Footstep sounds vary by terrain material.

## Accessibility
- Difficulty regulators: not just fast/slow mode. Include auto-jump, auto-platform-snap, invincibility, and skip-boss options. These are becoming standard in commercial 3D platformers.
- Colorblind-friendly collectible and hazard differentiation (shape + icon, not color alone).

## Performance
- Frame-rate-independent coyote time and input buffer (millisecond-based, not frame-based). Critical in browser/Three.js where player fps varies dramatically.
- Renderer diagnostics checked across full level with all platforms, collectibles, and background layers active.

## Playtest
- Game loop tested through: basic platforming → collectible routing → hazard avoidance → ability chaining → checkpoint → level clear.
- Jump math validated: every platform gap measured against documented jump distances at intended speed.
- Fall deaths analyzed: was it player error or camera/control ambiguity? >90% of "bad jump" complaints are actually camera problems.
