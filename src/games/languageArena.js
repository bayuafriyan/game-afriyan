// Arena Bahasa Dunia: Inggris (CEFR), Jepang (JLPT), Mandarin (YCT/HSK)
// 4 Mode Interaktif: Speaking (Mic), Writing (Canvas Tracing & Spelling), Dialog NPC, dan Kartu 3 Bahasa

import { LANG_META, LANG_VOCAB, LANG_DIALOGUES } from '../data/languageData.js';
import { speakNative, startListening, isSpeechRecognitionSupported, evaluateSpeech } from '../utils/speech.js';
import { shuffleArray, escapeHtml } from '../utils/quizHelper.js';
import { sfx } from '../utils/audio.js';
import { fx } from '../utils/particles.js';

const TONE_LABELS = {
  1: 'Nada 1 (Datar ˉ)',
  2: 'Nada 2 (Naik ˊ)',
  3: 'Nada 3 (Turun Naik ˇ)',
  4: 'Nada 4 (Turun ˋ)',
  0: 'Nada Netral',
};

export function mountLanguageArena(container, ctx) {
  const { grade, onFinish, onBack } = ctx;
  let lang = 'en'; // 'en' | 'ja' | 'zh'
  let mode = 'speaking'; // 'speaking' | 'writing' | 'dialog' | 'cards'
  let showGuide = true;
  let idx = 0;
  let score = 0;
  let completed = 0;
  let activeRec = null;
  let isListening = false;
  let speakFeedback = null;
  let dialogFeedback = null;
  let writeFeedback = null;
  let strokeCountDrawn = 0;

  let unmounted = false;
  let traceCleanup = null;
  let currentDialogOpts = null;
  let dialogSolved = false;
  let selectedDialogOptIdx = null;
  let sessionCounted = false;
  const rewardedKeys = new Set();

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

  function getVocabList() {
    return LANG_VOCAB[grade] || LANG_VOCAB.SD;
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

  function renderHeader() {
    const meta = LANG_META[lang];
    return `
      <div class="game-hud">
        <div class="hud-group">
          <button id="lg-back" class="btn btn-secondary btn-sm">← Kembali</button>
          <span class="hud-pill">${meta.flag} ${meta.name} (${meta.levelLabel[grade]})</span>
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
        <button class="filter-chip ${mode === 'dialog' ? 'active' : ''}" data-mode="dialog">💬 Dialog NPC</button>
        <button class="filter-chip ${mode === 'cards' ? 'active' : ''}" data-mode="cards">🎴 Kartu 3 Bahasa</button>
      </div>
    `;
  }

  function renderSpeakingBody() {
    const list = getVocabList();
    const item = list[idx % list.length];
    const data = item[lang];
    const meta = LANG_META[lang];
    const readingText = lang === 'en' ? data.phonetic : lang === 'ja' ? `${data.reading} (${data.romaji})` : data.pinyin;
    const toneBadges =
      lang === 'zh' && data.tones
        ? `<div class="tone-row">${data.tones.map((t) => `<span class="tone-badge">${TONE_LABELS[t] || ''}</span>`).join('')}</div>`
        : '';

    return `
      <div class="lang-panel">
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
            <button id="btn-next-word" class="btn btn-secondary btn-sm">Kata Berikutnya →</button>
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
    const list = getVocabList();
    const item = list[idx % list.length];
    const data = item[lang];
    const isCharacterLang = lang === 'ja' || lang === 'zh';
    const readingText = lang === 'en' ? data.phonetic : lang === 'ja' ? `${data.reading} (${data.romaji})` : data.pinyin;

    if (!isCharacterLang) {
      return `
        <div class="lang-panel">
          <div class="lang-card-hero">
            <span class="lang-emoji-big">${item.emoji}</span>
            <div class="lang-meaning" style="font-size:1.15rem;">Tulis dalam Bahasa Inggris: <strong>"${item.id}"</strong></div>
            ${showGuide ? `<div class="lang-reading">Petunjuk: ${data.text[0]}${'_'.repeat(Math.max(1, data.text.length - 1))} (${data.text.length} huruf) • ${data.phonetic}</div>` : ''}
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

          <div style="text-align:center;margin-top:1rem;">
            <button id="btn-next-word" class="btn btn-secondary btn-sm">Kata Berikutnya →</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="lang-panel">
        <div class="write-top-info">
          <div>
            <span class="subject-badge">${item.emoji} ${item.id} • ${data.strokes || 4} Guratan</span>
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
              <button id="btn-next-word" class="btn btn-primary">Aksara Berikutnya →</button>
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

  function renderDialogBody() {
    const dialogs = getDialogList();
    const dlg = dialogs[idx % dialogs.length];
    if (!currentDialogOpts) {
      currentDialogOpts = shuffleArray(dlg.options);
    }

    return `
      <div class="lang-panel">
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
            <button id="btn-next-word" class="btn btn-primary btn-sm">Dialog Berikutnya →</button>
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  function renderCardsBody() {
    const list = getVocabList();
    return `
      <div class="lang-panel">
        <p style="font-weight:700;color:var(--text-secondary);margin-bottom:1rem;">
          Bandingkan 3 bahasa sekaligus untuk setiap kata! Klik tombol 🔊 untuk mendengar pelafalan native.
        </p>
        <div class="tri-cards-grid">
          ${list
            .map(
              (item) => `
            <div class="tri-card">
              <div class="tri-card-head">
                <span class="tri-emoji">${item.emoji}</span>
                <strong>${item.id}</strong>
              </div>
              <div class="tri-row">
                <span>🇬🇧 <strong>${item.en.text}</strong> ${showGuide ? `<small>${item.en.phonetic}</small>` : ''}</span>
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
      </div>
    `;
  }

  function setupTracingCanvas(charText, wordIndex) {
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
        const fontSize = charText.length > 2 ? 92 : charText.length === 2 ? 128 : 205;
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
        const earned = tryAwardPoints(`writing_${lang}_${wordIndex}`, 35);
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
      render();
    });

    container.querySelectorAll('.lang-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        sfx.click();
        stopAudioAndMic();
        lang = btn.dataset.lang;
        idx = 0;
        resetRoundFeedback();
        render();
      });
    });

    container.querySelectorAll('.filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        sfx.click();
        stopAudioAndMic();
        mode = chip.dataset.mode;
        resetRoundFeedback();
        render();
      });
    });

    const list = getVocabList();
    const wordIdx = idx % list.length;
    const item = list[wordIdx];
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

    const nextBtn = container.querySelector('#btn-next-word');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        sfx.click();
        stopAudioAndMic();
        idx++;
        resetRoundFeedback();
        render();
      });
    }

    const selfPass = container.querySelector('#btn-self-pass');
    if (selfPass) {
      selfPass.addEventListener('click', () => {
        const earned = tryAwardPoints(`speaking_${lang}_${wordIdx}`, 25);
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
              const earned = tryAwardPoints(`speaking_${lang}_${wordIdx}`, 40);
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
          const earned = tryAwardPoints(`writing_en_${wordIdx}`, 35);
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
      setupTracingCanvas(data.text, wordIdx);
    }

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

    container.querySelectorAll('.mini-speak-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        speakNative(decodeURIComponent(btn.dataset.txt), btn.dataset.sl, 0.92);
      });
    });
  }

  render();
  return () => {
    unmounted = true;
    stopAudioAndMic();
    cleanupTrace();
  };
}
