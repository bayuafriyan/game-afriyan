// Grade-Adaptive Bright Game World Background Canvas + Celebration Confetti Particle Engine

const GRADE_PALETTES = {
  SD: ['#facc15', '#38bdf8', '#22c55e', '#fb923c', '#f472b6', '#ffffff'],
  SMP: ['#4f46e5', '#06b6d4', '#10b981', '#8b5cf6', '#f59e0b'],
  SMA: ['#ea580c', '#0f172a', '#eab308', '#3b82f6', '#10b981'],
};

class ParticleFX {
  constructor() {
    this.bgCanvas = null;
    this.bgCtx = null;
    this.fxCanvas = null;
    this.fxCtx = null;
    this.particles = [];
    this.running = false;
    this.grade = 'SD';
    this.nodes = [];
  }

  init(initialGrade = 'SD') {
    this.grade = initialGrade;
    this.bgCanvas = document.getElementById('bg-canvas');
    this.fxCanvas = document.getElementById('fx-canvas');
    if (this.bgCanvas) this.bgCtx = this.bgCanvas.getContext('2d');
    if (this.fxCanvas) this.fxCtx = this.fxCanvas.getContext('2d');
    this._resize();
    this._seedBgNodes();
    this._startBgLoop();
    window.addEventListener('resize', () => {
      this._resize();
      this._seedBgNodes();
    });
  }

  setGrade(grade) {
    this.grade = grade;
    this._seedBgNodes();
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

  _seedBgNodes() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const palette = GRADE_PALETTES[this.grade] || GRADE_PALETTES.SD;
    const count = this.grade === 'SD' ? 14 : this.grade === 'SMP' ? 24 : 22;

    this.nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: this.grade === 'SD' ? 24 + Math.random() * 26 : 10 + Math.random() * 14,
      vx: this.grade === 'SD' ? 0.18 + Math.random() * 0.25 : (Math.random() - 0.5) * 0.3,
      vy: this.grade === 'SD' ? (Math.random() - 0.5) * 0.06 : -0.15 - Math.random() * 0.2,
      alpha: this.grade === 'SD' ? 0.35 + Math.random() * 0.3 : 0.1 + Math.random() * 0.12,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.012,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));
  }

  _drawCloud(ctx, x, y, s) {
    ctx.beginPath();
    ctx.arc(x, y, s * 0.55, 0, Math.PI * 2);
    ctx.arc(x + s * 0.48, y - s * 0.15, s * 0.48, 0, Math.PI * 2);
    ctx.arc(x + s * 0.95, y, s * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawShape(ctx, x, y, r, rot, sides) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (i * Math.PI * 2) / sides;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  _startBgLoop() {
    if (!this.bgCtx) return;
    const draw = () => {
      const ctx = this.bgCtx;
      const w = this.bgCanvas.width;
      const h = this.bgCanvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const n of this.nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.rot += n.vRot;

        if (n.x > w + 80) n.x = -80;
        if (n.x < -80) n.x = w + 80;
        if (n.y < -50) { n.y = h + 50; n.x = Math.random() * w; }
        if (n.y > h + 50) n.y = -50;

        ctx.globalAlpha = n.alpha;
        if (this.grade === 'SD') {
          ctx.fillStyle = '#ffffff';
          this._drawCloud(ctx, n.x, n.y, n.r);
        } else if (this.grade === 'SMP') {
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 2.2;
          this._drawShape(ctx, n.x, n.y, n.r, n.rot, 6);
        } else {
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 2;
          this._drawShape(ctx, n.x, n.y, n.r, n.rot, 4);
        }
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 28) {
    const palette = GRADE_PALETTES[this.grade] || GRADE_PALETTES.SD;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 3 + Math.random() * 6.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.2,
        size: 5 + Math.random() * 5,
        color: palette[Math.floor(Math.random() * palette.length)],
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
    const palette = GRADE_PALETTES[this.grade] || GRADE_PALETTES.SD;
    for (let i = 0; i < 85; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 120,
        vx: (Math.random() - 0.5) * 4,
        vy: 2.5 + Math.random() * 4.5,
        size: 7 + Math.random() * 6,
        color: palette[Math.floor(Math.random() * palette.length)],
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
