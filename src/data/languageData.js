// Dataset Kurikulum Multibahasa (Inggris CEFR, Jepang JLPT, Mandarin YCT/HSK)
// Mengikuti skema concept_id seragam untuk SD, SMP, dan SMA

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
    levelLabel: { SD: 'YCT 1–3 / HSK 1', SMP: 'HSK 2–3', SMA: 'HSK 3–4' },
  },
};

export const LANG_VOCAB = {
  SD: [
    {
      concept_id: 'water',
      emoji: '💧',
      id: 'Air',
      en: { text: 'Water', phonetic: '/ˈwɔː.tər/', example: 'I drink water every day.', level: 'Pre-A1' },
      ja: { text: '水', reading: 'みず', romaji: 'mizu', strokes: 4, example: 'みず を のみます。', level: 'Pre-N5' },
      zh: { text: '水', pinyin: 'shuǐ', tones: [3], strokes: 4, example: '我喝水。(Wǒ hē shuǐ.)', level: 'YCT 1' },
    },
    {
      concept_id: 'sun',
      emoji: '☀️',
      id: 'Matahari',
      en: { text: 'Sun', phonetic: '/sʌn/', example: 'The sun is bright today.', level: 'Pre-A1' },
      ja: { text: '日', reading: 'ひ / たいよう', romaji: 'taiyou', strokes: 4, example: 'たいよう が あかるい です。', level: 'Pre-N5' },
      zh: { text: '日', pinyin: 'rì', tones: [4], strokes: 4, example: '太阳出来了。(Tàiyáng chūlái le.)', level: 'YCT 1' },
    },
    {
      concept_id: 'mountain',
      emoji: '⛰️',
      id: 'Gunung',
      en: { text: 'Mountain', phonetic: '/ˈmaʊn.tən/', example: 'That mountain is very tall.', level: 'A1' },
      ja: { text: '山', reading: 'やま', romaji: 'yama', strokes: 3, example: 'たかい やま です。', level: 'N5' },
      zh: { text: '山', pinyin: 'shān', tones: [1], strokes: 3, example: '这座山很高。(Zhè zuò shān hěn gāo.)', level: 'YCT 1' },
    },
    {
      concept_id: 'fire',
      emoji: '🔥',
      id: 'Api',
      en: { text: 'Fire', phonetic: '/faɪər/', example: 'Fire is hot.', level: 'Pre-A1' },
      ja: { text: '火', reading: 'ひ', romaji: 'hi', strokes: 4, example: 'ひ に き を つけて。', level: 'N5' },
      zh: { text: '火', pinyin: 'huǒ', tones: [3], strokes: 4, example: '火很热。(Huǒ hěn rè.)', level: 'YCT 1' },
    },
    {
      concept_id: 'tree',
      emoji: '🌳',
      id: 'Pohon',
      en: { text: 'Tree', phonetic: '/triː/', example: 'The tree is green.', level: 'Pre-A1' },
      ja: { text: '木', reading: 'き', romaji: 'ki', strokes: 4, example: 'おおきい き が あります。', level: 'N5' },
      zh: { text: '木', pinyin: 'mù', tones: [4], strokes: 4, example: '这是一棵树。(Zhè shì yī kē shù.)', level: 'YCT 1' },
    },
    {
      concept_id: 'hello',
      emoji: '👋',
      id: 'Halo / Selamat Siang',
      en: { text: 'Hello', phonetic: '/həˈloʊ/', example: 'Hello, my name is Budi!', level: 'Pre-A1' },
      ja: { text: 'こんにちは', reading: 'こんにちは', romaji: 'konnichiwa', strokes: 5, example: 'こんにちは！げんき ですか？', level: 'Pre-N5' },
      zh: { text: '你好', pinyin: 'nǐ hǎo', tones: [3, 3], strokes: 13, example: '你好，我叫小明的同学！', level: 'YCT 1' },
    },
    {
      concept_id: 'thanks',
      emoji: '🙏',
      id: 'Terima Kasih',
      en: { text: 'Thank you', phonetic: '/θæŋk juː/', example: 'Thank you for your help!', level: 'Pre-A1' },
      ja: { text: 'ありがとう', reading: 'ありがとう', romaji: 'arigatou', strokes: 5, example: 'ありがとう ございます！', level: 'Pre-N5' },
      zh: { text: '谢谢', pinyin: 'xièxie', tones: [4, 0], strokes: 12, example: '谢谢你！(Xièxie nǐ!)', level: 'YCT 1' },
    },
    {
      concept_id: 'cat',
      emoji: '🐱',
      id: 'Kucing',
      en: { text: 'Cat', phonetic: '/kæt/', example: 'I like my cute cat.', level: 'Pre-A1' },
      ja: { text: 'ねこ', reading: 'ねこ', romaji: 'neko', strokes: 4, example: 'かわいい ねこ です。', level: 'Pre-N5' },
      zh: { text: '猫', pinyin: 'māo', tones: [1], strokes: 11, example: '我喜欢小猫。(Wǒ xǐhuan xiǎo māo.)', level: 'YCT 1' },
    },
  ],

  SMP: [
    {
      concept_id: 'school',
      emoji: '🏫',
      id: 'Sekolah',
      en: { text: 'School', phonetic: '/skuːl/', example: 'I go to school by bicycle.', level: 'A2' },
      ja: { text: '学校', reading: 'がっこう', romaji: 'gakkou', strokes: 18, example: 'まいにち がっこう へ いきます。', level: 'N5' },
      zh: { text: '学校', pinyin: 'xuéxiào', tones: [2, 4], strokes: 18, example: '我去学校学习。(Wǒ qù xuéxiào xuéxí.)', level: 'HSK 1' },
    },
    {
      concept_id: 'friend',
      emoji: '🤝',
      id: 'Teman',
      en: { text: 'Friend', phonetic: '/frend/', example: 'She is my best friend.', level: 'A2' },
      ja: { text: '友達', reading: 'ともだち', romaji: 'tomodachi', strokes: 16, example: 'ともだち と べんきょう します。', level: 'N5' },
      zh: { text: '朋友', pinyin: 'péngyou', tones: [2, 0], strokes: 12, example: '他是我的好朋友。(Tā shì wǒ de hǎo péngyou.)', level: 'HSK 1' },
    },
    {
      concept_id: 'study',
      emoji: '📖',
      id: 'Belajar',
      en: { text: 'Study', phonetic: '/ˈstʌd.i/', example: 'We study science together.', level: 'A2' },
      ja: { text: '勉強', reading: 'べんきょう', romaji: 'benkyou', strokes: 21, example: 'にほんご を べんきょう しています。', level: 'N5' },
      zh: { text: '学习', pinyin: 'xuéxí', tones: [2, 2], strokes: 11, example: '我很喜欢学习汉语。', level: 'HSK 2' },
    },
    {
      concept_id: 'time',
      emoji: '⏰',
      id: 'Waktu',
      en: { text: 'Time', phonetic: '/taɪm/', example: 'What time does the class start?', level: 'A2' },
      ja: { text: '時間', reading: 'じかん', romaji: 'jikan', strokes: 22, example: 'じかん が ありません。', level: 'N5' },
      zh: { text: '时间', pinyin: 'shíjiān', tones: [2, 1], strokes: 14, example: '现在是什么时间？', level: 'HSK 2' },
    },
    {
      concept_id: 'delicious',
      emoji: '🍜',
      id: 'Enak / Lezat',
      en: { text: 'Delicious', phonetic: '/dɪˈlɪʃ.əs/', example: 'This fried rice is delicious!', level: 'A2' },
      ja: { text: '美味しい', reading: 'おいしい', romaji: 'oishii', strokes: 17, example: 'この ラーメン は おいしい です。', level: 'N5' },
      zh: { text: '好吃', pinyin: 'hǎochī', tones: [3, 1], strokes: 12, example: '这个面条很好吃！', level: 'HSK 2' },
    },
    {
      concept_id: 'travel',
      emoji: '✈️',
      id: 'Perjalanan / Wisata',
      en: { text: 'Travel', phonetic: '/ˈtræv.əl/', example: 'I want to travel around the world.', level: 'A2' },
      ja: { text: '旅行', reading: 'りょこう', romaji: 'ryokou', strokes: 16, example: 'なつやすみ に りょこう しました。', level: 'N4' },
      zh: { text: '旅游', pinyin: 'lǚyóu', tones: [3, 2], strokes: 22, example: '我喜欢去日本旅游。', level: 'HSK 2' },
    },
  ],

  SMA: [
    {
      concept_id: 'future',
      emoji: '🚀',
      id: 'Masa Depan',
      en: { text: 'Future', phonetic: '/ˈfjuː.tʃər/', example: 'Education shapes our bright future.', level: 'B1' },
      ja: { text: '将来', reading: 'しょうらい', romaji: 'shourai', strokes: 17, example: 'しょうらい、エンジニア に なりたい です。', level: 'N4' },
      zh: { text: '未来', pinyin: 'wèilái', tones: [4, 2], strokes: 12, example: '我们要为未来做好准备。', level: 'HSK 3' },
    },
    {
      concept_id: 'experience',
      emoji: '🌍',
      id: 'Pengalaman',
      en: { text: 'Experience', phonetic: '/ɪkˈspɪə.ri.əns/', example: 'That competition was a great experience.', level: 'B1' },
      ja: { text: '経験', reading: 'けいけん', romaji: 'keiken', strokes: 29, example: 'いい けいけん に なりました。', level: 'N4' },
      zh: { text: '经验', pinyin: 'jīngyàn', tones: [1, 4], strokes: 18, example: '这次比赛给了我很多经验。', level: 'HSK 3' },
    },
    {
      concept_id: 'environment',
      emoji: '🌱',
      id: 'Lingkungan',
      en: { text: 'Environment', phonetic: '/ɪnˈvaɪ.rən.mənt/', example: 'We must protect our environment.', level: 'B2' },
      ja: { text: '環境', reading: 'かんきょう', romaji: 'kankyou', strokes: 31, example: 'かんきょう を まもる こと が たいせつ です。', level: 'N3' },
      zh: { text: '环境', pinyin: 'huánjìng', tones: [2, 4], strokes: 22, example: '保护环境是每个人的责任。', level: 'HSK 3' },
    },
    {
      concept_id: 'opportunity',
      emoji: '⭐',
      id: 'Kesempatan / Peluang',
      en: { text: 'Opportunity', phonetic: '/ˌɒp.əˈtjuː.nə.ti/', example: 'Do not miss this golden opportunity.', level: 'B2' },
      ja: { text: '機会', reading: 'きかい', romaji: 'kikai', strokes: 22, example: 'また あう きかい が あります。', level: 'N4' },
      zh: { text: '机会', pinyin: 'jīhuì', tones: [1, 4], strokes: 12, example: '这是一个难得的机会。', level: 'HSK 3' },
    },
    {
      concept_id: 'effort',
      emoji: '💪',
      id: 'Usaha Keras',
      en: { text: 'Effort', phonetic: '/ˈef.ət/', example: 'Success comes from consistent effort.', level: 'B1' },
      ja: { text: '努力', reading: 'どりょく', romaji: 'doryoku', strokes: 9, example: 'まいにち どりょく すれば せいこう します。', level: 'N3' },
      zh: { text: '努力', pinyin: 'nǔlì', tones: [3, 4], strokes: 9, example: '只要努力，就一定会成功。', level: 'HSK 3' },
    },
    {
      concept_id: 'culture',
      emoji: '🏮',
      id: 'Budaya',
      en: { text: 'Culture', phonetic: '/ˈkʌl.tʃər/', example: 'Learning languages helps us understand culture.', level: 'B1' },
      ja: { text: '文化', reading: 'ぶんか', romaji: 'bunka', strokes: 8, example: 'にほん の ぶんか に きょうみ が あります。', level: 'N4' },
      zh: { text: '文化', pinyin: 'wénhuà', tones: [2, 4], strokes: 8, example: '我对中国传统文化很感兴趣。', level: 'HSK 3' },
    },
  ],
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
    ],
    SMA: [
      {
        npc: '👨‍🏫 Tanaka-sensei',
        npcText: 'しょうらい、どんな しごと が したい ですか？',
        romaji: 'Shourai, donna shigoto ga shitai desu ka?',
        hint: 'Jawab cita-citamu dengan bahasa sopan (-teineigo) kepada guru!',
        options: [
          { text: 'エンジニア に なりたい です。まいにち どりょく します。', ok: true, reply: 'すばらしい ですね！おうえん しています！(Luar biasa, saya mendukungmu!)' },
          { text: 'しらない よ。(Shiranai yo.)', ok: false, reply: 'Terlalu kasual untuk berbicara dengan guru (sensei)! Gunakan bentuk -desu/-masu.' },
          { text: 'きのう たべました。(Kinou tabemashita.)', ok: false, reply: 'Sensei bertanya tentang cita-cita masa depan (shourai).' },
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
    ],
  },
};
