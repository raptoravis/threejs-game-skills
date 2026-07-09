---
name: phaser-qa-release
description: "Verify and release Phaser 2D browser games. Combines playtest QA, mobile/responsive checks, production builds, preview verification, static-hosting base paths, debug gating, bundle review, screenshots, packaged canvas-pixel inspection, console checks, and release risk reports."
---

# Phaser QA & Release

## Purpose

Verify a Phaser 2D game is ready for release. Catch console errors, broken input paths, visual regressions, mobile issues, and production build problems.

## Workflow

Load `references/qa-release-checklists.md` as the first action for any QA or release task. Track it in a reference ledger.

Load `references/prompt-templates.md` only when the user asks for reusable prompts.

## QA Workflow

1. Run `npm run build` and verify clean output.
2. Start preview server (`npm run preview`).
3. Check browser console for errors and warnings.
4. Test the main control path: can the player complete the core loop?
5. Test fail/retry: die, restart, verify clean state.
6. Test scene transitions: no flicker, no stale objects, no stuck loading.
7. Capture desktop screenshot (1280x720).
8. Capture mobile screenshot (375x667).
9. Run canvas pixel check: `node scripts/inspect-phaser-canvas.mjs --url <url> --mobile`.
10. Verify HUD: text fits, no overlap, touch targets adequate, safe areas respected.
11. Report issues found.

## Release Workflow

1. Verify `npm run build` passes with no errors.
2. Check bundle size: `dist/` directory size, main JS bundle size.
3. Remove debug features: physics debug, debug GUI, debug logging, diagnostics exposure.
4. Set production Phaser config: `matter.debug: false`, `render.antialias: true` (if appropriate), `scale.mode: FIT`.
5. Verify production build in `preview` mode.
6. Write brief release notes: version, changes, known issues.

## Packaged Canvas Inspector

```bash
node <this-skill-dir>/scripts/inspect-phaser-canvas.mjs --url http://127.0.0.1:5288 [--out screenshot.png] [--mobile]
```

## Final Response

Report build status, bundle size, screenshots captured, canvas pixel check result, console errors, tested paths, release readiness, and remaining risks.
