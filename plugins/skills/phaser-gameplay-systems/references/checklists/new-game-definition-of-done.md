# New Game Definition of Done (Phaser 2D)

Use this checklist before claiming a new Phaser game or first playable slice is complete.

## Minimum Done Criteria

- `npm install` completes without errors.
- `npm run dev` starts a dev server and the browser shows the game canvas.
- The first visible screen is a game scene, not a blank page, loading spinner, or error.
- Player can interact within 5 seconds of page load.
- Core objective is clear (collect, survive, destroy, reach, defend).
- Input changes drive visible state changes (player moves, score increments).
- A fail/retry path exists (player can lose and restart without refreshing).
- `npm run build` passes with no TypeScript or Vite errors.
- Browser console has zero uncaught exceptions during normal play.
- Phaser scene transitions are smooth with no flicker or dead frames.
- Canvas screenshot contains non-blank pixels (verified via inspect-phaser-canvas.mjs).
- Desktop viewport renders correctly.
- Mobile viewport renders correctly (FIT mode, touch input).
- No debug rendering or test UI is visible by default (physics debug off, GUI hidden).

## First Playable Slice Evidence

- [ ] Build output: clean
- [ ] Browser: game loads and runs
- [ ] Console: no uncaught errors
- [ ] Canvas: nonblank screenshot captured
- [ ] Desktop screenshot
- [ ] Mobile screenshot
- [ ] Input path: player can control the game
- [ ] Objective: progress can be made
- [ ] Fail/retry: restart works

## Architecture Checklist

- [ ] Scene boundaries defined (Boot, Game, UI at minimum)
- [ ] Input controller separates raw input from game intents
- [ ] Entities own their physics bodies and visual representation
- [ ] Physics system centralized in one module
- [ ] HUD is separate from game scene (overlay scene or DOM)
- [ ] Delta-based movement used throughout (no frame-based values)
- [ ] Diagnostics exposed via `window.__PHASER_GAME_DIAGNOSTICS__`
- [ ] Dispose/cleanup path exists for scene shutdown
