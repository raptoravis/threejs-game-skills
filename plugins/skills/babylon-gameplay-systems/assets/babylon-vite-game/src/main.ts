import * as BABYLON from '@babylonjs/core';
import { Game } from './game/Game';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
if (!canvas) throw new Error('Missing #game-canvas element.');

const game = new Game(canvas);
game.start();

// HMR support
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    game.dispose();
  });
  import.meta.hot.dispose(() => {
    game.dispose();
  });
}
