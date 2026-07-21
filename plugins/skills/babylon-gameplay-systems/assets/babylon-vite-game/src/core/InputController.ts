import { createSeededRandom } from '../utils/random';

export class InputController {
  private keys: Record<string, boolean> = {};
  private stickActive = false;
  private stickX = 0;
  private stickY = 0;
  private dashPressed = false;
  private dashJustPressed = false;
  private readonly random = createSeededRandom(42);

  constructor(
    private readonly stick: HTMLElement,
    private readonly knob: HTMLElement,
    private readonly dashButton: HTMLElement,
  ) {
    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
    this.setupTouch();
  }

  get moveX(): number {
    if (this.stickActive) return this.stickX;
    let x = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) x -= 1;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) x += 1;
    return x;
  }

  get moveY(): number {
    if (this.stickActive) return this.stickY;
    let y = 0;
    if (this.keys['ArrowUp'] || this.keys['KeyW']) y -= 1;
    if (this.keys['ArrowDown'] || this.keys['KeyS']) y += 1;
    return y;
  }

  get dash(): boolean {
    if (this.dashJustPressed) {
      this.dashJustPressed = false;
      return true;
    }
    return false;
  }

  get anyInput(): boolean {
    return this.moveX !== 0 || this.moveY !== 0 || this.keys['Space'] || this.dash;
  }

  dispose(): void {
    // Cleanup handled by pointer event removal
  }

  private onKey(e: KeyboardEvent, down: boolean): void {
    this.keys[e.code] = down;
    if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      if (down) this.dashJustPressed = true;
      e.preventDefault();
    }
  }

  private setupTouch(): void {
    let stickId: number | null = null;
    const rect = this.stick.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxDist = rect.width / 2;

    this.stick.addEventListener('pointerdown', (e) => {
      stickId = e.pointerId;
      this.stickActive = true;
      this.stick.setPointerCapture(e.pointerId);
    });

    this.stick.addEventListener('pointermove', (e) => {
      if (e.pointerId !== stickId) return;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clamped = Math.min(dist, maxDist);
      const nx = dist > 0 ? dx / dist : 0;
      const ny = dist > 0 ? dy / dist : 0;
      this.stickX = (nx * clamped) / maxDist;
      this.stickY = (ny * clamped) / maxDist;
      this.knob.style.transform = `translate(${nx * clamped}px, ${ny * clamped}px)`;
    });

    const resetStick = () => {
      stickId = null;
      this.stickActive = false;
      this.stickX = 0;
      this.stickY = 0;
      this.knob.style.transform = 'translate(0, 0)';
    };

    this.stick.addEventListener('pointerup', resetStick);
    this.stick.addEventListener('pointercancel', resetStick);

    this.dashButton.addEventListener('pointerdown', () => {
      this.dashJustPressed = true;
    });
  }
}
