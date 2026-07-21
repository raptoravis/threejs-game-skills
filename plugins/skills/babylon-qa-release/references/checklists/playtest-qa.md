# Playtest QA Checklist

Check every playable path a player will encounter.

## Core Loop

- [ ] Start or resume works from title/menu.
- [ ] Primary input (move/aim/steer) responds within 1 frame.
- [ ] Secondary input (jump/attack/boost/interact) triggers reliably.
- [ ] Objective (collect, reach, defeat, survive) progresses visibly.
- [ ] Scoring/UI updates correctly on each event.

## State Transitions

- [ ] Pause freezes gameplay, hides gameplay HUD, shows pause menu.
- [ ] Resume restores gameplay without state corruption.
- [ ] Fail condition triggers fail state (death, timeout, missed objective).
- [ ] Retry/restart from fail state resets cleanly.
- [ ] Win condition triggers win/complete state.
- [ ] Level/wave/checkpoint transitions work.

## Physics (Havok/Cannon.js)

- [ ] Bodies reset on restart (no stale bodies).
- [ ] Collision responses feel correct (no penetration, no jitter).
- [ ] Sensors/triggers fire correctly.
- [ ] No bodies fall through floor at spawn.
- [ ] High-speed objects do not tunnel through thin colliders.

## Audio

- [ ] Audio unlocks on first user gesture.
- [ ] Main SFX triggers (jump, collect, hit, explode).
- [ ] Ambience/music starts, loops, stops on pause, resumes cleanly.
- [ ] Mute/volume controls affect all groups.
- [ ] No duplicate sources on pause/resume cycle.

## Input Edge Cases

- [ ] Rapid input spamming does not break state.
- [ ] Simultaneous inputs (move + jump + action) handled correctly.
- [ ] Input release during state transition does not leave stuck controls.
- [ ] Tab away and back does not break input or audio.

## Common Failures

- [ ] Score resets on restart but high score persists.
- [ ] Camera clips into geometry on tight turns/corners.
- [ ] Enemies spawn inside player on restart.
- [ ] Collectible counter does not match actual collected count.
- [ ] Win condition triggers but game continues.
