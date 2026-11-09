// The shot in "One edit, every format": one real stock clip (see
// record.mjs), a creator in red filming herself on a gimbal as she walks,
// 8 s at 16:9, graded gently towards the site's dusk with a soft vignette.
// The page reframes it to 9:16, 1:1 and 4:5 around her (she stands at about
// 45% across) and lays the captions over it. Its last moments cross-fade
// into the footage just before its in-point, so it loops without a seam.
//
// ?record saves it; ?sheet draws the clip every second (by seeking).

const W = 960;
const H = 540;
const FPS = 30;
const LOOP = 8; // s
const XF = 0.6; // s the seam's cross-fade lasts

// n: the file's number; clip: the source; from: the in-point; focus: where
// the frame centres when the clip is cropped (the page narrows the frame
// for 9:16, 1:1 and 4:5, keeping its middle); lift: exposure.
const SHOTS = [{ n: 1, clip: "34468-720", from: 1.4, focus: [0.5, 0.5], lift: 1.02 }];

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

function cover(src, shot, alpha = 1, ox = 0, oy = 0, w0 = W, h0 = H) {
  const vw = src.videoWidth || src.width;
  const vh = src.videoHeight || src.height;
  const k = Math.max(w0 / vw, h0 / vh) * 1.02;
  const w = vw * k;
  const h = vh * k;
  const x = clamp(w0 / 2 - shot.focus[0] * w, w0 - w, 0);
  const y = clamp(h0 / 2 - shot.focus[1] * h, h0 - h, 0);
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, oy, w0, h0);
  ctx.clip();
  ctx.globalAlpha = alpha;
  ctx.filter = `brightness(${shot.lift}) saturate(0.92) contrast(1.05)`;
  ctx.drawImage(src, ox + x, oy + y, w, h);
  ctx.restore();
}

function grade() {
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(80, 70, 165, 0.42)");
  g.addColorStop(0.55, "rgba(140, 92, 140, 0.12)");
  g.addColorStop(1, "rgba(236, 150, 108, 0.36)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, H * 1.02);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,12,0.5)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// The frames a loop needs, from just before its in-point (for the seam) to
// its end, by seeking frame by frame (it also works in a background tab).
async function collect(shot) {
  const v = await load(shot.clip);
  const list = [];
  for (let m = shot.from - XF - 0.05; m <= shot.from + LOOP + 0.05; m += 1 / FPS) {
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
  canvas.width = W;
  canvas.height = H;
  const { mp4 } = await import("./mp4.js");
  const only = params.get("only")?.split(",").map(Number);
  const report = [];
  for (const shot of SHOTS.filter((s) => !only || only.includes(s.n))) {
    const list = await collect(shot);
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
    encoder.configure({ codec: "avc1.4d401f", width: W, height: H, bitrate: 1_000_000, framerate: FPS, avc: { format: "avc" }, latencyMode: "quality" });
    for (let f = 0; f < LOOP * FPS; f++) {
      const t = f / FPS;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      cover(nearest(list, shot.from + t), shot);
      if (t >= LOOP - XF) cover(nearest(list, shot.from + t - LOOP), shot, smooth((t - (LOOP - XF)) / XF));
      grade();
      if (f === Math.round(LOOP * 0.3 * FPS)) {
        const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.8));
        await fetch(`/save?file=format-loop.webp`, { method: "POST", body: poster });
      }
      const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      encoder.encode(vf, { keyFrame: f % FPS === 0 });
      vf.close();
      if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
    }
    await encoder.flush();
    encoder.close();
    for (const [, b] of list) b.close();
    const blob = mp4({ width: W, height: H, fps: FPS, avcC, samples });
    await fetch(`/save?file=format-loop.mp4`, { method: "POST", body: blob });
    report.push(`shot ${shot.n} ${blob.size} bytes, ${list.length} frames`);
  }
  window.__done = report.join("; ");
} else {
  // A contact sheet: each clip every second, one row per clip.
  const tw = 192;
  const th = 108;
  const cols = 14;
  canvas.width = cols * tw;
  canvas.height = SHOTS.length * th;
  ctx.font = "13px monospace";
  const lengths = [];
  for (let r = 0; r < SHOTS.length; r++) {
    const v = await load(SHOTS[r].clip);
    lengths.push(`${SHOTS[r].clip} ${v.duration.toFixed(1)}s`);
    for (let c = 0; c < cols && c < v.duration; c++) {
      await seek(v, c);
      ctx.drawImage(v, c * tw, r * th, tw - 2, th - 2);
      ctx.fillStyle = "#ff0";
      ctx.fillText(String(c), c * tw + 4, r * th + 15);
    }
    v.remove();
  }
  window.__done = lengths.join("; ");
}
