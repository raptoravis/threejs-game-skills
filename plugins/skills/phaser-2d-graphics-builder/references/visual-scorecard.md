# 2D Visual Scorecard

Score active-play screenshots, not idle title screens or isolated sprites. Use desktop and mobile screenshots when mobile is in scope.

## Scoring Scale

- 0: Placeholder. Default geometric shapes, flat color background, debug text, or no evidence.
- 1: Basic styled. Playable and themed, but still obvious prototype assets, flat composition, repeated shapes, or generic UI.
- 2: Premium stylized. Authored sprites/sprite sheets, parallax depth, readable state, cohesive UI/world, measured performance.
- 3: Showcase. Strong art direction, memorable characters and world, dense authored detail, excellent readability, polished VFX/rendering, and diagnostics.

## Categories

1. Art direction.
   - 0: No clear theme.
   - 1: Theme is mostly background color + basic shapes.
   - 2: Theme affects sprites, UI, world, and feedback.
   - 3: Distinct identity visible in every visual surface.

2. Hero/player sprite.
   - 0: Default rectangle/circle.
   - 1: Basic sprite with 2-3 color blocks.
   - 2: Authored sprite sheet with idle/run/jump frames, state cues, readable silhouette.
   - 3: Memorable character with layered animation states and expressive feedback.

3. Enemies/obstacles.
   - 0: Single colored shape.
   - 1: Recolored repeated shape.
   - 2: Three readable variants with distinct silhouettes, telegraph animations, and material cues.
   - 3: Varied family with animation, anticipation, and gameplay clarity.

4. Rewards/interactables.
   - 0: Plain circle/token.
   - 1: Repeated shape with simple color difference.
   - 2: Two authored forms with idle/collect animation states and UI feedback.
   - 3: Desirable, animated, and clearly valued during motion.

5. World/background.
   - 0: Flat color or simple gradient.
   - 1: Single repeating tile or basic grid.
   - 2: Multi-layer parallax background with foreground/midground/background and scale cues.
   - 3: Dense authored world with distinct zones, environmental storytelling, and gameplay readability.

6. Sprite sheets / color palette.
   - 0: Placeholder shapes with no palette.
   - 1: Basic sprites with inconsistent colors.
   - 2: Shared color palette, well-organized sprite sheets, visual consistency across all assets.
   - 3: Rich cohesive visual language with disciplined asset organization.

7. 2D lighting / atmosphere.
   - 0: No lighting or atmosphere.
   - 1: Simple color overlay or vignette.
   - 2: Intentional 2D lighting (light cones, day/night cycle, ambient particles, fog layers).
   - 3: Cinematic but readable 2D atmosphere with disciplined effect use.

8. VFX/motion.
   - 0: None or random particles.
   - 1: Generic particles in one color.
   - 2: Event-driven VFX for boost, pickup, hit, fail, combo, spawn, boss.
   - 3: High-impact effects that clarify gameplay and remain performant.

9. UI/HUD.
   - 0: Debug text or missing UI.
   - 1: Generic stat-card dashboard.
   - 2: Genre-specific HUD states, meters/icons, responsive text fit, touch-friendly.
   - 3: Cohesive game interface with strong hierarchy, polished transitions, and game-world cohesion.

10. Performance evidence.
   - 0: No metrics after visual changes.
   - 1: Informal "seems fine."
   - 2: Render diagnostics, build/QA, desktop/mobile screenshots.
   - 3: Baseline/post metrics, bottleneck notes, budgets, and optimized asset strategy.

## Thresholds

Premium:
- Every category at least 2.
- Average at least 2.3.
- Desktop and mobile active-play screenshots captured when mobile is in scope.
- Render diagnostics reported after graphics changes.

Showcase:
- At least six categories score 3.
- No category below 2.
- Average at least 2.7.
- Performance evidence includes before/after or budget-aware notes.

## Automatic Failures

Any one of these blocks premium/showcase claims:
- Active screenshot uses default geometric shapes.
- Main world is a flat color with no depth.
- Hero/player is a rectangle or circle.
- Enemies or rewards are one repeated shape.
- HUD is mostly rectangular stat/debug cards.
- Particles hide missing authored assets.
- UI overlaps play path, clips text, or fails mobile safe areas.
- Game is not playable through real input.
- No active-play screenshot captured.
- No render diagnostics collected after major graphics work.
