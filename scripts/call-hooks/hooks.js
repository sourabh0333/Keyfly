// The opening shots in "You make the calls", one per hook option the AI
// director offers for the cut it built (a launch film for KeyFly itself,
// "Describe a video. Get a video."): 1 Title line (a calm city at night
// for the title to sit on), 2 Product demo (a man at his desk, KeyFly's
// editor keyed onto his green monitor and laptop), 3 Quick montage
// (one-second cuts: KeyFly on a phone on a desk, a woman on her phone,
// hands typing, the monitor again, a laptop and coffee, the city). Each is 6 s, from real stock clips (see
// record.mjs), with only a light lift and a soft vignette: the page lays
// its own looks (Midnight Tech, Editorial Minimal, Warm Lifestyle) over
// them. A single shot's end cross-fades into the footage just before its
// in-point; the montage's end is a cut back to its start, like its others.
//
// ?record saves all three (?record&only=3 for one); ?sheet draws each clip
// every second (by seeking), for picking the in-points.

const W = 960;
const H = 540;
const FPS = 30;
const XF = 0.6; // s, a single shot's seam

// Each hook: its segments (clip, in-point, seconds) and their framing.
const HOOKS = [
  { n: 1, segments: [{ clip: "41161-720", from: 2, len: 6 }], lift: 1.05 },
  { n: 2, segments: [{ clip: "44737-720", from: 1, len: 6, key: true }], lift: 1.0 },
  {
    n: 3,
    lift: 1.03,
    segments: [
      { clip: "100079-720", from: 1, len: 1.0, key: true, portrait: true },
      { clip: "4911-720", from: 2, len: 1.0 },
      { clip: "39774-720", from: 3, len: 1.0 },
      { clip: "44737-720", from: 6, len: 1.0, key: true },
      { clip: "43259-720", from: 8, len: 1.0 },
      { clip: "41161-720", from: 7, len: 1.0 },
    ],
  },
];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const params = new URLSearchParams(location.search);
const smooth = (x) => x * x * (3 - 2 * x);

// ---- The keyed screens: KeyFly on the green monitor, laptop and phone ----
// The brand kit's symbol, drawn unchanged.
const symbol = new Image();
symbol.src = "/brand/symbol-dark.svg";
await symbol.decode().catch(() => {});

const MINT = "#5fe0b0";
const ui = document.createElement("canvas");
const uictx = ui.getContext("2d");
const layer = document.createElement("canvas");
layer.width = W;
layer.height = H;
const lctx = layer.getContext("2d");

function round(c, x, y, w, h, r) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

// The KeyFly editor (a landscape screen): header, viewer, AI director,
// timeline with a mint playhead that runs with the loop (t, seconds).
function editorScreen(w, h, t) {
  ui.width = w;
  ui.height = h;
  const c = uictx;
  const u = w / 100;
  c.fillStyle = "#18181c";
  c.fillRect(0, 0, w, h);
  c.fillStyle = "#202025";
  c.fillRect(0, 0, w, h * 0.12);
  if (symbol.naturalWidth) c.drawImage(symbol, u * 2, h * 0.025, h * 0.07, h * 0.07);
  c.fillStyle = "#ececf0";
  c.font = `600 ${h * 0.05}px sans-serif`;
  c.fillText("Launch Video", u * 2 + h * 0.1, h * 0.08);
  c.fillStyle = MINT;
  round(c, w - u * 14, h * 0.025, u * 12, h * 0.07, h * 0.015);
  c.fill();
  // Viewer: dusk, with the title.
  const vg = c.createLinearGradient(0, h * 0.16, 0, h * 0.6);
  vg.addColorStop(0, "#2a2550");
  vg.addColorStop(1, "#c98a6a");
  c.fillStyle = vg;
  round(c, u * 3, h * 0.16, u * 62, h * 0.44, h * 0.02);
  c.fill();
  c.fillStyle = "#fff";
  c.font = `700 ${h * 0.07}px sans-serif`;
  c.fillText("Describe a video.", u * 7, h * 0.36);
  c.fillStyle = MINT;
  c.fillText("Get a video.", u * 7, h * 0.45);
  // The AI director's lines.
  c.fillStyle = "#202025";
  round(c, u * 68, h * 0.16, u * 29, h * 0.44, h * 0.02);
  c.fill();
  for (let i = 0; i < 5; i++) {
    c.fillStyle = i === 0 ? MINT : "rgba(236,236,240,0.35)";
    round(c, u * 71, h * (0.21 + i * 0.07), u * (i === 0 ? 14 : 22 - (i % 2) * 6), h * 0.025, h * 0.01);
    c.fill();
  }
  // Timeline.
  const top = h * 0.66;
  const rows = [["#82e8c2", 0.35], ["#8b5cf6", 0.2], ["#1a7866", 0.3], ["#c2760c", 0.25]];
  rows.forEach(([col], r) => {
    let x = u * 3;
    for (let k = 0; k < 5; k++) {
      const cw = u * (9 + ((k * 7 + r * 3) % 9));
      c.fillStyle = col;
      c.globalAlpha = 0.75;
      round(c, x, top + r * h * 0.075, Math.min(cw, u * 97 - x), h * 0.055, h * 0.01);
      c.fill();
      x += cw + u * 1;
      if (x > u * 96) break;
    }
  });
  c.globalAlpha = 1;
  const px = u * 3 + ((t % 6) / 6) * u * 94;
  c.fillStyle = MINT;
  c.fillRect(px, top - h * 0.03, Math.max(2, u * 0.5), h * 0.33);
}

// The KeyFly app on a phone (portrait): the prompt, a mint Create and a
// preview that fills as the video is made.
function phoneScreen(w, h, t) {
  ui.width = w;
  ui.height = h;
  const c = uictx;
  const u = w / 100;
  c.fillStyle = "#101114";
  c.fillRect(0, 0, w, h);
  if (symbol.naturalWidth) c.drawImage(symbol, u * 8, u * 10, u * 14, u * 14);
  c.fillStyle = "#ececf0";
  c.font = `600 ${u * 8}px sans-serif`;
  c.fillText("KeyFly", u * 26, u * 21);
  c.fillStyle = "#1c1d21";
  round(c, u * 8, u * 34, u * 84, u * 46, u * 6);
  c.fill();
  c.fillStyle = "rgba(236,236,240,0.8)";
  c.font = `500 ${u * 6.5}px sans-serif`;
  c.fillText("A 30s launch film", u * 14, u * 50);
  c.fillText("for our new app.", u * 14, u * 60);
  c.fillStyle = MINT;
  round(c, u * 54, u * 66, u * 32, u * 10, u * 5);
  c.fill();
  c.fillStyle = "#06231a";
  c.font = `700 ${u * 5.5}px sans-serif`;
  c.fillText("Create", u * 61, u * 73);
  const g = c.createLinearGradient(0, u * 90, 0, u * 150);
  g.addColorStop(0, "#2a2550");
  g.addColorStop(1, "#c98a6a");
  c.fillStyle = g;
  round(c, u * 8, u * 90, u * 84, u * 52, u * 5);
  c.fill();
  c.fillStyle = "rgba(255,255,255,0.25)";
  round(c, u * 8, u * 148, u * 84, u * 3, u * 1.5);
  c.fill();
  c.fillStyle = MINT;
  round(c, u * 8, u * 148, u * 84 * Math.min(1, 0.25 + (t % 1) * 0.75), u * 3, u * 1.5);
  c.fill();
}

// Find the green screens in the frame just drawn, fit KeyFly into each
// (by its centre, angle and extent, from the green pixels' moments) and
// composite it through the green itself, with the spill pulled out of the
// edges.
function keyScreens(seg, t) {
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  const S = 4; // grid step for finding the screens
  const gw = Math.ceil(W / S);
  const gh = Math.ceil(H / S);
  const grid = new Uint8Array(gw * gh);
  const green = (i) => {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    return g > 70 && g - Math.max(r, b) > 30;
  };
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) grid[y * gw + x] = green(((y * S) * W + x * S) * 4) ? 1 : 0;
  // Connected regions of green cells.
  const label = new Int32Array(gw * gh).fill(-1);
  const regions = [];
  for (let start = 0; start < grid.length; start++) {
    if (!grid[start] || label[start] >= 0) continue;
    const stack = [start];
    label[start] = regions.length;
    let n = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
    const cells = [];
    while (stack.length) {
      const k = stack.pop();
      const x = k % gw;
      const y = (k / gw) | 0;
      n++; sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y;
      cells.push(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
        const nk = ny * gw + nx;
        if (grid[nk] && label[nk] < 0) {
          label[nk] = regions.length;
          stack.push(nk);
        }
      }
    }
    regions.push({ n, sx, sy, sxx, syy, sxy, cells });
  }
  lctx.clearRect(0, 0, W, H);
  for (const reg of regions) {
    if (reg.n < 60) continue; // specks
    const cx = reg.sx / reg.n;
    const cy = reg.sy / reg.n;
    const a = reg.sxx / reg.n - cx * cx;
    const b = reg.sxy / reg.n - cx * cy;
    const c2 = reg.syy / reg.n - cy * cy;
    const theta = 0.5 * Math.atan2(2 * b, a - c2); // the long axis
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    let u0 = Infinity, u1 = -Infinity, v0 = Infinity, v1 = -Infinity;
    for (const k of reg.cells) {
      const x = (k % gw) - cx;
      const y = ((k / gw) | 0) - cy;
      const uu = x * cos + y * sin;
      const vv = -x * sin + y * cos;
      if (uu < u0) u0 = uu;
      if (uu > u1) u1 = uu;
      if (vv < v0) v0 = vv;
      if (vv > v1) v1 = vv;
    }
    const L = (u1 - u0 + 2) * S; // along the long axis
    const Sh = (v1 - v0 + 2) * S;
    const ox = (cx + ((u0 + u1) / 2) * cos - ((v0 + v1) / 2) * sin) * S;
    const oy = (cy + ((u0 + u1) / 2) * sin + ((v0 + v1) / 2) * cos) * S;
    lctx.save();
    lctx.translate(ox, oy);
    if (seg.portrait) {
      // A phone: its picture runs along the long axis.
      lctx.rotate(theta + Math.PI / 2);
      phoneScreen(Math.round(Sh), Math.round(L), t);
      lctx.drawImage(ui, -Sh / 2, -L / 2, Sh, L);
    } else {
      lctx.rotate(theta);
      editorScreen(Math.round(L), Math.round(Sh), t);
      lctx.drawImage(ui, -L / 2, -Sh / 2, L, Sh);
    }
    lctx.restore();
  }
  // Composite through the green, softly, and pull green spill out.
  const over = lctx.getImageData(0, 0, W, H).data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const spill = g - Math.max(r, b);
    if (spill <= 8 || g < 50) continue;
    const alpha = Math.min(1, Math.max(0, (spill - 12) / 36)) * (over[i + 3] / 255);
    const keep = 1 - alpha;
    // Spill: the green that stays at the edge goes grey.
    const gg = Math.max(r, b) + (g - Math.max(r, b)) * 0.15;
    d[i] = r * keep + over[i] * alpha;
    d[i + 1] = gg * keep + over[i + 1] * alpha;
    d[i + 2] = b * keep + over[i + 2] * alpha;
  }
  ctx.putImageData(img, 0, 0);
}

const cache = {};
async function load(name) {
  if (cache[name]) return cache[name];
  const v = await new Promise((res, rej) => {
    const el = document.createElement("video");
    el.muted = true;
    el.playsInline = true;
    el.preload = "auto";
    el.src = `/clips/${name}.mp4`;
    el.addEventListener("loadeddata", () => res(el), { once: true });
    el.addEventListener("error", () => rej(new Error(name)), { once: true });
  });
  cache[name] = v;
  return v;
}

const seek = (v, t) =>
  new Promise((r) => {
    v.addEventListener("seeked", r, { once: true });
    v.currentTime = t;
  });

function cover(src, lift, alpha = 1, ox = 0, oy = 0, w0 = W, h0 = H) {
  const vw = src.videoWidth || src.width;
  const vh = src.videoHeight || src.height;
  const k = Math.max(w0 / vw, h0 / vh) * 1.02;
  const w = vw * k;
  const h = vh * k;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = `brightness(${lift}) contrast(1.04) saturate(0.95)`;
  ctx.drawImage(src, ox + (w0 - w) / 2, oy + (h0 - h) / 2, w, h);
  ctx.restore();
}

function vignette() {
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.42, W / 2, H / 2, H * 1.02);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,12,0.42)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// Every output frame's source picture, by seeking frame by frame. A single
// shot also collects the footage before its in-point, for the seam.
async function collect(hook) {
  const single = hook.segments.length === 1;
  const out = [];
  for (const seg of hook.segments) {
    const v = await load(seg.clip);
    for (let f = 0; f < Math.round(seg.len * FPS); f++) {
      await seek(v, seg.from + f / FPS);
      const main = await createImageBitmap(v);
      let seam = null;
      const t = f / FPS;
      if (single && t >= seg.len - XF) {
        await seek(v, Math.max(0, seg.from + t - seg.len));
        seam = { bmp: await createImageBitmap(v), p: smooth((t - (seg.len - XF)) / XF) };
      }
      out.push({ main, seam, seg, t: f / FPS });
    }
  }
  return out;
}

if (params.has("record")) {
  canvas.width = W;
  canvas.height = H;
  const { mp4 } = await import("./mp4.js");
  const only = params.get("only")?.split(",").map(Number);
  const report = [];
  for (const hook of HOOKS.filter((h) => !only || only.includes(h.n))) {
    const frames = await collect(hook);
    const cuts = new Set();
    let acc = 0;
    for (const seg of hook.segments) {
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
    encoder.configure({ codec: "avc1.4d401f", width: W, height: H, bitrate: 1_100_000, framerate: FPS, avc: { format: "avc" }, latencyMode: "quality" });
    for (let f = 0; f < frames.length; f++) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      cover(frames[f].main, hook.lift);
      if (frames[f].seam) cover(frames[f].seam.bmp, hook.lift, frames[f].seam.p);
      if (frames[f].seg.key) keyScreens(frames[f].seg, frames[f].t);
      vignette();
      if (f === Math.round(frames.length * 0.3)) {
        const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.8));
        await fetch(`/save?file=call-hook-${hook.n}.webp`, { method: "POST", body: poster });
      }
      const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      encoder.encode(vf, { keyFrame: cuts.has(f) || f % FPS === 0 });
      vf.close();
      if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
    }
    await encoder.flush();
    encoder.close();
    for (const fr of frames) {
      fr.main.close();
      fr.seam?.bmp.close();
    }
    const blob = mp4({ width: W, height: H, fps: FPS, avcC, samples });
    await fetch(`/save?file=call-hook-${hook.n}.mp4`, { method: "POST", body: blob });
    report.push(`hook ${hook.n} ${blob.size} bytes, ${frames.length} frames`);
  }
  window.__done = report.join("; ");
} else if (params.has("screen")) {
  // One keyed frame: ?screen=44737-720&t=2 (add &portrait for a phone).
  canvas.width = W;
  canvas.height = H;
  const v = await load(params.get("screen"));
  const t = Number(params.get("t") || 1);
  await seek(v, t);
  cover(v, 1);
  keyScreens({ key: true, portrait: params.has("portrait") }, t);
  vignette();
  window.__done = "screen";
} else {
  // A contact sheet: each clip every second, one row per clip.
  const names = [...new Set(HOOKS.flatMap((h) => h.segments.map((s) => s.clip)))];
  const tw = 192;
  const th = 108;
  const cols = 14;
  canvas.width = cols * tw;
  canvas.height = names.length * th;
  ctx.font = "13px monospace";
  const lengths = [];
  for (let r = 0; r < names.length; r++) {
    const v = await load(names[r]);
    lengths.push(`${names[r]} ${v.duration.toFixed(1)}s`);
    const step = Math.max(1, v.duration / cols);
    for (let c = 0; c < cols && c * step < v.duration; c++) {
      await seek(v, c * step);
      ctx.drawImage(v, c * tw, r * th, tw - 2, th - 2);
      ctx.fillStyle = "#ff0";
      ctx.fillText((c * step).toFixed(1), c * tw + 4, r * th + 15);
    }
  }
  window.__done = lengths.join("; ");
}
