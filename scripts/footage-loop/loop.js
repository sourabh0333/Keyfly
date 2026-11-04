// The illustrative talking-head loop behind the Product page's "Footage"
// section: a presenter speaking to camera in the site's dusk room (the same
// window, lamp and desk as the CSS-drawn Shot), drawn on a canvas.
//
// Every motion repeats every LOOP seconds (frequencies are whole multiples
// of 1/LOOP), so the recording loops without a seam. The speech has two
// pauses, where the transcript has them: the mouth closes and the head
// settles. ?t=2.5 draws one frame; ?record records the loop (record.mjs).

const LOOP = 8;
const W = 1280;
const H = 720;
const TAU = Math.PI * 2;

const canvas = document.querySelector("canvas");
canvas.width = W;
canvas.height = H;
const ctx = canvas.getContext("2d");

// A wave that repeats `k` times per loop.
const wave = (t, k, phase = 0) => Math.sin(TAU * ((k * t) / LOOP + phase));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (x) => x * x * (3 - 2 * x);

// Speaking, with the transcript's two pauses (s).
const SPEECH = [
  [0, 2.35],
  [3.05, 5.75],
  [6.25, LOOP],
];
// How much the speaker is talking at t, 0 to 1, easing at each edge (and
// running on across the loop's seam, where speech continues).
function talking(t) {
  let v = 0;
  for (const [a, b] of SPEECH) {
    const inA = a === 0 ? 1 : clamp((t - a) / 0.18, 0, 1);
    const outB = b === LOOP ? 1 : clamp((b - t) / 0.18, 0, 1);
    if (t >= a - 0.2 && t <= b + 0.2) v = Math.max(v, ease(Math.min(inA, outB)));
  }
  return v;
}

// The mouth: syllables while talking.
function mouth(t) {
  const syllable = Math.max(0, wave(t, 42, 0.1)) ** 0.7;
  const phrase = 0.55 + 0.45 * Math.max(0, wave(t, 10, 0.3));
  return talking(t) * syllable * phrase;
}

// Blinks (s), each about 0.13 s.
const BLINKS = [1.45, 4.6, 7.15];
function eyesOpen(t) {
  let open = 1;
  for (const b of BLINKS) {
    const d = Math.abs(t - b);
    if (d < 0.07) open = Math.min(open, d / 0.07);
  }
  return Math.max(0.08, open);
}

// A hand gesture while making the main point (3.3 s to 5.5 s).
function gesture(t) {
  const up = clamp((t - 3.3) / 0.45, 0, 1);
  const down = clamp((5.5 - t) / 0.5, 0, 1);
  return ease(Math.min(up, down));
}

// A seeded random, so every frame draws the same city.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rand = seeded(7);
const SKYLINE = [];
for (let x = -20; x < W + 40; ) {
  const w = 40 + rand() * 70;
  const h = 40 + rand() * 120;
  const lights = [];
  for (let n = 0; n < 6; n++) lights.push({ x: 6 + rand() * (w - 16), y: 8 + rand() * (h - 16), k: 1 + Math.floor(rand() * 4), p: rand() });
  SKYLINE.push({ x, w, h, lights });
  x += w + 4 + rand() * 10;
}

function frame(time) {
  const t = ((time % LOOP) + LOOP) % LOOP;
  const talk = talking(t);

  // A slow, small handheld drift.
  const camX = wave(t, 1) * 3 + wave(t, 3, 0.2) * 1.2;
  const camY = wave(t, 1, 0.25) * 2 + wave(t, 2, 0.6) * 1;
  ctx.save();
  ctx.translate(W / 2 + camX, H / 2 + camY);
  ctx.scale(1.02, 1.02);
  ctx.translate(-W / 2, -H / 2);

  room(t);
  presenter(t, talk);

  ctx.restore();

  // A soft vignette, as from a real lens.
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(5,4,8,0.55)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

const FLOOR = H * 0.78;

function room(t) {
  // The sky through the window, dusk as in the site's Shot.
  const sky = ctx.createLinearGradient(0, 0, 0, FLOOR);
  sky.addColorStop(0, "#2b2f5c");
  sky.addColorStop(0.55, "#6b4c7c");
  sky.addColorStop(1, "#d7896a");
  ctx.fillStyle = sky;
  ctx.fillRect(-20, -20, W + 40, FLOOR + 20);

  // The low sun's glow.
  const sun = ctx.createRadialGradient(W * 0.72, FLOOR * 0.98, 10, W * 0.72, FLOOR * 0.98, W * 0.45);
  sun.addColorStop(0, "rgba(255,190,140,0.55)");
  sun.addColorStop(1, "rgba(255,170,120,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(-20, -20, W + 40, FLOOR + 20);

  // The city, with a few windows lighting and dimming.
  for (const b of SKYLINE) {
    const top = FLOOR - b.h;
    ctx.fillStyle = "#2a1d2c";
    ctx.fillRect(b.x, top, b.w, b.h);
    for (const l of b.lights) {
      const a = 0.35 + 0.35 * (0.5 + 0.5 * wave(t, l.k, l.p));
      ctx.fillStyle = `rgba(255,214,160,${a.toFixed(3)})`;
      ctx.fillRect(b.x + l.x, top + l.y, 4, 5);
    }
  }

  // The window's frame: three mullions and a transom.
  ctx.fillStyle = "#141018";
  for (const f of [0.25, 0.5, 0.75]) ctx.fillRect(W * f - 8, -20, 16, FLOOR + 20);
  ctx.fillRect(-20, FLOOR * 0.38 - 7, W + 40, 14);

  // The floor.
  const floor = ctx.createLinearGradient(0, FLOOR, 0, H);
  floor.addColorStop(0, "#2a1d24");
  floor.addColorStop(1, "#141015");
  ctx.fillStyle = floor;
  ctx.fillRect(-20, FLOOR, W + 40, H - FLOOR + 20);
  ctx.fillStyle = "rgba(255,200,160,0.22)";
  ctx.fillRect(-20, FLOOR, W + 40, 4);

  // The lamp, its light flickering a little.
  const flicker = 1 + wave(t, 6, 0.1) * 0.03 + wave(t, 13, 0.4) * 0.02;
  const lx = W * 0.09;
  const glow = ctx.createRadialGradient(lx, FLOOR * 0.66, 4, lx, FLOOR * 0.66, 190 * flicker);
  glow.addColorStop(0, "rgba(243,201,143,0.55)");
  glow.addColorStop(1, "rgba(243,201,143,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(lx - 220, FLOOR * 0.66 - 220, 440, 440);
  ctx.fillStyle = "#1c1620";
  ctx.fillRect(lx - 5, FLOOR * 0.66, 10, FLOOR * 0.34);
  ctx.fillStyle = "#f3c98f";
  roundRect(lx - 44, FLOOR * 0.6, 88, 46, [28, 28, 6, 6]);
  ctx.fill();

  // The desk, and a laptop with a mint-lit screen.
  const dx = W * 0.76;
  ctx.fillStyle = "#231a22";
  roundRect(dx, FLOOR - 84, W * 0.2, 84, [8, 8, 0, 0]);
  ctx.fill();
  ctx.fillStyle = "#151218";
  ctx.beginPath();
  ctx.moveTo(dx + 40, FLOOR - 84);
  ctx.lineTo(dx + 62, FLOOR - 150);
  ctx.lineTo(dx + 170, FLOOR - 150);
  ctx.lineTo(dx + 150, FLOOR - 84);
  ctx.closePath();
  ctx.fill();
  const screen = ctx.createRadialGradient(dx + 110, FLOOR - 118, 2, dx + 110, FLOOR - 118, 140);
  screen.addColorStop(0, "rgba(95,224,176,0.32)");
  screen.addColorStop(1, "rgba(95,224,176,0)");
  ctx.fillStyle = screen;
  ctx.fillRect(dx - 40, FLOOR - 260, 300, 260);
}

function presenter(t, talk) {
  const cx = W * 0.6;
  // Breathing, a nod with the speech, and a slight tilt.
  const breathe = wave(t, 2, 0.1) * 2.5;
  const nod = talk * (wave(t, 16, 0.2) * 3.2 + wave(t, 5, 0.5) * 2);
  const tilt = wave(t, 3, 0.3) * 0.035 + talk * wave(t, 7, 0.1) * 0.02;
  const lean = wave(t, 1, 0.4) * 4;

  // Shoulders and torso: a sweater, rim-lit by the window behind.
  const top = H * 0.565 + breathe;
  const torso = ctx.createLinearGradient(cx - 260, 0, cx + 260, 0);
  torso.addColorStop(0, "#272138");
  torso.addColorStop(0.6, "#4a3f6e");
  torso.addColorStop(1, "#ff9f78");
  ctx.fillStyle = torso;
  ctx.beginPath();
  ctx.moveTo(cx - 265 + lean, H + 30);
  ctx.bezierCurveTo(cx - 262 + lean, top + 120, cx - 230 + lean, top + 34, cx - 150 + lean, top + 18);
  ctx.bezierCurveTo(cx - 100 + lean, top + 8, cx - 70 + lean, top, cx - 46 + lean, top - 4);
  ctx.lineTo(cx + 46 + lean, top - 4);
  ctx.bezierCurveTo(cx + 70 + lean, top, cx + 100 + lean, top + 8, cx + 150 + lean, top + 18);
  ctx.bezierCurveTo(cx + 230 + lean, top + 34, cx + 262 + lean, top + 120, cx + 265 + lean, H + 30);
  ctx.closePath();
  ctx.fill();

  // The neck, under the head (drawn before the collar so the collar sits on it).
  const hx = cx + lean * 0.6;
  const hy = H * 0.4 + breathe * 0.6 + nod;
  const neck = ctx.createLinearGradient(hx - 30, 0, hx + 30, 0);
  neck.addColorStop(0, "#6a4448");
  neck.addColorStop(1, "#e7a98a");
  ctx.fillStyle = neck;
  roundRect(hx - 30, hy + 50, 60, top - hy - 36, 16);
  ctx.fill();

  // The collar, and a lapel mic.
  ctx.fillStyle = "#1f1a30";
  ctx.beginPath();
  ctx.moveTo(cx - 50 + lean, top - 4);
  ctx.quadraticCurveTo(cx + lean, top + 40, cx + 50 + lean, top - 4);
  ctx.quadraticCurveTo(cx + lean, top + 14, cx - 50 + lean, top - 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#0e0c12";
  roundRect(cx - 92 + lean, top + 62, 12, 22, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(14,12,18,0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 86 + lean, top + 84);
  ctx.quadraticCurveTo(cx - 96 + lean, top + 160, cx - 120 + lean, H + 20);
  ctx.stroke();

  // The hand, raised while making the main point: an arm in the sweater's
  // sleeve from below the frame, the hand open at chest height.
  const g = gesture(t);
  if (g > 0.01) {
    const sway = wave(t, 24, 0.2) * 7 * g;
    const handX = cx - 205 + lean + sway;
    const handY = H + 70 - g * 230;
    ctx.lineCap = "round";
    // The sleeve: a dark edge, then the sleeve, a touch lighter than the
    // sweater so the arm reads in front of it, then a cuff.
    for (const [colour, width] of [["#17131f", 64], ["#3e345f", 54]]) {
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(cx - 250 + lean, H + 90);
      ctx.quadraticCurveTo(handX - 40, handY + 110, handX, handY + 44);
      ctx.stroke();
    }
    ctx.strokeStyle = "#2a2340";
    ctx.lineWidth = 50;
    ctx.beginPath();
    ctx.moveTo(handX - 3, handY + 52);
    ctx.lineTo(handX, handY + 44);
    ctx.stroke();
    const skin = ctx.createLinearGradient(handX - 30, 0, handX + 40, 0);
    skin.addColorStop(0, "#9a6660");
    skin.addColorStop(1, "#ffcfa8");
    ctx.fillStyle = skin;
    ctx.save();
    ctx.translate(handX + 4, handY);
    ctx.rotate(-0.18 + wave(t, 24, 0.2) * 0.1 * g);
    // Palm, four fingers and a thumb.
    roundRect(-24, -6, 50, 44, 16);
    ctx.fill();
    for (const [fx, fh] of [[-22, 40], [-9, 48], [4, 46], [17, 38]]) {
      roundRect(fx, -fh + 6, 11, fh, 6);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.ellipse(32, 18, 9, 17, -0.6, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(tilt);

  // The head: skin lit warm from the window, cooler on the room side.
  const head = ctx.createRadialGradient(28, -18, 10, 0, 0, 110);
  head.addColorStop(0, "#ffd3b0");
  head.addColorStop(0.55, "#d79478");
  head.addColorStop(1, "#5a3c48");
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.ellipse(0, 0, 66, 82, 0, 0, TAU);
  ctx.fill();

  // An ear.
  ctx.fillStyle = "#b8786a";
  ctx.beginPath();
  ctx.ellipse(-64, 6, 11, 18, 0.1, 0, TAU);
  ctx.fill();

  // Hair.
  ctx.fillStyle = "#24161d";
  ctx.beginPath();
  ctx.moveTo(-70, 10);
  ctx.bezierCurveTo(-80, -70, -30, -100, 14, -92);
  ctx.bezierCurveTo(56, -86, 76, -54, 70, -14);
  ctx.bezierCurveTo(54, -44, 20, -56, -18, -48);
  ctx.bezierCurveTo(-44, -42, -56, -18, -58, 14);
  ctx.closePath();
  ctx.fill();
  // The window's rim light along the hair.
  ctx.strokeStyle = "rgba(255,170,130,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(24, -91);
  ctx.bezierCurveTo(58, -84, 76, -54, 70, -16);
  ctx.stroke();

  // Eyebrows, lifting a little on the stressed words.
  const lift = talk * Math.max(0, wave(t, 10, 0.3)) * 3;
  ctx.strokeStyle = "#2a1a22";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (const ex of [-24, 22]) {
    ctx.beginPath();
    ctx.moveTo(ex - 13, -26 - lift);
    ctx.quadraticCurveTo(ex, -31 - lift, ex + 13, -26 - lift);
    ctx.stroke();
  }

  // Eyes, blinking.
  const open = eyesOpen(t);
  ctx.fillStyle = "#1f141a";
  for (const ex of [-24, 22]) {
    ctx.beginPath();
    ctx.ellipse(ex, -8, 6.5, 7.5 * open, 0, 0, TAU);
    ctx.fill();
  }

  // A hint of a nose.
  ctx.strokeStyle = "rgba(120,70,70,0.6)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(4, 2);
  ctx.quadraticCurveTo(10, 20, 0, 26);
  ctx.stroke();

  // The mouth: closed in the pauses, moving with the syllables.
  const m = mouth(t);
  ctx.fillStyle = "#5e2630";
  ctx.beginPath();
  ctx.ellipse(-1, 46, 15 + m * 3, 2.2 + m * 10, 0, 0, TAU);
  ctx.fill();
  if (m > 0.25) {
    ctx.fillStyle = "rgba(255,240,235,0.85)";
    ctx.fillRect(-10, 44 - m * 8, 20, 3);
  }

  ctx.restore();
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

const params = new URLSearchParams(location.search);

if (params.has("record")) {
  // The poster: the first frame.
  frame(0);
  const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.86));
  await fetch("/poster", { method: "POST", body: poster });

  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/mp4;codecs=avc1.640028",
    videoBitsPerSecond: 1_400_000,
  });
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    await fetch("/save", { method: "POST", body: blob });
    window.__done = blob.size;
  };
  const start = performance.now();
  recorder.start(1000);
  const tick = () => {
    const t = (performance.now() - start) / 1000;
    frame(Math.min(t, LOOP - 0.001));
    if (t < LOOP) setTimeout(tick, 1000 / 60);
    else recorder.stop();
  };
  tick();
} else {
  frame(Number(params.get("t") || 0));
  window.__frame = frame;
  window.__done = "frame";
}
