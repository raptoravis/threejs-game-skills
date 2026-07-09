# Bullet Hell / Shoot-em-Up Premium Quality Checklist

Based on Touhou Project, Cave (Dodonpachi, Ketsui), Ikaruga, ZeroRanger, Blue Revolver, and danmaku design guides by Sparen and Boghog.

## Core Loop & Genre Identity

- Core loop: dodge dense bullet patterns while returning fire → survive stages → defeat bosses → score. Survivability is the primary skill; scoring is the mastery.
- Tiny player hitbox enables the entire genre. Hitbox: 4-5px diameter circle centered on character sprite. Character sprite is much larger (32-64px). Only the hitbox matters for collision — the visual sprite is decoration.
- Focus/slow mode: hold button → player speed reduced to ~40-67% of normal, hitbox rendered as visible dot. Essential for precision dodging through dense patterns. Must be a hold, not toggle (tension comes from finger fatigue).
- Movement: no inertia, no acceleration curve. Instant response to input. Diagonal movement must be normalized (speed same in all 8 directions). At 60fps, unfocused: 4-6 px/frame, focused: 1.5-3 px/frame.
- Deathbomb window: 8-15 frames after taking a hit where pressing bomb still activates and negates the death. This window must exist — without it, bombs are too risky to use reactively. Window is deliberately generous because network/input latency varies.
- Lives: start with 2-3. Earn extends (extra lives) at score thresholds (1st at 10M, 2nd at 30M — scale to your scoring system). Maximum display: 5-8 lives.
- Continues: limited (2-3) or unlimited (credit-feed). If limited, game-over = restart from stage 1. If unlimited, continues reset score to zero — scoring integrity is preserved while allowing practice.

## Player & Hitbox — The Pixel Math

- Hitbox: 4-5px diameter (Touhou standard: Reimu 4px, others 5px). Must be a distinctly colored dot — hot pink, bright cyan, or white — that renders on top of ALL bullets and effects.
- Focus-mode hitbox: always visible (no hover-to-see). Renders as a small circle with subtle glow. During focus, player sprite may also change (Reimu's ofuda appear) as a secondary visual cue.
- Graze hitbox: larger detection zone (8-16px radius from hitbox center) for near-miss scoring. Bullets passing through graze zone but not hitbox trigger graze count + score tick + spark particles at bullet edge.
- Graze sound: distinct, satisfying tick/ting per bullet grazed. Must not overlap with other SFX.
- Movement precision: input → sprite movement must be 1:1 with no acceleration, no deadzone, no smoothing. Any input lag or nonlinearity is immediately fatal.

## Bullet Pattern Design — The Taxonomy

Pattern types from danmaku design theory:

- **Aimed (targeted)**: trajectory calculated from player position at spawn time. Creates pressure because staying still means getting hit. Player must constantly reposition.
- **Fixed (static)**: predefined geometric formation — rings, spirals, grids, flowers, lasers. Beautiful and learnable. Player finds the safe path through memorized geometry.
- **Random (scattered)**: randomized angle/velocity within a cone. Adds unpredictability but must be constrained (max spread angle, max density per unit area) to avoid truly undodgeable configurations.
- **Streaming**: continuous curtain of bullets from one or more sources. Creams the screen in a specific direction. Player flows through the gaps.
- **Aimed + fixed hybrid**: most common boss pattern. Fixed beautiful formation + aimed component for pressure. Best of both worlds.
- **Laser**: continuous or sweeping beam. Warning line appears (200-400ms) before damage activates. Player must reposition preemptively.
- **Bullet cancel**: all on-screen enemy bullets convert to score items. Triggered by bomb, boss phase change, or specific game mechanic.

## Bullet Visual Standards

- Core + glow: bright center (2-4px) + colored glow/outline (4-6px total). Dark outline (1px) around glow for contrast against any background. Never same color family as background.
- Minimum bullet size: 4px core. Smaller bullets are invisible at play speed.
- Speed tiers at 60fps: slow (1-2 px/frame — dense formations), medium (3-4 px/frame — aimed pressure), fast (5-8 px/frame — sniper/reflex).
- Depth sorting: enemy bullets render on top of everything except the player hitbox indicator. Items, player bullets, and effects render below enemy bullets. This is non-negotiable — bullets hidden by explosions are unfair deaths.
- Color conventions: warm colors (red, orange, pink) for aimed/dangerous bullets. Cool colors (blue, cyan, purple) for fixed/pattern bullets. Yellow/white for special mechanics. Avoid green bullets (colorblind common issue).
- Chunking: bullets organized into clear formations (rings, lines, waves). Single stray bullets feel unfair. Player reads formations, not individual projectiles.

## Enemy Design

- Popcorn enemies: small, die in 1-3 hits, fire simple aimed or static shots. Come in formation waves with distinct entry/exit animations. Primary role: drop power/score items, create screen pressure.
- Mid-boss: appears mid-stage, 2-4 patterns, moderate health. Teaches boss mechanics in lower-stakes context. Must be distinct from popcorn — larger sprite, name display, health bar.
- Boss: end-of-stage, 3-6 phases (spell cards/patterns). Each phase has distinct visual theme, bullet type focus, and named attack. Phase transition marked by explosion, color shift, and brief invincibility window for player repositioning.
- Boss health bar: prominent at top of screen with phase-segment markers (vertical lines or color bands). Depletes smoothly. Remaining phases visible as undepleted segments.
- Enemy entry: enemies never appear directly on top of player. Entry from screen edges, with brief warning indicator at spawn point (optional: for high-intensity sections, instant entry is acceptable but must be from screen edge only).

## Stages & Pacing

- Stage structure (per stage, ~3-5 minutes): pre-boss section 1 (1.5-2min) → mid-boss (30-60s) → pre-boss section 2 (1-1.5min) → boss (2-4 min).
- Each stage introduces at least 1 new enemy type and 1 new bullet pattern archetype.
- Stage background: scrolling parallax (2-3 layers) with stage theme. Must be significantly darker/dimmer than bullet layer. Use value contrast, not just color contrast. Test: take a screenshot in grayscale — bullets must still be clearly visible against background.
- Stage transitions: brief score tally + "Stage X" title card (2-3 seconds). Music crossfade or brief silence between stages.
- Final stage: no mid-boss. Extended boss fight (5-8 minutes, 6-10 phases). True final boss or final pattern after apparent victory is a genre trope — if used, make it a surprise but not unfair (one free bomb on reveal).

## Weapons & Power-ups

- Primary shot: auto-fire preferred (player always shooting). Focus mode may tighten spread or increase damage. Hold-to-shoot is acceptable if fire rate is high enough that holding is always correct.
- Shot power levels: 4-5 levels. Level 1: weak spread, Level MAX: dense, screen-covering firepower. Power items: small (1 level), large (MAX). Power loss on death: drop 1-2 levels or spawn power items at death location for recovery.
- Option/sub-weapon: orbiting or trailing helper that fires additional shots. Position: tracks player with slight lag. Adds firepower and visual flair.
- Bomb: screen-clearing attack. Types: full-screen blast (damage all enemies + cancel all bullets + 2-3s invincibility), directional beam (aimed, higher damage, smaller bullet cancel), defensive barrier (shorter invincibility, no damage).
- Bomb stock: start with 2-3, earn more from score milestones or item drops. Maximum stock 5-7. Bomb item drops from specific enemies or at predetermined score thresholds.
- Bomb visual: full-screen effect covering >60% of screen for 1-1.5 seconds. Must NOT obscure bullets that appear after the cancel window ends. Flash fade: white → color → transparent.

## Scoring System

- Core score sources: enemy destruction (base value × proximity bonus?), bullet grazing (+X per graze per frame), spell card capture (defeat boss phase without bomb/death — large bonus, typically 1.5-3× the phase's base score value), end-of-stage clear bonus (time remaining + lives remaining × multiplier).
- Grazing: +10 to +100 per bullet per frame in graze zone. Graze counter displayed prominently. Graze milestones: every 100/500/1000 grazes grants bonus (extend at 1000, score bonus at 500, etc.).
- Score multiplier / chaining: hitting enemies in succession without missing for >X frames increases a visible multiplier (×1 → ×2 → ×4 → ×8...). Resets on miss timeout. Alternatively: item collection chain — collect score items at top of screen (auto-collect line) for increasing value.
- Spell card capture bonus: defeat a named boss pattern without using bomb and without dying. Displayed as "Spell Card Bonus" with large score popup. Missed capture displays pattern name with no bonus.
- High score: saved locally (localStorage) + online leaderboard. Initials entry (3 characters) on game-over. Per-stage and full-run leaderboards.
- Replay: full-run replay saved automatically. Replay data: input log (movement, shot, bomb, focus), not video. Must be small (<1MB per run). Replay viewer: play/pause, speed control, input display overlay.

## Rank System (Dynamic Difficulty)

- Rank: a hidden or visible value that adjusts difficulty in real-time based on player performance. Increases: survival time, collecting items, high score, not dying. Decreases: death, using bombs.
- Rank effects: bullet speed (+0-30%), bullet density (+0-50%), enemy fire rate, pattern complexity (extra aimed component), boss phase count. Exact multipliers configurable.
- Rank should never create an unwinnable state. Maximum rank must be tested: the hardest possible configuration must be theoretically survivable by a skilled player.
- Rank floor: minimum rank per stage to prevent trivialization through intentional deaths. Rank ceiling: maximum rank beyond which no further scaling occurs.
- Rank display: optional (visible meter adds tension; hidden adds mystery). Either is valid — must be a documented design choice.

## HUD

- Top-left: score (large, readable).
- Top-right: high score (smaller, for reference).
- Bottom-left: lives (icons), bombs (icons).
- Bottom-center or side: power level (meter 0-MAX or numbered gauge).
- Boss fight overlay: boss name + health bar (top-center, spans 40-60% of screen width). Phase markers on health bar. Spell card name displayed prominently during active pattern.
- Graze counter: near score, prominent.
- All HUD: screen corners only. Center 60-70% of screen is clear gameplay area.
- HUD elements must not occlude bullets. Semi-transparent backgrounds (alpha 0.5-0.7) or outline-only text.

## Audio

- Stage BGM: driving tempo (120-160 BPM typical), loops seamlessly. Intensity layering: base track → add percussion during mid-boss → full instrumentation during boss. Boss BGM: distinct track, higher intensity.
- SFX: player shot (looping, pitch-shifts as power increases), enemy hit (short blip with pitch variation), enemy explode (size-proportional), item collect (ascending chime sequence), bomb activate (powerful rising sweep), player hit (sharp dissonant), player death (descending sting), boss warning siren (500ms before pattern), spell card declare (dramatic sting), stage clear (triumphant fanfare), extend/1UP (distinct celebratory jingle).
- Bullet SFX: whoosh for sweeping lasers, low hum for dense streaming patterns. Subtle but present.
- Audio priority: player hit/death > bomb activate > spell card declare > boss warning > item collect > enemy hit > ambient.

## Mobile

- Touch: drag anywhere to move (relative offset — player follows finger delta, not absolute position under finger). This is the ONLY viable scheme for bullet hell — d-pad overlays obscure too much screen and lack precision.
- Focus: second finger hold anywhere. Second touch toggles focus mode.
- Bomb: dedicated large button (bottom-right, 64×64pt minimum). Must be reachable without lifting movement finger.
- Auto-fire: always on while touching. No need for separate fire button.
- Portrait orientation preferred (vertical scrolling shmups) — matches arcade aspect ratio (3:4). Landscape for horizontal shmups.
- Hitbox always visible (no hover — touch has no hover state). Slightly larger hitbox indicator (6-8px) than desktop (4-5px) to compensate for finger imprecision.
- Background brightness: reduced to 60-70% of desktop value. Bullets must pop on smaller, dimmer mobile screen.
- Performance: mobile MUST maintain 60fps. Bullet patterns designed for 60fps timing. Frame drops = pattern timing breaks.

## Performance

- Object pooling for: ALL bullets (pool size: 2000-4000), ALL enemies (pool per type), ALL particles (pool: 500-1000), ALL items, ALL score popups. Zero instantiation during gameplay after pool init.
- Bullet rendering: use Phaser's built-in sprite batching or GPU particle layer. Bullets are the most numerous entity — rendering is the bottleneck.
- Max concurrent bullets: 500 (beginner) to 2000+ (expert). Pool pre-allocated at game start. Pool exhaustion = oldest bullets despawn gracefully (fade out, not pop).
- Fixed timestep physics for bullet movement. Variable-delta causes pattern drift over time.
- Frame rate: MUST maintain 60fps. Patterns assume frame-rate stability. FPS dips cause player death because bullet positions skip.
- Performance test: boss final phase at max rank, all bullets + particles + items active. FPS counter visible during test.
- Render diagnostics at peak: bullet count, enemy count, particle count, draw calls, frame time.

## Playtest

- Every boss pattern tested under: no-focus movement, focus movement, bomb cancel.
- Every pattern survivable without bomb (by skilled player with practice). Bomb is a safety net, not mandatory.
- Deathbomb window tested at 30fps, 60fps, 120fps, 144fps.
- Graze hitbox proximity tested with debug overlay showing graze radius vs hitbox radius.
- Rank system validated: full run at minimum rank, full run at maximum rank. Both completable.
- Full 1CC (1-credit clear) possible by skilled player with reasonable practice time. Not impossibly hard, not trivially easy.
- Pattern visibility test: screenshot in grayscale — bullets must still contrast against background. Test on calibrated monitor at 50% brightness.
- Mobile: 60fps sustained through boss final phase. Touch input latency <2 frames.
- Replay system: full run replayable without desync. Input log verified frame-accurate.
