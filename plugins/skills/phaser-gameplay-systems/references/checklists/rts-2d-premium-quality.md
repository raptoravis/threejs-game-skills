# 2D RTS Premium Quality Checklist

Based on StarCraft 2, Age of Empires 2, StarCraft: Brood War, Tooth and Tail, Northgard, and modern indie RTS design patterns. Targets top-down/isometric 2D RTS games built with Phaser.

## Unit Design — Counter Systems

The core tension in RTS unit design: hard counters (clear direction, SC2 style) vs. soft counters (skill expression, AoE2/BW style).

### Hard Counter Model (SC2)
- Units deal flat bonus damage vs. specific tags: Marauder +10 vs. Armored, Hellion +5 vs. Light.
- Advantages: clear direction, easy to learn, dramatic composition swings.
- Disadvantages: binary "I win/I lose" feel. SC2's 2-axis system (Light/Armored + Bio/Mech) forces global changes when one interaction is off.
- Rule: if using hard counters, every unit must have at least 2 viable counter options from different tech tree branches. No single counter that can't be scouted or teched to.

### Soft Counter Model (AoE2 / Brood War)
- Damage scaled by percentage vs. armor size: Normal = 100% all, Explosive = 100% Large / 75% Medium / 50% Small, Concussive = 100% Small / 50% Medium / 25% Large.
- Hidden armor classes (11+ in AoE2): infantry, archer, cavalry, siege, elephant, building, etc. Every unit belongs to multiple classes and can deal bonus damage to specific classes.
- Advantages: surgical balance (buff anti-Eagle damage without touching anti-Knight), skill expression (countered unit still useful with good micro), dense interaction graph.
- Rule: if using soft counters, provide at least 6 hidden armor/damage-type classes for tuning granularity.

### Recommended Hybrid for 2D RTS
- Use many tags (8-12) with tunable per-unit bonus values.
- Most counters: soft (25-50% bonus damage, not 100%).
- Select hard counters (100%+ bonus) reserved for specialist units: anti-air only hits fliers, siege only crushes buildings.
- Every faction: asymmetric roster but shared tag system. Example tags: Light, Heavy, Biological, Mechanical, Flying, Cavalry, Siege, Structure, Hero, Worker.

### Unit Roster Minimum per Faction
- At least 2 factions with unique unit sprites and audio language.
- Per faction: worker/gatherer (×1), scout (×1, fast, low HP, large vision), basic melee (×1), basic ranged (×1), anti-air (×1, only if fliers exist), siege/anti-building (×1), support/healer (×1), late-game elite (×1-2). Total: 8-10 units per faction.
- Unit stats per unit type: HP, attack damage, attack type (which armor classes it's strong/weak vs.), armor values (per type), movement speed (px/s at 60fps), attack range (px), attack cooldown (ms), cost (resources), build time (s), supply/population cost.
- Unit sprite frames: idle (4 frames), move (6-8 frames, directionally varied or 4-directional), attack (3-5 frames), death (3-4 frames). Distinct silhouette per faction — player must identify unit at a glance.

## Factions & Economy

### Resource Model
Choose one and document explicitly:
- **Harvested resources** (AoE2 style): workers gather from map deposits (gold mines, forests, stone quarries, farms for food). Deposits are finite → map control matters. Workers are vulnerable → raiding matters. Population cap (200 typical) limits army size.
- **Territory-based resources** (Northgard/Tooth and Tail style): control zones on map to generate income. No worker micro — income is about map presence. Resource buildings passively generate over time. Simplifies economy, shifts focus to combat timing.
- **Hybrid**: primary resource from territory/buildings (passive), secondary resource from combat (active — kills grant gold). Encourages fighting over turtling.

### Economy Balance Rules
- Starting resources: enough to build 1 worker + 1 basic production structure + queue 2 basic units on game start. Player should be making decisions within 10 seconds.
- Income rate: early game (first 2 minutes) income enables 1 unit production queue constantly running. Mid game (3-8 min): income supports 2-3 production structures simultaneously. Late game (8+ min): income supports full production from 5+ structures + tech research.
- Resource gathering efficiency: worker gathers X resource per second. Base: 3 workers per resource node optimal (after which diminishing returns). Upgrade tiers: +15% gathering speed per tier (2 upgrade tiers max).
- Supply/population: start with 10/200 capacity. Supply structures provide +8 population each. Being supply-blocked (no free population) must have clear "SUPPLY BLOCKED" audio/visual warning.

### Technology Tree
- Tech tree structure: at least 3 branches per faction (Military, Economy, Utility/Defense). Tech dependencies visible in UI: grayed-out with "requires X building" tooltip. Tech research time: 30-90 seconds depending on tier.
- Tier/age advancement: gated by building requirements + resource cost. Tier 1→2: 500 resources + 1 production building. Tier 2→3: 1000 resources + 2 buildings of tier 2. Each age unlocks new units, buildings, and upgrades. Age-up visual: brief animation on Town Center/main building.
- Opportunity cost: researching tech A means NOT researching tech B for the duration. Two tech structures can research in parallel. Ahead-of-age penalties: researching Tier 3 tech in Tier 2 costs 1.5× resources and 1.5× time.

## Fog of War

- Three states per tile: Fully Visible (bright, units + terrain + resources visible, within friendly unit/building vision range), Explored/Revealed (dimmed, terrain + last-known building positions visible, enemy units INVISIBLE), Unexplored (black, never seen).
- Vision ranges: infantry 6-8 tiles, scouts 10-14 tiles, buildings 4-8 tiles, towers/outposts 10-12 tiles. Vision is circular centered on unit/building.
- Elevation (if applicable): higher ground sees over lower ground. Units on cliffs see further. Units in valleys have reduced vision.
- Fog-of-war updates: every frame for visual smoothness (fade edges of explored radius over ~15 frames, not pop-in).
- Minimap: mirrors fog states. Terrain rendered static (pre-computed texture). Units: color-coded dots (size proportional to unit importance). Buildings: color-coded squares. Fog: black overlay with soft edge.

## Unit Selection & Command

- Selection: single-click (select 1 unit), drag-box (show selection rectangle with semi-transparent fill), Shift+click (add individual unit to selection), Ctrl+click (select all visible of same type), double-click (select all visible of same type on screen).
- Selection feedback: within 1 frame of input. Selected units show ring/bracket highlight. Selection count displayed prominently.
- Control groups: Ctrl+1-9 to assign. Press 1-9 to recall. Double-tap 1-9 to center camera on group. Shift+number to add units to existing group. Group indicator: numbered badge on unit when assigned.
- Right-click context commands on target: ground = move, enemy unit = attack, friendly unit = follow/escort, resource = gather, own building = garrison/return. Cursor changes icon based on what's under the cursor — must update every frame.
- Attack-move: A + left-click. Units move to destination, attacking any enemy encountered en route. Default behavior for most combat commands.
- Shift-queue: hold Shift to queue multiple commands sequentially. Visual: numbered waypoint markers along path. Right-click waypoint to remove it.
- Formation movement: selected group maintains relative positions during move. Units at edges path to edges, center to center. Formation toggle: line, box, scattered.

## Pathfinding

- Grid-based flow field for group movement (industry standard for 2D RTS): precompute direction vector for each grid cell pointing to goal. All units read their cell's vector and move accordingly. O(k) where k = grid cells — independent of unit count. 70%+ CPU savings vs. per-unit A* for groups.
- Per-unit A* for small groups (special abilities, workers) and long-distance routes.
- Local avoidance: units must not overlap or push through each other. Simple separation force: if distance < threshold, push apart proportional to overlap. Tuned to feel natural, not jittery.
- Pathfinding grid resolution: typically 1-2 tiles in size. Larger cells = faster compute, coarser paths. Smaller cells = finer paths, more CPU. Rebuild flow field only when goal changes or static obstacles change — not every frame.
- Dynamic obstacle handling: if path blocked by newly constructed building, units recalculate. Brief "confused" animation (200-300ms) while recalculating.

## UI & HUD

- Screen real estate budget: game world 70-75%, minimap 15-20% (bottom-left or bottom-right corner), control panel 15-20% (bottom, appears when unit/building selected), resource bar 5% (top of screen).
- Minimap: terrain (pre-rendered static texture), units (colored dots, faction-colored), buildings (colored squares, larger than unit dots), resources (yellow/gold dots), alert pings (blinking red circles, click to jump camera). Tappable/clickable for fast navigation.
- Selection panel (appears when unit(s) selected): selected unit portraits in a row at bottom, individual unit HP bars (green→yellow→red), abilities in a grid with cooldown overlays, unit stats summary (damage, armor, speed, range).
- Resource bar (always visible, top): primary resource icon + count + income rate (+X/min), secondary resource icon + count, supply/population (current/max, red if at cap).
- Alert feed: stack of notification messages (top-right or side): "Unit under attack" (red), "Building complete" (green), "Research complete" (blue), "Resource depleted" (yellow). Click to jump camera to event. Alerts persist for 5-8 seconds then fade.
- Build queue: production structures show queue of units being built. Progress bar per unit in queue. Cancel individual items. Queue length visible (e.g., "3 units queued").
- Hotkey layout: grid layout (QWER/ASDF rows) maps to command card buttons. Standard: Q=top-left ability, W=top-right, A=bottom-left, S=bottom-right. Remappable.

## Enemy AI

- AI must evaluate: positioning (am I in tower range?), force comparison (can I win this fight?), objective pressure (should I attack or defend?), and resource state (can I afford losses?).
- Difficulty levels: at least 3 — Easy (passive, builds up slowly, attacks with single-unit-type waves), Normal (balanced expansion + tech, attacks with mixed compositions by mid-game), Hard (aggressive early pressure, adaptive composition based on scouted player units, multi-pronged attacks).
- AI personalities (can be combined with difficulty): Aggressive/Rush (early pressure, fast tech to basic units), Defensive/Turtle (builds defenses, techs to late-game elite units), Expansionist/Boom (prioritizes economy, builds many expansions, swarms late).
- Difficulty scaling: prioritize smarter decisions over resource cheats. Easy: AI uses 70% of its income (wastes 30%). Normal: 100% income usage, no vision cheats. Hard: 100% income, adaptive composition, still no vision cheats. Expert: adds 20% resource bonus + multi-pronged attack coordination.
- AI APM (actions per minute) cap: Easy=30, Normal=60, Hard=120, Expert=200. Uncapped AI with instant reactions feels unfair. Capped AI with smarter decisions feels challenging.
- Cheating rules (if used): hidden starting resource bonus is tolerable (player can't see it). Visible cheating (damage reduction, instant build, fog-of-war ignoring) is NOT acceptable — players notice and resent it.

## Audio

- Unit acknowledgement: select, move, attack. Faction-appropriate voice and personality. Random pool of 3-4 variations per action per unit type. "Yes?", "Moving.", "Attack!" — short, distinct.
- Attack alert: highest mix priority sound. Breaks through all other audio. "Our forces are under attack!" + ping on minimap.
- Structure complete: ascending chime. Tech complete: distinct fanfare per tier. Resource deposit: subtle chime (repeating for worker cycles). Age-up: major fanfare (2-3s).
- Ambient: biome-specific environmental loop (wind through grass, forest birds, desert wind). Intensity scales with zoom level — louder when zoomed in.
- Audio attenuation: battle sounds fade with camera distance from action. Close: full volume. Far: 30% volume + low-pass filter.

## Mobile

- Tap-select unit, drag-box (two-finger pan while one-finger selects), double-tap = select-all-visible-of-type.
- Control group replacement: on-screen group tabs or swipeable unit ribbon (bottom). Tap group tab to select, hold to assign current selection.
- Build menu: collapsible bottom ribbon (swipe up to expand, tap to select building, tap map to place). Not full-screen overlay — must see game world while building.
- Two-finger pan/zoom: standard gestures. Pinch to zoom, two-finger drag to pan. Single-finger tap for selection, single-finger drag for box-select.
- All interactive elements ≥44×44 logical pixels. Minimap tappable at phone scale (≥15% of screen minimum for finger accuracy).
- Portrait: single-column UI layout. Landscape: wider UI with minimap larger. Both must work.

## Replay & Observer

- Game event log: every action recorded as structured event with timestamp: SpawnUnit(unitType, player, position, timestamp), MoveOrder(unitIds, destination, timestamp), AttackCommand(unitIds, targetId, timestamp), BuildStructure(structureType, player, position, timestamp), TechResearch(techId, player, timestamp), ResourceTransaction(amount, type, player, timestamp).
- Events stored in append-only log. Enables: replay (re-simulate from event log), spectator mode (consume event stream), reconnect (replay from log to catch up), bug reproduction (replay log deterministically).
- Observer mode: free camera (drag to pan, scroll to zoom), follow-player view (attached to player camera), fog-of-war toggle per player. Essential for casting/streaming.
- Replay controls: play/pause, speed (0.5×, 1×, 2×, 4×, 8×), skip to timestamp, rewind (jump to start + fast-forward to target time).
- Replay file size: event log, not video. Target: <1MB per 30-minute game.

## Performance

- Flow field pathfinding: compute once per command group, cached until goal changes. Single flow field serves all units in group. Rebuild only when static obstacles change (building placed/destroyed). Not every frame.
- Object pooling: units (pool per type per player), projectiles (pool = max concurrent), particle VFX (pool = max concurrent), UI elements (selection brackets, health bars). Zero instantiation during gameplay after initial pool fill.
- Render diagnostics at peak: 200 units on screen (100 per side) + all projectiles + all VFX + fog overlay + minimap + UI. Target: 60fps stable.
- Minimap: rendered to separate texture at lower resolution (e.g., 256×256). Updated every 0.5-1s for unit positions — not every frame.
- Network (if multiplayer): lockstep model for deterministic simulation. Only player inputs transmitted (not unit positions). Input delay: 2-4 frames (33-67ms at 60fps) buffer. Bandwidth: <5KB/s per player.

## Playtest

- Full match loop: build workers → gather resources → construct production → tech up → produce army → scout enemy → engage in battle → expand to new base → tech to tier 3 → final assault → victory/defeat.
- All factions tested in mirror match (same faction vs. same faction) and cross-match (each faction vs. each other).
- AI tested at all difficulty levels with full match completion. Easy AI defeatable by beginner (<10 hours experience). Hard AI challenging for experienced player (>50 hours experience).
- Economy tested: all upgrades mathematically verified. No infinite resource loops or economy exploits.
- Pathfinding tested: 50+ unit groups moving across full map with obstacles. No units stuck, no pathfinding-related frame drops.
- Fog of war verified: enemy units not visible through fog. Elevation vision rules correct. Minimap matches game-world fog state exactly.
