import { Game } from './game/Game';
import type { BABYLON } from './vite-env';

declare global {
  interface Window {
    __BABYLON_GAME_DIAGNOSTICS__?: {
      frame: number;
      elapsed: number;
      score: number;
      targetScore: number;
      complete: boolean;
      player: {
        position: { x: number; y: number; z: number };
        speed: number;
      };
      scene: {
        meshes: number;
        materials: number;
        textures: number;
        drawCalls: number | null;
        fps: number;
      };
      canvas: {
        clientWidth: number;
        clientHeight: number;
        width: number;
        height: number;
        dpr: number;
      };
    };
    __BABYLON_GAME_TEST_HOOKS__?: TestHooks;
  }
}

interface TestHooks {
  seed(value: number): void;
  setState(name: string): void;
  setPausedForScreenshot(paused: boolean): void;
  setReducedMotion(enabled: boolean): void;
  hideDebugUi(hidden: boolean): void;
}
