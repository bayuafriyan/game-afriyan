// Game 6: Rantai Ilmu (Category Sorter Arcade)
import { CATEGORY_SORT_PACKS } from '../data/wordData.js';
import { sfx } from '../utils/audio.js';
import { fx } from '../utils/particles.js';

function shuffle(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

export function mountCategorySort(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  const packs = CATEGORY_SORT_PACKS[grade] || CATEGORY_SORT_PACKS.SD;
  let packIdx = 0;
  let queue = [];
  let idx = 0;
  let score = 0;
  let correctCount = 0;
  let streak = 0;
  let maxStreak = 0;
  let lives = 3;
  let feedback = null;

  function startPack(pIdx = 0) {
    packIdx = pIdx;
    const pack = packs[packIdx];
    queue = shuffle(pack.items);
    idx = 0;
    score = 0;
    correctCount = 0;
    streak = 0;
    maxStreak = 0;
    lives = 3;
    feedback = null;
    render();
  }

  function pickBin(binId, btnEl) {
    if (idx >= queue.length) return;
    const current = queue[idx];
    const pack = packs[packIdx];

    if (current.bin === binId) {
      correctCount++;
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      score += 25 + streak * 6;
      feedback = { ok: true, text: `✨ Benar! ${current.text} (${current.note})` };
      sfx.correct(streak);
      if (btnEl) {
        const rect = btnEl.getBoundingClientRect();
        fx.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
      }
    } else {
      streak = 0;
      lives--;
      const rightBin = pack.bins.find((b) => b.id === current.bin);
      feedback = { ok: false, text: `💡 ${current.text} seharusnya masuk ke "${rightBin.label}" (${current.note}).` };
      sfx.wrong();
    }

    idx++;
    if (idx >= queue.length || lives <= 0) {
      finishGame();
    } else {
      render();
    }
  }

  function finishGame() {
    const xpEarned = Math.max(25, Math.round(score * 0.45) + correctCount * 8);
    const meta = onFinish({
      gameId: 'sort',
      grade,
      score,
      correctCount,
      maxStreak,
      xpEarned,
    });
    sfx.fanfare();
    if (correctCount >= Math.ceil(queue.length * 0.65)) fx.confetti();

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-stage result-screen">
          <div class="result-trophy">🔗</div>
          <h2>${meta.isNewBest ? 'Rekor Sortir Ilmu Baru!' : 'Klasifikasi Selesai!'}</h2>
          <p class="result-subtitle">Rantai Ilmu • ${packs[packIdx].title}</p>
          <div class="result-stats">
            <div class="result-stat-box"><strong>${score}</strong><span>Skor Akhir</span></div>
            <div class="result-stat-box"><strong>${correctCount}/${queue.length}</strong><span>Kartu Tepat</span></div>
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
      startPack(packIdx);
    });
    container.querySelector('#btn-home').addEventListener('click', () => {
      sfx.click();
      onBack();
    });
  }

  function render() {
    const pack = packs[packIdx];
    const current = queue[idx];

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <div class="hud-group">
            <button id="cs-back" class="btn btn-secondary btn-sm">← Kembali</button>
            <span class="hud-pill">🔗 Kartu ${idx + 1}/${queue.length}</span>
          </div>
          <div class="hud-group">
            <span class="hud-pill score">⭐ ${score}</span>
            <span class="hud-pill streak">🔥 ${streak}x</span>
            <span class="hud-pill lives">${'❤️'.repeat(Math.max(0, lives))}</span>
          </div>
        </div>

        <div class="filter-row">
          ${packs
            .map(
              (p, i) => `
            <button class="filter-chip ${i === packIdx ? 'active' : ''}" data-pack="${i}">Topik ${i + 1}: ${p.title}</button>
          `
            )
            .join('')}
        </div>

        <div class="game-stage">
          <div class="sort-theme-banner">
            <span class="subject-badge">📦 ${pack.title} (${grade})</span>
          </div>

          <div class="sort-item-stage">
            <div class="sort-card-active">
              <span class="sort-emoji">${current.emoji}</span>
              <h3>${current.text}</h3>
              <p>Pilih portal kategori yang paling tepat di bawah ini!</p>
            </div>
          </div>

          <div class="sort-portals">
            ${pack.bins
              .map(
                (b) => `
              <button class="sort-portal-btn" data-bin="${b.id}">
                <span class="portal-icon">${b.icon}</span>
                <strong>${b.label}</strong>
                <small>${b.hint}</small>
              </button>
            `
              )
              .join('')}
          </div>

          ${
            feedback
              ? `
            <div class="explanation-box" style="margin-top:1.1rem;border-color:${feedback.ok ? '#22c55e' : '#ef4444'};">
              <p>${feedback.text}</p>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;

    container.querySelector('#cs-back').addEventListener('click', () => {
      sfx.click();
      onBack();
    });

    container.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        sfx.click();
        startPack(Number(chip.dataset.pack));
      });
    });

    container.querySelectorAll('.sort-portal-btn').forEach((btn) => {
      btn.addEventListener('click', () => pickBin(btn.dataset.bin, btn));
    });
  }

  startPack(0);
  return () => {};
}
