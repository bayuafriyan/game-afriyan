// CerdasPlay Music Studio — Built-in Recommended BGM Synthesizer + Custom Audio Upload/URL Player

export const RECOMMENDED_TRACKS = [
  {
    id: 'sd_playful',
    title: 'Petualangan Ceria',
    badge: 'Rekomendasi SD',
    desc: 'Melodi marimba & lonceng riang untuk belajar santai.',
    bpm: 118,
    wave: 'triangle',
    padWave: 'sine',
    // C major pentatonic playful loop (Hz)
    melody: [523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 1046.5, 880.0, 783.99, 659.25],
    bass: [261.63, 0, 261.63, 0, 220.0, 0, 220.0, 0, 174.61, 0, 196.0, 0, 261.63, 0, 196.0, 0],
  },
  {
    id: 'smp_lofi',
    title: 'Cyber-Lab Lo-Fi',
    badge: 'Rekomendasi SMP',
    desc: 'Beat synth santai ala ruang eksperimen modern.',
    bpm: 92,
    wave: 'sine',
    padWave: 'triangle',
    melody: [440.0, 523.25, 659.25, 587.33, 493.88, 587.33, 739.99, 659.25, 392.0, 493.88, 587.33, 523.25, 440.0, 523.25, 659.25, 783.99],
    bass: [174.61, 0, 0, 174.61, 164.81, 0, 0, 164.81, 146.83, 0, 0, 146.83, 130.81, 0, 196.0, 0],
  },
  {
    id: 'sma_focus',
    title: 'Fokus TKA & Ujian',
    badge: 'Rekomendasi SMA',
    desc: 'Ambient tenang untuk konsentrasi tinggi saat latihan ujian.',
    bpm: 74,
    wave: 'sine',
    padWave: 'sine',
    melody: [329.63, 392.0, 493.88, 392.0, 293.66, 392.0, 440.0, 392.0, 261.63, 329.63, 392.0, 329.63, 246.94, 329.63, 392.0, 493.88],
    bass: [130.81, 0, 0, 0, 146.83, 0, 0, 0, 110.0, 0, 0, 0, 123.47, 0, 0, 0],
  },
  {
    id: 'arcade_boost',
    title: 'Arcade Semangat',
    badge: 'Semua Jenjang • Aksi',
    desc: 'Irama chiptune enerjik untuk Meteor Hitung & Cepat Tepat!',
    bpm: 136,
    wave: 'square',
    padWave: 'triangle',
    melody: [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 659.25, 523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 783.99],
    bass: [130.81, 196.0, 130.81, 196.0, 146.83, 220.0, 146.83, 220.0, 174.61, 261.63, 174.61, 261.63, 196.0, 293.66, 196.0, 246.94],
  },
];

class MusicPlayer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.mode = 'recommended'; // 'recommended' | 'custom'
    this.trackId = localStorage.getItem('cerdasplay_bgm_track') || 'sd_playful';
    this.volume = Number(localStorage.getItem('cerdasplay_bgm_vol') ?? 0.35);
    this.stepIdx = 0;
    this.intervalId = null;

    this.customAudio = new Audio();
    this.customAudio.loop = true;
    this.customAudio.volume = this.volume;
    this.customName = '';
    this.customUrl = null;
    this.listeners = new Set();
  }

  onChange(fn) {
    this.listeners.add(fn);
  }

  _notify() {
    this.listeners.forEach((fn) => fn(this.getState()));
  }

  getState() {
    const rec = RECOMMENDED_TRACKS.find((t) => t.id === this.trackId);
    return {
      isPlaying: this.isPlaying,
      mode: this.mode,
      trackId: this.trackId,
      volume: this.volume,
      customName: this.customName,
      currentTitle: this.mode === 'custom' ? (this.customName || 'Musik Custom') : (rec?.title || 'BGM'),
    };
  }

  _ensureCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, Number(v)));
    localStorage.setItem('cerdasplay_bgm_vol', String(this.volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.customAudio.volume = this.volume;
    this._notify();
  }

  selectRecommended(trackId, autoPlay = true) {
    this.stop();
    this.mode = 'recommended';
    this.trackId = trackId;
    localStorage.setItem('cerdasplay_bgm_track', trackId);
    if (autoPlay) this.play();
    else this._notify();
  }

  recommendForGrade(grade) {
    const map = { SD: 'sd_playful', SMP: 'smp_lofi', SMA: 'sma_focus' };
    const nextId = map[grade] || 'sd_playful';
    if (this.mode === 'recommended' && this.trackId !== nextId) {
      const wasPlaying = this.isPlaying;
      this.selectRecommended(nextId, wasPlaying);
    }
  }

  loadCustomFile(file) {
    if (!file) return;
    if (this.customUrl && this.customUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.customUrl);
    }
    this.stop();
    this.customUrl = URL.createObjectURL(file);
    this.customName = file.name.replace(/\.[^/.]+$/, '');
    this.customAudio.src = this.customUrl;
    this.customAudio.volume = this.volume;
    this.mode = 'custom';
    this.play();
  }

  loadCustomUrl(url, label = 'Musik URL Custom') {
    if (!url) return;
    this.stop();
    this.customUrl = url;
    this.customName = label;
    this.customAudio.src = url;
    this.customAudio.volume = this.volume;
    this.mode = 'custom';
    this.play();
  }

  play() {
    if (this.isPlaying) return;
    if (this.mode === 'custom' && this.customAudio.src) {
      this.customAudio.volume = this.volume;
      this.customAudio.play().then(() => {
        this.isPlaying = true;
        this._notify();
      }).catch(() => {
        this.isPlaying = false;
        this._notify();
      });
      return;
    }

    const ctx = this._ensureCtx();
    if (!ctx) return;
    const track = RECOMMENDED_TRACKS.find((t) => t.id === this.trackId) || RECOMMENDED_TRACKS[0];
    const stepMs = Math.round((60 / track.bpm / 2) * 1000);
    this.isPlaying = true;
    this.stepIdx = 0;

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const mFreq = track.melody[this.stepIdx % track.melody.length];
      const bFreq = track.bass[this.stepIdx % track.bass.length];
      const dur = stepMs / 1000;

      if (mFreq > 0) {
        this._playSynthNote(mFreq, dur * 0.9, track.wave, track.wave === 'square' ? 0.08 : 0.16, now);
      }
      if (bFreq > 0) {
        this._playSynthNote(bFreq, dur * 1.4, track.padWave, 0.14, now);
      }
      this.stepIdx++;
    };

    tick();
    this.intervalId = setInterval(tick, stepMs);
    this._notify();
  }

  _playSynthNote(freq, duration, wave, peakGain, startTime) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.03);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.customAudio.pause();
    this.isPlaying = false;
    this._notify();
  }

  toggle() {
    if (this.isPlaying) this.stop();
    else this.play();
  }
}

export const bgm = new MusicPlayer();
