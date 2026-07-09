# 2D RPG Premium Quality Checklist

Based on Octopath Traveler, Sea of Stars, Chrono Trigger, Final Fantasy, Undertale, CrossCode, Metaphor: ReFantazio, and genre-wide best practices for combat, progression, economy, quest, and world design.

## Combat System — Foundation

- Choose your combat foundation explicitly and document it: turn-based (strategic/deliberate), ATB (time-pressure/urgency), action RPG (reflexes/positioning), or hybrid (real-time exploration → turn-based tactical for serious fights, as in Metaphor: ReFantazio and Trails through Daybreak).
- Turn order visibility: display predicted turn order for the next full round. Octopath/FFX-style timeline bar at top or side of screen. Players must be able to plan around who acts next.
- Party size: 3-4 active members. Hot-swap reserve members without turn penalty (Sea of Stars standard). Total party roster: 6-8 characters with distinct combat roles.
- No dead turns: every character must have something useful to do regardless of damage-type mismatch. Normal attacks should generate secondary resources (MP, boost gauge, combo points, mana orbs) so the player is never "out of options."
- Resource cycle design: normal attacks → generate MP + secondary gauge → spend on skills/combos → earn ultimate charge through combat activity → loop. Every action feeds into another system.

## Break, Weakness, and Boost Systems

The modern standard as established by Octopath Traveler and Sea of Stars:

- Weakness system: every enemy has specific damage-type weaknesses (weapon types: sword/spear/dagger/axe/bow, elements: fire/ice/lightning/wind/light/dark). Hitting a weakness deals bonus damage (1.3×) and reduces enemy Shield Points by 1.
- Shield/Break mechanic: enemies have visible Shield Points (1-12 depending on tier). When SP reaches 0: enemy is Broken — stunned for current + next turn, takes 2× damage from all sources, current action canceled. Break window is the payoff for tactical setup.
- Weakness discovery: weaknesses displayed as "?" initially, revealed on first hit. Fixed order display lets players use process of elimination. Optional "Analyze/Libra" skill reveals all weaknesses at once (costs a turn).
- Boost Point (BP) system: each character gains 1 BP per turn (max 5). Spending BP amplifies actions — more hits (breaks more shields), more damage, longer buffs. Creates tempo decisions: bank BP for big burst or spend now for consistent pressure.
- Alternative — Lock system (Sea of Stars): special enemy attacks display "locks" with specific damage type icons. Hitting matching types breaks lock segments. Breaking all locks cancels the attack + staggers enemy. Partial breaking reduces damage. System expects partial mitigation, not always full cancel.
- Alternative — SMT Press Turn: hitting weakness or scoring critical grants extra actions (half-turn). Missing or hitting resistance loses turns. Creates extreme risk/reward around weakness exploitation.

## Combat Feel — Exact Timing Specifications

From combat design analysis at 60fps reference:

### Hitstop (Freeze Frames)
| Attack Type | Full Freeze (frames) | Slowdown (50-70% speed) |
|---|---|---|
| Quick jab | 2-3 | 4-6 |
| Standard attack | 4-6 | 6-8 |
| Heavy/special | 6-10 | 8-12 |
| Ultimate/limit break | 12-18 (with cinematic UI) | — |

- Hitstop must freeze BOTH attacker and target simultaneously. Rest of world continues normally.
- Validation: test at 1.25× game speed. Light attacks must still register cleanly.

### Screen Shake
| Attack Type | Duration | Amplitude | Direction |
|---|---|---|---|
| Light | 2-4 frames | Small (1-2px) | Match attack vector |
| Heavy | 6-8 frames | Medium (3-5px) | Match attack vector |
| Explosion | 10-16 frames | Large (5-8px) | One slow wave + quick tail |

- Do NOT stack shake from simultaneous hits. Gate by camera focus.
- If testers report dizziness, cut horizontal shake first.

### Damage Numbers
- Critical: largest font, yellow/orange, shake/explode animation.
- Healing: green. Elemental damage: color-coded (red=fire, blue=ice, purple=poison).
- Normal: smaller, neutral white. Animation: float upward + fade over ~0.8s. Scale with damage amount.
- Bold outline font for readability against battle backgrounds.

### Feedback Timing Hierarchy
- Immediate (0-100ms): hitstop, impact flash (1-2 frame high-contrast palette swap), screen shake
- Short-term (100ms-1s): damage numbers, HP bar update, enemy flinch reaction
- Long-term (1s+): XP notification, level-up fanfare

## Character Progression

- Stats: at least 6 primary attributes (HP, MP/SP, ATK/Physical Attack, DEF/Physical Defense, MAG/Magic Attack, SPD/Agility). Each stat must have a clear, documented purpose in the damage/combat formulas.
- HP growth per level: class-specific scaling. Warrior: +8/level, Rogue/Hunter: +6, Priest: +5, Mage: +4. ATK growth: physical classes +3/level, magic classes +2/level. These ratios ensure class identity in stats.
- XP curve: exponential with factor 1.5× per level for consistent relative power gaps. Formula: `XP_for_next_level = baseXP × 1.5^(currentLevel - 1)`. BaseXP typically 100. Level 1→2: 100 XP. Level 5→6: ~506 XP. Level 10→11: ~3,844 XP.
- Level-up: full HP/MP restore on level-up (genre convention). New ability unlocks at milestone levels (5, 10, 15, 20...). Stat gains displayed with delta indicators (+3 ATK, +8 HP).
- Class/skill system: at least 3 distinct classes or build paths (Warrior, Mage, Rogue/Healer or equivalent) with unique ability trees. Job/sub-class system enables mixing (Octopath: primary job fixed, secondary job swappable).
- Skill tree layout: T-shaped model — vertical depth in one domain + horizontal breadth across adjacent domains. Avoid "too-wide" (master of none) or "too-deep" (one-trick pony). Respec must be possible but consequential: location + gold cost, NOT free anytime.

## Damage Formula — Concrete Reference

```
Base Damage = ATK × 50 / (50 + DEF)
```
- This formula ensures damage never reaches zero (approachable asymptotically).
- DEF 0 = 100% damage. DEF 50 = 50% damage. DEF 100 = 33% damage.
- For games with wider stat ranges, use: `ATK² / (ATK + DEF)` which rewards attack stacking more aggressively.

Elemental multiplier set: `{ immune: 0.0, resist: 0.5, neutral: 1.0, weak: 2.0, critical-weak: 3.0 }`.

Final damage pipeline: `BaseDamage × ElementalMultiplier × BreakMultiplier × BuffMultiplier × RandomVariance(0.9-1.1)`.

Critical hit rate: `CRIT% = min(50, (AGI / 4) + (LUK / 8) + equipmentBonus)`. Critical damage multiplier: 1.5× (2.0× with critical-boosting passives).

Evasion: `DODGE% = min(30, (AGI × 2 + Level) / 2.55)`. Check: random(0-255) < DODGE × 2.55.

## Status Effects — Design Rules

- Four categories: Control (Stun, Sleep, Freeze, Silence — restrict actions), Damage-over-Time (Poison, Bleed, Burn — apply per-turn damage), Debuff (Weaken, Slow, Blind — impair stats), Buff (Haste, Regen, Shield, ATK-up — improve stats).
- Tick timing: DoTs tick at START of afflicted's turn (damage hits before they act). Buffs/debuffs tick at END of caster's turn (caster benefits during their action). This single timing distinction dramatically impacts tactical feel.
- Stacking: Poison max 6 stacks, Bleed max 3 stacks, Burn/Chill = no stacking (refresh duration only). DoT potency snapshotted at application time — later stat changes do not retroactively alter existing effects.
- Boss resistance: non-boss ailments at 100% hit rate. Boss CC at 0% hit rate (immune) — use debuffs instead. Boss DoT at 50% hit rate with diminishing returns (each successive application has -10% chance, resetting after 1 turn of no application).
- Immunity anti-spam: if a status fails twice consecutively, target becomes immune to that status for 1 turn — forces rotation, prevents stun-lock strategies.

## Enemy Design

- Enemy archetypes: at least 6 with distinct combat roles — Melee (aggressive, closes distance), Ranged (keeps distance, targets back row), Caster (elemental damage, buffs/debuffs), Healer (heals lowest-HP ally), Tank (taunts/protects, high DEF), Assassin (fast, targets lowest-HP party member).
- Enemy AI tiers: trash mobs use simple patterns (attack random target, use 1 skill). Elite enemies use conditional logic (prioritize healer, exploit elemental weakness). Bosses use multi-phase scripts with phase-transition triggers at HP thresholds (75%, 50%, 25%).
- Boss design: at least 1 per major dungeon/zone. 3-5 phases with phase-change visual (screen flash, color shift, boss sprite change) + audio cue. Each phase adds or changes a mechanic. Final phase: boss appears desperate (faster, more aggressive, but telegraphed).
- Telegraphing: strong enemy attacks have wind-up text/icon indicator + charge animation (300-800ms). "ENEMY is preparing a powerful attack..." appears in battle log. Player can respond (guard, buff defense, break enemy to cancel).
- Enemy variety: recolors acceptable for tiered variants (Kobold → Kobold Warrior → Kobold Chief) but at least 15+ unique sprite bases across the game. 3+ distinct enemy families per zone.

## Equipment & Inventory

- Equipment slots: weapon, armor/body, accessory (×2), plus optional head, hands, feet slots. Equipment visible on character sprite (at minimum: weapon).
- Rarity tiers: Common (white, 50% of drops), Uncommon (green, 30%), Rare (blue, 15%), Epic (purple, 4%), Legendary (orange, 1%). Rarity multiplies base stats: Uncommon ×1.2, Rare ×1.5, Epic ×2.0, Legendary ×3.0.
- Equipment scaling by level: `Attack bonus = (1 + itemLevel / 2) × rarityFactor`. `Defense bonus = (1 + itemLevel / 3) × rarityFactor`. Item level roughly matches zone level (zone 1: ilvl 1-5, zone 2: ilvl 5-10, etc.).
- Inventory: categorized (weapons, armor, accessories, consumables, key items, materials). Sort by: type, level, rarity, recently obtained. Compare on hover (equipped vs. hovered item with green/red stat deltas).
- Shop economy: buy/sell with price ratio 2:1 (sell at 50% of buy price). Major equipment upgrades every 3-5 levels. Consumable restock at every town.
- Gold economy: income from battles (per-enemy gold drop) + quest rewards + treasure chests + sellable loot. Major purchases (next-tier equipment) should require saving through 2-3 dungeons' worth of gold — enough to feel earned, not enough to require grinding.
- Crafting: optional but valued. Use monster materials + gathering-node materials. Crafted items should be competitive with found/dropped items of the same tier, not strictly better or worse. Allow upgrading equipment through crafting (e.g., Longsword + Fire Essence → Flame Sword).

## World & Exploration

- World map: at least 4 distinct zones/biomes (e.g., Grasslands, Forest, Desert, Snow Peaks, Volcanic, Underworld) with unique tilesets, enemy rosters, BGM, and color palettes.
- Towns: at least 3 with shops (weapon, armor, item, accessory — can be separate or combined), inn (full HP/MP restore, low gold cost), NPCs with dialogue (at least 5 unique NPCs per town), and quest-givers.
- Dungeons: at least 3 with unique visual themes (Cave, Temple, Tower, Ruins, Fortress), layout puzzles (switch gates, push blocks, teleporters), and bosses. Multi-floor/multi-room with mini-map or clear navigation cues.
- Secrets: hidden passages (crack in wall, different colored tile), breakable walls, chests behind puzzles. At least 1 secret per dungeon, 2-3 per zone world map. Reward tier matched to discovery difficulty.
- Fast travel: unlockable between visited towns/safe points. Earned around 30% through the game (not from start — player must learn the world first). Cost: free or negligible. Reduces backtracking friction without removing exploration incentive.
- Save points: clearly marked (glowing crystal, shrine, campfire). Spacing: 5-15 minutes of gameplay. Also: quick-save on quit (temp suspend, deleted on load). Boss fights: save point before boss room.

## Quest & Narrative

- Main quest: clear through-line with rising stakes. At least 4 major acts: Introduction → Rising Conflict → Crisis/Reversal → Climax/Resolution. Each act: 3-5 hours of gameplay.
- Side quests: at least 15 with varied objectives across categories: fetch/delivery (30%), defeat/target (30%), investigate/explore (15%), escort/defend (10%), puzzle/challenge (15%). At least 5 side quests with narrative depth beyond "kill X of Y" — these should have character arcs, dialogue choices, and meaningful rewards.
- Quest state machine: Unknown → Discovered (NPC has marker) → Active (accepted, objective tracked) → Completed/Failed. Quest log: active quests tab, completed quests tab, objectives per quest with location hints.
- Choice and consequence: meaningful choices should affect: immediate rewards (gold/item), faction reputation (numeric, gates shop prices and quest availability), NPC availability (character lives/dies, moves location), and epilogue slides. Layer consequences: shallow (reward only) → medium (reputation) → deep (world state change).
- Dialogue system: portrait + name tag + text box. Branching dialogue where appropriate with at least 2 meaningful options. NPC dialogue changes based on quest state (pre-quest → during quest → post-quest). Relationship/affinity gated dialogue options.
- Dialogue condition system: `QuestFlag(questId, NotStarted|InProgress|Completed)` + `PlayerLevel >= X` + `Reputation(faction) >= threshold` + `hasItem(itemId)` + `affinity(npcId) >= threshold`. Keep dialogue data externalized in JSON/script files, not hardcoded.

## HUD & UI

- Exploration HUD: mini-map (corner, ~15% of screen), party HP/MP bars (top-left or bottom), current objective text (top or quest tracker side panel), gold (top-right), minimap toggle for full map overlay.
- Combat HUD: full party status (HP bar, MP bar, status effect icons), enemy HP bars (on-select or always visible for damaged enemies), action menu (Attack, Skills, Items, Defend, Escape/flee), turn-order timeline.
- Menu UI: full-screen overlay with tabs (Equipment, Items, Skills, Status, Quest Log, Settings, Save/Load). Equipment compare: side-by-side stat view with green (+X) / red (-X) deltas.
- Text fit: dialogue text, item descriptions, ability descriptions must fit their containers at all supported resolutions. Test at 1280×720 (minimum desktop) and 375×667 (mobile).
- Status effect icons: small, distinct, with hover tooltip showing effect name + remaining turns. Universal icon language: ↓ for debuffs, ↑ for buffs, ⏱ for DoTs, ⊘ for CC.

## Mobile

- Exploration: virtual d-pad (bottom-left, ~30% of screen) or tap-to-move (tap destination, character paths there). Action button (bottom-right) for interact/confirm.
- Combat: tap enemy to target, tap ability to use, swipe to dodge/block (if action RPG). Menu buttons along bottom or right edge, thumb-reachable.
- Menu navigation: bottom tab bar (thumb-friendly). Swipe between tabs. All touch targets ≥44×44 logical pixels. Scroll views for long lists (inventory, quest log).
- Portrait-first design: RPG menus, dialogue, and exploration all work in portrait. Landscape optional.
- Auto-save on: scene transition, app minimize/background, every 5 minutes. At least 3 rotating auto-save slots + manual save slots.

## Audio

- Area BGM: distinct per zone/town/dungeon with seamless loop. Transition: 1-2s crossfade between areas. Battle BGM: separate track per zone, transitions smoothly from exploration (no hard cut — short sting/bridge).
- SFX: attack hit (varied by damage type: slash/thrust/blunt/magic), spell cast (element-specific), buff/debuff applied, item used, menu open/close, dialogue advance, door open, chest open, save point activated.
- Level-up: ascending fanfare (2-3 seconds) — satisfying but doesn't halt gameplay. New ability learned: distinct chime.
- Boss: intro sting (boss appears) + BGM shift (higher intensity, distinct from area battle theme) + phase transition audio cue (rising tension, climax at final phase).
- Audio priority: player death sound > boss phase transition > level-up > spell cast > attack hit > menu sounds > ambient. Critical sounds duck all others by 50%.

## Performance

- Object pooling for: enemies (per-type pool, max = peak encounter + 20%), damage numbers, hit particles, item-drop sprites. Zero instantiation during combat after pool init.
- Zone loading: stream or async-load between areas. Loading screen: brief (<2s) with area name + lore tip. Texture atlas per zone: all tileset + enemy + NPC sprites for a zone in a single atlas.
- Render diagnostics at peak: 4 party members + 6 enemies + all VFX + full HUD. Sprite count, draw calls, frame time measured.
- Save data: compact (stats, inventory IDs, quest flags, position). Serialize to JSON. <100KB per save file. No save bloat from tracking per-enemy state — defeated enemies stored as boolean flags per unique ID.

## Playtest

- Full loop: new game → first town → first quest → first combat → level-up → equip item → enter dungeon → solve puzzle → defeat boss → return to town → buy gear → next zone → progress.
- Combat tested with all character classes/builds to ensure viability. No single class should be unable to complete content (support classes balanced with sufficient personal damage for solo segments).
- Economy model validated: gold earned vs. shop prices across full game progression. Player should afford next-tier weapon within 2-3 dungeons of it becoming available.
- All bosses tested with: under-leveled party (-2 levels, hard but winnable), at-level party (standard difficulty), over-leveled party (+3 levels, easier but not trivial). Boss mechanics still function regardless of party level.
- Break/weakness system: every enemy's weakness set tested. All party compositions must have at least 2 ways to hit each weakness type (through skills, items, or sub-class abilities).
