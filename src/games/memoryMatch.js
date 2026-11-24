// Game 3: Memori Pasangan (3D Knowledge Memory Match)
import { MEMORY_PAIRS } from '../data/wordData.js';
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

export function mountMemoryMatch(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  let pairCount = 6; // 6 pairs (12 cards) or 8 pairs (16 cards)
  let cards = [];
  let flipped = [];
  let locked = false;
  let matches = 0;
  let moves = 0;
  let streak = 0;
  let maxStreak = 0;
  let seconds = 0;
  let timerId = null;
  let flipTimer = null;
  let unmounted = false;

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (flipTimer) {
      clearTimeout(flipTimer);
      flipTimer = null;
    }
  }

  function start(numPairs = pairCount) {
    stopTimer();
    pairCount = numPairs;
    const pool = shuffle(MEMORY_PAIRS[grade] || MEMORY_PAIRS.SD).slice(0, pairCount);
    const deck = [];
    pool.forEach((p, idx) => {
      deck.push({ uid: `a_${idx}`, pairId: idx, text: p.a, cat: p.catA, matched: false });
      deck.push({ uid: `b_${idx}`, pairId: idx, text: p.b, cat: p.catB, matched: false });
    });
    cards = shuffle(deck);
    flipped = [];
    locked = false;
    matches = 0;
    moves = 0;
    streak = 0;
    maxStreak = 0;
    seconds = 0;

    renderBoard();
    timerId = setInterval(() => {
      seconds++;
      const tEl = container.querySelector('#mm-time');
      if (tEl) tEl.textContent = `${seconds}d`;
    }, 1000);
  }

  function renderBoard() {
    container.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <div class="hud-group">
            <button id="mm-back" class="btn btn-secondary btn-sm">← Kembali</button>
            <span class="hud-pill">🃏 Cocok: <span id="mm-matches">${matches}/${pairCount}</span></span>
          </div>
          <div class="hud-group">
            <span class="hud-pill">👣 Langkah: <span id="mm-moves">${moves}</span></span>
            <span class="hud-pill streak">🔥 <span id="mm-streak">${streak}x</span></span>
            <span class="hud-pill timer">⏱️ <span id="mm-time">${seconds}d</span></span>
          </div>
        </div>

        <div class="filter-row">
          <button class="filter-chip ${pairCount === 6 ? 'active' : ''}" data-pairs="6">Santai (6 Pasang • 12 Kartu)</button>
          <button class="filter-chip ${pairCount === 8 ? 'active' : ''}" data-pairs="8">Tantangan (8 Pasang • 16 Kartu)</button>
        </div>

        <div class="game-stage">
          <p style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:0.6rem;">
            Temukan pasangan konsep pengetahuan jenjang <strong>${grade}</strong> yang saling berhubungan!
          </p>
          <div class="memory-grid cols-4">
            ${cards
              .map(
                (c, i) => `
              <button class="mem-card" data-index="${i}" aria-label="Kartu memori">
                <div class="mem-face mem-back">✨</div>
                <div class="mem-face mem-front">
                  <span class="mem-type">${c.cat}</span>
                  <span class="mem-text">${c.text}</span>
                </div>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelector('#mm-back').addEventListener('click', () => {
      sfx.click();
      unmounted = true;
      stopTimer();
      onBack();
    });

    container.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        sfx.click();
        start(Number(chip.dataset.pairs));
      });
    });

    container.querySelectorAll('.mem-card').forEach((cardEl) => {
      cardEl.addEventListener('click', () => onCardClick(cardEl));
    });
  }

  function onCardClick(cardEl) {
    if (locked) return;
    const idx = Number(cardEl.dataset.index);
    const card = cards[idx];
    if (card.matched || flipped.some((f) => f.idx === idx)) return;

    sfx.flip();
    cardEl.classList.add('flipped');
    flipped.push({ idx, card, el: cardEl });

    if (flipped.length === 2) {
      moves++;
      const movesEl = container.querySelector('#mm-moves');
      if (movesEl) movesEl.textContent = moves;
      locked = true;

      const [first, second] = flipped;
      if (first.card.pairId === second.card.pairId) {
        first.card.matched = true;
        second.card.matched = true;
        matches++;
        streak++;
        maxStreak = Math.max(maxStreak, streak);
        sfx.correct(streak);

        flipTimer = setTimeout(() => {
          if (unmounted) return;
          first.el.classList.add('matched');
          second.el.classList.add('matched');
          const rect = second.el.getBoundingClientRect();
          fx.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
          flipped = [];
          locked = false;

          const mEl = container.querySelector('#mm-matches');
          const stEl = container.querySelector('#mm-streak');
          if (mEl) mEl.textContent = `${matches}/${pairCount}`;
          if (stEl) stEl.textContent = `${streak}x`;

          if (matches === pairCount) {
            finishGame();
          }
        }, 320);
      } else {
        streak = 0;
        const stEl = container.querySelector('#mm-streak');
        if (stEl) stEl.textContent = '0x';
        flipTimer = setTimeout(() => {
          if (unmounted) return;
          sfx.wrong();
          first.el.classList.remove('flipped');
          second.el.classList.remove('flipped');
          flipped = [];
          locked = false;
        }, 850);
      }
    }
  }

  function finishGame() {
    stopTimer();
    const efficiency = Math.max(20, pairCount * 40 - (moves - pairCount) * 8);
    const speedBonus = Math.max(10, 120 - seconds);
    const score = efficiency + speedBonus + maxStreak * 15;
    const xpEarned = Math.max(35, Math.round(score * 0.35));

    const meta = onFinish({
      gameId: 'memory',
      grade,
      score,
      correctCount: pairCount,
      maxStreak,
      xpEarned,
    });
    sfx.fanfare();
    fx.confetti();

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-stage result-screen">
          <div class="result-trophy">🧠</div>
          <h2>${meta.isNewBest ? 'Rekor Memori Baru!' : 'Semua Pasangan Terbuka!'}</h2>
          <p class="result-subtitle">Memori Pasangan • Jenjang ${grade}</p>
          <div class="result-stats">
            <div class="result-stat-box"><strong>${score}</strong><span>Skor Akhir</span></div>
            <div class="result-stat-box"><strong>${moves}</strong><span>Total Langkah</span></div>
            <div class="result-stat-box"><strong>${seconds}d</strong><span>Waktu</span></div>
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
      start(pairCount);
    });
    container.querySelector('#btn-home').addEventListener('click', () => {
      sfx.click();
      onBack();
    });
  }

  start(6);

  return () => {
    unmounted = true;
    stopTimer();
  };
}
