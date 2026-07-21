import * as BABYLON from '@babylonjs/core';
import GUI from 'lil-gui';

export interface DebugTuning {
  speed: number;
  dashMultiplier: number;
  acceleration: number;
  cameraLag: number;
  exposure: number;
  maxDpr: number;
}

export class DebugTools {
  private gui?: GUI;
  private hidden = false;

  constructor(
    private readonly tuning: DebugTuning,
    private readonly scene: BABYLON.Scene,
    private readonly onTuningChange: () => void,
  ) {
    this.setupGUI();
  }

  private setupGUI(): void {
    this.gui = new GUI({ title: 'Babylon Game Tuning', width: 300 });
    this.gui.add(this.tuning, 'speed', 2, 14).onChange(() => this.onTuningChange());
    this.gui.add(this.tuning, 'dashMultiplier', 1, 3).onChange(() => this.onTuningChange());
    this.gui.add(this.tuning, 'acceleration', 5, 30).onChange(() => this.onTuningChange());
    this.gui.add(this.tuning, 'cameraLag', 0.05, 0.5).onChange(() => this.onTuningChange());
    this.gui.add(this.tuning, 'exposure', 0.5, 2.5).step(0.05).onChange(() => this.onTuningChange());

    const debugFolder = this.gui.addFolder('Debug');
    debugFolder.add({ inspector: false }, 'inspector').onChange((v: boolean) => {
      if (v) this.scene.debugLayer.show({ embedMode: true });
      else this.scene.debugLayer.hide();
    });
  }

  setHidden(hidden: boolean): void {
    this.hidden = hidden;
    if (this.gui) {
      this.gui.domElement.style.display = hidden ? 'none' : '';
    }
  }

  dispose(): void {
    this.gui?.destroy();
  }
}
