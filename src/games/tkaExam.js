// Game 7: Simulasi TKA & Ujian Sekolah (CBT Mode — Kurikulum Merdeka, K13, TKA 2025/2026 & UTBK)
import { QUIZ_BANK, TKA_SUBJECTS } from '../data/questions.js';
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

export function mountTkaExam(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  let mode = 'tka'; // 'tka' | 'us'
  let questions = [];
  let answers = {}; // { idx: optionIdx }
  let flagged = new Set();
  let cur = 0;
  let secondsLeft = 0;
  let timerId = null;
  let finished = false;

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function startExam(selectedMode = mode) {
    stopTimer();
    mode = selectedMode;
    finished = false;
    answers = {};
    flagged = new Set();
    cur = 0;

    const all = QUIZ_BANK[grade] || QUIZ_BANK.SD;
    const tkaAllowed = TKA_SUBJECTS[grade] || [];
    const pool =
      mode === 'tka'
        ? all.filter((q) => q.isTka || tkaAllowed.includes(q.subject))
        : all;

    questions = shuffle(pool).slice(0, Math.min(12, pool.length));
    secondsLeft = questions.length * 45; // 45 detik per soal

    renderExam();
    timerId = setInterval(() => {
      if (finished) return;
      secondsLeft = Math.max(0, secondsLeft - 1);
      const tEl = container.querySelector('#tka-timer');
      if (tEl) tEl.textContent = formatTime(secondsLeft);
      if (secondsLeft <= 0) {
        submitExam();
      }
    }, 1000);
  }

  function submitExam() {
    if (finished) return;
    finished = true;
    stopTimer();

    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correctCount++;
    });

    const nilai = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    const score = nilai * 5 + correctCount * 10;
    const xpEarned = Math.max(40, Math.round(nilai * 1.4) + correctCount * 8);

    const meta = onFinish({
      gameId: 'tka',
      grade,
      score,
      correctCount,
      maxStreak: correctCount,
      xpEarned,
    });

    sfx.fanfare();
    if (nilai >= 70) fx.confetti();

    const predikat =
      nilai >= 90 ? 'Sangat Memuaskan (A+)' : nilai >= 75 ? 'Memuaskan (A)' : nilai >= 60 ? 'Cukup Baik (B)' : 'Perlu Latihan Lagi';

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-stage result-screen">
          <div class="result-trophy">${nilai >= 80 ? '🏆' : nilai >= 60 ? '📜' : '📚'}</div>
          <h2>Nilai Ujian: ${nilai} / 100</h2>
          <p class="result-subtitle">${predikat} • ${mode === 'tka' ? `Simulasi TKA ${grade}` : `Ujian Sekolah ${grade}`}${meta.isNewBest ? ' • Rekor Baru!' : ''}</p>

          <div class="result-stats">
            <div class="result-stat-box"><strong>${nilai}</strong><span>Nilai Skala 100</span></div>
            <div class="result-stat-box"><strong>${correctCount}/${questions.length}</strong><span>Benar</span></div>
            <div class="result-stat-box"><strong>${questions.length - correctCount}</strong><span>Salah / Kosong</span></div>
            <div class="result-stat-box"><strong>+${xpEarned} XP</strong><span>XP Diperoleh</span></div>
          </div>

          <div class="result-actions" style="margin-bottom:1.5rem;">
            <button id="btn-replay" class="btn btn-primary">Ulangi Simulasi 🔄</button>
            <button id="btn-home" class="btn btn-secondary">Pilih Game Lain 🏠</button>
          </div>

          <div class="tka-review-list">
            <h3 style="font-family:var(--font-display);margin-bottom:0.85rem;text-align:left;">📖 Pembahasan Lengkap Soal</h3>
            ${questions
              .map((q, i) => {
                const userAns = answers[i];
                const ok = userAns === q.answer;
                return `
                  <div class="tka-review-item ${ok ? 'ok' : 'bad'}">
                    <div class="tka-review-head">
                      <span><strong>No. ${i + 1}</strong> • ${q.subject} (${q.tag || q.curriculum})</span>
                      <span>${ok ? '✅ Benar' : '❌ Salah'}</span>
                    </div>
                    <p class="tka-review-q">${q.q}</p>
                    <p class="tka-review-ans">
                      Jawabanmu: <strong>${userAns !== undefined ? q.options[userAns] : 'Tidak dijawab'}</strong>
                      ${!ok ? ` • Kunci: <strong style="color:var(--accent-emerald);">${q.options[q.answer]}</strong>` : ''}
                    </p>
                    <p class="tka-review-exp">💡 ${q.exp}</p>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-replay').addEventListener('click', () => {
      sfx.click();
      startExam(mode);
    });
    container.querySelector('#btn-home').addEventListener('click', () => {
      sfx.click();
      onBack();
    });
  }

  function renderExam() {
    const q = questions[cur];
    const keys = ['A', 'B', 'C', 'D'];
    const answeredCount = Object.keys(answers).length;
    const isFlagged = flagged.has(cur);

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <div class="hud-group">
            <button id="tka-back" class="btn btn-secondary btn-sm">← Keluar</button>
            <span class="hud-pill">📝 ${mode === 'tka' ? `TKA ${grade}` : `Ujian Sekolah ${grade}`}</span>
            <span class="hud-pill">Terjawab: ${answeredCount}/${questions.length}</span>
          </div>
          <div class="hud-group">
            <span class="hud-pill timer">⏱️ <span id="tka-timer">${formatTime(secondsLeft)}</span></span>
            <button id="tka-submit" class="btn btn-success btn-sm">Kumpulkan ✓</button>
          </div>
        </div>

        <div class="filter-row">
          <button class="filter-chip ${mode === 'tka' ? 'active' : ''}" data-mode="tka">
            🎯 Paket TKA ${grade} (${grade === 'SMA' ? 'Wajib + Pilihan' : 'Matematika & B. Indonesia'})
          </button>
          <button class="filter-chip ${mode === 'us' ? 'active' : ''}" data-mode="us">
            📚 Paket Ujian Sekolah (Semua Mapel Merdeka & K13)
          </button>
        </div>

        <div class="tka-layout">
          <div class="game-stage">
            <div class="quiz-header-meta">
              <span class="subject-badge">📘 ${q.subject} • ${q.tag || q.curriculum}</span>
              <button id="tka-flag" class="lifeline-btn">${isFlagged ? '🚩 Ditandai Ragu' : '🏳️ Tandai Ragu'}</button>
            </div>

            <div class="quiz-question-box">
              <span style="color:var(--accent-cyan);margin-right:0.4rem;">${cur + 1}.</span>${q.q}
            </div>

            <div class="options-grid">
              ${q.options
                .map(
                  (opt, i) => `
                <button class="option-btn ${answers[cur] === i ? 'selected-cbt' : ''}" data-idx="${i}">
                  <span class="option-key">${keys[i]}</span>
                  <span>${opt}</span>
                </button>
              `
                )
                .join('')}
            </div>

            <div class="tka-nav-footer">
              <button id="tka-prev" class="btn btn-secondary btn-sm" ${cur === 0 ? 'disabled' : ''}>← Sebelumnya</button>
              <button id="tka-next" class="btn btn-primary btn-sm">
                ${cur === questions.length - 1 ? 'Selesai & Nilai 🏆' : 'Berikutnya →'}
              </button>
            </div>
          </div>

          <aside class="tka-sidebar">
            <h4>Navigasi Nomor CBT</h4>
            <div class="tka-num-grid">
              ${questions
                .map((_, i) => {
                  const cls = [
                    'tka-num-btn',
                    i === cur ? 'current' : '',
                    answers[i] !== undefined ? 'answered' : '',
                    flagged.has(i) ? 'flagged' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');
                  return `<button class="${cls}" data-num="${i}">${i + 1}</button>`;
                })
                .join('')}
            </div>
            <div class="tka-legend">
              <span><i class="dot-ans"></i> Terjawab</span>
              <span><i class="dot-flag"></i> Ragu</span>
              <span><i class="dot-empty"></i> Kosong</span>
            </div>
          </aside>
        </div>
      </div>
    `;

    container.querySelector('#tka-back').addEventListener('click', () => {
      sfx.click();
      stopTimer();
      onBack();
    });

    container.querySelector('#tka-submit').addEventListener('click', () => {
      sfx.click();
      submitExam();
    });

    container.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        sfx.click();
        startExam(chip.dataset.mode);
      });
    });

    container.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.click();
        answers[cur] = Number(btn.dataset.idx);
        renderExam();
      });
    });

    container.querySelector('#tka-flag').addEventListener('click', () => {
      sfx.flip();
      if (flagged.has(cur)) flagged.delete(cur);
      else flagged.add(cur);
      renderExam();
    });

    container.querySelector('#tka-prev').addEventListener('click', () => {
      if (cur > 0) {
        sfx.click();
        cur--;
        renderExam();
      }
    });

    container.querySelector('#tka-next').addEventListener('click', () => {
      sfx.click();
      if (cur === questions.length - 1) submitExam();
      else {
        cur++;
        renderExam();
      }
    });

    container.querySelectorAll('.tka-num-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.click();
        cur = Number(btn.dataset.num);
        renderExam();
      });
    });
  }

  startExam('tka');
  return () => stopTimer();
}
