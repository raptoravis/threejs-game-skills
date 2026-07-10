# Game Design And Level Design Checklist

Use before claiming a new game, major gameplay upgrade, level/encounter pass, premium gameplay, or polished gameplay is complete.

- A game design brief names player promise, target feeling, primary verb, objective, pressure, reward, fail/retry, and non-goals.
- The core loop is written as verb -> objective -> pressure -> reward/progression -> failure/retry.
- The loop is implemented through real input (keyboard, gamepad, pointer, touch), not only described.
- The first playable minute includes at least one objective, one meaningful pressure source, one feedback/reward event, and one setback or fail/retry path when genre-appropriate.
- Player skill expression is explicit: what a better player does differently.
- Difficulty curve is named and tied to parameters, spawn tables, wave composition, turn pacing, speed, resource economy, or spatial constraints (tile layout, lane pressure, grid size).
- Level/tilemap/side-scroller/top-down map/wave arena/card board/grid/turn plan includes start, first decision, first threat, first reward, landmarks, escalation, recovery beats, and failure readability.
- Camera bounds, follow behavior, and screen transition rules are defined for the planned space.
- Greybox/blockout scale, routes, and parallax layout are proven before expensive sprite art or texture atlas detail.
- Obstacles, enemies, rewards, and interactables are placed to create decisions, not random clutter.
- Camera framing supports the next decision in the planned 2D space.
- UI/HUD communicates objective, pressure, reward, or fail state.
- Game-feel tuning covers control response, simulated space, camera, feedback, and restart speed.
- Jump, dash, coyote time, jump buffering, and physics constants (where applicable) are exposed as named tuned constants with recorded changes.
- At least one active playtest loop was used to tune values.
- Fun-factor rejection tests have no unresolved blocker for the requested quality bar.
- Final report includes design brief, core loop contract, level/encounter plan, tuning notes, evidence, and remaining design risks.
