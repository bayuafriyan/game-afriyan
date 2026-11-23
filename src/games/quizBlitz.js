// Game 1: Cepat Tepat Arena (Quiz Blitz — Semua Mapel Kurikulum Merdeka, K13 & TKA)
import { QUIZ_BANK, SUBJECT_LIST } from '../data/questions.js';
import { sfx } from '../utils/audio.js';
import { fx } from '../utils/particles.js';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function mountQuizBlitz(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  const subjects = SUBJECT_LIST[grade] || ['Semua'];
  let selectedSubject = 'Semua';
  let questions = [];
  let index = 0;
  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  let correctCount = 0;
  let lives = 3;
  let timeLeft = 20;
  let maxTime = 20;
  let frozen = false;
  let answered = false;
  let timerId = null;
  let lifelines = { fifty: true, freeze: true, skip: true };

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startRound(subject = selectedSubject) {
    stopTimer();
    selectedSubject = subject;
    const pool = QUIZ_BANK[grade] || QUIZ_BANK.SD;
    const filtered = subject === 'Semua' ? pool : pool.filter((q) => q.subject === subject);
    questions = shuffle(filtered.length > 0 ? filtered : pool).slice(0, Math.min(10, filtered.length || pool.length));
    index = 0;
    score = 0;
    streak = 0;
    maxStreak = 0;
    correctCount = 0;
    lives = 3;
    lifelines = { fifty: true, freeze: true, skip: true };
    renderQuestion();
  }

  function startTimer() {
    stopTimer();
    maxTime = grade === 'SD' ? 24 : grade === 'SMP' ? 20 : 18;
    timeLeft = maxTime;
    frozen = false;

    const fillEl = container.querySelector('#qz-timer-fill');
    const txtEl = container.querySelector('#qz-timer-txt');

    timerId = setInterval(() => {
      if (frozen || answered) return;
      timeLeft = Math.max(0, +(timeLeft - 0.1).toFixed(1));
      const pct = (timeLeft / maxTime) * 100;
      if (fillEl) {
        fillEl.style.width = `${pct}%`;
        fillEl.classList.toggle('danger', timeLeft <= 5);
      }
      if (txtEl) txtEl.textContent = `${Math.ceil(timeLeft)}d`;

      if (timeLeft <= 0) {
        stopTimer();
        handleAnswer(-1);
      }
    }, 100);
  }

  function handleAnswer(choiceIdx, btnEl = null) {
    if (answered) return;
    answered = true;
    stopTimer();

    const q = questions[index];
    const buttons = container.querySelectorAll('.option-btn');
    buttons.forEach((b) => (b.disabled = true));

    const isCorrect = choiceIdx === q.answer;

    if (isCorrect) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
      correctCount++;
      const mult = streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
      const gained = Math.round((20 + timeLeft * 1.5) * mult);
      score += gained;
      sfx.correct(streak);
      if (btnEl) {
        btnEl.classList.add('correct');
        const rect = btnEl.getBoundingClientRect();
        fx.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);
      }
    } else {
      streak = 0;
      lives--;
      sfx.wrong();
      if (btnEl) btnEl.classList.add('wrong');
      if (buttons[q.answer]) buttons[q.answer].classList.add('correct');
      const stage = container.querySelector('.game-stage');
      if (stage) {
        stage.classList.remove('anim-shake');
        void stage.offsetWidth;
        stage.classList.add('anim-shake');
      }
    }

    const scoreEl = container.querySelector('#qz-score');
    const streakEl = container.querySelector('#qz-streak');
    const livesEl = container.querySelector('#qz-lives');
    if (scoreEl) scoreEl.textContent = score;
    if (streakEl) streakEl.textContent = `${streak}x`;
    if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, lives)) || '💔';

    const expWrap = container.querySelector('#qz-exp-wrap');
    if (expWrap) {
      const isLast = index >= questions.length - 1 || lives <= 0;
      expWrap.innerHTML = `
        <div class="explanation-box">
          <p><strong>${isCorrect ? '✨ Mantap!' : choiceIdx === -1 ? '⏰ Waktu Habis!' : '💡 Hampir Tepat!'}</strong> ${q.exp}</p>
          <button id="qz-next" class="btn btn-primary btn-sm">
            ${isLast ? 'Lihat Hasil 🏆' : 'Soal Berikutnya →'}
          </button>
        </div>
      `;
      expWrap.querySelector('#qz-next').addEventListener('click', () => {
        sfx.click();
        if (isLast) finishGame();
        else {
          index++;
          renderQuestion();
        }
      });
    }
  }

  function finishGame() {
    stopTimer();
    const xpEarned = Math.max(25, Math.round(score * 0.45) + correctCount * 10);
    const meta = onFinish({
      gameId: 'quiz',
      grade,
      score,
      correctCount,
      maxStreak,
      xpEarned,
    });
    sfx.fanfare();
    if (correctCount >= Math.ceil(questions.length * 0.6)) fx.confetti();

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-stage result-screen">
          <div class="result-trophy">${correctCount >= questions.length * 0.8 ? '🏆' : correctCount >= questions.length * 0.5 ? '🌟' : '💪'}</div>
          <h2>${meta.isNewBest ? 'Rekor Baru Tercapai!' : 'Ronde Selesai!'}</h2>
          <p class="result-subtitle">Cepat Tepat Arena • Jenjang ${grade} (${selectedSubject})</p>
          <div class="result-stats">
            <div class="result-stat-box"><strong>${score}</strong><span>Skor Akhir</span></div>
            <div class="result-stat-box"><strong>${correctCount}/${questions.length}</strong><span>Jawaban Benar</span></div>
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
      startRound(selectedSubject);
    });
    container.querySelector('#btn-home').addEventListener('click', () => {
      sfx.click();
      onBack();
    });
  }

  function renderQuestion() {
    answered = false;
    const q = questions[index];
    const keys = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="game-shell">
        <div class="game-hud">
          <div class="hud-group">
            <button id="qz-back" class="btn btn-secondary btn-sm">← Kembali</button>
            <span class="hud-pill">⚡ Soal ${index + 1}/${questions.length}</span>
          </div>
          <div class="hud-group">
            <span class="hud-pill score">⭐ <span id="qz-score">${score}</span></span>
            <span class="hud-pill streak">🔥 <span id="qz-streak">${streak}x</span></span>
            <span class="hud-pill lives" id="qz-lives">${'❤️'.repeat(lives)}</span>
            <span class="hud-pill timer">⏱️ <span id="qz-timer-txt">${maxTime}d</span></span>
          </div>
        </div>

        <div class="filter-row">
          ${subjects
            .map(
              (s) => `
            <button class="filter-chip ${s === selectedSubject ? 'active' : ''}" data-subj="${s}">${s}</button>
          `
            )
            .join('')}
        </div>

        <div class="game-stage">
          <div class="timer-track">
            <div id="qz-timer-fill" class="timer-fill" style="width: 100%"></div>
          </div>

          <div class="quiz-header-meta">
            <span class="subject-badge">📘 ${q.subject} • ${q.tag || q.curriculum || grade}</span>
            <div class="lifelines-bar">
              <button id="ll-50" class="lifeline-btn" ${lifelines.fifty ? '' : 'disabled'}>✂️ 50:50</button>
              <button id="ll-freeze" class="lifeline-btn" ${lifelines.freeze ? '' : 'disabled'}>❄️ Bekukan</button>
              <button id="ll-skip" class="lifeline-btn" ${lifelines.skip ? '' : 'disabled'}>⏭️ Lewati</button>
            </div>
          </div>

          <div class="quiz-question-box">${q.q}</div>

          <div class="options-grid">
            ${q.options
              .map(
                (opt, i) => `
              <button class="option-btn" data-idx="${i}">
                <span class="option-key">${keys[i]}</span>
                <span>${opt}</span>
              </button>
            `
              )
              .join('')}
          </div>

          <div id="qz-exp-wrap"></div>
        </div>
      </div>
    `;

    container.querySelector('#qz-back').addEventListener('click', () => {
      sfx.click();
      stopTimer();
      onBack();
    });

    container.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        sfx.click();
        startRound(chip.dataset.subj);
      });
    });

    container.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        handleAnswer(Number(btn.dataset.idx), btn);
      });
    });

    container.querySelector('#ll-50').addEventListener('click', (e) => {
      if (!lifelines.fifty || answered) return;
      lifelines.fifty = false;
      e.currentTarget.disabled = true;
      sfx.click();
      const wrongIndices = [0, 1, 2, 3].filter((i) => i !== q.answer);
      const toHide = shuffle(wrongIndices).slice(0, 2);
      toHide.forEach((i) => {
        const b = container.querySelector(`.option-btn[data-idx="${i}"]`);
        if (b) b.classList.add('eliminated');
      });
    });

    container.querySelector('#ll-freeze').addEventListener('click', (e) => {
      if (!lifelines.freeze || answered) return;
      lifelines.freeze = false;
      frozen = true;
      e.currentTarget.disabled = true;
      sfx.flip();
      const txt = container.querySelector('#qz-timer-txt');
      if (txt) txt.textContent = '❄️ Beku';
    });

    container.querySelector('#ll-skip').addEventListener('click', (e) => {
      if (!lifelines.skip || answered) return;
      lifelines.skip = false;
      e.currentTarget.disabled = true;
      sfx.click();
      stopTimer();
      if (index >= questions.length - 1) finishGame();
      else {
        index++;
        renderQuestion();
      }
    });

    startTimer();
  }

  startRound('Semua');
  return () => stopTimer();
}
