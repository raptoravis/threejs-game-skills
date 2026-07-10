---
name: phaser-qa-release
description: "Verify and release Phaser 2D browser games. Combines playtest QA, automated bot playtests, mobile/responsive checks, production builds, preview verification, static-hosting base paths, debug gating, bundle review, screenshots, visual test harness decisions, packaged canvas-pixel inspection with measured metrics, console checks, and release risk reports."
---

# Phaser QA & Release

## Purpose

Prove the 2D game works as a player encounters it, then prepare a shippable browser build with known risks.

## QA Workflow

Load `references/qa-release-checklists.md` as the first action before broad QA, mobile verification, bug reporting, production preview, static-hosting checks, or release preparation. Track it in a reference ledger with yes/no, path, and failure reason. Do not mark QA/release complete while this reference is skipped for QA or release work.

Load the shared Three.js QA checklists through the skill path ladder when the matching work applies: `threejs-qa-release/references/checklists/visual-verification.md` for screenshot/canvas verification, `threejs-qa-release/references/checklists/playtest-qa.md` for player-loop QA, and `threejs-qa-release/references/checklists/release.md` for production release checks. Load `references/prompt-templates.md` only when the user asks for reusable QA/release prompts or a task template.

Load `threejs-qa-release/references/visual-test-harness.md` and `threejs-qa-release/references/checklists/visual-test-harness.md` when the game warrants screenshot baselines, visual regression testing, release-ready visual evidence, UI/generated-asset regression protection, or premium visual QA. If a harness is not warranted, report the skip reason.

Load `threejs-qa-release/references/playtest-bot.md` and `threejs-qa-release/references/checklists/bot-playtest.md` for release-ready gameplay claims, difficulty/fairness verification, or when the playable loop has never been driven by scripted input. Report the bot playtest decision as added/extended/skipped with reason.

1. Install dependencies if needed.
2. Run `npm run build` and typecheck; verify clean output.
3. Start dev or preview server.
4. Open browser target.
5. Capture console/page/network errors.
6. Verify nonblank canvas pixels via `inspect-phaser-canvas.mjs`.
7. Capture desktop (1280x720) and mobile (375x667) screenshots.
8. Trigger main input, objective progression, fail/retry, scene transitions, and recent risky paths. Verify no flicker, no stale objects, no stuck loading, and clean restart state.
9. Check HUD text fit, safe areas, touch targets, responsive layout, and ScaleManager `FIT` behavior.
10. Decide whether to add or extend a visual test harness. For premium/release UI or generated-asset work, prefer a harness unless determinism is a real blocker.
10b. Decide whether to run the bot playtest (the scaffold's `tests/bot-playtest.template.ts` when present). For release-ready gameplay claims, run it and report the metrics JSON.
11. If audio changed, verify user-gesture unlock, SFX triggers, ambience loop start/stop, pause/restart cleanup, mute/volume behavior, and decode/load errors.
12. Record artifacts and issues.

## Packaged Canvas Inspector

Use the bundled inspector when the target project does not already include one:

```bash
node <this-skill-dir>/scripts/inspect-phaser-canvas.mjs --url http://127.0.0.1:5288
```

For mobile emulation, add `--mobile`. Add `--out <file>` to write a screenshot. Generated games from the packaged scaffold also include their own canvas-inspection script and `npm run inspect:canvas`. The inspector exits nonzero on blank-canvas or error conditions; cite its measured output as evidence in the 2D visual scorecard (`phaser-2d-graphics-builder/references/visual-scorecard.md`).

## Release Workflow

1. Inspect package scripts, Vite config, base path, public/assets.
2. Gate debug UI/logging/test helpers; set `matter.debug: false`, remove debug GUI and diagnostics exposure.
3. Run production build (`npm run build`) and preview/static server.
4. Verify built output desktop/mobile.
5. Review bundle and large assets (`dist/` size, main JS bundle).
6. Document deploy command, host assumptions, release notes (version, changes, known issues), and residual risks.

## Final Response

Lead with pass/fail. Include the reference ledger, QA matrix/checklist result, commands, URL, controls, screenshots/artifacts, issues found/fixed, deployment notes, and risks.
When visual baselines are in scope, include the harness decision, states covered, update/compare commands, artifact paths, thresholds/masks, and flake risks.
When the bot playtest ran, include its metrics JSON (frames, score progression, distance, softlock windows, seed) and the added/extended/skipped decision.
