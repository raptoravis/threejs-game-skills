# SLG / Strategy Simulation Premium Quality Checklist

## Grid & Map
- Grid-based or hex-based map with readable tile types: terrain modifiers (movement cost, defense bonus, cover), resources, impassable zones.
- Tile info on hover/select: terrain type, movement cost, defense bonus, current occupant. No hidden information — all modifiers visible before committing move.
- Camera: 90-degree rotation snap lock, not continuous 3D rotation. Triangle Strategy testing proved continuous rotation disorients players from grid reference; 90-degree snap fixed it.
- Tactical overview (zoomed out, icons) and unit-close-up (zoomed in, models) both usable with smooth transition.

## Unit Design
- Unit roster: at least 8 distinct unit types with unique stats, movement ranges, weapon types, abilities, and visual identity.
- Unit stats: at least 6 meaningful attributes — HP, attack, defense, movement, range, plus special stat (armor type, morale, energy, ammo).
- Unit promotion/class-change tree: at least 2 branching paths per base class, with visible requirements and stat preview.
- Movement range and attack range highlighted on tile hover: distinct colors for move-only, attack-capable, ability-targetable, and out-of-range tiles.

## Turn System
- Turn structure is explicit: player phase (move + act) → enemy phase → neutral/environment phase. Phase transitions have clear UI banner and audio.
- Turn economy when using CT/initiative system: action weight determines next-turn delay. Wait = fast return; full action = slow return. FFT's CT refund model is the gold standard.
- Combat preview before commit: hit chance (%), damage range (min-max), counterattack info, terrain/ability modifiers. No "surprise" outcomes that the preview didn't show.

## Combat
- Damage formula is transparent: player can see how attack, defense, terrain, and weapon-triangle/advantage interact. Hidden math creates "why did that do so little/much?" frustration.
- Weapon triangle or advantage system creates tactical rock-paper-scissors depth beyond raw stat comparison.
- Terrain effects: at least 5 tile types with gameplay impact — plains, forest/cover (defense+), mountain/impassable, water (movement-), building/fort (defense++).
- Permadeath or injury system decision is explicit: if permadeath, maps are designed with recovery paths. If no permadeath, failure state is clear and recoverable.
- Fog of war (if present): hidden, previously-seen (dimmed + terrain-only), visible. Per-unit vision ranges. Vision blocked by terrain and buildings.

## AI
- Enemy AI evaluates positioning, terrain advantage, unit matchups, and objective pressure. Does not suicide into hard counters.
- At least 3 difficulty levels or strategic personalities (aggressive, defensive, balanced) with distinct tactical priorities.
- AI turn speed: configurable or auto-advance. Enemy movement animations skippable or speed-adjustable.

## Economy & Base
- Economy: at least 2 resource types (gold + material/mana/supply) earned from map nodes, buildings, or per-turn income.
- Base/settlement building: unit-production, resource-generation, defense, tech structures. Construction visible on world map.
- Between-mission management: save, unit inventory/equipment, squad selection, shop. Clear navigation between mission-select and base screens.

## UI & HUD
- Selected-unit panel: portrait, HP bar, stats (attack/defense/move/range with buff/debuff modifiers visible), abilities with uses-remaining.
- Minimap: terrain, unit positions (color-coded dots), fog-of-war boundaries, objective markers.
- Turn order display: visible initiative/turn queue showing next 5-8 actors. Essential for CT-based systems.
- Damage forecast: on targeting enemy, show expected damage range before committing attack.
- Mobile: 8x6 grid auto-adapting to phone screen in portrait, no scrolling needed (FEH standard). Tap-to-select, tap-to-move/attack, swipe-to-pan.

## Audio
- Unit-select acknowledgement barks with character personality.
- Movement, attack/impact, critical-hit, level-up, death, turn-change, objective-update, victory/defeat — all have distinct audio.
- Adaptive music: player-phase theme more heroic (brass-forward), enemy-phase theme more ominous (brass-muted). XCOM 2's Wwise stem manipulation is the gold standard.
- Civilization VI model for era-progression: each faction theme has 4 arrangement versions (ancient solo → medieval ensemble → industrial symphony → atomic electronic) that blend in real-time.

## Progression
- Campaign structure: sequential missions with inter-mission management, branching paths, or open-map selection.
- Unit progression: XP → level-up → stat gains + new ability unlocks. Unit identity deepens over campaign; losing a veteran unit should hurt.
- Tech tree or research: at least 3 branches with meaningful unlock gating. Research completion tied to in-game time or mission count.

## Performance
- Object pooling or LOD for unit meshes at large map scale. Frustum culling for off-screen units.
- Renderer diagnostics checked with full map revealed, max unit count, and UI overlays active.

## Playtest
- Game loop tested through: deployment → movement → combat → unit promotion → base building → tech research → multi-mission campaign progress.
- Combat preview accuracy verified: predicted damage range vs. actual outcomes within stated bounds across 100+ sample attacks.
- AI decision quality validated: no suicide charges, no idle units during active combat phases.
