// CerdasPlay v2.0 — Main SPA Controller, Grade-Adaptive Themes, Music Studio & 7 Games
import { sfx } from './utils/audio.js';
import { fx } from './utils/particles.js';
import { bgm, RECOMMENDED_TRACKS } from './utils/music.js';
import { icon } from './utils/icons.js';
import { escapeHtml } from './utils/quizHelper.js';
import {
  AVATARS,
  BADGE_DEFS,
  loadProfile,
  saveProfile,
  getLevelInfo,
  recordGameResult,
  hasClaimableQuests,
} from './utils/storage.js';

import { mountLanguageArena } from './games/languageArena.js';
import { mountTkaExam } from './games/tkaExam.js';
import { mountQuizBlitz } from './games/quizBlitz.js';
import { mountMeteorMath } from './games/meteorMath.js';
import { mountMemoryMatch } from './games/memoryMatch.js';
import { mountWordScramble } from './games/wordScramble.js';
import { mountTrueFalse } from './games/trueFalse.js';
import { mountCategorySort } from './games/categorySort.js';
import {
  FEEDBACK_ROLES,
  FEEDBACK_CATEGORIES,
  fetchFeedback,
  sendFeedback,
} from './utils/feedback.js';
import { trackGameplay } from './utils/telemetry.js';

const GAMES = [
  {
    id: 'language',
    featured: true,
    title: 'Bahasa Inggris, Jepang & Mandarin',
    tag: 'Speaking, Writing & Grammar',
    iconKey: 'language',
    accent: '#ec4899',
    bg: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    desc: 'Latihan bicara pakai mikrofon, menulis aksara, susun kalimat grammar 2 model, dan dialog NPC.',
    mount: mountLanguageArena,
  },
  {
    id: 'tka',
    featured: true,
    title: 'Simulasi TKA & Ujian',
    tag: 'Ujian CBT',
    iconKey: 'tka',
    accent: '#fbbf24',
    bg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    desc: 'Latihan ujian lengkap dengan timer, nilai skala 100, dan pembahasan.',
    mount: mountTkaExam,
  },
  {
    id: 'quiz',
    title: 'Cepat Tepat',
    tag: 'Kuis Mapel',
    iconKey: 'quiz',
    accent: '#22d3ee',
    bg: 'linear-gradient(135deg, #06b6d4, #6366f1)',
    desc: 'Pilih mapel favoritmu dan kumpulkan combo poin sebanyak mungkin.',
    mount: mountQuizBlitz,
  },
  {
    id: 'meteor',
    title: 'Meteor Hitung',
    tag: 'Aksi 2D',
    iconKey: 'meteor',
    accent: '#f97316',
    bg: 'linear-gradient(135deg, #f97316, #ec4899)',
    desc: 'Tembak jatuh meteor angka dengan laser sebelum menyentuh planet.',
    mount: mountMeteorMath,
  },
  {
    id: 'memory',
    title: 'Memori Pasangan',
    tag: 'Kartu 3D',
    iconKey: 'memory',
    accent: '#a855f7',
    bg: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    desc: 'Buka kartu dan temukan pasangan rumus, ibu kota, atau istilah.',
    mount: mountMemoryMatch,
  },
  {
    id: 'scramble',
    title: 'Susun Kata',
    tag: 'Teka Teki',
    iconKey: 'scramble',
    accent: '#10b981',
    bg: 'linear-gradient(135deg, #10b981, #22d3ee)',
    desc: 'Rangkai huruf acak menjadi istilah pelajaran yang tepat.',
    mount: mountWordScramble,
  },
  {
    id: 'truefalse',
    title: 'Benar atau Mitos',
    tag: 'Refleks',
    iconKey: 'truefalse',
    accent: '#fbbf24',
    bg: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    desc: 'Tentukan cepat apakah pernyataan di layar fakta atau mitos.',
    mount: mountTrueFalse,
  },
  {
    id: 'sort',
    title: 'Rantai Ilmu',
    tag: 'Sortir',
    iconKey: 'sort',
    accent: '#38bdf8',
    bg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    desc: 'Kelompokkan kartu pengetahuan ke portal kategori yang sesuai.',
    mount: mountCategorySort,
  },
];

const GRADE_INFO = {
  SD: {
    badge: 'Jenjang SD',
    headline: 'Main Sambil <span class="gradient-word">Belajar Seru!</span>',
    tagline: 'Asah berhitung, sains, dan pengetahuan umum dengan game ceria.',
  },
  SMP: {
    badge: 'Jenjang SMP',
    headline: 'Asah Otak & <span class="gradient-word">Naik Level!</span>',
    tagline: 'Taklukkan tantangan mapel SMP, Informatika, dan latihan TKA.',
  },
  SMA: {
    badge: 'Jenjang SMA & SMK',
    headline: 'Siap TKA & <span class="gradient-word">Ujian Juara!</span>',
    tagline: 'Latihan mapel wajib, pilihan, serta simulasi CBT tanpa bosan.',
  },
};

let profile = loadProfile();
let activeCleanup = null;
let currentGameId = null;

const root = document.getElementById('app-root');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');
const toastContainer = document.getElementById('toast-container');

function showToast(emojiOrIcon, text) {
  const el = document.createElement('div');
  el.className = 'toast';
  const iconSpan = document.createElement('span');
  iconSpan.textContent = String(emojiOrIcon ?? '');
  const textSpan = document.createElement('span');
  textSpan.textContent = String(text ?? '');
  el.append(iconSpan, textSpan);
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

function applyGradeTheme(grade) {
  document.documentElement.dataset.grade = grade;
  fx.setGrade(grade);
}

function hydrateStaticIcons() {
  document.getElementById('brand-icon-slot').innerHTML = icon('brand');
  document.getElementById('music-icon-slot').innerHTML = icon('music');
  document.getElementById('quest-icon-slot').innerHTML = icon('quest');
  const feedbackSlot = document.getElementById('feedback-icon-slot');
  if (feedbackSlot) feedbackSlot.innerHTML = icon('feedback');
  const statsSlot = document.getElementById('stats-icon-slot');
  if (statsSlot) statsSlot.innerHTML = icon('chart');
  document.querySelectorAll('.grade-icon-slot').forEach((slot) => {
    slot.innerHTML = icon(slot.dataset.icon);
  });
}

function syncMusicUi(state = bgm.getState()) {
  const btn = document.getElementById('btn-music');
  const eq = document.getElementById('music-eq');
  if (btn) btn.classList.toggle('playing', state.isPlaying);
  if (eq) eq.classList.toggle('hidden', !state.isPlaying);
}

function syncTopbar() {
  const lv = getLevelInfo(profile.xp);
  document.getElementById('nav-avatar').textContent = profile.avatar;
  document.getElementById('nav-name').textContent = profile.name;
  document.getElementById('nav-level').textContent = `Lv. ${lv.level} • ${profile.xp} XP`;
  document.getElementById('sound-icon').innerHTML = icon(sfx.enabled ? 'soundOn' : 'soundOff');

  const questDot = document.getElementById('quest-dot');
  if (questDot) {
    questDot.classList.toggle('hidden', !hasClaimableQuests(profile));
  }

  document.querySelectorAll('.grade-pill').forEach((btn) => {
    const active = btn.dataset.grade === profile.grade;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-checked', String(active));
  });

  syncMusicUi();
}

function cleanupCurrentView() {
  if (typeof activeCleanup === 'function') {
    activeCleanup();
    activeCleanup = null;
  }
}

function renderHome() {
  cleanupCurrentView();
  currentGameId = null;
  applyGradeTheme(profile.grade);
  syncTopbar();

  const lv = getLevelInfo(profile.xp);
  const gInfo = GRADE_INFO[profile.grade];

  root.innerHTML = `
    <section class="hero-banner">
      <div class="hero-left">
        <div class="hero-badge">✨ ${gInfo.badge}</div>
        <h1 class="hero-title">${gInfo.headline}</h1>
        <p class="hero-desc">${gInfo.tagline}</p>
        <div class="hero-actions">
          <button id="btn-start-lang" class="btn btn-success">🌍 Arena 3 Bahasa</button>
          <button id="btn-start-tka" class="btn btn-amber">🎯 Simulasi TKA</button>
          <button id="btn-quick-play" class="btn btn-primary">🎲 Game Acak</button>
          <button id="btn-open-music" class="btn btn-secondary">${icon('music')} Musik</button>
        </div>
      </div>

      <div class="hero-stats-card">
        <div class="stats-header">
          <div class="hero-avatar-big">${profile.avatar}</div>
          <div>
            <div class="stats-title">${escapeHtml(profile.name)}</div>
            <div class="stats-rank">Level ${lv.level} • ${lv.rank}</div>
          </div>
        </div>
        <div class="xp-bar-wrap">
          <div class="xp-bar-labels">
            <span>Menuju Level ${lv.level + 1}</span>
            <span>${lv.currentXp} / ${lv.neededXp} XP</span>
          </div>
          <div class="xp-bar-track">
            <div class="xp-bar-fill" style="width: ${lv.pct}%"></div>
          </div>
        </div>
        <div class="mini-stats-grid">
          <div class="mini-stat">
            <strong>${profile.gamesPlayed}</strong>
            <span>Main</span>
          </div>
          <div class="mini-stat">
            <strong>${profile.bestStreak}x</strong>
            <span>Combo</span>
          </div>
          <div class="mini-stat">
            <strong>${profile.badges.length}/${BADGE_DEFS.length}</strong>
            <span>Lencana</span>
          </div>
        </div>
      </div>
    </section>

    <div class="section-head">
      <div>
        <h2>🎮 Pilih Game (${profile.grade})</h2>
        <p>Pilih permainan yang kamu suka dan kumpulkan skor tertinggi.</p>
      </div>
    </div>

    <section class="games-grid">
      ${GAMES.map((game) => {
        const best = profile.highScores[`${game.id}_${profile.grade}`] || 0;
        return `
          <article class="game-card ${game.featured ? 'featured-tka' : ''}" data-game="${game.id}" style="--card-bg-banner:${game.bg};">
            <div class="game-card-banner">
              <div class="game-icon-box">${icon(game.iconKey)}</div>
              <span class="game-tag">${game.tag}</span>
            </div>
            <div class="game-card-body">
              <h3>${game.title}</h3>
              <p>${game.desc}</p>
              <div class="game-card-footer">
                <span class="best-score">${best > 0 ? `🏆 Rekor: ${best}` : '🆕 Baru'}</span>
                <span class="play-cta">MAIN ▶</span>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </section>

    <footer class="lobby-footer">
      <span>📚 Soal latihan mandiri berbasis kurikulum nasional • Data progres tersimpan aman di perangkatmu</span>
      <div class="footer-actions">
        <button id="btn-open-feedback" class="btn btn-primary btn-sm">💬 Kritik &amp; Saran</button>
        <a href="/statistik" class="btn btn-secondary btn-sm" style="text-decoration:none;">📊 Statistik &amp; Data</a>
        <button id="btn-open-info" class="btn btn-secondary btn-sm">ℹ️ Info Orang Tua &amp; Guru</button>
      </div>
    </footer>
  `;

  root.querySelectorAll('.game-card').forEach((card) => {
    card.addEventListener('click', () => {
      sfx.click();
      launchGame(card.dataset.game);
    });
  });

  root.querySelector('#btn-start-lang').addEventListener('click', () => {
    sfx.click();
    launchGame('language');
  });

  root.querySelector('#btn-start-tka').addEventListener('click', () => {
    sfx.click();
    launchGame('tka');
  });

  root.querySelector('#btn-quick-play').addEventListener('click', () => {
    sfx.click();
    const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
    launchGame(randomGame.id);
  });

  root.querySelector('#btn-open-music').addEventListener('click', () => {
    sfx.click();
    openMusicModal();
  });

  root.querySelector('#btn-open-feedback').addEventListener('click', () => {
    sfx.click();
    openFeedbackModal();
  });

  root.querySelector('#btn-open-info').addEventListener('click', () => {
    sfx.click();
    openInfoModal();
  });
}

function formatFeedbackDate(isoStr) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(isoStr));
  } catch {
    return '';
  }
}

function renderFeedbackList(container, items) {
  container.replaceChildren();
  if (!items || items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'feedback-meta';
    empty.textContent = 'Belum ada masukan tersimpan. Jadilah yang pertama memberi saran!';
    container.appendChild(empty);
    return;
  }

  for (const item of items) {
    const card = document.createElement('article');
    card.className = 'feedback-item';

    const top = document.createElement('div');
    top.className = 'feedback-item-top';

    const author = document.createElement('span');
    author.className = 'feedback-author';
    author.textContent = `${item.name || 'Sahabat Belajar'} (${item.role || 'Umum'})`;

    const stars = document.createElement('span');
    stars.className = 'feedback-stars';
    const r = Math.min(5, Math.max(1, Number(item.rating) || 5));
    stars.textContent = `${'★'.repeat(r)}${'☆'.repeat(5 - r)}`;

    top.append(author, stars);

    const meta = document.createElement('div');
    meta.className = 'feedback-meta';
    const formattedDate = formatFeedbackDate(item.created_at);
    meta.textContent = formattedDate
      ? `${item.category || 'Saran Fitur'} • ${formattedDate}`
      : `${item.category || 'Saran Fitur'}`;

    const body = document.createElement('p');
    body.className = 'feedback-body';
    body.textContent = String(item.message || '');

    card.append(top, meta, body);
    container.appendChild(card);
  }
}

function openFeedbackModal() {
  const modalOpenedAt = Date.now();
  let selectedRating = 5;

  openModal(`
    <div class="modal-header">
      <h2>${icon('feedback')} Kritik &amp; Saran</h2>
      <button class="modal-close" id="m-close" aria-label="Tutup">✕</button>
    </div>

    <div class="feedback-shield-banner">
      <span>${icon('shield')}</span>
      <span>Masukanmu membantu kami meningkatkan kualitas materi soal, game, dan kenyamanan belajar. Jangan sertakan data pribadi sensitif atau tautan eksternal.</span>
    </div>

    <form id="fb-form" class="feedback-form" novalidate>
      <input type="text" id="fb-website" name="website" class="hp-trap" tabindex="-1" autocomplete="off" aria-hidden="true" />

      <div class="feedback-row">
        <div>
          <label class="feedback-label" for="fb-name">Nama (opsional)</label>
          <input id="fb-name" class="feedback-input" type="text" maxlength="40" placeholder="Contoh: Raka (kosong = anonim)" />
        </div>
        <div>
          <label class="feedback-label" for="fb-role">Peran</label>
          <select id="fb-role" class="feedback-select">
            ${FEEDBACK_ROLES.map((role) => `<option value="${escapeHtml(role)}">${escapeHtml(role)}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="feedback-row">
        <div>
          <label class="feedback-label" for="fb-category">Kategori</label>
          <select id="fb-category" class="feedback-select">
            ${FEEDBACK_CATEGORIES.map((cat) => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('')}
          </select>
        </div>
        <div>
          <span class="feedback-label">Penilaian Kamu</span>
          <div id="fb-stars" class="star-picker" role="group" aria-label="Pilih rating 1 sampai 5 bintang">
            ${[1, 2, 3, 4, 5]
              .map(
                (n) =>
                  `<button type="button" class="star-btn active" data-star="${n}" aria-label="${n} bintang">★</button>`
              )
              .join('')}
          </div>
        </div>
      </div>

      <div>
        <label class="feedback-label" for="fb-message">Pesan Kritik &amp; Saran</label>
        <textarea id="fb-message" class="feedback-textarea" maxlength="600" placeholder="Tulis saran fitur, usulan kosakata atau materi TKA, laporan bug, maupun apresiasi..."></textarea>
        <div class="feedback-char-row">
          <span>Minimal 10 karakter, tanpa tautan URL.</span>
          <span id="fb-count">0 / 600</span>
        </div>
      </div>

      <div id="fb-alert" class="feedback-alert hidden" role="status"></div>

      <button type="submit" id="fb-submit" class="btn btn-primary">Kirim Kritik &amp; Saran</button>
    </form>

    <div class="feedback-list-head">
      <strong style="font-size:0.94rem;">Masukan Terbaru</strong>
      <div style="display:flex;gap:0.45rem;align-items:center;flex-wrap:wrap;">
        <span id="fb-stats" class="feedback-meta">Memuat...</span>
        <span id="fb-source-pill" class="feedback-source-pill">Terhubung</span>
        <a href="/statistik" class="feedback-source-pill" style="text-decoration:none;">📊 Lihat Grafik &amp; Rekap</a>
      </div>
    </div>
    <div id="fb-list" class="feedback-list"></div>
  `);

  modalContent.querySelector('#m-close').addEventListener('click', closeModal);

  const starBtns = modalContent.querySelectorAll('#fb-stars .star-btn');
  const syncStars = () => {
    starBtns.forEach((btn) => {
      const val = Number(btn.dataset.star);
      btn.classList.toggle('active', val <= selectedRating);
    });
  };
  starBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sfx.click();
      selectedRating = Number(btn.dataset.star) || 5;
      syncStars();
    });
  });

  const msgEl = modalContent.querySelector('#fb-message');
  const countEl = modalContent.querySelector('#fb-count');
  msgEl.addEventListener('input', () => {
    countEl.textContent = `${msgEl.value.length} / 600`;
  });

  const alertEl = modalContent.querySelector('#fb-alert');
  const setAlert = (type, text) => {
    alertEl.className = `feedback-alert ${type === 'error' ? 'is-error' : 'is-success'}`;
    alertEl.textContent = text;
    alertEl.classList.remove('hidden');
  };

  const listEl = modalContent.querySelector('#fb-list');
  const statsEl = modalContent.querySelector('#fb-stats');
  const sourcePillEl = modalContent.querySelector('#fb-source-pill');

  const refreshList = async () => {
    const res = await fetchFeedback(12);
    sourcePillEl.textContent = res.source === 'server' ? 'Database Server' : 'Offline Lokal';
    statsEl.textContent = `${res.stats?.total || 0} masukan • ★ ${res.stats?.avgRating || 0}`;
    renderFeedbackList(listEl, res.items);
  };
  refreshList();

  const formEl = modalContent.querySelector('#fb-form');
  const submitBtn = modalContent.querySelector('#fb-submit');
  formEl.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    alertEl.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    const result = await sendFeedback({
      name: modalContent.querySelector('#fb-name').value,
      role: modalContent.querySelector('#fb-role').value,
      category: modalContent.querySelector('#fb-category').value,
      rating: selectedRating,
      message: msgEl.value,
      website: modalContent.querySelector('#fb-website').value,
      elapsedMs: Date.now() - modalOpenedAt,
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Kirim Kritik & Saran';

    if (!result.ok) {
      sfx.wrong();
      setAlert('error', result.error || 'Gagal mengirim kritik dan saran.');
      return;
    }

    sfx.correct(2);
    msgEl.value = '';
    countEl.textContent = '0 / 600';
    setAlert(
      'success',
      result.source === 'server'
        ? 'Terima kasih! Kritik dan saran kamu berhasil tersimpan di server.'
        : 'Tersimpan secara lokal di perangkat (mode offline).'
    );
    showToast(
      '💬',
      result.source === 'server'
        ? 'Kritik & saran terkirim ke server!'
        : 'Kritik & saran tersimpan lokal.'
    );
    await refreshList();
  });
}

function launchGame(gameId) {
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) return;
  cleanupCurrentView();
  currentGameId = gameId;

  const activeGrade = profile.grade;
  trackGameplay({ eventType: 'game_start', gameId, grade: activeGrade });

  activeCleanup = game.mount(root, {
    grade: activeGrade,
    onBack: () => renderHome(),
    onFinish: (result) => {
      const meta = recordGameResult(profile, result);
      if (!result?.isStep) {
        trackGameplay({
          eventType: 'game_complete',
          gameId: result?.gameId || gameId,
          grade: result?.grade || activeGrade,
          score: result?.score || 0,
          xpEarned: result?.xpEarned || 0,
        });
      }
      syncTopbar();
      if (meta.leveledUp) {
        sfx.levelUp();
        fx.confetti();
        showToast('🎉', `Naik ke Level ${meta.newLevel}! Keren banget!`);
      }
      for (const b of meta.newlyUnlocked) {
        showToast(b.icon, `Lencana Terbuka: ${b.name}!`);
      }
      return meta;
    },
  });
}

// Modals
function openModal(html) {
  modalContent.innerHTML = html;
  modalBackdrop.classList.remove('hidden');
}

function closeModal() {
  modalBackdrop.classList.add('hidden');
}

function openMusicModal() {
  const st = bgm.getState();
  openModal(`
    <div class="modal-header">
      <h2>${icon('music')} Studio Musik & BGM</h2>
      <button class="modal-close" id="m-close">✕</button>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:0.8rem;padding:0.8rem 1rem;border-radius:16px;background:#f1f5f9;border:2px solid #cbd5e1;">
      <div>
        <div style="font-size:0.73rem;color:var(--text-muted);font-weight:800;">SEDANG DIPILIH</div>
        <strong style="font-family:var(--font-display);font-size:1.05rem;color:#0f172a;">${escapeHtml(st.currentTitle)}</strong>
      </div>
      <button id="m-toggle-play" class="btn ${st.isPlaying ? 'btn-danger' : 'btn-success'} btn-sm">
        ${st.isPlaying ? `${icon('pause')} Jeda` : `${icon('play')} Putar Musik`}
      </button>
    </div>

    <div class="volume-row">
      <span style="font-size:0.84rem;font-weight:800;min-width:82px;color:#0f172a;">🔊 Volume</span>
      <input id="m-vol" type="range" min="0" max="1" step="0.05" value="${st.volume}" />
      <span id="m-vol-val" style="font-size:0.82rem;font-weight:800;min-width:36px;color:#0f172a;">${Math.round(st.volume * 100)}%</span>
    </div>

    <div style="font-size:0.85rem;font-weight:800;margin:0.85rem 0 0.5rem;color:var(--primary);">
      ✨ Musik Rekomendasi (Bebas Hak Cipta & Offline)
    </div>
    <div class="music-track-list">
      ${RECOMMENDED_TRACKS.map((t) => {
        const active = st.mode === 'recommended' && st.trackId === t.id;
        return `
          <div class="music-track-card ${active ? 'active' : ''}" data-track="${t.id}">
            <div>
              <strong style="font-size:0.94rem;color:#0f172a;">${t.title}</strong>
              <span style="display:inline-block;margin-left:0.4rem;font-size:0.7rem;font-weight:800;padding:0.18rem 0.55rem;border-radius:8px;background:#e0f2fe;color:#0369a1;">${t.badge}</span>
              <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.15rem;font-weight:600;">${t.desc}</div>
            </div>
            <span style="font-weight:800;font-size:0.82rem;color:${active ? '#16a34a' : 'var(--primary)'};">
              ${active && st.isPlaying ? '▶ Aktif' : 'Pilih'}
            </span>
          </div>
        `;
      }).join('')}
    </div>

    <div style="font-size:0.85rem;font-weight:800;margin:0.9rem 0 0.5rem;color:#b45309;">
      🎧 Custom Musik Sendiri (MP3 / WAV / OGG / URL)
    </div>
    <div class="music-custom-box">
      <div style="display:flex;flex-wrap:wrap;gap:0.6rem;align-items:center;margin-bottom:0.75rem;">
        <label class="btn btn-primary btn-sm" style="cursor:pointer;">
          ${icon('upload')} Upload Lagu dari Perangkat
          <input id="m-file-input" type="file" accept="audio/*" style="display:none;" />
        </label>
        <span style="font-size:0.78rem;color:var(--text-muted);">
          ${st.customName ? `Aktif: ${escapeHtml(st.customName)}` : 'Format: MP3, WAV, M4A, OGG'}
        </span>
      </div>
      <div style="display:flex;gap:0.5rem;">
        <input id="m-url-input" class="text-input" placeholder="Atau tempel URL audio langsung (https://.../lagu.mp3)" />
        <button id="m-url-btn" class="btn btn-secondary btn-sm">Putar</button>
      </div>
    </div>
  `);

  modalContent.querySelector('#m-close').addEventListener('click', closeModal);

  modalContent.querySelector('#m-toggle-play').addEventListener('click', () => {
    bgm.toggle(() => {
      showToast('⚠️', 'Audio custom gagal diputar. Coba pilih musik rekomendasi atau unggah file lain.');
    });
    openMusicModal();
  });

  const volInput = modalContent.querySelector('#m-vol');
  const volVal = modalContent.querySelector('#m-vol-val');
  volInput.addEventListener('input', () => {
    bgm.setVolume(volInput.value);
    volVal.textContent = `${Math.round(volInput.value * 100)}%`;
  });

  modalContent.querySelectorAll('.music-track-card').forEach((card) => {
    card.addEventListener('click', () => {
      bgm.selectRecommended(card.dataset.track, true);
      showToast('🎵', `Memutar: ${bgm.getState().currentTitle}`);
      openMusicModal();
    });
  });

  modalContent.querySelector('#m-file-input').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = bgm.loadCustomFile(file, () => {
        showToast('⚠️', 'File audio harus berformat MP3/WAV/OGG/M4A maksimal 50 MB.');
      });
      if (ok) {
        showToast('🎧', `Memutar lagu custom: ${bgm.getState().currentTitle}`);
        openMusicModal();
      }
    }
  });

  modalContent.querySelector('#m-url-btn').addEventListener('click', () => {
    const url = modalContent.querySelector('#m-url-input').value.trim();
    if (!url) return;
    const ok = bgm.loadCustomUrl(url, 'Audio URL Custom', () => {
      showToast('⚠️', 'Gunakan tautan HTTPS publik langsung ke file audio MP3/OGG (tanpa IP privat/localhost).');
    });
    if (ok) {
      showToast('🎧', 'Memutar musik dari URL custom...');
      openMusicModal();
    }
  });
}

function openInfoModal() {
  openModal(`
    <div class="modal-header">
      <h2>ℹ️ Info Orang Tua & Guru</h2>
      <button class="modal-close" id="m-close">✕</button>
    </div>
    <div class="info-list">
      <div class="info-card">
        <strong>🔒 Privasi Anak Aman</strong>
        <p>Game ini berjalan tanpa akun atau login. Nama panggilan, avatar, XP, dan skor hanya tersimpan di browser perangkat masing-masing (localStorage) dan tidak dikirim ke server.</p>
      </div>
      <div class="info-card">
        <strong>📚 Soal Latihan Mandiri</strong>
        <p>Seluruh soal bertanda Latihan TKA, ANBK, Ujian Sekolah, dan UTBK disusun sebagai bahan latihan edukatif mengacu kisi-kisi kurikulum nasional, bukan naskah resmi pemerintah.</p>
      </div>
      <div class="info-card">
        <strong>🎙️ Fitur Suara & Mikrofon</strong>
        <p>Pada menu Arena 3 Bahasa, fitur Speaking memakai layanan pengenalan suara bawaan browser (Web Speech API) dan hanya aktif saat tombol mikrofon ditekan.</p>
      </div>
      <div class="info-card">
        <strong>🎵 Musik Latar Lokal</strong>
        <p>File musik custom yang dipilih dari perangkat hanya diputar langsung di browser perangkat tersebut dan tidak pernah diunggah ke internet.</p>
      </div>
      <div class="info-card">
        <strong>🛡️ Keamanan Siber Berlapis</strong>
        <p>Website dilindungi HTTPS TLS 1.3, header keamanan ketat (CSP, anti-clickjacking DENY, COOP/CORP), sanitasi input bebas XSS, proteksi CSRF/anti-bot, serta pembatasan laju permintaan di jaringan tepi.</p>
      </div>
    </div>
  `);
  modalContent.querySelector('#m-close').addEventListener('click', closeModal);
}

function openProfileModal() {
  const lv = getLevelInfo(profile.xp);
  openModal(`
    <div class="modal-header">
      <h2>👤 Profil & Lencana Pelajar</h2>
      <button class="modal-close" id="m-close">✕</button>
    </div>

    <label style="display:block;font-size:0.84rem;color:var(--text-secondary);margin-bottom:0.35rem;font-weight:700;">
      Nama Pemain
    </label>
    <input id="inp-name" class="text-input" maxlength="22" value="${escapeHtml(profile.name)}" />

    <label style="display:block;font-size:0.84rem;color:var(--text-secondary);margin-top:1rem;font-weight:700;">
      Pilih Avatar
    </label>
    <div class="avatar-grid">
      ${AVATARS.map(
        (av) => `
        <button class="avatar-option ${av === profile.avatar ? 'selected' : ''}" data-av="${av}">${av}</button>
      `
      ).join('')}
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
      <strong style="font-family:var(--font-display);font-size:1.05rem;">🏅 Koleksi Lencana (${profile.badges.length}/${BADGE_DEFS.length})</strong>
      <span style="font-size:0.8rem;color:var(--primary);font-weight:800;">Lv. ${lv.level} • ${lv.rank}</span>
    </div>

    <div class="badges-grid">
      ${BADGE_DEFS.map((b) => {
        const unlocked = profile.badges.includes(b.id);
        return `
          <div class="badge-item ${unlocked ? 'unlocked' : 'locked'}">
            <span class="b-icon">${b.icon}</span>
            <strong>${b.name}</strong>
            <small>${b.desc}</small>
          </div>
        `;
      }).join('')}
    </div>

    <div style="margin-top:1.3rem;display:flex;justify-content:flex-end;gap:0.6rem;">
      <button id="m-save" class="btn btn-primary btn-sm">Simpan Profil ✓</button>
    </div>
  `);

  let selectedAvatar = profile.avatar;
  modalContent.querySelector('#m-close').addEventListener('click', closeModal);
  modalContent.querySelectorAll('.avatar-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      sfx.click();
      selectedAvatar = btn.dataset.av;
      modalContent.querySelectorAll('.avatar-option').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  modalContent.querySelector('#m-save').addEventListener('click', () => {
    const newName = modalContent.querySelector('#inp-name').value.trim();
    profile.name = newName || 'Pelajar Hebat';
    profile.avatar = selectedAvatar;
    saveProfile(profile);
    syncTopbar();
    if (!currentGameId) renderHome();
    sfx.correct(2);
    showToast('✅', 'Profil berhasil disimpan!');
    closeModal();
  });
}

function openQuestsModal() {
  openModal(`
    <div class="modal-header">
      <h2>🎯 Misi Harian</h2>
      <button class="modal-close" id="m-close">✕</button>
    </div>
    <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:1rem;">
      Selesaikan misi setiap hari untuk mendapatkan bonus XP dan naik level lebih cepat!
    </p>
    <div class="quest-list">
      ${profile.quests.items
        .map((q) => {
          const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
          const ready = q.progress >= q.target && !q.claimed;
          return `
            <div class="quest-row ${q.claimed ? 'done' : ''}">
              <div>
                <strong style="font-size:0.94rem;">${q.title}</strong>
                <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.15rem;">
                  Progres: ${q.progress}/${q.target} • Hadiah: +${q.reward} XP
                </div>
                <div class="quest-bar">
                  <div class="quest-bar-fill" style="width:${pct}%"></div>
                </div>
              </div>
              ${
                q.claimed
                  ? `<span style="color:#15803d;font-weight:800;font-size:0.85rem;">✓ Selesai</span>`
                  : ready
                    ? `<button class="btn btn-success btn-sm claim-quest-btn" data-qid="${q.id}">Klaim +${q.reward} XP</button>`
                    : `<span style="color:var(--text-muted);font-size:0.8rem;font-weight:700;">${pct}%</span>`
              }
            </div>
          `;
        })
        .join('')}
    </div>
  `);

  modalContent.querySelector('#m-close').addEventListener('click', closeModal);
  modalContent.querySelectorAll('.claim-quest-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = profile.quests.items.find((item) => item.id === btn.dataset.qid);
      if (!q || q.claimed || q.progress < q.target) return;
      const prevLv = getLevelInfo(profile.xp).level;
      q.claimed = true;
      profile.xp += q.reward;
      saveProfile(profile);
      syncTopbar();
      sfx.fanfare();
      fx.confetti();
      showToast('🎁', `Hadiah +${q.reward} XP berhasil diklaim!`);
      const newLv = getLevelInfo(profile.xp).level;
      if (newLv > prevLv) {
        showToast('🎉', `Naik ke Level ${newLv}!`);
      }
      if (!currentGameId) renderHome();
      openQuestsModal();
    });
  });
}

// Global Event Listeners
function initEvents() {
  document.getElementById('btn-home-logo').addEventListener('click', () => {
    sfx.click();
    renderHome();
  });

  document.querySelectorAll('.grade-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextGrade = btn.dataset.grade;
      if (nextGrade === profile.grade) return;
      sfx.click();
      profile.grade = nextGrade;
      saveProfile(profile);
      applyGradeTheme(nextGrade);
      bgm.recommendForGrade(nextGrade);
      syncTopbar();
      showToast('🎓', `Jenjang & tema diganti ke ${nextGrade}!`);
      if (currentGameId) launchGame(currentGameId);
      else renderHome();
    });
  });

  document.getElementById('btn-music').addEventListener('click', () => {
    sfx.click();
    openMusicModal();
  });

  document.getElementById('btn-sound').addEventListener('click', () => {
    const on = sfx.toggle();
    syncTopbar();
    showToast(on ? '🔊' : '🔇', on ? 'Efek suara dinyalakan' : 'Efek suara dimatikan');
  });

  document.getElementById('btn-profile').addEventListener('click', () => {
    sfx.click();
    openProfileModal();
  });

  document.getElementById('btn-quests').addEventListener('click', () => {
    sfx.click();
    openQuestsModal();
  });

  document.getElementById('btn-feedback')?.addEventListener('click', () => {
    sfx.click();
    openFeedbackModal();
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  bgm.onChange((st) => syncMusicUi(st));
}

// Bootstrap
hydrateStaticIcons();
fx.init(profile.grade);
applyGradeTheme(profile.grade);
initEvents();
renderHome();
