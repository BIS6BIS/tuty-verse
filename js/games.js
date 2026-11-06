'use strict';
/* =====================================================================
   TUTY-VERSE mini games: word cross, maze escape, sunflower catch.
   Each one opens inside the same card as a stage. Finishing or skipping
   a game marks it as done so the map can move on.
   ===================================================================== */
let gameStop = null;                                  // cleanup for the game that is open right now
const stopGames = () => { if (gameStop) { gameStop(); gameStop = null; } };
const isGame = i => !!(STAGES[i] && STAGES[i].game);

function finishGame(i, solved, bonus = 0) {
  if (state.done.includes(i)) return false;
  state.done.push(i);
  if (solved) { state.gems += 40 + bonus; state.coins += 150 + bonus * 3; }
  save(); setNum('gems', state.gems); setNum('coins', state.coins); refresh();
  return true;
}
function burst() {
  const b = card.querySelector('.gm-win') || card, r = b.getBoundingClientRect(), sr = screen.getBoundingClientRect();
  confetti(r.left + r.width / 2 - sr.left, r.top - sr.top + 20); SFX.chime([523, 659, 784, 1047], 0.09);
}

function openGame(i) {
  if (builderOpen() || mailOpen()) return;
  stopGames();
  const st = STAGES[i];
  card.style.setProperty('--sc', st.c); slideCount = 0;
  card.innerHTML = `<button class="close" id="closeBtn" aria-label="Close"><span data-icon="x"></span></button>
    <div class="gm" id="gm"></div>
    <div class="card-foot gm-foot"><button class="cta alt" id="skipBtn">Skip game</button></div>`;
  card.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = ICON[el.dataset.icon](); });
  const sr = screen.getBoundingClientRect(), nr = $('node' + i).getBoundingClientRect();
  sheet.classList.add('open'); const ox = nr.left + nr.width / 2 - sr.left - card.offsetLeft, oy = nr.top + nr.height / 2 - sr.top - card.offsetTop;
  sheet.classList.remove('open'); card.style.transformOrigin = `${ox}px ${oy}px`; void card.offsetWidth; sheet.classList.add('open');
  card.scrollTop = 0; openIdx = i;
  $('closeBtn').onclick = closeSheet;
  const skip = $('skipBtn');
  skip.onclick = () => { if (finishGame(i, false)) toast('Skipped. The road ahead is open'); closeSheet(); };
  const done = () => { skip.textContent = 'Back to the map'; skip.classList.remove('alt'); skip.onclick = closeSheet; };
  if (state.done.includes(i)) done();
  const root = $('gm');
  ({ memory: gameMemory, maze: gameMaze, catch: gameCatch })[st.game](i, root, done);
  SFX.chime([523, 659, 784], 0.07); setTimeout(() => $('closeBtn')?.focus({ preventScroll: true }), 350);
}

/* ---------------- 1. memory match: her roles ---------------- */
const MEMORY_CARDS = [['pompom', 'Early life'], ['tooth', 'Dentist'], ['moon', 'Gorya'], ['bag', 'Kongkwan'], ['piano', 'Bee'], ['pulse', 'Mui'], ['retriever', 'Jaidee'], ['palace', 'Fongnuan']];
function gameMemory(i, root, done) {
  let deck = [], seed = Date.now() % 100000 + 1;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  MEMORY_CARDS.forEach(([m, l]) => { deck.push({ m, l }, { m, l }); });
  for (let k = deck.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [deck[k], deck[j]] = [deck[j], deck[k]]; }
  root.classList.add('mem');
  root.innerHTML = `<h2>Memory match</h2><p class="gm-sub">Flip the cards and match each of her roles.</p>
    <div class="mhud"><span id="mMoves">Moves 0</span><span id="mPairs">Pairs 0 / ${MEMORY_CARDS.length}</span></div>
    <div class="mgrid">${deck.map((c, k) => `<button class="mc" data-k="${k}" aria-label="Card ${k + 1}"><span class="mf"><span class="mb"><i></i></span><span class="mfront">${MOTIF[c.m]()}<small>${esc(c.l)}</small></span></span></button>`).join('')}</div>
    <div class="gm-win" hidden></div>`;
  let first = null, lock = false, moves = 0, pairs = 0;
  root.querySelectorAll('.mc').forEach(b => b.onclick = () => {
    const k = +b.dataset.k; if (lock || b.classList.contains('up') || b.classList.contains('hit')) return;
    b.classList.add('up'); SFX.chime([523 + k * 12], 0.04);
    if (first === null) { first = k; return; }
    moves++; $('mMoves').textContent = 'Moves ' + moves; const a = first, bb = k; first = null;
    const A = root.querySelector(`.mc[data-k="${a}"]`), B = b;
    if (deck[a].m === deck[bb].m) {
      A.classList.add('hit'); B.classList.add('hit'); pairs++; $('mPairs').textContent = `Pairs ${pairs} / ${MEMORY_CARDS.length}`; SFX.chime([784, 988], 0.06);
      if (pairs === MEMORY_CARDS.length) {
        const win = root.querySelector('.gm-win'), firstTime = finishGame(i, true, 10); win.hidden = false;
        win.innerHTML = `<strong>All matched!</strong><span>You found every role in ${moves} moves.</span>${firstTime ? '<em>+50 gems +180 coins</em>' : ''}<button class="cta" id="mAgain">Play again</button>`;
        done(); if (firstTime) burst(); $('mAgain').onclick = () => openGame(i); win.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    } else { lock = true; setTimeout(() => { A.classList.remove('up'); B.classList.remove('up'); lock = false; }, 800); }
  });
}

/* ---------------- 2. maze escape (a real maze with dead ends) ---------------- */
function makeMaze(N, seed) {
  let s = seed; const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const open = Array.from({ length: N }, () => Array.from({ length: N }, () => ({ r: false, d: false })));
  const vis = Array.from({ length: N }, () => Array(N).fill(false)), st = [[N - 1, 0]]; vis[N - 1][0] = true;
  while (st.length) {
    const [r, c] = st[st.length - 1];
    const nb = [[r - 1, c, 'u'], [r + 1, c, 'd'], [r, c - 1, 'l'], [r, c + 1, 'r']].filter(([a, b]) => a >= 0 && b >= 0 && a < N && b < N && !vis[a][b]);
    if (!nb.length) { st.pop(); continue; }
    const [a, b, dir] = nb[Math.floor(rnd() * nb.length)];
    if (dir === 'r') open[r][c].r = true; if (dir === 'l') open[a][b].r = true; if (dir === 'd') open[r][c].d = true; if (dir === 'u') open[a][b].d = true;
    vis[a][b] = true; st.push([a, b]);
  }
  const can = (r, c, a, b) => (a === r && b === c + 1 && open[r][c].r) || (a === r && b === c - 1 && open[a][b].r) || (b === c && a === r + 1 && open[r][c].d) || (b === c && a === r - 1 && open[a][b].d);
  const prev = {}, q = [[N - 1, 0]], seen = new Set([(N - 1) + ',0']);
  while (q.length) { const [r, c] = q.shift(); if (r === 0 && c === N - 1) break; [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([a, b]) => { const key = a + ',' + b; if (a >= 0 && b >= 0 && a < N && b < N && !seen.has(key) && can(r, c, a, b)) { seen.add(key); prev[key] = [r, c]; q.push([a, b]); } }); }
  const path = []; let cur = [0, N - 1]; while (cur) { path.unshift(cur); cur = prev[cur[0] + ',' + cur[1]]; }
  return { open, path };
}
function gameMaze(i, root, done) {
  const N = 9, U = 30;
  let M, seed = 11; do { M = makeMaze(N, seed++); } while (M.path.length < 30 && seed < 400);
  const P = M.path, L = P.length, GATES = [Math.floor(L * 0.25), Math.floor(L * 0.5), Math.floor(L * 0.75), L - 1], Q = MAZEQ;
  let q = 0, lives = 2, pos = 0, locked = false;
  const xy = k => ({ x: (P[k][1] + 0.5) / N * 100, y: (P[k][0] + 0.5) / N * 100 });
  let floor = '';
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    floor += `<rect x="${c * U + 4}" y="${r * U + 4}" width="${U - 8}" height="${U - 8}" rx="4" fill="#f1fbf3"/>`;
    if (M.open[r][c].r) floor += `<rect x="${c * U + U - 5}" y="${r * U + 4}" width="10" height="${U - 8}" fill="#f1fbf3"/>`;
    if (M.open[r][c].d) floor += `<rect x="${c * U + 4}" y="${r * U + U - 5}" width="${U - 8}" height="10" fill="#f1fbf3"/>`;
  }
  let bush = ''; for (let k = 0; k < 70; k++) bush += `<circle cx="${(k * 53 % (N * U - 6)) + 3}" cy="${(k * 97 % (N * U - 6)) + 3}" r="${2 + k % 3}" fill="${k % 2 ? '#3f9a64' : '#6cc88f'}" opacity=".55"/>`;
  const gates = GATES.map((k, n) => { const [r, c] = P[k]; const cx = (c + .5) * U, cy = (r + .5) * U; return n < 3
    ? `<g id="gt${n}" transform="translate(${cx} ${cy})"><circle r="10" fill="#ffd257" stroke="#8a5a14" stroke-width="2"/><text y="4.5" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="800" font-size="13" fill="#5b3a1b">${n + 1}</text></g>`
    : `<g id="gt3" transform="translate(${cx} ${cy})"><circle r="12" fill="#e85a78" stroke="#fff" stroke-width="2.5"/><text y="3.2" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="800" font-size="8" fill="#fff">EXIT</text></g>`; }).join('');
  root.innerHTML = `<h2>Maze escape</h2><p class="gm-sub">Every right answer takes her one step closer to the exit. You have two lives.</p>
    <div class="mz">
      <div class="mzmap"><svg viewBox="0 0 ${N * U} ${N * U}" aria-hidden="true"><rect width="${N * U}" height="${N * U}" rx="10" fill="#4faa74"/>${bush}${floor}${gates}</svg>
        <div class="mzcat" id="mzcat" style="left:${xy(0).x}%;top:${xy(0).y}%">${myCat()}</div></div>
      <div class="mzq" id="mzq"></div>
    </div>`;
  const cat = $('mzcat'), panel = $('mzq');
  const hearts = () => `<div class="lives2" aria-label="${lives} lives left">${[0, 1].map(k => `<span class="${k < lives ? '' : 'lost'}">${ICON.heart(k < lives)}</span>`).join('')}</div>`;
  function ask() {
    if (q >= Q.length) { win(); return; }
    panel.innerHTML = `${hearts()}<p class="qn">Question ${q + 1} of ${Q.length}</p><h3>${esc(Q[q].q)}</h3>
      <div class="gopts">${Q[q].o.map((o, k) => `<button class="gopt" data-k="${k}">${esc(o)}</button>`).join('')}</div><p class="fb" id="fb" aria-live="polite"></p>`;
    panel.querySelectorAll('.gopt').forEach(b => b.onclick = () => pick(+b.dataset.k, b));
  }
  function walk(to) {
    return new Promise(res => { const step = () => { if (pos >= to) { res(); return; } pos++; const a = xy(pos); cat.style.left = a.x + '%'; cat.style.top = a.y + '%'; setTimeout(step, 110); }; step(); });
  }
  async function pick(k, btn) {
    if (locked) return; locked = true;
    if (k === Q[q].a) {
      btn.classList.add('right'); SFX.chime([659, 880], 0.07); $('fb').textContent = 'Right! She runs on through the maze.';
      await walk(GATES[q]); $('gt' + q)?.setAttribute('opacity', '0'); q++; locked = false;
      setTimeout(ask, 250);
    } else {
      lives--; btn.classList.add('wrong'); btn.disabled = true; SFX.chime([262, 196], 0.09); cat.classList.remove('dizzy'); void cat.offsetWidth; cat.classList.add('dizzy');
      panel.querySelector('.lives2').outerHTML = hearts();
      if (lives <= 0) {
        panel.querySelectorAll('.gopt').forEach(b => b.disabled = true);
        $('fb').innerHTML = 'Oh no. She is stuck in the maze! Press <b>Skip game</b> below to keep going.';
        toast('She is stuck. Use Skip to carry on');
      } else { $('fb').textContent = 'Wrong way! She stays put. One life left.'; locked = false; }
    }
  }
  function win() {
    const first = finishGame(i, true, 30);
    panel.innerHTML = `<div class="gm-win"><strong>She made it out!</strong><span>All four answers were right and the maze is open.</span>${first ? '<em>+70 gems +240 coins</em>' : ''}</div>`;
    done(); if (first) burst();
  }
  ask();
}

/* ---------------- 3. sunflower catch (just for fun) ---------------- */
function gameCatch(i, root, done) {
  const TIME = 25;
  root.innerHTML = `<h2>Sunflower catch</h2><p class="gm-sub">Slide to catch the falling sunflowers and hearts.</p>
    <div class="cg" id="cg" tabindex="0" aria-label="Catch game area"><div class="cg-hud"><span id="cgScore">Score 0</span><span id="cgTime">${TIME}s</span></div>
      <div class="cg-cat" id="cgCat">${myCat()}</div>
      <div class="cg-over" id="cgOver"><strong>Ready?</strong><span>Drag or use the arrow keys</span><button class="cta" id="cgGo">Start</button></div></div>`;
  const area = $('cg'), cat = $('cgCat'), over = $('cgOver');
  let x = 50, score = 0, left = TIME, run = false, raf = 0, last = 0, spawnT = 0, items = [], firstTime = !state.done.includes(i);
  const setX = v => { x = Math.max(8, Math.min(92, v)); cat.style.left = x + '%'; };
  setX(50);
  const pointer = e => { const r = area.getBoundingClientRect(); setX((e.clientX - r.left) / r.width * 100); };
  area.addEventListener('pointermove', pointer); area.addEventListener('pointerdown', pointer);
  window.gameMove = d => { if (run) setX(x + d * 9); };
  const onKey = e => { if (!run) return; if (e.key === 'ArrowLeft') { setX(x - 7); e.preventDefault(); e.stopPropagation(); } else if (e.key === 'ArrowRight') { setX(x + 7); e.preventDefault(); e.stopPropagation(); } };
  document.addEventListener('keydown', onKey, true);
  function pop(px, py, txt) { const s = document.createElement('div'); s.className = 'cg-pop'; s.textContent = txt; s.style.left = px + '%'; s.style.top = py + '%'; area.appendChild(s); setTimeout(() => s.remove(), 700); }
  function tick(t) {
    if (!run) return; const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; left -= dt; spawnT -= dt;
    $('cgTime').textContent = Math.max(0, Math.ceil(left)) + 's';
    if (spawnT <= 0) { const sun = Math.random() < 0.4, el = document.createElement('div'); el.className = 'cg-item'; el.innerHTML = sun ? sunflowerSVG() : ICON.heart(true);
      const it = { el, x: 8 + Math.random() * 84, y: -8, v: 24 + Math.random() * 14 + (TIME - left) * 1.2, pts: sun ? 3 : 1 }; el.style.left = it.x + '%'; area.appendChild(el); items.push(it); spawnT = 0.5 + Math.random() * 0.4 - (TIME - left) * 0.008; }
    const H = area.clientHeight, W = area.clientWidth;
    items = items.filter(it => {
      it.y += it.v * dt; it.el.style.top = it.y + '%';
      const hitY = it.y > 70 && it.y < 92, hitX = Math.abs(it.x - x) < (W < 360 ? 13 : 9);
      if (hitY && hitX) { score += it.pts; $('cgScore').textContent = 'Score ' + score; pop(it.x, it.y - 6, '+' + it.pts); SFX.chime([it.pts > 1 ? 988 : 784], 0.04); it.el.remove(); return false; }
      if (it.y > 104) { it.el.remove(); return false; } return true;
    });
    if (left <= 0) { end(); return; }
    raf = requestAnimationFrame(tick);
  }
  function end() {
    run = false; cancelAnimationFrame(raf); items.forEach(it => it.el.remove()); items = []; window.gameMove = null;
    const msg = score >= 40 ? 'Sunflower superstar!' : score >= 20 ? 'Great catching!' : 'Nice try!';
    over.hidden = false; over.innerHTML = `<strong>${msg}</strong><span>You caught ${score} points</span>${firstTime ? `<em>+${20 + score} gems</em>` : ''}<button class="cta" id="cgGo">Play again</button>`;
    if (firstTime) { finishGame(i, true, score - 20); firstTime = false; burst(); }
    done(); $('cgGo').onclick = start;
  }
  function start() {
    over.hidden = true; score = 0; left = TIME; spawnT = 0.2; items.forEach(it => it.el.remove()); items = []; $('cgScore').textContent = 'Score 0'; run = true; last = performance.now(); setX(50);
    window.gameMove = d => { if (run) setX(x + d * 9); }; area.focus({ preventScroll: true }); raf = requestAnimationFrame(tick);
  }
  $('cgGo').onclick = start;
  gameStop = () => { run = false; cancelAnimationFrame(raf); window.gameMove = null; document.removeEventListener('keydown', onKey, true); };
}
const gameMove = d => { if (typeof window.gameMove === 'function') window.gameMove(d); };
