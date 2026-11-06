'use strict';
/* =====================================================================
   TUTY-VERSE app logic
   ===================================================================== */
const $ = id => document.getElementById(id);
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const NSTAGES = STAGES.length;
const STAGE_NO = (() => { let n = 0; return STAGES.map(s => (s.game ? 0 : ++n)); })();   // game nodes are not numbered stages
const MAZE_AT = STAGES.findIndex(s => s.game === 'maze');
const BRAND_CAT = catSVG({ fur: 'white', props: ['sunflower'] });
const isDarkNow = () => { const t = document.documentElement.dataset.theme; return t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches); };

/* ---------- saved state (progress + settings) ---------- */
const KEY = 'tuty-verse-v2';
const defaults = () => ({ done: [], gems: 100, coins: 400, sfx: true, music: true, vol: 0.6, theme: 'auto' });
function load() {
  const d = defaults();
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (!s || typeof s !== 'object') return d;
    const num = (v, f) => Number.isFinite(v) ? v : f;
    return {
      done: [...new Set((Array.isArray(s.done) ? s.done : []).filter(i => Number.isInteger(i) && i >= 0 && i < NSTAGES))],
      gems: num(s.gems, d.gems), coins: num(s.coins, d.coins),
      sfx: typeof s.sfx === 'boolean' ? s.sfx : d.sfx, music: typeof s.music === 'boolean' ? s.music : d.music,
      vol: Math.min(1, Math.max(0.1, num(s.vol, d.vol))), theme: ['auto', 'light', 'dark'].includes(s.theme) ? s.theme : 'auto',
    };
  } catch (e) { return d; }
}
let state = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { } };

/* ---------- session-only data (mascot + wishes sent): forgotten when the tab closes ---------- */
const sessionStore = (() => {
  const mem = {};
  return {
    get(k) { try { const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : (mem[k] ?? null); } catch (e) { return mem[k] ?? null; } },
    set(k, v) { mem[k] = v; try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
  };
})();
function cleanMascot(m) {
  if (!m || typeof m !== 'object') return null;
  const name = String(m.name || '').replace(/\s+/g, ' ').trim().slice(0, 14);
  if (!name) return null;
  return { name, fur: FUR_KEYS.has(m.fur) ? m.fur : 'calico', outfit: OUTFITS[m.outfit] ? m.outfit : 'none', props: [...new Set((Array.isArray(m.props) ? m.props : []).filter(p => PROPS[p]))] };
}
let mascot = cleanMascot(sessionStore.get('mascot'));
const myCat = () => (mascot ? catSVG(mascot) : BRAND_CAT);

/* ---------- element refs ---------- */
const screen = $('screen'), wrap = $('mapWrap'), map = $('map'), terrain = $('terrain'), token = $('token'), sheet = $('sheet'), card = $('card'), lb = $('lb');
const startEl = $('start'), mailEl = $('mail'), gw = $('gwrap'), menu = $('menu'), builder = $('builder'), compose = $('compose'), confirmEl = $('bConfirm');
let sel = 0, busy = false, openIdx = -1, pts = [], slide = 0, slideCount = 0;

const startOpen = () => !startEl.classList.contains('hide');
const mailOpen = () => mailEl.classList.contains('open');
const gOpen = () => gw.classList.contains('open');
const menuOpen = () => !menu.hidden;
const builderOpen = () => builder.classList.contains('open');
const composeOpen = () => !compose.hidden;
const lbOpen = () => !lb.hidden;

/* ---------- icons (pixel art injected into the page) ---------- */
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = ICON[el.dataset.icon](); });
document.querySelectorAll('[data-sf]').forEach(el => { el.innerHTML = sunflowerSVG(); });
$('buildIc').innerHTML = BRAND_CAT;
$('mailAv').innerHTML = BRAND_CAT;

/* ---------- toast + confetti ---------- */
let tt; function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600); }
function confetti(x, y) {
  const cols = ['#e0709d', '#a985e0', '#e9b14f', '#8fcaa8', '#f5bfd4', '#ffd84a'];
  for (let n = 0; n < 30; n++) {
    const s = document.createElement('span'); s.className = 'confetti'; s.style.background = cols[n % cols.length];
    const z = 5 + (n % 3) * 2; s.style.width = s.style.height = z + 'px'; s.style.left = x + 'px'; s.style.top = y + 'px';
    s.style.setProperty('--dx', (Math.random() * 320 - 160) + 'px'); s.style.setProperty('--dy', (-Math.random() * 220 - 40) + 'px'); s.style.setProperty('--r', (Math.random() * 540 - 270) + 'deg');
    screen.appendChild(s); setTimeout(() => s.remove(), 1400);
  }
}
function setNum(id, to) {
  const el = $(id), from = +el.textContent || 0, t0 = performance.now();
  (function f(n) { const t = Math.min(1, (n - t0) / 700); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3))); if (t < 1) requestAnimationFrame(f); })(t0);
  el.parentElement.classList.remove('bump'); void el.offsetWidth; el.parentElement.classList.add('bump');
}

/* ---------- theme + audio settings ---------- */
function applyTheme() {
  const t = state.theme;
  if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
  document.querySelectorAll('#themeSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
}
function applyAudio() {
  SFX.set({ music: state.music, sfx: state.sfx, vol: state.vol });
  document.querySelectorAll('#musicSeg button').forEach(b => b.setAttribute('aria-pressed', (b.dataset.m === '1') === state.music));
  document.querySelectorAll('#sfxSeg button').forEach(b => b.setAttribute('aria-pressed', (b.dataset.s === '1') === state.sfx));
  $('vol').value = Math.round(state.vol * 100);
}
/* every button makes the same cute click */
document.addEventListener('click', e => { const b = e.target.closest('button, .pick'); if (b && !b.disabled) SFX.click(); });

/* ---------- sky: rainbow + birds by day, shooting stars by night ---------- */
const skies = [$('sky'), $('startSky')], RM = matchMedia('(prefers-reduced-motion: reduce)');
function spawn(html, cls, ms, style = '', targets = skies) { targets.forEach(s => { if (!s) return; const d = document.createElement('div'); d.className = cls; d.style.cssText = style; d.innerHTML = html; s.appendChild(d); setTimeout(() => d.remove(), ms); }); }
function rainbow() {
  const cols = ['#ffc2c2', '#ffd9b3', '#fff3b0', '#c9f2d0', '#b8e3ff', '#d9c8ff'];
  const arcs = cols.map((c, i) => { const r = 144 - i * 11, len = Math.PI * r; return `<path d="M${150 - r} 150 A${r} ${r} 0 0 1 ${150 + r} 150" fill="none" stroke="${c}" stroke-width="11" stroke-dasharray="${len.toFixed(0)}" stroke-dashoffset="${len.toFixed(0)}" style="animation:rbdraw 2.4s ease-out ${i * 0.15}s forwards"/>`; }).join('');
  spawn(`<svg viewBox="0 0 300 156">${arcs}</svg>`, 'rainbow', 16000, '', [skies[0]]);
}
const BALLOON_COLS = [['#ffd1e1', '#fff0f5'], ['#cfe8ff', '#f2f9ff'], ['#fff1b8', '#fffbe6'], ['#d9f5d3', '#f4fff1'], ['#e4d6ff', '#f7f2ff']];
function balloonSVG([c1, c2]) {
  return `<svg viewBox="0 0 60 84" xmlns="http://www.w3.org/2000/svg"><path d="M30 2C13 2 4 16 4 29c0 13 9 23 17 30h18c8-7 17-17 17-30C56 16 47 2 30 2z" fill="${c1}" stroke="#ffffff" stroke-width="1.5"/><path d="M30 2C21 8 17 18 17 29c0 12 5 22 9 30h8c4-8 9-18 9-30 0-11-4-21-13-27z" fill="${c2}"/><path d="M30 2v57" stroke="#ffffff" stroke-width="1.2" opacity=".7"/><path d="M21 59l4 12M39 59l-4 12M30 59v12" stroke="#d9c8d4" stroke-width="1.1"/><rect x="24" y="71" width="12" height="9" rx="2" fill="#f3d9bf" stroke="#ffffff" stroke-width="1"/></svg>`;
}
function balloons() {
  const n = 2 + (Math.random() < 0.5 ? 1 : 0), used = [];
  for (let i = 0; i < n; i++) {
    let k; do { k = Math.floor(Math.random() * BALLOON_COLS.length); } while (used.includes(k)); used.push(k);
    const x = 8 + i * (80 / n) + Math.random() * 12, w = 30 + Math.random() * 14, dur = 26 + Math.random() * 10;
    spawn(balloonSVG(BALLOON_COLS[k]), 'balloon', (dur + 6) * 1000, `left:${x.toFixed(1)}%;width:${w.toFixed(0)}px;animation-duration:${dur.toFixed(1)}s;animation-delay:${(i * 3.2).toFixed(1)}s`);
  }
}
/* dark mode: a few twinkling stars (CSS shows them only at night) */
function twinkles() {
  skies.forEach(s => { if (!s || s.querySelector('.tstar')) return; let h = ''; for (let i = 0; i < 34; i++) h += `<i class="tstar" style="left:${(Math.random() * 98).toFixed(1)}%;top:${(Math.random() * 92).toFixed(1)}%;animation-delay:${(-Math.random() * 4).toFixed(2)}s;animation-duration:${(2 + Math.random() * 3).toFixed(1)}s;--s:${(2 + Math.random() * 2.4).toFixed(1)}px"></i>`; const w = document.createElement('div'); w.className = 'tstars'; w.innerHTML = h; s.appendChild(w); });
}
twinkles();
function shootingStar() { spawn('', 'shoot', 1700, `top:${2 + Math.random() * 45}%;left:${35 + Math.random() * 62}%`); }
let skyTick = 0;
function skyStep() {
  if (RM.matches || document.hidden) return;
  skyTick++;
  if (isDarkNow()) { shootingStar(); if (Math.random() < 0.45) setTimeout(shootingStar, 500); }
  else { if (skyTick % 14 === 2) rainbow(); if (skyTick % 8 === 4) balloons(); }
}
setInterval(skyStep, 1600);
setTimeout(() => { if (!RM.matches && !isDarkNow()) { rainbow(); setTimeout(balloons, 1800); } else skyStep(); }, 1200);

/* ---------- map (orientation follows the screen width only, so it never flips mid-game) ---------- */
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const vq = matchMedia('(max-width: 760px)'); let lastKey = '';
function segPath(i) {
  const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, k = 1 / 5;
  return `M${p1[0]} ${p1[1]} C${(p1[0] + (p2[0] - p0[0]) * k).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) * k).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) * k).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) * k).toFixed(1)} ${p2[0]} ${p2[1]}`;
}
function buildMap(force) {
  const W = wrap.clientWidth, H = wrap.clientHeight; if (!W || !H) return;
  const vertical = vq.matches, key = vertical + '|' + W + '|' + (vertical ? 0 : H);
  if (!force && key === lastKey) return; lastKey = key;
  const n1 = NSTAGES - 1; let mw, mh, ns;
  if (!vertical) {
    ns = Math.round(Math.min(96, Math.max(56, H * 0.2))); const gap = Math.max(ns * 1.95, (W - ns * 2.4) / n1);
    mw = Math.max(W, gap * n1 + ns * 2.6); mh = H; const x0 = (mw - gap * n1) / 2;
    pts = STAGES.map((_, i) => [Math.round(x0 + i * gap), Math.round(mh * (i % 2 ? 0.36 : 0.64))]);
  } else {
    ns = Math.round(Math.min(84, Math.max(58, W * 0.19))); const gap = ns * 2.15;
    mw = W; mh = Math.max(H, gap * n1 + ns * 3.2); const y0 = (mh - gap * n1) / 2 + ns * 0.35;
    pts = STAGES.map((_, i) => [Math.round(mw * (i % 2 ? 0.7 : 0.3)), Math.round(y0 + i * gap)]);
  }
  map.style.width = mw + 'px'; map.style.height = mh + 'px'; map.style.setProperty('--node', ns + 'px');
  terrain.setAttribute('viewBox', `0 0 ${mw} ${mh}`); terrain.setAttribute('width', mw); terrain.setAttribute('height', mh);
  seed = 7; let s = `<defs><linearGradient id="dg" x1="0" x2="1"><stop offset="0" stop-color="#e0709d"/><stop offset="1" stop-color="#a985e0"/></linearGradient></defs>`;
  const cr = cloudRects(), nc = Math.round(mw * mh / 60000) + 3;
  for (let c = 0; c < nc; c++) { const x = rnd() * mw, y = rnd() * mh, k = 3 + Math.floor(rnd() * 3); s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><g class="cloud" transform="scale(${k})">${cr}</g></g>`; }
  const segs = STAGES.slice(0, -1).map((_, i) => segPath(i));
  segs.forEach(d => s += `<path class="trail-bd" d="${d}"/>`); segs.forEach(d => s += `<path class="trail-base" d="${d}"/>`);
  segs.forEach((d, i) => s += `<path class="trail-done" id="seg${i}" d="${d}" stroke="url(#dg)"/>`); segs.forEach(d => s += `<path class="trail-dots" d="${d}"/>`);
  for (let k = 0; k < nc + 3; k++) { const x = Math.round(rnd() * mw), y = Math.round(rnd() * mh); s += `<g transform="translate(${x} ${y})"><g class="spark" style="animation-delay:${(k * 0.4).toFixed(1)}s"><rect x="-1" y="-4" width="2" height="8"/><rect x="-4" y="-1" width="8" height="2"/></g></g>`; }
  terrain.innerHTML = s;
  segs.forEach((_, i) => { const p = $('seg' + i); p.style.setProperty('--len', p.getTotalLength()); });
  STAGES.forEach((st, i) => {
    let n = $('node' + i);
    if (!n) {
      n = document.createElement('button'); n.className = 'node'; n.id = 'node' + i; n.style.setProperty('--c', st.c);
      n.innerHTML = `<span class="node-box">${MOTIF[st.motif]()}</span><span class="node-num">${st.game ? '★' : STAGE_NO[i]}</span><span class="node-flag"></span><span class="node-label">${esc(st.short)}</span>`;
      n.addEventListener('click', () => goTo(i, true)); map.appendChild(n);
    }
    n.style.left = pts[i][0] + 'px'; n.style.top = pts[i][1] + 'px';
  });
  placeToken(pts[sel][0], pts[sel][1], 0); refresh(); follow(pts[sel][0], pts[sel][1], false);
}
function placeToken(x, y, h) { token.style.left = x + 'px'; token.style.top = y + 'px'; token.style.setProperty('--hop', h + 'px'); }
function follow(x, y, smooth = true) { wrap.scrollTo({ left: x - wrap.clientWidth / 2, top: y - wrap.clientHeight / 2, behavior: smooth ? 'smooth' : 'auto' }); }
function refresh() {
  STAGES.forEach((st, i) => {
    const n = $('node' + i); if (!n) return; const d = state.done.includes(i);
    n.classList.toggle('current', i === sel); n.querySelector('.node-flag').innerHTML = ICON.heart(d);
    n.setAttribute('aria-label', st.game ? `Mini game: ${st.title}${d ? ', completed' : ''}` : `Stage ${STAGE_NO[i]}: ${st.title}, ${st.work}${d ? ', collected' : ''}`);
  });
  STAGES.slice(0, -1).forEach((_, i) => $('seg' + i)?.classList.toggle('on', state.done.includes(i) && state.done.includes(i + 1)));
  $('rank').textContent = RANKS[Math.min(state.done.length, RANKS.length - 1)]; $('progress').textContent = `${state.done.length}/${NSTAGES}`;
  const st = STAGES[sel];
  $('pvTitle').textContent = st.game ? `Mini game: ${st.title}` : `${STAGE_NO[sel]}. ${st.title}`;
  $('pvSub').textContent = (state.done.includes(sel) ? (st.game ? 'Completed. ' : 'Collected. ') : '') + (st.chip ? st.chip + '. ' : '') + st.tag;
}
function hop(a, b, dur) {
  return new Promise(res => {
    const k = Math.min(a, b), rev = b < a, p = $('seg' + k), L = p.getTotalLength(), t0 = performance.now(); token.classList.add('moving');
    (function f(n) {
      const t = Math.min(1, (n - t0) / dur), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, q = p.getPointAtLength(L * (rev ? 1 - e : e));
      placeToken(q.x, q.y, Math.abs(Math.sin(t * Math.PI * 2)) * 20); wrap.scrollLeft = q.x - wrap.clientWidth / 2; wrap.scrollTop = q.y - wrap.clientHeight / 2;
      if (t < 1) requestAnimationFrame(f); else { token.classList.remove('moving'); placeToken(pts[b][0], pts[b][1], 0); res(); }
    })(t0);
  });
}
async function goTo(i, thenOpen = false) {
  if (busy || i < 0 || i >= NSTAGES) return;
  if (MAZE_AT >= 0 && i > MAZE_AT && !state.done.includes(MAZE_AT)) { toast('Solve the maze (or skip it) to go further'); i = MAZE_AT; if (sel === i) { if (thenOpen) openSheet(i); return; } } busy = true; const dur = Math.abs(i - sel) > 2 ? 320 : 560;
  while (sel !== i) { const nx = sel + (i > sel ? 1 : -1); await hop(sel, nx, dur); sel = nx; SFX.chime([784, 988], 0.05); refresh(); }
  busy = false; refresh(); follow(pts[sel][0], pts[sel][1]); if (thenOpen) openSheet(i);
}

/* ---------- generated art (used when a stage has no photos, or a photo fails to load) ---------- */
const sp = (x, y, s, c) => `<rect x="${x - s / 2}" y="${y - s * 1.5}" width="${s}" height="${s * 3}" fill="${c}"/><rect x="${x - s * 1.5}" y="${y - s / 2}" width="${s * 3}" height="${s}" fill="${c}"/>`;
const nest = (svg, x, y, w, h) => svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
function art(st, kind, cap = '') {
  const [b1, b2] = st.bg, ink = st.dark ? '#ffffff' : '#3a2340', sub = st.dark ? 'rgba(255,255,255,.8)' : 'rgba(58,35,64,.75)', id = 'g' + Math.random().toString(36).slice(2, 8);
  const F = `font-family="'Pixelify Sans',monospace" font-weight="700"`, motif = MOTIF[st.motif]();
  const bub = `<rect x="320" y="20" width="60" height="60" fill="#fff" opacity=".16"/><rect x="20" y="200" width="70" height="40" fill="#fff" opacity=".12"/>${sp(60, 40, 3, '#fff')}${sp(335, 215, 3, '#fff')}`;
  let body = '';
  if (kind === 'scene') body = `${bub}${nest(motif, 30, 30, 170, 170)}${nest(BRAND_CAT, 235, 105, 140, 126)}<text x="24" y="238" fill="${ink}" ${F} font-size="20">${esc(st.title)}</text>`;
  else if (kind === 'poster') body = `<g opacity=".18">${nest(motif, 100, 10, 200, 200)}</g>${bub}<text x="200" y="118" text-anchor="middle" fill="${ink}" ${F} font-size="${st.work.length > 24 ? 16 : 24}">${esc(st.work.length > 44 ? st.work.slice(0, 42) + '...' : st.work)}</text><text x="200" y="148" text-anchor="middle" fill="${sub}" ${F} font-size="13">${esc(st.tag)}</text><text x="200" y="176" text-anchor="middle" fill="${sub}" ${F} font-size="12">${esc(st.year)}</text>`;
  else if (kind === 'card') body = `${bub}<rect x="30" y="26" width="340" height="208" fill="#fff" opacity=".92"/>${nest(motif, 48, 48, 80, 80)}<text x="150" y="80" fill="#3a2340" ${F} font-size="20">${esc(st.title.split(' / ')[0])}</text><text x="150" y="102" fill="#6e5476" ${F} font-size="11">${esc(st.work.length > 30 ? st.work.slice(0, 29) + '...' : st.work)}</text>${st.stats.map(([k, v], i) => `<text x="56" y="${176 + i * 20}" fill="#3a2340" ${F} font-size="11">${esc(k)}</text><rect x="140" y="${167 + i * 20}" width="200" height="9" fill="#f1e6ee"/><rect x="140" y="${167 + i * 20}" width="${2 * v}" height="9" fill="${st.c}"/>`).join('')}`;
  else body = `${bub}<g transform="translate(168 58)"><rect width="64" height="46" fill="#fff" opacity=".92"/><rect x="8" y="-6" width="16" height="6" fill="#fff" opacity=".92"/><rect x="20" y="10" width="24" height="24" fill="${st.c}"/><rect x="28" y="18" width="8" height="8" fill="#fff"/></g><text x="200" y="142" text-anchor="middle" fill="${ink}" ${F} font-size="15">${esc(cap || st.title)}</text><text x="200" y="166" text-anchor="middle" fill="${sub}" ${F} font-size="12">This photo could not be loaded right now.</text><text x="200" y="184" text-anchor="middle" fill="${sub}" ${F} font-size="12">It is hosted on another site.</text>`;
  return `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs><rect width="400" height="260" fill="url(#${id})"/>${body}</svg>`;
}
const HEART = [[0, 0], [0, 1], [0, 3], [0, 4], [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 1], [2, 2], [2, 3], [3, 2]];
const slidesFor = st => st.awards ? [{ kind: 'scene', cap: 'Achievements' }] : st.imgs.length ? st.imgs.map(([src, cap]) => ({ src, cap })) : [['scene', 'Stage art'], ['card', 'Character card'], ['poster', 'Title card']].map(([kind, cap]) => ({ kind, cap }));

/* ---------- stage card ---------- */
function openSheet(i) {
  if (builderOpen() || mailOpen()) return;
  if (STAGES[i].game) { openGame(i); return; }
  const st = STAGES[i], d = state.done.includes(i), sl = slidesFor(st); slideCount = sl.length; slide = 0;
  card.style.setProperty('--sc', st.c);
  const fig = (s, k) => s.src ? `<img src="${esc(s.src)}" alt="${esc(st.title + ': ' + s.cap)}" ${k === 0 ? '' : 'loading="lazy"'} referrerpolicy="no-referrer" data-cap="${esc(s.cap)}" draggable="false">` : art(st, s.kind);
  card.innerHTML = `
    <button class="close" id="closeBtn" aria-label="Close"><span data-icon="x"></span></button>
    <div class="card-grid${st.awards ? ' solo' : ''}">
      <div class="gal">
        ${st.awards ? `<div class="heart" role="list">${st.awards.map((a, k) => { const [r, c] = HEART[k]; return `<button class="award" role="listitem" data-k="${k}" aria-label="${esc(a.t)}${a.imgs.length > 1 ? ', ' + a.imgs.length + ' pictures' : ''}" style="grid-row:${r + 1};grid-column:${c + 1}"><span class="aw-pic">${awardPic(a)}</span></button>`; }).join('')}</div>` : ''}
        <div class="carousel" id="car" ${st.awards ? 'hidden' : ''}>
          <div class="track" id="track">${sl.map((s, k) => `<figure class="slide">${fig(s, k)}<figcaption>${esc(s.cap)}</figcaption></figure>`).join('')}</div>
          <button class="nav prev" id="prevBtn" aria-label="Previous photo"></button><button class="nav next" id="nextBtn" aria-label="Next photo"></button>
          <button class="zoom" id="zoomBtn" aria-label="View photo larger">Zoom</button>
          <div class="dots">${sl.map((_, k) => `<button aria-label="Photo ${k + 1}"></button>`).join('')}</div>
        </div>
        <div class="thumbs" id="thumbs" ${st.awards ? 'hidden' : ''}>${sl.map((s, k) => `<button aria-label="Show ${esc(s.cap)}">${fig(s, 1)}</button>`).join('')}</div>
      </div>
      ${st.awards ? '' : `<div class="info">
        <div class="chips"><span class="chip tint">Stage ${STAGE_NO[i]}</span><span class="chip">${esc(st.year)}</span>${st.chip ? `<span class="chip soon">${esc(st.chip)}</span>` : ''}</div>
        <h2 id="sheetTitle">${esc(st.title)}</h2>
        <div class="story">${st.desc.map(p => `<p>${esc(p)}</p>`).join('')}</div>
        <div class="side">
          <div class="panel"><h3>Character stats</h3>${st.stats.map(([k, v]) => `<div class="stat"><span>${esc(k)}</span><div class="bar"><i data-w="${v}"></i></div><span>${v}</span></div>`).join('')}</div>
          <div class="panel"><h3>Trivia</h3><ul class="trivia">${st.trivia.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
        </div>
      </div>`}
    </div>
    <div class="card-foot"><button class="cta" id="claimBtn" ${d ? 'disabled' : ''}>${d ? 'Memory collected' : `Collect memory<span class="rw"> +${30 + i * 10} gems +${120 + i * 40} coins</span>`}<span class="key">A</span></button></div>`;
  card.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = ICON[el.dataset.icon](); });
  card.querySelectorAll('img').forEach(img => {
    const fail = () => { const w = document.createElement('div'); w.innerHTML = art(st, 'photo', img.dataset.cap); const s = w.firstChild; s.style.cssText = 'width:100%;height:100%;display:block'; img.replaceWith(s); };
    img.addEventListener('error', fail, { once: true });
    img.addEventListener('load', () => { if (img.naturalWidth / img.naturalHeight > 1.2) img.classList.add('cover'); });
    if (img.complete && !img.naturalWidth) fail();
  });
  const sr = screen.getBoundingClientRect(), nr = $('node' + i).getBoundingClientRect();
  sheet.classList.add('open'); const ox = nr.left + nr.width / 2 - sr.left - card.offsetLeft, oy = nr.top + nr.height / 2 - sr.top - card.offsetTop;
  sheet.classList.remove('open'); card.style.transformOrigin = `${ox}px ${oy}px`; void card.offsetWidth; sheet.classList.add('open');
  card.scrollTop = 0; openIdx = i; goSlide(0);
  if (st.awards) { fitHeart(); setTimeout(fitHeart, 380); }
  setTimeout(() => card.querySelectorAll('.bar i').forEach(b => b.style.width = b.dataset.w + '%'), 60);
  $('closeBtn').onclick = closeSheet; $('claimBtn').onclick = () => claim(i);
  $('prevBtn').onclick = () => goSlide(slide - 1); $('nextBtn').onclick = () => goSlide(slide + 1); $('zoomBtn').onclick = openLB;
  card.querySelectorAll('.dots button').forEach((b, k) => b.onclick = () => goSlide(k));
  card.querySelectorAll('.thumbs button').forEach((b, k) => b.onclick = () => goSlide(k));
  card.querySelectorAll('.award').forEach(b => b.onclick = () => openAward(st.awards[+b.dataset.k]));
  const tr = $('track'); let sx = null;
  tr.addEventListener('pointerdown', e => { sx = e.clientX; });
  tr.addEventListener('pointerup', e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) goSlide(slide + (dx < 0 ? 1 : -1)); else if (Math.abs(dx) < 6) openLB(); });
  SFX.chime([523, 659, 784], 0.07); setTimeout(() => $('closeBtn')?.focus({ preventScroll: true }), 350);
}
const awardPic = a => `<img src="${esc(a.imgs[0])}" alt="${esc(a.t)}" draggable="false"><b class="aw-lab">${esc(a.short)}</b>${a.imgs.length > 1 ? `<i class="aw-n">${a.imgs.length}</i>` : ''}`;
function fitHeart() {
  const h = card.querySelector('.heart'); if (!h) return;
  const small = sheet.clientWidth <= 620, foot = card.querySelector('.card-foot');
  const availH = card.clientHeight - (small ? (foot ? foot.offsetHeight : 60) + 60 : 28);
  const w = Math.max(200, Math.min(card.clientWidth - 24, small ? 380 : 620, small && card.clientHeight < 520 ? 999 : availH * 1.25));
  h.style.width = Math.floor(w) + 'px';
}
addEventListener('resize', () => { if (STAGES[openIdx] && STAGES[openIdx].awards) fitHeart(); });
function openAward(a, n = 0) {
  const k = a.imgs.length, cap = (a.caps && a.caps[n]) || a.cap;
  lb.innerHTML = `<button class="lb-x" aria-label="Close"><span data-icon="x"></span></button>
    <div class="lb-pic aw"><div class="lb-frame"><img src="${esc(a.imgs[n])}" alt="${esc(a.t)}" draggable="false"><p class="lb-cap">${esc(cap)}</p>
    ${k > 1 ? `<button class="lb-nav prev" aria-label="Previous picture"></button><button class="lb-nav next" aria-label="Next picture"></button><span class="lb-count">${n + 1} / ${k}</span>` : ''}</div></div>`;
  lb.querySelector('[data-icon]').innerHTML = ICON.x(); lb.hidden = false; lb.onclick = closeLB; SFX.chime([659, 880], 0.07);
  if (k > 1) {
    const go = d => e => { e.stopPropagation(); openAward(a, (n + d + k) % k); };
    lb.querySelector('.prev').onclick = go(-1); lb.querySelector('.next').onclick = go(1);
    let sx = null; const fr = lb.querySelector('.lb-frame');
    fr.addEventListener('pointerdown', e => { sx = e.clientX; }); fr.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 40) { e.stopPropagation(); openAward(a, (n + (e.clientX < sx ? 1 : -1) + k) % k); } sx = null; });
  }
  setTimeout(() => lb.querySelector('.lb-x')?.focus({ preventScroll: true }), 50);
}
function goSlide(n) {
  if (openIdx < 0 || !$('track')) return; slide = (n + slideCount) % slideCount; $('track').style.transform = `translateX(${-slide * 100}%)`;
  card.querySelectorAll('.dots button,.thumbs button').forEach(b => b.removeAttribute('aria-current'));
  card.querySelectorAll('.dots button')[slide].setAttribute('aria-current', 'true');
  const t = card.querySelectorAll('.thumbs button')[slide]; t.setAttribute('aria-current', 'true');
  const th = $('thumbs'); th.scrollTo({ left: t.offsetLeft - th.clientWidth / 2 + t.offsetWidth / 2, behavior: 'smooth' });
}
function openLB() {
  if (openIdx < 0) return; const s = card.querySelectorAll('.slide')[slide], el = s.querySelector('img,svg'); if (!el) return;
  lb.innerHTML = `<button class="lb-x" aria-label="Close large photo"><span data-icon="x"></span></button><div class="lb-pic">${el.outerHTML}</div><p>${esc(STAGES[openIdx].title)}: ${esc(s.querySelector('figcaption').textContent)}</p>`;
  lb.querySelector('[data-icon]').innerHTML = ICON.x(); lb.hidden = false; lb.onclick = closeLB; setTimeout(() => lb.querySelector('.lb-x')?.focus({ preventScroll: true }), 50);
}
function closeLB() { lb.hidden = true; lb.innerHTML = ''; }
function closeSheet() { if (openIdx < 0) return; stopGames(); closeLB(); sheet.classList.remove('open'); const i = openIdx; openIdx = -1; setTimeout(() => $('node' + i)?.focus({ preventScroll: true }), 200); }
function claim(i) {
  if (state.done.includes(i)) { toast('Already collected'); return; }
  state.done.push(i); state.gems += 30 + i * 10; state.coins += 120 + i * 40; save(); setNum('gems', state.gems); setNum('coins', state.coins);
  const b = $('claimBtn'); b.disabled = true; b.innerHTML = 'Memory collected';
  const r = b.getBoundingClientRect(), sr = screen.getBoundingClientRect(); confetti(r.left + r.width / 2 - sr.left, r.top - sr.top);
  SFX.chime([523, 659, 784, 1047], 0.09); refresh();
  setTimeout(() => toast(state.done.length === NSTAGES ? `All ${NSTAGES} memories collected. Ultimate stan unlocked!` : `Memory collected: ${STAGES[i].title}`), 300);
}

/* ---------- menu ---------- */
function toggleMenu(force) {
  const open = force ?? menu.hidden; menu.hidden = !open; $('menuBtn').setAttribute('aria-expanded', open);
  if (open) setTimeout(() => menu.querySelector('.seg button')?.focus({ preventScroll: true }), 120);
}
$('menuBtn').onclick = e => { e.stopPropagation(); toggleMenu(); };
$('btnMenu').onclick = e => { e.stopPropagation(); toggleMenu(); };
document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('#menuBtn,#btnMenu')) toggleMenu(false); });
document.querySelectorAll('#themeSeg button').forEach(b => b.onclick = () => { state.theme = b.dataset.t; save(); applyTheme(); });
document.querySelectorAll('#musicSeg button').forEach(b => b.onclick = () => { state.music = b.dataset.m === '1'; save(); applyAudio(); });
document.querySelectorAll('#sfxSeg button').forEach(b => b.onclick = () => { state.sfx = b.dataset.s === '1'; save(); applyAudio(); });
$('vol').oninput = e => { state.vol = +e.target.value / 100; applyAudio(); }; $('vol').onchange = save;
$('menuBuild').onclick = () => { toggleMenu(false); openBuilder(); };
$('menuCredits').onclick = () => { toggleMenu(false); showCredits(); };
let armed = false;
$('resetBtn').onclick = () => {
  const b = $('resetBtn');
  if (!armed) { armed = true; b.textContent = 'Tap again to confirm'; setTimeout(() => { armed = false; b.textContent = 'Reset collected memories'; }, 2500); return; }
  armed = false; b.textContent = 'Reset collected memories'; state.done = []; state.gems = 100; state.coins = 400; save(); setNum('gems', 100); setNum('coins', 400); refresh(); toast('Memories reset');
};

/* ---------- wishes: parse, curate, render ---------- */
const parseRows = t => String(t).split('\n').map(l => l.trim()).filter(Boolean).map(l => {
  const c = l.split(/\t|\s\|\s/).map(x => x.trim());
  return { handle: c[0], message: c.length >= 3 ? c[2] : c[1] };       // 4-column rows: name and badge are ignored
});
const fmtHandle = h => { h = String(h || 'fan').trim().replace(/\s+/g, ''); return h.startsWith('@') ? h : '@' + h; };
function curate(list, sample) {
  return list.map(w => ({ handle: fmtHandle(w.handle), message: String(w.message || '').replace(/\s+/g, ' ').trim(), sample }))
    .filter(w => {
      if (!w.message) return false;
      const bad = MOD.check(w.message, { name: true });      // words-only check for wishes you curated yourself
      if (bad) { console.warn('Hidden by kindness filter:', w.handle); return false; }
      return true;
    }).map(w => ({ ...w, message: w.message.length > 1600 ? w.message.slice(0, 1600).trim() + '...' : w.message }));
}
let WISHES = curate(parseRows(WISH_ROWS), false);
let LIVE = [];                                   // wishes fetched from the published response sheet (if configured)
const myWishes = () => sessionStore.get('sent') || [];
/* every fan gets their own little mascot (fur, outfit and extras picked from their username) */
const hashStr = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const fanMemo = new Map();
function fanCat(handle) {
  const k = String(handle).toLowerCase(); if (fanMemo.has(k)) return fanMemo.get(k);
  const h = hashStr(k), furs = Object.keys(FURS), outs = Object.keys(OUTFITS), props = Object.keys(PROPS);
  const my = [], n = h % 3;
  for (let i = 0; i < n; i++) { const p = props[(h >>> (3 + i * 5)) % props.length]; if (!my.includes(p)) my.push(p); }
  const svg = catSVG({ fur: furs[h % furs.length], outfit: outs[(h >>> 7) % outs.length], props: my });
  fanMemo.set(k, svg); return svg;
}
function allWishes() {
  const seen = new Set(), out = [];
  [{ ...CREATOR_WISH, pinned: true }, ...myWishes().map(w => ({ ...w, mine: true })), ...LIVE, ...WISHES].forEach(w => { const key = w.handle.toLowerCase() + '|' + w.message.slice(0, 60); if (!seen.has(key)) { seen.add(key); out.push(w); } });
  return out;
}
function renderMail() {
  const all = allWishes();
  $('mailCount').textContent = `${all.length} birthday ${all.length === 1 ? 'wish' : 'wishes'}`;
  const sc = $('mailList').scrollTop;
  $('mailList').innerHTML = `<span class="ph-day">Birthday wishes</span>` + all.map((w, i) =>
    `<button class="msg${w.pinned ? ' pinned' : ''}" data-i="${i}" style="animation-delay:${Math.min(i, 10) * 0.05}s"><span class="bd">${fanCat(w.handle)}</span><span class="bubble"><b>${esc(w.handle)}</b>${w.mine ? '<span class="tag">Yours</span>' : ''}${w.pinned ? '<span class="tag pin">Pinned by the creator</span>' : ''}<p>${esc(w.message)}</p></span></button>`).join('');
  $('mailList').scrollTop = sc;
  $('mailList').querySelectorAll('.msg').forEach(m => m.onclick = () => openWish(all[+m.dataset.i]));
}
/* live wishes: read the form's published response sheet so new wishes appear for everyone without a rebuild */
function csvRows(t) {
  const rows = []; let r = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { r.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; r.push(f); f = ''; rows.push(r); r = []; }
    else f += c;
  }
  if (f || r.length) { r.push(f); rows.push(r); }
  return rows;
}
let fetching = false;
const dbUrl = () => String(WISH_DB.url || '').trim().replace(/\/+$/, '');
async function pullLive() {
  if ((!dbUrl() && !FORM.sheetCsv) || fetching) return; fetching = true;
  try {
    if (dbUrl()) {
      const res = await fetch(dbUrl() + '/wishes.json?orderBy="$key"&limitToLast=300', { cache: 'no-store' });
      if (!res.ok) throw new Error('bad');
      const obj = (await res.json()) || {}, rows = Object.keys(obj).sort().reverse().map(k => obj[k]).filter(w => w && typeof w.message === 'string').map(w => ({ handle: String(w.handle || 'fan'), message: w.message }));
      const next = curate(rows, false).filter(w => !MOD.check(w.message));
      if (JSON.stringify(next) !== JSON.stringify(LIVE)) { LIVE = next; renderMail(); }
      fetching = false; return;
    }
    const res = await fetch(FORM.sheetCsv + (FORM.sheetCsv.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const rows = csvRows(await res.text()).slice(1).filter(r => r.length >= 3).map(r => ({ handle: r[1], message: r[2] }));
    const next = curate(rows.reverse(), false).filter(w => !MOD.check(w.message));
    if (JSON.stringify(next) !== JSON.stringify(LIVE)) { LIVE = next; renderMail(); }
  } catch (e) { /* offline or not published yet: the built-in wishes still show */ }
  fetching = false;
}
setInterval(() => { if (mailOpen() || !startOpen()) pullLive(); }, dbUrl() ? 8000 : 20000);
function openMail() { closeMenuIfOpen(); renderMail(); pullLive(); mailEl.classList.add('open'); SFX.chime([659, 784], 0.07); setTimeout(() => $('mailBack').focus({ preventScroll: true }), 300); }
function closeMail() { closeCompose(); mailEl.classList.remove('open'); }
const closeMenuIfOpen = () => { if (menuOpen()) toggleMenu(false); };
const softHearts = () => `<div class="hearts" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<i style="left:${6 + i * 11}%;width:${14 + (i * 5) % 12}px;animation-duration:${9 + (i * 2) % 6}s;animation-delay:${-i * 1.3}s">${ICON.heart(true)}</i>`).join('')}</div>`;
const flower = (x, y, s) => `<span class="corner" style="left:${x};top:${y};width:${s}px">${sunflowerSVG()}</span>`;
function openWish(w) {
  $('gcard').style.setProperty('--bc', '#ffd257');
  $('gcard').innerHTML = `${softHearts()}<button class="x" id="gx" aria-label="Close card"><span data-icon="x"></span></button>
    <div class="badge-big">${fanCat(w.handle)}</div>
    <h3>Dear Tuty,</h3><p class="msgtext">${esc(w.message)}</p>
    <div class="sig">With love,<span>${esc(w.handle)}</span></div>`;
  $('gx').innerHTML = ICON.x(); gw.classList.add('open'); $('gx').onclick = closeG; SFX.chime([784, 988, 1175], 0.07); setTimeout(() => $('gx').focus({ preventScroll: true }), 300);
  const r = screen.getBoundingClientRect(); confetti(r.width / 2, r.height * 0.3);
}
function showCredits() {
  $('gcard').style.setProperty('--bc', '#ffd257');
  $('gcard').innerHTML = `<button class="x" id="gx" aria-label="Close credits"><span data-icon="x"></span></button><div class="badge-big">${BRAND_CAT}</div><h3>Credits</h3><div class="credits">
    <p>Tuty-Verse is a non-commercial, fan-made birthday gift for Tuty. It is not affiliated with her, her agencies, broadcasters or any studio.</p>
    <p>Photos belong to their original owners and are linked, not stored. The white kitten with the sunflower on her ear is an original mascot made for this project.</p>
    <p>Made with love by fans.</p></div>`;
  $('gx').innerHTML = ICON.x(); gw.classList.add('open'); $('gx').onclick = closeG; setTimeout(() => $('gx').focus({ preventScroll: true }), 300);
}
function closeG() { gw.classList.remove('open'); }

/* ---------- compose a wish ---------- */
const cText = $('cText'), cHandle = $('cHandle'), cErr = $('cErr'), cSendBtn = $('cSend');
function openCompose() {
  if (!mailOpen()) openMail();
  cText.value = ''; cHandle.value = ''; cErr.textContent = ''; $('cCount').textContent = '0'; cSendBtn.disabled = false;
  $('cForm').hidden = false; $('cDone').hidden = true; compose.hidden = false; setTimeout(() => cText.focus({ preventScroll: true }), 120);
}
function closeCompose() { compose.hidden = true; }
cText.addEventListener('input', () => { $('cCount').textContent = cText.value.length; cErr.textContent = ''; });
cHandle.addEventListener('input', () => { cHandle.value = cHandle.value.replace(/^@+/, '').replace(/[^A-Za-z0-9_]/g, ''); cErr.textContent = ''; });
function validateWish(msg, h) {
  if (!msg) return 'Please write a message for Tuty.';
  if (msg.length > MAX_WISH) return `Please keep your wish under ${MAX_WISH} characters.`;
  const bad = MOD.check(msg); if (bad) return bad;
  if (!h) return 'Please add your X username after the @ so Tuty knows who the wish is from.';
  if (!/^[A-Za-z0-9_]{1,15}$/.test(h)) return 'Your X username can only have letters, numbers and underscores (up to 15).';
  if (MOD.check(h, { name: true })) return 'Please check your username.';
  return '';
}
async function sendWish() {
  const msg = cText.value.replace(/\s+/g, ' ').trim(), h = cHandle.value.trim();
  const err = validateWish(msg, h); if (err) { cErr.textContent = err; return; }
  const log = sessionStore.get('sendlog') || { n: 0, t: 0 };
  if (log.n >= MAX_SENDS) { cErr.textContent = 'You have sent a few wishes already. Thank you so much!'; return; }
  if (Date.now() - log.t < SEND_GAP_MS) { cErr.textContent = 'Please wait a few seconds before sending another wish.'; return; }
  if (!dbUrl() && (!FORM.action || !FORM.handle || !FORM.message)) { cErr.textContent = 'Sending wishes is not switched on yet. Please check back soon.'; return; }
  cSendBtn.disabled = true; cSendBtn.textContent = 'Sending...';
  try {
    if (dbUrl()) {
      const r = await fetch(dbUrl() + '/wishes.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ handle: '@' + h, message: msg, t: Date.now() }) });
      if (!r.ok) throw new Error('db');
    } else await fetch(FORM.action, { method: 'POST', mode: 'no-cors', body: new URLSearchParams({ [FORM.handle]: '@' + h, [FORM.message]: msg }) });
    sessionStore.set('sendlog', { n: log.n + 1, t: Date.now() });
    sessionStore.set('sent', [{ handle: '@' + h, message: msg }, ...myWishes()]);
    renderMail(); setTimeout(pullLive, dbUrl() ? 800 : 4000); $('cForm').hidden = true; $('cDone').hidden = false; SFX.chime([784, 988, 1175], 0.07);
    const r = screen.getBoundingClientRect(); confetti(r.width / 2, r.height * 0.4); setTimeout(() => $('cBack').focus({ preventScroll: true }), 100);
  } catch (e) { cErr.textContent = 'We could not send that just now. Please check your connection and try again.'; }
  cSendBtn.disabled = false; cSendBtn.textContent = 'Send wish';
}
$('mailSend').onclick = openCompose; $('cCancel').onclick = closeCompose; $('cBack').onclick = closeCompose; cSendBtn.onclick = sendWish;
$('mailBack').onclick = closeMail; $('mailBtn').onclick = openMail;
mailEl.addEventListener('click', e => { if (e.target === mailEl) closeMail(); });
gw.addEventListener('click', e => { if (e.target === gw) closeG(); });
sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

/* ---------- mascot builder ---------- */
const memo = new Map(); const thumb = (o) => { const k = JSON.stringify(o); if (!memo.has(k)) memo.set(k, catSVG(o)); return memo.get(k); };
let B = null, bFrom = null;
function openBuilder() {
  closeMenuIfOpen();
  B = mascot ? { ...mascot, props: [...mascot.props], step: 0 } : { name: '', fur: 'calico', outfit: 'none', props: [], step: 0 };
  confirmEl.hidden = true; builder.classList.add('open'); renderBuilder(); setTimeout(() => $('bClose').focus({ preventScroll: true }), 300);
}
function closeBuilder() { confirmEl.hidden = true; builder.classList.remove('open'); }
function renderBuilder() {
  const st = B.step, steps = ['Step 1 of 3: choose her fur', 'Step 2 of 3: dress her up', 'Step 3 of 3: name her', 'All done'];
  $('bStep').textContent = steps[st];
  const nm = B.name.trim() || 'Your mascot';
  $('bStage').innerHTML = `<div class="pedestal"><div class="bd-cat">${catSVG(B)}</div></div>${st >= 2 ? `<div class="bd-name">${esc(nm)}</div>` : ''}`;
  let p = '', f = '';
  if (st === 0) {
    p = `<h3>Pick her fur</h3><p class="lead">Seven cute kitten coats to choose from. She is a girl kitten, and you can add the sunflower later in the extras.</p>
      <div class="opts">${FUR_ORDER.map(k => `<button class="opt" data-fur="${k}" aria-pressed="${B.fur === k}"><span class="th">${thumb({ fur: k })}</span><span class="ol">${FURS[k].label}</span></button>`).join('')}</div>`;
    f = `<button class="btn-soft" data-act="cancel">Cancel</button><button class="cta" data-act="next">Next</button>`;
  } else if (st === 1) {
    p = `<h3>Dress her up</h3><h4>Outfit <small>pick one</small></h4>
      <div class="opts">${Object.keys(OUTFITS).map(k => `<button class="opt" data-outfit="${k}" aria-pressed="${B.outfit === k}"><span class="th">${thumb({ fur: B.fur, outfit: k })}</span><span class="ol">${OUTFITS[k].label}</span></button>`).join('')}</div>
      <h4>Accessories <small>pick as many as you like</small></h4>
      <div class="opts">${Object.keys(PROPS).map(k => `<button class="opt" data-prop="${k}" aria-pressed="${B.props.includes(k)}"><span class="th">${thumb({ fur: B.fur, props: [k] })}</span><span class="ol">${PROPS[k].label}</span></button>`).join('')}</div>`;
    f = `<button class="btn-soft" data-act="back">Back</button><button class="cta" data-act="done">I'm done</button>`;
  } else if (st === 2) {
    p = `<h3>Meet your mascot</h3><p class="desc" id="bDesc">${esc(describeMascot({ ...B, name: nm }))}</p>
      <label for="bName">Give her a name</label><input id="bName" class="txt" type="text" maxlength="14" value="${esc(B.name)}" placeholder="For example, Mochi" autocomplete="off">
      <p class="c-err" id="bErr" role="alert"></p>`;
    f = `<button class="btn-soft" data-act="back">Back</button><button class="cta" data-act="save">Save mascot</button>`;
  } else {
    p = `<h3>${esc(B.name)} is ready!</h3><p class="desc">${esc(describeMascot(B))}</p><p class="lead">She will travel with you on the map for this visit.</p>
      <p class="ask-q">Would you like to send a birthday message to Tuty?</p>`;
    f = `<button class="btn-soft" data-act="no">No, thanks</button><button class="cta" data-act="yes">Yes, send a message</button>`;
  }
  $('bPanel').innerHTML = p; $('bFoot').innerHTML = f;
  const nameIn = $('bName');
  if (nameIn) nameIn.addEventListener('input', () => { B.name = nameIn.value; $('bDesc').textContent = describeMascot({ ...B, name: B.name.trim() || 'Your mascot' }); $('bErr').textContent = ''; $('bStage').querySelector('.bd-name')?.replaceChildren(document.createTextNode(B.name.trim() || 'Your mascot')); });
}
function applyMascot() { token.innerHTML = myCat(); $('avatar').innerHTML = myCat(); }
$('bPanel').addEventListener('click', e => {
  const o = e.target.closest('.opt'); if (!o || !B) return;
  if (o.dataset.fur) B.fur = o.dataset.fur;
  else if (o.dataset.outfit) B.outfit = o.dataset.outfit;
  else if (o.dataset.prop) { const k = o.dataset.prop; B.props = B.props.includes(k) ? B.props.filter(x => x !== k) : [...B.props, k]; }
  const sc = $('bPanel').scrollTop; renderBuilder(); $('bPanel').scrollTop = sc;
  const again = $('bPanel').querySelector(`[data-fur="${o.dataset.fur}"],[data-outfit="${o.dataset.outfit}"],[data-prop="${o.dataset.prop}"]`); again?.focus({ preventScroll: true });
});
$('bFoot').addEventListener('click', e => {
  const a = e.target.closest('[data-act]')?.dataset.act; if (!a) return;
  if (a === 'cancel') closeBuilder();
  else if (a === 'next') { B.step = 1; renderBuilder(); $('bPanel').scrollTop = 0; }
  else if (a === 'back') { B.step--; renderBuilder(); $('bPanel').scrollTop = 0; }
  else if (a === 'done') { confirmEl.hidden = false; setTimeout(() => $('cfYes').focus({ preventScroll: true }), 50); }
  else if (a === 'save') {
    const nm = B.name.replace(/\s+/g, ' ').trim(), err = !nm ? 'Please give her a name.' : !/^[\p{L}\p{N} '\-]{1,14}$/u.test(nm) ? 'Names can use letters, numbers, spaces and hyphens (up to 14).' : MOD.check(nm, { name: true }) ? 'Please pick a kind name for your mascot.' : '';
    if (err) { $('bErr').textContent = err; return; }
    B.name = nm; mascot = cleanMascot(B); sessionStore.set('mascot', mascot); applyMascot(); B.step = 3; renderBuilder(); SFX.chime([523, 659, 784, 1047], 0.09);
    const r = screen.getBoundingClientRect(); confetti(r.width / 2, r.height * 0.35);
  } else if (a === 'yes') { closeBuilder(); openMail(); openCompose(); }
  else if (a === 'no') { closeBuilder(); toast(`${mascot.name} is ready to explore!`); }
});
$('cfNo').onclick = () => { confirmEl.hidden = true; };
$('cfYes').onclick = () => { confirmEl.hidden = true; B.step = 2; renderBuilder(); $('bPanel').scrollTop = 0; setTimeout(() => $('bName')?.focus({ preventScroll: true }), 100); };
$('bClose').onclick = closeBuilder;

/* ---------- start screen ---------- */
$('hero').innerHTML = BRAND_CAT;
$('ttl').innerHTML = ['Happy Birthday,', 'Tuty!'].map(w => `<span class="tw">${[...w].map((c, i) => c === ' ' ? ' ' : `<span class="tl" style="animation-delay:${(i * 0.09).toFixed(2)}s">${c}</span>`).join('')}</span>`).join(' ');
(function () {
  const items = [sunflowerSVG, () => ICON.heart(true), () => artSVG(['..k..', '..k..', 'kkkkk', '..k..', '..k..'], { k: '#ffd84a' })]; let h = '';
  for (let i = 0; i < 16; i++) h += `<span class="floaty" style="left:${(i * 6.3 + 3) % 100}%;width:${14 + (i * 7) % 16}px;animation-duration:${9 + (i * 3) % 8}s;animation-delay:${-(i * 1.3)}s">${items[i % 3]()}</span>`;
  $('floaties').innerHTML = h;
})();
document.querySelectorAll('.lives i').forEach(el => { el.innerHTML = ICON.heart(true); });
const syncNight = () => startEl.classList.toggle('night', isDarkNow());
syncNight(); setInterval(syncNight, 1000);
function startGame() { startEl.classList.add('hide'); SFX.chime([523, 659, 784, 1047], 0.08); setTimeout(() => toast('Tap a stage to follow her journey'), 500); }
function showStart() {
  closeLB(); closeG(); closeCompose(); closeMail(); closeBuilder(); closeSheet(); closeMenuIfOpen();
  startEl.classList.remove('hide'); setTimeout(() => $('pickMsg').focus({ preventScroll: true }), 300);
}
$('pickMsg').onclick = openMail; $('pickGame').onclick = startGame; $('pickBuild').onclick = openBuilder; $('buildBtn').onclick = openBuilder;

/* ---------- console controls + keyboard ---------- */
const press = el => { if (!el) return; el.classList.add('pressed'); setTimeout(() => el.classList.remove('pressed'), 120); };
const overlayBlocking = () => startOpen() || mailOpen() || builderOpen() || gOpen() || menuOpen();
function closeTop() {
  if (lbOpen()) { closeLB(); return true; }
  if (composeOpen()) { closeCompose(); return true; }
  if (!confirmEl.hidden) { confirmEl.hidden = true; return true; }
  if (gOpen()) { closeG(); return true; }
  if (menuOpen()) { toggleMenu(false); return true; }
  if (builderOpen()) { closeBuilder(); return true; }
  if (mailOpen()) { closeMail(); return true; }
  if (openIdx >= 0) { closeSheet(); return true; }
  return false;
}
const A = () => { if (overlayBlocking()) return; if (openIdx >= 0) { if (!isGame(openIdx)) claim(openIdx); } else openSheet(sel); };
const move = d => { if (overlayBlocking()) return; if (openIdx >= 0 && isGame(openIdx)) { gameMove(d); return; } if (openIdx >= 0) goSlide(slide + d); else goTo(sel + d); };
document.querySelectorAll('.dpad button').forEach(b => b.onclick = () => move(+b.dataset.dir));
$('btnA').onclick = A; $('btnB').onclick = () => { closeTop(); };
$('pvOpen').onclick = () => openSheet(sel);
$('btnX').onclick = () => { if (overlayBlocking()) return; openIdx >= 0 ? goSlide(slide - 1) : toast('Open a stage to browse its photos'); };
$('btnY').onclick = () => { if (overlayBlocking()) return; openIdx >= 0 ? goSlide(slide + 1) : toast('Open a stage to browse its photos'); };
$('btnHome').onclick = showStart;

function topLayerEl() {
  if (composeOpen()) return compose; if (!confirmEl.hidden) return confirmEl; if (gOpen()) return gw; if (menuOpen()) return menu;
  if (builderOpen()) return builder; if (mailOpen()) return mailEl; if (openIdx >= 0) return sheet; if (startOpen()) return startEl; return null;
}
document.addEventListener('keydown', e => {
  const k = e.key, typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
  if (k === 'Escape') { if (closeTop()) e.preventDefault(); return; }
  if (k === 'Tab') {
    const root = topLayerEl(); if (!root) return;
    const f = [...root.querySelectorAll('button,input,textarea,[href]')].filter(el => !el.disabled && el.offsetParent !== null);
    if (!f.length) return; const i = f.indexOf(document.activeElement);
    if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === f.length - 1 || i === -1)) { e.preventDefault(); f[0].focus(); }
    return;
  }
  if (typing || overlayBlocking()) return;
  if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); press(document.querySelector('.dpad .l')); move(-1); }
  else if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); press(document.querySelector('.dpad .r')); move(1); }
  else if (k === 'a' || k === 'A') { press($('btnA')); A(); }
  else if (k === 'b' || k === 'B') { press($('btnB')); closeTop(); }
  else if (k === 'Enter' && e.target.tagName !== 'BUTTON') { press($('btnA')); A(); }
});

/* ---------- boot ---------- */
applyTheme(); applyAudio(); applyMascot();
$('gems').textContent = state.gems; $('coins').textContent = state.coins;
let rt; new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { if (!busy) buildMap(); }, 120); }).observe(wrap);
(vq.addEventListener ? vq.addEventListener('change', () => buildMap(true)) : vq.addListener(() => buildMap(true)));
buildMap(true); renderMail();
setTimeout(() => $('pickMsg').focus({ preventScroll: true }), 400);
