import * as BABYLON from '@babylonjs/core';

export interface ArenaBounds {
  halfWidth: number;
  halfDepth: number;
}

export class Player {
  readonly group: BABYLON.TransformNode;
  readonly mesh: BABYLON.Mesh;
  velocity = new BABYLON.Vector3(0, 0, 0);

  constructor() {
    this.group = new BABYLON.TransformNode('player');

    // Placeholder: will be replaced by imported model or MeshBuilder shape
    const scene = (this.group as any)._scene as BABYLON.Scene;
  }

  // Bind the player group to a scene after construction
  attachTo(scene: BABYLON.Scene): void {
    // Create a simple player mesh
    this.mesh = BABYLON.MeshBuilder.CreateCylinder('playerBody', {
      height: 1.2, diameter: 0.55, tessellation: 12,
    }, scene);
    this.mesh.parent = this.group;
    this.mesh.position.y = 0.6;

    const head = BABYLON.MeshBuilder.CreateSphere('playerHead', {
      diameter: 0.4, segments: 12,
    }, scene);
    head.parent = this.group;
    head.position.y = 1.3;

    const mat = new BABYLON.PBRMaterial('playerMat', scene);
    mat.albedoColor = BABYLON.Color3.FromHexString('#4A90D9');
    mat.roughness = 0.45;
    mat.metallic = 0.3;

    const headMat = new BABYLON.PBRMaterial('playerHeadMat', scene);
    headMat.albedoColor = BABYLON.Color3.FromHexString('#F5BA49');
    headMat.roughness = 0.55;
    headMat.metallic = 0.05;

    // Apply materials to submeshes
    this.mesh.material = mat;
    head.material = headMat;
  }

  update(
    delta: number,
    _animDelta: number,
    input: { moveX: number; moveY: number; dash: boolean },
    tuning: { speed: number; dashMultiplier: number; acceleration: number },
    arena: ArenaBounds,
  ): void {
    const targetX = input.moveX * tuning.speed;
    const targetZ = input.moveY * tuning.speed;
    const dashScale = input.dash ? tuning.dashMultiplier : 1;

    this.velocity.x += (targetX * dashScale - this.velocity.x) * tuning.acceleration * delta;
    this.velocity.z += (targetZ * dashScale - this.velocity.z) * tuning.acceleration * delta;

    if (input.moveX === 0 && input.moveY === 0) {
      this.velocity.x *= 0.9;
      this.velocity.z *= 0.9;
    }

    this.group.position.x += this.velocity.x * delta;
    this.group.position.z += this.velocity.z * delta;

    // Clamp to arena
    this.group.position.x = Math.max(-arena.halfWidth + 0.5, Math.min(arena.halfWidth - 0.5, this.group.position.x));
    this.group.position.z = Math.max(-arena.halfDepth + 0.5, Math.min(arena.halfDepth - 0.5, this.group.position.z));

    // Face movement direction
    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.z) > 0.1) {
      const angle = Math.atan2(this.velocity.x, this.velocity.z);
      this.group.rotation.y += (angle - this.group.rotation.y) * 0.2;
    }
  }

  dispose(): void {
    this.group.dispose();
  }
}
