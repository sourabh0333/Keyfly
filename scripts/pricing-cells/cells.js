// The film loops beside the Pricing hero's heading (the bars of its
// waveform): one real shot each (see record.mjs), cropped square on its
// subject (the page crops each to its bar with object-position), graded gently
// towards the site's dusk with a soft vignette, like the site's reels. Each
// loop's last moments cross-fade into the footage just before its in-point,
// so it loops without a seam.
//
// ?record saves public/video/cells/{name}.mp4 and {name}.webp for every
// cell (?record&only=host,phone for some); ?sheet draws each at its start, middle and seam (by seeking, so
// only roughly right), with its clip's length.

const S = 400; // px, square
const FPS = 30;
const LOOP = 6; // s
const XF = 0.7; // s the seam's cross-fade lasts

// name: the files' name; clip: the source; from: the in-point (where it
// moves most); focus: the point the square crop centres on; zoom: a slight
// fixed push; lift: a small exposure lift.
const CELLS = [
  { name: "host", clip: "52184-1080", from: 2.2, focus: [0.52, 0.4], zoom: 1.06, lift: 1.1 },
  { name: "aerial", clip: "50267-1080", from: 0.8, focus: [0.5, 0.55], zoom: 1.04, lift: 1.0 },
  { name: "lake", clip: "49647-1080", from: 6.6, focus: [0.32, 0.45], zoom: 1.04, lift: 0.98 },
  { name: "creator", clip: "42323-720", from: 0.5, focus: [0.5, 0.4], zoom: 1.0, lift: 1.0 },
  { name: "park", clip: "34382-1080", from: 0.8, focus: [0.5, 0.45], zoom: 1.04, lift: 1.0 },
  { name: "meadow", clip: "41568-1080", from: 6.4, focus: [0.5, 0.48], zoom: 1.04, lift: 1.0 },
  { name: "phone", clip: "42308-720", from: 0.5, focus: [0.45, 0.4], zoom: 1.0, lift: 1.0 },
];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(location.search);

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const smooth = (x) => x * x * (3 - 2 * x);
const dims = (v) => [v.videoWidth || v.width, v.videoHeight || v.height];

function load(name) {
  return new Promise((res, rej) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = `/clips/${name}.mp4`;
    v.addEventListener("loadeddata", () => res(v), { once: true });
    v.addEventListener("error", () => rej(new Error(name)), { once: true });
  });
}

// Draw a picture to cover the square at (ox, oy, size), centred on focus.
function cover(src, cell, alpha = 1, ox = 0, oy = 0, size = S) {
  const [vw, vh] = dims(src);
  const k = Math.max(size / vw, size / vh) * cell.zoom;
  const w = vw * k;
  const h = vh * k;
  const [fx, fy] = cell.focus;
  const x = clamp(size / 2 - fx * w, size - w, 0);
  const y = clamp(size / 2 - fy * h, size - h, 0);
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, oy, size, size);
  ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.filter = `brightness(${cell.lift}) saturate(0.92) contrast(1.05)`;
  ctx.drawImage(src, ox + x, oy + y, w, h);
  ctx.restore();
}

function grade(ox = 0, oy = 0, size = S) {
  // Towards dusk: a little violet from the top, a little peach from the foot.
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const g = ctx.createLinearGradient(0, oy, 0, oy + size);
  g.addColorStop(0, "rgba(70, 62, 160, 0.42)");
  g.addColorStop(0.55, "rgba(140, 92, 140, 0.12)");
  g.addColorStop(1, "rgba(236, 150, 108, 0.34)");
  ctx.fillStyle = g;
  ctx.fillRect(ox, oy, size, size);
  ctx.restore();
  const v = ctx.createRadialGradient(ox + size / 2, oy + size / 2, size * 0.4, ox + size / 2, oy + size / 2, size * 0.78);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,10,0.45)");
  ctx.fillStyle = v;
  ctx.fillRect(ox, oy, size, size);
}

// Collect the frames a loop needs, from just before its in-point (for the
// seam) to its end, by playing the clip: fast up to the range, half speed
// through it. Seeking isn't trusted: some stock files return black frames.
async function collect(cell) {
  const v = await load(cell.clip);
  const [vw, vh] = dims(v);
  const k = Math.min(1, 900 / vh);
  const from = cell.from - XF - 0.05;
  const until = cell.from + LOOP + 0.05;
  const list = [];
  await new Promise((done) => {
    const each = async (now, meta) => {
      const m = meta.mediaTime;
      if (m >= from - 0.6) v.playbackRate = 0.5;
      if (m >= from && m <= until) list.push([m, await createImageBitmap(v, { resizeWidth: Math.round(vw * k), resizeHeight: Math.round(vh * k) })]);
      if (m < until && !v.ended) v.requestVideoFrameCallback(each);
      else done();
    };
    v.requestVideoFrameCallback(each);
    v.addEventListener("ended", done, { once: true });
    v.playbackRate = 4;
    v.play();
  });
  v.pause();
  v.remove();
  return list;
}

// The last collected frame at or before the clip's moment m.
function nearest(list, m) {
  let best = list[0][1];
  for (const [t, bmp] of list) if (t <= m + 0.001) best = bmp;
  return best;
}

if (params.has("record")) {
  canvas.width = S;
  canvas.height = S;
  const { mp4 } = await import("./mp4.js");
  const report = [];
  const only = params.get("only")?.split(",");
  for (const cell of CELLS.filter((c) => !only || only.includes(c.name))) {
    const list = await collect(cell);
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
    encoder.configure({ codec: "avc1.4d401f", width: S, height: S, bitrate: 700_000, framerate: FPS, avc: { format: "avc" }, latencyMode: "quality" });
    for (let f = 0; f < LOOP * FPS; f++) {
      const t = f / FPS;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, S, S);
      cover(nearest(list, cell.from + t), cell);
      if (t >= LOOP - XF) {
        // The seam: the footage just before the in-point fades in, so the
        // last frame leads straight into the first.
        const p = smooth((t - (LOOP - XF)) / XF);
        cover(nearest(list, cell.from + t - LOOP), cell, p);
      }
      grade();
      if (f === Math.round(LOOP * 0.4 * FPS)) {
        const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.8));
        await fetch(`/save?file=${cell.name}.webp`, { method: "POST", body: poster });
      }
      const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      encoder.encode(vf, { keyFrame: f % FPS === 0 });
      vf.close();
      if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
    }
    await encoder.flush();
    encoder.close();
    for (const [, b] of list) b.close();
    const blob = mp4({ width: S, height: S, fps: FPS, avcC, samples });
    await fetch(`/save?file=${cell.name}.mp4`, { method: "POST", body: blob });
    report.push(`${cell.name} ${blob.size} bytes, ${list.length} frames`);
  }
  window.__done = report.join("; ");
} else {
  // A contact sheet: each cell at its start, middle and just before the
  // seam, with its clip's length.
  const T = 200;
  const at = [0, LOOP / 2, LOOP - XF - 0.05];
  canvas.width = T * at.length + 160;
  canvas.height = T * CELLS.length;
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const lengths = [];
  for (let r = 0; r < CELLS.length; r++) {
    const cell = CELLS[r];
    const v = await load(cell.clip);
    lengths.push(`${cell.name} ${v.duration.toFixed(1)}s`);
    for (let c = 0; c < at.length; c++) {
      await new Promise((res) => {
        v.addEventListener("seeked", () => setTimeout(res, 250), { once: true });
        v.currentTime = Math.min(v.duration - 0.05, cell.from + at[c]);
      });
      cover(v, cell, 1, c * T, r * T, T - 4);
      grade(c * T, r * T, T - 4);
    }
    ctx.fillStyle = "#ddd";
    ctx.font = "14px monospace";
    ctx.fillText(`${cell.name} ${v.duration.toFixed(1)}s`, T * at.length + 8, r * T + 24);
    v.remove();
  }
  window.__done = lengths.join("; ");
}
