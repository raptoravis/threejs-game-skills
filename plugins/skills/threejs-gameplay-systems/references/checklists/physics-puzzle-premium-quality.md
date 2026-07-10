# Physics Puzzle Premium Quality Checklist

## Physics Foundation
- Physics engine choice is explicit with rationale: Rapier for robust rigid-body simulation, cannon-es for lightweight JS fallback.
- Fixed timestep accumulator (max 5 steps/frame) for deterministic simulation across frame rates. Variable timestep produces different trajectories at 30fps vs. 144fps — destructive for puzzle genre.
- Determinism decision is documented: strict determinism (fixed step + integer/fixed-point math + cross-platform verification) OR accepted mild non-determinism with tolerance design (platform 2x wider than theory requires, jump tolerance = design value + 4%).

## Core Puzzle Verb
- Game is built around 1-3 physics-based "verbs" (place portals, build bridges, drag-connect objects, aim-launch, grab-manipulate). Simple to understand, complex in emergence. "Has physics objects" is not a puzzle; designed constraints make puzzles.
- Puzzle object types: at least 5 distinct interactive types with consistent physical properties (mass, friction, restitution, collision shape) producing predictable behavior.
- Interaction model is clear: grab/drag, push, launch (aim + power meter), activate (button/lever), or place with readable intent. Direct manipulation preferred — finger/mouse-on-object creates tactile satisfaction unsurpassed by indirect controls.
- Snap-assist and angle tolerance: connection points auto-snap, placement angles are forgiving. Zero "pixel hunting" — precise alignment is never the puzzle.

## Puzzle Design Workflow
- Puzzle skeleton before decoration: create state table (all variable elements + per-step states), build architectural shell (ignore puzzle logic), then implement state table into environment. Valve's proven workflow.
- Introduction → Isolation → Combination → Mastery spiral (Portal 2's Ki-Sho-Ten-Ketsu): safe room introduces mechanic → 2-3 isolated challenges test only that mechanic → combine with prior mechanics + unexpected twist → comprehensive test. Each new mechanic gets this full cycle before combination.
- Mechanism budget: final boss puzzle uses N mechanics simultaneously → total mechanics introduced should be ≤ N+2. Introducing one-off mechanics that never return prevents mastery satisfaction.
- Every puzzle has a teaching purpose — no filler puzzles. Each room either teaches a new trick or combines previously learned ones.
- At least 2 intended solutions per puzzle + system naturally supports unintended solutions (not punished unless they skip the core learning objective).

## Puzzle Testing
- Three-class solution testing per puzzle: (1) intended solution works (basic verification), (2) alternative intended solutions work (design verification), (3) 10+ wrong-solution attempts tested — do they produce confusing behavior or soft-locks? (destruction verification). Class 3 is absent from 99% of indie checklists.
- At least 5-8 unique playtesters per puzzle. Designer is blind to their own puzzle difficulty — can never accurately assess where players get stuck.
- Partial-success feedback: when player's approach is "almost right but one beam mispositioned," communicate which part needs adjustment. Don't just collapse the whole bridge — show stress concentration, load distribution visualization.

## Reset & Undo
- Reset speed: <1 second, no animation penalty, no loading screen. Every friction added to reset reduces experimentation attempts.
- Undo stack, not single-step undo: World of Goo's "undo fireflies" model — player can precisely select which step to revert to. Single-step undo (Ctrl+Z style) is grossly inefficient for construction puzzles.
- Full level reset preserves tutorial/teaching state so player iterates without punishment.
- Physics state resets cleanly: no leftover bodies, joints, forces, or event listeners. Dispose-and-rebuild or explicit state snapshot restore.

## Constraints & Feedback
- Constraint system is the design backbone: budget limits (materials/points/time), geometric constraints (anchor points, buildable zones, obstacles), rule constraints (certain surfaces non-portalable, certain objects non-movable).
- Physics body count, joint count, and CCD usage tracked per level; no unbounded body creation.
- Stress/load visualization: green → yellow → red coloring for structural elements under increasing load. Audio feedback for approaching failure (progressive groaning, pitch rise).
- State-change audio: connection snap, break/collapse, activation success. All feedback audio must be informational, not decorative.

## Camera & Controls
- 2D puzzles: fixed or pan-scroll camera — stable, predictable, never competes with puzzle for attention.
- 3D puzzles: first-person or tight-follow third-person — depth perception needed for spatial reasoning. Camera never auto-moves during puzzle solving (disrupts mental model under construction).
- Direct manipulation (finger drag, mouse grab) provides higher physics fidelity and tactile satisfaction. Compensate precision loss with snap-assist and generous tolerance, not by switching to indirect controls.

## HUD
- Extreme restraint: only current puzzle objective + available resources. Everything else removed or in pause menu.
- Level indicator, move/shot counter, star/par rating, reset/undo button, objective hint. No decorative panels.

## Mobile
- Direct touch manipulation of physics objects is the genre's natural best input — World of Goo touch version rated superior to PC mouse. Multi-finger simultaneous object manipulation impossible on PC.
- Fingertip occlusion fix: "lifted preview" — semi-transparent ghost of object/connection point offset above finger while held.
- Large construction puzzles need: pinch-zoom gesture + dedicated edit mode for small-screen precision.
- Accidental-touch prevention: undo/reset buttons placed outside non-dominant-thumb activity zone (top-left corner).
- Physics compute budget: limit simultaneous active bodies for mobile; simplified physics precision mode for low-end devices.

## Performance
- Bodies, colliders, joints, and event listeners disposed on level reset and scene restart. Verify zero leaks after 50 reset cycles.
- Renderer diagnostics checked with maximum puzzle objects active and physics stepping.
- Performance curve documented: max active rigid bodies, max constraint connections, max collision pairs before degradation.

## Playtest
- Game loop tested through: mechanic introduction → puzzle solve → failure/reset → multi-step chain → alternative solution discovery → star/par achievement → level transition.
- Solution robustness verified: all intended and alternative solutions tested; 10+ wrong-attempt paths checked for soft-locks or confusing behavior.

## Accessibility
- Stress/load state and puzzle activation conveyed by more than color alone — pair green-yellow-red load coloring with outline thickness, icon, or hatching so colorblind players read structural risk.
- Objective hints and ghost-placement previews legible; contrast meets AA on HUD text, range rings, and snap guides in 3D puzzle lighting.
- Reduced-motion option for collapse, stress, and break animations where motion carries the failure or near-failure signal.
- Snap/break/activation cues paired as audio + visual, not audio alone, so muted players still parse puzzle feedback.

## Audio
- SFX for the primary puzzle verbs: object grab, place, connection snap, break/collapse, and activation success — each a distinct, informational cue.
- Stress/load audio rises progressively before structural failure (groaning timbre, pitch climb) so approaching collapse is hearable.
- Ambient loop clean and non-distracting over long solve sessions; mute/volume controls work and persist.
- Reset, undo, and level-transition audio state cleans up — no dangling collision, creak, or ambient stems across scenes.
