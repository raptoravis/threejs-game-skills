import Phaser from 'phaser';
import { InputController } from '../core/InputController';
import type { GameDiagnostics } from '../core/GameLoop';
import { Player, ARENA } from '../entities/Player';
import { Pickup } from '../entities/Pickup';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { Hud } from '../systems/Hud';
import { CameraSystem } from '../systems/CameraSystem';

export class GameScene extends Phaser.Scene {
  private inputCtrl!: InputController;
  private player!: Player;
  private pickups: Pickup[] = [];
  private physics!: PhysicsSystem;
  private audioSys!: AudioSystem;
  private hud!: Hud;
  private cameraSys!: CameraSystem;

  private score = 0;
  private targetScore = 0;
  private elapsed = 0;
  private complete = false;
  private frame = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.score = 0;
    this.elapsed = 0;
    this.complete = false;
    this.frame = 0;

    this.inputCtrl = new InputController(this);
    this.physics = new PhysicsSystem(this);
    this.audioSys = new AudioSystem(this);
    this.hud = new Hud(this);
    this.cameraSys = new CameraSystem(this);

    this.createArena();
    this.player = new Player(this, 400, 300);
    this.createPickups();

    this.targetScore = this.pickups.length;
    this.hud.setTarget(this.targetScore);

    this.physics.setupCollisions(this.player.body, this.pickups, (pickup) => this.onPickupCollected(pickup));

    // Launch UI scene as overlay
    this.scene.launch('UIScene', { hud: this.hud });

    this.publishDiagnostics();
  }

  update(_time: number, delta: number): void {
    if (this.complete) return;

    this.frame += 1;
    this.elapsed += delta;

    const intent = this.inputCtrl.getIntent();
    this.player.update(delta, intent);

    for (const pickup of this.pickups) {
      pickup.update(delta);
    }

    this.cameraSys.follow(this.player.body.position);
    this.hud.update(this.score, this.targetScore, this.elapsed, this.complete);
    this.publishDiagnostics();
  }

  shutdown(): void {
    this.scene.stop('UIScene');
  }

  private onPickupCollected(pickup: Pickup): void {
    this.score += 1;
    this.audioSys.pickup(pickup.index);
    this.hud.flashPickup();

    if (this.score >= this.targetScore) {
      this.complete = true;
    }
  }

  private createArena(): void {
    const { halfWidth, halfDepth } = ARENA;

    // Floor
    const floor = this.add.rectangle(400, 300, halfWidth * 2, halfDepth * 2, 0x2a2c25);
    floor.setDepth(0);

    // Arena boundary walls (Matter.js static bodies)
    const wallThickness = 16;
    const wallColor = 0xd94f35;

    // Top wall
    this.add.rectangle(400, 300 - halfDepth, halfWidth * 2 + wallThickness, wallThickness, wallColor).setDepth(1);
    // Bottom wall
    this.add.rectangle(400, 300 + halfDepth, halfWidth * 2 + wallThickness, wallThickness, wallColor).setDepth(1);
    // Left wall
    this.add.rectangle(400 - halfWidth, 300, wallThickness, halfDepth * 2 + wallThickness, wallColor).setDepth(1);
    // Right wall
    this.add.rectangle(400 + halfWidth, 300, wallThickness, halfDepth * 2 + wallThickness, wallColor).setDepth(1);

    // Matter.js boundary walls
    this.matter.add.rectangle(400, 300 - halfDepth, halfWidth * 2 + wallThickness, wallThickness, { isStatic: true });
    this.matter.add.rectangle(400, 300 + halfDepth, halfWidth * 2 + wallThickness, wallThickness, { isStatic: true });
    this.matter.add.rectangle(400 - halfWidth, 300, wallThickness, halfDepth * 2 + wallThickness, { isStatic: true });
    this.matter.add.rectangle(400 + halfWidth, 300, wallThickness, halfDepth * 2 + wallThickness, { isStatic: true });

    // Center marker
    const marker = this.add.circle(400, 300, 10, 0xf5ba49, 0.3);
    marker.setDepth(0);
  }

  private createPickups(): void {
    const positions = [
      { x: 200, y: 150 },
      { x: 500, y: 120 },
      { x: 650, y: 270 },
      { x: 150, y: 350 },
      { x: 400, y: 400 },
      { x: 600, y: 480 },
      { x: 250, y: 500 },
      { x: 700, y: 420 },
    ];

    positions.forEach(({ x, y }, index) => {
      const pickup = new Pickup(this, index, x, y);
      this.pickups.push(pickup);
    });
  }

  private publishDiagnostics(): void {
    window.__PHASER_GAME_DIAGNOSTICS__ = {
      frame: this.frame,
      elapsed: this.elapsed,
      score: this.score,
      targetScore: this.targetScore,
      complete: this.complete,
      playerPosition: { x: this.player.body.position.x, y: this.player.body.position.y },
      playerVelocity: { x: this.player.body.velocity.x, y: this.player.body.velocity.y },
      bodyCount: this.matter.world.getAllBodies().length,
      canvas: {
        clientWidth: this.game.canvas.clientWidth,
        clientHeight: this.game.canvas.clientHeight,
        width: this.game.canvas.width,
        height: this.game.canvas.height,
      },
    };
  }
}
