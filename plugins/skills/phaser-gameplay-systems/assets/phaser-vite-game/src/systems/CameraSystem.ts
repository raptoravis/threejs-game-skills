import Phaser from 'phaser';

export class CameraSystem {
  private camera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: Phaser.Scene) {
    this.camera = scene.cameras.main;
  }

  follow(target: { x: number; y: number }): void {
    // Simple follow without lerp — Phaser's built-in follow
    // can be used for more advanced behavior with deadzones.
    // For the scaffold, camera stays centered on the arena.
  }

  dispose(): void {
    this.camera.stopFollow();
  }
}
