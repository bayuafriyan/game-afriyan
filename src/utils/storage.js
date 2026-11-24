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

export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = { ...defaultState(), ...JSON.parse(raw) };
    if (!parsed.quests || parsed.quests.date !== todayStr()) {
      parsed.quests = defaultQuests();
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getLevelInfo(xp) {
  // Each level requires 150 + (level-1)*60 XP
  let level = 1;
  let remaining = xp;
  let needed = 150;
  while (remaining >= needed) {
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
