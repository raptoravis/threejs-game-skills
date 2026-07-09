import Phaser from 'phaser';

export class Pickup {
  readonly index: number;
  body: MatterJS.BodyType;
  private sprite: Phaser.GameObjects.Arc;
  private baseY: number;
  private elapsed = 0;
  private collected = false;

  constructor(private scene: Phaser.Scene, index: number, x: number, y: number) {
    this.index = index;
    this.baseY = y;

    this.sprite = scene.add.circle(x, y, 10, 0xf5ba49);
    this.sprite.setDepth(5);

    this.body = scene.matter.add.gameObject(this.sprite, {
      isStatic: true,
      isSensor: true,
    }) as unknown as MatterJS.BodyType;

    this.body.label = `pickup-${index}`;
    this.sprite.setData('body', this.body);
  }

  update(delta: number): void {
    if (this.collected) return;
    this.elapsed += delta;

    // Bobbing animation
    const bobY = this.baseY + Math.sin(this.elapsed * 0.003) * 6;
    this.sprite.y = bobY;
  }

  collect(): void {
    this.collected = true;
    // Scale-down and fade-out
    this.scene.tweens.add({
      targets: this.sprite,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 200,
      onComplete: () => this.sprite.destroy(),
    });
  }

  dispose(): void {
    if (this.sprite.active) {
      this.sprite.destroy();
    }
  }
}
