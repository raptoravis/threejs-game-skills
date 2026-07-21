import * as BABYLON from '@babylonjs/core';

export class Pickup {
  group: BABYLON.TransformNode;
  mesh!: BABYLON.Mesh;
  active = true;
  private bobOffset: number;
  private material!: BABYLON.PBRMaterial;

  constructor(
    public readonly index: number,
    public readonly position: BABYLON.Vector3,
    scene: BABYLON.Scene,
  ) {
    this.group = new BABYLON.TransformNode(`pickup-${index}`);
    this.group.position.copyFrom(position);
    this.bobOffset = Math.random() * Math.PI * 2;
    this.createMesh(scene);
  }

  private createMesh(scene: BABYLON.Scene): void {
    this.mesh = BABYLON.MeshBuilder.CreateTorusKnot(`pickupMesh-${this.index}`, {
      radius: 0.3, tube: 0.1, radialSegments: 16, tubularSegments: 32, p: 2, q: 3,
    }, scene);

    this.material = new BABYLON.PBRMaterial(`pickupMat-${this.index}`, scene);
    this.material.albedoColor = BABYLON.Color3.FromHexString('#F5BA49');
    this.material.emissiveColor = BABYLON.Color3.FromHexString('#F5BA49');
    this.material.emissiveIntensity = 0.35;
    this.material.roughness = 0.35;
    this.material.metallic = 0.6;

    this.mesh.material = this.material;
    this.mesh.parent = this.group;
  }

  update(delta: number, elapsed: number): void {
    if (!this.active) {
      this.group.scaling.scaleInPlace(0.92);
      return;
    }
    this.group.position.y = this.position.y + Math.sin(elapsed * 2.5 + this.bobOffset) * 0.22;
    this.group.rotation.y += delta * 1.3;
    this.group.rotation.x += delta * 0.6;
  }

  collect(): void {
    this.active = false;
  }

  reset(): void {
    this.active = true;
    this.group.position.copyFrom(this.position);
    this.group.scaling.setAll(1);
  }

  dispose(): void {
    this.group.dispose();
    this.material.dispose();
  }
}
