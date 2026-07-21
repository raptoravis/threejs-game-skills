export class Loop {
  private running = false;
  private lastTime = 0;
  private rafId = 0;
  private elapsed = 0;

  constructor(
    private readonly onUpdate: (delta: number, elapsed: number) => void,
    private readonly onRender: () => void,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.elapsed = 0;
    this.rafId = requestAnimationFrame((t) => this.frame(t));
  }

  stop(): void {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  tick(): void {
    const now = performance.now();
    if (!this.running) return;
    const raw = (now - this.lastTime) / 1000;
    const delta = Math.min(raw, 0.1); // clamp for tab sleep
    this.lastTime = now;
    this.elapsed += delta;
    this.onUpdate(delta, this.elapsed);
    this.onRender();
  }

  private frame(time: number): void {
    if (!this.running) return;
    const raw = (time - this.lastTime) / 1000;
    const delta = Math.min(raw, 0.1);
    this.lastTime = time;
    this.elapsed += delta;
    this.onUpdate(delta, this.elapsed);
    this.onRender();
    this.rafId = requestAnimationFrame((t) => this.frame(t));
  }
}
