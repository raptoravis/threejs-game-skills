# Survival / Crafting Premium Quality Checklist

## Opening Experience (First 60 Minutes)
- The first 60 minutes are a designed guided-discovery experience, not "punch trees, starve, quit." Immediate crisis (crash landing, dropped in wilderness), clear first goal (build shelter before night, find water), and a "wow" moment within 30 minutes.
- Unique opening scenario with narrative stakes differentiates this survival game from every other "naked, punching a tree" start.
- Early-game threat creates immediate tension without being fatal on first encounter.

## Core Loop
- Resource gathering: rhythmic/meditative quality ("zen of chopping"), tiered progression (wood → stone → iron → steel → advanced composites), environmental storytelling through resource placement (dangerous zones = better resources).
- Crafting: multi-step dependency chains (mine ore → smelt into ingots → forge into components → assemble into item). Each step may require a dedicated workstation with its own fuel/power requirements.
- Discovery as recipe-unlock driver: learn through experimentation, finding blueprints, or "sketch what you see." Recipe gating behind exploration and combat milestones, not just "collect 50 more of the same resource."
- Survival meters create interesting decisions, not busywork: when food is abundant but costs inventory space, the decision is interesting. When food drains in 90 seconds and is everywhere, it is tedium. Food that provides buffs (max HP/stamina) rather than merely preventing death makes eating aspirational.
- Inventory: weight-based encumbrance (not slot-based), specialized storage containers, quick-stack to nearby chests, vehicle/mount storage for expedition range extension.

## Base Building
- Building: foundation, wall, floor, roof, door, window, at least 2 furniture/workbench types. Snap-point placement or free placement. Structural integrity calculations (can't build infinitely high without support).
- Building feels architectural, not grid-bound: rotated pieces, overlapping placements, terrain modification (dig/raise/flatten), smoke/fire mechanics requiring ventilation, furniture providing gameplay bonuses (comfort → longer rested buff).
- Building has purpose beyond aesthetics: comfort/rested bonus duration, storage organization, NPC/villager attraction, defense (raids scale with base investment), crafting station upgrades requiring more space.
- Build mode: instant toggle from gameplay mode. Placement ghost (green = valid, red = invalid with reason). Reclaim/dismantle with full or partial resource refund.
- Precision: temporary top-down or free-camera view for build mode. Pieces must not fail placement due to 2cm terrain bumps.

## Threat & Day/Night
- Day/night cycle changes gameplay: visibility, enemy behavior, temperature, spawn rules. Night is genuinely threatening, not just cosmetic.
- Threat escalation follows location, time, or progression triggers: early zones safer than late-game biomes. Valheim's biome progression (Meadows → Black Forest → Swamp → Mountains → Plains → Mistlands) is the curated-threat gold standard — each biome introduces a fundamentally new danger type.
- Enemy/threat set: passive wildlife, aggressive predators, environmental hazards (cold, heat, poison, radiation), and raid/event enemies. At least 3 threat types.
- Enemy audio telegraphing: hear the troll before you see it. Distinct threat sounds per enemy type.

## World & Exploration
- World: procedurally generated or hand-crafted with at least 3 biomes containing distinct resources, threats, visual identity.
- No quest marker: curiosity-driven exploration. "I wonder what's in that cave / on that island / below that reef." World design rewards curiosity with unique resources, lore, vistas, new recipes.
- Weather matters: storms damage exposed structures, rain waters crops, wind direction affects sailing. Weather is a gameplay system, not a visual effect.

## Progression & Endgame
- Progression is player-directed: the game does not tell you what to do next; you discover the next tier's requirements through exploration and experimentation.
- Infrastructure milestones: workbench → smelter → forge → automated systems. Each tier feels like an achievement.
- Mobility unlocks: walk → swim → boat → portal → flight. Each unlocks new exploration possibilities.
- Automation as progression, not cheat: mid-to-late-game, basic gathering should be automatable (crops grow, smelters auto-process, NPCs/creatures assist). Prevents late-game from becoming "collect 500 iron ore by hand."
- Endgame after base completion: procedural challenge scaling (raids), creative-mode transition, prestige/reset mechanics, social gameplay (showing off builds, cooperative megaprojects). "Base is done, now what?" must be answered.

## Multiplayer & Griefing
- Multiplayer is cooperative by design: activities benefit from multiple players (sailing needs multiple stations, base defense covers multiple angles, resource hauling faster with convoy).
- Griefing surface evaluated per mechanic: can a stranger destroy hours of work? trap you in your own base? steal from chests? lure enemies in? Solutions: permission system per chest/door, claim blocks, PvP toggle, admin rollback tools.
- Progression scaling for late joiners: new player joining a server with endgame veterans should still experience meaningful progression. Shared progression milestones or explicit mentor mechanics.

## Save & Return
- Save/load preserves: world state, player inventory, built structures, placed items, crop growth, crafting timers.
- "Return after 6 months" experience: base still there, welcome-back summary, controls unchanged (resist redesign urge), clear indicators of what changed, catch-up mechanics that don't trivialize early game.
- Save file compatibility across updates: world saves survive building-system changes, terrain generation updates, and crafting rebalances. Explicit upgrade paths with clear communication about what breaks.

## HUD
- Health, stamina, hunger, thirst meters are persistent. Information is diegetic where possible (character shivers when cold, screen edges frost, stomach growls).
- Inventory is full-screen overlay. The minimap is deliberately absent in premium survival — forces environmental navigation and observation.
- Crafting UI: available recipes, required resources, unlock prerequisites. Recipe search/filter. Crafting queue.

## Mobile
- Inventory on mobile: tap-to-select + tap-to-slot, tab-based category separation, context-sensitive action buttons, auto-deposit to nearby chests one-tap.
- Base building on mobile: grid-snapping with generous tolerance, staged construction (tap to designate → confirm), build-camera mode (zoom out, top-down).
- Hotbar compression: 5-6 slots vs. PC 9. Context-sensitive tool switching (look at tree = auto-equip axe).
- Auto-attack for combat; contextual interact prompts near player character; radial menus activated by holding on player.
- Battery: aggressive simulation LOD (only simulate chunks near player), pause-on-background with graceful resume, low-power mode reducing non-critical tick rates.

## Audio
- Ambient loop varies by biome, time of day, weather. Rain on different roof materials sounds different.
- Enemy audio telegraphing: hear before see. Distinct per threat type.
- Crafting station sounds convey activity; base "home" ambience subtly shifts when entering base (fire crackle, wind muffled, footstep reverb change).
- Music: adaptive, layered. Safe at base, tense during exploration, combat during threats.

## Performance
- Persistent world simulation optimization: only simulate chunks near player; aggressive LOD for distant terrain and structures.
- Renderer diagnostics checked in dense base areas, during weather/particle events, across biome transitions.
- Save file size monitored; autosave must not cause frame hitch.

## Playtest
- Game loop tested through: spawn → gather → craft → build → explore → survive night → upgrade gear → biome transition.
- Opening 60 minutes tested with new players: do they reach the "wow" moment? Do they understand the first goal without a wiki?
- Building system tested: snap reliability, structural integrity predictability, reclaim accuracy, terrain-modification consistency.
