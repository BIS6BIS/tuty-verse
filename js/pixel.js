'use strict';
/* =====================================================================
   Pixel-art toolkit: every icon, stage logo and the mascot are drawn
   from pixels in code. No emoji, no image files.
   ===================================================================== */
function G(w, h) {
  const g = { w, h, d: new Array(w * h).fill(null) };
  const inb = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  g.get = (x, y) => (inb(x, y) ? g.d[y * w + x] : null);
  g.p = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (c && inb(x, y)) g.d[y * w + x] = c; return g; };
  g.r = (x, y, ww, hh, c) => { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) g.p(x + i, y + j, c); return g; };
  // paint only on cells that already hold colour (used for fur patterns)
  g.pp = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (c && inb(x, y) && g.d[y * w + x]) g.d[y * w + x] = c; return g; };
  g.pr = (x, y, ww, hh, c) => { for (let j = 0; j < hh; j++) for (let i = 0; i < ww; i++) g.pp(x + i, y + j, c); return g; };
  g.e = (cx, cy, rx, ry, c, mask, only) => {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1) { (only ? g.pp : g.p)(x, y, c); if (mask && inb(x, y)) mask[y * w + x] = 1; }
      }
    return g;
  };
  g.pe = (cx, cy, rx, ry, c) => g.e(cx, cy, rx, ry, c, null, true);
  g.tri = (a, b, c2, col, o = {}) => {
    const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
    const xs = [a[0], b[0], c2[0]], ys = [a[1], b[1], c2[1]];
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++)
      for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x++) {
        const pt = [x, y], d1 = s(pt, a, b), d2 = s(pt, b, c2), d3 = s(pt, c2, a);
        if (!((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0))) {
          (o.only ? g.pp : g.p)(x, y, col); if (o.mask && inb(x, y)) o.mask[y * w + x] = 1;
        }
      }
    return g;
  };
  g.line = (x0, y0, x1, y1, c, t = 1) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 2;
    for (let i = 0; i <= n; i++) {
      const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n;
      g.r(Math.round(x - (t - 1) / 2), Math.round(y - (t - 1) / 2), t, t, c);
    }
    return g;
  };
  // rounded rectangle outline (pixel-rounded corners)
  g.rr = (x, y, ww, hh, c) => {
    g.r(x + 1, y, ww - 2, 1, c); g.r(x + 1, y + hh - 1, ww - 2, 1, c);
    g.r(x, y + 1, 1, hh - 2, c); g.r(x + ww - 1, y + 1, 1, hh - 2, c); return g;
  };
  g.art = (x, y, rows, pal) => {
    rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const ch = row[i]; if (ch !== '.' && ch !== ' ' && pal[ch]) g.p(x + i, y + j, pal[ch]); } });
    return g;
  };
  g.outline = (c) => {
    const add = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (g.d[y * w + x]) continue;
      if (g.get(x - 1, y) || g.get(x + 1, y) || g.get(x, y - 1) || g.get(x, y + 1)) add.push([x, y]);
    }
    add.forEach(([x, y]) => g.p(x, y, c)); return g;
  };
  g.blit = (src, x0, y0) => { for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) { const c = src.d[y * src.w + x]; if (c) g.p(x0 + x, y0 + y, c); } return g; };
  g.rects = () => {
    let s = '';
    for (let y = 0; y < h; y++) {
      let x = 0;
      while (x < w) {
        const c = g.d[y * w + x];
        if (!c) { x++; continue; }
        let n = 1; while (x + n < w && g.d[y * w + x + n] === c) n++;
        s += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${c}"/>`; x += n;
      }
    }
    return s;
  };
  g.svg = (extra = '', attrs = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" ${attrs}>${g.rects()}${extra}</svg>`;
  return g;
}
const artSVG = (rows, pal) => G(Math.max(...rows.map(r => r.length)), rows.length).art(0, 0, rows, pal).svg();

/* ---------- UI icons ---------- */
const CC = 'currentColor';
const ICON = {
  home: () => artSVG(['.....kk.....', '....kkkk....', '...kkkkkk...', '..kkkkkkkk..', '.kkkkkkkkkk.', '..kkkkkkkk..', '..kkk..kkk..', '..kkk..kkk..', '..kkk..kkk..'], { k: CC }),
  menu: () => artSVG(['kkkkkkkkkk', '..........', 'kkkkkkkkkk', '..........', 'kkkkkkkkkk'], { k: CC }),
  mail: () => artSVG(['kkkkkkkkkkkk', 'kkwwwwwwwwkk', 'kwkwwwwwwkwk', 'kwwkwwwwkwwk', 'kwwwkwwkwwwk', 'kwwwwkkwwwwk', 'kwwwwwwwwwwk', 'kwwwwwwwwwwk', 'kkkkkkkkkkkk'], { k: CC, w: '#ffd6e7' }),
  gem: () => artSVG(['..kkkkk..', '.kbbwbbk.', 'kbbbwbbbk', '.kbbbbbk.', '..kbbbk..', '...kbk...', '....k....'], { k: '#2d5a8a', b: '#6cc4ff', w: '#e3f6ff' }),
  coin: () => G(9, 9).e(4, 4, 3.6, 3.6, '#f6c453').outline('#a8741a').r(4, 2, 1, 5, '#fff3b0').r(2, 4, 5, 1, '#fff3b0').svg(),
  heart: (on = true) => artSVG(['.kk.kk.', 'kRRkRRk', 'kRRRRRk', 'kRRRRRk', '.kRRRk.', '..kRk..', '...k...'], { k: on ? '#8a1f3d' : '#9c8aa8', R: on ? '#ff5c7f' : '#efe6f4' }),
  note: () => artSVG(['..kkkkk', '..kwwwk', '..k...k', '..k...k', 'kkk.kkk', 'kkk.kkk'], { k: CC, w: CC }),
  x: () => artSVG(['k...k', '.k.k.', '..k..', '.k.k.', 'k...k'], { k: CC }),
};

/* ---------- Sunflower (11px petals + outline, used on the mascot ear and buttons) ---------- */
function sunflowerGrid() {
  const g = G(13, 13), c = 6;
  for (let y = 0; y < 13; y++) for (let x = 0; x < 13; x++) {
    const d = Math.hypot(x - c, y - c);
    if (d <= 4.4) g.p(x, y, (x + y) % 2 === 0 && d > 2.6 ? '#ffd84a' : '#ffc21a');
  }
  [[6, 1], [6, 11], [1, 6], [11, 6], [3, 2], [9, 2], [3, 10], [9, 10], [2, 3], [10, 3], [2, 9], [10, 9]].forEach(([x, y]) => g.p(x, y, '#ffcf2e'));
  g.e(c, c, 2.3, 2.3, '#8a5a2b'); g.e(c, c, 1.1, 1.1, '#5b3a1b'); g.p(5, 5, '#b07a3e'); g.p(7, 7, '#b07a3e');
  g.outline('#c98a14');
  return g;
}
const sunflowerSVG = () => sunflowerGrid().svg();

/* ---------- Stage logos (16x16 pixel art, never emoji) ---------- */
const OL = '#4a3358';
const MOTIF = {
  pompom: () => {
    const g = G(16, 16), cols = ['#f27ca6', '#ffc2d8', '#fff3a8', '#ffffff'];
    for (let k = 0, a = 0; a < 360; a += 12, k++) {
      const r = a * Math.PI / 180, l = k % 2 ? 5.4 : 7;
      g.line(8, 7, Math.round(8 + Math.sin(r) * l), Math.round(7 - Math.cos(r) * l), cols[k % 4], 1);
    }
    g.e(8, 7, 3.4, 3.4, '#f27ca6').e(7, 6, 1.4, 1.4, '#ffc2d8');
    g.r(6, 11, 4, 1, '#7b5aa8').r(7, 12, 2, 4, '#a985e0').r(7, 12, 1, 4, '#cbb6ef');
    return g.svg();
  },
  tooth: () => G(16, 16).art(0, 0, [
    '................', '...kkkk..kkkk...', '..kwwwwkkwwwwk..', '.kwwwwwwwwwwwwk.', '.kwwwwwwwwwwwwk.',
    '.kwwswwwwwwwwwk.', '.kwwswwwwwwwwwk.', '.kwwwwwwwwwwwwk.', '..kwwwwwwwwwwk..', '..kwwwwwwwwwwk..',
    '..kwwwk..kwwwk..', '...kwwk..kwwk...', '...kwwk..kwwk...', '...kwwk..kwwk...', '....kk....kk....', '................'],
    { k: '#c98aa8', w: '#ffffff', s: '#cfe0ff' }).p(12, 4, '#ffd257').p(3, 2, '#a985e0').svg(),
  moon: () => {
    const g = G(16, 16);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const a = Math.hypot(x - 7, y - 8) <= 6.3, b = Math.hypot(x - 10.2, y - 6.4) <= 5.4;
      if (a && !b) g.p(x, y, x < 5 || y > 12 ? '#ffe28a' : '#f6c453');
    }
    g.outline('#8a5a14');
    [[11, 9], [10, 9], [12, 9], [11, 8], [11, 10]].forEach(([x, y]) => g.p(x, y, '#fff3b0'));
    g.p(13, 3, '#fff3b0').p(14, 3, '#fff3b0').p(13, 2, '#fff3b0');
    return g.svg();
  },
  bag: () => {
    const g = G(16, 16);
    g.r(5, 1, 6, 1, '#4a4066').r(4, 2, 1, 3, '#4a4066').r(11, 2, 1, 3, '#4a4066');
    g.r(3, 5, 10, 9, '#3b3350').r(3, 5, 10, 4, '#4d4270').r(3, 9, 10, 1, '#241e33');
    g.r(4, 11, 8, 3, '#2f2842').r(4, 11, 8, 1, '#5d5185').r(7, 8, 2, 3, '#f0bd5a');
    g.r(1, 8, 2, 5, '#2f2842').r(13, 8, 2, 5, '#2f2842').p(1, 13, '#f48fb1').p(1, 14, '#f48fb1');
    return g.outline('#1c1626').svg();
  },
  piano: () => {
    const g = G(16, 16);
    g.r(1, 3, 14, 3, '#4a3358').r(2, 6, 12, 8, '#ffffff');
    [5, 8, 11].forEach(x => g.r(x, 6, 1, 8, '#d9cfe8'));
    [4, 7, 10].forEach(x => g.r(x, 6, 2, 5, '#2a1b33'));
    g.r(3, 4, 2, 1, '#f48fb1').r(11, 4, 2, 1, '#f6c453');
    return g.outline('#4a3358').svg();
  },
  pulse: () => {
    const g = G(16, 16);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
      const px = (x - 7.5) / 6.4, py = (8.6 - y) / 6.2, v = Math.pow(px * px + py * py - 1, 3) - px * px * Math.pow(py, 3);
      if (v <= 0) g.p(x, y, x < 6 && y < 6 ? '#ff8fa3' : '#e8506d');
    }
    g.outline('#5a2038');
    const pts = [[0, 9], [4, 9], [6, 4], [8, 13], [10, 7], [11, 9], [15, 9]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
      for (let k = 0; k <= n; k++) { const x = Math.round(x0 + (x1 - x0) * k / n), y = Math.round(y0 + (y1 - y0) * k / n); g.p(x, y, g.get(x, y) ? '#ffffff' : '#a985e0'); }
    }
    return g.svg();
  },
  retriever: () => {
    const g = G(16, 16);
    g.e(2.6, 8, 2.4, 4.6, '#c98a35').e(13.4, 8, 2.4, 4.6, '#c98a35');
    g.e(7.5, 7.8, 5.3, 5.2, '#eab85c').e(7.5, 4.6, 2.6, 1.4, '#f4cf85').e(7.5, 11, 3.1, 2.4, '#f7dc9d');
    g.r(7, 9, 2, 1, '#3b2545').r(5, 6, 1, 2, '#3b2545').r(10, 6, 1, 2, '#3b2545').r(7, 13, 2, 2, '#f48fb1').p(4, 9, '#f6a5b8').p(11, 9, '#f6a5b8');
    return g.outline('#6b4420').svg();
  },
  trophy: () => {
    const g = G(16, 16);
    g.r(4, 1, 8, 6, '#f6c453').r(5, 7, 6, 2, '#f6c453').r(7, 9, 2, 3, '#e0a93a').r(4, 12, 8, 3, '#8a5a2b').r(5, 12, 6, 1, '#b07a3e');
    g.r(2, 2, 2, 3, '#f6c453').p(2, 5, '#f6c453').p(3, 5, '#f6c453').r(12, 2, 2, 3, '#f6c453').p(12, 5, '#f6c453').p(13, 5, '#f6c453');
    g.r(5, 2, 1, 4, '#fff3b0').p(8, 3, '#ffffff').p(9, 4, '#fff3b0');
    return g.outline('#8a5a14').svg();
  },
  puzzle: () => {
    const g = G(16, 16);
    g.r(2, 2, 12, 12, '#ffffff');
    [[2, 2], [6, 2], [10, 2], [2, 6], [10, 6], [2, 10], [6, 10], [10, 10]].forEach(([x, y]) => g.r(x, y, 4, 4, '#bcdcf7'));
    g.r(6, 6, 4, 4, '#ffd257');
    g.r(2, 5, 12, 1, '#4a3358').r(2, 9, 12, 1, '#4a3358').r(5, 2, 1, 12, '#4a3358').r(9, 2, 1, 12, '#4a3358');
    g.p(7, 7, '#4a3358').p(8, 7, '#4a3358').p(7, 8, '#4a3358');
    return g.outline('#4a3358').svg();
  },
  maze: () => {
    const g = G(16, 16);
    g.r(1, 1, 14, 14, '#4faa74');
    [[3, 3, 10, 2], [3, 3, 2, 8], [3, 9, 8, 2], [9, 5, 2, 6], [7, 5, 4, 2], [12, 7, 2, 7]].forEach(([x, y, w, h]) => g.r(x, y, w, h, '#d6f5de'));
    g.p(12, 13, '#e85a78').p(13, 13, '#e85a78').p(3, 4, '#ffd257');
    return g.outline('#2f6b47').svg();
  },
  catch: () => {
    const g = G(16, 16);
    g.r(5, 1, 6, 6, '#ffcf2e').r(3, 3, 10, 2, '#ffcf2e').r(7, 3, 2, 2, '#8a5a2b').r(6, 2, 4, 4, '#ffc21a').r(7, 3, 2, 2, '#8a5a2b');
    g.r(7, 7, 2, 5, '#4faa74').r(4, 9, 3, 1, '#4faa74').r(9, 10, 3, 1, '#4faa74');
    g.r(3, 12, 10, 3, '#f27ca6').r(4, 12, 8, 1, '#ffc2d8');
    return g.outline('#8a5a14').svg();
  },
  palace: () => {
    const g = G(16, 16);
    g.r(7, 1, 2, 3, '#e9b14f');
    [[7, 2, 3], [6, 4, 4], [5, 6, 5], [4, 8, 6]].forEach(([x, w, y]) => g.r(x, y, w, 1, '#c42f4b'));
    g.r(3, 7, 10, 1, '#d9a75a').r(2, 8, 12, 1, '#d9a75a').r(1, 9, 14, 1, '#c9963f');
    g.r(3, 10, 10, 5, '#fdeee0').r(7, 11, 2, 4, '#c42f4b').r(3, 10, 1, 5, '#e8c9a0').r(12, 10, 1, 5, '#e8c9a0');
    g.r(5, 11, 1, 2, '#c9963f').r(10, 11, 1, 2, '#c9963f');
    return g.outline('#6b4a1e').svg();
  },
};

/* pixel cloud / bird used by the map background (no fill attr: CSS colours them) */
const CLOUD_ROWS = ['.....kkkk.......', '...kkkkkkkk.kk..', '..kkkkkkkkkkkkk.', '.kkkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkk'];
const cloudRects = () => { const g = G(16, 5).art(0, 0, CLOUD_ROWS, { k: 'x' }); let s = ''; for (let y = 0; y < 5; y++) { let x = 0; while (x < 16) { if (!g.d[y * 16 + x]) { x++; continue; } let n = 1; while (x + n < 16 && g.d[y * 16 + x + n]) n++; s += `<rect x="${x}" y="${y}" width="${n}" height="1"/>`; x += n; } } return s; };
const birdSVG = (c = '#ff7aa8') => {
  const a = G(11, 7).art(0, 0, ['..k.....k..', '.kkk...kkk.', '..kkkbkkk..', '...kkkkkkk.', '....kkkkko.', '.....kk.k..', '...........'], { k: c, b: '#fff', o: '#ff9f1c' }).p(7, 3, '#2d1d36');
  const b = G(11, 7).art(0, 0, ['...........', '...........', '..kk...kk..', '.kkkkbkkkk.', '..kkkkkkkko', '....kkkkk..', '.....k.k...'], { k: c, b: '#fff', o: '#ff9f1c' }).p(7, 3, '#2d1d36');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 7" shape-rendering="crispEdges"><g class="f1">${a.rects()}</g><g class="f2">${b.rects()}</g></svg>`;
};

/* =====================================================================
   The Tuty mascot: a smooth, hand-drawn style kitten (vector, not pixels)
   with a sunflower on one ear. The same drawing powers "build your own".
   ===================================================================== */
const FURS = {
  black: { label: 'Black cat', desc: 'a glossy black coat', base: '#352f3f', shade: '#292430', ol: '#14101a', iris: '#f6c453' },
  white: { label: 'Snow white', desc: 'a snow-white coat', base: '#fffaf5', shade: '#f0e4ee', ol: '#a58bb8', iris: null },
  calico: { label: 'Calico', desc: 'a patchwork calico coat of white, ginger and black', base: '#fffaf5', shade: '#f0e4ee', ol: '#8d7699', iris: null },
  ginger: { label: 'Orange tabby', desc: 'a warm orange tabby coat', base: '#f4a84f', shade: '#e39438', ol: '#8a4f22', iris: null },
  grey: { label: 'Grey tabby', desc: 'a silvery grey tabby coat', base: '#b4b2c6', shade: '#9d9bb3', ol: '#55506b', iris: null },
  tuxedo: { label: 'Tuxedo', desc: 'a sleek black-and-white tuxedo coat', base: '#453c50', shade: '#352e3f', ol: '#1d1824', iris: '#f6c453' },
  siamese: { label: 'Siamese', desc: 'a creamy Siamese coat with chocolate points', base: '#f7ead6', shade: '#e8d6ba', ol: '#6a4a3c', iris: '#6cc0f0' },
};
const FUR_ORDER = ['white', 'black', 'calico', 'ginger', 'tuxedo', 'grey', 'siamese'];
const OUTFITS = {
  none: { label: 'No outfit' },
  f4: { label: 'F4 Thailand uniform', desc: 'the green F4 Thailand uniform, a nod to Gorya' },
  dress: { label: 'Ancient pink dress', desc: 'a pink ancient-style dress inspired by Fongnuan' },
  labcoat: { label: 'Doctor lab coat', desc: 'a white doctor\'s lab coat with a stethoscope, for her dental days' },
  rockstar: { label: 'Blue rockstar + wings', desc: 'a full royal-blue rockstar outfit with shiny aquamarine wings' },
};
const PROPS = {
  sunflower: { label: 'Sunflower on head', desc: 'a sunflower on her ear, just like the Tuty-Verse mascot' },
  glasses: { label: 'Black-rim glasses', desc: 'black-rim glasses for her studious side' },
  tooth: { label: 'Tooth charm', desc: 'a tiny tooth charm for her dental degree' },
  basket: { label: 'Basket', desc: 'a little basket' },
  card: { label: 'Red F4 card', desc: 'the red F4 card' },
  pompom: { label: 'Cheer pompoms', desc: 'cheer pompoms from her cheerleading days' },
  puppy: { label: 'Puppy bag', desc: 'a puppy bag, a wink to Gohan' },
};

let _catId = 0;
/* patterns are drawn inside clip paths so they never spill outside the fur */
const EAR_L = 'M36 66 C28 32 32 18 46 16 C62 14 80 28 92 44Z', EAR_R = 'M164 66 C172 32 168 18 154 16 C138 14 120 28 108 44Z';
function furPattern(fur) {
  const O = '#ee9440', K = '#3d3441';
  const stripes = (c) => `<g stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M100 36v14M87 38l3 11M113 38l-3 11"/><path d="M34 80l14 3M34 92l13 1M166 80l-14 3M166 92l-13 1"/>
      <path d="M74 136l10 4M72 150l10 2M126 136l-10 4M128 150l-10 2"/></g>`;
  switch (fur) {
    case 'calico': return {
      head: `<ellipse cx="58" cy="58" rx="30" ry="24" fill="${O}"/><ellipse cx="148" cy="62" rx="26" ry="22" fill="${K}"/><path d="${EAR_L}" fill="${O}"/><path d="${EAR_R}" fill="${K}"/>`,
      body: `<ellipse cx="78" cy="154" rx="16" ry="14" fill="${O}"/><ellipse cx="128" cy="148" rx="14" ry="16" fill="${K}"/>`, tail: O,
    };
    case 'ginger': return { head: `${stripes('#c9722a')}<ellipse cx="100" cy="104" rx="26" ry="15" fill="#ffe6bf"/>`, body: `<ellipse cx="100" cy="154" rx="18" ry="20" fill="#ffe6bf"/>`, tail: '#c9722a', tailDash: true };
    case 'grey': return { head: `${stripes('#7b7892')}<ellipse cx="100" cy="104" rx="26" ry="15" fill="#e6e5f0"/>`, body: `<ellipse cx="100" cy="154" rx="18" ry="20" fill="#e6e5f0"/>`, tail: '#7b7892', tailDash: true };
    case 'tuxedo': return {
      head: `<ellipse cx="100" cy="106" rx="28" ry="17" fill="#fff"/><path d="M100 34c-6 10-6 20 0 32c6-12 6-22 0-32z" fill="#fff"/>`,
      body: `<ellipse cx="100" cy="150" rx="22" ry="24" fill="#fff"/>`, tail: '#2f2838', paw: '#ffffff',
    };
    case 'siamese': return {
      head: `<ellipse cx="100" cy="102" rx="31" ry="21" fill="#7a5a4c" opacity=".85"/><ellipse cx="48" cy="34" rx="15" ry="21" fill="#6e4d40"/><ellipse cx="152" cy="34" rx="15" ry="21" fill="#6e4d40"/>`,
      body: ``, tail: '#6e4d40', paw: '#6e4d40',
    };
    default: return { head: '', body: '', tail: null };
  }
}

function catSVG(o = {}) {
  const F = FURS[o.fur] || FURS.white, id = 'c' + (++_catId), P = new Set(o.props || []);
  const pat = furPattern(o.fur), OL = F.ol, sw = 3, OLN = '#3f2a4d';
  const fill = (c = F.base) => `fill="${c}" stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`;
  const tailPath = 'M132 164 C168 172 180 142 162 124';
  const BODY = 'M68 128 Q100 120 132 128 L140 168 Q100 180 60 168Z';
  let s = `<defs>
    <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fffd4"/><stop offset=".5" stop-color="#3f8fe8"/><stop offset="1" stop-color="#2038c8"/></linearGradient>
    <linearGradient id="${id}j" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a63ec"/><stop offset="1" stop-color="#1f35b8"/></linearGradient>
    <clipPath id="${id}b"><ellipse cx="100" cy="148" rx="38" ry="30"/></clipPath>
    <clipPath id="${id}h"><ellipse cx="100" cy="84" rx="68" ry="50"/><path d="${EAR_L}"/><path d="${EAR_R}"/></clipPath></defs>`;
  s += `<ellipse cx="100" cy="179" rx="62" ry="6" fill="#3a2340" opacity=".13"/>`;

  /* shiny wings sit behind everything */
  if (o.outfit === 'rockstar') {
    const wing = (flip) => {
      let w = '';
      [[-110, 58], [-92, 76], [-74, 88], [-56, 88], [-38, 74]].forEach(([a, L], i) => {
        const sc = L / 58;
        w += `<g transform="translate(76 150) rotate(${a}) scale(${(sc * 0.9).toFixed(2)} ${sc.toFixed(2)})">
          <path d="M0 0 C-14 -14 -13 -38 0 -58 C13 -38 14 -14 0 0Z" fill="url(#${id}w)" stroke="#1b2f9e" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M-3 -6 C-8 -18 -7 -34 -1 -48" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".75"/>
          <path d="M5 -10 C7 -20 6 -30 3 -38" fill="none" stroke="#bff7ff" stroke-width="1.8" stroke-linecap="round" opacity=".6"/></g>`;
      });
      const spark = (x, y, r) => `<path d="M${x} ${y - r} L${x + r * .3} ${y - r * .3} L${x + r} ${y} L${x + r * .3} ${y + r * .3} L${x} ${y + r} L${x - r * .3} ${y + r * .3} L${x - r} ${y} L${x - r * .3} ${y - r * .3}Z" fill="#fff"/>`;
      w += spark(8, 118, 7) + spark(-8, 150, 4.5) + spark(26, 98, 4);
      return flip ? `<g transform="translate(200 0) scale(-1 1)">${w}</g>` : w;
    };
    s += wing(false) + wing(true);
  }

  /* tail */
  s += `<path d="${tailPath}" fill="none" stroke="${OL}" stroke-width="17" stroke-linecap="round"/><path d="${tailPath}" fill="none" stroke="${F.base}" stroke-width="11" stroke-linecap="round"/>`;
  if (pat.tail) s += `<path d="${tailPath}" fill="none" stroke="${pat.tail}" stroke-width="11" stroke-linecap="round" ${pat.tailDash ? 'stroke-dasharray="5 10"' : (o.fur === 'calico' ? 'stroke-dasharray="14 40"' : '')}/>`;

  /* body */
  s += `<ellipse cx="100" cy="148" rx="38" ry="30" ${fill()}/><g clip-path="url(#${id}b)">${pat.body}</g>`;

  /* outfits */
  if (o.outfit === 'f4') {
    s += `<path d="${BODY}" fill="#3d9a64" stroke="${OLN}" stroke-width="${sw}" stroke-linejoin="round"/>
      <path d="M68 128 L60 168 Q68 172 76 172 L78 132Z M132 128 L140 168 Q132 172 124 172 L122 132Z" fill="#2c7a4c"/>
      <path d="M86 124 L100 148 L114 124Z" fill="#fff" stroke="${OLN}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M100 148 V176" stroke="#e2445f" stroke-width="4" stroke-linecap="round"/><circle cx="92" cy="160" r="2.6" fill="#f6c453"/><circle cx="108" cy="160" r="2.6" fill="#f6c453"/>`;
  } else if (o.outfit === 'dress') {
    s += `<path d="M70 126 Q100 118 130 126 L152 168 Q126 182 100 176 Q74 182 48 168Z" fill="#f7a1c0" stroke="${OLN}" stroke-width="${sw}" stroke-linejoin="round"/>
      <path d="M74 126 L132 172" stroke="#ffdbe9" stroke-width="10" stroke-linecap="round"/><path d="M74 126 L132 172" stroke="#f6c453" stroke-width="2" stroke-dasharray="3 5" stroke-linecap="round"/>
      <path d="M62 146 Q100 158 138 146" fill="none" stroke="#f6c453" stroke-width="4" stroke-linecap="round"/>
      <path d="M52 168 Q76 177 100 172 Q124 177 148 168" fill="none" stroke="#f6c453" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="82" cy="160" r="3" fill="#ffdbe9"/><circle cx="120" cy="156" r="3" fill="#ffdbe9"/>`;
  } else if (o.outfit === 'labcoat') {
    s += `<path d="M68 128 Q100 120 132 128 L142 172 Q100 182 58 172Z" fill="#ffffff" stroke="${OLN}" stroke-width="${sw}" stroke-linejoin="round"/>
      <path d="M86 124 L100 146 L114 124Z" fill="#5ec8c8" stroke="${OLN}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M86 124 L76 140 L100 150Z M114 124 L124 140 L100 150Z" fill="#eef1f8" stroke="${OLN}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M100 150 V178" stroke="#c9c2dc" stroke-width="2.4"/>
      <rect x="68" y="156" width="15" height="13" rx="2" fill="#fff" stroke="#c9c2dc" stroke-width="2.2"/><rect x="72" y="150" width="2.6" height="9" rx="1" fill="#e2445f"/><rect x="76" y="151" width="2.6" height="8" rx="1" fill="#3a8be0"/>
      <path d="M84 126 Q76 150 92 154" fill="none" stroke="#6b6b7e" stroke-width="2.6" stroke-linecap="round"/><circle cx="92" cy="155" r="3.6" fill="#d9dbe6" stroke="#6b6b7e" stroke-width="1.8"/>`;
  } else if (o.outfit === 'rockstar') {
    s += `<path d="${BODY}" fill="url(#${id}j)" stroke="#16226e" stroke-width="${sw}" stroke-linejoin="round"/>
      <path d="M86 124 L100 150 L114 124Z" fill="#7fffd4" stroke="#16226e" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M100 150 V178" stroke="#bff7ff" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 4"/>
      <path d="M68 128 L60 168 Q68 172 76 172 L78 132Z M132 128 L140 168 Q132 172 124 172 L122 132Z" fill="#7fffd4" opacity=".45"/>
      <path d="M86 124 L76 142 L88 140Z M114 124 L124 142 L112 140Z" fill="#9affe4" stroke="#16226e" stroke-width="2" stroke-linejoin="round"/>
      <path d="M118 158 l2.6 5.4 5.8.8 -4.2 4 1 5.8 -5.2-2.8 -5.2 2.8 1-5.8 -4.2-4 5.8-.8z" fill="#ffe27a" stroke="#c98a14" stroke-width="1"/>
      <path d="M70 134 Q82 130 90 146" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
      <circle cx="74" cy="158" r="2" fill="#bff7ff"/><circle cx="80" cy="166" r="2" fill="#bff7ff"/>`;
  }

  /* arms and feet */
  const paw = pat.paw || F.base;
  s += `<ellipse cx="66" cy="148" rx="9" ry="13" transform="rotate(14 66 148)" ${fill(o.outfit === 'labcoat' ? '#fff' : o.outfit === 'rockstar' ? '#2a47d6' : o.outfit === 'f4' ? '#3d9a64' : paw === F.base ? F.base : paw)}/>
    <ellipse cx="134" cy="148" rx="9" ry="13" transform="rotate(-14 134 148)" ${fill(o.outfit === 'labcoat' ? '#fff' : o.outfit === 'rockstar' ? '#2a47d6' : o.outfit === 'f4' ? '#3d9a64' : paw === F.base ? F.base : paw)}/>
    <ellipse cx="80" cy="173" rx="15" ry="8" ${fill(paw)}/><ellipse cx="120" cy="173" rx="15" ry="8" ${fill(paw)}/>`;

  /* head */
  s += `<g transform="translate(0 -10)"><path d="${EAR_L}" ${fill()}/><path d="${EAR_R}" ${fill()}/>
    <path d="M44 56 C40 38 42 30 48 28 C58 28 68 36 76 46Z" fill="#f7b3ca"/><path d="M156 56 C160 38 158 30 152 28 C142 28 132 36 124 46Z" fill="#f7b3ca"/>
    <ellipse cx="100" cy="84" rx="68" ry="50" ${fill()}/>
    <g clip-path="url(#${id}h)">${pat.head}</g>
    <ellipse cx="100" cy="84" rx="68" ry="50" fill="none" stroke="${OL}" stroke-width="${sw}"/>`;

  /* face: small wide-set eyes, tiny yellow nose, soft blush */
  const eye = (x) => `${F.iris ? `<ellipse cx="${x}" cy="90" rx="7" ry="8.6" fill="${F.iris}"/><ellipse cx="${x}" cy="91" rx="4" ry="7" fill="#2d1d36"/>` : `<ellipse cx="${x}" cy="90" rx="5.6" ry="7.2" fill="#2d1d36"/>`}
    <circle cx="${x - 1.8}" cy="86.6" r="2.2" fill="#fff"/>`;
  s += eye(66) + eye(134);
  s += `<ellipse cx="46" cy="102" rx="10" ry="5.6" fill="#ff8fb0" opacity=".5"/><ellipse cx="154" cy="102" rx="10" ry="5.6" fill="#ff8fb0" opacity=".5"/>`;
  s += `<ellipse cx="100" cy="98" rx="6.4" ry="4.4" fill="#f2799c" stroke="#c24a74" stroke-width="1.8"/>`;
  const wk = (o.fur === 'tuxedo' || o.fur === 'black') ? '#d9cce6' : '#b9a8c6';
  s += `<g stroke="${wk}" stroke-width="2.2" stroke-linecap="round"><path d="M32 86 L8 80M31 96 L6 96M32 106 L9 112M168 86 L192 80M169 96 L194 96M168 106 L191 112"/></g>`;

  /* the signature sunflower on her left ear */
  const flower = (x, y, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})">${Array.from({ length: 12 }, (_, i) => `<ellipse cx="0" cy="-13" rx="5.2" ry="9.5" fill="${i % 2 ? '#ffcf2e' : '#ffc21a'}" stroke="#c98a14" stroke-width="1.1" transform="rotate(${i * 30})"/>`).join('')}<circle r="8.5" fill="#8a5a2b" stroke="#5b3a1b" stroke-width="1.4"/><circle r="4" fill="#5b3a1b"/><circle cx="-3" cy="-3" r="1.2" fill="#b07a3e"/><circle cx="3" cy="3" r="1.2" fill="#b07a3e"/></g>`;
  if (P.has('sunflower')) s += flower(57, 44, 0.62);
  s += `</g><g transform="translate(0 -10)">`;

  /* accessories: any combination */
  if (P.has('glasses')) {
    const c = '#1d1a26';
    s += `<g fill="#ffffff" fill-opacity=".18" stroke="${c}" stroke-width="4.6"><rect x="46" y="72" width="40" height="36" rx="14"/><rect x="114" y="72" width="40" height="36" rx="14"/></g><path d="M86 88 Q100 82 114 88" fill="none" stroke="${c}" stroke-width="4.2" stroke-linecap="round"/><path d="M46 84 L34 80M154 84 L166 80" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
  }
  s += `</g>`;
  if (P.has('tooth')) {
    s += `<path d="M78 130 Q100 146 122 130" fill="none" stroke="#a985e0" stroke-width="2.6" stroke-linecap="round"/>
      <g transform="translate(100 142)"><path d="M-8 -7 Q-8 -11 -3 -11 Q0 -9 3 -11 Q8 -11 8 -7 Q8 -1 5 3 Q4 9 2 9 Q0 9 0 4 Q0 9 -2 9 Q-4 9 -5 3 Q-8 -1 -8 -7Z" fill="#fff" stroke="#c98aa8" stroke-width="2" stroke-linejoin="round"/><path d="M-4 -7 Q-5 -4 -4 -2" fill="none" stroke="#cfe0ff" stroke-width="1.6" stroke-linecap="round"/></g>`;
  }
  if (P.has('pompom')) {
    const pom = (x, y, flip) => {
      let r = '', cols = ['#f27ca6', '#ffc2d8', '#fff3a8', '#ffffff'];
      for (let i = 0; i < 18; i++) { const a = i * 20 * Math.PI / 180; r += `<line x1="${x}" y1="${y}" x2="${(x + Math.sin(a) * 20).toFixed(1)}" y2="${(y - Math.cos(a) * 20).toFixed(1)}" stroke="${cols[i % 4]}" stroke-width="6.5" stroke-linecap="round"/>`; }
      return `<line x1="${x}" y1="${y}" x2="${flip ? 142 : 58}" y2="150" stroke="#a985e0" stroke-width="5" stroke-linecap="round"/>${r}<circle cx="${x}" cy="${y}" r="8" fill="#f27ca6"/>`;
    };
    s += pom(24, 122, false) + pom(176, 122, true);
  }
  const slots = [[46, 150], [154, 150], [100, 162]];
  let si = 0;
  const held = {
    card: `<g transform="rotate(-8)"><rect x="-15" y="-22" width="30" height="42" rx="4" fill="#e2445f" stroke="#7a1630" stroke-width="2.6"/><rect x="-11" y="-18" width="22" height="34" rx="2" fill="none" stroke="#ffb3c0" stroke-width="1.4"/><text x="0" y="3" text-anchor="middle" font-family="Quicksand,sans-serif" font-weight="800" font-size="15" fill="#fff">F4</text></g>`,
    basket: `<g><path d="M-18 -4 Q0 -34 18 -4" fill="none" stroke="#7a5230" stroke-width="3.4" stroke-linecap="round"/><circle cx="-6" cy="-6" r="5" fill="#f48fb1"/><circle cx="6" cy="-8" r="5" fill="#ffd257"/><circle cx="0" cy="-10" r="4" fill="#fff"/><path d="M-22 -4 H22 L17 18 Q0 22 -17 18Z" fill="#e3b17a" stroke="#7a5230" stroke-width="2.6" stroke-linejoin="round"/><path d="M-19 4 H19 M-18 11 H18" stroke="#c8935f" stroke-width="2"/></g>`,
    puppy: `<g><ellipse cx="-14" cy="3" rx="6" ry="11" fill="#c98a35" stroke="#6b4420" stroke-width="2.2"/><ellipse cx="14" cy="3" rx="6" ry="11" fill="#c98a35" stroke="#6b4420" stroke-width="2.2"/><ellipse cx="0" cy="2" rx="15" ry="14" fill="#eab85c" stroke="#6b4420" stroke-width="2.4"/><ellipse cx="0" cy="8" rx="8" ry="6" fill="#f7dc9d"/><circle cx="-5.5" cy="-1" r="2" fill="#3b2545"/><circle cx="5.5" cy="-1" r="2" fill="#3b2545"/><ellipse cx="0" cy="5" rx="3" ry="2.2" fill="#3b2545"/><path d="M0 7 V9.5 M0 9.5 Q-3 12 -5 10 M0 9.5 Q3 12 5 10" fill="none" stroke="#3b2545" stroke-width="1.4" stroke-linecap="round"/><path d="M0 -12 V-20" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/></g>`,
  };
  ['card', 'basket', 'puppy'].forEach(k => { if (P.has(k)) { const [x, y] = slots[si++]; s += `<g transform="translate(${x} ${y})">${held[k]}</g>`; } });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-24 -12 248 196" role="img" aria-hidden="true">${s}</svg>`;
}

const FUR_KEYS = new Set(Object.keys(FURS));
function describeMascot(m) {
  const fur = (FURS[m.fur] || FURS.calico).desc, outfit = OUTFITS[m.outfit] && m.outfit !== 'none' ? OUTFITS[m.outfit].desc : '';
  const props = (m.props || []).filter(p => PROPS[p]).map(p => PROPS[p].desc);
  let s = `${m.name} is a little kitten with ${fur}.`;
  if (outfit) s += ` She is dressed in ${outfit}.`;
  if (props.length) s += ` Her extras: ${props.length > 1 ? props.slice(0, -1).join(', ') + ' and ' + props[props.length - 1] : props[0]}.`;
  else s += ' She travels light, with nothing extra.';
  return s;
}
