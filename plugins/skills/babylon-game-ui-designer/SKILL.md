---
name: babylon-game-ui-designer
description: "Design premium Babylon.js game UI with Babylon GUI and DOM overlay. Use for HUDs, menus, overlays, pause/win/lose screens, settings, icon controls, touch UI, typography, responsive layout, safe areas, text fit, and UI/world cohesion. Thin mirror of threejs-game-ui-designer — loads the Three.js version for core UI design patterns and adds Babylon GUI system specifics."
---

# Babylon.js Game UI Designer

## Purpose

Make game UI intentional, readable, responsive, and genre-specific using Babylon GUI (`@babylonjs/gui`) or DOM overlay.

This is a thin mirror of `threejs-game-ui-designer`. Load that skill's `SKILL.md` for the complete UI design methodology, pattern library, and quality checklists. This file adds Babylon-specific GUI system guidance.

## Reference Gate

Load `threejs-game-ui-designer/SKILL.md` for the full UI design workflow. Load `threejs-game-ui-designer/references/ui-patterns.md` for layout patterns, typography, iconography, and state management. Load `threejs-game-ui-designer/references/checklists/game-ui-quality.md`, `hud-readability.md`, `responsive-ui-fit.md`, and `mobile-input.md` for quality gates.

Then load this skill's `references/babylon-gui-patterns.md` for Babylon-specific GUI implementation details.

## Babylon GUI System

Babylon.js provides a built-in GUI system via `@babylonjs/gui`:

```ts
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/gui';

// Full-screen GUI
const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');

// Controls
const button = BABYLON.GUI.Button.CreateSimpleButton('btn', 'Start');
button.width = '200px';
button.height = '60px';
button.color = 'white';
button.background = 'green';
button.onPointerUpObservable.add(() => { /* handle click */ });
advancedTexture.addControl(button);

// Text block
const text = new BABYLON.GUI.TextBlock('score', '0');
text.color = 'white';
text.fontSize = 24;
advancedTexture.addControl(text);
```

### Available Controls

- **Button** — clickable button with text or image
- **TextBlock** — styled text with outline, shadow
- **Image** — image from URL or DOM element
- **Rectangle** — colored/transparent container
- **Ellipse** — circular container
- **StackPanel** — horizontal/vertical layout
- **Grid** — row/column-based layout
- **ScrollViewer** — scrollable content area
- **Slider** — value selector
- **InputText** — text input field
- **Container** — base container with background, border, corner radius

### Babylon GUI vs DOM Overlay

| Use Babylon GUI | Use DOM Overlay |
|---|---|
| Diegetic UI (in-world panels, monitors) | Text-heavy UI (tutorials, dialogs) |
| Simple HUD with few controls | Complex layouts with CSS |
| UI that interacts with 3D scene | Accessibility (screen readers) |
| Performance-sensitive (canvas-rendered) | SEO-friendly or link-heavy |

### Common Pitfalls

- Babylon GUI controls count toward draw calls — keep control count reasonable.
- `AdvancedDynamicTexture` must be created with the scene or engine.
- GUI events use `onPointerUpObservable`, `onPointerDownObservable`, `onPointerEnterObservable`, `onPointerOutObservable`.
- GUI z-order: last-added control renders on top.
- Use `isVisible = false` instead of `alpha = 0` for hidden controls.
- Responsive layout: use percentage units or `RegisterDisplayInspector`-style layout.

## Load from Three.js UI Designer

For the full UI methodology (information hierarchy, state management, icon systems, color, typography, layout patterns, menu architecture, responsive fit, safe areas, touch targets, and quality checklists), see `threejs-game-ui-designer/SKILL.md` and `threejs-game-ui-designer/references/`.
