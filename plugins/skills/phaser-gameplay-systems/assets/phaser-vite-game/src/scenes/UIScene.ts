import Phaser from 'phaser';
import type { Hud } from '../systems/Hud';

export class UIScene extends Phaser.Scene {
  private hud!: Hud;

  constructor() {
    super({ key: 'UIScene' });
  }

  init(data: { hud: Hud }): void {
    this.hud = data.hud;
  }

  create(): void {
    // HUD rendering is handled via DOM in Hud.ts.
    // This scene exists for any canvas-based overlay UI.
  }
}
