# Card Game Premium Quality Checklist

## CCG/TCG Sub-Type (PvP-Focused)

### Deck & Collection
- Card deck/collection: at least 40 unique cards with distinct art, name, cost, and effect text per set/expansion.
- Card types: at least 3 categories (unit/creature, spell/ability, structure/enchantment/equipment) with distinct frame treatments.
- Deck builder UI: search by name, cost, type, faction, set, owned/unowned, and game-concept search ("draw" finds draw effects, not just card-name matches). Mana curve histogram, card-type pie chart, synergy highlighting. Deck codes for sharing.
- Collection as progression: pack opening, crafting/dusting economy, set completion tracking, seasonal battle pass.

### Resource System & Turn Structure
- Mana/energy/action-point system gates card play with incremental growth per turn or per action. Mana curve is a fundamental mathematical constraint defining deck viability.
- Turn structure: draw, main/play, combat/attack, end. Each phase has clear visual transition, timing, and priority/passing rules.
- Mulligan/starting-hand redraw rule is explicitly designed — it dramatically affects deck consistency, aggro vs. control balance, and player satisfaction. Hearthstone's selective mulligan, MTG's London mulligan, and Runeterra's no-mulligan produce different meta-games.

### Board & Card Play
- Board layout: deck zone, hand zone, play area (at least 2 lanes/rows), graveyard/discard zone, exile/removed zone. Every card zone is a first-class game object with equal API representation — amateur implementations treat battlefield as the "real" zone and hack everything else, which breaks graveyard-interaction cards.
- Card play flow: drag from hand to board, hover-for-detail (desktop), tap-select-then-tap-target (mobile). Valid-target highlighting. Confirmation step on consequential plays (discard, sacrifice).
- Combat resolution: attacker-blocker assignment, damage calculation, death/removal animation sequence. Animations must be interruptible/skippable/parallelizable — waiting for every summon animation before playing the next card creates dead air.
- Turn timer: pauses during non-interactive animations (card flips, attack resolutions). Animations eating into thinking time makes the game feel unfair.

### Keywords & Rules
- At least 5 mechanical effect patterns: direct damage, stat buff/debuff, card draw, summon token, board clear, bounce/removal, counter, heal.
- Status keywords (Taunt, Stealth, Flying, Lifesteal, Rush, Deathrattle) with distinct visual indicators on in-play cards and hover-tooltip explanations.
- Card text templating system: keyword + parameter template language, not hand-written per-card text. Ensures consistency across 200+ cards ("draw 2 cards" vs. "draw two cards").

### Matchmaking & Ranked
- Skill-rating system (Elo/MMR/rank tiers) with seasonal resets, rank floors, and rewards. This is the retention spine for PvP CCGs.
- Spectator mode: observer slots, hand reveal for spectators, tournament mode. Top-tier CCGs are also broadcast products.

### Anti-Cheat & Server Authority
- All game logic runs server-side. Client is a dumb renderer. Client-authoritative game state is a security non-starter.
- Game event log: every action as structured event (PlayCard, AttackTarget, DrawCard, TriggerEffect). Enables: reconnect (replay from log), spectator mode, kill-cam/match review, bug reproduction. Building this retroactively is a nightmare; day-one is trivial.
- Reconnect: if app closes, player rejoins game in progress without losing the match. State recovery through event log replay.

### Economy & Localization
- Shard/crafting economy math modeled: dust-to-card ratio, pack drop rates, duplicate protection, pity timer. Free-to-play earning X gold/day should complete a set in Y days. Simulate before launch.
- Localization data pipeline: card text in all target languages, externalized from day one. Gendered nouns, varying sentence lengths, keyword consistency across languages. Hardcoded English strings discovered at launch = disaster.

## Roguelike Deck-Builder Sub-Type (PvE-Focused)

### Draft & Run Structure
- Draft-as-you-go: pick 1 of 3 cards after each combat. Every choice compounds; card evaluation is contextual (what does my current deck need?), not absolute.
- Procedural encounter map: nodes (combat, elite, shop, rest, event, boss) with visible branching. Players plan routes, weighing risk/reward.
- Relic/artifact system: permanent run-long passive modifiers that change game rules, not just numbers. Combinatorial depth — relics interact with cards to create emergent synergies.
- Intent-telegraphed enemy AI: enemies show what they will do next turn (attack for X, block, buff, debuff). Transforms combat from reactive guessing into deterministic puzzle. All premium roguelike deck-builders do this.

### Meta-Progression
- Run-based unlocks: new cards, relics, characters, difficulty modifiers earned between runs. Unlocks expand possibility space, not just grind numbers.
- Ascension/Corruption-style difficulty tiers: change rules (enemy patterns, curse cards, reduced potion slots), not just HP values. Stat-only difficulty scaling is an amateur mistake.
- Run seed system: seeded runs for sharing/racing with seed entry UI. Replay a friend's seed.
- Statistics/run history: full run log (cards drafted, relics obtained, damage per floor, final decklist). Post-run satisfaction layer.

### Balance & Transparency
- Card/relic interaction transparency: show what WILL happen (preview mode, damage preview numbers). Slay the Spire's reliability comes from deterministic, visible outcomes.
- Deck thinning mechanics (exhaust, remove, transform): strategically critical because lean decks cycle good cards faster.
- Undo: at least one undo per combat in roguelike deck-builders. Deterministic information before RNG draws should be reversible.

## Universal (Both Sub-Types)

### HUD
- Persistent: hand (cost glow/color), resource tracker, deck/discard counters, opponent hand size, turn timer, end-turn button (largest + most-clicked element, unmistakable, misclick-confirmation).
- Roguelike additional: current floor, map button, relic list, potion/consumable slots, deck/discard/exhaust counts, run timer.
- Hand/deck tracker: player can see remaining deck contents, played cards, discard/exhaust pile. Hiding this is UX failure, not strategic depth.

### Audio
- Card-specific sounds: play, attack, death, trigger. Premium games have unique audio per legendary/rare card.
- Board ambience: mood-setting without distraction.
- UI audio: turn start, rope/timer ticking, card hover, deck shuffle. Audio feedback confirms state changes player might miss visually.

### Mobile
- Card readability at phone scale: minimum font sizes validated on actual devices. More icons, fewer text lines for keyword communication.
- Hand management on small screens: scrollable row or partial-reveal system. Tap-select-then-tap-target is more robust than drag-to-play on mobile.
- Board targets with generous hit areas. Confirmation step on consequential plays (discard, sacrifice).
- Portrait vs. landscape: horizontal board (cards face each other) works in portrait; vertical board (your side / their side) needs landscape. Orientation is locked by board design.
- Network tolerance: handle 2-5 second disconnects gracefully. Animations must not require continuous server sync.

### Performance
- Animation budget: every animation has a maximum duration. Interruptible, skippable, or parallelizable.
- Memory: card asset loading/unloading as collection size grows. Deck builder must handle 500+ owned cards without lag.
- Battery saver mode: static backgrounds, reduced effects for always-on 3D board elements.

### Playtest
- Game loop (CCG): draw → resource → play → combat → opponent turn → card interaction → win/loss.
- Game loop (Roguelike): draft → route plan → combat → reward → shop/rest → boss → run complete.
- Balance: all deck archetypes viable at competitive level; no single dominant deck above 55% win rate.
- Economy simulation validated: F2P set-completion timeline within stated design target.
