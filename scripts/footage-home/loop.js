// The homepage's "Your footage" recording: 8 s of one real talking-head
// stock clip (see record.mjs), saved twice from the same frames so the two
// sides stay in step: "raw" (flat and a little grey, as it comes off the
// camera, for "By hand") and "cut" (graded towards the site's dusk with a
// soft vignette and a slow push-in, for "With KeyFly"). The last moments
// cross-fade into the footage just before the in-point, so each loops
// without a seam.
//
// ?record saves both loops and their posters; ?sheet draws the clip every
// half second (by seeking, so only roughly right), for picking FROM.

const W = 960;
const H = 540;
const FPS = 30;
const LOOP = 8; // s
const XF = 0.6; // s the seam's cross-fade lasts
const FROM = 1.2; // the in-point in the clip
const CLIP = "video-call";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(location.search);
const smooth = (x) => x * x * (3 - 2 * x);

const LOOKS = {
  raw: { filter: "contrast(0.9) saturate(0.7) brightness(1.08)", zoom: () => 1.02, grade: false },
  // A slow push-in over the loop, eased so the seam matches.
  cut: { filter: "contrast(1.06) saturate(0.95) brightness(1.16)", zoom: (t) => 1.04 + 0.05 * (0.5 - 0.5 * Math.cos((2 * Math.PI * t) / LOOP)), grade: true },
};

function load() {
  return new Promise((res, rej) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = `/clips/${CLIP}.mp4`;
    v.addEventListener("loadeddata", () => res(v), { once: true });
    v.addEventListener("error", () => rej(new Error(CLIP)), { once: true });
  });
}

// Cover the frame, centred a little above the middle (on his face).
function cover(src, look, t, alpha = 1) {
  const vw = src.videoWidth || src.width;
  const vh = src.videoHeight || src.height;
  const k = Math.max(W / vw, H / vh) * look.zoom(t);
  const w = vw * k;
  const h = vh * k;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = look.filter;
  ctx.drawImage(src, (W - w) / 2, (H - h) * 0.3, w, h);
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
  const v = ctx.createRadialGradient(W / 2, H * 0.42, H * 0.38, W / 2, H / 2, H * 1.0);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,12,0.5)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// Collect the frames the loop needs, from just before the in-point (for
// the seam) to its end. By default it seeks frame by frame: this clip seeks
// cleanly, and seeking also works in a background tab, where playback hands
// out no frames. ?play collects by playing instead (fast up to the range,
// half speed through it), for files that seek badly.
async function collect() {
  const v = await load();
  const vw = v.videoWidth;
  const vh = v.videoHeight;
  const k = Math.min(1, 1080 / vh);
  const from = FROM - XF - 0.05;
  const until = FROM + LOOP + 0.05;
  const list = [];
  if (!params.has("play")) {
    for (let m = from; m <= until; m += 1 / FPS) {
      await new Promise((r) => {
        v.addEventListener("seeked", r, { once: true });
        v.currentTime = m;
      });
      list.push([m, await createImageBitmap(v, { resizeWidth: Math.round(vw * k), resizeHeight: Math.round(vh * k) })]);
    }
    v.remove();
    return list;
  }
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

function nearest(list, m) {
  let best = list[0][1];
  for (const [t, bmp] of list) if (t <= m + 0.001) best = bmp;
  return best;
}

if (params.has("record")) {
  canvas.width = W;
  canvas.height = H;
  const { mp4 } = await import("./mp4.js");
  const list = await collect();
  const report = [`${list.length} frames`];
  for (const [name, look] of Object.entries(LOOKS)) {
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
    for (let f = 0; f < LOOP * FPS; f++) {
      const t = f / FPS;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      cover(nearest(list, FROM + t), look, t);
      if (t >= LOOP - XF) cover(nearest(list, FROM + t - LOOP), look, t, smooth((t - (LOOP - XF)) / XF));
      if (look.grade) grade();
      if (f === 0) {
        const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.8));
        await fetch(`/save?file=footage-${name}.webp`, { method: "POST", body: poster });
      }
      const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      encoder.encode(vf, { keyFrame: f % FPS === 0 });
      vf.close();
      if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
    }
    await encoder.flush();
    encoder.close();
    const blob = mp4({ width: W, height: H, fps: FPS, avcC, samples });
    await fetch(`/save?file=footage-${name}.mp4`, { method: "POST", body: blob });
    report.push(`${name} ${blob.size} bytes`);
  }
  for (const [, b] of list) b.close();
  window.__done = report.join("; ");
} else {
  // A contact sheet: the clip every half second.
  const v = await load();
  const cols = 5;
  const tw = 240;
  const th = 135;
  const n = Math.floor(v.duration / 0.5);
  canvas.width = cols * tw;
  canvas.height = Math.ceil(n / cols) * th;
  ctx.font = "13px monospace";
  for (let i = 0; i < n; i++) {
    const t = i * 0.5;
    await new Promise((res) => {
      v.addEventListener("seeked", () => setTimeout(res, 120), { once: true });
      v.currentTime = t;
    });
    const x = (i % cols) * tw;
    const y = Math.floor(i / cols) * th;
    ctx.drawImage(v, x, y, tw - 2, th - 2);
    ctx.fillStyle = "#ff0";
    ctx.fillText(t.toFixed(1), x + 4, y + 15);
  }
  window.__done = `sheet ${v.duration.toFixed(2)}s`;
}
