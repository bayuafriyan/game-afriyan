// Web Speech API Helper: Native TTS (en-US, ja-JP, zh-CN) + Live Microphone Speaking Check

export function speakNative(text, lang = 'en-US', rate = 0.95) {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  if (match) utter.voice = match;
  window.speechSynthesis.speak(utter);
  return true;
}

export function isSpeechRecognitionSupported() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startListening(lang = 'en-US', { onResult, onError, onEnd }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    if (onError) onError('Browser ini belum mendukung mikrofon otomatis. Gunakan Chrome/Edge untuk latihan Speaking langsung.');
    return null;
  }

  const recognition = new SR();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  recognition.onresult = (event) => {
    const alts = [];
    for (let i = 0; i < event.results[0].length; i++) {
      alts.push(event.results[0][i].transcript);
    }
    if (onResult) onResult(alts);
  };

  recognition.onerror = (event) => {
    if (onError) onError(event.error === 'not-allowed' ? 'Izin mikrofon ditolak. Aktifkan izin mikrofon di browser.' : `Gagal mendengar (${event.error}). Coba ucapkan lagi!`);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
  } catch (err) {
    if (onError) onError('Mikrofon sedang digunakan. Coba lagi sebentar.');
  }
  return recognition;
}

function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[.,!?;:。、！？\s'"()\-]/g, '');
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function evaluateSpeech(transcripts, targets) {
  let bestScore = 0;
  let bestHeard = transcripts[0] || '';
  for (const heard of transcripts) {
    const hNorm = normalizeText(heard);
    for (const target of targets) {
      const tNorm = normalizeText(target);
      if (!tNorm) continue;
      if (hNorm === tNorm || hNorm.includes(tNorm) || tNorm.includes(hNorm)) {
        return { score: 100, heard };
      }
      const dist = levenshtein(hNorm, tNorm);
      const maxLen = Math.max(hNorm.length, tNorm.length, 1);
      const pct = Math.max(0, Math.round((1 - dist / maxLen) * 100));
      if (pct > bestScore) {
        bestScore = pct;
        bestHeard = heard;
      }
    }
  }
  return { score: bestScore, heard: bestHeard };
}
