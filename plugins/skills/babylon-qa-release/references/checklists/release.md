# Release Checklist (Babylon.js)

## Pre-Release Verification

### Build
- [ ] `npm run build` succeeds with no type errors.
- [ ] Production build preview works (`npm run preview`).
- [ ] Vite `base` path matches target deployment URL.
- [ ] `public/` assets are referenced with correct paths.

### Debug Gating
- [ ] Babylon Inspector is disabled or gated behind a debug flag.
- [ ] `scene.debugLayer.show()` calls removed or gated.
- [ ] Debug overlays, diagnostic logs, and test shortcuts removed from player-facing build.
- [ ] `lil-gui` or equivalent tuning panels gated/removed.

### Bundle Review
- [ ] `@babylonjs/core` tree-shaken (only used modules imported).
- [ ] `@babylonjs/havok` WASM file served correctly (Vite copies to assets).
- [ ] No unused large dependencies.
- [ ] Total bundle size documented (gzip).

### Security
- [ ] No API keys in client-side code, `.env` files not committed, built code, or browser-visible environment variables.
- [ ] Generated asset URLs do not expose credentials.
- [ ] `.env` / `.env.local` in `.gitignore`.

### Static Hosting
- [ ] `dist/` contents serve correctly from a static server.
- [ ] SPA fallback configured if using client-side routing.
- [ ] CORS headers not required for same-origin assets.
- [ ] WASM MIME type served correctly for Havok physics.

### Browser Support
- [ ] WebGL 2.0 required (Babylon.js 7+ minimum).
- [ ] Tested on latest Chrome and Firefox desktop.
- [ ] Tested on Safari iOS 15+ and Chrome Android if mobile is in scope.
- [ ] Fallback message for unsupported browsers documented.

## Documentation

- [ ] Deploy command documented: `npm run build && <deploy command>`.
- [ ] Host assumptions listed (static host, S3/CloudFront, GitHub Pages, Vercel, Netlify).
- [ ] Required environment variables documented (if any build-time vars).
- [ ] Known issues and residual risks listed.

## Residual Risk Format

```text
Residual risks:
1. [Risk] — [Likelihood: Low/Med/High] — [Mitigation]
2. ...
```
