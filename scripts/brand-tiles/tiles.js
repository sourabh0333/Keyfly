// The six videos in "On brand, every time", one real stock clip each (see
// record.mjs), cut in the tile's own shape: Launch film 16:9 (a team round
// a laptop), UGC ad 9:16 (a skincare creator at her ring light), Podcast
// clip 1:1 (a broadcaster at the mic), Explainer 16:9 (a teacher at a
// blackboard), Product demo 4:5 (a phone in use beside a laptop), Event
// promo 16:9 (a festival crowd). 5 s each, with only a light lift and a
// soft vignette: the page applies the brand kit over them (logo bug,
// colours, font, voice). Each loop's end cross-fades into the footage just
// before its in-point, so it loops without a seam.
//
// ?record saves all six (?record&only=ugc,demo for some); ?sheet draws each
// clip every second (by seeking), for picking `from` and `focus`.

const FPS = 30;
const LOOP = 5; // s (a tile may set its own len)
const XF = 0.5; // s, the seam

// kind: the file's name (as the tile's); w × h: its shape; clip: the
// source; from: the in-point; focus: where the crop centres (x, y).
const TILES = [
  { kind: "launch", w: 640, h: 360, clip: "100319-720", from: 0.8, focus: [0.5, 0.5] },
  { kind: "ugc", w: 360, h: 640, clip: "50423-720", from: 0.6, focus: [0.38, 0.5] },
  { kind: "podcast", w: 480, h: 480, clip: "2957-720", from: 3, focus: [0.42, 0.5] },
  { kind: "explainer", w: 640, h: 360, clip: "4623-720", from: 3, focus: [0.6, 0.5] },
  { kind: "demo", w: 432, h: 540, clip: "1787-720", from: 3, focus: [0.4, 0.55] },
  { kind: "montage", w: 640, h: 360, clip: "4185-720", from: 0.55, len: 4.4, focus: [0.5, 0.5] }, // a short clip
];

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(location.search);
const smooth = (x) => x * x * (3 - 2 * x);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

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

const seek = (v, t) =>
  new Promise((r) => {
    v.addEventListener("seeked", r, { once: true });
    v.currentTime = t;
  });

function cover(src, tile, alpha = 1) {
  const { w: W, h: H } = tile;
  const vw = src.videoWidth || src.width;
  const vh = src.videoHeight || src.height;
  const k = Math.max(W / vw, H / vh) * 1.03;
  const w = vw * k;
  const h = vh * k;
  const x = clamp(W / 2 - tile.focus[0] * w, W - w, 0);
  const y = clamp(H / 2 - tile.focus[1] * h, H - h, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = "brightness(1.03) contrast(1.04) saturate(0.95)";
  ctx.drawImage(src, x, y, w, h);
  ctx.restore();
}

function vignette(tile) {
  const { w: W, h: H } = tile;
  const m = Math.max(W, H);
  const v = ctx.createRadialGradient(W / 2, H / 2, m * 0.32, W / 2, H / 2, m * 0.72);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,12,0.42)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// The frames a loop needs, by seeking frame by frame, from just before its
// in-point (for the seam) to its end.
async function collect(tile) {
  const v = await load(tile.clip);
  const list = [];
  for (let m = tile.from - XF - 0.05; m <= tile.from + (tile.len ?? LOOP) + 0.05; m += 1 / FPS) {
    await seek(v, Math.max(0, m));
    list.push([m, await createImageBitmap(v)]);
  }
  v.remove();
  return list;
}

function nearest(list, m) {
  let best = list[0][1];
  for (const [t, bmp] of list) if (t <= m + 0.001) best = bmp;
  return best;
}

if (params.has("record")) {
  const { mp4 } = await import("./mp4.js");
  const only = params.get("only")?.split(",");
  const report = [];
  for (const tile of TILES.filter((t) => !only || only.includes(t.kind))) {
    canvas.width = tile.w;
    canvas.height = tile.h;
    const list = await collect(tile);
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
    encoder.configure({ codec: "avc1.4d401f", width: tile.w, height: tile.h, bitrate: 600_000, framerate: FPS, avc: { format: "avc" }, latencyMode: "quality" });
    const len = tile.len ?? LOOP;
    for (let f = 0; f < Math.round(len * FPS); f++) {
      const t = f / FPS;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, tile.w, tile.h);
      cover(nearest(list, tile.from + t), tile);
      if (t >= len - XF) cover(nearest(list, tile.from + t - len), tile, smooth((t - (len - XF)) / XF));
      vignette(tile);
      if (f === Math.round(len * 0.3 * FPS)) {
        const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.8));
        await fetch(`/save?file=${tile.kind}.webp`, { method: "POST", body: poster });
      }
      const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      encoder.encode(vf, { keyFrame: f % FPS === 0 });
      vf.close();
      if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
    }
    await encoder.flush();
    encoder.close();
    for (const [, b] of list) b.close();
    const blob = mp4({ width: tile.w, height: tile.h, fps: FPS, avcC, samples });
    await fetch(`/save?file=${tile.kind}.mp4`, { method: "POST", body: blob });
    report.push(`${tile.kind} ${blob.size} bytes`);
  }
  window.__done = report.join("; ");
} else {
  // A contact sheet: each clip every second, one row per clip.
  const tw = 192;
  const th = 108;
  const cols = 10;
  canvas.width = cols * tw;
  canvas.height = TILES.length * th;
  ctx.font = "13px monospace";
  const lengths = [];
  for (let r = 0; r < TILES.length; r++) {
    const v = await load(TILES[r].clip);
    lengths.push(`${TILES[r].kind} ${v.duration.toFixed(1)}s`);
    for (let c = 0; c < cols && c < v.duration; c++) {
      await seek(v, c);
      ctx.drawImage(v, c * tw, r * th, tw - 2, th - 2);
      ctx.fillStyle = "#ff0";
      ctx.fillText(`${TILES[r].kind} ${c}`, c * tw + 4, r * th + 15);
    }
    v.remove();
  }
  window.__done = lengths.join("; ");
}
