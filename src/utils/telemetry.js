/**
 * Lightweight privacy-preserving gameplay telemetry client.
 * Sends non-blocking game start and completion metrics to Cloudflare Pages D1.
 */

const VALID_EVENTS = new Set(['game_start', 'game_complete']);
const VALID_GRADES = new Set(['SD', 'SMP', 'SMA']);

export function trackGameplay({ eventType, gameId, grade, score = 0, xpEarned = 0 }) {
  if (typeof window !== 'undefined' && window.location?.protocol === 'file:') {
    return;
  }
  if (!VALID_EVENTS.has(eventType) || typeof gameId !== 'string' || !gameId) {
    return;
  }
  const safeGrade = VALID_GRADES.has(grade) ? grade : 'SD';
  const safeScore = Number.isFinite(score) ? Math.min(100000, Math.max(0, Math.floor(score))) : 0;
  const safeXp = Number.isFinite(xpEarned) ? Math.min(5000, Math.max(0, Math.floor(xpEarned))) : 0;

  try {
    fetch('/api/telemetry', {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        eventType,
        gameId,
        grade: safeGrade,
        score: safeScore,
        xpEarned: safeXp,
      }),
    }).catch(() => {});
  } catch {
    // Ignore telemetry network failures
  }
}
