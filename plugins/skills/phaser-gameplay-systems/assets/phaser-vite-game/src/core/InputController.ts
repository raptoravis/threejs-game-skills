import Phaser from 'phaser';

export type GameIntent = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  dash: boolean;
};

export class InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private shiftKey: Phaser.Input.Keyboard.Key;
  private dashPressed = false;

  constructor(private scene: Phaser.Scene) {
    if (!scene.input.keyboard) {
      throw new Error('Keyboard input not available. Ensure input.keyboard is enabled in game config.');
    }
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys('W,A,S,D') as typeof this.wasd;
    this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  getIntent(): GameIntent {
    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    const dashNow = this.shiftKey.isDown && !this.dashPressed;
    this.dashPressed = this.shiftKey.isDown;

    return { left, right, up, down, dash: dashNow };
  }

  dispose(): void {
    this.scene.input.keyboard?.removeAllKeys();
  }
}
