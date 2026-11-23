// Game 4: Susun Kata Cerdas (Word Scramble & Trivia)
import { WORD_SCRAMBLE_BANK } from '../data/wordData.js';
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

export function mountWordScramble(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  const rounds = shuffle(WORD_SCRAMBLE_BANK[grade] || WORD_SCRAMBLE_BANK.SD).slice(0, 6);
  let idx = 0;
  let score = 0;
  let correctCount = 0;
  let streak = 0;
  let maxStreak = 0;
  let hintsLeft = 3;

  let targetWord = '';
  let bankLetters = [];
  let chosen = [];
  let solved = false;

  function setupRound() {
    solved = false;
    const item = rounds[idx];
    targetWord = item.word.toUpperCase();
    const chars = targetWord.split('');
    let scrambled = shuffle(chars);
    if (scrambled.join('') === targetWord && chars.length > 1) {
      scrambled = shuffle(chars);
    }
    bankLetters = scrambled.map((ch, i) => ({ id: i, ch, used: false }));
    chosen = [];
    render();
  }

  function pickLetter(bankIdx) {
    if (solved) return;
    const tile = bankLetters[bankIdx];
    if (!tile || tile.used) return;
    tile.used = true;
    chosen.push(bankIdx);
    sfx.click();
    render();

    if (chosen.length === targetWord.length) {
      checkAnswer();
    }
  }

  function removeSlot(slotPos) {
    if (solved) return;
    const bankIdx = chosen[slotPos];
    if (bankIdx === undefined) return;
    bankLetters[bankIdx].used = false;
    chosen.splice(slotPos, 1);
    sfx.flip();
    render();
  }

  function checkAnswer() {
    const attempt = chosen.map((bi) => bankLetters[bi].ch).join('');
    if (attempt === targetWord) {
      solved = true;
      correctCount++;
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      score += 40 + streak * 10;
      sfx.correct(streak);
      fx.burst(window.innerWidth / 2, window.innerHeight * 0.45, 28);
      render();
    } else {
      streak = 0;
      sfx.wrong();
      const stage = container.querySelector('.game-stage');
      if (stage) {
        stage.classList.remove('anim-shake');
        void stage.offsetWidth;
        stage.classList.add('anim-shake');
      }
      setTimeout(() => {
        if (solved) return;
        bankLetters.forEach((b) => (b.used = false));
        chosen = [];
        render();
      }, 450);
    }
  }

  function useHint() {
    if (solved || hintsLeft <= 0) return;
    const nextPos = chosen.length;
    if (nextPos >= targetWord.length) return;
    const neededChar = targetWord[nextPos];
    const matchTile = bankLetters.find((b) => !b.used && b.ch === neededChar);
    if (matchTile) {
      hintsLeft--;
      pickLetter(matchTile.id);
    }
  }

  function onKeyDown(e) {
    if (solved) {
      if (e.key === 'Enter') nextRound();
      return;
    }
    if (e.key === 'Backspace' && chosen.length > 0) {
      removeSlot(chosen.length - 1);
      return;
    }
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key)) {
      const tile = bankLetters.find((b) => !b.used && b.ch === key);
      if (tile) pickLetter(tile.id);
    }
  }
  window.addEventListener('keydown', onKeyDown);

  function nextRound() {
    sfx.click();
    if (idx >= rounds.length - 1) {
      finishGame();
    } else {
      idx++;
      setupRound();
    }
  }

  function finishGame() {
    window.removeEventListener('keydown', onKeyDown);
    const xpEarned = Math.max(30, Math.round(score * 0.45) + correctCount * 10);
    const meta = onFinish({
      gameId: 'scramble',
      grade,
      score,
      correctCount,
      maxStreak,
      xpEarned,
    });
    sfx.fanfare();
    fx.confetti();

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-stage result-screen">
          <div class="result-trophy">🧩</div>
          <h2>${meta.isNewBest ? 'Rekor Susun Kata Baru!' : 'Semua Kata Tersusun!'}</h2>
          <p class="result-subtitle">Susun Kata Cerdas • Jenjang ${grade}</p>
          <div class="result-stats">
            <div class="result-stat-box"><strong>${score}</strong><span>Skor Akhir</span></div>
            <div class="result-stat-box"><strong>${correctCount}/${rounds.length}</strong><span>Kata Terpecahkan</span></div>
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
      mountWordScramble(container, ctx);
    });
    container.querySelector('#btn-home').addEventListener('click', () => {
      sfx.click();
      onBack();
    });
  }

  function render() {
    const item = rounds[idx];
    container.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <div class="hud-group">
            <button id="ws-back" class="btn btn-secondary btn-sm">← Kembali</button>
            <span class="hud-pill">🧩 Kata ${idx + 1}/${rounds.length}</span>
          </div>
          <div class="hud-group">
            <span class="hud-pill score">⭐ ${score}</span>
            <span class="hud-pill streak">🔥 ${streak}x</span>
            <span class="hud-pill">💡 Petunjuk: ${hintsLeft}</span>
          </div>
        </div>

        <div class="game-stage">
          <div class="scramble-clue-card">
            <span class="subject-badge">📚 ${item.cat} • ${grade}</span>
            <p>"${item.clue}"</p>
          </div>

          <div class="answer-slots">
            ${Array.from({ length: targetWord.length })
              .map((_, pos) => {
                const bi = chosen[pos];
                const ch = bi !== undefined ? bankLetters[bi].ch : '';
                const cls = solved ? 'filled correct' : ch ? 'filled' : '';
                return `<button class="letter-slot ${cls}" data-slot="${pos}">${ch}</button>`;
              })
              .join('')}
          </div>

          <div class="letter-bank">
            ${bankLetters
              .map(
                (b) => `
              <button class="letter-tile ${b.used ? 'used' : ''}" data-bank="${b.id}" ${b.used || solved ? 'disabled' : ''}>
                ${b.ch}
              </button>
            `
              )
              .join('')}
          </div>

          ${
            solved
              ? `
            <div class="explanation-box">
              <p><strong>🎉 Benar! (${targetWord})</strong> — ${item.fact}</p>
              <button id="ws-next" class="btn btn-success btn-sm">
                ${idx >= rounds.length - 1 ? 'Lihat Hasil 🏆' : 'Kata Berikutnya →'}
              </button>
            </div>
          `
              : `
            <div class="scramble-actions">
              <button id="ws-hint" class="btn btn-amber btn-sm" ${hintsLeft <= 0 ? 'disabled' : ''}>💡 Bantuan (${hintsLeft})</button>
              <button id="ws-clear" class="btn btn-secondary btn-sm">🧹 Ulangi</button>
              <button id="ws-skip" class="btn btn-secondary btn-sm">⏭️ Lewati</button>
            </div>
            <p style="text-align:center;color:var(--text-muted);font-size:0.78rem;margin-top:0.9rem;">
              Tips: Kamu bisa klik huruf atau langsung ketik di keyboard!
            </p>
          `
          }
        </div>
      </div>
    `;

    container.querySelector('#ws-back').addEventListener('click', () => {
      sfx.click();
      window.removeEventListener('keydown', onKeyDown);
      onBack();
    });

    container.querySelectorAll('.letter-tile').forEach((btn) => {
      btn.addEventListener('click', () => pickLetter(Number(btn.dataset.bank)));
    });

    container.querySelectorAll('.letter-slot').forEach((btn) => {
      btn.addEventListener('click', () => removeSlot(Number(btn.dataset.slot)));
    });

    const nextBtn = container.querySelector('#ws-next');
    if (nextBtn) nextBtn.addEventListener('click', nextRound);

    const hintBtn = container.querySelector('#ws-hint');
    if (hintBtn) hintBtn.addEventListener('click', useHint);

    const clearBtn = container.querySelector('#ws-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        sfx.flip();
        bankLetters.forEach((b) => (b.used = false));
        chosen = [];
        render();
      });
    }

    const skipBtn = container.querySelector('#ws-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        streak = 0;
        nextRound();
      });
    }
  }

  setupRound();

  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
}
