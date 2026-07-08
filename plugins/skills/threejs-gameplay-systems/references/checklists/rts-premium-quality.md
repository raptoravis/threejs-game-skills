# RTS Premium Quality Checklist

## Camera & Navigation
- Camera supports pan (edge-scroll or touch-drag), zoom (smooth interpolation, not stepped), and optional rotate with configurable sensitivity.
- Minimap: terrain + units + buildings + resources with faction-color differentiation and fog-of-war boundaries. Clickable for fast navigation. Bottom-left or bottom-right, ~15-20% of screen.
- Screen real estate budget: game world 70-75%, minimap 15-20%, control panel 15-20%, resource bar top 5%.

## Unit Selection & Command
- Selection: single-click, drag-box (must show selection rectangle), shift-add, double-click-select-all-of-type. Visual feedback within 1 frame of input.
- Right-click context commands: move, attack-move, gather, build, repair, ability-target. Cursor icon changes based on target type before click.
- Control groups: number keys (1-9) for group assignment; double-tap group key to center camera on group. Visual group indicators on selected units.
- Command feedback: selection rings, move-command lines/pings on ground, attack-move cursor change, build-placement ghost (valid = green, invalid = red).
- Ability hotkeys with visual cooldown feedback on activation. Grid hotkey layout (QWER/ASDF rows) is industry standard.

## Factions & Economy
- At least 2 distinct factions with unique unit rosters, build trees, visual identity, and audio language.
- Economy: at least one primary resource gathered from map nodes + secondary constraint (power/supply/population/tech tier). Resource-gathering units have visible carry state.
- Base building: production structures, tech structures, defenses, resource drop-off points. Construction states visible (foundation → frame → complete + health percentage).
- Tech tree: at least 3 branches (military, economy, utility) with meaningful unlock gating. Tech dependencies visible in UI.

## Unit Design
- Unit roster per faction: worker, scout, basic infantry/vehicle, ranged/siege, anti-air, support/healer, late-game super unit.
- Unit stats: HP, attack, defense/armor type, movement speed, attack range, attack speed, cost. Armor-type vs. damage-type interaction matrix creates strategic depth.
- Unit pathfinding: flow-field, grid, or navmesh with local avoidance — groups must not clump or push through each other. Formation movement preserves relative positions.
- Attack ranges, ability radii readable through range rings on hover/select and preview indicators before commit.

## Fog of War
- Three states: fully visible (bright, units + terrain), explored-but-not-visible (dimmed, terrain only, last-known building positions), fully hidden (black/unexplored).
- Per-unit vision ranges; terrain height affects sight lines where applicable.
- Fog-of-war updates per-frame with smooth reveal; no "pop-in" of discovered terrain.

## UI & HUD
- Selection panel: unit portrait, health bar, armor type, abilities with cooldown indicators, production queue (with cancel-per-item).
- Resource bar: primary + secondary resource counts with income rate (+X/min).
- Minimap: terrain, units (color-coded dots), buildings (color-coded squares), resources, alert pings.
- Alert feed: under-attack notifications, build-complete, tech-complete, resource-depleted with click-to-jump.
- Build queue visible per production structure; queue management (add/remove/reorder) supported.

## Enemy AI
- AI evaluates positioning, terrain advantage, unit matchups, and objective pressure. Does not march units into hard counters without support.
- At least 3 difficulty levels or strategic personalities (aggressive/rush, defensive/turtle, expansionist/boom).
- AI adapts composition based on scouted player unit types, not random builds.
- Difficulty scaling via smarter decisions and multi-pronged attacks, not resource cheats alone.

## Audio
- Unit acknowledgement barks (select, move, attack) with faction-appropriate voice and personality. Random pool of 3-4 variations per action.
- Attack alert sounds break through all other audio (highest mix priority).
- Structure-complete fanfare, tech-research-complete sting, resource-deposit chime.
- Ambient: biome-specific environmental audio; battle sounds attenuate with camera distance.

## Replay & Observer
- Game event log: every action recorded as structured event (SpawnUnit, MoveOrder, AttackCommand, BuildStructure, TechResearch). Enables: replay (playback from log), spectator mode, kill-cam/match review, bug reproduction.
- Observer mode: free camera, follow-player视角, fog-of-war toggle per player. Essential for casting and community.

## Mobile
- Tap-select, drag-box, two-finger pan/zoom. Context-command via tap-on-target after selection.
- Control group replacement: on-screen group tabs or swipeable unit-ribbon.
- Build menu: collapsible radial or bottom-ribbon, not full-screen overlay.
- Minimap must be tappable at phone scale (~15% of screen minimum).
- Auto-assign workers to nearest resource node option as onboarding aid.

## Performance
- Object pooling or LOD for unit meshes, projectiles, VFX at large army sizes.
- Frustum culling avoids rendering off-screen units.
- Renderer diagnostics checked at peak unit count (200+ entities with active animations and selection indicators).
- Pathfinding runs on separate update cadence from rendering; large groups recalculate paths in staggered batches.

## Playtest
- Game loop tested through: base start → resource gathering → tech-up → army production → map control → multi-group engagement → victory/defeat.
- Replay system verified: full game replayable from event log with deterministic outcome.
- Control group and hotkey responsiveness tested under maximum selection size.
