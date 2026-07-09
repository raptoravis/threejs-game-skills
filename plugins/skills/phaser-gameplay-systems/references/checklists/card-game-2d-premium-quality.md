# 2D Card Game Premium Quality Checklist

Based on Slay the Spire, Hearthstone, Magic: The Gathering, Marvel Snap, Balatro, Monster Train, and the broader CCG/roguelike-deckbuilder genre. Card games are inherently 2D — this checklist covers both PvP CCG and PvE Roguelike Deck-Builder sub-types.

## CCG/TCG Sub-Type (PvP-Focused)

### Deck & Collection
- Card deck: at least 40 unique cards with distinct art, name, cost, and effect text per set/expansion. Minimum deck size: 20-30 cards. Maximum: 30-60 (tunable per game's draw consistency math).
- Card types: at least 3 categories (unit/creature, spell/ability, structure/enchantment/equipment) with distinct frame art, border treatment, and play animation.
- Deck builder UI: search by name, cost, type, faction, set, owned/unowned, AND game-concept search ("draw" finds draw effects, not just card-name matches). Mana curve histogram, card-type pie chart, synergy highlighting. Deck codes (short alphanumeric strings) for sharing.
- Collection progression: pack opening (5 cards per pack, at least 1 rare+ guaranteed), crafting/dusting economy (commons: 5 dust, rares: 20, epics: 100, legendaries: 400 — tune to your economy), set completion tracking, seasonal rewards.

### Resource System & Turn Structure
- Mana/energy/action-point system: base resource gains 1 per turn (capped at 10 in Hearthstone-style) or fixed-per-turn with ramping cards (MTG-style lands). Mana curve is the fundamental mathematical constraint defining deck viability.
- Card cost distribution (from Slay the Spire analysis): 0-cost ~10-15% of pool, 1-cost ~40-50%, 2-cost ~25-30%, 3-cost ~10-15%, X-cost ~5%. This distribution ensures playable hands at all mana levels.
- Rarity distribution: Common 60%, Uncommon 37%, Rare 3% (with pity system: +1% Rare probability per Common pull, resetting on Rare pull). Guaranteed Rare within 40 packs maximum.
- Turn structure: draw phase → main/play phase → combat/attack phase → end phase. Each phase has clear visual transition, distinct UI state, and defined timing windows.
- Mulligan/starting-hand redraw: choose which cards to replace (Hearthstone), full-hand mulligan (MTG London: draw 7, put N on bottom, draw N), or no mulligan (Runeterra — compensated by spell-mana banking). Decision must be explicit and documented — it dramatically affects deck consistency and aggro-vs-control balance.

### Board & Card Play
- Board layout: deck zone (bottom-right), hand zone (bottom-center, fanning upward), play area (center, at least 2 rows: front-line/back-line or ground/air), graveyard/discard zone, exile/removed zone. **Every card zone must be a first-class game object with equal API representation.** Amateur implementations treat battlefield as the "real" zone and hack everything else — this breaks graveyard-interaction cards.
- Card play flow: drag from hand to board (desktop) or tap-select-then-tap-target (mobile). Hover = card detail popup (full art, full rules text, keyword explanations). Valid targets highlighted green; invalid targets greyed out. Confirmation step on consequential plays (discard, sacrifice, destroy own permanent).
- Combat resolution: attacker declared → blocker assigned → damage calculated simultaneously → death/removal animation sequence. Animations must be interruptible/skippable/parallelizable. Waiting for every summon animation before playing the next card is an amateur mistake that kills pacing.
- Turn timer: pauses during non-interactive animations (card reveals, attack resolutions, random effect outcomes). Animations eating into thinking time makes the game feel unfair. Standard timer: 75s per turn with 20s "rope" countdown.

### Keywords & Rules Engine
- Card text templating system: keyword + parameter template language, NOT hand-written per-card strings. `{DrawCard:2}` not `"draw 2 cards"`. Ensures rules consistency, localization pipeline, and card generation systems all share one source of truth.
- At least 5 mechanical keyword families: damage (DealDamage, AoEDamage), stat modification (BuffAttack, DebuffHealth, SetStats), card advantage (DrawCards, Discover, Tutor), board interaction (Summon, Destroy, Bounce, Transform), resource (GainMana, ReduceCost, Refresh).
- Status keywords (Taunt/Guard, Stealth, Lifesteal, Rush/Charge, Deathrattle) with distinct visual indicators on in-play cards. Hover tooltip explains each keyword.
- Priority/timing system explicitly designed. When two effects trigger simultaneously, resolution order is deterministic (active player first, then by play order) — never random.

### Matchmaking & Ranked
- Skill-rating system: Elo/MMR or rank tiers (Bronze → Silver → Gold → Platinum → Diamond → Legend) with seasonal resets, rank floors, and tiered rewards.
- Spectator mode: observer slots, hand reveal toggle for spectators, tournament mode with delay (2-5 minutes).
- Anti-cheat: ALL game logic runs server-side. Client is a dumb renderer. Client-authoritative game state is a security non-starter. Game event log records every action as structured event (PlayCard, AttackTarget, DrawCard, TriggerEffect) — enables reconnect (replay from log), spectator mode, match review, and bug reproduction.

### Economy & Localization
- F2P economy math modeled: daily quest gold + win gold + season rewards. F2P player should earn enough to complete ~70% of a set by expansion end without paying. Simulate in spreadsheet before launch.
- Crafting economy: dust-to-card ratios, pack drop rate simulation with pity timer. Premium/golden cards disenchant for bonus dust.
- Localization: card text externalized from day one. Gendered nouns, varying sentence lengths, and keyword consistency across all target languages. A card templating system (`{DrawCard:2}`) makes localization a data problem, not a per-card string problem.

---

## Roguelike Deck-Builder Sub-Type (PvE-Focused)

Based primarily on Slay the Spire's design (MegaCrit), with lessons from Monster Train, Wildfrost, and Balatro.

### The Enemy Intent System — Slay the Spire's Core Innovation

MegaCrit's intent system went through four iterations:
1. Random enemy actions → felt punitive (players guessed block vs. attack)
2. Text description bar → worked but unusable with multiple enemies (must click each)
3. Icon/symbol brackets → caused MORE analysis paralysis
4. **Precise numbers** → The winning design. Showing exact damage values removed an "artificial memory barrier" and opened richer design space (cards like Spot Weakness that check intent). Lesson: **information transparency is always better than hidden information that doesn't test skill.**

Required intent types:
- **Attack**: Shows exact damage number, target indicator. Must be prominent — this is the most critical piece of UI in the game.
- **Defend**: Enemy gains block (shows block amount). Player can ignore defense and go aggressive.
- **Buff/Debuff**: Applied to self or player. Shows effect icon + description on hover.
- **Unknown**: Hidden (reserved for elites/bosses, used sparingly). Not knowing what a boss will do must be a deliberate tension builder, not the default state.

### Draft & Run Structure
- Draft-as-you-go: pick 1 of 3 cards after each combat. Every choice compounds — card evaluation is contextual (what does my current deck need?), not absolute (is this card good in a vacuum?). Three choices ensures decision tension without analysis paralysis.
- Procedural encounter map: nodes connected by branching paths. Node types: Combat (basic enemy), Elite (harder enemy, better rewards), Shop (spend gold, buy/remove cards), Rest (heal HP or upgrade card), Event (narrative encounter with variable outcomes), Boss (end-of-act gatekeeper). Players plan routes weighing risk/reward.
- Shop economy: gold earned from combats + events. Shop offers: 3-5 random cards, 1-2 relics, card removal service (cost increases per use). Card removal is strategically critical — thinning bad cards is as important as adding good ones.
- Relic/artifact system: permanent run-long passive modifiers that change game rules, not just numbers. **Design principle: "Relics should change your decisions, not just add numbers."** Good relic: "Whenever you play 3 attacks in a turn, gain 1 energy." Bad relic: "+1 strength." Relics create emergent synergies — combinations produce effects the designer didn't explicitly plan.
- Relic rarity: Starter (defines character identity), Common (generic bonuses from elites/shops), Uncommon (build-defining), Rare/Boss (game-changers, earned by defeating act bosses).

### Meta-Progression
- Run-based unlocks: new cards, relics, characters, and difficulty modifiers earned between runs. Unlocks expand possibility space, not grind numbers. "Congrats, you unlocked a new character with a completely different mechanic" beats "Congrats, you got +5% starting health."
- Ascension/Corruption-style difficulty tiers (20 levels in Slay the Spire): each tier adds one permanent rule change, not just HP inflation. Examples: enemies deal more damage, fewer potion slots, elites appear more frequently, boss has new pattern, cursed card in starting deck, healing reduced. Tier 20 = full combination of all penalties.
- Run seed system: seeded runs for sharing/racing with seed entry UI. Replay a friend's seed to compare strategies on the same RNG sequence.

### Balance & Transparency
- Card/relic interaction preview: show what WILL happen before committing. Damage preview numbers when hovering attack cards. "This will deal 15 damage (3 from strength, 2 from vulnerable)."
- Enemy intent MUST be visible before player commits to their turn. The core tactical loop is: see intents → plan turn → execute. Without visible intents, you're guessing.
- Deck thinning (card removal, exhaust, transform): strategically critical because lean decks cycle good cards faster. 30-card bloated deck with 3 great cards is worse than a 12-card deck where you draw one every turn.
- Undo: at least one undo per combat for non-RNG actions. If no new information was revealed (no card drawn, no random effect triggered), actions should be reversible. RNG actions (draw a card, deal random damage) are not undoable — this is fair because the outcome is now known.

### Balatro-Style Scoring Innovations
- Hands as scoring engines: poker hands (pair, straight, flush, etc.) providing base chips × multiplier. Jokers modify the formula multiplicatively.
- Planet cards level up specific hand types (e.g., "Level up Flush: +40 chips, +3 mult"). Creates specialization decisions.
- Tarot/spectral cards modify deck composition (add/remove/transform cards). Deck manipulation is as important as the scoring engine.
- Ante/blind system with exponentially scaling score targets. Ante n requires ~2^(n+2) points. Forces constant engine improvement.
- Shop between rounds: buy jokers, planet cards, tarot cards, and card packs. Two free slots; more cost money. Money is scarce — every purchase is a strategic choice.

---

## Universal (Both Sub-Types)

### HUD & UI
- In-game HUD: player HP (prominent, left side), enemy/opponent HP (per enemy, right/top), mana/energy (bottom, prominent), deck count (remaining draws), discard count, graveyard/exile count. End-turn button: large, bottom-right, color-coded (green = ready, red = actions remaining).
- Card detail popup on hover/tap: full art, full rules text with keyword tooltips, mana cost, attack/health for minions.
- Turn-phase indicator: clear label showing current phase progression. "YOUR TURN" / "ENEMY TURN" banner prominently displayed.
- Game log: scrollable text log of all actions with icons. Filterable by turn. Essential for understanding "what just happened" in complex interactions.

### Mobile
- Hand at bottom of screen, thumb-reachable. Cards fan upward with 30-40% overlap. Tap to select, drag upward to play (or tap target after selection).
- Card detail: tap card to zoom to full-screen detail view. Swipe down or tap X to dismiss.
- Board zoom: pinch to zoom for detailed board state; double-tap to reset. Particularly important for complex board states in CCGs.
- End-turn button: bottom-right, 44×44pt minimum, color-coded, haptic feedback on press.
- Portrait orientation preferred for one-handed play. Card games are the most natural portrait-mode game genre.
- Deck/hand size counter visible without scrolling.

### Audio
- Card play sound varies by card type: creature summon (thump + creature sound), spell cast (magical whoosh + element SFX), equipment equip (metallic clank).
- Turn-phase transition sounds: distinct chimes for draw, main, combat, end phases.
- Victory/defeat fanfare: satisfying resolution; brief enough to not delay next game.
- Background music: calm during planning phase, intensifies during combat resolution. Adaptive based on player HP (lower HP = tenser music).
- UI sounds: card hover (subtle whoosh), card select (click), button press (tap), mana spend (rising chime), card drawn (swish), damage dealt (impact + number tick-up).

### Performance
- Card rendering: use sprite pooling for card objects. All card art pre-loaded during loading screen. No texture loading during gameplay.
- Animations: use tweens, not physics. Card movement, flip, and scale animations are the performance bottleneck at high play speeds.
- Deck/hand state managed in plain data structures, rendered to sprites each frame from the canonical state. State is the source of truth; sprites are derived.
- Slay the Spire specific: card reward screen, combat, and map are separate "scenes." Scene transitions must be instant (<100ms) to avoid friction during repeated runs.

### Playtest
- CCG loop: build deck → find match → mulligan → play full game → win/lose → earn rewards → repeat.
- Roguelike loop: start run → draft cards → 8-15 combats → 2-3 bosses → win/lose → unlock → repeat.
- All keywords tested in pairwise combination. Card × card × relic interactions are where bugs live — combinatorics demand automated testing or exhaustive manual scripting.
- AI/opponent logic tested with diverse deck archetypes (aggro, control, combo, midrange).
- Economy model simulated: average packs to complete a set, dust/gold per day F2P, time to competitive deck.
- Draft balance: no single card should be auto-pick >80% of the time. Card win-rate data tracked per Ascension/difficulty tier.
