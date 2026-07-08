# Flight Combat Premium Quality Checklist

## Flight Model
- Flight model balances "feels good" with "feels real": stall characteristics (recoverable, tactically exploitable), aircraft weight/inertia differences, yaw coupling (adverse yaw in turns), optional G-force blackout.
- At least 3 distinct aircraft/ship types with unique handling, weapon loadouts, energy retention, and visual identity.
- Drift/advanced maneuver: boost-then-decouple heading from velocity for sudden direction reversal (Squadrons model). High-G turn trading speed for extreme turn rate (Ace Combat model). These are the antidotes to infinite circling death-loops.
- Energy management: altitude ↔ speed exchange is modeled; diving builds speed, climbing burns it.

## Weapons & Targeting
- Weapon set: primary (rapid-fire guns), secondary (lock-on missile, 60-100+ count for hero power fantasy), special weapon (laser-guided bomb, long-range AAM, scarce ammo creating mission-level resource tension).
- Lock-on system with gimbal constraints: target must stay within seeker FOV cone; lock breaks on obstacle mask, countermeasure, or player's own collision mesh raycast hit. Three lock modes with distinct HUD symbols: search (no lock), TWS soft-lock (multi-target track, no launch authority), STT hard-lock (single target, launch-ready).
- CCIP (Continuously Computed Impact Point) gunsight visible in all camera views — not just cockpit. Third-person without gunsight is a fatal omission.
- Lock-on reticle is a world-space 3D marker projected back to screen coordinates each frame — not a UI element that inherits aircraft rotation. Must have smoothing delay to prevent shake.
- Missile launch "electricity": camera micro-recoil, exhaust flash, pilot head-push sensation, low-frequency thump — every missile must feel weighty.

## Enemy Set & AI
- Enemy set includes at least 4 archetypes: light fighter (agile, low HP), heavy fighter (tanky, slow), bomber/gunship (slow + turrets), ace/boss (player-like maneuver capability).
- Enemy AI includes formation tactics (two-ship bracket attacks on crossing vectors, high/low angle attacks), terrain-masking low-level escape, and aircraft-appropriate behavior (F-16 escapes on speed, Su-27 escapes on maneuver).
- Difficulty scaling via smarter AI and formation tactics, not just HP bloat.
- Damage states visible on enemies: smoke trail, fire, surface damage, breakup, and death explosion with debris.

## Situational Awareness (Radar + RWR + HUD)
- Radar: scan cone display with azimuth sweep width + elevation height indicator. Antenna orientation shown. TWS (hollow box) vs. STT (solid box) differentiation. Terrain occlusion: target behind mountain = radar contact lost + last-known-position marker.
- RWR (Radar Warning Receiver): missile direction indicator + signal strength + radar-lock vs. missile-launch differentiation (different tone pitch/rhythm).
- HUD: pitch ladder, speed/altitude/heading trinity (visible in all views), gunsight/CCIP, target designator (lock box + distance + direction arrow), missile incoming direction indicator (threat azimuth + type + time-to-impact estimate), gun ammo/special weapon ammo/countermeasure count.
- Cockpit view must carry full HUD data — not blank glass forcing players to read tiny analog dials. Data is "layered" across views, not gated by view choice.
- Search HUD elements stay visible when lock is acquired; lock info is overlaid, not a replacement.

## Comms & Audio
- Radio comms as situational awareness channel: AWACS command, wingman chatter, enemy taunts, ground force requests — 3+ parallel dialogue channels providing real-time tactical info. Ace Combat's "Bandit approaching from 4 o'clock high" is often faster than finding the HUD arrow.
- Missile alert tri-state audio: search radar sweep (low-intensity slow beep) → lock track warning (high-intensity rapid beep, urgent) → missile launch warning (extreme-high continuous scream, demands immediate evade).
- Dynamic score: mission phase changes, missile lock-on, superweapon in range trigger different intensity layers.
- Engine + wind noise: throttle-position + speed driven. Sonic boom transient on Mach transition.
- Unique wingman voice + personality per character (Star Fox 64 standard).

## Mission Design
- Mission variety beyond "kill all enemies": pure dogfight, timed score-attack, ground strike/CAS, escort/defend, stealth/radar canyon penetration, superweapon boss battle.
- Branching mission paths with difficulty-gated routes (Star Fox 64: blue = easy, yellow = medium, red = hard); different final boss based on accumulated route choices.
- At least one superweapon/set-piece boss per campaign act (orbital cannon network, aerial fortress, submarine carrier, space elevator).

## HUD & Cockpit
- Core HUD trinity (speed, altitude, heading) visible in all views at all times.
- Missile/gun ammo + countermeasure count always visible.
- Cockpit view is fully functional, not a half-implemented visual mode.

## Environment & Speed Feedback
- Sky and environment: cloud layers with penetration feedback (visual + audio), terrain below with altitude cues, horizon reference for orientation.
- Terrain-hugging low-pass: camera micro-pitch-down, screen-edge speed lines, dust/water-spray particles at very low altitude — the dynamic tension between speed and ground proximity.
- Speed/altitude readable through HUD, environment scale, contrail particles at high altitude.

## Mobile
- Drag-to-maneuver: finger on game area directly maps to pitch/roll — the most immersive scheme. No virtual joystick.
- Auto-fire default: standard weapons auto-fire on lock; player taps only for special weapons, avoiding button-spam feel.
- Auto-charge special weapons (~12s cycle, predictable rhythm); flash when ready; tap to release. No hold-to-charge.
- Screen partition: ~70% game area (sky + HUD), ~30% bottom for controls + status. Cockpit-oriented bottom panel design.
- Thumb occlusion + info condensation: altitude bar (green-to-red), speed bar (blue-to-red), missile count (number + red dot flash = locked/ready).
- Performance: heavy alpha-blend particles (missile trails = ~30 emitters at once), 8+ aircraft polys + terrain. Object pooling + particle cap + LOD + mobile DPR &lt;=1.5x.

## Performance
- Object pooling for projectiles, missiles, impact VFX, debris.
- Particle emitter cap enforced; LOD for distant aircraft and terrain.
- Renderer diagnostics checked during peak dogfight (player + 6+ enemies + projectiles + VFX + terrain in view).

## Playtest
- Game loop tested through: takeoff/spawn → target acquisition → engagement → damage management → kill → objective complete → return/wave transition.
- Lock-on reliability tested with player's own collision mesh excluded from lock-on raycast.
- All three camera views verified to preserve core HUD data without information loss.
