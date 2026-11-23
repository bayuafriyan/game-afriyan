// Ambient Background Canvas + Celebration Confetti & Sparkle Particle Engine

const COLORS = ['#22d3ee', '#6366f1', '#a855f7', '#ec4899', '#fbbf24', '#10b981', '#f97316'];

class ParticleFX {
  constructor() {
    this.fxCanvas = null;
    this.fxCtx = null;
    this.particles = [];
    this.running = false;
  }

  init() {
    this.initBackground();
    this.fxCanvas = document.getElementById('fx-canvas');
    if (!this.fxCanvas) return;
    this.fxCtx = this.fxCanvas.getContext('2d');
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    if (this.fxCanvas) {
      this.fxCanvas.width = window.innerWidth;
      this.fxCanvas.height = window.innerHeight;
    }
    if (this.bgCanvas) {
      this.bgCanvas.width = window.innerWidth;
      this.bgCanvas.height = window.innerHeight;
    }
  }

  initBackground() {
    this.bgCanvas = document.getElementById('bg-canvas');
    if (!this.bgCanvas) return;
    const ctx = this.bgCanvas.getContext('2d');
    this.bgCanvas.width = window.innerWidth;
    this.bgCanvas.height = window.innerHeight;

    const stars = Array.from({ length: 58 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.2 + 0.7,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.08,
      alpha: Math.random() * 0.6 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const drawBg = () => {
      ctx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.y < -10) {
          s.y = this.bgCanvas.height + 10;
          s.x = Math.random() * this.bgCanvas.width;
        }
        if (s.x < -10) s.x = this.bgCanvas.width + 10;
        if (s.x > this.bgCanvas.width + 10) s.x = -10;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(drawBg);
    };
    requestAnimationFrame(drawBg);
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 28) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 6.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        size: 4 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        decay: 0.018 + Math.random() * 0.015,
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.25,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
    this._startLoop();
  }

  confetti() {
    const w = window.innerWidth;
    for (let i = 0; i < 85; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 4,
        vy: 2.5 + Math.random() * 4.5,
        size: 6 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        decay: 0.006 + Math.random() * 0.006,
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: 'rect',
      });
    }
    this._startLoop();
  }

  _startLoop() {
    if (this.running || !this.fxCtx) return;
    this.running = true;
    const step = () => {
      const ctx = this.fxCtx;
      ctx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.16;
        p.rot += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (this.particles.length > 0) {
        requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);
        this.running = false;
      }
    };
    requestAnimationFrame(step);
  }
}

export const fx = new ParticleFX();
