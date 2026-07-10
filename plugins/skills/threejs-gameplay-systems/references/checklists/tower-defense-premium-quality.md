# Tower Defense Premium Quality Checklist

## Map & Path Design
- Map has clearly defined enemy path with visible entry, waypoints, and exit/defend-point.
- At least 3 distinct track layouts or difficulty modes with varying path complexity and placement constraints.
- Mazing vs. fixed-path decision is explicit: mazing games let towers form the path; fixed-path games place towers alongside. Each requires fundamentally different balance math.
- Track visual language: path surface distinct from buildable terrain; buildable zones clearly readable; range indicators preview on hover before placement.

## Tower Design
- At least 5 tower types with distinct roles: basic/DPS, splash/AOE, slow/CC, long-range/sniper, anti-air or special-ability.
- Tower upgrade path: at least 3 tiers per tower with visible model changes per tier. Stat increases are earned; model differentiation at each tier confirms the investment.
- Tower synergies: explicit or emergent interactions between tower types (slow + AOE = more damage ticks; buff tower + adjacent DPS = amplified output). Synergies create composition depth beyond "build the best tower."
- Tower attack ranges, projectile arcs, and AOE radii readable through range rings on hover/select and projectile trails in combat.
- Projectile types match tower identity: instant beam, travel projectile, AOE splash, missile with trail, chain lightning, ground-effect zone.
- Status effects (slow, burn, stun, poison, armor-shred) have distinct visual treatment on affected enemies.

## Enemy Design
- At least 5 enemy types: basic/grunt, fast/runner, tanky/heavy, flying/air, boss wave. Distinct silhouettes and movement patterns.
- Enemy spawning follows wave logic: increasing count, speed, health, type variety. Wave-composition preview shown before wave starts (what types, how many, what lane).
- Boss enemies: every N waves, distinct visual treatment, special ability or resistance that tests a specific weakness in common strategies.

## Economy & Balance
- Economy loop: starting currency + per-kill income + wave-completion bonus + optional interest/passive income option.
- Tower cost curve: each tier 2-3x previous tier cost; total tower investment vs. sell refund (50-75% is standard). Refund rate affects strategic flexibility.
- Wave economy math is modeled: player earns X currency per wave, wave N requires ~Y total tower investment to clear. Mapped across full campaign to ensure no impossible difficulty spikes.
- Sell/reposition towers returns partial cost with clear UI feedback on sell value before commit.

## Difficulty & Pacing
- Difficulty ramp: early economy-build waves → mid-game mixed-threat waves → late-game boss + swarm combination waves.
- Speed-up/fast-forward toggle for early waves (2x/4x). Mandatory for replay and veteran players.
- Lives/base-health system: each leaked enemy has clear cost feedback (life lost animation + count decrement). Total lives tuned so player can leak a few without losing but cannot ignore defense.
- Wave-call early option: send next wave immediately for bonus income — risk/reward mechanic for confident players.

## UI & HUD
- HUD: wave counter/timer, lives/base-health, currency, selected-tower panel (stats, upgrade cost, sell value), wave-composition preview, speed control.
- Tower select → place → upgrade → sell: maximum 2 taps/clicks from gameplay per action.
- Selected tower shows: current stats, next-upgrade stats with delta comparison, sell value, ability description.
- Damage numbers, status-effect icons, and critical-hit indicators toggleable for clarity.

## Feedback
- Wave-start, wave-clear, leak, boss-spawn, tower-upgrade, tower-sell, and game-over have distinct audio/visual feedback.
- Tower placement ghost: valid = green/blue with range ring; invalid = red with reason (blocked, too close, insufficient funds).
- Last-leaked-enemy camera snap or visual trail to show what broke through and from where.

## Mobile
- Tap-to-select, tap-to-place, drag-to-pan, pinch-to-zoom. Upgrade/sell buttons with touch-friendly 44x44pt minimum hit areas.
- Tower panel at bottom edge with swipeable tower-type ribbon.
- Range ring visible on tower select; long-press for detailed stats popup.
- Speed control: prominent button, easy to toggle during waves.

## Performance
- Object pooling for enemies, projectiles, hit VFX, damage numbers, status-effect particles. Zero per-wave instantiation.
- Renderer diagnostics checked at peak wave (50+ enemies, 20+ towers, all projectiles and VFX active).
- Enemy count and projectile count bounded per wave; no unbounded spawning.

## Playtest
- Game loop tested through: tower placement → early waves → economy build → mid-game defense → tower upgrades → boss wave → victory/fail.
- Wave economy model validated: player income vs. required defense investment mapped across full campaign.
- All tower types tested as viable primary strategy; no single tower type dominates all scenarios.

## Accessibility
- Tower range, status effects on enemies, and enemy types distinguishable by icon + silhouette, not color alone — pair slow/burn/stun colors with a glyph or outline overlay.
- HUD text (wave counter, currency, lives, tower stats) legible; contrast meets AA on the tower panel, range rings, and wave-composition preview.
- Reduced-motion/colorblind-friendly options where fast color cues mark incoming waves, leaks, or boss spawns.
- Important events (wave start, leak, boss spawn, last-life) conveyed by audio + visual banner/pulse, never color alone.

## Audio
- SFX for primary feedback events: tower placement/fire, upgrade, enemy death, leak, wave-start, wave-clear, boss-spawn, and game-over — each distinct and informational.
- Music/ambience loop clean with no audible seams across long sessions; mute/volume work and persist.
- Audio never masks critical cues — leak warning, boss-spawn sting, and last-life alert stay audible under tower fire and music layers.
- Wave restart and scene transition clean up audio: no dangling projectile/explosion one-shots or overlapping music stems.
