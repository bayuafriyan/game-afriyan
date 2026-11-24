// Agregasi & Mesin Evaluasi Susun Kalimat & Grammar 3 Bahasa (EN CEFR, JA JLPT, ZH YCT/HSK)
// Mendukung 2 Model: (1) Susun/Tulis Bahasa Asli, (2) Susun/Tulis Terjemahan Indonesia

import { EN_SENTENCES } from './sentences/enSentences.js';
import { JA_SENTENCES } from './sentences/jaSentences.js';
import { ZH_SENTENCES } from './sentences/zhSentences.js';

export const SENTENCE_BANK = {
  en: EN_SENTENCES,
  ja: JA_SENTENCES,
  zh: ZH_SENTENCES,
};

function getTopicsByGrade(bank) {
  return {
    SD: [...new Set((bank.SD || []).map((x) => x.topic))],
    SMP: [...new Set((bank.SMP || []).map((x) => x.topic))],
    SMA: [...new Set((bank.SMA || []).map((x) => x.topic))],
  };
}

export const SENTENCE_TOPICS = {
  en: getTopicsByGrade(EN_SENTENCES),
  ja: getTopicsByGrade(JA_SENTENCES),
  zh: getTopicsByGrade(ZH_SENTENCES),
};

const totalSentences = ['en', 'ja', 'zh'].reduce((acc, lang) => {
  const byGrade = SENTENCE_BANK[lang];
  return acc + byGrade.SD.length + byGrade.SMP.length + byGrade.SMA.length;
}, 0);

export const TOTAL_SENTENCE_STATS = {
  totalSentences,
  totalChallenges: totalSentences * 2, // 2 model per kalimat
};

export function joinTargetTokens(lang, tokens, punct = '') {
  if (!Array.isArray(tokens) || tokens.length === 0) return '';
  if (lang === 'en') {
    return tokens.join(' ') + (punct || '');
  }
  return tokens.join('') + (punct || '');
}

function cleanBasic(text) {
  return String(text || '')
    .trim()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[,;，、；]/g, ' ')
    .replace(/[.?!。？！]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeEnglish(text, canonicalLower) {
  let s = cleanBasic(text).toLowerCase();
  const map = [
    [/\bdo not\b/g, 'do not'],
    [/\bdon't\b/g, 'do not'],
    [/\bdoes not\b/g, 'does not'],
    [/\bdoesn't\b/g, 'does not'],
    [/\bdid not\b/g, 'did not'],
    [/\bdidn't\b/g, 'did not'],
    [/\bis not\b/g, 'is not'],
    [/\bisn't\b/g, 'is not'],
    [/\bare not\b/g, 'are not'],
    [/\baren't\b/g, 'are not'],
    [/\bwas not\b/g, 'was not'],
    [/\bwasn't\b/g, 'was not'],
    [/\bwere not\b/g, 'were not'],
    [/\bweren't\b/g, 'were not'],
    [/\bhave not\b/g, 'have not'],
    [/\bhaven't\b/g, 'have not'],
    [/\bhas not\b/g, 'has not'],
    [/\bhasn't\b/g, 'has not'],
    [/\bhad not\b/g, 'had not'],
    [/\bhadn't\b/g, 'had not'],
    [/\bwill not\b/g, 'will not'],
    [/\bwon't\b/g, 'will not'],
    [/\bcan't\b/g, 'cannot'],
    [/\bcannot\b/g, 'cannot'],
    [/\bcouldn't\b/g, 'could not'],
    [/\bwouldn't\b/g, 'would not'],
    [/\bshouldn't\b/g, 'should not'],
    [/\bmustn't\b/g, 'must not'],
    [/\bi'm\b/g, 'i am'],
    [/\byou're\b/g, 'you are'],
    [/\bwe're\b/g, 'we are'],
    [/\bthey're\b/g, 'they are'],
    [/\bi've\b/g, 'i have'],
    [/\byou've\b/g, 'you have'],
    [/\bwe've\b/g, 'we have'],
    [/\bthey've\b/g, 'they have'],
    [/\bi'll\b/g, 'i will'],
    [/\byou'll\b/g, 'you will'],
    [/\bwe'll\b/g, 'we will'],
    [/\bthey'll\b/g, 'they will'],
    [/\bshe'll\b/g, 'she will'],
    [/\bhe'll\b/g, 'he will'],
    [/\bo clock\b/g, "o'clock"],
  ];
  for (const [pat, rep] of map) {
    s = s.replace(pat, rep);
  }
  if (canonicalLower.includes('she is')) s = s.replace(/\bshe's\b/g, 'she is');
  if (canonicalLower.includes('he is')) s = s.replace(/\bhe's\b/g, 'he is');
  if (canonicalLower.includes('it is')) s = s.replace(/\bit's\b/g, 'it is');
  if (canonicalLower.includes('she has')) s = s.replace(/\bshe's\b/g, 'she has');
  if (canonicalLower.includes('he has')) s = s.replace(/\bhe's\b/g, 'he has');
  return s.replace(/\s+/g, ' ').trim();
}

function normalizeScriptCompact(text) {
  return String(text || '')
    .trim()
    .replace(/[’‘`'"]/g, '')
    .replace(/[\s,，、；;.?!。？！・-]+/g, '');
}

function normalizeRomajiCompact(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[’‘`'\s,，、；;.?!。？！・-]+/g, '');
}

function normalizePinyinForms(text) {
  const withTones = String(text || '')
    .toLowerCase()
    .replace(/[’‘`'\s,，、；;.?!。？！-]+/g, '');
  const uForm = withTones
    .replace(/[ǖǘǚǜü]/g, 'u')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const vForm = withTones
    .replace(/[ǖǘǚǜü]/g, 'v')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return [withTones, uForm, vForm];
}

export function evaluateTargetSentence(lang, userText, item) {
  const raw = String(userText || '').trim();
  if (!raw || !item) return false;

  if (lang === 'en') {
    const canonicalLower = cleanBasic(item.target).toLowerCase();
    const userNorm = normalizeEnglish(raw, canonicalLower);
    const candidates = [item.target, ...(item.targetAlts || [])].map((c) => normalizeEnglish(c, canonicalLower));
    return candidates.includes(userNorm);
  }

  if (lang === 'ja') {
    const scriptCandidates = new Set(
      [item.target, item.reading, ...(item.targetAlts || [])]
        .filter(Boolean)
        .map(normalizeScriptCompact),
    );
    const userCompact = normalizeScriptCompact(raw);
    if (scriptCandidates.has(userCompact)) return true;

    const romajiSet = new Set();
    if (item.romaji) {
      romajiSet.add(normalizeRomajiCompact(item.romaji));
      if (Array.isArray(item.tokens) && item.tokens.includes('を')) {
        romajiSet.add(normalizeRomajiCompact(item.romaji.replace(/(^|\s)o(\s|$)/g, '$1wo$2')));
      }
    }
    const userRomaji = normalizeRomajiCompact(raw);
    return userRomaji.length > 0 && romajiSet.has(userRomaji);
  }

  if (lang === 'zh') {
    const hanziCandidates = new Set(
      [item.target, ...(item.targetAlts || [])]
        .filter(Boolean)
        .map(normalizeScriptCompact),
    );
    if (hanziCandidates.has(normalizeScriptCompact(raw))) return true;

    const pinyinSet = new Set();
    if (item.pinyin) {
      for (const form of normalizePinyinForms(item.pinyin)) {
        if (form) pinyinSet.add(form);
      }
    }
    for (const uForm of normalizePinyinForms(raw)) {
      if (uForm && pinyinSet.has(uForm)) return true;
    }
    return false;
  }

  return false;
}

function normalizeIndo(text) {
  return cleanBasic(text)
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\baku\b/g, 'saya')
    .replace(/\s+/g, ' ')
    .trim();
}

export function evaluateIndoTranslation(userText, item) {
  const raw = String(userText || '').trim();
  if (!raw || !item) return false;

  const userNorm = normalizeIndo(raw);
  const candidates = [item.indo, ...(item.indoAlts || [])].filter(Boolean).map(normalizeIndo);
  return candidates.includes(userNorm);
}
