// Game 5: Benar atau Mitos? (True / False Lightning Round)
import { TRUE_FALSE_BANK } from '../data/questions.js';
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

export function mountTrueFalse(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  let items = [];
  let idx = 0;
  let score = 0;
  let correctCount = 0;
  let streak = 0;
  let maxStreak = 0;
  let lives = 3;
  let timeLeft = 12;
  const maxTime = 12;
  let answered = false;
  let inResult = false;
  let unmounted = false;
  let timerId = null;

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startNewGame() {
    stopTimer();
    items = shuffle(TRUE_FALSE_BANK[grade] || TRUE_FALSE_BANK.SD);
    idx = 0;
    score = 0;
    correctCount = 0;
    streak = 0;
    maxStreak = 0;
    lives = 3;
    answered = false;
    inResult = false;
    render();
  }

  function startTimer() {
    stopTimer();
    timeLeft = maxTime;
    const fill = container.querySelector('#tf-timer-fill');
    const txt = container.querySelector('#tf-timer-txt');

    timerId = setInterval(() => {
      if (answered || inResult || unmounted) return;
      timeLeft = Math.max(0, +(timeLeft - 0.1).toFixed(1));
      if (fill) {
        fill.style.width = `${(timeLeft / maxTime) * 100}%`;
        fill.classList.toggle('danger', timeLeft <= 3.5);
      }
      if (txt) txt.textContent = `${Math.ceil(timeLeft)}d`;
      if (timeLeft <= 0) {
        stopTimer();
        answer(null);
      }
    }, 100);
  }

  function answer(choiceBool) {
    if (answered || inResult || unmounted) return;
    answered = true;
    stopTimer();

    const item = items[idx];
    const isCorrect = choiceBool === item.isTrue;
    container.querySelectorAll('.tf-btn').forEach((b) => (b.disabled = true));

    if (isCorrect) {
      correctCount++;
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      score += Math.round(25 + timeLeft * 2 + streak * 5);
      sfx.correct(streak);
      fx.burst(window.innerWidth / 2, window.innerHeight * 0.45, 22);
    } else {
      streak = 0;
      lives--;
      sfx.wrong();
      const card = container.querySelector('.tf-statement-card');
      if (card) {
        card.classList.remove('anim-shake');
        void card.offsetWidth;
        card.classList.add('anim-shake');
      }
    }

    const sEl = container.querySelector('#tf-score');
    const stEl = container.querySelector('#tf-streak');
    const lvEl = container.querySelector('#tf-lives');
    if (sEl) sEl.textContent = score;
    if (stEl) stEl.textContent = `${streak}x`;
    if (lvEl) lvEl.textContent = '❤️'.repeat(Math.max(0, lives)) || '💔';

    const expWrap = container.querySelector('#tf-exp');
    const isLast = idx >= items.length - 1 || lives <= 0;
    if (expWrap) {
      expWrap.innerHTML = `
        <div class="explanation-box" style="max-width:640px;width:100%;">
          <p><strong>${isCorrect ? '✅ Tepat Sekali!' : choiceBool === null ? '⏰ Waktu Habis!' : '❌ Kurang Tepat!'}</strong> ${item.exp}</p>
          <button id="tf-next" class="btn btn-primary btn-sm">
            ${isLast ? 'Lihat Hasil 🏆' : 'Lanjut →'}
          </button>
        </div>
      `;
      expWrap.querySelector('#tf-next').addEventListener('click', () => {
        sfx.click();
        if (isLast) finishGame();
        else {
          idx++;
          render();
        }
      });
    }
  }

  function onKey(e) {
    if (unmounted || inResult) return;
    if (answered) {
      if (e.key === 'Enter' || e.key === ' ') {
        const next = container.querySelector('#tf-next');
        if (next) next.click();
      }
      return;
    }
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') answer(true);
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') answer(false);
  }
  window.addEventListener('keydown', onKey);

  function finishGame() {
    stopTimer();
    inResult = true;
    const xpEarned = Math.max(25, Math.round(score * 0.45) + correctCount * 10);
    const meta = onFinish({
      gameId: 'truefalse',
      grade,
      score,
      correctCount,
      maxStreak,
      xpEarned,
    });
    sfx.fanfare();
    if (correctCount >= Math.ceil(items.length * 0.6)) fx.confetti();

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-stage result-screen">
          <div class="result-trophy">⚖️</div>
          <h2>${meta.isNewBest ? 'Rekor Detektor Fakta!' : 'Tantangan Selesai!'}</h2>
          <p class="result-subtitle">Benar atau Mitos? • Jenjang ${grade}</p>
          <div class="result-stats">
            <div class="result-stat-box"><strong>${score}</strong><span>Skor Akhir</span></div>
            <div class="result-stat-box"><strong>${correctCount}/${items.length}</strong><span>Tebakan Benar</span></div>
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
      startNewGame();
    });
    container.querySelector('#btn-home').addEventListener('click', () => {
      sfx.click();
      unmounted = true;
      window.removeEventListener('keydown', onKey);
      onBack();
    });
  }

  function render() {
    if (unmounted) return;
    answered = false;
    const item = items[idx];

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <div class="hud-group">
            <button id="tf-back" class="btn btn-secondary btn-sm">← Kembali</button>
            <span class="hud-pill">⚖️ Pernyataan ${idx + 1}/${items.length}</span>
          </div>
          <div class="hud-group">
            <span class="hud-pill score">⭐ <span id="tf-score">${score}</span></span>
            <span class="hud-pill streak">🔥 <span id="tf-streak">${streak}x</span></span>
            <span class="hud-pill lives" id="tf-lives">${'❤️'.repeat(lives)}</span>
            <span class="hud-pill timer">⏱️ <span id="tf-timer-txt">${maxTime}d</span></span>
          </div>
        </div>

        <div class="game-stage">
          <div class="timer-track">
            <div id="tf-timer-fill" class="timer-fill" style="width:100%"></div>
          </div>

          <div class="tf-card-arena">
            <div class="tf-statement-card">
              <span class="subject-badge">🔍 Cek Fakta • ${grade}</span>
              <h3>"${item.statement}"</h3>
            </div>

            <div class="tf-buttons">
              <button id="btn-true" class="tf-btn true-btn">✅ BENAR (←)</button>
              <button id="btn-false" class="tf-btn false-btn">❌ MITOS (→)</button>
            </div>

            <div id="tf-exp" style="width:100%;display:flex;justify-content:center;"></div>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#tf-back').addEventListener('click', () => {
      sfx.click();
      unmounted = true;
      stopTimer();
      window.removeEventListener('keydown', onKey);
      onBack();
    });

    container.querySelector('#btn-true').addEventListener('click', () => answer(true));
    container.querySelector('#btn-false').addEventListener('click', () => answer(false));

    startTimer();
  }

  startNewGame();

  return () => {
    unmounted = true;
    stopTimer();
    window.removeEventListener('keydown', onKey);
  };
}
