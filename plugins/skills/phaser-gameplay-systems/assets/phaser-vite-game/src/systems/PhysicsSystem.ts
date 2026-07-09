import Phaser from 'phaser';
import type { Pickup } from '../entities/Pickup';

export class PhysicsSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setupCollisions(
    playerBody: MatterJS.BodyType,
    pickups: Pickup[],
    onCollect: (pickup: Pickup) => void,
  ): void {
    this.scene.matter.world.on('collisionstart', (_event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      for (const pair of _event.pairs) {
        const labelA = (pair.bodyA as MatterJS.BodyType).label;
        const labelB = (pair.bodyB as MatterJS.BodyType).label;

        if (labelA === 'player' && labelB.startsWith('pickup-')) {
          const index = parseInt(labelB.split('-')[1], 10);
          const pickup = pickups.find((p) => p.index === index && (p.body as unknown as MatterJS.BodyType).label === labelB);
          if (pickup) {
            pickup.collect();
            onCollect(pickup);
          }
        } else if (labelB === 'player' && labelA.startsWith('pickup-')) {
          const index = parseInt(labelA.split('-')[1], 10);
          const pickup = pickups.find((p) => p.index === index && (p.body as unknown as MatterJS.BodyType).label === labelA);
          if (pickup) {
            pickup.collect();
            onCollect(pickup);
          }
        }
      }
    });
  }

  dispose(): void {
    this.scene.matter.world.off('collisionstart');
  }
}
