import { VOICE } from "./data/site";

/* Every effect is generated in the browser with Web Audio, so there are no
   sound files to load. Voice clips are the exception: see VOICE in site.js. */

let ctx = null;
let master = null;
let enabled = true;
let awake = false; // true once the visitor has clicked or tapped
const last = {};

try {
  enabled = localStorage.getItem("sound2") !== "off";
} catch (e) {
  enabled = true;
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.6;
    // a limiter, so stacked sounds get loud without crackling
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -10;
    limit.ratio.value = 8;
    limit.attack.value = 0.002;
    limit.release.value = 0.12;
    master.connect(limit).connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noiseBuffer(c, seconds) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/* One short burst of filtered noise. */
function grain(c, at, { dur, freq, q = 1.2, type = "bandpass", gain }) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, dur + 0.02);
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(gain, at + dur * 0.2);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(f).connect(g).connect(master);
  src.start(at);
  src.stop(at + dur + 0.02);
}

function tone(c, at, { type = "sine", from, to, dur, gain }) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(from, at);
  if (to) o.frequency.exponentialRampToValueAtTime(to, at + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.connect(g).connect(master);
  o.start(at);
  o.stop(at + dur + 0.02);
}

const fx = {
  /* thin plastic bag: a scatter of tiny bright crackles */
  crinkle(c, t, amount = 1) {
    const n = Math.round(16 * amount);
    for (let i = 0; i < n; i++) {
      grain(c, t + Math.random() * 0.42 * amount, {
        dur: 0.008 + Math.random() * 0.022,
        freq: 2600 + Math.random() * 5200,
        q: 0.8 + Math.random() * 3,
        type: "highpass",
        gain: (0.3 + Math.random() * 0.6) * amount,
      });
    }
  },
  rustle(c, t) {
    fx.crinkle(c, t, 0.45);
  },
  /* styrofoam: a rubbing squeak, then the soft pop of the lid */
  squeak(c, t) {
    const o = c.createOscillator();
    o.type = "triangle";
    const g = c.createGain();
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1900;
    f.Q.value = 3;
    let at = t;
    o.frequency.setValueAtTime(1050, at);
    for (let i = 0; i < 7; i++) {
      at += 0.035;
      o.frequency.linearRampToValueAtTime(1100 + Math.random() * 1100, at);
    }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(f).connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.32);
    grain(c, t, { dur: 0.26, freq: 3200, q: 2, gain: 0.3 });
    tone(c, t + 0.27, { from: 210, to: 90, dur: 0.12, gain: 0.8 });
  },
  /* spoon on a steel tray */
  tap(c, t) {
    [1930, 3170, 4760].forEach((f, i) =>
      tone(c, t, { from: f, dur: 0.3 - i * 0.06, gain: 0.4 - i * 0.1 }),
    );
    grain(c, t, { dur: 0.014, freq: 5000, type: "highpass", gain: 0.6 });
  },
  /* rubber band */
  snap(c, t) {
    grain(c, t, { dur: 0.035, freq: 1800, type: "highpass", gain: 0.9 });
    tone(c, t, { type: "triangle", from: 320, to: 110, dur: 0.11, gain: 0.8 });
  },
  whoosh(c, t) {
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 0.75);
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 0.9;
    f.frequency.setValueAtTime(260, t);
    f.frequency.exponentialRampToValueAtTime(1500, t + 0.3);
    f.frequency.exponentialRampToValueAtTime(380, t + 0.7);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    src.connect(f).connect(g).connect(master);
    src.start(t);
    src.stop(t + 0.75);
  },
  /* curry: a thick liquid pouring and settling */
  pour(c, t) {
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c, 1.4);
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.6;
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(420, t + 1.2);
    const wob = c.createOscillator();
    const wobAmt = c.createGain();
    wob.frequency.value = 13;
    wobAmt.gain.value = 260;
    wob.connect(wobAmt).connect(f.frequency);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.75, t + 0.15);
    g.gain.setValueAtTime(0.75, t + 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.35);
    src.connect(f).connect(g).connect(master);
    src.start(t);
    src.stop(t + 1.4);
    wob.start(t);
    wob.stop(t + 1.4);
    for (let i = 0; i < 9; i++) {
      const at = t + 0.1 + Math.random() * 1.1;
      tone(c, at, { from: 260 + Math.random() * 380, to: 140 + Math.random() * 120, dur: 0.07, gain: 0.3 });
    }
  },
  /* sambal: one wet dollop */
  plop(c, t) {
    tone(c, t, { from: 380, to: 110, dur: 0.14, gain: 0.8 });
    grain(c, t + 0.02, { dur: 0.09, freq: 700, q: 1.2, gain: 0.5 });
    tone(c, t + 0.12, { from: 240, to: 150, dur: 0.07, gain: 0.3 });
  },
  /* stand-in for a voice clip that has not been recorded yet */
  chime(c, t, notes) {
    notes.forEach((f, i) => tone(c, t + i * 0.11, { type: "triangle", from: f, dur: 0.28, gain: 0.45 }));
  },
};

const CHIMES = { xiaomei: [660, 880, 990], zhege: [740, 620], nage: [620, 740] };
const COOLDOWN = { pour: 1400, plop: 300, crinkle: 500, rustle: 2500, tap: 120, squeak: 400, snap: 400, whoosh: 300 };

function allowed(name) {
  const now = performance.now();
  if (now - (last[name] || 0) < (COOLDOWN[name] || 0)) return false;
  last[name] = now;
  return true;
}

/* Recorded clips, supplied by Xing Ying (copied from design/sound). They play
   through plain audio elements, which is the most dependable route. */
const FILES = {
  bag: "/audio/plastic-bag.mp3",
  box: "/audio/styrofoam-box.mp3",
  curry: "/audio/curry.mp3",
};
const RECORDED = {
  crinkle: { file: "bag", volume: 1, max: 1.6 },
  rustle: { file: "bag", volume: 0.3, max: 0.9 },
  squeak: { file: "box", volume: 1 },
  pour: { file: "curry", volume: 1 },
};
const clips = {};

function clip(name) {
  if (!clips[name]) {
    const a = new Audio(process.env.PUBLIC_URL + FILES[name]);
    a.preload = "auto";
    clips[name] = a;
  }
  return clips[name];
}

function playClip({ file, volume, max }) {
  const a = clip(file);
  clearTimeout(a.stopTimer);
  clearInterval(a.fadeTimer);
  a.pause();
  try {
    a.currentTime = 0;
  } catch (e) {
    /* not loaded yet: it will simply start from the beginning */
  }
  a.volume = volume;
  a.play().catch(() => {});
  // long recordings are cut short with a quick fade
  if (max)
    a.stopTimer = setTimeout(() => {
      a.fadeTimer = setInterval(() => {
        if (a.volume > 0.08) a.volume = Math.max(0, a.volume - 0.08);
        else {
          clearInterval(a.fadeTimer);
          a.pause();
        }
      }, 30);
    }, max * 1000);
}

export function play(name) {
  if (RECORDED[name]) {
    if (enabled && awake && allowed(name)) playClip(RECORDED[name]);
    return;
  }
  if (!enabled || !awake || !fx[name] || !allowed(name)) return;
  const c = audio();
  if (c) fx[name](c, c.currentTime + 0.01);
}

/* Plays a recorded clip when one is set in VOICE, otherwise its chime. */
export function say(phrase) {
  if (!enabled || !awake) return;
  const src = VOICE[phrase];
  if (src) {
    const a = new Audio(process.env.PUBLIC_URL + src);
    a.volume = 0.8;
    a.play().catch(() => {});
    return;
  }
  const c = audio();
  if (c) fx.chime(c, c.currentTime + 0.01, CHIMES[phrase] || [700]);
}

export const soundOn = () => enabled;

/* Browsers only allow sound after a click or tap, so the first one anywhere
   wakes the audio and plays the greeting. */
if (typeof window !== "undefined") {
  const wake = () => {
    window.removeEventListener("pointerdown", wake, true);
    window.removeEventListener("keydown", wake, true);
    awake = true;
    Object.keys(FILES).forEach(clip); // start loading the recordings
    if (!enabled) return;
    audio();
    say("xiaomei");
  };
  window.addEventListener("pointerdown", wake, true);
  window.addEventListener("keydown", wake, true);
}

export function setSound(on) {
  enabled = on;
  try {
    localStorage.setItem("sound2", on ? "on" : "off");
  } catch (e) {
    /* not remembered, still works for this visit */
  }
  if (on) audio();
}
