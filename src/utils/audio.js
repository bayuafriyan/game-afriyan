// Web Audio API Synthesized Sound Effects Engine (zero external audio files needed)

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('cerdasplay_sound') !== 'off';
  }

  _ensureCtx() {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('cerdasplay_sound', this.enabled ? 'on' : 'off');
    if (this.enabled) this.click();
    return this.enabled;
  }

  _tone(freq, duration = 0.14, type = 'sine', volume = 0.14, delay = 0, slideTo = null) {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  click() {
    this._tone(540, 0.06, 'triangle', 0.09, 0, 720);
  }

  flip() {
    this._tone(360, 0.08, 'sine', 0.08, 0, 560);
  }

  correct(combo = 1) {
    const boost = Math.min(combo - 1, 8) * 35;
    this._tone(523 + boost, 0.12, 'triangle', 0.15, 0);
    this._tone(659 + boost, 0.14, 'triangle', 0.15, 0.07);
    this._tone(784 + boost, 0.2, 'sine', 0.14, 0.14);
  }

  wrong() {
    this._tone(220, 0.16, 'sawtooth', 0.11, 0, 140);
    this._tone(165, 0.22, 'sawtooth', 0.1, 0.1, 110);
  }

  laser() {
    this._tone(960, 0.13, 'sawtooth', 0.09, 0, 220);
  }

  boom() {
    this._tone(140, 0.25, 'square', 0.12, 0, 42);
  }

  fanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this._tone(n, 0.24, 'triangle', 0.15, idx * 0.1);
    });
  }

  levelUp() {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((n, idx) => {
      this._tone(n, 0.25, 'sine', 0.16, idx * 0.085);
    });
  }
}

export const sfx = new SoundEngine();
