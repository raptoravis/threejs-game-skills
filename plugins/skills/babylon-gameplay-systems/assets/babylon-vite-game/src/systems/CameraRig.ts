import * as BABYLON from '@babylonjs/core';

export class CameraRig {
  constructor(private readonly camera: BABYLON.ArcRotateCamera) {}

  snapTo(target: BABYLON.Vector3): void {
    this.camera.target.copyFrom(target);
  }

  update(_delta: number, target: BABYLON.Vector3, lag: number): void {
    this.camera.target = BABYLON.Vector3.Lerp(
      this.camera.target,
      new BABYLON.Vector3(target.x, target.y + 1.5, target.z),
      lag,
    );
  }
}
