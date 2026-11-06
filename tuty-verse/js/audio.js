'use strict';
/* =====================================================================
   Sound: a soft music-box loop plus cute UI sounds, all synthesised
   with WebAudio (no files to host). Browsers only allow audio after the
   first tap, so everything starts on the first user gesture.
   ===================================================================== */
const SFX = (() => {
  const S = { music: true, sfx: true, vol: 0.6 };
  let unlocked = false, ctx = null, master, mg, sg, timer = null, nextT = 0, bar = 0;
  const BPM = 84, BEAT = 60 / BPM;

  const nf = n => { const m = /^([A-G])(#?)(\d)$/.exec(n); const idx = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[m[1]] + (m[2] ? 1 : 0) + (+m[3] - 4) * 12; return 440 * Math.pow(2, idx / 12); };
  const CH = { C: ['C4', 'E4', 'G4'], Am: ['A3', 'C4', 'E4'], F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'], Em: ['E3', 'G3', 'B3'] };
  const ROOT = { C: 'C3', Am: 'A2', F: 'F2', G: 'G2', Em: 'E2' };
  const SONG = [
    ['C', [[0, 'E5', 1], [1, 'G5', 1], [2, 'E5', .5], [2.5, 'D5', .5], [3, 'C5', 1]]],
    ['Am', [[0, 'C5', 1], [1, 'E5', 1.5], [2.5, 'D5', .5], [3, 'C5', 1]]],
    ['F', [[0, 'A5', 1], [1, 'G5', 1], [2, 'F5', 1], [3, 'E5', 1]]],
    ['G', [[0, 'D5', 2], [2, 'B4', 1], [3, 'D5', 1]]],
    ['C', [[0, 'G5', 1], [1, 'E5', 1], [2, 'C5', 2]]],
    ['Em', [[0, 'B4', 1], [1, 'E5', 1], [2, 'G5', 2]]],
    ['F', [[0, 'A5', 1], [1, 'C6', 1], [2, 'A5', 1], [3, 'G5', 1]]],
    ['G', [[0, 'D5', 1], [1, 'F5', 1], [2, 'E5', 2]]],
  ];

  function ensure() {
    if (!unlocked) return null;
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.connect(ctx.destination);
        mg = ctx.createGain(); sg = ctx.createGain(); mg.connect(master); sg.connect(master);
        apply();
      } catch (e) { ctx = null; return null; }
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => { });
    return ctx;
  }
  function apply() {
    if (!ctx) return;
    mg.gain.setTargetAtTime(S.music ? S.vol * 0.5 : 0, ctx.currentTime, 0.1);
    sg.gain.setTargetAtTime(S.sfx ? 1 : 0, ctx.currentTime, 0.02);
  }
  function tone(f, t, d, o = {}) {
    const { type = 'sine', vol = 0.08, dest = sg, att = 0.005 } = o;
    const os = ctx.createOscillator(), g = ctx.createGain();
    os.type = type; os.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + att); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    os.connect(g); g.connect(dest); os.start(t); os.stop(t + d + 0.05);
  }
  function bell(f, t, d, vol) { tone(f, t, d, { vol, dest: mg }); tone(f * 2, t, d * 0.4, { vol: vol * 0.25, dest: mg }); }

  function playBar(i, t) {
    const [ch, mel] = SONG[i % SONG.length], tones = CH[ch].map(nf), up = tones[0] * 2;
    const pat = [tones[0], tones[1], tones[2], up, tones[2], tones[1], tones[2], tones[1]];
    pat.forEach((f, k) => tone(f, t + k * BEAT / 2, 0.55, { type: 'triangle', vol: 0.05, dest: mg }));
    tone(nf(ROOT[ch]), t, BEAT * 2.2, { vol: 0.09, dest: mg });
    tone(nf(ROOT[ch]), t + BEAT * 2, BEAT * 1.8, { vol: 0.06, dest: mg });
    tones.forEach(f => tone(f, t, BEAT * 4, { type: 'triangle', vol: 0.012, dest: mg, att: 0.4 }));
    mel.forEach(([b, n, d]) => bell(nf(n), t + b * BEAT, d * BEAT * 1.6 + 0.3, 0.08));
    if (Math.random() < 0.5) bell(nf(['C6', 'E6', 'G6', 'D6'][Math.floor(Math.random() * 4)]), t + BEAT * (1 + Math.floor(Math.random() * 3)) + BEAT / 2, 0.9, 0.025);
  }
  function pump() {
    if (!ctx || document.hidden) return;
    while (nextT < ctx.currentTime + 1.4) { playBar(bar++, nextT); nextT += BEAT * 4; }
  }
  function startMusic() {
    if (!S.music || timer || !ensure()) return;
    nextT = ctx.currentTime + 0.15; pump(); timer = setInterval(pump, 400);
  }
  function stopMusic() { if (timer) { clearInterval(timer); timer = null; } }

  const api = {
    S,
    unlock() { unlocked = true; if (ensure()) { apply(); if (S.music) startMusic(); } },
    click() { if (!S.sfx || !ensure()) return; const t = ctx.currentTime; tone(660, t, 0.08, { type: 'square', vol: 0.03 }); tone(990, t + 0.045, 0.12, { type: 'triangle', vol: 0.05 }); },
    chime(fs = [660, 880], d = 0.1) { if (!S.sfx || !ensure()) return; const t = ctx.currentTime; fs.forEach((f, j) => tone(f, t + j * d * 0.8, d * 2.4, { type: 'triangle', vol: 0.07 })); },
    set(o) {
      Object.assign(S, o);
      if (!ctx) { if (S.music && o.music !== undefined) { /* will start on first gesture */ } return; }
      apply(); if (S.music) startMusic(); else stopMusic();
    },
  };
  document.addEventListener('visibilitychange', () => { if (!ctx) return; if (document.hidden) ctx.suspend().catch(() => { }); else { ctx.resume().catch(() => { }); nextT = Math.max(nextT, ctx.currentTime + 0.1); } });
  const first = () => { api.unlock(); document.removeEventListener('pointerdown', first, true); document.removeEventListener('keydown', first, true); };
  document.addEventListener('pointerdown', first, true); document.addEventListener('keydown', first, true);
  return api;
})();
