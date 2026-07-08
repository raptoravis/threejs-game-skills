# Racing Premium Quality Checklist

## Vehicle & Handling
- Vehicle has a readable silhouette from chase and cockpit cameras with visible body, wheels, cockpit/interior, aero elements, and damage/state feedback.
- Handling model includes acceleration curve, top speed, braking, steering sensitivity (speed-graded: lighter at low speed, heavier at high speed), drift/slip initiation, and weight-transfer feel.
- At least 3 distinct vehicle classes with unique handling, weight, power delivery curve, and visual identity — not just stat swaps.
- "Translation layer" between raw input and vehicle response: brake+steer = drift intent; tap handbrake+full throttle = launch intent; exit-corner acceleration = grip-recovery phase. Direct input-to-output mapping is unacceptable.
- Every vehicle must feel different enough that "collecting the next car" feels like discovering a new toy (Forza Horizon standard).

## Track Design
- Track includes varied corner types (hairpin, sweeper, chicane, esses, decreasing-radius), elevation changes (jumps, compression, uphill strain, downhill gravity assist), and at least one signature set piece.
- Track surface communicates grip changes visually: tarmac, dirt, curb, rumble strip, off-track slowdown with distinct particle/audio per surface.
- Visual reference markers at corner entries: sign, cliff face, building, or isolated tree that the driver can use as braking-point anchor at speed.
- Track-side world has foreground barriers/guardrails, midground scenery props, and background skyline/landscape layers.
- Track width is intentionally designed: wider = more passing lines + grip-and-go; narrower = single fast line + high risk.

## Camera
- Spring-arm follow camera with independently tunable position-follow speed, rotation-follow speed, and distance range. Too low = jitter; too high = stiff.
- Dynamic FOV: baseFOV (48-65°) + dynamicFOVGain * speed. Linear or curved mapping — the most accessible "speed impact" tool.
- Pitch adjustment by driving state: nose-up on acceleration (emphasizes thrust), nose-down on braking (emphasizes weight shift), level during coast.
- Drift camera: detect slip angle (12.5-65°), rotate camera toward velocity vector (not nose direction) so player sees corner exit. Without drift look-ahead rotation, drifting is unplayable.
- Shake system: 4 independent layers — high-frequency road texture (surface-dependent), drift judder (creates excitement even at low speed), impact bumps (decaying oscillation on hard landings/collisions), high-speed wind buffet.
- Player-adjustable sliders for distance, height, FOV, and shake intensity. At minimum: 3 presets (close/medium/far).
- Camera options include chase, bumper/hood, and cockpit views; each view preserves core HUD data (speed, position, lap) without information loss.

## Collision & Recovery
- Collision with barriers, other vehicles, and track objects produces instant bounce-off + brief invulnerability + sparks — not dead-stop simulation.
- Recovery penalty is time/speed loss, not dead-stop + reverse-gear crawl. Racing rhythm must survive contact.
- No ghost-forcing on minor wall brushes; light scrape = sparks + slight slowdown only.

## Opponents & AI
- AI racers use multiple distinct racing lines per track, not all crowding the same rail.
- Dynamic speed scaling by skill group rather than hard rubber-banding; aggressive vs. conservative driver personalities.
- Overtaking AI shows car-appropriate behavior: aggressive drivers dive-bomb inside; conservative drivers wait for straight.
- Ghost racing (Trackmania model): no-collision, perfectly fair, infinite retry. Solves toxicity and gear-grind in multiplayer.

## Items & Pickups (Arcade)
- Item distribution is rank-weighted, not random: leader gets defensive items (shell, banana), trailers get offensive/catch-up items (star, lightning, blue shell). Mario Kart's probability-by-position chart is the gold standard.
- Boost pads are readable at speed; pickup provides clear temporary advantage with visual/audio feedback.

## Speed & Motion Feedback
- Speed effects: camera FOV kick, motion blur, speed lines or particles, environment streak, wind noise spectral shift.
- Engine audio: dynamic RPM-driven, not a single loop. Includes load, idle, and downshift layers with crossfade blending across RPM range.
- Tire audio tri-state: grip (quiet), slip (scratch/noise rise), squeal (piercing high). Audio makes the understeer/oversteer boundary hearable.
- Countdown start, checkpoint, lap-complete, overtake, collision, and finish-line moments have distinct feedback.

## HUD
- Minimal occlusion: speedometer + lap/position (top-left), track minimap (bottom-right), boost/item slot (bottom-center). Center screen fully clear for track view.
- Opponent indicators: screen-edge arrows with distance for nearest ahead opponent and nearest pursuing opponent — without occluding central view.
- Mobile: UI elements biased to screen edges; speed abbreviated to two digits + color code (blue slow → red fast).

## Progression
- Vehicle collection as primary long-tail motivation: each car has a distinct handling signature.
- Tiered difficulty (50cc → 100cc → 150cc → Mirror); vehicle/part stat tuning creates depth for advanced players.
- Day/night separation (NFS Heat model): day = legal races earn cash (safe); night = illegal races + police pursuit earn REP (risk). Natural action → risk → safe-save cycle.

## Mobile
- Tilt steering is the default with calibration (set comfortable neutral angle) and adjustable dead zone.
- Touch throttle/brake: large invisible pressure zones (20-30% screen width, 30-40% height), not small buttons.
- Auto-accelerate option as mobile onboarding switch; default-on for arcade/kart sub-genres.
- Object pooling + fixed timestep mandatory: dynamic instantiation causes frame spikes on mobile.
- Haptic feedback: sustained engine drone (linear motors only), collision/scrape short pulses, boost strong burst, tire slip-to-squeal progressive intensity.

## Performance & Diagnostics
- Track segment LOD and prop instancing keep draw calls bounded on all track sections.
- Renderer diagnostics checked at peak speed with full opponent count and effects active.
- Particle system count capped; alpha-blend overdraw monitored on mobile.

## Playtest
- Game loop tested through: countdown → racing line learning → overtaking → mistake recovery → drift chaining → lap completion → finish.
- Car handling differentiation validated: blind test where players identify car by feel alone.
