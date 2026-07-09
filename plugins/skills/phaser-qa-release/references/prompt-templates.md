# Prompt Templates (Phaser QA/Release)

Load this reference only when the user asks for reusable prompts.

## QA Pass

```text
Run a QA pass on this Phaser 2D game.

1. `npm run build` — verify clean.
2. Start preview server.
3. Check browser console for errors.
4. Test main control path: complete the core loop.
5. Test fail/retry: die, restart, verify clean state.
6. Test scene transitions.
7. Capture desktop + mobile screenshots.
8. Run canvas pixel check.
9. Verify HUD: text fit, no overlap, touch targets, safe areas.
10. Report issues found with severity and repro steps.
```

## Release Preparation

```text
Prepare this Phaser 2D game for release.

1. Verify production build passes.
2. Disable debug features: physics debug, debug GUI, diagnostics, console.log.
3. Set production config: matter.debug=false, antialias=true, scale.mode=FIT.
4. Test production build in preview mode.
5. Review bundle size.
6. Write release notes: version, changes, known issues.
7. Report release readiness.
```
