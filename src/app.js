// CerdasPlay v2.0 — Main SPA Controller, Grade-Adaptive Themes, Music Studio & 7 Games
import { sfx } from './utils/audio.js';
import { fx } from './utils/particles.js';
import { bgm, RECOMMENDED_TRACKS } from './utils/music.js';
import { icon } from './utils/icons.js';
import {
  AVATARS,
  BADGE_DEFS,
  loadProfile,
  saveProfile,
  getLevelInfo,
  recordGameResult,
  hasClaimableQuests,
} from './utils/storage.js';

import { mountTkaExam } from './games/tkaExam.js';
import { mountQuizBlitz } from './games/quizBlitz.js';
import { mountMeteorMath } from './games/meteorMath.js';
import { mountMemoryMatch } from './games/memoryMatch.js';
import { mountWordScramble } from './games/wordScramble.js';
import { mountTrueFalse } from './games/trueFalse.js';
import { mountCategorySort } from './games/categorySort.js';

const GAMES = [
  {
    id: 'tka',
    featured: true,
    title: 'Simulasi TKA & Ujian CBT',
    tag: 'TKA 2025/2026 • US • ANBK • UTBK',
    iconKey: 'tka',
    accent: '#fbbf24',
    bg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    desc: 'Latihan ujian model CBT asli lengkap dengan timer, navigasi nomor, tanda ragu-ragu, nilai skala 100 & pembahasan lengkap.',
    mount: mountTkaExam,
  },
  {
    id: 'quiz',
    title: 'Cepat Tepat Arena',
    tag: 'Kuis • Semua Mapel Merdeka & K13',
    iconKey: 'quiz',
    accent: '#22d3ee',
    bg: 'linear-gradient(135deg, #06b6d4, #6366f1)',
    desc: 'Pilih mata pelajaran favoritmu! Jawab soal ber-timer dengan combo, bantuan 50:50, Bekukan Waktu & pembahasan instan.',
    mount: mountQuizBlitz,
  },
  {
    id: 'meteor',
    title: 'Meteor Hitung',
    tag: 'Aksi Arcade • Matematika',
    iconKey: 'meteor',
    accent: '#f97316',
    bg: 'linear-gradient(135deg, #f97316, #ec4899)',
    desc: 'Lindungi planetmu! Hitung cepat soal matematika pada meteor yang jatuh dan tembakkan laser sebelum menabrak perisai.',
    mount: mountMeteorMath,
  },
  {
    id: 'memory',
    title: 'Memori Pasangan',
    tag: 'Daya Ingat • Konsep',
    iconKey: 'memory',
    accent: '#a855f7',
    bg: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    desc: 'Buka kartu animasi 3D dan jodohkan pasangan pengetahuan: rumus kimia, ibu kota, tokoh sejarah, hingga trigonometri.',
    mount: mountMemoryMatch,
  },
  {
    id: 'scramble',
    title: 'Susun Kata Cerdas',
    tag: 'Teka-Teki • Kosakata',
    iconKey: 'scramble',
    accent: '#10b981',
    bg: 'linear-gradient(135deg, #10b981, #22d3ee)',
    desc: 'Rangkai huruf acak menjadi istilah sains, geografi, sejarah, atau ekonomi berdasarkan petunjuk cerdas.',
    mount: mountWordScramble,
  },
  {
    id: 'truefalse',
    title: 'Benar atau Mitos?',
    tag: 'Refleks • Fakta Sains',
    iconKey: 'truefalse',
    accent: '#fbbf24',
    bg: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    desc: 'Tentukan dalam hitungan detik apakah pernyataan di layar adalah fakta ilmiah atau cuma mitos belaka!',
    mount: mountTrueFalse,
  },
  {
    id: 'sort',
    title: 'Rantai Ilmu',
    tag: 'Klasifikasi • Logika',
    iconKey: 'sort',
    accent: '#38bdf8',
    bg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    desc: 'Sortir kartu pengetahuan ke portal kategori yang tepat: hewan, wujud benda, unsur/senyawa, asam/basa, hingga ekonomi.',
    mount: mountCategorySort,
  },
];

const GRADE_INFO = {
  SD: {
    label: 'Sekolah Dasar (Fase A–C • Kelas 1–6)',
    themeName: 'Tema Petualangan Langit Ceria',
    tagline: 'Belajar Matematika, IPAS, B. Indonesia, B. Inggris, Pancasila, Seni & persiapan TKA/ANBK SD sambil bermain!',
    curricula: ['Kurikulum Merdeka', 'K13 Tematik', 'TKA SD (Mat & B.Indo)', 'ANBK & Ujian Sekolah'],
  },
  SMP: {
    label: 'Sekolah Menengah Pertama (Fase D • Kelas 7–9)',
    themeName: 'Tema Cyber-Lab Explorer',
    tagline: 'Asah Matematika, IPA, IPS, Informatika, Bahasa, Pancasila & latihan soal TKA SMP dengan nuansa laboratorium modern!',
    curricula: ['Kurikulum Merdeka', 'K13 SMP', 'TKA SMP (Mat & B.Indo)', 'Informatika & ANBK'],
  },
  SMA: {
    label: 'SMA / MA / SMK (Fase E–F • Kelas 10–12)',
    themeName: 'Tema Aurora Observatory',
    tagline: 'Taklukkan mapel wajib & pilihan (MIPA, IPS, Bahasa, PKWU) serta simulasi TKA 2025/2026 & UTBK-SNBT!',
    curricula: ['Kurikulum Merdeka', 'K13 MIPA/IPS', 'TKA SMA Wajib & Pilihan', 'UTBK-SNBT & SMK'],
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
  el.innerHTML = `<span>${emojiOrIcon}</span><span>${text}</span>`;
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

function applyGradeTheme(grade) {
  document.documentElement.dataset.grade = grade;
  fx.setGrade(grade);
  bgm.recommendForGrade(grade);
}

function hydrateStaticIcons() {
  document.getElementById('brand-icon-slot').innerHTML = icon('brand');
  document.getElementById('music-icon-slot').innerHTML = icon('music');
  document.getElementById('quest-icon-slot').innerHTML = icon('quest');
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
        <div class="hero-badge">✨ ${gInfo.label} • ${gInfo.themeName}</div>
        <h1 class="hero-title">
          Belajar Jadi <span class="gradient-word">Petualangan Seru</span> Tanpa Bosan!
        </h1>
        <p class="hero-desc">${gInfo.tagline}</p>
        <div class="curriculum-tags">
          ${gInfo.curricula.map((c) => `<span class="curr-pill">✓ ${c}</span>`).join('')}
        </div>
        <div class="hero-actions">
          <button id="btn-start-tka" class="btn btn-amber">🎯 Simulasi TKA & Ujian</button>
          <button id="btn-quick-play" class="btn btn-primary">🎲 Game Acak</button>
          <button id="btn-open-music" class="btn btn-secondary">${icon('music')} Studio Musik</button>
        </div>
      </div>

      <div class="hero-stats-card">
        <div class="stats-header">
          <div class="hero-avatar-big">${profile.avatar}</div>
          <div>
            <div class="stats-title">${profile.name}</div>
            <div class="stats-rank">Level ${lv.level} • ${lv.rank}</div>
          </div>
        </div>
        <div class="xp-bar-wrap">
          <div class="xp-bar-labels">
            <span>Progres Level ${lv.level + 1}</span>
            <span>${lv.currentXp} / ${lv.neededXp} XP</span>
          </div>
          <div class="xp-bar-track">
            <div class="xp-bar-fill" style="width: ${lv.pct}%"></div>
          </div>
        </div>
        <div class="mini-stats-grid">
          <div class="mini-stat">
            <strong>${profile.gamesPlayed}</strong>
            <span>Ronde Main</span>
          </div>
          <div class="mini-stat">
            <strong>${profile.bestStreak}x</strong>
            <span>Rekor Combo</span>
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
        <h2>🎮 Pilih Arena Permainan (${profile.grade})</h2>
        <p>7 mode permainan edukasi & simulasi ujian — otomatis menyesuaikan font, animasi & materi jenjang ${profile.grade}.</p>
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
  `;

  root.querySelectorAll('.game-card').forEach((card) => {
    card.addEventListener('click', () => {
      sfx.click();
      launchGame(card.dataset.game);
    });
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
}

function launchGame(gameId) {
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) return;
  cleanupCurrentView();
  currentGameId = gameId;

  activeCleanup = game.mount(root, {
    grade: profile.grade,
    onBack: () => renderHome(),
    onFinish: (result) => {
      const meta = recordGameResult(profile, result);
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
        <strong style="font-family:var(--font-display);font-size:1.05rem;color:#0f172a;">${st.currentTitle}</strong>
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
          ${st.customName ? `Aktif: ${st.customName}` : 'Format: MP3, WAV, M4A, OGG'}
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
    bgm.toggle();
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
      bgm.loadCustomFile(file);
      showToast('🎧', `Memutar lagu custom: ${file.name}`);
      openMusicModal();
    }
  });

  modalContent.querySelector('#m-url-btn').addEventListener('click', () => {
    const url = modalContent.querySelector('#m-url-input').value.trim();
    if (!url) return;
    bgm.loadCustomUrl(url, 'Audio URL Custom');
    showToast('🎧', 'Memutar musik dari URL custom...');
    openMusicModal();
  });
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
    <input id="inp-name" class="text-input" maxlength="22" value="${profile.name}" />

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
                  ? `<span style="color:var(--accent-emerald);font-weight:800;font-size:0.85rem;">✓ Selesai</span>`
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
