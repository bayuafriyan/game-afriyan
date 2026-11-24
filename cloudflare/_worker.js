/**
 * Edge security gateway & /api/feedback handler (Cloudflare Pages Advanced Mode).
 * Enforces HTTPS, blocks scanner/traversal probes, restricts HTTP methods,
 * applies strict security headers to all responses, and validates feedback via D1.
 */

const ALLOWED_ROLES = new Set(['Siswa', 'Orang Tua', 'Guru', 'Umum']);
const ALLOWED_CATEGORIES = new Set([
  'Saran Fitur',
  'Materi Soal',
  'Bug/Kendala',
  'Desain & UI',
  'Keamanan',
  'Apresiasi',
]);

const MAX_BODY_BYTES = 4096;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 3;
const MIN_HUMAN_ELAPSED_MS = 1200;

const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "media-src 'self' blob: data: https:",
  "connect-src 'self'",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ');

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Permissions-Policy':
    'microphone=(self), camera=(), geolocation=(), payment=(), usb=(), bluetooth=(), interest-cohort=()',
  'Content-Security-Policy': CSP_POLICY,
};

const BLOCKED_PATH_PREFIXES = [
  '/.env',
  '/.git',
  '/.svn',
  '/.hg',
  '/.aws',
  '/.ssh',
  '/.htaccess',
  '/.htpasswd',
  '/.ds_store',
  '/.assetsignore',
  '/cloudflare',
  '/node_modules',
  '/vendor',
  '/wp-admin',
  '/wp-login',
  '/wp-content',
  '/wp-includes',
  '/xmlrpc.php',
  '/phpmyadmin',
  '/pma',
  '/cgi-bin',
  '/actuator',
  '/server-status',
  '/boaform',
  '/package.json',
  '/package-lock.json',
  '/composer.json',
  '/composer.lock',
];

const BLOCKED_EXTENSIONS_RE =
  /\.(?:php\d*|phtml|asp|aspx|jsp|cgi|pl|py|rb|sh|bat|ps1|exe|dll|sql|sqlite|db|bak|old|orig|swp|swo|ini|conf|cfg|log|yml|yaml|toml|env|pem|key|crt)$/i;

function applySecurityHeaders(headers, isApi = false) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  headers.delete('X-Powered-By');
  headers.delete('Server');
  if (isApi) {
    headers.set('Cache-Control', 'no-store, max-age=0');
    headers.set('Pragma', 'no-cache');
    headers.set('Vary', 'Origin');
  }
  return headers;
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders,
  });
  applySecurityHeaders(headers, true);
  return new Response(JSON.stringify(payload), { status, headers });
}

function textResponse(message, status, extraHeaders = {}) {
  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    ...extraHeaders,
  });
  applySecurityHeaders(headers, false);
  return new Response(message, { status, headers });
}

function isLocalHostname(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function isSuspiciousPath(requestUrl, url) {
  if (requestUrl.length > 2048 || url.pathname.length > 512) return true;
  if (/[\u0000-\u001F\u007F\\]/.test(url.pathname)) return true;

  let decoded = url.pathname;
  try {
    decoded = decodeURIComponent(decoded);
    if (decoded.includes('%')) {
      decoded = decodeURIComponent(decoded);
    }
  } catch {
    return true;
  }

  if (/[\u0000-\u001F\u007F\\]/.test(decoded)) return true;
  const lower = decoded.toLowerCase();
  if (lower.includes('..')) return true;

  const segments = lower.split('/').filter(Boolean);
  if (segments.some((seg) => seg === '.' || seg === '..' || seg.startsWith('.'))) {
    return true;
  }
  if (BLOCKED_PATH_PREFIXES.some((prefix) => lower === prefix || lower.startsWith(`${prefix}/`))) {
    return true;
  }
  if (BLOCKED_EXTENSIONS_RE.test(lower)) {
    return true;
  }
  return false;
}

function isAllowedOrigin(request, url) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  let parsed;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }
  if (parsed.origin === url.origin) return true;

  // Allow official project production and Cloudflare preview subdomains
  if (
    parsed.protocol === 'https:' &&
    (parsed.hostname === 'makincerdasmakinsukses.pages.dev' ||
      /^[a-z0-9-]{1,63}\.makincerdasmakinsukses\.pages\.dev$/i.test(parsed.hostname))
  ) {
    return true;
  }

  if (isLocalHostname(url.hostname) && isLocalHostname(parsed.hostname)) {
    return true;
  }
  return false;
}

async function readBoundedJson(request, maxBytes) {
  const contentLength = request.headers.get('Content-Length');
  if (contentLength !== null) {
    const parsedLen = Number(contentLength);
    if (!Number.isFinite(parsedLen) || parsedLen < 0 || parsedLen > maxBytes) {
      return { error: 'payload_too_large' };
    }
  }

  if (!request.body) {
    return { error: 'empty_body' };
  }

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      return { error: 'payload_too_large' };
    }
    chunks.push(value);
  }

  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(merged);
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { error: 'invalid_json' };
    }
    return { data };
  } catch {
    return { error: 'invalid_json' };
  }
}

async function hashClientIp(request, env) {
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    '0.0.0.0';
  const daySalt = new Date().toISOString().slice(0, 10);
  const secretSalt = env.RATE_LIMIT_SALT || 'mcs-pages-2026-shield';
  const data = new TextEncoder().encode(`${daySalt}:${secretSalt}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function checkAndIncrementRateLimit(db, ipHash) {
  const now = Date.now();
  const windowCutoff = now - RATE_WINDOW_MS;

  // Opportunistic cleanup of stale rate-limit windows older than 1 hour
  await db.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(now - 3600_000).run();

  const existing = await db
    .prepare('SELECT window_start, req_count FROM rate_limits WHERE ip_hash = ?')
    .bind(ipHash)
    .first();

  if (!existing || existing.window_start < windowCutoff) {
    await db
      .prepare(
        'INSERT INTO rate_limits (ip_hash, window_start, req_count) VALUES (?, ?, 1) ' +
          'ON CONFLICT(ip_hash) DO UPDATE SET window_start = excluded.window_start, req_count = 1'
      )
      .bind(ipHash, now)
      .run();
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.req_count >= RATE_MAX_REQUESTS) {
    const remainingMs = Math.max(1000, RATE_WINDOW_MS - (now - existing.window_start));
    return { allowed: false, retryAfterSec: Math.ceil(remainingMs / 1000) };
  }

  await db
    .prepare('UPDATE rate_limits SET req_count = req_count + 1 WHERE ip_hash = ?')
    .bind(ipHash)
    .run();
  return { allowed: true, retryAfterSec: 0 };
}

function sanitizeInputText(raw, allowNewlines = false) {
  let str = typeof raw === 'string' ? raw : '';
  str = str.replace(allowNewlines ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ');
  str = str.replace(/[<>]/g, '');
  if (allowNewlines) {
    str = str.replace(/\r/g, '').replace(/\n{3,}/g, '\n\n');
  } else {
    str = str.replace(/\s+/g, ' ');
  }
  return str.trim();
}

async function handleGetFeedback(request, env, url) {
  if (!env.DB) {
    return jsonResponse({ ok: false, error: 'Layanan database belum siap.' }, 503);
  }
  const rawLimit = Number(url.searchParams.get('limit') || '12');
  const limit = Number.isFinite(rawLimit) ? Math.min(20, Math.max(1, Math.floor(rawLimit))) : 12;

  const listResult = await env.DB.prepare(
    'SELECT id, name, role, category, rating, message, created_at FROM feedback ORDER BY id DESC LIMIT ?'
  )
    .bind(limit)
    .all();

  const statsRow = await env.DB.prepare(
    'SELECT COUNT(*) AS total, COALESCE(AVG(rating), 0) AS avg_rating FROM feedback'
  ).first();

  return jsonResponse({
    ok: true,
    items: listResult?.results || [],
    stats: {
      total: Number(statsRow?.total || 0),
      avgRating: Number(Number(statsRow?.avg_rating || 0).toFixed(2)),
    },
  });
}

async function handlePostFeedback(request, env, url) {
  if (!env.DB) {
    return jsonResponse({ ok: false, error: 'Layanan database belum siap.' }, 503);
  }

  // Strict same-origin / CSRF protection
  const secFetchSite = request.headers.get('Sec-Fetch-Site');
  if (secFetchSite && secFetchSite !== 'same-origin') {
    return jsonResponse({ ok: false, error: 'Permintaan lintas situs ditolak.' }, 403);
  }
  if (!isAllowedOrigin(request, url)) {
    return jsonResponse({ ok: false, error: 'Asal permintaan tidak diizinkan.' }, 403);
  }

  const contentType = (request.headers.get('Content-Type') || '').toLowerCase();
  if (!contentType.startsWith('application/json')) {
    return jsonResponse({ ok: false, error: 'Format konten harus application/json.' }, 415);
  }

  const parsedBody = await readBoundedJson(request, MAX_BODY_BYTES);
  if (parsedBody.error === 'payload_too_large') {
    return jsonResponse({ ok: false, error: 'Ukuran data melebihi batas maksimum 4 KB.' }, 413);
  }
  if (parsedBody.error) {
    return jsonResponse({ ok: false, error: 'Data JSON tidak valid.' }, 400);
  }

  const body = parsedBody.data;

  // Honeypot & automated bot timing checks
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return jsonResponse({ ok: false, error: 'Permintaan tidak valid.' }, 400);
  }
  const elapsedMs = Number(body.elapsedMs);
  if (!Number.isFinite(elapsedMs) || elapsedMs < MIN_HUMAN_ELAPSED_MS) {
    return jsonResponse(
      { ok: false, error: 'Mohon luangkan sejenak sebelum mengirim masukan.' },
      400
    );
  }

  // Validate fields against strict allowlists and lengths
  const rawName = sanitizeInputText(body.name, false);
  const name = rawName === '' ? 'Sahabat Belajar' : rawName;
  if (name.length < 2 || name.length > 40) {
    return jsonResponse({ ok: false, error: 'Nama harus antara 2 hingga 40 karakter.' }, 400);
  }

  const role = typeof body.role === 'string' ? body.role.trim() : '';
  if (!ALLOWED_ROLES.has(role)) {
    return jsonResponse({ ok: false, error: 'Peran pengirim tidak valid.' }, 400);
  }

  const category = typeof body.category === 'string' ? body.category.trim() : '';
  if (!ALLOWED_CATEGORIES.has(category)) {
    return jsonResponse({ ok: false, error: 'Kategori masukan tidak valid.' }, 400);
  }

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return jsonResponse({ ok: false, error: 'Rating harus berupa angka bulat 1 sampai 5.' }, 400);
  }

  const message = sanitizeInputText(body.message, true);
  if (message.length < 10 || message.length > 600) {
    return jsonResponse(
      { ok: false, error: 'Pesan kritik dan saran harus 10 hingga 600 karakter.' },
      400
    );
  }
  if (/(https?:\/\/|www\.|javascript:|data:text\/html)/i.test(message)) {
    return jsonResponse(
      { ok: false, error: 'Demi keamanan, pesan tidak boleh berisi tautan URL.' },
      400
    );
  }

  // IP rate limit check (3 writes / 10 min per hashed IP)
  const ipHash = await hashClientIp(request, env);
  const rate = await checkAndIncrementRateLimit(env.DB, ipHash);
  if (!rate.allowed) {
    return jsonResponse(
      {
        ok: false,
        error: 'Terlalu banyak pengiriman dalam waktu singkat. Coba lagi beberapa menit.',
      },
      429,
      { 'Retry-After': String(rate.retryAfterSec) }
    );
  }

  // Prevent identical duplicate submissions inside 10 minutes
  const dupCutoff = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const duplicate = await env.DB.prepare(
    'SELECT id FROM feedback WHERE message = ? AND created_at >= ? LIMIT 1'
  )
    .bind(message, dupCutoff)
    .first();

  if (duplicate) {
    return jsonResponse(
      { ok: false, error: 'Masukan yang sama baru saja tersimpan sebelumnya.' },
      409
    );
  }

  const createdAt = new Date().toISOString();
  const insertRes = await env.DB.prepare(
    'INSERT INTO feedback (name, role, category, rating, message, ip_hash, created_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id, name, role, category, rating, message, created_at'
  )
    .bind(name, role, category, rating, message, ipHash, createdAt)
    .first();

  return jsonResponse({ ok: true, item: insertRes }, 201);
}

export default {
  async fetch(request, env) {
    let url;
    try {
      url = new URL(request.url);
    } catch {
      return textResponse('Bad Request', 400);
    }

    // 1. Force HTTPS outside localhost
    const forwardedProto = request.headers.get('X-Forwarded-Proto');
    if (
      !isLocalHostname(url.hostname) &&
      (url.protocol === 'http:' || forwardedProto === 'http')
    ) {
      url.protocol = 'https:';
      const headers = new Headers({ Location: url.toString() });
      applySecurityHeaders(headers, false);
      return new Response(null, { status: 301, headers });
    }

    // 2. Block path traversal, scanner probes, hidden files, and backend config paths
    if (isSuspiciousPath(request.url, url)) {
      return textResponse('Forbidden', 403);
    }

    // 3. API routing with strict method checks
    if (url.pathname === '/api/feedback') {
      if (request.method === 'GET') {
        try {
          return await handleGetFeedback(request, env, url);
        } catch {
          return jsonResponse({ ok: false, error: 'Gagal memuat daftar masukan.' }, 500);
        }
      }
      if (request.method === 'POST') {
        try {
          return await handlePostFeedback(request, env, url);
        } catch {
          return jsonResponse({ ok: false, error: 'Gagal menyimpan masukan.' }, 500);
        }
      }
      return jsonResponse(
        { ok: false, error: 'Metode HTTP tidak diizinkan.' },
        405,
        { Allow: 'GET, POST' }
      );
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ ok: false, error: 'Endpoint tidak ditemukan.' }, 404);
    }

    // 4. Static assets only accept GET / HEAD
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return textResponse('Method Not Allowed', 405, { Allow: 'GET, HEAD' });
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const wrappedHeaders = new Headers(assetResponse.headers);
    applySecurityHeaders(wrappedHeaders, false);
    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers: wrappedHeaders,
    });
  },
};
