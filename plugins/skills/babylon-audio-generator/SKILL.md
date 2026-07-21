---
name: babylon-audio-generator
description: "Generate, convert, clean, and prepare audio assets for Babylon.js browser games using ElevenLabs. Thin mirror of threejs-audio-generator — loads the Three.js version for full ElevenLabs API documentation and Web Audio integration patterns and adds Babylon.js Sound API specifics including spatial 3D audio and mesh attachment. Use for sound effects, looping ambience, UI sounds, impact/weapon/vehicle audio, creature or boss stingers, announcer/dialogue TTS, scratch-performance voice conversion, voice cleanup/isolation, audio manifests, and game-ready web audio integration."
---

# Babylon.js Audio Generator (Thin Mirror)

## Purpose

Create game-ready audio assets for Babylon.js projects via ElevenLabs. This is a thin mirror — see `threejs-audio-generator/SKILL.md` for complete ElevenLabs API documentation, workflow details, and Web Audio integration patterns.

## Reference Gate

Load `threejs-audio-generator/SKILL.md` for full ElevenLabs API documentation.
Load `threejs-audio-generator/references/audio-workflows.md` for SFX, ambience, and voice workflows.
Load this skill's `references/babylon-audio-integration.md` for Babylon-specific Sound API guidance.

## Babylon.js Sound API

### Basic SFX

```ts
import * as BABYLON from '@babylonjs/core';

const jumpSfx = new BABYLON.Sound('jump', 'assets/audio/jump.mp3', scene, () => {
  jumpSfx.play();
}, { volume: 0.5 });
```

### Looping Ambience

```ts
const ambience = new BABYLON.Sound('ambience', 'assets/audio/wind.mp3', scene, null, {
  loop: true,
  autoplay: true,
  volume: 0.3,
});
```

### Spatial 3D Audio

```ts
const spatial = new BABYLON.Sound('spatial', 'assets/audio/engine.mp3', scene, null, {
  loop: true,
  autoplay: true,
  spatialSound: true,
  maxDistance: 30,
  rolloffFactor: 1,
});
spatial.attachToMesh(playerMesh);
```

### Audio Unlock (Mobile)

Babylon.js requires a user gesture to unlock the audio engine:

```ts
scene.onPointerDown = () => {
  BABYLON.Engine.audioEngine.unlock();
};
```

### Volume Control

```ts
// Global
BABYLON.Engine.audioEngine.setGlobalVolume(0.5);

// Per-sound
jumpSfx.setVolume(0.8);
```

## Tool Script

```bash
python3 <this-skill-dir>/scripts/babylon_audio_asset.py --text "A powerful engine roar" \
  --out-dir ./my-game/public/assets/audio/ --type sfx
```

Thin wrapper delegating to the Three.js audio generator script.
