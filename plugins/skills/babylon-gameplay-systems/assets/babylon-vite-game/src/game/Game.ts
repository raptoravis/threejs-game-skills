import * as BABYLON from '@babylonjs/core';
import { InputController } from '../core/InputController';
import { Loop } from '../core/Loop';
import { createEngine, resizeEngine } from '../core/Renderer';
import { Pickup } from '../entities/Pickup';
import { Player, type ArenaBounds } from '../entities/Player';
import { AudioSystem } from '../systems/AudioSystem';
import { CameraRig } from '../systems/CameraRig';
import { CollisionSystem } from '../systems/CollisionSystem';
import { DebugTools, type DebugTuning } from '../systems/DebugTools';
import { Hud } from '../systems/Hud';
import { createSeededRandom } from '../utils/random';

const ARENA: ArenaBounds = {
  halfWidth: 11,
  halfDepth: 7,
};

export class Game {
  private readonly engine: BABYLON.Engine;
  private readonly scene = new BABYLON.Scene();
  private camera!: BABYLON.ArcRotateCamera;
  private readonly input: InputController;
  private readonly player = new Player();
  private readonly pickups: Pickup[] = [];
  private readonly collision = new CollisionSystem();
  private readonly audio = new AudioSystem();
  private readonly hud = new Hud();
  private cameraRig!: CameraRig;
  private readonly loop = new Loop(
    (delta, elapsed) => this.update(delta, elapsed),
    () => this.render(),
  );

  private readonly tuning: DebugTuning = {
    speed: 5.8,
    dashMultiplier: 1.75,
    acceleration: 13,
    cameraLag: 0.16,
    exposure: 1.05,
    maxDpr: 2,
  };

  private readonly debugTools: DebugTools;
  private frame = 0;
  private score = 0;
  private elapsed = 0;
  private complete = false;
  // Route ALL gameplay randomness through this.rng (never Math.random) so the
  // seed() test hook keeps screenshot baselines and bot playtests deterministic.
  private rng = createSeededRandom(1);
  private pausedForScreenshot = false;
  private reducedMotion = false;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.engine = createEngine(canvas);
    this.scene.clearColor = BABYLON.Color4.FromHexString('#151713FF');

    // Fog
    this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    this.scene.fogColor = BABYLON.Color3.FromHexString('#151713');
    this.scene.fogStart = 20;
    this.scene.fogEnd = 44;

    // Camera
    this.camera = new BABYLON.ArcRotateCamera(
      'mainCamera',
      -Math.PI / 2,
      1.15,
      14,
      BABYLON.Vector3.Zero(),
      this.scene,
    );
    this.camera.lowerRadiusLimit = 6;
    this.camera.upperRadiusLimit = 22;
    this.camera.lowerBetaLimit = 0.7;
    this.camera.upperBetaLimit = 1.35;
    this.camera.panningSensibility = 0;
    this.cameraRig = new CameraRig(this.camera);

    // The ArcRotateCamera attaches inputs by default; we disable them since
    // the camera follows the player automatically.
    this.camera.inputs.clear();

    const stick = this.getElement('#touch-stick');
    const knob = this.getElement('#touch-knob');
    const dashButton = this.getElement('#dash-button');
    this.input = new InputController(stick, knob, dashButton);

    this.debugTools = new DebugTools(this.tuning, this.scene, () => {
      resizeEngine(this.engine, this.tuning.maxDpr);
    });

    this.createScene();
    this.hud.setTarget(this.pickups.length);
    this.cameraRig.snapTo(this.player.group.position);
    resizeEngine(this.engine, this.tuning.maxDpr);
    this.installTestHooks();
    this.publishDiagnostics();
  }

  start(): void {
    this.engine.runRenderLoop(() => {
      this.loop.tick();
    });
  }

  dispose(): void {
    this.loop.stop();
    this.input.dispose();
    this.audio.dispose();
    this.debugTools.dispose();
    for (const pickup of this.pickups) pickup.dispose();
    this.player.dispose();
    this.scene.dispose();
    this.engine.dispose();
    window.__BABYLON_GAME_DIAGNOSTICS__ = undefined;
    window.__BABYLON_GAME_TEST_HOOKS__ = undefined;
  }

  private update(delta: number, elapsed: number): void {
    this.frame += 1;
    if (this.pausedForScreenshot) {
      this.publishDiagnostics();
      return;
    }
    if (!this.complete) this.elapsed += delta;

    resizeEngine(this.engine, this.tuning.maxDpr);
    const animDelta = this.reducedMotion ? 0 : delta;
    const animElapsed = this.reducedMotion ? 0 : elapsed;
    this.player.update(delta, animElapsed, this.input, this.tuning, ARENA);

    for (const pickup of this.pickups) {
      pickup.update(animDelta, animElapsed);
    }

    const collected = this.collision.collectPickups(this.player.group.position, this.pickups, 0.55);
    for (const pickup of collected) {
      this.score += 1;
      this.audio.pickup(pickup.index);
      this.hud.flashPickup();
    }

    if (this.score >= this.pickups.length) {
      this.complete = true;
    }

    this.cameraRig.update(delta, this.player.group.position, this.tuning.cameraLag);
    this.hud.update(this.score, this.pickups.length, this.elapsed, this.complete);
    this.publishDiagnostics();
  }

  private render(): void {
    this.scene.render();
  }

  private createScene(): void {
    // Hemi light (ambient + ground)
    const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), this.scene);
    hemi.diffuse = BABYLON.Color3.FromHexString('#F6F1DF');
    hemi.groundColor = BABYLON.Color3.FromHexString('#2B322D');
    hemi.intensity = 1.7;

    // Directional sun with shadow
    const sun = new BABYLON.DirectionalLight('sun', new BABYLON.Vector3(-5, 9, 6), this.scene);
    sun.diffuse = BABYLON.Color3.FromHexString('#FFF1BF');
    sun.intensity = 2.6;

    const shadowGen = new BABYLON.ShadowGenerator(2048, sun);
    shadowGen.useBlurExponentialShadowMap = true;
    shadowGen.blurKernel = 32;
    shadowGen.setDarkness(0.4);
    shadowGen.addShadowCaster(this.player.group);

    this.createArena(shadowGen);
    this.createPickups(shadowGen);
  }

  private createArena(shadowGen: BABYLON.ShadowGenerator): void {
    const floorTexture = this.createFloorTexture();

    const floorMaterial = new BABYLON.PBRMaterial('floorMat', this.scene);
    floorMaterial.albedoColor = BABYLON.Color3.FromHexString('#2A2C25');
    floorMaterial.albedoTexture = floorTexture;
    floorMaterial.roughness = 0.72;
    floorMaterial.metallic = 0.02;
    floorMaterial.backFaceCulling = false;

    const floor = BABYLON.MeshBuilder.CreatePlane('floor', {
      width: ARENA.halfWidth * 2,
      height: ARENA.halfDepth * 2,
    }, this.scene);
    floor.rotation.x = -Math.PI / 2;
    floor.material = floorMaterial;
    floor.receiveShadows = true;
    shadowGen.addShadowCaster(floor);

    // Rails
    const railMaterial = new BABYLON.PBRMaterial('railMat', this.scene);
    railMaterial.albedoColor = BABYLON.Color3.FromHexString('#D94F35');
    railMaterial.roughness = 0.52;
    railMaterial.metallic = 0.08;

    const longRail = BABYLON.MeshBuilder.CreateBox('longRail', {
      width: ARENA.halfWidth * 2 + 1, height: 0.55, depth: 0.42,
    }, this.scene);
    longRail.position.set(0, 0.28, -ARENA.halfDepth - 0.24);
    longRail.material = railMaterial;
    shadowGen.addShadowCaster(longRail);

    const longRail2 = BABYLON.MeshBuilder.CreateBox('longRail2', {
      width: ARENA.halfWidth * 2 + 1, height: 0.55, depth: 0.42,
    }, this.scene);
    longRail2.position.set(0, 0.28, ARENA.halfDepth + 0.24);
    longRail2.material = railMaterial;
    shadowGen.addShadowCaster(longRail2);

    const shortRail = BABYLON.MeshBuilder.CreateBox('shortRail', {
      width: 0.42, height: 0.55, depth: ARENA.halfDepth * 2 + 1,
    }, this.scene);
    shortRail.position.set(-ARENA.halfWidth - 0.24, 0.28, 0);
    shortRail.material = railMaterial;
    shadowGen.addShadowCaster(shortRail);

    const shortRail2 = BABYLON.MeshBuilder.CreateBox('shortRail2', {
      width: 0.42, height: 0.55, depth: ARENA.halfDepth * 2 + 1,
    }, this.scene);
    shortRail2.position.set(ARENA.halfWidth + 0.24, 0.28, 0);
    shortRail2.material = railMaterial;
    shadowGen.addShadowCaster(shortRail2);

    // Center marker
    const markerMat = new BABYLON.StandardMaterial('markerMat', this.scene);
    markerMat.diffuseColor = BABYLON.Color3.FromHexString('#F5BA49');
    markerMat.emissiveColor = BABYLON.Color3.FromHexString('#F5BA49');

    const centerMarker = BABYLON.MeshBuilder.CreateTorus('centerMarker', {
      diameter: 1.4, thickness: 0.04, tessellation: 48,
    }, this.scene);
    centerMarker.rotation.x = Math.PI / 2;
    centerMarker.position.y = 0.018;
    centerMarker.material = markerMat;
  }

  private createPickups(shadowGen: BABYLON.ShadowGenerator): void {
    const positions = [
      [-8, -4],
      [-3, -5],
      [3, -4.8],
      [8, -3],
      [-7.5, 3.5],
      [-1.5, 4.7],
      [4.5, 3.8],
      [8.2, 1.4],
    ];

    positions.forEach(([x, z], index) => {
      const pickup = new Pickup(index, new BABYLON.Vector3(x, 0.8, z), this.scene);
      this.pickups.push(pickup);
      shadowGen.addShadowCaster(pickup.group);
    });
  }

  private createFloorTexture(): BABYLON.DynamicTexture {
    const size = 256;
    const texture = new BABYLON.DynamicTexture('floorTex', { width: size, height: size }, this.scene, false);
    const ctx = texture.getContext();

    ctx.fillStyle = '#282a24';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = 'rgba(246, 241, 223, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= size; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(245, 186, 73, 0.24)';
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, size - 16, size - 16);

    texture.update();
    texture.vScale = ARENA.halfWidth / 2;
    texture.uScale = ARENA.halfDepth / 2;
    return texture;
  }

  private installTestHooks(): void {
    window.__BABYLON_GAME_TEST_HOOKS__ = {
      seed: (value: number) => {
        this.rng = createSeededRandom(value);
      },
      setState: (name: string) => {
        if (name === 'active-play') this.resetRun();
        else if (name === 'complete') this.completeRun();
        else console.warn(`Unknown test state: ${name}`);
      },
      setPausedForScreenshot: (paused: boolean) => {
        this.pausedForScreenshot = paused;
      },
      setReducedMotion: (enabled: boolean) => {
        this.reducedMotion = enabled;
      },
      hideDebugUi: (hidden: boolean) => {
        this.debugTools.setHidden(hidden);
      },
    };
  }

  private resetRun(): void {
    this.score = 0;
    this.elapsed = 0;
    this.complete = false;
    this.player.group.position.set(0, this.player.group.position.y, 0);
    this.player.velocity.set(0, 0, 0);
    for (const pickup of this.pickups) {
      pickup.reset();
      pickup.group.rotation.y = this.rng() * Math.PI * 2;
    }
    this.cameraRig.snapTo(this.player.group.position);
    this.hud.setTarget(this.pickups.length);
    this.hud.update(this.score, this.pickups.length, this.elapsed, this.complete);
  }

  private completeRun(): void {
    for (const pickup of this.pickups) {
      if (pickup.active) pickup.collect();
    }
    this.score = this.pickups.length;
    this.complete = true;
    this.hud.update(this.score, this.pickups.length, this.elapsed, this.complete);
  }

  private publishDiagnostics(): void {
    window.__BABYLON_GAME_DIAGNOSTICS__ = {
      frame: this.frame,
      elapsed: this.elapsed,
      score: this.score,
      targetScore: this.pickups.length,
      complete: this.complete,
      player: {
        position: {
          x: this.player.group.position.x,
          y: this.player.group.position.y,
          z: this.player.group.position.z,
        },
        speed: this.player.velocity.length(),
      },
      scene: {
        meshes: this.scene.meshes.length,
        materials: this.scene.materials?.length ?? 0,
        textures: this.scene.textures?.length ?? 0,
        drawCalls: (this.engine as any).drawCalls?.current ?? null,
        fps: this.engine.getFps(),
      },
      canvas: {
        clientWidth: this.canvas.clientWidth,
        clientHeight: this.canvas.clientHeight,
        width: this.canvas.width,
        height: this.canvas.height,
        dpr: Math.min(window.devicePixelRatio || 1, this.tuning.maxDpr),
      },
    };
  }

  private getElement(selector: string): HTMLElement {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) throw new Error(`Missing element: ${selector}`);
    return element;
  }
}
