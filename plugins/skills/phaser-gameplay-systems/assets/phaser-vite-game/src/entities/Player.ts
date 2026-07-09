import Phaser from 'phaser';

export interface ArenaBounds {
  halfWidth: number;
  halfDepth: number;
}

export const ARENA: ArenaBounds = {
  halfWidth: 350,
  halfDepth: 250,
};

export class Player {
  body: MatterJS.BodyType;
  private sprite: Phaser.GameObjects.Rectangle;
  private dashCooldown = 0;
  private readonly maxSpeed = 5;
  private readonly dashMultiplier = 2.5;
  private readonly dashDuration = 200;
  private readonly dashCooldownTime = 800;
  private dashTimer = 0;

  constructor(private scene: Phaser.Scene, x: number, y: number) {
    // Visual representation
    this.sprite = scene.add.rectangle(x, y, 24, 24, 0x4ec9b0);
    this.sprite.setDepth(10);

    // Matter.js physics body
    this.body = scene.matter.add.gameObject(this.sprite, {
      restitution: 0.3,
      friction: 0.05,
      frictionAir: 0.04,
      density: 0.002,
    }) as unknown as MatterJS.BodyType;

    this.body.label = 'player';
    this.sprite.setData('body', this.body);
  }

  update(delta: number, intent: { left: boolean; right: boolean; up: boolean; down: boolean; dash: boolean }): void {
    const dt = delta / 1000;
    this.dashCooldown = Math.max(0, this.dashCooldown - delta);

    if (intent.dash && this.dashCooldown <= 0) {
      this.dashTimer = this.dashDuration;
      this.dashCooldown = this.dashCooldownTime;
    }

    const isDashing = this.dashTimer > 0;
    this.dashTimer = Math.max(0, this.dashTimer - delta);

    const speed = isDashing ? this.maxSpeed * this.dashMultiplier : this.maxSpeed;

    let vx = 0;
    let vy = 0;
    if (intent.left) vx -= 1;
    if (intent.right) vx += 1;
    if (intent.up) vy -= 1;
    if (intent.down) vy += 1;

    // Normalize diagonal movement
    const len = Math.sqrt(vx * vx + vy * vy);
    if (len > 0) {
      vx = (vx / len) * speed;
      vy = (vy / len) * speed;
    }

    this.scene.matter.body.setVelocity(this.body, { x: vx, y: vy });

    // Color feedback for dash state
    this.sprite.fillColor = isDashing ? 0xf5ba49 : 0x4ec9b0;

    // Clamp to arena bounds
    const pos = this.body.position;
    const clamped = {
      x: Phaser.Math.Clamp(pos.x, 400 - ARENA.halfWidth + 20, 400 + ARENA.halfWidth - 20),
      y: Phaser.Math.Clamp(pos.y, 300 - ARENA.halfDepth + 20, 300 + ARENA.halfDepth - 20),
    };
    if (clamped.x !== pos.x || clamped.y !== pos.y) {
      this.scene.matter.body.setPosition(this.body, clamped);
    }
  }

  dispose(): void {
    this.sprite.destroy();
  }
}
