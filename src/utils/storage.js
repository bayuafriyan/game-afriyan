// Player Profile, XP, Levels, Badges, Daily Quests & High Scores (localStorage)

const STORAGE_KEY = 'cerdasplay_profile_v1';

export const AVATARS = ['🧑‍🚀', '🦊', '🦉', '🤖', '🐱', '🐉', '👩‍🔬', '🦁', '🐼', '🧙‍♂️', '🦄', '🚀'];

export const BADGE_DEFS = [
  { id: 'first_game', icon: '🌟', name: 'Langkah Pertama', desc: 'Selesaikan 1 permainan' },
  { id: 'streak_5', icon: '🔥', name: 'Api Semangat', desc: 'Capai 5 jawaban benar beruntun' },
  { id: 'xp_500', icon: '⚡', name: 'Bintang Belajar', desc: 'Kumpulkan total 500 XP' },
  { id: 'xp_2000', icon: '👑', name: 'Profesor Muda', desc: 'Kumpulkan total 2.000 XP' },
  { id: 'explorer', icon: '🧭', name: 'Penjelajah Arena', desc: 'Coba minimal 4 mini-game berbeda' },
  { id: 'all_games', icon: '🏆', name: 'Master Makin Cerdas', desc: 'Mainkan semua 8 mode permainan' },
  { id: 'meteor_hero', icon: '☄️', name: 'Penjaga Galaksi', desc: 'Raih skor 150+ di Meteor Hitung' },
  { id: 'memory_pro', icon: '🧠', name: 'Memori Tajam', desc: 'Selesaikan Memori Pasangan' },
];

const RANKS = [
  { minLv: 1, title: 'Pemula Penasaran' },
  { minLv: 3, title: 'Penjelajah Ilmu' },
  { minLv: 5, title: 'Ksatria Cerdas' },
  { minLv: 8, title: 'Ilmuwan Muda' },
  { minLv: 12, title: 'Profesor Nusantara' },
  { minLv: 16, title: 'Legenda Pengetahuan' },
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function defaultQuests() {
  return {
    date: todayStr(),
    items: [
      { id: 'play_2', title: 'Mainkan 2 ronde game apa saja', target: 2, progress: 0, reward: 80, claimed: false },
      { id: 'correct_10', title: 'Jawab 10 tantangan dengan benar', target: 10, progress: 0, reward: 120, claimed: false },
      { id: 'try_2_modes', title: 'Coba 2 jenis game berbeda hari ini', target: 2, progress: 0, reward: 100, claimed: false, modes: [] },
    ],
  };
}

function defaultState() {
  return {
    name: 'Pelajar Hebat',
    avatar: '🧑‍🚀',
    grade: 'SD',
    xp: 0,
    gamesPlayed: 0,
    totalCorrect: 0,
    bestStreak: 0,
    playedModes: [],
    highScores: {},
    badges: [],
    quests: defaultQuests(),
  };
}

const MAX_STORED_XP = 10_000_000;
const ALLOWED_GRADES = new Set(['SD', 'SMP', 'SMA']);
const BADGE_IDS = new Set(BADGE_DEFS.map((b) => b.id));
const SAFE_ID_RE = /^[a-z0-9_-]{1,32}$/i;
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function cleanSafeText(value, fallback, maxLen = 64) {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.replace(/[\u0000-\u001F\u007F<>`"'&]/g, '').trim().slice(0, maxLen);
  return cleaned || fallback;
}

function clampSafeInt(value, fallback, max = MAX_STORED_XP) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(0, Math.floor(value)));
}

function cleanSafeIdList(arr, maxItems = 20, allowedSet = null) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    if (typeof item !== 'string' || !SAFE_ID_RE.test(item)) continue;
    if (allowedSet && !allowedSet.has(item)) continue;
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
    if (out.length >= maxItems) break;
  }
  return out;
}

function sanitizeQuests(rawQuests) {
  const fresh = defaultQuests();
  if (
    !rawQuests ||
    typeof rawQuests !== 'object' ||
    Array.isArray(rawQuests) ||
    rawQuests.date !== fresh.date ||
    !Array.isArray(rawQuests.items)
  ) {
    return fresh;
  }

  const items = fresh.items.map((def) => {
    const found = rawQuests.items.find(
      (it) => it && typeof it === 'object' && !Array.isArray(it) && it.id === def.id
    );
    const entry = {
      id: def.id,
      title: def.title,
      target: def.target,
      progress: clampSafeInt(found?.progress, 0, def.target),
      reward: def.reward,
      claimed: typeof found?.claimed === 'boolean' ? found.claimed : false,
    };
    if (Array.isArray(def.modes)) {
      entry.modes = cleanSafeIdList(found?.modes, 20);
    }
    return entry;
  });

  return { date: fresh.date, items };
}

export function sanitizeProfile(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return base;
  }

  const highScores = {};
  if (raw.highScores && typeof raw.highScores === 'object' && !Array.isArray(raw.highScores)) {
    let count = 0;
    for (const key of Object.keys(raw.highScores)) {
      if (count >= 64) break;
      if (DANGEROUS_KEYS.has(key) || !SAFE_ID_RE.test(key)) continue;
      if (!Object.prototype.hasOwnProperty.call(raw.highScores, key)) continue;
      highScores[key] = clampSafeInt(raw.highScores[key], 0, 1_000_000);
      count++;
    }
  }

  return {
    name: cleanSafeText(raw.name, base.name, 24),
    avatar: AVATARS.includes(raw.avatar) ? raw.avatar : base.avatar,
    grade: ALLOWED_GRADES.has(raw.grade) ? raw.grade : base.grade,
    xp: clampSafeInt(raw.xp, 0, MAX_STORED_XP),
    gamesPlayed: clampSafeInt(raw.gamesPlayed, 0, 1_000_000),
    totalCorrect: clampSafeInt(raw.totalCorrect, 0, 1_000_000),
    bestStreak: clampSafeInt(raw.bestStreak, 0, 100_000),
    playedModes: cleanSafeIdList(raw.playedModes, 20),
    highScores,
    badges: cleanSafeIdList(raw.badges, 32, BADGE_IDS),
    quests: sanitizeQuests(raw.quests),
  };
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > 100_000) return defaultState();
    const parsed = JSON.parse(raw);
    return sanitizeProfile(parsed);
  } catch {
    return defaultState();
  }
}

export function saveProfile(profile) {
  const clean = sanitizeProfile(profile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
}

export function getLevelInfo(xp) {
  // Each level requires 150 + (level-1)*60 XP (bounded against Infinity/NaN DoS)
  let level = 1;
  let remaining = Number.isFinite(xp) ? Math.min(MAX_STORED_XP, Math.max(0, Math.floor(xp))) : 0;
  let needed = 150;
  while (remaining >= needed && level < 1000) {
    remaining -= needed;
    level++;
    needed = 150 + (level - 1) * 60;
  }
  const rank = [...RANKS].reverse().find((r) => level >= r.minLv)?.title || RANKS[0].title;
  return {
    level,
    rank,
    currentXp: remaining,
    neededXp: needed,
    pct: Math.min(100, Math.round((remaining / needed) * 100)),
  };
}

export function recordGameResult(profile, { gameId, grade, score, correctCount = 0, maxStreak = 0, xpEarned = 0, isStep = false }) {
  const prevLevel = getLevelInfo(profile.xp).level;
  profile.xp += xpEarned;
  if (!isStep) {
    profile.gamesPlayed += 1;
  }
  profile.totalCorrect += correctCount;
  profile.bestStreak = Math.max(profile.bestStreak, maxStreak);

  if (!profile.playedModes.includes(gameId)) {
    profile.playedModes.push(gameId);
  }

  const scoreKey = `${gameId}_${grade}`;
  const isNewBest = score > (profile.highScores[scoreKey] || 0);
  if (isNewBest) {
    profile.highScores[scoreKey] = score;
  }

  // Update Daily Quests
  if (profile.quests.date !== todayStr()) {
    profile.quests = defaultQuests();
  }
  for (const q of profile.quests.items) {
    if (q.id === 'play_2') {
      if (!isStep) {
        q.progress = Math.min(q.target, q.progress + 1);
      }
    } else if (q.id === 'correct_10') {
      q.progress = Math.min(q.target, q.progress + correctCount);
    } else if (q.id === 'try_2_modes') {
      q.modes = q.modes || [];
      if (!q.modes.includes(gameId)) q.modes.push(gameId);
      q.progress = Math.min(q.target, q.modes.length);
    }
  }

  // Check Badges
  const newlyUnlocked = [];
  const unlock = (id) => {
    if (!profile.badges.includes(id)) {
      profile.badges.push(id);
      const def = BADGE_DEFS.find((b) => b.id === id);
      if (def) newlyUnlocked.push(def);
    }
  };

  if (profile.gamesPlayed >= 1) unlock('first_game');
  if (profile.bestStreak >= 5) unlock('streak_5');
  if (profile.xp >= 500) unlock('xp_500');
  if (profile.xp >= 2000) unlock('xp_2000');
  if (profile.playedModes.length >= 4) unlock('explorer');
  if (profile.playedModes.length >= 8) unlock('all_games');
  if (gameId === 'meteor' && score >= 150) unlock('meteor_hero');
  if (gameId === 'memory' && score > 0) unlock('memory_pro');

  saveProfile(profile);

  const newLevel = getLevelInfo(profile.xp).level;
  return {
    leveledUp: newLevel > prevLevel,
    newLevel,
    isNewBest,
    newlyUnlocked,
  };
}

export function hasClaimableQuests(profile) {
  return profile.quests.items.some((q) => q.progress >= q.target && !q.claimed);
}
