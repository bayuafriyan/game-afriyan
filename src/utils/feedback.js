/**
 * Feedback API client with strict client-side validation and offline localStorage fallback.
 */

const LOCAL_FEEDBACK_KEY = 'cerdasplay_feedback_local_v1';

export const FEEDBACK_ROLES = ['Siswa', 'Orang Tua', 'Guru', 'Umum'];
export const FEEDBACK_CATEGORIES = [
  'Saran Fitur',
  'Materi Soal',
  'Bug/Kendala',
  'Desain & UI',
  'Keamanan',
  'Apresiasi',
];

function sanitizeText(raw, allowNewlines = false) {
  let str = typeof raw === 'string' ? raw : '';
  str = str.replace(
    allowNewlines ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g,
    ' '
  );
  str = str.replace(/[<>]/g, '');
  if (allowNewlines) {
    str = str.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n');
  } else {
    str = str.replace(/\s+/g, ' ');
  }
  return str.trim();
}

function readLocalFeedback() {
  try {
    const raw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .slice(0, 20)
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        id: Number(item.id) || 0,
        name: sanitizeText(item.name, false).slice(0, 40) || 'Sahabat Belajar',
        role: FEEDBACK_ROLES.includes(item.role) ? item.role : 'Umum',
        category: FEEDBACK_CATEGORIES.includes(item.category) ? item.category : 'Saran Fitur',
        rating: Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5 ? item.rating : 5,
        message: sanitizeText(item.message, true).slice(0, 600),
        created_at: typeof item.created_at === 'string' ? item.created_at : new Date().toISOString(),
      }))
      .filter((item) => item.message.length >= 10);
  } catch {
    return [];
  }
}

function writeLocalFeedback(items) {
  try {
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(items.slice(0, 20)));
  } catch {
    // Ignore storage quota errors
  }
}

export async function sendFeedback(payload) {
  const rawName = sanitizeText(payload?.name, false);
  const name = rawName === '' ? 'Sahabat Belajar' : rawName;
  const role = typeof payload?.role === 'string' ? payload.role.trim() : '';
  const category = typeof payload?.category === 'string' ? payload.category.trim() : '';
  const rating = Number(payload?.rating);
  const message = sanitizeText(payload?.message, true);
  const website = typeof payload?.website === 'string' ? payload.website : '';
  const elapsedMs = Number(payload?.elapsedMs || 0);

  if (name.length < 2 || name.length > 40) {
    return { ok: false, error: 'Nama harus antara 2 hingga 40 karakter.' };
  }
  if (!FEEDBACK_ROLES.includes(role)) {
    return { ok: false, error: 'Pilih peran pengirim yang valid.' };
  }
  if (!FEEDBACK_CATEGORIES.includes(category)) {
    return { ok: false, error: 'Pilih kategori masukan yang valid.' };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: 'Rating bintang harus 1 sampai 5.' };
  }
  if (message.length < 10 || message.length > 600) {
    return { ok: false, error: 'Pesan kritik dan saran minimal 10 dan maksimal 600 karakter.' };
  }
  if (/(https?:\/\/|www\.|javascript:|data:text\/html)/i.test(message)) {
    return { ok: false, error: 'Demi keamanan, pesan tidak boleh berisi tautan URL.' };
  }

  const isFileOrigin = typeof window !== 'undefined' && window.location?.protocol === 'file:';
  if (!isFileOrigin) {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          role,
          category,
          rating,
          message,
          website,
          elapsedMs,
        }),
      });
      const contentType = (res.headers.get('Content-Type') || '').toLowerCase();
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok && data?.ok) {
          return { ok: true, source: 'server', item: data.item };
        }
        if (res.status !== 404 && res.status !== 405 && res.status !== 501) {
          return {
            ok: false,
            status: res.status,
            error: data?.error || 'Pengiriman masukan ditolak server.',
          };
        }
      } else if (res.status >= 400 && res.status !== 404 && res.status !== 405) {
        return { ok: false, status: res.status, error: 'Server menolak permintaan ini.' };
      }
    } catch {
      // Offline / network error: fall through to local backup
    }
  }

  const current = readLocalFeedback();
  const duplicate = current.find(
    (entry) =>
      entry.message === message &&
      Date.now() - new Date(entry.created_at).getTime() < 10 * 60 * 1000
  );
  if (duplicate) {
    return { ok: false, error: 'Masukan yang sama baru saja tersimpan di perangkat ini.' };
  }

  const localItem = {
    id: Date.now(),
    name,
    role,
    category,
    rating,
    message,
    created_at: new Date().toISOString(),
  };
  writeLocalFeedback([localItem, ...current]);
  return { ok: true, source: 'local', item: localItem };
}
