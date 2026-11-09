// The six films in the homepage's "Use cases" viewer, each cut from real
// stock clips (see record.mjs) in its use case's shape, with the edit that
// use case is about set into it:
//   launch    16:9  three shots on the beat, a word of the title on each
//                   ("Launch", "day", "is here" with the mint point)
//   ugc       9:16  a creator talking to camera, captions lighting word by word
//   explainer 16:9  a tablet whose screen (keyed into its green) builds a
//                   three-step diagram, with a "Step 2" callout
//   montage   16:9  an event promo: four fast cuts, each with a speed ramp,
//                   ending on "Live / this Saturday"
//   demo      16:9  a laptop whose screen (keyed) shows an app: the cursor
//                   clicks Publish and the shot zooms in 2×
//   podcast   9:16  a host at the mic, a pull quote lighting word by word
//                   over a mint waveform
// Words are set in the site's fonts (src/fonts). Single-shot films loop
// through a cross-fade seam (their overlays are empty at both ends); the
// montages cut back to their first shot, like any other cut.
//
// ?record saves all six (?record&only=demo,ugc for some); ?frame=demo&t=2.4
// draws one finished frame; ?sheet draws each clip every second.

const FPS = 30;
const XF = 0.6; // s, a single shot's seam
const MINT = "#5fe0b0";
const MINT_INK = "#06231a";

const FILMS = [
  {
    kind: "launch",
    w: 960,
    h: 540,
    poster: 4.7,
    segs: [
      { clip: "3257-720", from: 2, len: 2, focus: [0.55, 0.45] },
      { clip: "4547-720", from: 6, len: 2, focus: [0.5, 0.5] },
      { clip: "42122-720", from: 3, len: 2, focus: [0.45, 0.5] },
    ],
    overlay: launchTitles,
  },
  { kind: "ugc", w: 432, h: 768, poster: 3.3, segs: [{ clip: "51257-720", from: 3, len: 6, focus: [0.5, 0.45] }], overlay: ugcCaptions },
  { kind: "explainer", w: 960, h: 540, poster: 3.4, segs: [{ clip: "100088-720", from: 2, len: 6, focus: [0.5, 0.5], screen: diagramScreen }] },
  {
    kind: "montage",
    w: 960,
    h: 540,
    poster: 5.2,
    segs: [
      { clip: "478-720", from: 2, len: 1.5, ramp: true, focus: [0.62, 0.5] },
      { clip: "4269-720", from: 1, len: 1.5, ramp: true, focus: [0.5, 0.55] },
      { clip: "486-720", from: 5, len: 1.5, ramp: true, focus: [0.5, 0.5] },
      { clip: "4187-720", from: 2, len: 1.5, ramp: true, focus: [0.5, 0.5], lift: 0.78 }, // a bright stage
    ],
    overlay: promoTitle,
  },
  { kind: "demo", w: 960, h: 540, poster: 3.3, segs: [{ clip: "52076-720", from: 0.8, len: 6, focus: [0.5, 0.5], screen: appScreen }], zoom: demoZoom, overlay: demoTag },
  { kind: "podcast", w: 432, h: 768, poster: 3.4, segs: [{ clip: "52181-720", from: 2, len: 6, focus: [0.39, 0.45] }], overlay: podcastQuote },
];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const base = document.createElement("canvas");
const bctx = base.getContext("2d", { willReadFrequently: true });
const ui = document.createElement("canvas");
const uictx = ui.getContext("2d");
const layer = document.createElement("canvas");
const lctx = layer.getContext("2d", { willReadFrequently: true });
const params = new URLSearchParams(location.search);
const smooth = (x) => x * x * (3 - 2 * x);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ramp01 = (t, a, b) => smooth(clamp((t - a) / (b - a), 0, 1));
const TEXT = "Inter, sans-serif";
const SERIF = "'Instrument Serif', serif";

const fonts = [
  new FontFace("Inter", "url(/fonts/inter-latin-wght-normal.woff2)", { weight: "100 900" }),
  new FontFace("Instrument Serif", "url(/fonts/instrument-serif-latin-400-italic.woff2)", { style: "italic" }),
];
for (const f of fonts) document.fonts.add(await f.load());

let W = 960;
let H = 540;
function size(film) {
  W = film.w;
  H = film.h;
  for (const c of [canvas, base, layer]) {
    c.width = W;
    c.height = H;
  }
}

function round(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

// ---- The screens keyed into the green ----

// The explainer: KeyFly's three steps, built one by one, on paper white.
function diagramScreen(w, h, t) {
  ui.width = w;
  ui.height = h;
  const c = uictx;
  c.fillStyle = "#f4f1ea";
  c.fillRect(0, 0, w, h);
  const out = 1 - ramp01(t, 4.5, 5.2); // the steps clear before the seam
  c.fillStyle = "#141416";
  c.font = `600 ${h * 0.085}px ${TEXT}`;
  c.textBaseline = "alphabetic";
  c.fillText("How it works", w * 0.07, h * 0.2);
  c.fillStyle = "#6b6a66";
  c.font = `500 ${h * 0.05}px ${TEXT}`;
  c.fillText("From one sentence to a finished video", w * 0.07, h * 0.29);
  const steps = ["Describe", "Edit", "Share"];
  const bw = w * 0.22;
  const bh = h * 0.3;
  const gap = (w * 0.86 - bw * 3) / 2;
  const y = h * 0.42;
  steps.forEach((label, i) => {
    const at = 0.5 + i * 1.0;
    const p = ramp01(t, at, at + 0.4);
    const x = w * 0.07 + i * (bw + gap);
    // The link from the step before draws first.
    if (i > 0 && t > at - 0.35) {
      const lp = ramp01(t, at - 0.35, at);
      const x0 = x - gap + 6;
      c.globalAlpha = out;
      c.strokeStyle = "#12805b";
      c.lineWidth = Math.max(2, h * 0.012);
      c.beginPath();
      c.moveTo(x0, y + bh / 2);
      c.lineTo(x0 + (gap - 12) * lp, y + bh / 2);
      c.stroke();
      c.globalAlpha = 1;
    }
    if (p <= 0) return;
    c.save();
    c.globalAlpha = out * p;
    c.translate(x + bw / 2, y + bh / 2);
    c.scale(0.86 + 0.14 * p, 0.86 + 0.14 * p);
    round(c, -bw / 2, -bh / 2, bw, bh, h * 0.04);
    c.fillStyle = i === 1 ? "#12805b" : "#ffffff";
    c.fill();
    c.strokeStyle = i === 1 ? "#12805b" : "#d9d4c8";
    c.lineWidth = 2;
    c.stroke();
    c.fillStyle = i === 1 ? "#ffffff" : "#12805b";
    c.font = `600 ${h * 0.045}px ${TEXT}`;
    c.fillText(`0${i + 1}`, -bw / 2 + bw * 0.12, -bh / 2 + bh * 0.3);
    c.fillStyle = i === 1 ? "#ffffff" : "#141416";
    c.font = `600 ${h * 0.065}px ${TEXT}`;
    c.fillText(label, -bw / 2 + bw * 0.12, bh / 2 - bh * 0.2);
    c.restore();
  });
  // The callout on step 2.
  const cp = ramp01(t, 2.9, 3.2);
  if (cp > 0) {
    const x = w * 0.07 + bw + gap + bw / 2;
    const cy = y + bh + h * 0.11;
    c.save();
    c.globalAlpha = out * cp;
    c.translate(0, (1 - cp) * h * 0.03);
    c.font = `600 ${h * 0.05}px ${TEXT}`;
    const tw = c.measureText("Step 2").width + h * 0.08;
    round(c, x - tw / 2, cy - h * 0.045, tw, h * 0.09, h * 0.045);
    c.fillStyle = MINT;
    c.fill();
    c.beginPath();
    c.moveTo(x - h * 0.025, cy - h * 0.044);
    c.lineTo(x, cy - h * 0.085);
    c.lineTo(x + h * 0.025, cy - h * 0.044);
    c.fill();
    c.fillStyle = MINT_INK;
    c.textAlign = "center";
    c.fillText("Step 2", x, cy + h * 0.017);
    c.restore();
  }
  c.globalAlpha = 1;
  c.textAlign = "left";
}

// The product demo: an app on night, the cursor clicking Publish.
const BUTTON = [0.83, 0.13]; // the Publish button's centre, in screen units
function appScreen(w, h, t) {
  ui.width = w;
  ui.height = h;
  const c = uictx;
  c.fillStyle = "#16171b";
  c.fillRect(0, 0, w, h);
  // Sidebar.
  c.fillStyle = "#1e1f24";
  c.fillRect(0, 0, w * 0.2, h);
  c.fillStyle = MINT;
  c.beginPath();
  c.arc(w * 0.06, h * 0.12, h * 0.03, 0, Math.PI * 2);
  c.fill();
  for (let i = 0; i < 4; i++) {
    c.fillStyle = i === 0 ? "#3a3b42" : "#2a2b31";
    round(c, w * 0.035, h * (0.24 + i * 0.1), w * 0.13, h * 0.05, h * 0.02);
    c.fill();
  }
  // Header.
  c.fillStyle = "#ececf0";
  c.font = `600 ${h * 0.065}px ${TEXT}`;
  c.fillText("Spring launch", w * 0.25, h * 0.155);
  const pressed = t >= 2.0 && t < 4.9;
  const [bx, by] = BUTTON;
  const bw = w * 0.17;
  const bh = h * 0.1;
  round(c, bx * w - bw / 2, by * h - bh / 2, bw, bh, bh / 2);
  c.fillStyle = pressed ? "#12805b" : MINT;
  c.fill();
  c.fillStyle = pressed ? "#ffffff" : MINT_INK;
  c.font = `600 ${h * 0.05}px ${TEXT}`;
  c.textAlign = "center";
  c.fillText(pressed ? "Published ✓" : "Publish", bx * w, by * h + h * 0.018);
  c.textAlign = "left";
  // Cards.
  for (let i = 0; i < 3; i++) {
    const x = w * (0.25 + i * 0.245);
    round(c, x, h * 0.3, w * 0.22, h * 0.36, h * 0.03);
    c.fillStyle = "#24252b";
    c.fill();
    const g = c.createLinearGradient(x, h * 0.3, x + w * 0.22, h * 0.52);
    g.addColorStop(0, ["#3b3366", "#6a4b5e", "#22433f"][i]);
    g.addColorStop(1, ["#9a6a7a", "#d39a7c", "#5fe0b0"][i]);
    c.fillStyle = g;
    round(c, x, h * 0.3, w * 0.22, h * 0.22, [h * 0.03, h * 0.03, 0, 0]);
    c.fill();
    c.fillStyle = "#adadb6";
    round(c, x + w * 0.02, h * 0.56, w * 0.14, h * 0.03, h * 0.015);
    c.fill();
    c.fillStyle = "#4a4b52";
    round(c, x + w * 0.02, h * 0.61, w * 0.09, h * 0.025, h * 0.012);
    c.fill();
  }
  // Rows.
  for (let i = 0; i < 2; i++) {
    c.fillStyle = "#202126";
    round(c, w * 0.25, h * (0.72 + i * 0.12), w * 0.71, h * 0.09, h * 0.02);
    c.fill();
    c.fillStyle = "#3a3b42";
    round(c, w * 0.28, h * (0.75 + i * 0.12), w * 0.3, h * 0.03, h * 0.015);
    c.fill();
  }
  // The cursor travels to Publish and clicks.
  // (and drifts back to where it started before the seam)
  const mp = ramp01(t, 0.6, 1.8) * (1 - ramp01(t, 4.9, 5.35));
  const cx = (0.5 + (bx - 0.5) * mp) * w;
  const cy = (0.62 + (by + 0.02 - 0.62) * mp) * h;
  if (t >= 2.0 && t < 2.6) {
    const r = ramp01(t, 2.0, 2.6);
    c.strokeStyle = `rgba(95, 224, 176, ${1 - r})`;
    c.lineWidth = h * 0.01;
    c.beginPath();
    c.arc(bx * w, by * h, bh * (0.4 + r * 1.1), 0, Math.PI * 2);
    c.stroke();
  }
  const s = h * 0.06;
  c.save();
  c.translate(cx, cy);
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, s * 1.1);
  c.lineTo(s * 0.3, s * 0.82);
  c.lineTo(s * 0.52, s * 1.25);
  c.lineTo(s * 0.68, s * 1.17);
  c.lineTo(s * 0.47, s * 0.76);
  c.lineTo(s * 0.85, s * 0.76);
  c.closePath();
  c.fillStyle = "#ffffff";
  c.fill();
  c.strokeStyle = "#111";
  c.lineWidth = 1.5;
  c.stroke();
  c.restore();
}

// ---- Keying ----

// Finds the green screen in the frame on `bctx` (the largest green region),
// takes its four corners, maps the segment's screen onto them (a grid of
// small affine triangles, close to the perspective), covers the tracking
// marks with an inset copy, and composites the edge through the green with
// the spill pulled out. Returns the corners (tl, tr, br, bl).
function keyScreen(seg, t) {
  const img = bctx.getImageData(0, 0, W, H);
  const d = img.data;
  const S = 2;
  const gw = Math.ceil(W / S);
  const gh = Math.ceil(H / S);
  const grid = new Uint8Array(gw * gh);
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++) {
      const i = (y * S * W + x * S) * 4;
      grid[y * gw + x] = d[i + 1] > 90 && d[i + 1] - Math.max(d[i], d[i + 2]) > 40 ? 1 : 0;
    }
  // The largest connected region.
  const label = new Int32Array(gw * gh).fill(-1);
  let best = null;
  for (let start = 0; start < grid.length; start++) {
    if (!grid[start] || label[start] >= 0) continue;
    const stack = [start];
    label[start] = start;
    const cells = [];
    while (stack.length) {
      const k = stack.pop();
      cells.push(k);
      const x = k % gw;
      const y = (k / gw) | 0;
      for (const nk of [x + 1 < gw ? k + 1 : -1, x > 0 ? k - 1 : -1, y + 1 < gh ? k + gw : -1, y > 0 ? k - gw : -1]) {
        if (nk >= 0 && grid[nk] && label[nk] < 0) {
          label[nk] = start;
          stack.push(nk);
        }
      }
    }
    if (!best || cells.length > best.length) best = cells;
  }
  if (!best || best.length < 200) return null;
  // Its corners: the cells furthest along each diagonal.
  let tl, tr, br, bl;
  let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
  for (const k of best) {
    const x = (k % gw) * S;
    const y = ((k / gw) | 0) * S;
    if (x + y < a0) (a0 = x + y), (tl = [x, y]);
    if (x + y > a1) (a1 = x + y), (br = [x + S, y + S]);
    if (x - y > b1) (b1 = x - y), (tr = [x + S, y]);
    if (x - y < b0) (b0 = x - y), (bl = [x, y + S]);
  }
  const quad = [tl, tr, br, bl];
  const L = Math.round(Math.hypot(tr[0] - tl[0], tr[1] - tl[1]));
  const Sh = Math.round(Math.hypot(bl[0] - tl[0], bl[1] - tl[1]));
  seg.screen(L, Sh, t);
  lctx.clearRect(0, 0, W, H);
  mapQuad(lctx, ui, quad, 0);
  const over = lctx.getImageData(0, 0, W, H).data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const spill = g - Math.max(r, b);
    if (spill <= 8 || g < 50) continue;
    const alpha = Math.min(1, Math.max(0, (spill - 12) / 36)) * (over[i + 3] / 255);
    const keep = 1 - alpha;
    const gg = Math.max(r, b) + (g - Math.max(r, b)) * 0.15;
    d[i] = r * keep + over[i] * alpha;
    d[i + 1] = gg * keep + over[i + 1] * alpha;
    d[i + 2] = b * keep + over[i + 2] * alpha;
  }
  bctx.putImageData(img, 0, 0);
  // The tracking marks: the screen's inner part drawn over them whole.
  mapQuad(bctx, ui, quad, 0);
  return quad;
}

// A point of the quad at (u, v), each 0..1 across it.
function quadPoint(q, u, v) {
  const [tl, tr, br, bl] = q;
  const top = [tl[0] + (tr[0] - tl[0]) * u, tl[1] + (tr[1] - tl[1]) * u];
  const bot = [bl[0] + (br[0] - bl[0]) * u, bl[1] + (br[1] - bl[1]) * u];
  return [top[0] + (bot[0] - top[0]) * v, top[1] + (bot[1] - top[1]) * v];
}

// Draws `src` onto the quad, leaving out a margin `m` (0..0.5) of it, as a
// grid of affine triangles.
function mapQuad(c, src, q, m) {
  const N = 8;
  const sw = src.width;
  const sh = src.height;
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const u0 = m + ((1 - 2 * m) * i) / N;
      const u1 = m + ((1 - 2 * m) * (i + 1)) / N;
      const v0 = m + ((1 - 2 * m) * j) / N;
      const v1 = m + ((1 - 2 * m) * (j + 1)) / N;
      const p00 = quadPoint(q, u0, v0);
      const p10 = quadPoint(q, u1, v0);
      const p11 = quadPoint(q, u1, v1);
      const p01 = quadPoint(q, u0, v1);
      const s00 = [u0 * sw, v0 * sh];
      const s10 = [u1 * sw, v0 * sh];
      const s11 = [u1 * sw, v1 * sh];
      const s01 = [u0 * sw, v1 * sh];
      triangle(c, src, [s00, s10, s11], [p00, p10, p11]);
      triangle(c, src, [s00, s11, s01], [p00, p11, p01]);
    }
}

// One affine triangle: src points s → canvas points p, clipped a hair
// wider than the triangle so neighbours meet without a seam.
function triangle(c, src, s, p) {
  const [[x0, y0], [x1, y1], [x2, y2]] = s;
  const [[u0, v0], [u1, v1], [u2, v2]] = p;
  const det = x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1);
  if (!det) return;
  const a = (u0 * (y1 - y2) + u1 * (y2 - y0) + u2 * (y0 - y1)) / det;
  const cc = (u0 * (x2 - x1) + u1 * (x0 - x2) + u2 * (x1 - x0)) / det;
  const e = (u0 * (x1 * y2 - x2 * y1) + u1 * (x2 * y0 - x0 * y2) + u2 * (x0 * y1 - x1 * y0)) / det;
  const b = (v0 * (y1 - y2) + v1 * (y2 - y0) + v2 * (y0 - y1)) / det;
  const dd = (v0 * (x2 - x1) + v1 * (x0 - x2) + v2 * (x1 - x0)) / det;
  const f = (v0 * (x1 * y2 - x2 * y1) + v1 * (x2 * y0 - x0 * y2) + v2 * (x0 * y1 - x1 * y0)) / det;
  const mx = (u0 + u1 + u2) / 3;
  const my = (v0 + v1 + v2) / 3;
  const grow = (x, y) => {
    const dx = x - mx;
    const dy = y - my;
    const l = Math.hypot(dx, dy) || 1;
    return [x + (dx / l) * 0.8, y + (dy / l) * 0.8];
  };
  c.save();
  c.beginPath();
  c.moveTo(...grow(u0, v0));
  c.lineTo(...grow(u1, v1));
  c.lineTo(...grow(u2, v2));
  c.closePath();
  c.clip();
  c.transform(a, b, cc, dd, e, f);
  c.drawImage(src, 0, 0);
  c.restore();
}

// ---- Overlays, drawn over the finished picture (film time t of len) ----

function shadowText(text, x, y) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = H * 0.03;
  ctx.shadowOffsetY = H * 0.004;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function cutFlash(t, cuts) {
  for (const c of cuts) {
    const p = (t - c) / 0.14;
    if (p >= 0 && p < 1) {
      ctx.fillStyle = `rgba(255,255,255,${0.32 * (1 - p)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }
}

// A soft dark rise along the foot, under titles set at the lower left.
function scrim() {
  const g = ctx.createLinearGradient(0, H * 0.45, 0, H);
  g.addColorStop(0, "rgba(6,5,12,0)");
  g.addColorStop(1, "rgba(6,5,12,0.62)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function launchTitles(t) {
  cutFlash(t, [0, 2, 4]);
  scrim();
  const words = ["Launch", "day", "is here"];
  const i = Math.min(2, Math.floor(t / 2));
  const p = ramp01(t - i * 2, 0.12, 0.5);
  ctx.save();
  ctx.globalAlpha = p;
  ctx.font = `700 ${H * 0.14}px ${TEXT}`;
  ctx.fillStyle = "#ffffff";
  const x = W * 0.07;
  const y = H * 0.84 + (1 - p) * H * 0.04;
  shadowText(words[i], x, y);
  if (i === 2) {
    const tw = ctx.measureText(words[i]).width;
    const dp = ramp01(t, 4.55, 4.8);
    ctx.fillStyle = MINT;
    ctx.beginPath();
    ctx.arc(x + tw + H * 0.045, y - H * 0.015, H * 0.024 * (0.4 + 0.6 * dp), 0, Math.PI * 2);
    ctx.globalAlpha = dp;
    ctx.fill();
  }
  ctx.restore();
}

function promoTitle(t) {
  cutFlash(t, [0, 1.5, 3, 4.5]);
  const p = ramp01(t, 4.62, 4.95);
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p;
  scrim();
  const x = W * 0.07;
  ctx.font = `700 ${H * 0.13}px ${TEXT}`;
  ctx.fillStyle = "#ffffff";
  shadowText("Live", x, H * 0.66 + (1 - p) * H * 0.03);
  ctx.font = `italic 400 ${H * 0.13}px ${SERIF}`;
  ctx.fillStyle = MINT;
  shadowText("this Saturday", x, H * 0.82 + (1 - p) * H * 0.03);
  ctx.restore();
}

// Captions lighting word by word: the word being said is mint.
function wordByWord(lines, t, { start, step, out, font, y, lh }) {
  const fade = 1 - ramp01(t, out, out + 0.45);
  if (fade <= 0) return;
  ctx.save();
  ctx.font = font;
  ctx.textAlign = "left";
  let k = 0;
  const said = (t - start) / step;
  lines.forEach((line, li) => {
    const words = line.split(" ");
    const widths = words.map((w) => ctx.measureText(w).width);
    const space = ctx.measureText(" ").width;
    const total = widths.reduce((a, b) => a + b, 0) + space * (words.length - 1);
    let x = (W - total) / 2;
    words.forEach((word, wi) => {
      const shown = clamp(said - k + 0.6, 0, 1);
      if (shown > 0) {
        ctx.globalAlpha = fade * shown;
        ctx.fillStyle = said >= k && said < k + 1 ? MINT : "#ffffff";
        shadowText(word, x, y + li * lh);
      }
      x += widths[wi] + space;
      k++;
    });
  });
  ctx.restore();
}

function ugcCaptions(t) {
  wordByWord(["You have to", "try this."], t, { start: 0.5, step: 0.42, out: 4.6, font: `800 ${W * 0.105}px ${TEXT}`, y: H * 0.74, lh: W * 0.125 });
}

function podcastQuote(t) {
  // The waveform: bars along the foot, moving with the voice.
  const fade = 1 - ramp01(t, 4.7, 5.2);
  const bars = 22;
  const bw = W * 0.62;
  const x0 = (W - bw) / 2;
  ctx.save();
  ctx.globalAlpha = 0.9 * Math.min(fade, ramp01(t, 0.1, 0.4));
  ctx.fillStyle = MINT;
  for (let i = 0; i < bars; i++) {
    const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 7.3 + i * 0.9) * Math.sin(t * 3.1 + i * 0.37));
    const h = H * 0.05 * a;
    const x = x0 + (i * bw) / bars;
    ctx.beginPath();
    ctx.roundRect(x, H * 0.9 - h / 2, (bw / bars) * 0.5, h, 2);
    ctx.fill();
  }
  ctx.restore();
  wordByWord(["“Start before", "you feel ready.”"], t, { start: 0.6, step: 0.45, out: 4.6, font: `italic 400 ${W * 0.1}px ${SERIF}`, y: H * 0.71, lh: W * 0.115 });
}

function demoTag(t) {
  const p = Math.min(ramp01(t, 2.7, 3.0), 1 - ramp01(t, 4.3, 4.6));
  if (p <= 0) return;
  ctx.save();
  ctx.globalAlpha = p;
  ctx.font = `600 ${H * 0.036}px ui-monospace, Consolas, monospace`;
  const label = "◆ ZOOM 2×";
  const tw = ctx.measureText(label).width + H * 0.05;
  round(ctx, W * 0.04, H * 0.06, tw, H * 0.07, H * 0.035);
  ctx.fillStyle = "rgba(6, 35, 26, 0.85)";
  ctx.fill();
  ctx.strokeStyle = MINT;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = MINT;
  ctx.fillText(label, W * 0.04 + H * 0.025, H * 0.107);
  ctx.restore();
}

// The demo's zoom: in on the Publish button after the click, out before the
// seam.
function demoZoom(t, spot) {
  const z = 1 + Math.min(ramp01(t, 2.2, 3.0), 1 - ramp01(t, 4.4, 5.2));
  if (!spot || z === 1) return { z: 1, x: W / 2, y: H / 2 };
  const [x, y] = quadPoint(spot, BUTTON[0], BUTTON[1]);
  return { z, x, y };
}

// ---- Footage ----

const cache = {};
async function load(name) {
  if (cache[name]) return cache[name];
  cache[name] = await new Promise((res, rej) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = `/clips/${name}.mp4`;
    v.addEventListener("loadeddata", () => res(v), { once: true });
    v.addEventListener("error", () => rej(new Error(name)), { once: true });
  });
  return cache[name];
}

const seek = (v, t) =>
  new Promise((r) => {
    v.addEventListener("seeked", r, { once: true });
    v.currentTime = t;
  });

function cover(c, src, focus, alpha = 1, lift = 1.02) {
  const vw = src.videoWidth || src.width;
  const vh = src.videoHeight || src.height;
  const k = Math.max(W / vw, H / vh) * 1.02;
  const w = vw * k;
  const h = vh * k;
  const x = clamp(W / 2 - focus[0] * w, W - w, 0);
  const y = clamp(H / 2 - focus[1] * h, H - h, 0);
  c.save();
  c.globalAlpha = alpha;
  c.filter = `brightness(${lift}) contrast(1.05) saturate(0.95)`;
  c.drawImage(src, x, y, w, h);
  c.restore();
}

function grade(c) {
  c.save();
  c.globalCompositeOperation = "soft-light";
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(80, 70, 165, 0.34)");
  g.addColorStop(0.55, "rgba(140, 92, 140, 0.1)");
  g.addColorStop(1, "rgba(236, 150, 108, 0.28)");
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  c.restore();
  const m = Math.max(W, H);
  const v = c.createRadialGradient(W / 2, H / 2, m * 0.3, W / 2, H / 2, m * 0.72);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,12,0.42)");
  c.fillStyle = v;
  c.fillRect(0, 0, W, H);
}

// A ramped shot plays slowly, then fast: its source time for output time t.
const rampTime = (t, len) => len * (0.45 * (t / len) + 0.55 * (t / len) ** 3);

// Every output frame's source pictures, by seeking frame by frame.
async function collect(film) {
  const single = film.segs.length === 1;
  const out = [];
  let at = 0;
  for (const seg of film.segs) {
    const v = await load(seg.clip);
    for (let f = 0; f < Math.round(seg.len * FPS); f++) {
      const t = f / FPS;
      await seek(v, seg.from + (seg.ramp ? rampTime(t, seg.len) : t));
      const main = await createImageBitmap(v);
      let seam = null;
      if (single && t >= seg.len - XF) {
        await seek(v, Math.max(0, seg.from + t - seg.len));
        seam = { bmp: await createImageBitmap(v), p: smooth((t - (seg.len - XF)) / XF), t: t - seg.len };
      }
      out.push({ main, seam, seg, t, T: at + t });
    }
    at += seg.len;
  }
  return out;
}

// One finished frame onto the output canvas.
function render(film, fr) {
  const len = film.segs.reduce((a, s) => a + s.len, 0);
  bctx.fillStyle = "#000";
  bctx.fillRect(0, 0, W, H);
  cover(bctx, fr.main, fr.seg.focus, 1, fr.seg.lift);
  let spot = null;
  if (fr.seg.screen) spot = keyScreen(fr.seg, fr.t);
  if (fr.seam) {
    // The seam's footage, keyed as at the start of the loop.
    lctx.clearRect(0, 0, W, H);
    const keep = bctx.getImageData(0, 0, W, H);
    bctx.fillRect(0, 0, W, H);
    cover(bctx, fr.seam.bmp, fr.seg.focus, 1, fr.seg.lift);
    if (fr.seg.screen) keyScreen(fr.seg, 0); // the screen as at the loop's start
    const seamImg = bctx.getImageData(0, 0, W, H);
    bctx.putImageData(keep, 0, 0);
    lctx.putImageData(seamImg, 0, 0);
    bctx.save();
    bctx.globalAlpha = fr.seam.p;
    bctx.drawImage(layer, 0, 0);
    bctx.restore();
  }
  grade(bctx);
  const zoom = film.zoom ? film.zoom(fr.T, spot) : { z: 1, x: W / 2, y: H / 2 };
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  if (zoom.z !== 1) {
    // Zoom about the spot (it stays put, so the frame stays filled).
    ctx.translate(zoom.x, zoom.y);
    ctx.scale(zoom.z, zoom.z);
    ctx.translate(-zoom.x, -zoom.y);
  }
  ctx.drawImage(base, 0, 0);
  ctx.restore();
  film.overlay?.(fr.T, len);
}

if (params.has("record")) {
  const { mp4 } = await import("./mp4.js");
  const only = params.get("only")?.split(",");
  const report = [];
  for (const film of FILMS.filter((f) => !only || only.includes(f.kind))) {
    size(film);
    const frames = await collect(film);
    const cuts = new Set();
    let acc = 0;
    for (const seg of film.segs) {
      cuts.add(acc);
      acc += Math.round(seg.len * FPS);
    }
    const samples = [];
    let avcC = null;
    const encoder = new VideoEncoder({
      output: (chunk, meta) => {
        if (meta?.decoderConfig?.description) avcC = meta.decoderConfig.description;
        const data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);
        samples.push({ data, key: chunk.type === "key" });
      },
      error: (e) => {
        window.__done = `error ${e.message}`;
      },
    });
    encoder.configure({ codec: "avc1.4d401f", width: W, height: H, bitrate: 1_200_000, framerate: FPS, avc: { format: "avc" }, latencyMode: "quality" });
    const posterAt = Math.round(film.poster * FPS);
    for (let f = 0; f < frames.length; f++) {
      render(film, frames[f]);
      if (f === posterAt) {
        const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.82));
        await fetch(`/save?file=${film.kind}.webp`, { method: "POST", body: poster });
      }
      const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      encoder.encode(vf, { keyFrame: cuts.has(f) || f % FPS === 0 });
      vf.close();
      // Wait for the encoder by its own event, not a timer (timers crawl in a
      // background tab).
      while (encoder.encodeQueueSize > 8) await new Promise((r) => encoder.addEventListener("dequeue", r, { once: true }));
    }
    await encoder.flush();
    encoder.close();
    for (const fr of frames) {
      fr.main.close();
      fr.seam?.bmp.close();
    }
    const blob = mp4({ width: W, height: H, fps: FPS, avcC, samples });
    await fetch(`/save?file=${film.kind}.mp4`, { method: "POST", body: blob });
    report.push(`${film.kind} ${blob.size} bytes`);
  }
  window.__done = report.join("; ");
} else if (params.has("frame")) {
  // One finished frame: ?frame=demo&t=2.4
  const film = FILMS.find((f) => f.kind === params.get("frame"));
  const T = Number(params.get("t") || 0);
  size(film);
  let at = 0;
  let seg = film.segs[0];
  for (const s of film.segs) {
    if (T >= at && T < at + s.len) {
      seg = s;
      break;
    }
    at += s.len;
  }
  const t = T - at;
  const v = await load(seg.clip);
  await seek(v, seg.from + (seg.ramp ? rampTime(t, seg.len) : t));
  render(film, { main: v, seam: null, seg, t, T });
  window.__done = `${film.kind} at ${T}`;
} else {
  // A contact sheet: each clip every second, one row per clip.
  const clips = [...new Set(FILMS.flatMap((f) => f.segs.map((s) => s.clip)))];
  const tw = 192;
  const th = 108;
  const cols = 12;
  canvas.width = cols * tw;
  canvas.height = clips.length * th;
  ctx.font = "13px monospace";
  const info = [];
  for (let r = 0; r < clips.length; r++) {
    const v = await load(clips[r]);
    info.push(`${clips[r]} ${v.duration.toFixed(1)}s`);
    for (let c = 0; c < cols && c < v.duration; c++) {
      await seek(v, c);
      const k = Math.min(tw / v.videoWidth, th / v.videoHeight);
      ctx.drawImage(v, c * tw, r * th, v.videoWidth * k - 2, v.videoHeight * k - 2);
      ctx.fillStyle = "#ff0";
      ctx.fillText(`${clips[r]} ${c}`, c * tw + 4, r * th + 15);
    }
  }
  window.__done = info.join("; ");
}
