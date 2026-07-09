export class AudioSystem {
  private ctx: AudioContext | null = null;

  constructor(_scene: Phaser.Scene) {
    try {
      this.ctx = new AudioContext();
    } catch {
      this.ctx = null;
    }
  }

  pickup(_index: number): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.15);
  }

  dispose(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
