# Bot Playtest Checklist

Use this when running automated bot playtests for release-ready gameplay claims.

## When To Run

- Release-ready gameplay claims.
- Difficulty/fairness verification.
- The playable loop has never been driven by scripted input.
- Scoring, progression, or fail-state logic needs systematic validation.

## Bot Setup

- [ ] Bot uses the same input interface as human players (no internal state shortcuts).
- [ ] Random seed is recorded for reproducibility.
- [ ] Bot runs for a meaningful duration (≥ 30s of active play, or across ≥ 5 distinct gameplay states).
- [ ] Bot avoids softlocks: if stuck > N seconds, the run terminates and reports the softlock window.

## Metrics To Capture

```json
{
  "seed": 0,
  "durationFrames": 0,
  "score": 0,
  "distance": 0,
  "softlockWindows": [],
  "statesVisited": [],
  "fails": 0,
  "restarts": 0
}
```

## Verification

- [ ] Bot completes at least one full loop (start → play → fail/win → restart).
- [ ] Scoring/distance increases monotonically during active play.
- [ ] No softlock window exceeds 5 seconds.
- [ ] Fail state triggers correctly and restarts cleanly.
- [ ] Physics bodies do not accumulate across restarts.
- [ ] Console errors during bot run are zero.
- [ ] Metrics JSON saved alongside artifacts.

## Skip Reasons

Record the skip decision with one of:
- Gameplay not release-ready yet (too early for bot testing).
- Input system not accessible to scripted drivers (gesture/analog-only on mobile).
- User explicitly asked for manual QA only.
