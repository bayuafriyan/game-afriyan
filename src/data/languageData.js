// Dataset Kurikulum Multibahasa (Inggris CEFR, Jepang JLPT, Mandarin YCT/HSK)
// 1.050+ Konsep Unik (= 3.150+ Kosakata 3 Bahasa) untuk SD, SMP, dan SMA

import { SD_PART1 } from './vocab/sdPart1.js';
import { SD_PART2 } from './vocab/sdPart2.js';
import { SMP_PART1 } from './vocab/smpPart1.js';
import { SMP_PART2 } from './vocab/smpPart2.js';
import { SMA_PART1 } from './vocab/smaPart1.js';
import { SMA_PART2 } from './vocab/smaPart2.js';

export const LANG_META = {
  en: {
    code: 'en',
    speechLang: 'en-US',
    name: 'Bahasa Inggris',
    flag: '🇬🇧',
    color: '#2563eb',
    levelLabel: { SD: 'CEFR Pre-A1 / A1', SMP: 'CEFR A2 / B1', SMA: 'CEFR B1 / B2' },
  },
  ja: {
    code: 'ja',
    speechLang: 'ja-JP',
    name: 'Bahasa Jepang',
    flag: '🇯🇵',
    color: '#e11d48',
    levelLabel: { SD: 'JLPT Pre-N5', SMP: 'JLPT N5 / N4', SMA: 'JLPT N4 / N3' },
  },
  zh: {
    code: 'zh',
    speechLang: 'zh-CN',
    name: 'Bahasa Mandarin',
    flag: '🇨🇳',
    color: '#d97706',
    levelLabel: { SD: 'YCT 1/2 & HSK 1', SMP: 'HSK 2 & 3', SMA: 'HSK 3 & 4' },
  },
};

const TONE1 = new Set('āēīōūǖĀĒĪŌŪǕ'.split(''));
const TONE2 = new Set('áéíóúǘÁÉÍÓÚǗ'.split(''));
const TONE3 = new Set('ǎěǐǒǔǚǍĚǏǑǓǙ'.split(''));
const TONE4 = new Set('àèìòùǜÀÈÌÒÙǛ'.split(''));

export function extractMandarinTones(pinyin) {
  const parts = String(pinyin || '')
    .trim()
    .split(/[\s']+/)
    .filter(Boolean);
  if (parts.length === 0) return [0];
  return parts.map((syl) => {
    for (const ch of syl) {
      if (TONE1.has(ch)) return 1;
      if (TONE2.has(ch)) return 2;
      if (TONE3.has(ch)) return 3;
      if (TONE4.has(ch)) return 4;
    }
    return 0;
  });
}

// Verified exact stroke counts for Kana + common Kanji/Hanzi
const CHAR_STROKES = {
  // Hiragana
  'あ': 3, 'い': 2, 'う': 2, 'え': 2, 'お': 3,
  'か': 3, 'き': 4, 'く': 1, 'け': 3, 'こ': 2,
  'が': 5, 'ぎ': 6, 'ぐ': 3, 'げ': 5, 'ご': 4,
  'さ': 3, 'し': 1, 'す': 2, 'せ': 3, 'そ': 1,
  'ざ': 5, 'じ': 3, 'ず': 4, 'ぜ': 5, 'ぞ': 3,
  'た': 4, 'ち': 2, 'つ': 1, 'て': 1, 'と': 2,
  'だ': 6, 'ぢ': 4, 'づ': 3, 'で': 3, 'ど': 4,
  'な': 4, 'に': 3, 'ぬ': 2, 'ね': 2, 'の': 1,
  'は': 3, 'ひ': 1, 'ふ': 4, 'へ': 1, 'ほ': 4,
  'ば': 5, 'び': 3, 'ぶ': 6, 'べ': 3, 'ぼ': 6,
  'ぱ': 4, 'ぴ': 2, 'ぷ': 5, 'ぺ': 2, 'ぽ': 5,
  'ま': 3, 'み': 2, 'む': 3, 'め': 2, 'も': 3,
  'や': 3, 'ゆ': 2, 'よ': 2, 'ゃ': 3, 'ゅ': 2, 'ょ': 2, 'っ': 1,
  'ら': 2, 'り': 2, 'る': 1, 'れ': 2, 'ろ': 1,
  'わ': 2, 'を': 3, 'ん': 1,
  // Katakana
  'ア': 2, 'イ': 2, 'ウ': 3, 'エ': 3, 'オ': 3,
  'カ': 2, 'キ': 3, 'ク': 2, 'ケ': 3, 'コ': 2,
  'ガ': 4, 'ギ': 5, 'グ': 4, 'ゲ': 5, 'ゴ': 4,
  'サ': 3, 'シ': 3, 'ス': 2, 'セ': 2, 'ソ': 2,
  'ザ': 5, 'ジ': 5, 'ズ': 4, 'ゼ': 4, 'ゾ': 4,
  'タ': 3, 'チ': 3, 'ツ': 3, 'テ': 3, 'ト': 2,
  'ダ': 5, 'ヂ': 5, 'ヅ': 5, 'デ': 5, 'ド': 4,
  'ナ': 2, 'ニ': 2, 'ヌ': 2, 'ネ': 4, 'ノ': 1,
  'ハ': 2, 'ヒ': 2, 'フ': 1, 'ヘ': 1, 'ホ': 4,
  'バ': 4, 'ビ': 4, 'ブ': 3, 'ベ': 3, 'ボ': 6,
  'パ': 3, 'ピ': 3, 'プ': 2, 'ペ': 2, 'ポ': 5,
  'マ': 2, 'ミ': 3, 'ム': 2, 'メ': 2, 'モ': 3,
  'ヤ': 2, 'ユ': 2, 'ヨ': 3, 'ャ': 2, 'ュ': 2, 'ョ': 3, 'ッ': 3,
  'ラ': 2, 'リ': 2, 'ル': 2, 'レ': 1, 'ロ': 3,
  'ワ': 2, 'ヲ': 3, 'ン': 2, 'ー': 1, 'ヴ': 5,
  // Verified Common Kanji & Simplified Hanzi
  '一': 1, '二': 2, '三': 3, '四': 5, '五': 4, '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
  '百': 6, '千': 3, '万': 3, '零': 13, '两': 7,
  '水': 4, '火': 4, '山': 3, '木': 4, '日': 4, '月': 4, '人': 2, '口': 3, '大': 3, '小': 3,
  '中': 4, '上': 3, '下': 3, '本': 5, '学': 8, '校': 10, '生': 5, '先': 6, '友': 4, '達': 12,
  '時': 10, '間': 12, '語': 14, '国': 8, '年': 6, '今': 4, '明': 8, '未': 5, '来': 7, '努': 7,
  '力': 2, '文': 4, '化': 4, '気': 6, '車': 7, '電': 13, '雨': 8, '天': 4, '空': 8, '海': 9,
  '川': 3, '花': 7, '草': 9, '犬': 4, '猫': 11, '魚': 11, '鳥': 11, '馬': 10, '牛': 4, '羊': 6,
  '食': 9, '飲': 12, '見': 7, '聞': 14, '書': 10, '読': 14, '話': 13, '買': 12, '行': 6, '出': 5,
  '入': 2, '太': 4, '陽': 12, '赤': 7, '青': 8, '白': 5, '黒': 11, '黑': 12, '黄': 11, '緑': 14,
  '绿': 11, '手': 4, '足': 7, '目': 5, '耳': 6, '鼻': 14, '心': 4, '家': 10, '町': 7, '村': 7,
  '駅': 14, '船': 11, '道': 12, '橋': 16, '男': 7, '女': 3, '子': 3, '父': 4, '母': 5, '兄': 5,
  '姉': 8, '弟': 7, '妹': 8, '好': 6, '新': 13, '古': 5, '高': 10, '安': 6, '広': 5, '長': 8,
  '短': 12, '多': 6, '少': 4, '早': 6, '春': 9, '夏': 10, '秋': 9, '冬': 5, '北': 5, '南': 9,
  '東': 8, '东': 5, '西': 6, '左': 5, '右': 5, '前': 9, '後': 9, '名': 6, '元': 4, '你': 7,
  '我': 7, '他': 5, '她': 6, '们': 5, '的': 8, '是': 9, '不': 4, '在': 6, '有': 6, '个': 3,
  '和': 8, '了': 2, '吗': 6, '去': 5, '吃': 6, '喝': 12, '看': 9, '听': 7, '说': 9, '写': 5,
  '读': 10, '买': 6, '卖': 8, '走': 7, '跑': 12, '坐': 7, '站': 10, '飞': 3, '机': 6, '书': 4,
  '笔': 10, '纸': 7, '字': 6, '话': 8, '言': 7, '语': 9, '茶': 9, '米': 6, '饭': 7, '肉': 6,
  '蛋': 11, '奶': 5, '果': 8, '菜': 11, '树': 9, '风': 4, '雪': 11, '云': 4, '星': 9, '脑': 10,
  '网': 6, '爱': 10, '谢': 12, '请': 10, '问': 6, '对': 5, '起': 10, '再': 6, '见': 4, '晚': 11,
  '午': 4, '夜': 8, '周': 8, '工': 3, '作': 7, '业': 5, '法': 8, '公': 4, '司': 5, '同': 6,
  '老': 6, '师': 6, '医': 7, '院': 9, '药': 9, '钱': 10, '门': 3, '窗': 12, '床': 7, '桌': 10,
  '椅': 12, '灯': 6, '衣': 6, '鞋': 15, '帽': 12, '头': 5, '发': 5, '脸': 11, '牙': 4, '舌': 6,
  '脚': 11, '身': 7, '体': 7, '正': 5, '反': 4, '方': 4, '圆': 10, '色': 6, '红': 6, '蓝': 13,
  '紫': 12, '灰': 6, '金': 8, '银': 11, '几': 2, '什': 4, '么': 3, '谁': 10, '哪': 9, '里': 7,
  '这': 7, '那': 6, '很': 9, '真': 10, '都': 10, '也': 3, '能': 10, '会': 6, '想': 13, '要': 9,
  '给': 9, '让': 5, '帮': 9, '习': 3, '玩': 8, '笑': 10, '哭': 10, '开': 4, '关': 6, '进': 7,
  '回': 6, '到': 8,
};

export function computeStrokes(text) {
  const chars = String(text || '').replace(/\s+/g, '').split('');
  if (chars.length === 0) return null;
  let sum = 0;
  for (const ch of chars) {
    if (CHAR_STROKES[ch] === undefined) return null;
    sum += CHAR_STROKES[ch];
  }
  return sum;
}

const EN_VOWEL_A_WORDS = new Set(['university', 'uniform', 'one', 'european', 'use', 'user']);
const EN_SILENT_H_WORDS = new Set(['hour', 'honest', 'honor']);
const NON_COUNT_OR_PLURAL_OBJECTS = new Set([
  'glasses', 'scissors', 'shoes', 'socks', 'pants', 'chopsticks', 'stairs', 'clothes', 'resources',
  'chalk', 'paper', 'glue', 'homework', 'soap', 'money', 'cash', 'change',
]);

function indef(word) {
  const lower = String(word || '').toLowerCase();
  const firstWord = lower.split(' ')[0];
  if (EN_SILENT_H_WORDS.has(firstWord)) return 'an';
  if (EN_VOWEL_A_WORDS.has(firstWord)) return 'a';
  return /^[aeiou]/.test(firstWord) ? 'an' : 'a';
}

function buildExamples(pos, en, jaReading, zhText, zhPinyin) {
  const enLower = en.toLowerCase();
  switch (pos) {
    case 'expr':
      return {
        en: `We can say: "${en}!"`,
        ja: `${jaReading}。`,
        zh: `${zhText}。(${zhPinyin})`,
      };
    case 'number':
      return {
        en: `The number is ${enLower}.`,
        ja: `すうじ は ${jaReading} です。`,
        zh: `数字是${zhText}。`,
      };
    case 'color':
      return {
        en: `My favorite is ${enLower}.`,
        ja: `${jaReading} が すき です。`,
        zh: `我喜欢${zhText}。`,
      };
    case 'family':
    case 'person':
      if (enLower === 'parents') {
        return {
          en: 'They are kind parents.',
          ja: `あのかた は ${jaReading} です。`,
          zh: `那是${zhText}。`,
        };
      }
      if (enLower === 'family') {
        return {
          en: 'This is my family.',
          ja: `こちら は わたしの ${jaReading} です。`,
          zh: `这是我的${zhText}。`,
        };
      }
      return {
        en: `That person is ${indef(en)} ${enLower}.`,
        ja: `あのかた は ${jaReading} です。`,
        zh: `那是${zhText}。`,
      };
    case 'animal':
      return {
        en: `Look, there is ${indef(en)} ${enLower}!`,
        ja: `あそこに ${jaReading} が います。`,
        zh: `看，那里有${zhText}！`,
      };
    case 'food':
      return {
        en: `I like ${enLower}.`,
        ja: `わたし は ${jaReading} が すき です。`,
        zh: `我觉得${zhText}很好吃。`,
      };
    case 'drink':
      return {
        en: `I drink ${enLower}.`,
        ja: `わたし は ${jaReading} を のみます。`,
        zh: `我觉得${zhText}很好喝。`,
      };
    case 'object':
      if (NON_COUNT_OR_PLURAL_OBJECTS.has(enLower)) {
        return {
          en: `I see ${enLower} here.`,
          ja: `ここに ${jaReading} が あります。`,
          zh: `这里有${zhText}。`,
        };
      }
      return {
        en: `I see ${indef(en)} ${enLower} here.`,
        ja: `ここに ${jaReading} が あります。`,
        zh: `这里有${zhText}。`,
      };
    case 'place':
      return {
        en: `Let us go to the ${enLower}.`,
        ja: `きょう ${jaReading} へ いきます。`,
        zh: `我们去${zhText}吧。`,
      };
    case 'nature':
      return {
        en: `Look at the ${enLower}!`,
        ja: `きれいな ${jaReading} ですね。`,
        zh: `你看，${zhText}！`,
      };
    case 'body':
      return {
        en: `Take care of your ${enLower}.`,
        ja: `これ は ${jaReading} です。`,
        zh: `这是${zhText}。`,
      };
    case 'time':
      return {
        en: `Today we learn "${enLower}".`,
        ja: `いま は ${jaReading} です。`,
        zh: `今天学习"${zhText}"。`,
      };
    case 'adj_thing':
      return {
        en: `This looks very ${enLower}.`,
        ja: `これ は ${jaReading} です。`,
        zh: `这个很${zhText}。`,
      };
    case 'adj_person':
      return {
        en: `Everyone feels ${enLower}.`,
        ja: `みんな ${jaReading} です。`,
        zh: `大家都很${zhText}。`,
      };
    case 'verb':
      return {
        en: `I want to ${enLower} today.`,
        ja: `きょう ${jaReading} つもり です。`,
        zh: `我想${zhText}。`,
      };
    case 'abstract':
    default:
      return {
        en: `We are learning about ${enLower}.`,
        ja: `${jaReading} について まなびます。`,
        zh: `我们一起了解${zhText}。`,
      };
  }
}

function expandGroups(groups) {
  const out = [];
  for (const group of groups) {
    const { topic, pos, levels, items } = group;
    for (const tuple of items) {
      const [concept_id, emoji, id, enText, jaText, jaReading, jaRomaji, zhText, zhPinyin] = tuple;
      const ex = buildExamples(pos, enText, jaReading, zhText, zhPinyin);
      out.push({
        concept_id,
        topic,
        pos,
        emoji,
        id,
        en: {
          text: enText,
          phonetic: '',
          example: ex.en,
          level: levels.en,
        },
        ja: {
          text: jaText,
          reading: jaReading,
          romaji: jaRomaji,
          strokes: computeStrokes(jaText),
          example: ex.ja,
          level: levels.ja,
        },
        zh: {
          text: zhText,
          pinyin: zhPinyin,
          tones: extractMandarinTones(zhPinyin),
          strokes: computeStrokes(zhText),
          example: ex.zh,
          level: levels.zh,
        },
      });
    }
  }
  return out;
}

export const LANG_VOCAB = {
  SD: expandGroups([...SD_PART1, ...SD_PART2]),
  SMP: expandGroups([...SMP_PART1, ...SMP_PART2]),
  SMA: expandGroups([...SMA_PART1, ...SMA_PART2]),
};

export const LANG_TOPICS = {
  SD: [...new Set(LANG_VOCAB.SD.map((x) => x.topic))],
  SMP: [...new Set(LANG_VOCAB.SMP.map((x) => x.topic))],
  SMA: [...new Set(LANG_VOCAB.SMA.map((x) => x.topic))],
};

const totalConcepts = LANG_VOCAB.SD.length + LANG_VOCAB.SMP.length + LANG_VOCAB.SMA.length;
export const TOTAL_VOCAB_STATS = {
  concepts: totalConcepts,
  totalWords: totalConcepts * 3,
};

// Interactive RPG NPC Dialogues (per Bahasa & Jenjang)
export const LANG_DIALOGUES = {
  en: {
    SD: [
      {
        npc: '👩‍🏫 Miss Anna',
        npcText: 'Good morning! How are you today?',
        hint: 'Balas sapaan pagi dengan sopan dan ramah!',
        options: [
          { text: 'Good morning! I am fine, thank you.', ok: true, reply: 'Awesome! Let us start our fun lesson!' },
          { text: 'Good night, I am sleeping.', ok: false, reply: 'Oops! Ini pagi hari, bukan malam hari.' },
          { text: 'My favorite color is blue.', ok: false, reply: 'Miss Anna menanyakan kabarmu, bukan warna favorit.' },
        ],
      },
      {
        npc: '🦊 Leo',
        npcText: 'I have three apples. Do you like apples?',
        hint: 'Jawab apakah kamu suka apel!',
        options: [
          { text: 'Yes, I like apples! Thank you.', ok: true, reply: 'Yay! Here is a sweet red apple for you!' },
          { text: 'I am ten years old.', ok: false, reply: 'Leo bertanya apakah kamu suka apel, bukan umurmu.' },
          { text: 'This is a pencil.', ok: false, reply: 'Hmm, kita sedang bicara tentang buah apel!' },
        ],
      },
      {
        npc: '📚 Pustakawan Sekolah',
        npcText: 'Hello! What are you looking for in the library?',
        hint: 'Katakan kamu ingin meminjam atau membaca buku cerita!',
        options: [
          { text: 'I want to read a storybook, please.', ok: true, reply: 'Great! The storybooks are on the second shelf.' },
          { text: 'I am eating fried rice.', ok: false, reply: 'Di perpustakaan kita tidak boleh makan ya!' },
          { text: 'The elephant is big.', ok: false, reply: 'Kalimat tersebut belum menjawab buku apa yang kamu cari.' },
        ],
      },
    ],
    SMP: [
      {
        npc: '🧑‍✈️ Tour Guide',
        npcText: 'Excuse me, what did you do during your last holiday?',
        hint: 'Gunakan Simple Past Tense (Verb 2) untuk menceritakan masa lalu!',
        options: [
          { text: 'I visited Yogyakarta and went to Borobudur.', ok: true, reply: 'That sounds amazing! Great use of Simple Past Tense!' },
          { text: 'I visit Yogyakarta tomorrow.', ok: false, reply: 'Hati-hati! "Last holiday" adalah masa lalu, gunakan Verb 2 (visited/went).' },
          { text: 'I am going to visit yesterday.', ok: false, reply: '"Going to" dipakai untuk masa depan, bukan kemarin.' },
        ],
      },
      {
        npc: '👩‍🍳 Cafe Staff',
        npcText: 'Welcome! What would you like to order today?',
        hint: 'Pesan makanan atau minuman dengan kalimat sopan!',
        options: [
          { text: 'I would like a glass of iced tea, please.', ok: true, reply: 'Sure! One iced tea coming right up!' },
          { text: 'Give me tea now!', ok: false, reply: 'Terlalu kasar! Gunakan "I would like..." atau "Can I have... please".' },
          { text: 'Where is the train station?', ok: false, reply: 'Kamu sedang di kafe untuk memesan minuman.' },
        ],
      },
      {
        npc: '🏫 Teman Sekelas',
        npcText: 'Which school subject do you find the most interesting?',
        hint: 'Jawab mata pelajaran favoritmu beserta alasannya!',
        options: [
          { text: 'I love Informatics because I enjoy learning how computers work.', ok: true, reply: 'Cool! Maybe we can build a game project together!' },
          { text: 'Yesterday was Monday.', ok: false, reply: 'Pertanyaannya tentang mata pelajaran, bukan hari.' },
          { text: 'I went to the market.', ok: false, reply: 'Belum menjawab mata pelajaran yang paling menarik bagimu.' },
        ],
      },
    ],
    SMA: [
      {
        npc: '🎓 Scholarship Interviewer',
        npcText: 'If you received this scholarship, what would you do to help your community?',
        hint: 'Gunakan Conditional Type 2 (I would + V1) dengan argumen yang jelas!',
        options: [
          { text: 'I would build a free coding club to help students learn technology.', ok: true, reply: 'Impressive answer! Clear vision and accurate Conditional Type 2.' },
          { text: 'I will built a club yesterday.', ok: false, reply: 'Perhatikan grammar: Conditional Type 2 memakai "would + Verb 1".' },
          { text: 'I do not care about scholarships.', ok: false, reply: 'Jawaban ini kurang tepat untuk wawancara beasiswa.' },
        ],
      },
      {
        npc: '🌱 Panelis Seminar Lingkungan',
        npcText: 'What is the most effective way for students to reduce plastic pollution?',
        hint: 'Berikan solusi praktis dan logis dalam bahasa Inggris formal!',
        options: [
          { text: 'We can bring reusable bottles and encourage recycling programs at school.', ok: true, reply: 'Well said! Practical actions make a sustainable impact.' },
          { text: 'We should throw more trash into the river.', ok: false, reply: 'Itu justru memperparah pencemaran lingkungan.' },
          { text: 'Plastic is delicious.', ok: false, reply: 'Pernyataan tidak logis dalam diskusi lingkungan.' },
        ],
      },
      {
        npc: '💼 Startup Mentor',
        npcText: 'Why is teamwork essential for achieving a complex project goal?',
        hint: 'Jelaskan manfaat kolaborasi dalam bahasa Inggris akademis!',
        options: [
          { text: 'Effective collaboration combines diverse skills and improves productivity.', ok: true, reply: 'Spot on! Strong communication and teamwork drive innovation.' },
          { text: 'I forgot my umbrella at home.', ok: false, reply: 'Jawaban belum menjawab pertanyaan tentang kerja tim.' },
          { text: 'Teamwork is impossible for humans.', ok: false, reply: 'Pernyataan tersebut tidak mendukung penyelesaian proyek.' },
        ],
      },
    ],
  },

  ja: {
    SD: [
      {
        npc: '👧 Sakura',
        npcText: 'こんにちは！おなまえ は なんですか？',
        romaji: 'Konnichiwa! Onamae wa nan desu ka?',
        hint: 'Sakura menanyakan namamu! Jawab dengan "[Nama] desu."',
        options: [
          { text: 'こんにちは！わたし は ゆうき です。(Konnichiwa! Watashi wa Yuuki desu.)', ok: true, reply: 'はじめまして！よろしくね！(Salam kenal!)' },
          { text: 'さようなら！(Sayounara!)', ok: false, reply: 'Sayounara artinya selamat tinggal, padahal baru kenalan!' },
          { text: 'みず です。(Mizu desu.)', ok: false, reply: 'Mizu artinya air, bukan nama orang.' },
        ],
      },
      {
        npc: '🐶 Kenji',
        npcText: 'どんな どうぶつ が すき ですか？',
        romaji: 'Donna doubutsu ga suki desu ka?',
        hint: 'Kenji bertanya hewan apa yang kamu suka! Jawab "[Hewan] ga suki desu."',
        options: [
          { text: 'ねこ が すき です。(Neko ga suki desu.)', ok: true, reply: 'いいね！わたし も ねこ が だいすき です！(Asyik! Aku juga suka kucing!)' },
          { text: 'あした いきます。(Ashita ikimasu.)', ok: false, reply: 'Ashita ikimasu artinya pergi besok, bukan hewan kesukaan.' },
          { text: 'えんぴつ です。(Enpitsu desu.)', ok: false, reply: 'Enpitsu artinya pensil, bukan hewan.' },
        ],
      },
      {
        npc: '🍎 Ibu di Dapur',
        npcText: 'あさごはん に なに を たべたい ですか？',
        romaji: 'Asagohan ni nani o tabetai desu ka?',
        hint: 'Jawab makanan yang ingin kamu makan untuk sarapan dengan "...o tabetai desu."',
        options: [
          { text: 'パン と たまご を たべたい です。(Pan to tamago o tabetai desu.)', ok: true, reply: 'はい、いま つくります ね！(Baik, Ibu buatkan sekarang ya!)' },
          { text: 'きのう にちようび でした。(Kinou nichiyoubi deshita.)', ok: false, reply: 'Ibu menanyakan menu sarapan, bukan hari kemarin.' },
          { text: 'きいろ と みどり です。(Kiiro to midori desu.)', ok: false, reply: 'Kiiro dan midori adalah nama warna.' },
        ],
      },
    ],
    SMP: [
      {
        npc: '🍜 Penjual Ramen',
        npcText: 'いらっしゃいませ！なに を たべますか？',
        romaji: 'Irasshaimase! Nani o tabemasu ka?',
        hint: 'Pesan ramen secara sopan dengan "...o kudasai"!',
        options: [
          { text: 'ラーメン を ください。(Raamen o kudasai.)', ok: true, reply: 'はい、かしこまりました！おいしい ラーメン です！(Baik, siap!)' },
          { text: 'がっこう へ いきます。(Gakkou e ikimasu.)', ok: false, reply: 'Itu artinya pergi ke sekolah, bukan memesan makanan.' },
          { text: 'おやすみなさい。(Oyasuminasai.)', ok: false, reply: 'Oyasuminasai artinya selamat tidur!' },
        ],
      },
      {
        npc: '🚉 Petugas Stasiun',
        npcText: 'すみません、どこ へ いきますか？',
        romaji: 'Sumimasen, doko e ikimasu ka?',
        hint: 'Sebutkan tempat tujuanmu dengan "[Tempat] e ikimasu"!',
        options: [
          { text: 'としょかん へ いきます。(Toshokan e ikimasu.)', ok: true, reply: 'あちら の みぎ です よ！(Di sebelah kanan sana ya!)' },
          { text: 'とても おいしい です。(Totemo oishii desu.)', ok: false, reply: 'Itu artinya sangat lezat, bukan arah tujuan.' },
          { text: 'あか と あお です。(Aka to ao desu.)', ok: false, reply: 'Itu nama warna (merah dan biru).' },
        ],
      },
      {
        npc: '⚽ Teman Klub',
        npcText: 'しゅうまつ は なに を しますか？',
        romaji: 'Shuumatsu wa nani o shimasu ka?',
        hint: 'Ceritakan rencanamu saat akhir pekan dengan "...shimasu"!',
        options: [
          { text: 'ともだち と サッカー を します。(Tomodachi to sakkaa o shimasu.)', ok: true, reply: 'たのしそう です ね！がんばって！(Kedengarannya seru! Semangat!)' },
          { text: 'きょう は あつい です。(Kyou wa atsui desu.)', ok: false, reply: 'Itu membicarakan cuaca hari ini, bukan rencana kegiatan.' },
          { text: 'わたし の かばん です。(Watashi no kaban desu.)', ok: false, reply: 'Itu artinya "Ini tas saya", tidak menjawab pertanyaan.' },
        ],
      },
    ],
    SMA: [
      {
        npc: '👨‍🏫 Tanaka Sensei',
        npcText: 'しょうらい、どんな しごと が したい ですか？',
        romaji: 'Shourai, donna shigoto ga shitai desu ka?',
        hint: 'Jawab cita-citamu dengan bahasa sopan (teineigo) kepada guru!',
        options: [
          { text: 'エンジニア に なりたい です。まいにち どりょく します。', ok: true, reply: 'すばらしい ですね！おうえん しています！(Luar biasa, saya mendukungmu!)' },
          { text: 'しらない よ。(Shiranai yo.)', ok: false, reply: 'Terlalu kasual untuk berbicara dengan guru (sensei)! Gunakan bentuk sopan desu/masu.' },
          { text: 'きのう たべました。(Kinou tabemashita.)', ok: false, reply: 'Sensei bertanya tentang cita-cita masa depan (shourai).' },
        ],
      },
      {
        npc: '🏢 Pewawancara Magang',
        npcText: 'あなた の つよみ は なんですか？',
        romaji: 'Anata no tsuyomi wa nan desu ka?',
        hint: 'Ceritakan kelebihanmu saat bekerja sama dalam tim dengan sopan!',
        options: [
          { text: 'わたし は チーム で きょうりょく する こと が とくい です。', ok: true, reply: 'とても いい ですね！いっしょに がんばりましょう！(Bagus sekali! Mari berjuang bersama!)' },
          { text: 'きょう は あめ です。(Kyou wa ame desu.)', ok: false, reply: 'Itu membicarakan cuaca hari ini, bukan kelebihan dirimu.' },
          { text: 'おなか が すいた。(Onaka ga suita.)', ok: false, reply: 'Tidak tepat mengatakan sedang lapar di tengah wawancara.' },
        ],
      },
      {
        npc: '🌿 Anggota Klub Sains',
        npcText: 'かんきょう を まもる ため に、なに が できる と おもいますか？',
        romaji: 'Kankyou o mamoru tame ni, nani ga dekiru to omoimasu ka?',
        hint: 'Sampaikan pendapatmu tentang menjaga lingkungan dengan "...to omoimasu"!',
        options: [
          { text: 'まいにち リサイクル を つづける べき だ と おもいます。', ok: true, reply: 'さんせい です！ちいさな どりょく が たいせつ です ね。(Setuju! Usaha kecil itu sangat penting!)' },
          { text: 'テレビ を みます。(Terebi o mimasu.)', ok: false, reply: 'Menonton TV tidak menjawab cara menjaga lingkungan.' },
          { text: 'おいしい ラーメン です。(Oishii raamen desu.)', ok: false, reply: 'Kalimat tidak sesuai topik diskusi lingkungan.' },
        ],
      },
    ],
  },

  zh: {
    SD: [
      {
        npc: '🐼 Xiao Ming',
        npcText: '你好！你喜欢什么动物？',
        romaji: 'Nǐ hǎo! Nǐ xǐhuan shénme dòngwù?',
        hint: 'Xiao Ming bertanya hewan apa yang kamu suka! Jawab "Wǒ xǐhuan..."',
        options: [
          { text: '你好！我喜欢小猫。(Nǐ hǎo! Wǒ xǐhuan xiǎo māo.)', ok: true, reply: '太好了！我也喜欢小猫！(Keren! Aku juga suka kucing!)' },
          { text: '谢谢！(Xièxie!)', ok: false, reply: 'Xièxie artinya terima kasih, belum menjawab pertanyaannya.' },
          { text: '再见！(Zàijiàn!)', ok: false, reply: 'Zàijiàn artinya sampai jumpa!' },
        ],
      },
      {
        npc: '🍎 Penjual Buah',
        npcText: '小朋友，你想买什么水果？',
        romaji: 'Xiǎopéngyou, nǐ xiǎng mǎi shénme shuǐguǒ?',
        hint: 'Jawab buah yang ingin kamu beli dengan sopan!',
        options: [
          { text: '我想买三个苹果，谢谢！(Wǒ xiǎng mǎi sān gè píngguǒ, xièxie!)', ok: true, reply: '给你！这个苹果很甜！(Ini dia! Apelnya sangat manis!)' },
          { text: '今天是星期一。(Jīntiān shì xīngqīyī.)', ok: false, reply: 'Penjual bertanya buah apa yang mau dibeli, bukan hari apa.' },
          { text: '我喜欢蓝色。(Wǒ xǐhuan lánsè.)', ok: false, reply: 'Lánsè artinya warna biru, bukan nama buah.' },
        ],
      },
      {
        npc: '👩‍🏫 Guru Kelas',
        npcText: '同学们，现在几点了？',
        romaji: 'Tóngxuémen, xiànzài jǐ diǎn le?',
        hint: 'Jawab jam sekarang dengan angka Mandarin + "diǎn"!',
        options: [
          { text: '老师，现在早上八点了。(Lǎoshī, xiànzài zǎoshang bā diǎn le.)', ok: true, reply: '非常好！我们开始上课吧！(Bagus sekali! Mari mulai belajar!)' },
          { text: '这是我的铅笔。(Zhè shì wǒ de qiānbǐ.)', ok: false, reply: 'Itu menjelaskan pensilmu, bukan jam sekarang.' },
          { text: '太阳很大。(Tàiyáng hěn dà.)', ok: false, reply: 'Guru menanyakan pukul berapa sekarang.' },
        ],
      },
    ],
    SMP: [
      {
        npc: '🧋 Kasir Kedai',
        npcText: '欢迎光临！你想喝什么？',
        romaji: 'Huānyíng guānglín! Nǐ xiǎng hē shénme?',
        hint: 'Kasir bertanya kamu mau minum apa. Jawab dengan "Wǒ xiǎng hē..."!',
        options: [
          { text: '我想喝一杯水，谢谢。(Wǒ xiǎng hē yī bēi shuǐ, xièxie.)', ok: true, reply: '好的，请稍等！(Baik, mohon tunggu sebentar!)' },
          { text: '我去学校。(Wǒ qù xuéxiào.)', ok: false, reply: 'Itu artinya "Saya pergi ke sekolah".' },
          { text: '很贵！(Hěn guì!)', ok: false, reply: 'Hěn guì artinya mahal, padahal belum memesan!' },
        ],
      },
      {
        npc: '🚲 Teman Baru',
        npcText: '周末你常做什么运动？',
        romaji: 'Zhōumò nǐ cháng zuò shénme yùndòng?',
        hint: 'Ceritakan olahraga yang sering kamu lakukan saat akhir pekan!',
        options: [
          { text: '周末我经常去游泳和踢足球。(Zhōumò wǒ jīngcháng qù yóuyǒng hé tī zúqiú.)', ok: true, reply: '真健康！下次我们一起踢球吧！(Sehat sekali! Kapan-kapan kita main bola bersama!)' },
          { text: '我的书包在桌子上。(Wǒ de shūbāo zài zhuōzi shàng.)', ok: false, reply: 'Itu membahas letak tas sekolah, bukan olahraga akhir pekan.' },
          { text: '我忘带铅笔了。(Wǒ wàng dài qiānbǐ le.)', ok: false, reply: 'Tidak nyambung dengan pertanyaan hobi olahraga.' },
        ],
      },
      {
        npc: '🏥 Dokter Klinik',
        npcText: '你今天哪里不舒服？',
        romaji: 'Nǐ jīntiān nǎlǐ bù shūfu?',
        hint: 'Ceritakan keluhan kesehatanmu dalam bahasa Mandarin!',
        options: [
          { text: '我有点儿发烧，还有点儿头疼。(Wǒ yǒudiǎnr fāshāo, hái yǒudiǎnr tóuténg.)', ok: true, reply: '多喝热水，按时吃药，好好休息！(Banyak minum air hangat, minum obat teratur, dan istirahat ya!)' },
          { text: '超市在医院右边。(Chāoshì zài yīyuàn yòubiān.)', ok: false, reply: 'Itu memberi petunjuk arah, bukan gejala sakitmu.' },
          { text: '这道菜很好吃。(Zhè dào cài hěn hǎochī.)', ok: false, reply: 'Kamu sedang berkonsultasi dengan dokter, bukan di restoran.' },
        ],
      },
    ],
    SMA: [
      {
        npc: '👩‍🎓 Li Mei',
        npcText: '你为什么努力学习汉语？',
        romaji: 'Nǐ wèishénme nǔlì xuéxí Hànyǔ?',
        hint: 'Gunakan pola "因为...所以..." (karena... maka...) untuk menjawab!',
        options: [
          { text: '因为我对中国文化很感兴趣，所以努力学习。(Yīnwèi wǒ duì Zhōngguó wénhuà hěn gǎn xìngqù, suǒyǐ nǔlì xuéxí.)', ok: true, reply: '说得真棒！你的汉语越来越好了！(Bagus sekali! Mandarinmu makin hebat!)' },
          { text: '今天天气很好。(Jīntiān tiānqì hěn hǎo.)', ok: false, reply: 'Li Mei bertanya alasanmu belajar Mandarin, bukan cuaca hari ini.' },
          { text: '我不吃饭。(Wǒ bù chīfàn.)', ok: false, reply: 'Tidak nyambung dengan pertanyaan tentang belajar Mandarin.' },
        ],
      },
      {
        npc: '💼 Mentor Inovasi',
        npcText: '人工智能对未来的职业发展有什么影响？',
        romaji: 'Réngōng zhìnéng duì wèilái de zhíyè fāzhǎn yǒu shénme yǐngxiǎng?',
        hint: 'Jawab pengaruh teknologi AI terhadap karier masa depan dengan logis!',
        options: [
          { text: '它能提高工作效率，所以我们必须持续学习新技能。(Tā néng tígāo gōngzuò xiàolǜ, suǒyǐ wǒmen bìxū chíxù xuéxí xīn jìnéng.)', ok: true, reply: '分析得很深入！终身学习非常重要！(Analisis yang tajam! Belajar sepanjang hayat itu sangat penting!)' },
          { text: '我喜欢吃面条。(Wǒ xǐhuan chī miàntiáo.)', ok: false, reply: 'Topiknya tentang teknologi dan karier, bukan makanan.' },
          { text: '现在是下午三点。(Xiànzài shì xiàwǔ sāndiǎn.)', ok: false, reply: 'Itu menyatakan jam, bukan dampak AI.' },
        ],
      },
      {
        npc: '🌏 Moderator Forum',
        npcText: '保护环境需要哪些实际行动？',
        romaji: 'Bǎohù huánjìng xūyào nǎxiē shíjì xíngdòng?',
        hint: 'Usulkan langkah nyata pelestarian lingkungan dengan pola yang jelas!',
        options: [
          { text: '我们可以节约能源，并且积极参与垃圾回收。(Wǒmen kěyǐ jiéyuē néngyuán, bìngqiě jījí cānyù lājī huíshōu.)', ok: true, reply: '说得很有道理！每个人都能贡献力量！(Sangat masuk akal! Setiap orang bisa berkontribusi!)' },
          { text: '我昨天买了一双鞋子。(Wǒ zuótiān mǎi le yī shuāng xiézi.)', ok: false, reply: 'Tidak berkaitan dengan pelestarian lingkungan.' },
          { text: '这本书太贵了。(Zhè běn shū tài guì le.)', ok: false, reply: 'Itu membahas harga buku, bukan aksi lingkungan.' },
        ],
      },
    ],
  },
};
