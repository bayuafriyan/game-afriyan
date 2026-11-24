// Smart Quiz Shuffler: Acak urutan soal + acak posisi opsi A/B/C/D + HTML escaping
// Menjamin distribusi kunci jawaban A/B/C/D seimbang dan tidak beruntun (anti-pola B semua)

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Menghasilkan urutan target indeks kunci jawaban (0..3) yang seimbang
 * dan mencegah jawaban sama muncul beruntun (>1 kali berturut-turut).
 */
function buildBalancedAnswerSlots(count) {
  const base = [];
  for (let i = 0; i < count; i++) {
    base.push(i % 4);
  }
  // Coba acak hingga tidak ada dua jawaban sama berturut-turut
  for (let attempt = 0; attempt < 40; attempt++) {
    const candidate = shuffleArray(base);
    let hasRun = false;
    for (let i = 1; i < candidate.length; i++) {
      if (candidate[i] === candidate[i - 1]) {
        hasRun = true;
        break;
      }
    }
    if (!hasRun) return candidate;
  }
  // Fallback: perbaiki secara deterministik jika ada yang berdekatan
  const fallback = shuffleArray(base);
  for (let i = 1; i < fallback.length; i++) {
    if (fallback[i] === fallback[i - 1]) {
      let swapIdx = fallback.findIndex(
        (v, idx) => idx > i && v !== fallback[i - 1]
      );
      if (swapIdx === -1) {
        swapIdx = fallback.findIndex(
          (v, idx) =>
            idx < i - 1 &&
            v !== fallback[i - 1] &&
            (idx === 0 || fallback[idx - 1] !== fallback[i]) &&
            fallback[idx + 1] !== fallback[i]
        );
      }
      if (swapIdx !== -1) {
        [fallback[i], fallback[swapIdx]] = [fallback[swapIdx], fallback[i]];
      }
    }
  }
  return fallback;
}

/**
 * Mengacak daftar soal sekaligus mengacak posisi opsi A/B/C/D tiap soal
 * sehingga kunci jawaban tersebar merata (A, B, C, D) dan tidak runtun.
 */
export function prepareBalancedQuestions(pool, maxCount) {
  const picked = shuffleArray(pool).slice(0, Math.min(maxCount, pool.length));
  const targetSlots = buildBalancedAnswerSlots(picked.length);

  return picked.map((q, idx) => {
    const correctText = q.options[q.answer];
    const distractors = shuffleArray(
      q.options.filter((_, optIdx) => optIdx !== q.answer)
    );

    const targetPos = Math.min(targetSlots[idx], q.options.length - 1);
    const newOptions = [...distractors];
    newOptions.splice(targetPos, 0, correctText);

    return {
      ...q,
      options: newOptions,
      answer: targetPos,
    };
  });
}
