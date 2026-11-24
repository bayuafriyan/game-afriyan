/**
 * Edge security gateway, traffic telemetry, dashboard API & /api/feedback handler
 * for Cloudflare Pages Advanced Mode (makincerdasmakinsukses.pages.dev).
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
const ALLOWED_EVENT_TYPES = new Set(['game_start', 'game_complete']);
const ALL_GAME_IDS = [
  'language',
  'tka',
  'quiz',
  'meteor',
  'memory',
  'scramble',
  'truefalse',
  'sort',
];
const ALLOWED_GAME_IDS = new Set(ALL_GAME_IDS);
const ALLOWED_GRADES = new Set(['SD', 'SMP', 'SMA']);

const MAX_BODY_BYTES = 4096;
const MAX_TELEMETRY_BYTES = 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 3;
const TELEMETRY_RATE_MAX = 60;
const MIN_HUMAN_ELAPSED_MS = 1200;

const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "media-src 'self' blob: data: https:",
  "connect-src 'self' https://cloudflareinsights.com https://*.cloudflareinsights.com",
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
  '/statistik',
  '/dashboard',
  '/analytics',
  '/analytics.html',
  '/_worker.js',
  '/_routes.json',
  '/_headers',
  '/.github',
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

function verifySameOriginWrite(request, url) {
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
  return null;
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

function getDeviceType(request) {
  const chMobile = request.headers.get('Sec-CH-UA-Mobile');
  if (chMobile === '?1') return 'mobile';
  const ua = request.headers.get('User-Agent') || '';
  return /(mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(ua)
    ? 'mobile'
    : 'desktop';
}

function getCountryCode(request) {
  const raw = request.cf?.country || request.headers.get('CF-IPCountry') || 'ID';
  const code = String(raw).trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : 'ID';
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

async function checkAndIncrementRateLimit(db, bucketKey, maxRequests = RATE_MAX_REQUESTS) {
  const now = Date.now();
  const windowCutoff = now - RATE_WINDOW_MS;

  await db.prepare('DELETE FROM rate_limits WHERE window_start < ?').bind(now - 3600_000).run();

  const existing = await db
    .prepare('SELECT window_start, req_count FROM rate_limits WHERE ip_hash = ?')
    .bind(bucketKey)
    .first();

  if (!existing || existing.window_start < windowCutoff) {
    await db
      .prepare(
        'INSERT INTO rate_limits (ip_hash, window_start, req_count) VALUES (?, ?, 1) ' +
          'ON CONFLICT(ip_hash) DO UPDATE SET window_start = excluded.window_start, req_count = 1'
      )
      .bind(bucketKey, now)
      .run();
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.req_count >= maxRequests) {
    const remainingMs = Math.max(1000, RATE_WINDOW_MS - (now - existing.window_start));
    return { allowed: false, retryAfterSec: Math.ceil(remainingMs / 1000) };
  }

  await db
    .prepare('UPDATE rate_limits SET req_count = req_count + 1 WHERE ip_hash = ?')
    .bind(bucketKey)
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

async function recordPageView(request, env) {
  if (!env.DB) return;
  try {
    const visitorHash = await hashClientIp(request, env);
    const nowIso = new Date().toISOString();
    const day = nowIso.slice(0, 10);
    const device = getDeviceType(request);
    const country = getCountryCode(request);

    const existing = await env.DB.prepare(
      'SELECT hits FROM visitor_daily WHERE day = ? AND visitor_hash = ?'
    )
      .bind(day, visitorHash)
      .first();

    const uniqueInc = existing ? 0 : 1;

    await env.DB.prepare(
      'INSERT INTO visitor_daily (day, visitor_hash, hits, country, device, last_seen) ' +
        'VALUES (?, ?, 1, ?, ?, ?) ' +
        'ON CONFLICT(day, visitor_hash) DO UPDATE SET ' +
        'hits = hits + 1, country = excluded.country, device = excluded.device, last_seen = excluded.last_seen'
    )
      .bind(day, visitorHash, country, device, nowIso)
      .run();

    const mobInc = device === 'mobile' ? 1 : 0;
    const deskInc = device === 'desktop' ? 1 : 0;

    await env.DB.prepare(
      'INSERT INTO traffic_daily (day, page_views, unique_visitors, game_starts, game_completions, mobile_hits, desktop_hits) ' +
        'VALUES (?, 1, ?, 0, 0, ?, ?) ' +
        'ON CONFLICT(day) DO UPDATE SET ' +
        'page_views = page_views + 1, ' +
        'unique_visitors = unique_visitors + excluded.unique_visitors, ' +
        'mobile_hits = mobile_hits + excluded.mobile_hits, ' +
        'desktop_hits = desktop_hits + excluded.desktop_hits'
    )
      .bind(day, uniqueInc, mobInc, deskInc)
      .run();
  } catch {
    // Telemetry failure must never interrupt asset serving
  }
}

async function handlePostFeedback(request, env, url) {
  if (!env.DB) {
    return jsonResponse({ ok: false, error: 'Layanan database belum siap.' }, 503);
  }

  const originErr = verifySameOriginWrite(request, url);
  if (originErr) return originErr;

  const parsedBody = await readBoundedJson(request, MAX_BODY_BYTES);
  if (parsedBody.error === 'payload_too_large') {
    return jsonResponse({ ok: false, error: 'Ukuran data melebihi batas maksimum 4 KB.' }, 413);
  }
  if (parsedBody.error) {
    return jsonResponse({ ok: false, error: 'Data JSON tidak valid.' }, 400);
  }

  const body = parsedBody.data;

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

  const ipHash = await hashClientIp(request, env);
  const rate = await checkAndIncrementRateLimit(env.DB, ipHash, RATE_MAX_REQUESTS);
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

async function handlePostTelemetry(request, env, url) {
  if (!env.DB) {
    return jsonResponse({ ok: false, error: 'Layanan database belum siap.' }, 503);
  }

  const originErr = verifySameOriginWrite(request, url);
  if (originErr) return originErr;

  const parsedBody = await readBoundedJson(request, MAX_TELEMETRY_BYTES);
  if (parsedBody.error === 'payload_too_large') {
    return jsonResponse({ ok: false, error: 'Ukuran telemetry melebihi 1 KB.' }, 413);
  }
  if (parsedBody.error) {
    return jsonResponse({ ok: false, error: 'Data JSON tidak valid.' }, 400);
  }

  const body = parsedBody.data;
  const eventType = typeof body.eventType === 'string' ? body.eventType.trim() : '';
  const gameId = typeof body.gameId === 'string' ? body.gameId.trim() : '';
  const grade = typeof body.grade === 'string' ? body.grade.trim() : '';

  if (!ALLOWED_EVENT_TYPES.has(eventType)) {
    return jsonResponse({ ok: false, error: 'Tipe event tidak valid.' }, 400);
  }
  if (!ALLOWED_GAME_IDS.has(gameId)) {
    return jsonResponse({ ok: false, error: 'ID permainan tidak valid.' }, 400);
  }
  if (!ALLOWED_GRADES.has(grade)) {
    return jsonResponse({ ok: false, error: 'Jenjang pendidikan tidak valid.' }, 400);
  }

  const rawScore = body.score === undefined ? 0 : Number(body.score);
  const rawXp = body.xpEarned === undefined ? 0 : Number(body.xpEarned);
  const score = Number.isFinite(rawScore) ? Math.min(100000, Math.max(0, Math.floor(rawScore))) : 0;
  const xpEarned = Number.isFinite(rawXp) ? Math.min(5000, Math.max(0, Math.floor(rawXp))) : 0;

  const visitorHash = await hashClientIp(request, env);
  const rate = await checkAndIncrementRateLimit(env.DB, `tel:${visitorHash}`, TELEMETRY_RATE_MAX);
  if (!rate.allowed) {
    return jsonResponse(
      { ok: false, error: 'Batas telemetry tercapai.' },
      429,
      { 'Retry-After': String(rate.retryAfterSec) }
    );
  }

  const device = getDeviceType(request);
  const country = getCountryCode(request);
  const createdAt = new Date().toISOString();
  const day = createdAt.slice(0, 10);

  const inserted = await env.DB.prepare(
    'INSERT INTO gameplay_events (event_type, game_id, grade, score, xp_earned, device, country, visitor_hash, created_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id'
  )
    .bind(eventType, gameId, grade, score, xpEarned, device, country, visitorHash, createdAt)
    .first();

  const startInc = eventType === 'game_start' ? 1 : 0;
  const compInc = eventType === 'game_complete' ? 1 : 0;

  await env.DB.prepare(
    'INSERT INTO traffic_daily (day, page_views, unique_visitors, game_starts, game_completions, mobile_hits, desktop_hits) ' +
      'VALUES (?, 0, 0, ?, ?, 0, 0) ' +
      'ON CONFLICT(day) DO UPDATE SET ' +
      'game_starts = game_starts + excluded.game_starts, ' +
      'game_completions = game_completions + excluded.game_completions'
  )
    .bind(day, startInc, compInc)
    .run();

  return jsonResponse({ ok: true, id: Number(inserted?.id || 0) }, 201);
}

export default {
  async fetch(request, env, ctx) {
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

    // 2. Block path traversal, scanner probes, hidden files, and internal config paths
    if (isSuspiciousPath(request.url, url)) {
      return textResponse('Forbidden', 403);
    }

    // 3. Write-only API endpoints (analytics & feedback reads stay private in Cloudflare)
    if (url.pathname === '/api/feedback') {
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
        { Allow: 'POST' }
      );
    }

    if (url.pathname === '/api/telemetry') {
      if (request.method === 'POST') {
        try {
          return await handlePostTelemetry(request, env, url);
        } catch {
          return jsonResponse({ ok: false, error: 'Gagal mencatat telemetry.' }, 500);
        }
      }
      return jsonResponse(
        { ok: false, error: 'Metode HTTP tidak diizinkan.' },
        405,
        { Allow: 'POST' }
      );
    }

    if (url.pathname.startsWith('/api/')) {
      return jsonResponse({ ok: false, error: 'Endpoint tidak ditemukan.' }, 404);
    }

    // 4. Static assets & HTML pages only accept GET / HEAD
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return textResponse('Method Not Allowed', 405, { Allow: 'GET, HEAD' });
    }

    // 5. Record privacy-preserving HTML page visits in background
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      const accept = (request.headers.get('Accept') || '').toLowerCase();
      const ua = request.headers.get('User-Agent') || '';
      if (
        accept.includes('text/html') &&
        !/(bot|spider|crawl|headless|lighthouse|CerdasPlay-QA-Verifier)/i.test(ua)
      ) {
        if (ctx && typeof ctx.waitUntil === 'function') {
          ctx.waitUntil(recordPageView(request, env));
        }
      }
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
