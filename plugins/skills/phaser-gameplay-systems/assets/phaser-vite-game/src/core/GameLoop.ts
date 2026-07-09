export interface GameDiagnostics {
  frame: number;
  elapsed: number;
  score: number;
  targetScore: number;
  complete: boolean;
  playerPosition: { x: number; y: number };
  playerVelocity: { x: number; y: number };
  bodyCount: number;
  canvas: {
    clientWidth: number;
    clientHeight: number;
    width: number;
    height: number;
  };
}

declare global {
  interface Window {
    __PHASER_GAME_DIAGNOSTICS__?: GameDiagnostics;
  }
}
