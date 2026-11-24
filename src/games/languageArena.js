// Arena Bahasa Dunia: Inggris (CEFR), Jepang (JLPT), Mandarin (YCT/HSK)
// 5 Mode Interaktif: Speaking (Mic), Writing (Kanvas & Ejaan), Kuis Kosakata, Dialog NPC, dan Kamus 3 Bahasa (3.150+ Kata)

import {
  LANG_META,
  LANG_VOCAB,
  LANG_TOPICS,
  TOTAL_VOCAB_STATS,
  LANG_DIALOGUES,
} from '../data/languageData.js';
import { speakNative, startListening, isSpeechRecognitionSupported, evaluateSpeech } from '../utils/speech.js';
import { shuffleArray, prepareBalancedQuestions, escapeHtml } from '../utils/quizHelper.js';
import { sfx } from '../utils/audio.js';
import { fx } from '../utils/particles.js';

const TONE_LABELS = {
  1: 'Nada 1 (Datar ˉ)',
  2: 'Nada 2 (Naik ˊ)',
  3: 'Nada 3 (Turun Naik ˇ)',
  4: 'Nada 4 (Turun ˋ)',
  0: 'Nada Netral',
};

const CARDS_PER_PAGE = 24;

export function mountLanguageArena(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  let lang = 'en'; // 'en' | 'ja' | 'zh'
  let mode = 'speaking'; // 'speaking' | 'writing' | 'quiz' | 'dialog' | 'cards'
  let showGuide = true;
  let selectedTopic = 'Semua';
  let cardsScope = 'grade'; // 'grade' | 'all'
  let searchQuery = '';
  let page = 0;

  let idx = 0;
  let score = 0;
  let completed = 0;
  let activeRec = null;
  let isListening = false;
  let speakFeedback = null;
  let dialogFeedback = null;
  let writeFeedback = null;
  let strokeCountDrawn = 0;

  // Quiz state
  let quizQuestions = [];
  let quizIdx = 0;
  let quizAnswered = false;
  let quizSelectedIdx = null;
  let quizCorrect = 0;
  let quizStreak = 0;
  let quizMaxStreak = 0;
  let quizFinished = false;

  let unmounted = false;
  let traceCleanup = null;
  let currentDialogOpts = null;
  let dialogSolved = false;
  let selectedDialogOptIdx = null;
  let sessionCounted = false;
  const rewardedKeys = new Set();

  const allConcepts = [...LANG_VOCAB.SD, ...LANG_VOCAB.SMP, ...LANG_VOCAB.SMA];

  function cleanupTrace() {
    if (traceCleanup) {
      traceCleanup();
      traceCleanup = null;
    }
  }

  function stopAudioAndMic() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (activeRec) {
      try { activeRec.abort(); } catch {}
      activeRec = null;
    }
    isListening = false;
  }

  function getBaseVocabList() {
    if (mode === 'cards' && cardsScope === 'all') {
      return allConcepts;
    }
    return LANG_VOCAB[grade] || LANG_VOCAB.SD;
  }

  function getTopicList() {
    if (mode === 'cards' && cardsScope === 'all') {
      return [...new Set(allConcepts.map((x) => x.topic))];
    }
    return LANG_TOPICS[grade] || [];
  }

  function getActiveVocabList() {
    const base = getBaseVocabList();
    if (selectedTopic === 'Semua') return base;
    const filtered = base.filter((x) => x.topic === selectedTopic);
    return filtered.length > 0 ? filtered : base;
  }

  function getFilteredCards() {
    const list = getActiveVocabList();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => {
      return (
        item.id.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.en.text.toLowerCase().includes(q) ||
        item.ja.text.toLowerCase().includes(q) ||
        item.ja.reading.toLowerCase().includes(q) ||
        item.ja.romaji.toLowerCase().includes(q) ||
        item.zh.text.toLowerCase().includes(q) ||
        item.zh.pinyin.toLowerCase().includes(q)
      );
    });
  }

  function getDialogList() {
    return (LANG_DIALOGUES[lang] && LANG_DIALOGUES[lang][grade]) || LANG_DIALOGUES[lang].SD;
  }

  function tryAwardPoints(rewardKey, pts, x = window.innerWidth / 2, y = window.innerHeight * 0.45) {
    if (rewardedKeys.has(rewardKey)) {
      sfx.correct(1);
      fx.burst(x, y, 16);
      return false;
    }
    rewardedKeys.add(rewardKey);
    score += pts;
    completed++;
    sfx.correct(Math.min(completed, 6));
    fx.burst(x, y, 22);
    onFinish({
      gameId: 'language',
      grade,
      score,
      correctCount: 1,
      maxStreak: completed,
      xpEarned: Math.max(15, Math.round(pts * 0.6)),
      isStep: sessionCounted,
    });
    sessionCounted = true;
    return true;
  }

  function resetRoundFeedback() {
    speakFeedback = null;
    dialogFeedback = null;
    writeFeedback = null;
    currentDialogOpts = null;
    dialogSolved = false;
    selectedDialogOptIdx = null;
  }

  function buildVocabQuiz() {
    const active = getActiveVocabList();
    const fullGradePool = LANG_VOCAB[grade] || LANG_VOCAB.SD;
    const meta = LANG_META[lang];
    const picked = shuffleArray(active).slice(0, Math.min(10, active.length));

    const raw = picked.map((item, qIdx) => {
      const targetData = item[lang];
      const askMeaning = qIdx % 2 === 0;
      const distractors = [];
      const seenForeign = new Set([targetData.text.toLowerCase()]);
      const seenIndo = new Set([item.id.toLowerCase()]);

      for (const cand of shuffleArray(fullGradePool)) {
        if (distractors.length >= 3) break;
        const fKey = cand[lang].text.toLowerCase();
        const iKey = cand.id.toLowerCase();
        if (seenForeign.has(fKey) || seenIndo.has(iKey)) continue;
        seenForeign.add(fKey);
        seenIndo.add(iKey);
        distractors.push(cand);
      }

      if (askMeaning) {
        const readingHint = lang === 'en' ? '' : lang === 'ja' ? `${targetData.reading} (${targetData.romaji})` : targetData.pinyin;
        return {
          concept_id: item.concept_id,
          topic: item.topic,
          speakText: targetData.text,
          prompt: `Apa arti dari "${targetData.text}"?`,
          hintLine: showGuide && readingHint ? readingHint : '',
          options: [item.id, ...distractors.map((d) => d.id)],
          answer: 0,
          exp: `${targetData.text}${readingHint ? ` (${readingHint})` : ''} berarti "${item.id}".`,
        };
      }

      const formatForeignOpt = (entry) => {
        const d = entry[lang];
        if (!showGuide || lang === 'en') return d.text;
        const r = lang === 'ja' ? d.romaji : d.pinyin;
        return `${d.text} (${r})`;
      };
      return {
        concept_id: item.concept_id,
        topic: item.topic,
        speakText: targetData.text,
        prompt: `Pilih ${meta.name} untuk "${item.id}":`,
        hintLine: `Topik: ${item.topic}`,
        options: [formatForeignOpt(item), ...distractors.map(formatForeignOpt)],
        answer: 0,
        exp: `"${item.id}" dalam ${meta.name} adalah "${targetData.text}"${lang !== 'en' ? ` (${lang === 'ja' ? `${targetData.reading} / ${targetData.romaji}` : targetData.pinyin})` : ''}.`,
      };
    });

    quizQuestions = prepareBalancedQuestions(raw, raw.length);
    quizIdx = 0;
    quizAnswered = false;
    quizSelectedIdx = null;
    quizCorrect = 0;
    quizStreak = 0;
    quizMaxStreak = 0;
    quizFinished = false;
  }

  function renderHeader() {
    const meta = LANG_META[lang];
    const baseList = getBaseVocabList();
    const topics = getTopicList();
    const showTopicBar = mode !== 'dialog';

    return `
      <div class="game-hud">
        <div class="hud-group">
          <button id="lg-back" class="btn btn-secondary btn-sm">← Kembali</button>
          <span class="hud-pill">${meta.flag} ${meta.name} (${meta.levelLabel[grade]})</span>
          <span class="hud-pill">📚 ${TOTAL_VOCAB_STATS.totalWords.toLocaleString('id-ID')}+ Kosakata</span>
        </div>
        <div class="hud-group">
          <button id="lg-toggle-guide" class="lifeline-btn">${showGuide ? '👁️ Bantuan: ON' : '🙈 Bantuan: OFF'}</button>
          <span class="hud-pill score">⭐ ${score}</span>
        </div>
      </div>

      <div class="lang-switch-bar">
        ${Object.values(LANG_META)
          .map(
            (m) => `
          <button class="lang-tab-btn ${m.code === lang ? 'active' : ''}" data-lang="${m.code}">
            <span>${m.flag}</span> ${m.name}
          </button>
        `
          )
          .join('')}
      </div>

      <div class="filter-row">
        <button class="filter-chip ${mode === 'speaking' ? 'active' : ''}" data-mode="speaking">🗣️ Speaking (Suara)</button>
        <button class="filter-chip ${mode === 'writing' ? 'active' : ''}" data-mode="writing">✍️ Writing (Menulis)</button>
        <button class="filter-chip ${mode === 'quiz' ? 'active' : ''}" data-mode="quiz">⚡ Kuis Kosakata</button>
        <button class="filter-chip ${mode === 'dialog' ? 'active' : ''}" data-mode="dialog">💬 Dialog NPC</button>
        <button class="filter-chip ${mode === 'cards' ? 'active' : ''}" data-mode="cards">🎴 Kamus 3 Bahasa</button>
      </div>

      ${
        showTopicBar
          ? `
        <div class="lang-toolbar">
          <select id="lg-topic" class="lang-topic-select" aria-label="Filter Topik Kosakata">
            <option value="Semua" ${selectedTopic === 'Semua' ? 'selected' : ''}>📂 Semua Topik (${baseList.length} kata)</option>
            ${topics
              .map((t) => {
                const cnt = baseList.filter((x) => x.topic === t).length;
                return `<option value="${escapeHtml(t)}" ${selectedTopic === t ? 'selected' : ''}>${escapeHtml(t)} (${cnt})</option>`;
              })
              .join('')}
          </select>

          ${
            mode === 'cards'
              ? `
            <input id="lg-search" class="text-input lang-search-input" type="search" value="${escapeHtml(searchQuery)}" placeholder="Cari kata Indo, Inggris, Jepang, Romaji, atau Pinyin..." autocomplete="off" />
            <div class="lang-scope-toggle">
              <button id="lg-scope-grade" class="filter-chip ${cardsScope === 'grade' ? 'active' : ''}">Jenjang ${grade} (${(LANG_VOCAB[grade] || []).length})</button>
              <button id="lg-scope-all" class="filter-chip ${cardsScope === 'all' ? 'active' : ''}">Semua (${allConcepts.length} Konsep)</button>
            </div>
          `
              : ''
          }
        </div>
      `
          : ''
      }
    `;
  }

  function renderSpeakingBody() {
    const list = getActiveVocabList();
    const wordPos = idx % list.length;
    const item = list[wordPos];
    const data = item[lang];
    const meta = LANG_META[lang];
    const readingText =
      lang === 'en'
        ? (data.phonetic ? data.phonetic : `Level ${data.level} • ${item.topic}`)
        : lang === 'ja'
          ? `${data.reading} (${data.romaji})`
          : data.pinyin;
    const toneBadges =
      lang === 'zh' && data.tones
        ? `<div class="tone-row">${data.tones.map((t) => `<span class="tone-badge">${TONE_LABELS[t] || ''}</span>`).join('')}</div>`
        : '';

    return `
      <div class="lang-panel">
        <div class="lang-nav-row">
          <span class="subject-badge">📂 ${item.topic} • Kata ${wordPos + 1} / ${list.length}</span>
          <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
            <button id="btn-prev-word" class="btn btn-secondary btn-sm">← Sebelumnya</button>
            <button id="btn-rand-word" class="btn btn-amber btn-sm">🎲 Acak Kata</button>
            <button id="btn-next-word" class="btn btn-secondary btn-sm">Berikutnya →</button>
          </div>
        </div>

        <div class="lang-card-hero">
          <span class="lang-emoji-big">${item.emoji}</span>
          <div class="lang-word-main">${data.text}</div>
          ${showGuide ? `<div class="lang-reading">${readingText}</div>` : `<div class="lang-reading muted">Mode Sulit: Bantuan baca disembunyikan</div>`}
          <div class="lang-meaning">Arti: <strong>${item.id}</strong> • Level ${data.level}</div>
          ${toneBadges}
          <div class="lang-example">"${data.example}"</div>
        </div>

        <div class="lang-audio-actions">
          <button id="btn-speak-normal" class="btn btn-primary">🔊 Dengarkan</button>
          <button id="btn-speak-slow" class="btn btn-secondary">🐢 Pelan</button>
          <button id="btn-speak-example" class="btn btn-secondary">💬 Contoh Kalimat</button>
        </div>

        <div class="mic-zone">
          <button id="btn-mic" class="mic-btn ${isListening ? 'listening' : ''}">
            ${isListening ? '🎙️ Mendengarkan... Ucapkan!' : '🎙️ Klik & Ucapkan Sekarang'}
          </button>
          ${
            !isSpeechRecognitionSupported()
              ? `<p class="mic-note">Browser ini tidak mendukung mikrofon otomatis. Kamu tetap bisa latihan menirukan audio di atas!</p>`
              : `<p class="mic-note">Ucapkan <strong>"${data.text}"</strong> (${meta.speechLang}) dengan jelas ke mikrofon.</p>`
          }
          <div style="margin-top:0.65rem;display:flex;justify-content:center;flex-wrap:wrap;gap:0.5rem;">
            <button id="btn-self-pass" class="btn btn-success btn-sm">✅ Sudah Bisa Mengucapkan</button>
          </div>
        </div>

        ${
          speakFeedback
            ? `
          <div class="explanation-box" style="margin-top:1rem;border-color:${speakFeedback.ok ? '#22c55e' : '#f59e0b'};">
            <p>${speakFeedback.msg}</p>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  function renderWritingBody() {
    const list = getActiveVocabList();
    const wordPos = idx % list.length;
    const item = list[wordPos];
    const data = item[lang];
    const isCharacterLang = lang === 'ja' || lang === 'zh';
    const readingText =
      lang === 'en'
        ? (data.phonetic || `Level ${data.level}`)
        : lang === 'ja'
          ? `${data.reading} (${data.romaji})`
          : data.pinyin;

    if (!isCharacterLang) {
      return `
        <div class="lang-panel">
          <div class="lang-nav-row">
            <span class="subject-badge">📂 ${item.topic} • Kata ${wordPos + 1} / ${list.length}</span>
            <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
              <button id="btn-prev-word" class="btn btn-secondary btn-sm">← Sebelumnya</button>
              <button id="btn-rand-word" class="btn btn-amber btn-sm">🎲 Acak</button>
              <button id="btn-next-word" class="btn btn-secondary btn-sm">Berikutnya →</button>
            </div>
          </div>

          <div class="lang-card-hero">
            <span class="lang-emoji-big">${item.emoji}</span>
            <div class="lang-meaning" style="font-size:1.15rem;">Tulis dalam Bahasa Inggris: <strong>"${item.id}"</strong></div>
            ${showGuide ? `<div class="lang-reading">Petunjuk: ${data.text[0]}${'_'.repeat(Math.max(1, data.text.length - 1))} (${data.text.length} huruf) • ${data.level}</div>` : ''}
            <div style="margin-top:0.8rem;">
              <button id="btn-speak-normal" class="btn btn-primary btn-sm">🔊 Dengarkan Pengucapan</button>
            </div>
          </div>

          <form id="en-write-form" class="en-write-box">
            <input id="en-write-input" class="text-input" type="text" placeholder="Ketik ejaan bahasa Inggris di sini..." autocomplete="off" />
            <button type="submit" class="btn btn-success">Cek Ejaan ✓</button>
          </form>

          ${
            writeFeedback
              ? `<div class="explanation-box" style="margin-top:1rem;border-color:${writeFeedback.ok ? '#22c55e' : '#ef4444'};"><p>${writeFeedback.msg}</p></div>`
              : ''
          }
        </div>
      `;
    }

    const strokeLabel =
      typeof data.strokes === 'number' && data.strokes > 0
        ? `${data.strokes} Guratan`
        : `${data.text.length} Aksara • ${data.level}`;

    return `
      <div class="lang-panel">
        <div class="lang-nav-row">
          <span class="subject-badge">📂 ${item.topic} • Kata ${wordPos + 1} / ${list.length}</span>
          <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
            <button id="btn-prev-word" class="btn btn-secondary btn-sm">← Sebelumnya</button>
            <button id="btn-rand-word" class="btn btn-amber btn-sm">🎲 Acak</button>
            <button id="btn-next-word" class="btn btn-secondary btn-sm">Berikutnya →</button>
          </div>
        </div>

        <div class="write-top-info">
          <div>
            <span class="subject-badge">${item.emoji} ${item.id} • ${strokeLabel}</span>
            <h3 style="font-family:var(--font-display);font-size:1.45rem;margin-top:0.35rem;">
              Tulis Aksara: <span style="color:var(--primary);">${data.text}</span>
              ${showGuide ? `<small style="font-size:0.9rem;color:var(--text-muted);margin-left:0.4rem;">(${readingText})</small>` : ''}
            </h3>
          </div>
          <button id="btn-speak-normal" class="btn btn-primary btn-sm">🔊 Dengarkan</button>
        </div>

        <div class="tracing-stage">
          <div class="tracing-canvas-wrap">
            <canvas id="trace-canvas" width="320" height="320"></canvas>
          </div>
          <div class="tracing-controls">
            <p class="tracing-tip">Gunakan jari (HP) atau mouse untuk menebalkan guratan aksara di dalam kotak panduan!</p>
            <div class="tracing-btn-col">
              <button id="btn-trace-check" class="btn btn-success">✅ Selesai & Cek Tulisan</button>
              <button id="btn-trace-clear" class="btn btn-secondary">🧹 Bersihkan Kanvas</button>
            </div>
          </div>
        </div>

        ${
          writeFeedback
            ? `<div class="explanation-box" style="margin-top:1rem;border-color:${writeFeedback.ok ? '#22c55e' : '#f59e0b'};"><p>${writeFeedback.msg}</p></div>`
            : ''
        }
      </div>
    `;
  }

  function renderQuizBody() {
    if (quizQuestions.length === 0) {
      buildVocabQuiz();
    }
    const meta = LANG_META[lang];

    if (quizFinished) {
      return `
        <div class="result-screen" style="padding:1rem 0.5rem;">
          <div class="result-trophy">${quizCorrect >= quizQuestions.length * 0.8 ? '🏆' : '🌟'}</div>
          <h2>Kuis Kosakata Selesai!</h2>
          <p class="result-subtitle">${meta.name} • Jenjang ${grade} (${selectedTopic})</p>
          <div class="result-stats">
            <div class="result-stat-box"><strong>${quizCorrect}/${quizQuestions.length}</strong><span>Benar</span></div>
            <div class="result-stat-box"><strong>${quizMaxStreak}x</strong><span>Combo Terbaik</span></div>
            <div class="result-stat-box"><strong>${score}</strong><span>Total Skor Arena</span></div>
          </div>
          <div class="result-actions">
            <button id="btn-quiz-replay" class="btn btn-primary">Main Kuis Lagi 🔄</button>
            <button id="btn-quiz-cards" class="btn btn-secondary">Buka Kamus 3 Bahasa 🎴</button>
          </div>
        </div>
      `;
    }

    const q = quizQuestions[quizIdx];
    const keys = ['A', 'B', 'C', 'D'];

    return `
      <div class="lang-panel">
        <div class="quiz-header-meta">
          <span class="subject-badge">⚡ Soal ${quizIdx + 1}/${quizQuestions.length} • ${q.topic}</span>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <span class="hud-pill streak">🔥 ${quizStreak}x</span>
            <button id="btn-quiz-speak" class="btn btn-primary btn-sm">🔊 Dengarkan</button>
          </div>
        </div>

        <div class="quiz-question-box">
          ${escapeHtml(q.prompt)}
          ${q.hintLine ? `<div style="font-size:0.95rem;color:var(--primary);margin-top:0.35rem;">${escapeHtml(q.hintLine)}</div>` : ''}
        </div>

        <div class="options-grid">
          ${q.options
            .map((opt, i) => {
              let cls = 'option-btn';
              if (quizAnswered) {
                if (i === q.answer) cls += ' correct';
                else if (i === quizSelectedIdx) cls += ' wrong';
              }
              return `
                <button class="${cls}" data-idx="${i}" ${quizAnswered ? 'disabled' : ''}>
                  <span class="option-key">${keys[i]}</span>
                  <span>${escapeHtml(opt)}</span>
                </button>
              `;
            })
            .join('')}
        </div>

        ${
          quizAnswered
            ? `
          <div class="explanation-box">
            <p><strong>${quizSelectedIdx === q.answer ? '✨ Tepat!' : '💡 Hampir Tepat!'}</strong> ${escapeHtml(q.exp)}</p>
            <button id="btn-quiz-next" class="btn btn-primary btn-sm">
              ${quizIdx >= quizQuestions.length - 1 ? 'Lihat Hasil Kuis 🏆' : 'Soal Berikutnya →'}
            </button>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  function renderDialogBody() {
    const dialogs = getDialogList();
    const dlgPos = idx % dialogs.length;
    const dlg = dialogs[dlgPos];
    if (!currentDialogOpts) {
      currentDialogOpts = shuffleArray(dlg.options);
    }

    return `
      <div class="lang-panel">
        <div class="lang-nav-row">
          <span class="subject-badge">💬 Dialog ${dlgPos + 1} / ${dialogs.length}</span>
          <div style="display:flex;gap:0.45rem;">
            <button id="btn-prev-word" class="btn btn-secondary btn-sm">← Sebelumnya</button>
            <button id="btn-next-word" class="btn btn-secondary btn-sm">Berikutnya →</button>
          </div>
        </div>

        <div class="npc-stage">
          <div class="npc-header">
            <span class="npc-name">${dlg.npc}</span>
            <button id="btn-npc-speak" class="btn btn-primary btn-sm">🔊 Dengarkan NPC</button>
          </div>
          <div class="npc-bubble">
            <p class="npc-line">${dlg.npcText}</p>
            ${showGuide && dlg.romaji ? `<p class="npc-romaji">${dlg.romaji}</p>` : ''}
          </div>
          <p class="npc-hint">💡 ${dlg.hint}</p>
        </div>

        <div class="dialog-choices">
          ${currentDialogOpts
            .map(
              (o, i) => `
            <button class="dialog-opt-btn ${dialogSolved && selectedDialogOptIdx === i ? 'correct' : ''}" data-opt-idx="${i}" data-ok="${o.ok}" data-reply="${encodeURIComponent(o.reply)}" ${dialogSolved ? 'disabled' : ''}>
              <span class="option-key">${['A', 'B', 'C'][i]}</span>
              <span>${o.text}</span>
            </button>
          `
            )
            .join('')}
        </div>

        ${
          dialogFeedback
            ? `
          <div class="explanation-box" style="margin-top:1.1rem;border-color:${dialogFeedback.ok ? '#22c55e' : '#ef4444'};">
            <p><strong>${dialogFeedback.ok ? '🎉 Balasan Tepat!' : '💡 Coba Lagi!'}</strong> ${dialogFeedback.reply}</p>
            <button id="btn-next-word-exp" class="btn btn-primary btn-sm">Dialog Berikutnya →</button>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  function renderCardsResultsHtml() {
    const filtered = getFilteredCards();
    const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
    if (page >= totalPages) page = totalPages - 1;
    if (page < 0) page = 0;

    const start = page * CARDS_PER_PAGE;
    const slice = filtered.slice(start, start + CARDS_PER_PAGE);

    return `
      <div class="lang-cards-meta">
        <span>Menampilkan <strong>${filtered.length}</strong> konsep (<strong>${(filtered.length * 3).toLocaleString('id-ID')}</strong> kata 3 bahasa)</span>
        <span>Halaman ${page + 1} / ${totalPages}</span>
      </div>

      ${
        slice.length === 0
          ? `<div class="explanation-box"><p>Tidak ada kosakata yang cocok dengan pencarian "<strong>${escapeHtml(searchQuery)}</strong>". Coba kata kunci lain atau pilih "Semua Topik".</p></div>`
          : `
        <div class="tri-cards-grid">
          ${slice
            .map(
              (item) => `
            <div class="tri-card">
              <div class="tri-card-head">
                <span class="tri-emoji">${item.emoji}</span>
                <div>
                  <strong>${item.id}</strong>
                  <small style="display:block;font-size:0.72rem;color:#64748b;font-weight:700;">${item.topic}</small>
                </div>
              </div>
              <div class="tri-row">
                <span>🇬🇧 <strong>${item.en.text}</strong> <small>${item.en.level}</small></span>
                <button class="mini-speak-btn" data-txt="${encodeURIComponent(item.en.text)}" data-sl="en-US">🔊</button>
              </div>
              <div class="tri-row">
                <span>🇯🇵 <strong>${item.ja.text}</strong> ${showGuide ? `<small>${item.ja.reading} (${item.ja.romaji})</small>` : ''}</span>
                <button class="mini-speak-btn" data-txt="${encodeURIComponent(item.ja.text)}" data-sl="ja-JP">🔊</button>
              </div>
              <div class="tri-row">
                <span>🇨🇳 <strong>${item.zh.text}</strong> ${showGuide ? `<small>${item.zh.pinyin}</small>` : ''}</span>
                <button class="mini-speak-btn" data-txt="${encodeURIComponent(item.zh.text)}" data-sl="zh-CN">🔊</button>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      `
      }

      ${
        totalPages > 1
          ? `
        <div class="lang-pagination">
          <button id="btn-page-prev" class="btn btn-secondary btn-sm" ${page === 0 ? 'disabled' : ''}>← Hal Sebelumnya</button>
          <span class="hud-pill">Halaman ${page + 1} / ${totalPages}</span>
          <button id="btn-page-next" class="btn btn-primary btn-sm" ${page >= totalPages - 1 ? 'disabled' : ''}>Hal Berikutnya →</button>
        </div>
      `
          : ''
      }
    `;
  }

  function renderCardsBody() {
    return `
      <div class="lang-panel">
        <div id="cards-results-wrap">
          ${renderCardsResultsHtml()}
        </div>
      </div>
    `;
  }

  function bindCardsInteractiveEvents() {
    const wrap = container.querySelector('#cards-results-wrap');
    if (!wrap) return;

    wrap.querySelectorAll('.mini-speak-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        speakNative(decodeURIComponent(btn.dataset.txt), btn.dataset.sl, 0.92);
      });
    });

    const prevPg = wrap.querySelector('#btn-page-prev');
    if (prevPg) {
      prevPg.addEventListener('click', () => {
        if (page > 0) {
          sfx.click();
          page--;
          wrap.innerHTML = renderCardsResultsHtml();
          bindCardsInteractiveEvents();
        }
      });
    }

    const nextPg = wrap.querySelector('#btn-page-next');
    if (nextPg) {
      nextPg.addEventListener('click', () => {
        sfx.click();
        page++;
        wrap.innerHTML = renderCardsResultsHtml();
        bindCardsInteractiveEvents();
      });
    }
  }

  function setupTracingCanvas(charText, conceptKey) {
    const canvas = container.querySelector('#trace-canvas');
    if (!canvas) return;
    const g = canvas.getContext('2d');
    strokeCountDrawn = 0;

    function drawGuideLayer() {
      g.clearRect(0, 0, canvas.width, canvas.height);
      g.save();
      g.strokeStyle = '#cbd5e1';
      g.lineWidth = 1.5;
      g.setLineDash([6, 6]);
      g.beginPath();
      g.moveTo(canvas.width / 2, 0);
      g.lineTo(canvas.width / 2, canvas.height);
      g.moveTo(0, canvas.height / 2);
      g.lineTo(canvas.width, canvas.height / 2);
      g.stroke();
      g.restore();

      if (showGuide) {
        g.save();
        g.fillStyle = 'rgba(148, 163, 184, 0.28)';
        const fontSize = charText.length > 4 ? 54 : charText.length > 2 ? 84 : charText.length === 2 ? 124 : 200;
        g.font = `700 ${fontSize}px sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(charText, canvas.width / 2, canvas.height / 2 + 8);
        g.restore();
      }
    }

    drawGuideLayer();

    let drawing = false;
    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * canvas.width,
        y: ((clientY - rect.top) / rect.height) * canvas.height,
      };
    }

    function startDraw(e) {
      e.preventDefault();
      drawing = true;
      strokeCountDrawn++;
      const p = getPos(e);
      g.beginPath();
      g.moveTo(p.x, p.y);
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.lineWidth = 13;
      g.strokeStyle = '#0f172a';
    }

    function moveDraw(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = getPos(e);
      g.lineTo(p.x, p.y);
      g.stroke();
    }

    function endDraw() {
      drawing = false;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    traceCleanup = () => {
      window.removeEventListener('mouseup', endDraw);
    };

    const clearBtn = container.querySelector('#btn-trace-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        sfx.flip();
        strokeCountDrawn = 0;
        drawGuideLayer();
      });
    }

    const checkBtn = container.querySelector('#btn-trace-check');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        if (strokeCountDrawn < 1) {
          writeFeedback = { ok: false, msg: 'Yuk tulis dulu aksaranya di dalam kotak kanvas!' };
          sfx.wrong();
          render();
          return;
        }
        const earned = tryAwardPoints(`writing_${lang}_${conceptKey}`, 35);
        writeFeedback = {
          ok: true,
          msg: earned
            ? `Keren! Kamu menulis "${charText}" dengan ${strokeCountDrawn} goresan (+35 poin).`
            : `Mantap! Latihan tambahan "${charText}" tercatat (${strokeCountDrawn} goresan).`,
        };
        render();
      });
    }
  }

  function render() {
    if (unmounted) return;
    cleanupTrace();

    const bodyHtml =
      mode === 'speaking'
        ? renderSpeakingBody()
        : mode === 'writing'
          ? renderWritingBody()
          : mode === 'quiz'
            ? renderQuizBody()
            : mode === 'dialog'
              ? renderDialogBody()
              : renderCardsBody();

    container.innerHTML = `
      <div class="game-shell">
        ${renderHeader()}
        <div class="game-stage">
          ${bodyHtml}
        </div>
      </div>
    `;

    container.querySelector('#lg-back').addEventListener('click', () => {
      sfx.click();
      unmounted = true;
      stopAudioAndMic();
      cleanupTrace();
      onBack();
    });

    container.querySelector('#lg-toggle-guide').addEventListener('click', () => {
      sfx.click();
      showGuide = !showGuide;
      if (mode === 'quiz' && !quizAnswered && !quizFinished) {
        buildVocabQuiz();
      }
      render();
    });

    container.querySelectorAll('.lang-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.click();
        stopAudioAndMic();
        lang = btn.dataset.lang;
        idx = 0;
        resetRoundFeedback();
        if (mode === 'quiz') buildVocabQuiz();
        render();
      });
    });

    container.querySelectorAll('.filter-chip[data-mode]').forEach((chip) => {
      chip.addEventListener('click', () => {
        sfx.click();
        stopAudioAndMic();
        mode = chip.dataset.mode;
        if (mode !== 'cards' && cardsScope === 'all') {
          cardsScope = 'grade';
          selectedTopic = 'Semua';
        }
        idx = 0;
        page = 0;
        resetRoundFeedback();
        if (mode === 'quiz') buildVocabQuiz();
        render();
      });
    });

    const topicSel = container.querySelector('#lg-topic');
    if (topicSel) {
      topicSel.addEventListener('change', () => {
        sfx.click();
        stopAudioAndMic();
        selectedTopic = topicSel.value;
        idx = 0;
        page = 0;
        resetRoundFeedback();
        if (mode === 'quiz') buildVocabQuiz();
        render();
      });
    }

    // Cards search & scope bindings
    const searchInput = container.querySelector('#lg-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        page = 0;
        const wrap = container.querySelector('#cards-results-wrap');
        if (wrap) {
          wrap.innerHTML = renderCardsResultsHtml();
          bindCardsInteractiveEvents();
        }
      });
    }

    const scopeGradeBtn = container.querySelector('#lg-scope-grade');
    if (scopeGradeBtn) {
      scopeGradeBtn.addEventListener('click', () => {
        if (cardsScope === 'grade') return;
        sfx.click();
        cardsScope = 'grade';
        selectedTopic = 'Semua';
        page = 0;
        render();
      });
    }

    const scopeAllBtn = container.querySelector('#lg-scope-all');
    if (scopeAllBtn) {
      scopeAllBtn.addEventListener('click', () => {
        if (cardsScope === 'all') return;
        sfx.click();
        cardsScope = 'all';
        selectedTopic = 'Semua';
        page = 0;
        render();
      });
    }

    // Word / Dialog Navigation
    const list = getActiveVocabList();
    const wordPos = idx % list.length;
    const item = list[wordPos];
    const data = item[lang];
    const meta = LANG_META[lang];

    const speakNormal = container.querySelector('#btn-speak-normal');
    if (speakNormal) {
      speakNormal.addEventListener('click', () => speakNative(data.text, meta.speechLang, 0.95));
    }

    const speakSlow = container.querySelector('#btn-speak-slow');
    if (speakSlow) {
      speakSlow.addEventListener('click', () => speakNative(data.text, meta.speechLang, 0.62));
    }

    const speakEx = container.querySelector('#btn-speak-example');
    if (speakEx) {
      speakEx.addEventListener('click', () => speakNative(data.example.split('(')[0], meta.speechLang, 0.9));
    }

    const goNext = () => {
      sfx.click();
      stopAudioAndMic();
      idx++;
      resetRoundFeedback();
      render();
    };

    const goPrev = () => {
      sfx.click();
      stopAudioAndMic();
      const len = mode === 'dialog' ? getDialogList().length : list.length;
      idx = (idx - 1 + len) % len;
      resetRoundFeedback();
      render();
    };

    const nextBtn = container.querySelector('#btn-next-word');
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    const nextExpBtn = container.querySelector('#btn-next-word-exp');
    if (nextExpBtn) nextExpBtn.addEventListener('click', goNext);

    const prevBtn = container.querySelector('#btn-prev-word');
    if (prevBtn) prevBtn.addEventListener('click', goPrev);

    const randBtn = container.querySelector('#btn-rand-word');
    if (randBtn) {
      randBtn.addEventListener('click', () => {
        sfx.click();
        stopAudioAndMic();
        if (list.length > 1) {
          let nextIdx = Math.floor(Math.random() * list.length);
          if (nextIdx === wordPos) nextIdx = (wordPos + 1) % list.length;
          idx = nextIdx;
        }
        resetRoundFeedback();
        render();
      });
    }

    const selfPass = container.querySelector('#btn-self-pass');
    if (selfPass) {
      selfPass.addEventListener('click', () => {
        const earned = tryAwardPoints(`speaking_${lang}_${item.concept_id}`, 25);
        speakFeedback = {
          ok: true,
          msg: earned
            ? `Mantap! Pelafalan "${data.text}" selesai dilatih (+25 poin).`
            : `Pelafalan "${data.text}" sudah dinilai di sesi ini. Lanjut ke kata berikutnya ya!`,
        };
        render();
      });
    }

    const micBtn = container.querySelector('#btn-mic');
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (isListening) {
          stopAudioAndMic();
          render();
          return;
        }
        isListening = true;
        speakFeedback = null;
        render();

        const readingTargets = data.reading ? data.reading.split('/').map((s) => s.trim()) : [];
        const targets = [data.text, ...readingTargets, data.romaji, data.pinyin].filter(Boolean);
        activeRec = startListening(meta.speechLang, {
          onResult: (alts) => {
            if (unmounted) return;
            isListening = false;
            const res = evaluateSpeech(alts, targets);
            const safeHeard = escapeHtml(res.heard);
            if (res.score >= 60) {
              const earned = tryAwardPoints(`speaking_${lang}_${item.concept_id}`, 40);
              speakFeedback = {
                ok: true,
                msg: earned
                  ? `Hebat! Terdengar: "${safeHeard}" (Kemiripan ${res.score}%). Pengucapanmu jelas!`
                  : `Hebat! Terdengar: "${safeHeard}" (Kemiripan ${res.score}%). Tetap lancar!`,
              };
            } else {
              sfx.wrong();
              speakFeedback = {
                ok: false,
                msg: `Terdengar: "${safeHeard}" (Kemiripan ${res.score}%). Coba dengarkan tombol 🐢 Pelan lalu ucapkan lagi ya!`,
              };
            }
            render();
          },
          onError: (msg) => {
            if (unmounted) return;
            isListening = false;
            speakFeedback = { ok: false, msg: escapeHtml(msg) };
            render();
          },
          onEnd: () => {
            if (unmounted) return;
            if (isListening) {
              isListening = false;
              render();
            }
          },
        });
      });
    }

    const enForm = container.querySelector('#en-write-form');
    if (enForm) {
      enForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = container.querySelector('#en-write-input').value.trim();
        const target = data.text.toLowerCase();
        if (val.toLowerCase() === target) {
          const earned = tryAwardPoints(`writing_en_${item.concept_id}`, 35);
          writeFeedback = {
            ok: true,
            msg: earned
              ? `Tepat sekali! Ejaan "${data.text}" benar 100%!`
              : `Benar! Ejaan "${data.text}" tetap akurat!`,
          };
        } else {
          sfx.wrong();
          writeFeedback = {
            ok: false,
            msg: `Belum tepat ("${escapeHtml(val) || '...'}"). Coba dengarkan audionya lagi ya!`,
          };
        }
        render();
      });
    }

    if (mode === 'writing' && (lang === 'ja' || lang === 'zh')) {
      setupTracingCanvas(data.text, item.concept_id);
    }

    // Quiz Mode Events
    if (mode === 'quiz') {
      const qSpeak = container.querySelector('#btn-quiz-speak');
      if (qSpeak && quizQuestions[quizIdx]) {
        qSpeak.addEventListener('click', () => speakNative(quizQuestions[quizIdx].speakText, meta.speechLang, 0.92));
      }

      container.querySelectorAll('.option-btn[data-idx]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (quizAnswered || quizFinished) return;
          quizAnswered = true;
          quizSelectedIdx = Number(btn.dataset.idx);
          const curQ = quizQuestions[quizIdx];
          if (quizSelectedIdx === curQ.answer) {
            quizCorrect++;
            quizStreak++;
            quizMaxStreak = Math.max(quizMaxStreak, quizStreak);
            const rect = btn.getBoundingClientRect();
            tryAwardPoints(`quiz_${lang}_${curQ.concept_id}`, 30, rect.left + rect.width / 2, rect.top + rect.height / 2);
          } else {
            quizStreak = 0;
            sfx.wrong();
          }
          render();
        });
      });

      const qNext = container.querySelector('#btn-quiz-next');
      if (qNext) {
        qNext.addEventListener('click', () => {
          sfx.click();
          if (quizIdx >= quizQuestions.length - 1) {
            quizFinished = true;
            if (quizCorrect >= Math.ceil(quizQuestions.length * 0.6)) {
              sfx.fanfare();
              fx.confetti();
            }
          } else {
            quizIdx++;
            quizAnswered = false;
            quizSelectedIdx = null;
          }
          render();
        });
      }

      const qReplay = container.querySelector('#btn-quiz-replay');
      if (qReplay) {
        qReplay.addEventListener('click', () => {
          sfx.click();
          buildVocabQuiz();
          render();
        });
      }

      const qCards = container.querySelector('#btn-quiz-cards');
      if (qCards) {
        qCards.addEventListener('click', () => {
          sfx.click();
          mode = 'cards';
          render();
        });
      }
    }

    // Dialog NPC Events
    const npcSpeak = container.querySelector('#btn-npc-speak');
    if (npcSpeak) {
      const dlg = getDialogList()[idx % getDialogList().length];
      npcSpeak.addEventListener('click', () => speakNative(dlg.npcText, meta.speechLang, 0.92));
    }

    container.querySelectorAll('.dialog-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (dialogSolved) return;
        const ok = btn.dataset.ok === 'true';
        const reply = decodeURIComponent(btn.dataset.reply);
        dialogFeedback = { ok, reply };
        if (ok) {
          dialogSolved = true;
          selectedDialogOptIdx = Number(btn.dataset.optIdx);
          const dlgIdx = idx % getDialogList().length;
          const rect = btn.getBoundingClientRect();
          tryAwardPoints(`dialog_${lang}_${dlgIdx}`, 40, rect.left + rect.width / 2, rect.top + rect.height / 2);
        } else {
          sfx.wrong();
        }
        render();
      });
    });

    if (mode === 'cards') {
      bindCardsInteractiveEvents();
    }
  }

  render();
  return () => {
    unmounted = true;
    stopAudioAndMic();
    cleanupTrace();
  };
}
