# RPG / Action RPG Premium Quality Checklist

## Character & Progression
- Player character has customizable or class-distinct visual identity with readable gear tiers and weapon types.
- Progression: at least 4 stats/attributes that meaningfully change combat feel, survivability, or ability power — not just +2% per level that the player stops noticing.
- Skill tree/ability unlock: at least 3 distinct build paths with keystone nodes that fundamentally alter how abilities work (not just +5% damage). Respec cost escalates with level but is always achievable — never free (removes commitment) and never impossible (punishes experimentation).
- Level-up feedback: celebratory visual + audio + new-ability-highlight. Each tier jump unlocks something new, not just bigger numbers.

## Loot Economy
- Loot system: tiered rarity (Common/Uncommon/Rare/Epic/Legendary) with visual distinction on drop beacon, inventory icon, and equipped appearance. Every legendary has a name, lore snippet, and unique visual model — not a recolored base item.
- Loot affix economy math is modeled: probability space of affix combinations simulated (10,000+ drops), degenerate item detection (combinations that break the damage formula), "time to upgrade" analysis per equipment slot per level band.
- Economy sink design: gold/currency must have perpetual sinks at endgame (crafting rerolls, cosmetic unlocks, map/zone entry fees, auction house fees, respec costs) or inflation destroys the economy.
- Inventory UI: sorting, filtering, search, equipped-vs-hovered comparison with delta highlighting. Not a raw grid of 200 near-identical items.

## Combat
- Combat supports at least 2 play styles (melee, ranged, magic, stealth, summoner) with distinct mechanics per style — not the same rotation with different particle colors.
- Damage formula structure is documented: what multiplies vs. what adds. Community will reverse-engineer it regardless; undocumented formulas breed toxic "this stat is bugged" discourse.
- Buff/debuff cap is explicit and UI can display all active effects legibly. No hidden cap causing "why did my buff fall off?" confusion.
- Hit reactions: enemy flinch, knockback, stagger on meaningful hits. Enemies that don't react to being hit make combat feel like hitting a health bar.
- Status effects (bleed, burn, freeze, stun, poison) interact with each other — elemental reaction chains (Genshin Impact model) create emergent depth beyond individual effect potency.

## Enemy Design
- Enemy set scales across level range with visual and behavioral variants: at least 3 tiers per archetype (normal, elite, boss). New enemy behaviors introduced as game progresses, not reskinned stats.
- Enemy level/threat readable before engagement. Under-leveled and over-leveled encounters have distinct risk signals.
- Enemy variety does not stop at "reskinned rat with bigger numbers at level 50."

## Quest & World
- Quest system tracks active tasks, progress, rewards with map markers/compass indicators. Quest design avoids the four horsemen: fetch (go get X), kill (kill N), escort (protect slow NPC), delivery (go to location) — unless each has narrative stakes + player choice.
- World map: at least 3 distinct biomes/zones with unique enemy rosters, visual themes, traversal requirements.
- Side quests have character arcs and moral dilemmas, not just task-list filler. Witcher 3 standard: even side content has memorable NPCs and at least one player decision point.

## Dialogue & Choice
- Dialogue system: branching choices with consequences. Every dialogue choice produces a materially different game state — even if only tracked for a later callback. "Yes/Yes/Yes (different flavor)" destroys player trust.
- Skill checks in dialogue (persuasion, intimidation, knowledge) create role-playing depth.
- Faction reputation tracking with visible standing and faction-specific consequences.

## Save System
- Save/load preserves: character state, inventory, quest progress, world position, faction standing.
- Save file migration strategy: game patches that change skill trees must include save migration, not invalidate existing characters. Path of Exile's "full passive tree reset when we change the tree" is the gold standard.
- Multiple manual save slots + auto-save at major story beats and boss encounters.

## HUD
- Minimap with fog-of-war, quest tracker (1-3 active), health/mana/stamina bars, ability cooldown indicators, buff/debuff icon row, damage numbers (toggleable), loot feed.
- Modular HUD: players can reposition, resize, or hide individual elements.
- Tooltips show damage ranges with affix breakdowns; DPS comparison updates in real-time.

## Onboarding
- Recommended build path for new players who don't want to theorycraft from minute one.
- Tooltips explain synergies: "this node boosts your currently equipped fire skills by X."
- "I just want to play" option: auto-allocate stats for players who want the story, not the spreadsheet.

## Mobile
- Touch-target sizing: ability hotbar with 44x44pt minimum per button. 8 abilities = full phone width. Solutions: context-sensitive ability wheel, swipe-gesture casting, 4-visible + 4-swipeable.
- Virtual joystick fatigue mitigation: auto-run toggle, lock-on combat, controller support as first-class input.
- Inventory on mobile: tabbed views (weapons/armor/consumables/materials) + tap-select + tap-place + progressive disclosure tooltips.
- Network-state awareness: handle signal loss, WiFi-to-cellular transitions, background-suspend/resume cycles gracefully.

## Performance
- Renderer diagnostics checked in dense combat, populated town zones, and open-world traversal segments.
- Save file size and save duration monitored; auto-save must not cause frame hitch.

## Playtest
- Game loop tested through: character creation → early combat → questing → level-up → gear upgrade → boss fight → zone transition.
- Build diversity validated: at least double-digit viable endgame builds, not 3 meta builds dominating 200-node tree.
- Loot satisfaction tested: "time to next meaningful upgrade" mapped across all equipment slots and level bands.

## Accessibility
- Status effects (bleed, burn, freeze, stun, poison) distinguishable by icon + animation, not color alone — overlay a glyph or outline so colorblind players parse active debuffs.
- Dialogue, tooltips, and inventory stats legible; contrast meets AA at desktop and mobile text sizes, including affix delta highlights.
- Reduced-motion option for hitstop, screen shake, and combat VFX where motion carries the hit, crit, or danger signal.
- Subtitles/captions for voiced dialogue and important audio cues (level-up, boss roar, low-health warning, ambush stagger).

## Audio
- SFX for primary combat feedback: weapon hit, crit, ability cast, block/parry, enemy stagger, enemy death, level-up, and loot-drop beacon — each distinct and tied to a visible event.
- Music/ambience adapts per zone and combat state; mute/volume work and loop seams are clean across biome transitions.
- Audio never masks critical cues — low-health warning, boss telegraph, and ambush cues stay audible under combat music and ability layers.
- Scene change, fast-travel, and restart clean up audio: no dangling ambient loops, overlapping music stems, or leftover spell one-shots.
