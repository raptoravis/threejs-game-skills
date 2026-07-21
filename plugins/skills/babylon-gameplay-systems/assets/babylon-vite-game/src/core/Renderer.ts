import * as BABYLON from '@babylonjs/core';

export function createEngine(canvas: HTMLCanvasElement): BABYLON.Engine {
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });

  return engine;
}

export function resizeEngine(engine: BABYLON.Engine, maxDpr: number): void {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  engine.setHardwareScalingLevel(1 / dpr);
  engine.resize();
}
