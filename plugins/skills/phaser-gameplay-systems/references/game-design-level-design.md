# Game Design And Level Design

Use this reference before broad new-game creation, major mechanic changes, progression tuning, level/tilemap/wave/card-board design, combat encounters, or any claim that gameplay is premium, polished, complete, or less generic.

This is not a long design document. It is a compact player-facing contract that turns an idea into implementable rules, spaces, pacing, and tuning checks for 2D browser games built with Phaser 4 + TypeScript + Vite.

Research basis: Unity's GDD guidance emphasizes player goals, rules/mechanics, difficulty, core loop, and feedback; MDA separates mechanics, runtime dynamics, and player experience; Unity's level-design material emphasizes concept, blockout/greybox, playtest, and iteration; Steve Swink's game-feel framing centers real-time control, simulated space, and polish.

## Design Brief Gate

Before implementation, write a brief with:

- Player promise: the fantasy in one sentence.
- Target feeling: tense, fast, tactical, elegant, chaotic, precise, cozy, etc.
- Primary verb: jump, aim, shoot, place, dodge, slash, draw, solve, march.
- Secondary verbs: dash, upgrade, collect, block, parry, switch lane, cast, deploy, rearrange.
- Core loop: what the player repeats every 5-30 seconds.
- Progression loop: what changes across 1-5 minutes.
- Fail/retry loop: how the player loses, learns, and restarts.
- Scoring/economy: what is rewarded, what is spent, what creates risk.
- Skill expression: what a better player does differently.
- Readability promise: how the next decision is communicated.
- Non-goals: features intentionally out of scope for this slice.

Reject "explore a cool scene" as a design brief. A game brief must include player decisions, pressure, feedback, and consequence.

## Core Loop Contract

Write the loop as:

```text
Player does [verb] to achieve [objective] while [pressure] creates risk; success gives [reward/progression], failure causes [cost/retry].
```

Then prove the loop in code:

- The primary verb is mapped to real input (keyboard, gamepad, pointer, touch).
- The objective is visible in the world or HUD.
- Pressure exists within the first playable minute.
- Reward/progression changes game state, not only visuals.
- Failure or setback teaches what happened.
- Restart/retry is fast enough to encourage another attempt.

## MDA Check

Use this as a compact design review:

- Mechanics: exact rules, controls, collisions, timers, spawn tables, physics, scoring.
- Dynamics: what happens when a real player uses those rules under pressure.
- Aesthetics: the intended feeling and whether screenshots/playtest evidence supports it.

If the intended feeling does not emerge from the current mechanics, change mechanics or tilemap/level layout. Do not try to fix missing dynamics with sprite art alone.

## Level And Encounter Plan

Before building a tilemap, side-scroller level, top-down map, wave arena, card board, grid, or puzzle space, define:

- Spatial format: tilemap, side-scroller level, top-down map, wave arena, card board, lane, grid, tower path, puzzle room.
- Camera contract: what the camera can and cannot see, camera bounds, follow behavior, screen transition rules.
- Player start, first decision, first reward, first threat.
- Safe zone or learning space, if the genre needs one.
- Main route plus optional risk/reward route, if applicable.
- Landmarks or orientation anchors (parallax layer cues, distinct tile silhouettes, map icons).
- Escalation: how challenge increases every 20-60 seconds or per wave/turn/phase/room.
- Recovery beats: where the player can breathe or regain control.
- Failure readability: how hazards, attacks, misses, and penalties are telegraphed.
- Reuse plan: which pieces are modular, randomized, or parameterized (tile sets, wave tables, encounter decks).

Greybox first: use simple shapes and placeholder tiles to prove scale, route, timing, line-of-sight, collision, and pacing before investing in sprite art, texture atlases, or parallax detail.

## Genre Patterns

### 2D Platformer / Side-Scroller

- Teach movement and jump with an early safe segment before introducing hazards.
- Alternate compression and release: dense hazard groups, then reward/visibility windows.
- Use at least three obstacle families with distinct silhouettes and telegraphs (spikes, moving platforms, enemies).
- Tune jump arcs, coyote time, jump buffering, and dash windows as named constants; record changes.
- Difficulty can ramp via speed, hazard density, precision gaps, moving-platform timing, and reward placement.

### Top-Down RPG Map

- Define encounter cadence, save points, fast-travel topology, and zone-to-zone transitions.
- Maps should create exploration and routing decisions, not just corridors of filler encounters.
- Teach each system (combat, magic, items) in a low-risk space before testing it under pressure.
- Escalate via enemy mix, resource scarcity, puzzle complexity, and branching objectives, not just stat inflation.

### Tower Defense

- Define path topology, chokepoints, build zones, enemy archetypes, tower roles, economy cadence, and wave tells.
- Good maps create placement decisions, not just optimal obvious tiles.
- Waves should test different tower roles and expose upcoming enemy types before punishment.

### Card Game / Deckbuilder Board

- The board is the rules surface: hand size, lane/row count, draw/discard piles, energy/mana curve, turn structure.
- Teach the core verb (play card) with a trivial card before introducing synergy, removal, and economy cards.
- Balance card draw, cost curve, and random versus deterministic sources so skill beats variance over a run.
- Pacing is turn rhythm: how long a turn takes, how much information is revealed, when stakes escalate.

### Bullet Hell / Shoot-em-up

- Define hitbox size, bullet speed, spawn density, grazing windows, screen-clear options, and bomb/limit breaks.
- Patterns need readable entry lanes and consistent color/coding for safe gaps versus damage zones.
- Use waves or phase changes that force movement across the screen, not only static turret fire.
- Difficulty ramps via pattern complexity, bullet speed, density, and timed survival phases.

### RTS Map

- Define map size, resource node distribution, chokepoints, base locations, sight/aggro ranges, and fog of war.
- Good maps create expansion decisions and contested resources, not just one obvious build order.
- Unit counter systems, production queues, and tech tiers should be testable in the first playable minute.
- Escalate via army composition, multi-front pressure, and economy raids, not only unit count.

### Boss Fight / Wave Arena

- Define boss phases, telegraphs, recovery windows, player punish windows, arena hazards, and camera bounds.
- Every attack needs a readable tell, avoid/defend option, impact feedback, and cooldown.
- Phases should add combinations or arena pressure, not just more health.
- Wave arenas should escalate enemy mix and spawn placement, with breathing beats between waves.

### Narrative / Scene Game

- Define scene-to-scene flow, choice points, fail-forward states, and what the player does between beats.
- Choices must change state (flags, relationships, inventory, route), not only dialogue text.
- Pacing is read speed plus interaction cadence; avoid long unskippable text walls.
- Failure readability: make it clear when a choice closed a route and whether it can be recovered.

### Puzzle / Physics Game

- State the rule being taught in each puzzle.
- First puzzle teaches, second confirms, third twists.
- Failure should reveal information. Avoid hidden dependency chains that require guessing.
- For physics puzzles, define gravity, restitution, friction, and body types as named constants so solutions are reproducible.

## Difficulty And Pacing

Use a curve, not random escalation:

- Introduce one new concept at a time.
- Combine known concepts after they are understood.
- Add breathing space after high-pressure moments.
- Increase challenge through timing, density, speed, resource scarcity, enemy mix, or spatial constraints (tile layout, lane pressure, grid size).
- Keep early failures recoverable unless the genre is intentionally harsh.
- Tune with named constants and record changes.

## Fun-Factor Rejection Tests

Reject or iterate if any are true:

- The first 30 seconds lack a real decision.
- The player can ignore the main mechanic and still progress.
- The objective is unclear without reading source code or instructions.
- Failure happens before the player can understand why.
- Challenge is only "more things" rather than better combinations.
- Rewards do not change strategy, score, progression, or feel.
- The tilemap or board is decorative and does not shape decisions.
- The game is fun only in the designer's explanation, not in active play.

## Report Requirements

Report:

- Game design brief.
- Core loop contract.
- Level/encounter plan (tilemap/side-scroller/top-down/wave/card board/grid).
- Difficulty/pacing plan.
- Tuning constants changed.
- Fun-factor rejection tests passed or remaining failures.
- Evidence from active play, not just a screenshot.
