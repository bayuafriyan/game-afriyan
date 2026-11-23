// Grade-Adaptive Ambient Background Canvas + Celebration Confetti & Sparkle Particle Engine

const GRADE_PALETTES = {
  SD: ['#fde047', '#38bdf8', '#34d399', '#fb923c', '#f472b6', '#ffffff'],
  SMP: ['#22d3ee', '#818cf8', '#a855f7', '#38bdf8', '#2dd4bf'],
  SMA: ['#fbbf24', '#f472b6', '#fb923c', '#c084fc', '#e2e8f0'],
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
    const count = this.grade === 'SD' ? 38 : this.grade === 'SMP' ? 46 : 56;

    this.nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: this.grade === 'SD' ? 4 + Math.random() * 8 : this.grade === 'SMP' ? 3 + Math.random() * 6 : 1.5 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * (this.grade === 'SMA' ? 0.35 : 0.45),
      vy: this.grade === 'SD' ? -(0.2 + Math.random() * 0.45) : (Math.random() - 0.5) * 0.4,
      alpha: 0.22 + Math.random() * 0.45,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.02,
      color: palette[Math.floor(Math.random() * palette.length)],
      kind: Math.random() > 0.5 ? 'star' : 'bubble',
    }));
  }

  _drawStar(ctx, x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawHex(ctx, x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
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

        if (n.y < -20) { n.y = h + 20; n.x = Math.random() * w; }
        if (n.y > h + 20) n.y = -20;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;

        ctx.globalAlpha = n.alpha;
        ctx.fillStyle = n.color;
        ctx.strokeStyle = n.color;

        if (this.grade === 'SD') {
          // Playful floating stars & soft bubbles
          if (n.kind === 'star') {
            this._drawStar(ctx, n.x, n.y, n.r, n.rot);
          } else {
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * 0.9, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (this.grade === 'SMP') {
          // Cyber-Lab glowing hexagons & dots
          ctx.lineWidth = 1.4;
          this._drawHex(ctx, n.x, n.y, n.r * 1.4, n.rot);
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // SMA Aurora constellation dots
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // SMA Constellation lines
      if (this.grade === 'SMA') {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < this.nodes.length; i++) {
          for (let j = i + 1; j < this.nodes.length; j++) {
            const dx = this.nodes[i].x - this.nodes[j].x;
            const dy = this.nodes[i].y - this.nodes[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 130) {
              ctx.globalAlpha = (1 - dist / 130) * 0.18;
              ctx.strokeStyle = '#f472b6';
              ctx.beginPath();
              ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
              ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
              ctx.stroke();
            }
          }
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
        size: 4 + Math.random() * 5,
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
        size: 6 + Math.random() * 6,
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
