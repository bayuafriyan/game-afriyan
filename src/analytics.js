/**
 * Visual Analytics, Gameplay Traffic & Feedback Dashboard Controller.
 * Uses pure DOM creation (.textContent) and SVG namespace elements without untrusted innerHTML.
 */

const GAME_CATALOG = {
  language: { title: 'Arena 3 Bahasa', color: '#ec4899' },
  tka: { title: 'Simulasi TKA & Ujian', color: '#f59e0b' },
  quiz: { title: 'Cepat Tepat', color: '#06b6d4' },
  meteor: { title: 'Meteor Hitung', color: '#f97316' },
  memory: { title: 'Memori Pasangan', color: '#8b5cf6' },
  scramble: { title: 'Susun Kata', color: '#10b981' },
  truefalse: { title: 'Benar atau Mitos', color: '#eab308' },
  sort: { title: 'Rantai Ilmu', color: '#3b82f6' },
};

const SVG_NS = 'http://www.w3.org/2000/svg';
let dashboardState = null;
let selectedTrendMetric = 'all';

function el(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== '') node.textContent = text;
  return node;
}

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, val] of Object.entries(attrs)) {
    node.setAttribute(key, String(val));
  }
  return node;
}

function formatNumber(n) {
  return new Intl.NumberFormat('id-ID').format(Number(n || 0));
}

function formatShortDay(isoDay) {
  const parts = String(isoDay || '').split('-');
  if (parts.length !== 3) return isoDay;
  return `${parts[2]}/${parts[1]}`;
}

function formatDateTime(isoStr) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(isoStr));
  } catch {
    return '';
  }
}

function formatCountryName(code) {
  try {
    const names = new Intl.DisplayNames(['id'], { type: 'region' });
    return `${names.of(code)} (${code})`;
  } catch {
    return code;
  }
}

function readLocalFeedbackFallback() {
  try {
    const raw = localStorage.getItem('cerdasplay_feedback_local_v1');
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function renderKpiCards(summary) {
  const grid = document.getElementById('kpi-grid');
  grid.replaceChildren();

  const completionPct =
    summary.totalGameStarts > 0
      ? Math.round((summary.totalGameCompletions / summary.totalGameStarts) * 100)
      : 0;

  const cards = [
    {
      label: 'Pengunjung Unik',
      value: formatNumber(summary.totalUniqueVisitors),
      sub: `Hari ini: ${formatNumber(summary.todayUniqueVisitors)}`,
    },
    {
      label: 'Halaman Dibuka',
      value: formatNumber(summary.totalPageViews),
      sub: `Hari ini: ${formatNumber(summary.todayPageViews)}`,
    },
    {
      label: 'Sesi Game Dimulai',
      value: formatNumber(summary.totalGameStarts),
      sub: 'Seluruh 8 mode arena',
    },
    {
      label: 'Ronde Selesai',
      value: formatNumber(summary.totalGameCompletions),
      sub: `Rasio selesai: ${completionPct}%`,
    },
    {
      label: 'Total Kritik & Saran',
      value: formatNumber(summary.totalFeedback),
      sub: 'Tersimpan di server D1',
    },
    {
      label: 'Rata-rata Kepuasan',
      value: `★ ${Number(summary.avgRating || 0).toFixed(2)}`,
      sub: 'Skala 1 sampai 5 bintang',
    },
  ];

  for (const item of cards) {
    const card = el('article', 'kpi-card');
    card.append(
      el('span', 'kpi-label', item.label),
      el('strong', 'kpi-value', item.value),
      el('span', 'kpi-sub', item.sub)
    );
    grid.appendChild(card);
  }
}

function renderTrendChart(dailyTrend, metric) {
  const wrap = document.getElementById('trend-chart-wrap');
  const legend = document.getElementById('trend-legend');
  wrap.replaceChildren();
  legend.replaceChildren();

  const rows = Array.isArray(dailyTrend) ? dailyTrend : [];
  if (rows.length === 0) {
    wrap.appendChild(el('div', 'dash-empty-note', 'Belum ada data tren harian.'));
    return;
  }

  const seriesMeta = {
    pageViews: { label: 'Halaman Dibuka', color: '#0284c7' },
    uniqueVisitors: { label: 'Pengunjung Unik', color: '#10b981' },
    gameStarts: { label: 'Sesi Game', color: '#f59e0b' },
    feedbackCount: { label: 'Kritik & Saran', color: '#8b5cf6' },
  };

  const activeKeys =
    metric === 'all' ? ['pageViews', 'uniqueVisitors', 'gameStarts', 'feedbackCount'] : [metric];

  for (const k of activeKeys) {
    const item = el('span', 'legend-item');
    const dot = el('i', 'legend-dot');
    dot.style.background = seriesMeta[k].color;
    item.append(dot, document.createTextNode(seriesMeta[k].label));
    legend.appendChild(item);
  }

  const W = 820;
  const H = 250;
  const padL = 42;
  const padR = 16;
  const padT = 18;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  let maxVal = 1;
  for (const row of rows) {
    for (const k of activeKeys) {
      maxVal = Math.max(maxVal, Number(row[k] || 0));
    }
  }
  const yMax = Math.max(4, Math.ceil(maxVal * 1.15));

  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`,
    class: 'trend-svg',
    role: 'img',
    'aria-label': 'Grafik batang tren trafik dan feedback 14 hari',
  });

  // Gridlines & Y labels
  for (let step = 0; step <= 4; step++) {
    const y = padT + (plotH * step) / 4;
    const labelVal = Math.round(yMax * (1 - step / 4));
    svg.appendChild(
      svgEl('line', {
        x1: padL,
        y1: y,
        x2: W - padR,
        y2: y,
        stroke: step === 4 ? '#94a3b8' : '#e2e8f0',
        'stroke-width': step === 4 ? 1.5 : 1,
      })
    );
    const txt = svgEl('text', {
      x: padL - 8,
      y: y + 4,
      'text-anchor': 'end',
      'font-size': 11,
      'font-weight': 700,
      fill: '#64748b',
    });
    txt.textContent = String(labelVal);
    svg.appendChild(txt);
  }

  const slotW = plotW / rows.length;
  const barGroupW = Math.min(38, slotW * 0.72);
  const subBarW = Math.max(5, (barGroupW - (activeKeys.length - 1) * 2) / activeKeys.length);

  rows.forEach((row, idx) => {
    const groupX = padL + idx * slotW + (slotW - barGroupW) / 2;

    activeKeys.forEach((k, sIdx) => {
      const val = Number(row[k] || 0);
      const barH = val > 0 ? Math.max(4, (val / yMax) * plotH) : 2;
      const bx = groupX + sIdx * (subBarW + 2);
      const by = padT + plotH - barH;
      const rect = svgEl('rect', {
        x: bx,
        y: by,
        width: subBarW,
        height: barH,
        rx: 3,
        fill: val > 0 ? seriesMeta[k].color : '#cbd5e1',
        opacity: val > 0 ? 0.95 : 0.45,
      });
      const tip = svgEl('title');
      tip.textContent = `${row.day} | ${seriesMeta[k].label}: ${val}`;
      rect.appendChild(tip);
      svg.appendChild(rect);
    });

    const dateLabel = svgEl('text', {
      x: padL + idx * slotW + slotW / 2,
      y: H - 10,
      'text-anchor': 'middle',
      'font-size': 10.5,
      'font-weight': 700,
      fill: '#475569',
    });
    dateLabel.textContent = formatShortDay(row.day);
    svg.appendChild(dateLabel);
  });

  wrap.appendChild(svg);
}

function renderGamesBreakdown(gamesBreakdown) {
  const wrap = document.getElementById('games-chart');
  wrap.replaceChildren();
  const rows = [...(gamesBreakdown || [])].sort(
    (a, b) => b.starts + b.completions - (a.starts + a.completions)
  );
  const maxStarts = Math.max(1, ...rows.map((r) => Math.max(r.starts, r.completions)));

  for (const row of rows) {
    const meta = GAME_CATALOG[row.gameId] || { title: row.gameId, color: '#0284c7' };
    const barRow = el('div', 'bar-row');

    const top = el('div', 'bar-row-top');
    top.append(
      el('span', 'bar-title', meta.title),
      el(
        'span',
        'bar-metric',
        `Mulai ${formatNumber(row.starts)} | Selesai ${formatNumber(row.completions)} | Rerata ${row.avgScore} (Maks ${row.maxScore})`
      )
    );

    const track = el('div', 'bar-track');
    const fill = el('div', 'bar-fill');
    fill.style.width = `${row.starts > 0 ? Math.max(6, Math.round((row.starts / maxStarts) * 100)) : 0}%`;
    fill.style.background = meta.color;
    track.appendChild(fill);

    barRow.append(top, track);
    wrap.appendChild(barRow);
  }
}

function buildDonutBox(containerId, title, segments) {
  const box = document.getElementById(containerId);
  box.replaceChildren();
  box.appendChild(el('h3', '', title));

  const total = segments.reduce((acc, s) => acc + Number(s.value || 0), 0);
  const size = 120;
  const r = 40;
  const c = 2 * Math.PI * r;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size,
    role: 'img',
    'aria-label': title,
  });

  svg.appendChild(
    svgEl('circle', {
      cx: 60,
      cy: 60,
      r,
      fill: 'none',
      stroke: '#e2e8f0',
      'stroke-width': 16,
    })
  );

  if (total > 0) {
    let offsetAcc = 0;
    for (const seg of segments) {
      const val = Number(seg.value || 0);
      if (val <= 0) continue;
      const segLen = (val / total) * c;
      const circle = svgEl('circle', {
        cx: 60,
        cy: 60,
        r,
        fill: 'none',
        stroke: seg.color,
        'stroke-width': 16,
        'stroke-dasharray': `${segLen} ${c - segLen}`,
        'stroke-dashoffset': -offsetAcc,
        transform: 'rotate(-90 60 60)',
      });
      const tip = svgEl('title');
      tip.textContent = `${seg.label}: ${formatNumber(val)} (${Math.round((val / total) * 100)}%)`;
      circle.appendChild(tip);
      svg.appendChild(circle);
      offsetAcc += segLen;
    }
  }

  const centerTxt = svgEl('text', {
    x: 60,
    y: 65,
    'text-anchor': 'middle',
    'font-size': 16,
    'font-weight': 800,
    fill: '#0f172a',
  });
  centerTxt.textContent = formatNumber(total);
  svg.appendChild(centerTxt);
  box.appendChild(svg);

  const legend = el('div', 'donut-legend');
  for (const seg of segments) {
    const val = Number(seg.value || 0);
    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
    const row = el('div', 'donut-legend-row');
    const left = el('span', 'legend-item');
    const dot = el('i', 'legend-dot');
    dot.style.background = seg.color;
    left.append(dot, document.createTextNode(seg.label));
    row.append(left, el('span', '', `${formatNumber(val)} (${pct}%)`));
    legend.appendChild(row);
  }
  box.appendChild(legend);
}

function renderAudienceBreakdowns(summary, gradesBreakdown, countriesBreakdown) {
  buildDonutBox('grades-donut', 'Jenjang Dimainkan', [
    { label: 'SD', value: gradesBreakdown?.SD || 0, color: '#0ea5e9' },
    { label: 'SMP', value: gradesBreakdown?.SMP || 0, color: '#8b5cf6' },
    { label: 'SMA', value: gradesBreakdown?.SMA || 0, color: '#f59e0b' },
  ]);

  buildDonutBox('devices-donut', 'Perangkat Pengunjung', [
    { label: 'HP / Mobile', value: summary?.mobileHits || 0, color: '#10b981' },
    { label: 'Desktop', value: summary?.desktopHits || 0, color: '#3b82f6' },
  ]);

  const countriesWrap = document.getElementById('countries-list');
  countriesWrap.replaceChildren();
  if (!countriesBreakdown || countriesBreakdown.length === 0) {
    countriesWrap.appendChild(el('span', 'dash-chip', 'Belum ada data kunjungan tercatat.'));
    return;
  }
  for (const item of countriesBreakdown) {
    countriesWrap.appendChild(
      el(
        'span',
        'dash-chip',
        `${formatCountryName(item.country)}: ${formatNumber(item.visitors)} unik (${formatNumber(item.hits)} hits)`
      )
    );
  }
}

function renderFeedbackStats(feedbackBreakdown) {
  const ratingWrap = document.getElementById('rating-bars');
  const categoryWrap = document.getElementById('category-bars');
  const roleWrap = document.getElementById('role-bars');
  ratingWrap.replaceChildren();
  categoryWrap.replaceChildren();
  roleWrap.replaceChildren();

  const byRating = feedbackBreakdown?.byRating || {};
  const totalRatings = [1, 2, 3, 4, 5].reduce((s, k) => s + Number(byRating[k] || 0), 0);

  for (const star of [5, 4, 3, 2, 1]) {
    const cnt = Number(byRating[star] || 0);
    const pct = totalRatings > 0 ? Math.round((cnt / totalRatings) * 100) : 0;
    const row = el('div', 'bar-row');
    const top = el('div', 'bar-row-top');
    top.append(
      el('span', 'bar-title', `${'★'.repeat(star)} (${star} Bintang)`),
      el('span', 'bar-metric', `${formatNumber(cnt)} (${pct}%)`)
    );
    const track = el('div', 'bar-track');
    const fill = el('div', 'bar-fill');
    fill.style.width = `${cnt > 0 ? Math.max(4, pct) : 0}%`;
    fill.style.background = star >= 4 ? '#22c55e' : star === 3 ? '#f59e0b' : '#ef4444';
    track.appendChild(fill);
    row.append(top, track);
    ratingWrap.appendChild(row);
  }

  const categories = feedbackBreakdown?.byCategory || [];
  if (categories.length === 0) {
    categoryWrap.appendChild(el('div', 'dash-empty-note', 'Belum ada kategori masukan tercatat.'));
  } else {
    const maxCat = Math.max(1, ...categories.map((c) => c.count));
    for (const c of categories) {
      const row = el('div', 'bar-row');
      const top = el('div', 'bar-row-top');
      top.append(el('span', 'bar-title', c.category), el('span', 'bar-metric', formatNumber(c.count)));
      const track = el('div', 'bar-track');
      const fill = el('div', 'bar-fill');
      fill.style.width = `${Math.max(6, Math.round((c.count / maxCat) * 100))}%`;
      fill.style.background = '#0284c7';
      track.appendChild(fill);
      row.append(top, track);
      categoryWrap.appendChild(row);
    }
  }

  const roles = feedbackBreakdown?.byRole || [];
  if (roles.length === 0) {
    roleWrap.appendChild(el('span', 'dash-chip', 'Belum ada data peran pengirim.'));
  } else {
    for (const r of roles) {
      roleWrap.appendChild(el('span', 'dash-chip', `${r.role}: ${formatNumber(r.count)}`));
    }
  }
}

function renderRecentPlays(recentPlays) {
  const wrap = document.getElementById('recent-plays-wrap');
  wrap.replaceChildren();
  if (!recentPlays || recentPlays.length === 0) {
    wrap.appendChild(
      el('div', 'dash-empty-note', 'Belum ada aktivitas game terekam sejak pelacakan diaktifkan.')
    );
    return;
  }

  for (const ev of recentPlays) {
    const row = el('div', 'play-event-row');
    const left = el('div');
    const metaGame = GAME_CATALOG[ev.game_id]?.title || ev.game_id;
    left.append(
      el('div', 'play-event-title', `${metaGame} (${ev.grade})`),
      el(
        'div',
        'play-event-meta',
        `${ev.device === 'mobile' ? 'HP' : 'Desktop'} • ${ev.country || 'ID'} • ${formatDateTime(ev.created_at)}`
      )
    );

    const right = el('div', '', '');
    right.style.display = 'flex';
    right.style.alignItems = 'center';
    right.style.gap = '0.45rem';

    if (ev.event_type === 'game_complete') {
      right.appendChild(el('span', 'play-event-meta', `Skor ${ev.score} (+${ev.xp_earned} XP)`));
      right.appendChild(el('span', 'play-badge is-done', 'Selesai'));
    } else {
      right.appendChild(el('span', 'play-badge is-start', 'Mulai'));
    }

    row.append(left, right);
    wrap.appendChild(row);
  }
}

function populateCategoryFilter(items) {
  const select = document.getElementById('fb-filter-cat');
  const current = select.value;
  const cats = Array.from(new Set((items || []).map((i) => i.category).filter(Boolean))).sort();
  select.replaceChildren();
  select.appendChild(el('option', '', 'Semua Kategori'));
  select.lastChild.value = '';
  for (const c of cats) {
    const opt = el('option', '', c);
    opt.value = c;
    select.appendChild(opt);
  }
  select.value = cats.includes(current) ? current : '';
}

function renderFilteredFeedback() {
  const listWrap = document.getElementById('feedback-list-dash');
  listWrap.replaceChildren();
  const items = dashboardState?.feedbackItems || [];

  const q = document.getElementById('fb-search').value.trim().toLowerCase();
  const cat = document.getElementById('fb-filter-cat').value;
  const ratingStr = document.getElementById('fb-filter-rating').value;

  const filtered = items.filter((item) => {
    if (cat && item.category !== cat) return false;
    if (ratingStr && String(item.rating) !== ratingStr) return false;
    if (q) {
      const hay = `${item.name || ''} ${item.message || ''} ${item.role || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    listWrap.appendChild(
      el('div', 'dash-empty-note', 'Tidak ada kritik atau saran yang cocok dengan filter.')
    );
    return;
  }

  for (const item of filtered) {
    const card = el('article', 'feedback-item');
    const top = el('div', 'feedback-item-top');
    const r = Math.min(5, Math.max(1, Number(item.rating) || 5));
    top.append(
      el('span', 'feedback-author', `${item.name || 'Sahabat Belajar'} (${item.role || 'Umum'})`),
      el('span', 'feedback-stars', `${'★'.repeat(r)}${'☆'.repeat(5 - r)}`)
    );
    const meta = el(
      'div',
      'feedback-meta',
      `${item.category || 'Saran Fitur'} • ${formatDateTime(item.created_at)}`
    );
    const body = el('p', 'feedback-body', String(item.message || ''));
    card.append(top, meta, body);
    listWrap.appendChild(card);
  }
}

function escapeCsvCell(raw) {
  let str = String(raw ?? '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (/^[=+\-@\t]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

function exportFeedbackCsv() {
  const items = dashboardState?.feedbackItems || [];
  const header = ['ID', 'Nama', 'Peran', 'Kategori', 'Rating', 'Pesan', 'Waktu_UTC'];
  const lines = [header.map(escapeCsvCell).join(',')];
  for (const it of items) {
    lines.push(
      [it.id, it.name, it.role, it.category, it.rating, it.message, it.created_at]
        .map(escapeCsvCell)
        .join(',')
    );
  }
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kritik-saran-makincerdasmakinsukses-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function loadDashboard() {
  const pill = document.getElementById('dash-status-pill');
  const updatedEl = document.getElementById('dash-updated-at');
  pill.className = 'dash-status-pill';
  pill.textContent = 'Memuat data...';

  if (window.location?.protocol !== 'file:') {
    try {
      const res = await fetch('/api/dashboard', {
        method: 'GET',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.ok) {
          dashboardState = data;
          pill.className = 'dash-status-pill is-live';
          pill.textContent = 'Live Cloudflare D1 + Web Analytics';
          updatedEl.textContent = `Terakhir diperbarui: ${formatDateTime(data.meta?.generatedAt || new Date().toISOString())}`;
          renderAll();
          return;
        }
      }
    } catch {
      // Fallback below
    }
  }

  const localItems = readLocalFeedbackFallback();
  const byRating = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sumR = 0;
  for (const it of localItems) {
    const r = Math.min(5, Math.max(1, Number(it.rating) || 5));
    byRating[r] += 1;
    sumR += r;
  }

  dashboardState = {
    summary: {
      totalUniqueVisitors: 0,
      todayUniqueVisitors: 0,
      totalPageViews: 0,
      todayPageViews: 0,
      totalGameStarts: 0,
      totalGameCompletions: 0,
      mobileHits: 0,
      desktopHits: 0,
      totalFeedback: localItems.length,
      avgRating: localItems.length ? Number((sumR / localItems.length).toFixed(2)) : 0,
    },
    dailyTrend: [],
    gamesBreakdown: Object.keys(GAME_CATALOG).map((gameId) => ({
      gameId,
      starts: 0,
      completions: 0,
      avgScore: 0,
      maxScore: 0,
      totalXp: 0,
    })),
    gradesBreakdown: { SD: 0, SMP: 0, SMA: 0 },
    countriesBreakdown: [],
    feedbackBreakdown: { byRating, byCategory: [], byRole: [] },
    feedbackItems: localItems,
    recentPlays: [],
  };

  pill.className = 'dash-status-pill is-offline';
  pill.textContent = 'Mode Pratinjau Lokal';
  updatedEl.textContent = 'Server /api/dashboard hanya aktif pada domain Cloudflare Pages.';
  renderAll();
}

function renderAll() {
  if (!dashboardState) return;
  renderKpiCards(dashboardState.summary);
  renderTrendChart(dashboardState.dailyTrend, selectedTrendMetric);
  renderGamesBreakdown(dashboardState.gamesBreakdown);
  renderAudienceBreakdowns(
    dashboardState.summary,
    dashboardState.gradesBreakdown,
    dashboardState.countriesBreakdown
  );
  renderFeedbackStats(dashboardState.feedbackBreakdown);
  renderRecentPlays(dashboardState.recentPlays);
  populateCategoryFilter(dashboardState.feedbackItems);
  renderFilteredFeedback();
}

document.getElementById('btn-refresh').addEventListener('click', loadDashboard);
document.getElementById('btn-export-csv').addEventListener('click', exportFeedbackCsv);
document.getElementById('fb-search').addEventListener('input', renderFilteredFeedback);
document.getElementById('fb-filter-cat').addEventListener('change', renderFilteredFeedback);
document.getElementById('fb-filter-rating').addEventListener('change', renderFilteredFeedback);

document.querySelectorAll('#trend-tabs .trend-tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#trend-tabs .trend-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedTrendMetric = btn.dataset.metric || 'all';
    if (dashboardState) {
      renderTrendChart(dashboardState.dailyTrend, selectedTrendMetric);
    }
  });
});

loadDashboard();
setInterval(() => {
  if (document.visibilityState === 'visible') {
    loadDashboard();
  }
}, 60000);
