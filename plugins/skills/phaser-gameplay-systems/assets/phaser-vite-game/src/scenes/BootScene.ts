import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Minimal assets needed before the game starts.
    // For the scaffold demo, we generate textures procedurally in GameScene.
    // Real games should load spritesheets, tilemaps, audio etc. here.
  }

  create(): void {
    this.scene.start('GameScene');
  }
}
