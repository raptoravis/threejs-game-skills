# Babylon GUI Patterns

## FullscreenUI Setup

```ts
import '@babylonjs/gui';

const ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('mainUI');
```

## Common HUD Layout (StackPanel + Grid)

```ts
// Top bar: score + timer
const topBar = new BABYLON.GUI.StackPanel('topBar');
topBar.isVertical = false;
topBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
topBar.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
topBar.paddingTop = '12px';
ui.addControl(topBar);

const scoreText = new BABYLON.GUI.TextBlock('score', 'Score: 0');
scoreText.color = 'white';
scoreText.fontSize = 18;
scoreText.paddingRight = '20px';
topBar.addControl(scoreText);

const timerText = new BABYLON.GUI.TextBlock('timer', '0:00');
timerText.color = 'white';
timerText.fontSize = 18;
topBar.addControl(timerText);
```

## Button with Visual Feedback

```ts
const btn = BABYLON.GUI.Button.CreateSimpleButton('play', '▶ Play');
btn.width = '200px';
btn.height = '50px';
btn.color = 'white';
btn.background = '#2a6e3f';
btn.cornerRadius = 8;
btn.thickness = 0;

// Hover effect
btn.onPointerEnterObservable.add(() => {
  btn.background = '#3a8e4f';
});
btn.onPointerOutObservable.add(() => {
  btn.background = '#2a6e3f';
});
btn.onPointerUpObservable.add(() => {
  // Navigate or start game
});
```

## Touch-Friendly Sizing

- Minimum touch target: 44×44 CSS pixels (Babylon GUI uses canvas pixels — account for DPR).
- Use `width = 1 / window.devicePixelRatio * 44 + 'px'` or use fixed larger values on mobile.
- Separate touch targets by at least 12px.

## Responsive Layout

- Use percentage strings for responsive sizing: `width = '80%'`, `height = '10%'`.
- `StackPanel` for linear layouts with `isVertical` and spacing.
- `Grid` for complex grid layouts with row/column definitions.
- Use `horizontalAlignment` and `verticalAlignment` for positioning.
- For safe areas, add padding: `paddingTop = 'env(safe-area-inset-top)'` is not directly supported — use JavaScript to read safe area CSS variables and set padding programmatically.

## Performance Notes

- Babylon GUI controls are rendered on a separate canvas layer — too many controls increases texture memory.
- Reuse TextBlock/Image controls instead of creating/destroying them per frame.
- `isVisible = false` is cheaper than removing/re-adding controls.
- For complex text-heavy UI (dialogs, tutorials), prefer DOM overlay over Babylon GUI.
