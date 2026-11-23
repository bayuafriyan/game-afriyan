// Game 2: Meteor Hitung (Canvas 2D Math Defense Arcade)
import { sfx } from '../utils/audio.js';
import { fx } from '../utils/particles.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(grade, wave) {
  if (grade === 'SD') {
    const ops = wave >= 2 ? ['+', '-', '×', '÷'] : ['+', '-', '×'];
    const op = ops[randInt(0, ops.length - 1)];
    if (op === '+') {
      const a = randInt(4, 20 + wave * 6);
      const b = randInt(3, 18 + wave * 5);
      return { text: `${a} + ${b}`, answer: a + b };
    }
    if (op === '-') {
      const a = randInt(12, 35 + wave * 6);
      const b = randInt(3, a - 1);
      return { text: `${a} - ${b}`, answer: a - b };
    }
    if (op === '×') {
      const a = randInt(2, 9 + Math.min(wave, 3));
      const b = randInt(2, 9);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    const b = randInt(2, 9);
    const ans = randInt(2, 10);
    return { text: `${b * ans} ÷ ${b}`, answer: ans };
  }

  if (grade === 'SMP') {
    const type = randInt(1, 4);
    if (type === 1) {
      const a = randInt(-9, 12);
      const b = randInt(2, 9);
      return { text: `${a} + (${b}×2)`, answer: a + b * 2 };
    }
    if (type === 2) {
      const n = randInt(3, 13);
      return { text: `${n}²`, answer: n * n };
    }
    if (type === 3) {
      const r = randInt(3, 12);
      return { text: `√${r * r}`, answer: r };
    }
    const x = randInt(2, 10);
    const a = randInt(2, 5);
    const c = randInt(1, 10);
    return { text: `${a}x + ${c} = ${a * x + c}, x=?`, answer: x };
  }

  // SMA
  const type = randInt(1, 4);
  if (type === 1) {
    const exp = randInt(2, 5);
    return { text: `²log ${Math.pow(2, exp)}`, answer: exp };
  }
  if (type === 2) {
    const a = randInt(2, 6);
    const x = randInt(2, 5);
    return { text: `d/dx(${a}x²) di x=${x}`, answer: 2 * a * x };
  }
  if (type === 3) {
    const n = randInt(2, 5);
    const b = randInt(2, 3);
    return { text: `${b}^${n}`, answer: Math.pow(b, n) };
  }
  const a = randInt(2, 6);
  const b = randInt(1, 5);
  const c = randInt(1, 4);
  const d = randInt(2, 6);
  return { text: `det[${a},${b}; ${c},${d}]`, answer: a * d - b * c };
}

export function mountMeteorMath(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  let rafId = null;
  let running = true;
  let score = 0;
  let destroyed = 0;
  let streak = 0;
  let maxStreak = 0;
  let lives = 4;
  let wave = 1;
  let meteors = [];
  let lasers = [];
  let sparks = [];
  let lastSpawn = 0;
  let spawnInterval = grade === 'SD' ? 2700 : grade === 'SMP' ? 2450 : 2300;

  container.innerHTML = `
    <div class="game-shell">
      <div class="game-hud">
        <div class="hud-group">
          <button id="mt-back" class="btn btn-secondary btn-sm">← Kembali</button>
          <span class="hud-pill">🚀 Gelombang <span id="mt-wave">1</span></span>
        </div>
        <div class="hud-group">
          <span class="hud-pill score">⭐ <span id="mt-score">0</span></span>
          <span class="hud-pill streak">🔥 <span id="mt-streak">0x</span></span>
          <span class="hud-pill lives" id="mt-lives">❤️❤️❤️❤️</span>
        </div>
      </div>

      <div class="game-stage meteor-layout">
        <div class="meteor-canvas-wrap">
          <canvas id="meteor-canvas"></canvas>
        </div>

        <div class="meteor-controls">
          <form id="mt-form" class="meteor-input-group">
            <input id="mt-input" class="text-input" type="number" inputmode="numeric" placeholder="Ketik jawaban meteor lalu Enter..." autocomplete="off" />
            <button type="submit" class="btn btn-primary">Tembak Laser ⚡</button>
          </form>
          <div id="mt-quick-choices" class="meteor-choices"></div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#meteor-canvas');
  const g = canvas.getContext('2d');
  const inputEl = container.querySelector('#mt-input');
  const quickChoicesEl = container.querySelector('#mt-quick-choices');

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(rect.width));
    canvas.height = Math.max(300, Math.floor(rect.height));
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function spawnMeteor() {
    const prob = generateProblem(grade, wave);
    const pad = 76;
    const x = randInt(pad, Math.max(pad + 10, canvas.width - pad));
    const speed = (0.42 + wave * 0.08 + Math.random() * 0.2) * (grade === 'SD' ? 0.9 : 1);
    meteors.push({
      id: Math.random().toString(36).slice(2),
      x,
      y: -28,
      r: 36,
      speed,
      text: prob.text,
      answer: prob.answer,
      hue: randInt(15, 45),
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.03,
    });
    updateQuickChoices();
  }

  function updateQuickChoices() {
    if (!quickChoicesEl) return;
    if (meteors.length === 0) {
      quickChoicesEl.innerHTML = '';
      return;
    }
    // Lowest (most urgent) meteor + 3 distractors
    const urgent = [...meteors].sort((a, b) => b.y - a.y)[0];
    const set = new Set([urgent.answer]);
    while (set.size < 4) {
      const delta = randInt(-8, 8);
      if (delta !== 0) set.add(urgent.answer + delta);
    }
    const opts = [...set].sort(() => Math.random() - 0.5);
    quickChoicesEl.innerHTML = opts
      .map((val) => `<button type="button" class="meteor-choice-btn" data-val="${val}">${val}</button>`)
      .join('');

    quickChoicesEl.querySelectorAll('.meteor-choice-btn').forEach((b) => {
      b.addEventListener('click', () => fireAnswer(Number(b.dataset.val)));
    });
  }

  function updateHud() {
    const s = container.querySelector('#mt-score');
    const st = container.querySelector('#mt-streak');
    const lv = container.querySelector('#mt-lives');
    const wv = container.querySelector('#mt-wave');
    if (s) s.textContent = score;
    if (st) st.textContent = `${streak}x`;
    if (lv) lv.textContent = '❤️'.repeat(Math.max(0, lives)) || '💥';
    if (wv) wv.textContent = wave;
  }

  function fireAnswer(val) {
    if (!running || Number.isNaN(val)) return;
    // Match lowest meteor with this answer
    const candidates = meteors.filter((m) => m.answer === val).sort((a, b) => b.y - a.y);
    if (candidates.length > 0) {
      const target = candidates[0];
      sfx.laser();
      lasers.push({
        x1: canvas.width / 2,
        y1: canvas.height - 26,
        x2: target.x,
        y2: target.y,
        life: 1,
      });
      for (let i = 0; i < 18; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 4.5;
        sparks.push({
          x: target.x,
          y: target.y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          life: 1,
          color: i % 2 === 0 ? '#22d3ee' : '#fbbf24',
        });
      }
      meteors = meteors.filter((m) => m.id !== target.id);
      destroyed++;
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      score += 20 + Math.min(streak, 6) * 5;
      wave = 1 + Math.floor(destroyed / 6);
      spawnInterval = Math.max(1250, 2600 - wave * 180);
      sfx.correct(streak);
      updateHud();
      updateQuickChoices();
    } else {
      streak = 0;
      sfx.wrong();
      updateHud();
    }
  }

  function endGame() {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resizeCanvas);
    const xpEarned = Math.max(25, Math.round(score * 0.45) + destroyed * 8);
    const meta = onFinish({
      gameId: 'meteor',
      grade,
      score,
      correctCount: destroyed,
      maxStreak,
      xpEarned,
    });
    sfx.fanfare();
    if (score >= 120) fx.confetti();

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-stage result-screen">
          <div class="result-trophy">${score >= 180 ? '🚀' : score >= 80 ? '☄️' : '🛡️'}</div>
          <h2>${meta.isNewBest ? 'Rekor Galaksi Baru!' : 'Perisai Planet Selesai!'}</h2>
          <p class="result-subtitle">Meteor Hitung • Jenjang ${grade} • Gelombang ${wave}</p>
          <div class="result-stats">
            <div class="result-stat-box"><strong>${score}</strong><span>Skor Akhir</span></div>
            <div class="result-stat-box"><strong>${destroyed}</strong><span>Meteor Hancur</span></div>
            <div class="result-stat-box"><strong>${maxStreak}x</strong><span>Combo Terbaik</span></div>
            <div class="result-stat-box"><strong>+${xpEarned} XP</strong><span>XP Diperoleh</span></div>
          </div>
          <div class="result-actions">
            <button id="btn-replay" class="btn btn-primary">Main Lagi 🔄</button>
            <button id="btn-home" class="btn btn-secondary">Pilih Game Lain 🏠</button>
          </div>
        </div>
      </div>
    `;
    container.querySelector('#btn-replay').addEventListener('click', () => {
      sfx.click();
      mountMeteorMath(container, ctx);
    });
    container.querySelector('#btn-home').addEventListener('click', () => {
      sfx.click();
      onBack();
    });
  }

  function loop(ts) {
    if (!running) return;
    if (ts - lastSpawn > spawnInterval && meteors.length < 4) {
      spawnMeteor();
      lastSpawn = ts;
    }

    g.clearRect(0, 0, canvas.width, canvas.height);

    // Draw planetary shield arc
    const shieldY = canvas.height - 26;
    const grad = g.createLinearGradient(0, shieldY - 12, 0, canvas.height);
    grad.addColorStop(0, 'rgba(34, 211, 238, 0.55)');
    grad.addColorStop(1, 'rgba(99, 102, 241, 0.1)');
    g.fillStyle = grad;
    g.fillRect(0, shieldY, canvas.width, 26);

    // Draw laser turret
    g.beginPath();
    g.arc(canvas.width / 2, shieldY, 18, Math.PI, 0);
    g.fillStyle = '#22d3ee';
    g.fill();
    g.strokeStyle = '#fff';
    g.lineWidth = 2;
    g.stroke();

    // Update & draw meteors
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.y += m.speed;
      m.rot += m.vRot;

      if (m.y + m.r >= shieldY) {
        meteors.splice(i, 1);
        lives--;
        streak = 0;
        sfx.boom();
        updateHud();
        updateQuickChoices();
        if (lives <= 0) {
          endGame();
          return;
        }
        continue;
      }

      // Glow trail
      g.save();
      g.translate(m.x, m.y);
      const trail = g.createLinearGradient(0, -m.r * 2.1, 0, m.r);
      trail.addColorStop(0, 'rgba(249, 115, 22, 0)');
      trail.addColorStop(1, 'rgba(249, 115, 22, 0.5)');
      g.fillStyle = trail;
      g.beginPath();
      g.moveTo(-m.r * 0.7, 0);
      g.lineTo(0, -m.r * 2.1);
      g.lineTo(m.r * 0.7, 0);
      g.fill();

      // Meteor rock
      g.beginPath();
      g.arc(0, 0, m.r, 0, Math.PI * 2);
      const rockGrad = g.createRadialGradient(-8, -8, 4, 0, 0, m.r);
      rockGrad.addColorStop(0, '#4f46e5');
      rockGrad.addColorStop(1, '#1e1b4b');
      g.fillStyle = rockGrad;
      g.fill();
      g.lineWidth = 2.5;
      g.strokeStyle = m.y > shieldY - 110 ? '#f43f5e' : '#38bdf8';
      g.stroke();

      // Math text
      g.fillStyle = '#ffffff';
      g.font = `700 ${m.text.length > 10 ? 12 : 15}px "Fredoka", sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(m.text, 0, 1);
      g.restore();
    }

    // Lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      g.save();
      g.strokeStyle = `rgba(34, 211, 238, ${l.life})`;
      g.lineWidth = 5 * l.life;
      g.beginPath();
      g.moveTo(l.x1, l.y1);
      g.lineTo(l.x2, l.y2);
      g.stroke();
      g.restore();
      l.life -= 0.08;
      if (l.life <= 0) lasers.splice(i, 1);
    }

    // Sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const sp = sparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.life -= 0.04;
      if (sp.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      g.globalAlpha = sp.life;
      g.fillStyle = sp.color;
      g.beginPath();
      g.arc(sp.x, sp.y, 3.5, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
    }

    rafId = requestAnimationFrame(loop);
  }

  container.querySelector('#mt-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = inputEl.value.trim();
    if (raw !== '') {
      fireAnswer(Number(raw));
      inputEl.value = '';
    }
    inputEl.focus();
  });

  container.querySelector('#mt-back').addEventListener('click', () => {
    sfx.click();
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resizeCanvas);
    onBack();
  });

  spawnMeteor();
  lastSpawn = performance.now();
  rafId = requestAnimationFrame(loop);
  setTimeout(() => inputEl?.focus(), 100);

  return () => {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resizeCanvas);
  };
}
