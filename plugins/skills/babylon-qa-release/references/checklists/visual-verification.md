# Visual Verification Checklist (Babylon.js)

## Canvas Check

- [ ] Canvas element exists in DOM and is visible.
- [ ] Canvas CSS size is nonzero.
- [ ] Canvas drawing buffer is nonzero and matches expected DPR.
- [ ] Pixels are nonblank (variance > 8 or > 3 unique color buckets on coarse sample).
- [ ] Alpha channel present if transparency is expected.

## Screenshot Checklist

- [ ] Desktop screenshot at 1280×720 minimum.
- [ ] Mobile screenshot at iPhone 13 viewport (390×844) when mobile is in scope.
- [ ] Active play state (not idle/title/menu only).
- [ ] Main game elements visible: player, environment, HUD, objectives.
- [ ] No rendering artifacts: black triangles, missing textures (pink/checkerboard), z-fighting, flickering.
- [ ] HUD text readable, not clipped, not overlapping.
- [ ] Safe areas respected on mobile (notch/island/pill).
- [ ] Post-processing effects visible but not overwhelming.

## Babylon.js-Specific Checks

- [ ] Scene `clearColor` renders correctly.
- [ ] Skybox / environment texture loads (no fallback gray).
- [ ] Shadow maps render correctly (no acne, no peter-panning).
- [ ] PBR materials show correct roughness/metallic response.
- [ ] Node Materials compile without errors.
- [ ] `DefaultRenderingPipeline` effects (bloom, DOF, SSAO) render correctly.
- [ ] glTF/GLB imported models have correct materials and textures.

## Automatic Visual Failures

Any of these in an active-play screenshot is an automatic failure for premium/AAA claims:

- Canvas is blank, single-color, or has < 3 distinct color buckets.
- Dominant color occupies > 95% of pixels (likely blank or all-one-color sky/ground).
- No visible player, objective, or interactive element.
- HUD completely missing or unreadable.
- Clear rendering error (pink materials, black meshes, missing world).
- Fog/darkness hides all gameplay geometry.
- Post-processing bloom alone is the only visual detail beyond primitives.
