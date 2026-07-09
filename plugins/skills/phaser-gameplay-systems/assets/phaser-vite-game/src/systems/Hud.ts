export class Hud {
  private scoreEl: HTMLElement;
  private targetEl: HTMLElement;
  private timerEl: HTMLElement;
  private completeEl: HTMLElement;
  private flashTimer = 0;

  constructor(_scene: Phaser.Scene) {
    this.scoreEl = this.createEl('hud-score', '0', 'top: 16px; left: 16px;');
    this.targetEl = this.createEl('hud-target', '/ 0', 'top: 16px; left: 56px; color: #f5ba49;');
    this.timerEl = this.createEl('hud-timer', '0.0s', 'top: 16px; right: 16px;');
    this.completeEl = this.createEl('hud-complete', '', 'bottom: 80px; left: 50%; transform: translateX(-50%); font-size: 24px; color: #f5ba49; display: none;');
  }

  setTarget(count: number): void {
    this.targetEl.textContent = `/ ${count}`;
  }

  update(score: number, target: number, elapsed: number, complete: boolean): void {
    this.scoreEl.textContent = String(score);

    if (this.flashTimer > 0) {
      this.scoreEl.style.color = '#f5ba49';
      this.flashTimer -= 16;
    } else {
      this.scoreEl.style.color = '#fff';
    }

    this.timerEl.textContent = `${(elapsed / 1000).toFixed(1)}s`;

    if (complete && score >= target) {
      this.completeEl.textContent = 'COMPLETE!';
      this.completeEl.style.display = 'block';
    }
  }

  flashPickup(): void {
    this.flashTimer = 200;
  }

  dispose(): void {
    for (const el of [this.scoreEl, this.targetEl, this.timerEl, this.completeEl]) {
      el.remove();
    }
  }

  private createEl(id: string, text: string, style: string): HTMLElement {
    const existing = document.getElementById(id);
    if (existing) return existing;

    const el = document.createElement('div');
    el.id = id;
    el.textContent = text;
    el.style.cssText = `position: fixed; z-index: 100; font-family: monospace; font-size: 18px; color: #f6f1df; pointer-events: none; user-select: none; ${style}`;
    document.body.appendChild(el);
    return el;
  }
}
