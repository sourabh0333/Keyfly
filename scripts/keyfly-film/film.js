// An illustrative KeyFly film, drawn on a 1280×720 canvas as a function of
// time, so any frame can be drawn on its own. ?t=12.3 draws one frame (for
// checking); ?record records it, with its voice-over (voice/*.wav, made by
// voice.ps1) and a soft synthesised music bed, to MP4 and posts it to /save.

const W = 1280;
const H = 720;
const DURATION = 30;
const MINT = "#5FE0B0";
const MINT_TEXT = "#82E8C2";
const PAPER = "#F4F1EA";
const NIGHT = "#0B0B0D";
const VOICE_AT = 0.3; // each line starts this long into its scene

// The scenes as the film plays them, each long enough for its voice-over
// line (voice/0N.wav) and the caption that shows it. `drawn` is the stretch
// of time each scene's drawing was written for; it is stretched to fit.
export const SCENES = [
  { name: "Describe", start: 0, end: 3.4, drawn: [0, 3.0], caption: "Describe the video you want." },
  { name: "Prompt", start: 3.4, end: 7.2, drawn: [3.0, 6.5], caption: "One sentence is enough to start." },
  { name: "Storyboard", start: 7.2, end: 11.6, drawn: [6.5, 10.0], caption: "KeyFly writes the storyboard, scene by scene." },
  { name: "Voice-over", start: 11.6, end: 14.5, drawn: [10.0, 13.0], caption: "It records the voice-over," },
  { name: "Motion graphics", start: 14.5, end: 17.8, drawn: [13.0, 16.5], caption: "and builds the motion graphics." },
  { name: "Timeline", start: 17.8, end: 21.4, drawn: [16.5, 20.0], caption: "Everything lands on a real timeline." },
  { name: "Edit anything", start: 21.4, end: 25.6, drawn: [20.0, 22.5], caption: "Then change anything, just by asking." },
  { name: "End card", start: 25.6, end: 30.0, drawn: [22.5, 25.0], caption: null },
];

// Each line's length in seconds (filled in from the WAV files when they load).
const voiceLength = SCENES.map(() => 2.5);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = W;
canvas.height = H;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const mix = (a, b, x) => a + (b - a) * x;

function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function text(str, x, y, { size = 32, weight = 500, family = "Inter", color = PAPER, align = "left", alpha = 1, spacing = 0, italic = false } = {}) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${family}`;
  ctx.letterSpacing = `${spacing}px`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(str, x, y);
  ctx.restore();
}

function mono(str, x, y, opts = {}) {
  text(str, x, y, { family: "ui-monospace, Consolas, monospace", size: 15, weight: 500, spacing: 2, ...opts });
}

// ---------- Backdrop: night, a slow mint glow, fine grain ----------

const grain = document.createElement("canvas");
grain.width = 256;
grain.height = 256;
{
  const g = grain.getContext("2d");
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
}

function backdrop(t) {
  ctx.fillStyle = NIGHT;
  ctx.fillRect(0, 0, W, H);
  const gx = W * (0.5 + 0.18 * Math.sin(t * 0.25));
  const glow = ctx.createRadialGradient(gx, H * 0.38, 0, gx, H * 0.38, W * 0.55);
  glow.addColorStop(0, "rgba(95,224,176,0.10)");
  glow.addColorStop(0.5, "rgba(120,110,230,0.05)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = 0.035;
  const pattern = ctx.createPattern(grain, "repeat");
  ctx.translate((t * 997) % 256, (t * 613) % 256);
  ctx.fillStyle = pattern;
  ctx.fillRect(-256, -256, W + 512, H + 512);
  ctx.restore();
}

// ---------- Captions, revealed word by word ----------

// The caption shows while its line is spoken, its words lighting as they're said.
function caption(t) {
  const i = SCENES.findIndex((x) => t >= x.start && t < x.end);
  const s = SCENES[i];
  if (!s || !s.caption) return;
  const a = s.start + VOICE_AT;
  const b = Math.min(s.end - 0.15, a + voiceLength[i] + 0.2);
  const alpha = Math.min(prog(t, a - 0.1, a + 0.15), 1 - prog(t, b - 0.2, b));
  if (alpha <= 0) return;
  const words = s.caption.split(" ");
  const shown = Math.ceil(words.length * prog(t, a, a + voiceLength[i] * 0.85));
  ctx.save();
  ctx.font = "500 26px Inter";
  ctx.letterSpacing = "0px";
  const full = ctx.measureText(s.caption).width;
  const x0 = W / 2 - full / 2;
  ctx.globalAlpha = alpha;
  rr(x0 - 20, H - 92, full + 40, 50, 12);
  ctx.fillStyle = "rgba(11,11,13,0.78)";
  ctx.fill();
  let x = x0;
  words.forEach((w, i) => {
    const on = i < shown;
    ctx.fillStyle = on ? PAPER : "rgba(244,241,234,0.28)";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(w, x, H - 58);
    x += ctx.measureText(w + " ").width;
  });
  ctx.restore();
}

// ---------- Scenes ----------

function sceneAlpha(t, s, i) {
  const fadeIn = i === 0 ? 1 : prog(t, s.start, s.start + 0.35);
  const fadeOut = i === SCENES.length - 1 ? 1 : 1 - prog(t, s.end - 0.3, s.end);
  return Math.min(fadeIn, fadeOut);
}

// 1. "Describe a video."
function describe(t) {
  const a = easeOut(prog(t, 0.25, 0.9));
  const b = easeOut(prog(t, 0.8, 1.5));
  // Measure both words so the phrase sits centred as a whole.
  ctx.font = "600 92px Inter";
  ctx.letterSpacing = "-3px";
  const w1 = ctx.measureText("Describe").width;
  ctx.font = "italic 400 100px Instrument Serif";
  ctx.letterSpacing = "0px";
  const w2 = ctx.measureText("a video.").width;
  const x0 = W / 2 - (w1 + 24 + w2) / 2;
  text("Describe", x0, 380 + (1 - a) * 24, { size: 92, weight: 600, spacing: -3, alpha: a });
  text("a video.", x0 + w1 + 24, 380 + (1 - b) * 24, { size: 100, weight: 400, family: "Instrument Serif", italic: true, color: MINT_TEXT, alpha: b });
}

// 2. The prompt box: typing, then send.
const PROMPT = "A 30-second launch film for our new app.";
function prompt(t) {
  const x = 260;
  const y = 270;
  const w = 760;
  const h = 150;
  const rise = easeOut(prog(t, 3.0, 3.6));
  ctx.save();
  ctx.translate(0, (1 - rise) * 20);
  rr(x, y, w, h, 22);
  ctx.fillStyle = "rgba(255,255,255,0.045)";
  ctx.fill();
  ctx.strokeStyle = "rgba(244,241,234,0.14)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  // A comet of mint light runs round the edge.
  rr(x, y, w, h, 22);
  ctx.setLineDash([140, 2000]);
  ctx.lineDashOffset = -((t - 3) * 520);
  ctx.strokeStyle = MINT;
  ctx.lineWidth = 2;
  ctx.shadowColor = MINT;
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;

  const typed = Math.floor(PROMPT.length * prog(t, 3.5, 5.3));
  if (typed === 0) text("Describe your video, or drop footage...", x + 28, y + 52, { size: 24, color: "rgba(244,241,234,0.38)" });
  else text(PROMPT.slice(0, typed), x + 28, y + 52, { size: 26, weight: 500 });
  if (typed < PROMPT.length && Math.floor(t * 2.5) % 2 === 0) {
    ctx.font = "500 26px Inter";
    const cw = typed ? ctx.measureText(PROMPT.slice(0, typed)).width : 0;
    ctx.fillStyle = MINT;
    ctx.fillRect(x + 30 + cw, y + 30, 2, 28);
  }
  // Toolbar: +, Auto, and send.
  rr(x + 22, y + h - 56, 36, 36, 18);
  ctx.strokeStyle = "rgba(244,241,234,0.2)";
  ctx.stroke();
  text("+", x + 40, y + h - 31, { size: 22, align: "center", color: "rgba(244,241,234,0.7)" });
  text("Auto ⌄", x + 74, y + h - 32, { size: 17, color: "rgba(244,241,234,0.7)" });
  const ready = prog(t, 5.3, 5.5);
  const press = prog(t, 5.8, 6.2);
  const bx = x + w - 42;
  const by = y + h - 38;
  ctx.beginPath();
  ctx.arc(bx, by, 19 * (1 - 0.12 * Math.sin(press * Math.PI)), 0, Math.PI * 2);
  ctx.fillStyle = ready ? MINT : "rgba(244,241,234,0.12)";
  ctx.fill();
  text("↑", bx, by + 7, { size: 20, weight: 700, align: "center", color: ready ? "#06231A" : "rgba(244,241,234,0.6)" });
  if (press > 0 && press < 1) {
    ctx.beginPath();
    ctx.arc(bx, by, 19 + press * 40, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(95,224,176,${1 - press})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

// 3. The storyboard: five scenes, each with a sketch.
const BOARD = ["Hook", "Problem", "Product", "Feature", "Call to action"];
function sketch(i, x, y, w, h) {
  ctx.save();
  ctx.strokeStyle = "rgba(244,241,234,0.45)";
  ctx.fillStyle = "rgba(244,241,234,0.12)";
  ctx.lineWidth = 2;
  if (i === 0) {
    ctx.fillRect(x + 30, y + 40, w - 60, 12);
    ctx.fillRect(x + 50, y + 62, w - 100, 8);
  } else if (i === 1) {
    for (let k = 0; k < 3; k++) {
      rr(x + 26 + k * 40, y + 30, 32, 46, 6);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x + 24, y + 92);
    ctx.lineTo(x + w - 24, y + 92);
    ctx.stroke();
  } else if (i === 2) {
    rr(x + w / 2 - 22, y + 18, 44, 76, 8);
    ctx.stroke();
    ctx.fillRect(x + w / 2 - 14, y + 30, 28, 18);
  } else if (i === 3) {
    ctx.beginPath();
    ctx.moveTo(x + 24, y + 86);
    [30, 46, 40, 60, 54, 76].forEach((v, k) => ctx.lineTo(x + 24 + (k + 1) * 19, y + 100 - v));
    ctx.stroke();
  } else {
    rr(x + w / 2 - 50, y + 44, 100, 30, 15);
    ctx.fillStyle = "rgba(95,224,176,0.5)";
    ctx.fill();
  }
  ctx.restore();
}
function storyboard(t) {
  mono("STORYBOARD · 5 SCENES", 136, 196, { color: "rgba(244,241,234,0.55)", alpha: prog(t, 6.6, 7.0) });
  const cw = 184;
  const gap = 20;
  const x0 = (W - (cw * 5 + gap * 4)) / 2;
  BOARD.forEach((name, i) => {
    const a = easeOut(prog(t, 6.8 + i * 0.28, 7.3 + i * 0.28));
    if (a <= 0) return;
    const x = x0 + i * (cw + gap);
    const y = 230 + (1 - a) * 30;
    ctx.save();
    ctx.globalAlpha = a;
    rr(x, y, cw, 200, 14);
    ctx.fillStyle = "#141519";
    ctx.fill();
    ctx.strokeStyle = "rgba(244,241,234,0.1)";
    ctx.stroke();
    rr(x + 10, y + 10, cw - 20, 112, 9);
    ctx.fillStyle = "#0E0F12";
    ctx.fill();
    sketch(i, x + 10, y + 10, cw - 20, 112);
    mono(String(i + 1).padStart(2, "0"), x + 14, y + 152, { color: MINT, size: 14 });
    text(name, x + 14, y + 180, { size: 19, weight: 560 });
    const done = prog(t, 7.4 + i * 0.28, 7.6 + i * 0.28);
    if (done > 0) {
      ctx.beginPath();
      ctx.arc(x + cw - 24, y + 172, 11, 0, Math.PI * 2);
      ctx.fillStyle = MINT;
      ctx.globalAlpha = a * done;
      ctx.fill();
      text("✓", x + cw - 24, y + 177, { size: 14, weight: 800, align: "center", color: "#06231A" });
    }
    ctx.restore();
  });
}

// 4. The voice-over: the script lights word by word over a waveform.
const SCRIPT = "Meet the app that keeps every habit on track.".split(" ");
function voice(t) {
  const a = prog(t, 10.0, 10.4);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.arc(W / 2 - 92, 208, 6, 0, Math.PI * 2);
  ctx.fillStyle = Math.floor(t * 2) % 2 ? MINT : "rgba(95,224,176,0.35)";
  ctx.fill();
  mono("REC · VOICE-OVER", W / 2 - 76, 214, { color: "rgba(244,241,234,0.6)" });
  const p = prog(t, 10.3, 12.7);
  ctx.font = "500 38px Inter";
  ctx.letterSpacing = "-0.5px";
  const full = ctx.measureText(SCRIPT.join(" ")).width;
  let x = W / 2 - full / 2;
  SCRIPT.forEach((w, i) => {
    ctx.fillStyle = i < p * SCRIPT.length ? PAPER : "rgba(244,241,234,0.25)";
    ctx.fillText(w, x, 300);
    x += ctx.measureText(w + " ").width;
  });
  const bars = 96;
  const bw = 7;
  const span = bars * (bw + 2);
  const bx = W / 2 - span / 2;
  for (let i = 0; i < bars; i++) {
    const f = i / bars;
    const amp = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.55 + Math.sin(i * 0.17) * 3)) * (0.6 + 0.4 * Math.sin(t * 6 + i));
    const h = 16 + amp * 110;
    ctx.fillStyle = f < p ? MINT : "rgba(95,224,176,0.22)";
    rr(bx + i * (bw + 2), 430 - h / 2, bw, h, 3);
    ctx.fill();
  }
  ctx.fillStyle = PAPER;
  ctx.fillRect(bx + p * span, 350, 2, 160);
  ctx.restore();
}

// 5. Motion graphics: kinetic title, shapes and a lower third.
function graphics(t) {
  const local = t - 13.0;
  ctx.save();
  // Shapes drifting in behind.
  const shapes = [
    [330, 250, 70, MINT],
    [960, 210, 54, "#8B7CF6"],
    [1010, 470, 90, MINT],
    [270, 480, 46, "#F2A86E"],
  ];
  shapes.forEach(([x, y, r, c], i) => {
    const s = easeOut(prog(local, 0.1 + i * 0.12, 0.7 + i * 0.12));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(local * 0.4 * (i % 2 ? -1 : 1));
    ctx.scale(s, s);
    ctx.strokeStyle = c;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    if (i % 2) {
      rr(-r / 2, -r / 2, r, r, r * 0.25);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, r / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  });
  // The title, letter by letter.
  const word = "Launch day";
  ctx.font = "650 110px Inter";
  ctx.letterSpacing = "-4px";
  const full = ctx.measureText(word + ".").width;
  let x = W / 2 - full / 2;
  [...word].forEach((ch, i) => {
    const a = easeOut(prog(local, 0.3 + i * 0.05, 0.75 + i * 0.05));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = PAPER;
    ctx.fillText(ch, x, 400 + (1 - a) * 40);
    ctx.restore();
    x += ctx.measureText(ch).width - 4;
  });
  const dot = easeOut(prog(local, 1.0, 1.3));
  ctx.beginPath();
  ctx.arc(x + 18, 388, 12 * dot, 0, Math.PI * 2);
  ctx.fillStyle = MINT;
  ctx.fill();
  // The underline draws.
  const line = easeInOut(prog(local, 1.1, 1.7));
  ctx.fillStyle = MINT;
  ctx.fillRect(W / 2 - full / 2, 428, full * line, 4);
  // A lower third slides in.
  const lt = easeOut(prog(local, 1.6, 2.1));
  ctx.globalAlpha = lt;
  rr(140 - (1 - lt) * 60, 520, 190, 64, 12);
  ctx.fillStyle = "rgba(20,21,25,0.92)";
  ctx.fill();
  ctx.fillStyle = MINT;
  ctx.fillRect(140 - (1 - lt) * 60, 520, 5, 64);
  text("Your app", 162 - (1 - lt) * 60, 548, { size: 20, weight: 600 });
  mono("NOW LIVE", 162 - (1 - lt) * 60, 571, { size: 13, color: MINT_TEXT });
  ctx.restore();
}

// 6. The timeline: clips land on four tracks and a playhead plays them.
const TRACKS = [
  { label: "T1  Titles", color: "rgba(95,224,176,0.55)", clips: [[0, 0.18], [0.42, 0.6], [0.82, 1]] },
  { label: "V1  Video", color: "rgba(139,124,246,0.55)", clips: [[0, 0.24], [0.24, 0.5], [0.5, 0.74], [0.74, 1]] },
  { label: "A1  Voice", color: "rgba(95,224,176,0.32)", clips: [[0.02, 0.46], [0.5, 0.96]], wave: true },
  { label: "A2  Music", color: "rgba(242,168,110,0.35)", clips: [[0, 1]], wave: true },
];
function timeline(t) {
  const local = t - 16.5;
  const x = 150;
  const y = 190;
  const w = 980;
  const lx = x + 120;
  const lw = w - 140;
  ctx.save();
  rr(x, y, w, 300, 18);
  ctx.fillStyle = "#121316";
  ctx.fill();
  ctx.strokeStyle = "rgba(244,241,234,0.1)";
  ctx.stroke();
  mono("TIMELINE · LAUNCH FILM", x + 22, y + 34, { color: "rgba(244,241,234,0.55)", size: 13 });
  for (let i = 0; i <= 30; i++) {
    ctx.fillStyle = "rgba(244,241,234,0.22)";
    ctx.fillRect(lx + (lw * i) / 30, y + 56, 1, i % 5 ? 6 : 12);
  }
  TRACKS.forEach((tr, r) => {
    const ty = y + 82 + r * 52;
    text(tr.label, x + 22, ty + 26, { size: 15, color: "rgba(244,241,234,0.62)", family: "ui-monospace, Consolas, monospace" });
    rr(lx, ty, lw, 40, 8);
    ctx.fillStyle = "rgba(244,241,234,0.03)";
    ctx.fill();
    tr.clips.forEach(([a, b], k) => {
      const d = easeOut(prog(local, 0.15 + r * 0.18 + k * 0.08, 0.55 + r * 0.18 + k * 0.08));
      if (d <= 0) return;
      ctx.save();
      ctx.globalAlpha = d;
      const cx = lx + lw * a + 2;
      const cy = ty + 4 - (1 - d) * 18;
      const cwid = lw * (b - a) - 4;
      rr(cx, cy, cwid, 32, 6);
      ctx.fillStyle = tr.color;
      ctx.fill();
      if (tr.wave) {
        ctx.fillStyle = "rgba(244,241,234,0.45)";
        for (let q = cx + 6; q < cx + cwid - 6; q += 5) {
          const hh = 4 + Math.abs(Math.sin(q * 0.13)) * 16;
          ctx.fillRect(q, cy + 16 - hh / 2, 2, hh);
        }
      }
      ctx.restore();
    });
  });
  const ph = easeInOut(prog(local, 1.2, 3.4));
  const px = lx + lw * ph;
  ctx.fillStyle = MINT;
  ctx.shadowColor = MINT;
  ctx.shadowBlur = 10;
  ctx.fillRect(px - 1, y + 50, 2, 240);
  ctx.beginPath();
  ctx.moveTo(px - 7, y + 46);
  ctx.lineTo(px + 7, y + 46);
  ctx.lineTo(px, y + 56);
  ctx.fill();
  ctx.restore();
}

// 7. Edit anything: an ask, a reply, and the intro clip shortens.
function edit(t) {
  const local = t - 20.0;
  const ask = "Make the intro faster";
  const typed = Math.floor(ask.length * prog(local, 0.15, 0.85));
  ctx.save();
  ctx.font = "500 24px Inter";
  const bw = ctx.measureText(ask).width + 48;
  rr(W / 2 - bw / 2, 170, bw, 54, 27);
  ctx.fillStyle = "rgba(95,224,176,0.14)";
  ctx.fill();
  ctx.strokeStyle = "rgba(95,224,176,0.5)";
  ctx.stroke();
  text(ask.slice(0, typed), W / 2 - bw / 2 + 24, 205, { size: 24 });
  const reply = prog(local, 1.0, 1.3);
  text("Done. Intro trimmed from 4s to 2s.", W / 2, 268, { size: 22, color: "rgba(244,241,234,0.7)", alpha: reply, align: "center" });
  // One track: the intro clip shortens and the rest slide left.
  const shrink = easeInOut(prog(local, 1.1, 1.8));
  const x = 240;
  const w = 800;
  const unit = w / 16;
  const introW = mix(4, 2, shrink) * unit;
  rr(x, 330, w, 70, 12);
  ctx.fillStyle = "rgba(244,241,234,0.03)";
  ctx.fill();
  rr(x + 3, 336, introW - 6, 58, 8);
  ctx.fillStyle = "rgba(95,224,176,0.3)";
  ctx.fill();
  ctx.strokeStyle = MINT;
  ctx.lineWidth = 2;
  ctx.stroke();
  text("Intro", x + 16, 371, { size: 17, weight: 600 });
  mono(`${mix(4, 2, shrink).toFixed(1)}s`, x + 4, 322, { size: 14, color: MINT_TEXT, spacing: 1 });
  [3, 4, 3].forEach((len, i) => {
    const cx = x + introW + [0, 3, 7][i] * unit;
    rr(cx + 3, 336, len * unit - 6, 58, 8);
    ctx.fillStyle = ["rgba(139,124,246,0.4)", "rgba(242,168,110,0.32)", "rgba(139,124,246,0.4)"][i];
    ctx.fill();
  });
  ctx.restore();
}

// 8. The end card: the KeyFly lockup, unaltered, and the line.
const lockup = new Image();
lockup.src = "/brand/lockup-dark.svg";
function endCard(t) {
  const local = t - 22.5;
  const a = easeOut(prog(local, 0.05, 0.7));
  const s = mix(0.96, 1, a);
  const lw = 420;
  const lh = (lw * 64) / 212;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(W / 2, 300);
  ctx.scale(s, s);
  ctx.drawImage(lockup, -lw / 2, -lh / 2, lw, lh);
  ctx.restore();
  text("Describe it. KeyFly makes it.", W / 2, 440, { size: 46, family: "Instrument Serif", italic: true, color: MINT_TEXT, align: "center", alpha: prog(local, 0.6, 1.1) });
  mono("KEYFLY.SI", W / 2, 496, { align: "center", color: "rgba(244,241,234,0.55)", alpha: prog(local, 0.9, 1.4) });
}

const DRAW = [describe, prompt, storyboard, voice, graphics, timeline, edit, endCard];

export function frame(t) {
  backdrop(t);
  SCENES.forEach((s, i) => {
    const a = sceneAlpha(t, s, i);
    if (t < s.start || t >= s.end + 0.001 || a <= 0) return;
    // Each scene's drawing, stretched from the time it was written for.
    const [d0, d1] = s.drawn;
    const vt = d0 + ((t - s.start) * (d1 - d0)) / (s.end - s.start);
    ctx.save();
    ctx.globalAlpha = a;
    DRAW[i](vt);
    ctx.restore();
  });
  caption(t);
}

// ---------- Sound: the voice-over lines and a soft music bed ----------

const audio = new AudioContext();
const voiceBuffers = [];

async function loadVoice() {
  await Promise.all(
    SCENES.map(async (_, i) => {
      const response = await fetch(`voice/${String(i + 1).padStart(2, "0")}.wav`);
      if (!response.ok) return;
      voiceBuffers[i] = await audio.decodeAudioData(await response.arrayBuffer());
      voiceLength[i] = voiceBuffers[i].duration;
    }),
  );
}

// A calm pad (four chords, one per 7.5 s) with a soft pluck on each beat.
function music(out, at) {
  const chords = [
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 261.63],
    [261.63, 329.63, 392.0],
    [196.0, 246.94, 293.66],
  ];
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1400;
  filter.connect(out);
  chords.forEach((chord, c) => {
    const t0 = at + c * 7.5;
    chord.forEach((f) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.05, t0 + 1.2);
      gain.gain.setValueAtTime(0.05, t0 + 6.4);
      gain.gain.linearRampToValueAtTime(0, t0 + 7.6);
      osc.connect(gain).connect(filter);
      osc.start(t0);
      osc.stop(t0 + 7.7);
    });
    for (let beat = 0; beat < 15; beat++) {
      const tb = t0 + beat * 0.5;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = "sine";
      osc.frequency.value = chord[beat % 3] * 2;
      gain.gain.setValueAtTime(0.0001, tb);
      gain.gain.exponentialRampToValueAtTime(0.035, tb + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, tb + 0.35);
      osc.connect(gain).connect(filter);
      osc.start(tb);
      osc.stop(tb + 0.4);
    }
  });
  // Fade the bed out with the end card.
  out.gain.setValueAtTime(1, at + DURATION - 2);
  out.gain.linearRampToValueAtTime(0, at + DURATION - 0.1);
}

async function ready() {
  const inter = new FontFace("Inter", "url(/fonts/inter-latin-wght-normal.woff2)", { weight: "100 900" });
  const serif = new FontFace("Instrument Serif", "url(/fonts/instrument-serif-latin-400-italic.woff2)", { style: "italic" });
  await Promise.all([inter.load(), serif.load()]).then((f) => f.forEach((x) => document.fonts.add(x)));
  await lockup.decode();
  await loadVoice();
}

const params = new URLSearchParams(location.search);
await ready();
window.__voice = voiceLength.map((v) => v.toFixed(2));

if (params.has("record")) {
  await audio.resume();
  const sound = audio.createMediaStreamDestination();
  const at = audio.currentTime + 0.05;
  const bed = audio.createGain();
  bed.connect(sound);
  music(bed, at);
  SCENES.forEach((s, i) => {
    if (!voiceBuffers[i]) return;
    const source = audio.createBufferSource();
    source.buffer = voiceBuffers[i];
    source.connect(sound);
    source.start(at + s.start + VOICE_AT);
  });
  const stream = new MediaStream([...canvas.captureStream(30).getVideoTracks(), ...sound.stream.getAudioTracks()]);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/mp4;codecs=avc1.640028,mp4a.40.2",
    videoBitsPerSecond: 1_600_000,
    audioBitsPerSecond: 96_000,
  });
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    await fetch("/save", { method: "POST", body: blob });
    window.__done = blob.size;
  };
  // Start the picture with the sound's clock.
  while (audio.currentTime < at) await new Promise((r) => setTimeout(r, 2));
  const start = performance.now();
  recorder.start(1000);
  const tick = () => {
    const t = (performance.now() - start) / 1000;
    frame(Math.min(t, DURATION - 0.001));
    if (t < DURATION) setTimeout(tick, 1000 / 60);
    else recorder.stop();
  };
  tick();
} else {
  frame(Number(params.get("t") || 0));
  window.__frame = frame;
  window.__done = "frame";
}
