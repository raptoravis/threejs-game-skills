export class Hud {
  private scoreEl: HTMLElement;
  private progressEl: HTMLElement;
  private timerEl: HTMLElement;
  private completeEl: HTMLElement;
  private flashTimeout = 0;

  constructor() {
    this.scoreEl = this.getElement('#score');
    this.progressEl = this.getElement('#progress');
    this.timerEl = this.getElement('#timer');
    this.completeEl = this.getElement('#complete');
    this.completeEl.style.display = 'none';
  }

  setTarget(total: number): void {
    this.progressEl.textContent = `0 / ${total}`;
  }

  update(score: number, total: number, elapsed: number, complete: boolean): void {
    this.scoreEl.textContent = `${score}`;
    this.progressEl.textContent = `${score} / ${total}`;
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    this.timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    if (complete) {
      this.completeEl.style.display = 'flex';
    }
  }

  flashPickup(): void {
    this.scoreEl.style.transform = 'scale(1.3)';
    this.scoreEl.style.color = '#f5ba49';
    clearTimeout(this.flashTimeout);
    this.flashTimeout = window.setTimeout(() => {
      this.scoreEl.style.transform = 'scale(1)';
      this.scoreEl.style.color = '#fff1e0';
    }, 120);
  }

  private getElement(selector: string): HTMLElement {
    const el = document.querySelector<HTMLElement>(selector);
    if (!el) throw new Error(`Missing element: ${selector}`);
    return el;
  }
}
