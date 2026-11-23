// CerdasPlay — Main SPA Controller, Home Hub, Modals & Navigation
import { sfx } from './utils/audio.js';
import { fx } from './utils/particles.js';
import {
  AVATARS,
  BADGE_DEFS,
  loadProfile,
  saveProfile,
  getLevelInfo,
  recordGameResult,
  hasClaimableQuests,
} from './utils/storage.js';

import { mountQuizBlitz } from './games/quizBlitz.js';
import { mountMeteorMath } from './games/meteorMath.js';
import { mountMemoryMatch } from './games/memoryMatch.js';
import { mountWordScramble } from './games/wordScramble.js';
import { mountTrueFalse } from './games/trueFalse.js';
import { mountCategorySort } from './games/categorySort.js';

const GAMES = [
  {
    id: 'quiz',
    title: 'Cepat Tepat Arena',
    tag: 'Kuis • Semua Mapel',
    icon: '⚡',
    accent: '#22d3ee',
    bg: 'linear-gradient(135deg, #06b6d4, #6366f1)',
    desc: 'Jawab soal Matematika, IPA, IPS & Bahasa sebelum waktu habis! Lengkap dengan bantuan 50:50, Bekukan Waktu & kombo.',
    mount: mountQuizBlitz,
  },
  {
    id: 'meteor',
    title: 'Meteor Hitung',
    tag: 'Aksi Arcade • Matematika',
    icon: '🚀',
    accent: '#f97316',
    bg: 'linear-gradient(135deg, #f97316, #ec4899)',
    desc: 'Lindungi planetmu! Hitung cepat soal matematika pada meteor yang jatuh dan tembakkan laser sebelum menabrak perisai.',
    mount: mountMeteorMath,
  },
  {
    id: 'memory',
    title: 'Memori Pasangan',
    tag: 'Daya Ingat • Konsep',
    icon: '🃏',
    accent: '#a855f7',
    bg: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    desc: 'Buka kartu animasi 3D dan jodohkan pasangan pengetahuan: rumus kimia, ibu kota, tokoh sejarah, hingga trigonometri.',
    mount: mountMemoryMatch,
  },
  {
    id: 'scramble',
    title: 'Susun Kata Cerdas',
    tag: 'Teka-Teki • Kosakata',
    icon: '🧩',
    accent: '#10b981',
    bg: 'linear-gradient(135deg, #10b981, #22d3ee)',
    desc: 'Rangkai huruf acak menjadi istilah sains, geografi, sejarah, atau ekonomi berdasarkan petunjuk cerdas.',
    mount: mountWordScramble,
  },
  {
    id: 'truefalse',
    title: 'Benar atau Mitos?',
    tag: 'Refleks • Fakta Sains',
    icon: '⚖️',
    accent: '#fbbf24',
    bg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    desc: 'Tentukan dalam hitungan detik apakah pernyataan di layar adalah fakta ilmiah atau cuma mitos belaka!',
    mount: mountTrueFalse,
  },
  {
    id: 'sort',
    title: 'Rantai Ilmu',
    tag: 'Klasifikasi • Logika',
    icon: '🔗',
    accent: '#38bdf8',
    bg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    desc: 'Sortir kartu pengetahuan ke portal kategori yang tepat: hewan, wujud benda, unsur/senyawa, asam/basa, hingga ekonomi.',
    mount: mountCategorySort,
  },
];

const GRADE_INFO = {
  SD: {
    label: 'Sekolah Dasar (Kelas 1–6)',
    tagline: 'Belajar berhitung, sains dasar, Nusantara & kosakata sambil berpetualang!',
  },
  SMP: {
    label: 'Sekolah Menengah Pertama (Kelas 7–9)',
    tagline: 'Asah aljabar, fisika-biologi, unsur kimia, sejarah & literasi dengan seru!',
  },
  SMA: {
    label: 'Sekolah Menengah Atas / SMK (Kelas 10–12)',
    tagline: 'Taklukkan logaritma, turunan, kimia-fisika, ekonomi & penalaran ala UTBK!',
  },
};

let profile = loadProfile();
let activeCleanup = null;
let currentGameId = null;

const root = document.getElementById('app-root');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');
const toastContainer = document.getElementById('toast-container');

function showToast(icon, text) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${icon}</span><span>${text}</span>`;
  toastContainer.appendChild(el);
  setTimeout(() => {
    el.classList.add('fade-out');
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

function syncTopbar() {
  const lv = getLevelInfo(profile.xp);
  document.getElementById('nav-avatar').textContent = profile.avatar;
  document.getElementById('nav-name').textContent = profile.name;
  document.getElementById('nav-level').textContent = `Lv. ${lv.level} • ${profile.xp} XP`;
  document.getElementById('sound-icon').textContent = sfx.enabled ? '🔊' : '🔇';

  const questDot = document.getElementById('quest-dot');
  if (questDot) {
    questDot.classList.toggle('hidden', !hasClaimableQuests(profile));
  }

  document.querySelectorAll('.grade-pill').forEach((btn) => {
    const active = btn.dataset.grade === profile.grade;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-checked', String(active));
  });
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
  syncTopbar();

  const lv = getLevelInfo(profile.xp);
  const gInfo = GRADE_INFO[profile.grade];

  root.innerHTML = `
    <section class="hero-banner">
      <div class="hero-left">
        <div class="hero-badge">✨ Jenjang Aktif: ${gInfo.label}</div>
        <h1 class="hero-title">
          Belajar Jadi <span class="gradient-word">Petualangan Seru</span> Tanpa Bosan!
        </h1>
        <p class="hero-desc">${gInfo.tagline}</p>
        <div class="hero-actions">
          <button id="btn-quick-play" class="btn btn-primary">🎲 Main Game Acak</button>
          <button id="btn-open-quests" class="btn btn-secondary">🎯 Misi Harian</button>
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
        <p>Semua 6 mini-game otomatis menyesuaikan tingkat materi ${gInfo.label}.</p>
      </div>
    </div>

    <section class="games-grid">
      ${GAMES.map((game) => {
        const best = profile.highScores[`${game.id}_${profile.grade}`] || 0;
        return `
          <article class="game-card" data-game="${game.id}" style="--card-accent:${game.accent}; --card-bg:${game.bg};">
            <div class="game-card-top">
              <div class="game-icon-box">${game.icon}</div>
              <span class="game-tag">${game.tag}</span>
            </div>
            <h3>${game.title}</h3>
            <p>${game.desc}</p>
            <div class="game-card-footer">
              <span class="best-score">${best > 0 ? `🏆 Rekor: ${best}` : '🆕 Belum dimainkan'}</span>
              <span class="play-cta">Mainkan →</span>
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

  root.querySelector('#btn-quick-play').addEventListener('click', () => {
    sfx.click();
    const randomGame = GAMES[Math.floor(Math.random() * GAMES.length)];
    launchGame(randomGame.id);
  });

  root.querySelector('#btn-open-quests').addEventListener('click', () => {
    sfx.click();
    openQuestsModal();
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
      <span style="font-size:0.8rem;color:var(--accent-cyan);">Lv. ${lv.level} • ${lv.rank}</span>
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
      syncTopbar();
      showToast('🎓', `Jenjang diganti ke ${nextGrade}`);
      if (currentGameId) {
        launchGame(currentGameId);
      } else {
        renderHome();
      }
    });
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
}

// Bootstrap
fx.init();
initEvents();
renderHome();
