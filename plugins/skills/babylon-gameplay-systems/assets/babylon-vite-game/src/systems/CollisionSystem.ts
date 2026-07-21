import * as BABYLON from '@babylonjs/core';
import { Pickup } from '../entities/Pickup';

export class CollisionSystem {
  collectPickups(playerPos: BABYLON.Vector3, pickups: Pickup[], radius: number): Pickup[] {
    const collected: Pickup[] = [];
    for (const pickup of pickups) {
      if (!pickup.active) continue;
      const dx = playerPos.x - pickup.group.position.x;
      const dy = playerPos.y - pickup.group.position.y;
      const dz = playerPos.z - pickup.group.position.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < radius * radius) {
        pickup.collect();
        collected.push(pickup);
      }
    }
    return collected;
  }
}
