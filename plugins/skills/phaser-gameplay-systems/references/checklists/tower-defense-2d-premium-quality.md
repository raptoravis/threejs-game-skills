# 2D Tower Defense Premium Quality Checklist

Based on Bloons TD 6, Kingdom Rush, Plants vs. Zombies, and the formal TD balance frameworks from GameDeveloper and community design analysis. Every item references concrete formulas where applicable.

## Map & Path Design
- Map has clearly defined enemy path with visible entry, waypoints, and exit/defend-point. Path must be visually distinct from buildable terrain — different tile, color, or texture.
- At least 3 distinct map layouts with varying: path length, number of turns, buildable-zone density, chokepoint count. Each map tests different tower synergies.
- Mazing vs. fixed-path decision is explicit and documented: mazing games let towers form the path (Bloons TD style); fixed-path games place towers alongside (Kingdom Rush style). Each requires fundamentally different balance math — mazing multiplies effective tower DPS by path extension.
- Buildable terrain grid: tiles clearly indicated as buildable (green highlight on hover) or blocked (red with reason). Grid size consistent (32×32 or 64×64px per tile typical). Tower footprint spans 1-4 tiles.
- Range indicators: on tower hover/select, show range ring (circle) with tower stats. On tower-type hover before placement, preview range ring at cursor position.

## Tower Design
- At least 5 tower types with mathematically distinct roles and DPS profiles:
  1. **Basic/DPS** — consistent single-target damage, moderate range, low cost. Bread-and-butter tower. Highest DPS-per-cost ratio for single targets.
  2. **Splash/AOE** — damage in radius (typically 48-96px). Lower single-target DPS, higher total output against clumped enemies. Radius must be visibly indicated.
  3. **Slow/CC** — applies slow debuff (20-50% speed reduction, 1-3s duration). Low or zero damage. Synergizes with AOE (more time in splash zone) and long-range (more shots before enemy exits range).
  4. **Long-range/Sniper** — covers 2-3× standard range. Lower fire rate. Compensates for maps with limited buildable zones near path. Global or near-global range variants target "first," "last," or "strongest" enemy.
  5. **Special-ability** — buffs adjacent towers (+10-25% attack speed or range to towers within X px), generates bonus income per kill, reduces upgrade costs, or applies unique status (armor-shred: reduces enemy damage resistance).
- Tower upgrade path: at least 3 tiers per tower with VISIBLE sprite/model changes per tier. Each tier should be 2-3× previous tier cost. Player must visually see the investment was worthwhile. Tier 1: basic structure, Tier 2: added turrets/greebles, Tier 3: visually imposing with particle effects.
- Tower synergies: explicit interactions should be discoverable. Slow + AOE = more damage ticks. Buff tower + adjacent DPS = amplified output. Synergies create composition depth beyond "build the best tower."
- Projectile types match tower identity: instant beam (hitscan), travel arrow/bullet (velocity-based), AOE cannonball (parabolic arc), missile with trail (homing), chain lightning (bounces to N nearby enemies), ground-effect zone (persistent damage field, 3-6s duration).
- Status effects with distinct visual treatment: slow (blue tint + smaller movement lines), burn/DoT (orange glow + damage ticks), stun (stars/spiral + frozen), poison (green tint), armor-shred (cracked overlay).
- Tower placement ghost: valid = green/blue semi-transparent tower + range ring. Invalid = red semi-transparent + reason text overlay (BLOCKED / NO FUNDS / UNBUILDABLE TERRAIN).
- Targeting priority options: First (closest to exit), Last (furthest from exit), Strongest (most HP), Weakest (least HP), Near (closest to tower). Toggleable per tower.

## Enemy Design
- At least 6 enemy types with distinct sprites, movement speeds, and behaviors:
  1. **Basic/Grunt** — moderate HP, moderate speed, no abilities. The baseline against which all towers are balanced.
  2. **Fast/Runner** — low HP, high speed (2-3× basic). Tests reaction time and path coverage.
  3. **Tanky/Heavy** — high HP (4-8× basic), slow speed (0.5-0.7× basic). Tests sustained DPS output.
  4. **Flying/Air** — ignores path geometry, flies directly to exit. Requires anti-air capable towers (or towers with "targets flying" attribute). Tests tower diversity — pure ground-defense loses.
  5. **Healer/Support** — moderate stats, pulses heal to nearby enemies within X px radius. Must be prioritized or isolated. Tests target-priority decision-making.
  6. **Boss** — appears every 5-10 waves. Massive HP (10-20× basic), large sprite, slow speed, special ability or resistance that tests a specific weakness in common strategies. Boss arrival preceded by warning indicator and distinct audio cue.
- Enemy spawn follows wave logic: increasing count, speed, health, and type variety. Wave composition preview shown before wave starts (type icons + count per type + per-lane indicator if multi-lane).
- Enemy health bars: visible on all damaged enemies, or on hover, or always-on. Health bar width proportional to max HP; color shifts green→yellow→red at 50% and 25% thresholds.
- Damage numbers: float up from hit location. Crits: larger font, exclamation mark, yellow color. Resists: smaller font, grey color. Toggleable.

## Economy & Balance — The Formulas

### Core Economy Loop
Starting gold + per-kill income + wave-completion bonus (+ optional interest/passive income). The player should be able to afford 1 new tower placement OR 1 tower upgrade every 1-2 waves.

### Tower Value Formula
```
TowerValue = DPS × (SpawnRate × TotalEnemies + TrackCoverage / EnemySpeed)
```
Where DPS = damage × fire rate × accuracy/hit-chance, TrackCoverage ≈ 1.5 × tower diameter.

### ROI (Return on Investment)
```
WavesToRecoup = UpgradeCost / (NewIncome - OldIncome)
```
This measures incremental ROI. A tower upgrade that costs $200 and increases DPS by 50% needs to be evaluated in terms of enemies killed that would otherwise leak.
Target: tier 1 towers recoup in 3-5 waves; tier 3 towers recoup in 5-8 waves (but provide irreplaceable utility).

### Wave Survivability Formula
```
(3 + N × DelayBetweenSpawns × Speed) × ShotsPerSecond × PathLength / Speed >= N × HitsToKill
```
Where N = number of creeps in wave. This formula tells you whether your defense line can handle the wave. If `PathLength` (length of path under tower fire) > `HitsToKill` tiles, the defense holds regardless of N.

### Enemy HP Scaling
Use polynomial, not linear scaling:
```
HP(wave) = a·wave⁴ + b·wave³ + c·wave² + d·wave + baseHP
```
Linear scaling makes early waves too hard and late waves too easy. Polynomial scaling creates the standard TD difficulty arc: easy early → challenging mid → intense late.

### Cash Per Wave Model (Spreadsheet Method)
1. Decide which wave the player should afford each tower/upgrade.
2. Calculate cumulative gold earned by that wave (starting gold + Σ per-wave income).
3. Set tower cost = cumulative gold at target wave.
4. Example: if wave 1 earns 100g and wave 2 earns 200g → tower available at wave 2 costs ≤300g.

### Game Economy Metrics to Track
| Metric | Formula |
|---|---|
| Cash per wave | StartingGold + (EnemyCount × GoldPerKill) + WaveBonus |
| DPS per tower | Damage × FireRate × Accuracy |
| Cost efficiency | TowerCost / DPS |
| Waves to recoup | UpgradeCost / DPS_Gain |
| Difficulty curve | TotalEnemyHP / CumulativeGoldAvailable |
| Field saturation | TowersPlaced / MaxBuildableTiles |

### Tower Cost Curve
```
TowerCost(tier) = baseCost × multiplier^tier
```
Tier 1: base (×1), Tier 2: 2-3× base, Tier 3: 5-8× base. Sell refund: 50-75% of total investment (all tiers summed). Refund rate affects strategic flexibility — higher refunds encourage experimentation.

## Difficulty & Pacing
- Difficulty ramp: early economy-build waves (3-5 waves, low threat) → mid-game mixed-threat waves (5-10 waves, new enemy types introduced) → late-game boss + swarm combination waves (3-5 waves, all enemy types).
- Speed-up/fast-forward toggle: 2× speed minimum, 4× ideal for veterans replaying early waves. MUST be togglable mid-wave.
- Lives/base-health system: start with 20 lives. Each leaked enemy costs lives proportional to its type (basic = 1, fast = 1, tank = 3, boss = 10). Loss animation: life counter decreases with visual pulse; last life lost = game over screen with stats.
- Wave-call early option: send next wave immediately for bonus income (20-30% extra gold). Risk/reward mechanic for confident players. Cannot be abused — minimum delay between waves if called early.
- Victory condition: survive all waves (typically 30-50). Optional: endless mode after campaign with exponentially scaling HP.

## UI & HUD
- HUD layout: wave counter/timer (top-center), lives (top-left, hearts or shield icons), currency (top-right, gold icon + number), selected-tower panel (bottom, appears when tower selected), wave-composition preview (appears before wave, fades out after wave starts), speed control (bottom-right, ▶/▶▶ icons).
- Tower interaction: select from bottom ribbon → tap grid cell to place → tap placed tower to select → tap upgrade/sell buttons. Maximum 2 taps/clicks from gameplay to any action.
- Tower info panel (on select): tower name + tier, damage, range, fire rate, DPS, special ability, next-upgrade stats with delta comparison (green +X), upgrade cost, sell value.
- Wave preview: before next wave, show enemy-type icons + count per lane. 3-5 second preview window. "SEND NOW" button for early call with bonus indicator.
- Damage numbers toggle: on by default, toggleable in settings. Status-effect icons on affected enemies.
- Minimap: small overview showing path layout, tower positions (dots), and current enemy positions. Tap/click to jump camera.

## Feedback
- Wave-start: brief banner "WAVE X" (1.5s) + horn/siren SFX.
- Wave-clear: "WAVE CLEAR" banner + triumphant jingle + gold earned popup.
- Leak: screen-edge flash red, life counter pulses, distinct alarm sound per leak.
- Boss-spawn: screen shake + boss name banner + distinct warning horn (different from wave-start). Boss health bar appears at top of screen.
- Tower upgrade: particle burst around tower, brief flash, upgrade SFX (escalating pitch per tier).
- Tower sell: tower fades out, coins scatter animation, gold counter increments.
- Last-leaked-enemy: camera briefly snaps to exit point to show what broke through and from where. Invaluable for learning.
- Game-over: slow-motion (0.3× for 1s), "DEFEATED" overlay, stats summary (waves survived, enemies killed, total gold earned, towers built).

## Mobile
- Tap-to-select tower type (bottom ribbon, horizontally scrollable), tap grid cell to place.
- Drag-to-pan map. Pinch-to-zoom (0.5× to 2× range). Double-tap to reset zoom.
- Upgrade/sell: tap placed tower → bottom panel shows upgrade/sell buttons with 44×44pt touch targets.
- Range ring visible on tower select. Long-press for detailed stats popup (full screen overlay).
- Speed control: prominent button, bottom-right, toggles ▶/▶▶/▶▶▶▶.
- All touch targets ≥44×44 logical pixels. Tower-type ribbon items: 64×64pt minimum for readable tower icons.

## Performance
- Object pooling mandatory for: enemies (pool per type, size = max concurrent + 20%), projectiles (pool size = towers × avg projectiles per tower), hit/damage VFX, damage numbers, status-effect particles. Zero instantiation per wave — instantiation during gameplay causes GC spikes and stuttering.
- Render diagnostics at peak wave (50+ enemies, 25+ towers, all projectiles + VFX active simultaneously).
- Enemy count bounded per wave (max displayed in wave preview). Projectile count bounded per tower type.
- Grid/tile rendering: static map layer rendered once to texture. Dynamic layer (towers, enemies, projectiles) rendered separately.
- Pathfinding: enemies follow pre-computed waypoint paths. No per-frame A* — the path is fixed. Only need to follow spline/linear interpolation between waypoints.

## Playtest
- Game loop tested through: tower placement → early waves → economy build (save gold) → mid-game defense → tower upgrades → boss wave → victory/fail.
- Wave economy model validated: player income vs. required defense investment mapped across every wave in the campaign. No impossible difficulty spikes.
- All tower types tested as viable primary strategy up to mid-game. No single tower type dominates all scenarios (if so, buff counters, not nerf the dominant tower).
- All maps tested with both mazing and non-mazing strategies (where applicable).
- Speed-run test: ×4 speed full-campaign run. No frame drops, no physics desync.
- Minimum viable defense test: what's the cheapest setup that clears each wave? Used to validate economy numbers.
- Mobile: touch controls tested on real device. Pinch-zoom + tower placement + upgrade flow verified.

## Accessibility
- Enemy path conveyed by more than color alone: distinct tile texture, raised border, and directional arrow markers. Colorblind players must tell path from buildable terrain without relying on the green/red hover highlight.
- Buildable/blocked grid feedback not color-only: add an icon (check/cross), border dash pattern, or reason text overlay alongside the green/red tint so placement validity is readable.
- Tower tier and type distinguishable beyond color — silhouette change, added greebles/turrets, and particle style per tier. Don't encode tier solely via a colored ring.
- Status effects on enemies (slow, burn/DoT, poison, stun, armor-shred) each carry a distinct icon + shape (stars, flame, cracked overlay), not just a colored tint. Colorblind players must read debuff state.
- Range ring and tower stats legible at small screen sizes; contrast and font size meet WCAG AA. Damage numbers and wave-preview text readable on mobile.
- Reduced-motion option dampens boss-spawn screen shake, leak flash, and particle VFX for players sensitive to repeated motion.
- Critical audio cues (wave-start horn, boss warning, leak alarm) paired with visual equivalents (banner, screen-edge flash, minimap pulse) so defense state is never audio-only.

## Audio
- Distinct SFX per tower type and projectile identity: basic shot (crisp pop), splash cannon (boom + radius thud), slow beam (cold hum), sniper (crack), special/buff (chime), chain lightning (zap arc). Player learns the defense composition by ear.
- Key feedback events all covered: tower placed, upgrade tier-up (escalating pitch per tier), tower sold (coin scatter), enemy death, boss hit, leak (alarm), wave-clear (jingle), game-over stinger.
- Wave-start horn/siren and wave-clear jingle clearly audible above the music bed; boss warning cue deliberately distinct from normal wave-start so the player reacts without reading text.
- Music/ambience loop clean and crossfaded; never masks critical cues (leak alarm, boss warning, upgrade confirm) at default volume. Intensifies as lives drop or boss waves approach.
- Mute + separate music/SFX volume sliders work and persist. Audio never the only signal for a leak or boss spawn.
- Restart and scene-change audio cleanup: no lingering Phaser sound, ambience, or tween-driven sources after game-over restart or map switch.
