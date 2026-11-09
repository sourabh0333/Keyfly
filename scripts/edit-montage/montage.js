// The montage in "Edit with words": an illustrative event promo cut from
// three real stock clips (see record.mjs), hard cuts on the beat, 8 s. It
// is saved twice from the same frames so the two sides stay in step:
// "before", the first cut (flat and a little grey, for Before), and
// "after" (graded towards the site's dusk with a soft vignette and a slow
// push-in on each shot, for After; the page lays the asked-for edits over
// it). Its end cuts straight back to its start, a cut like the others, so
// it loops without a seam.
//
// ?record saves both loops and their posters; ?sheet draws each clip every
// second (by seeking), for picking the in-points.

const W = 960;
const H = 600; // 16:10, the section's picture box
const FPS = 30;

// clip: the source; from: its in-point; len: seconds on screen; focus:
// where the frame centres (After narrows to 9:16 around the middle);
// lift: exposure (the festival stage is blown out).
const SHOTS = [
  { clip: "4188-720", from: 4, len: 2.8, focus: [0.5, 0.5], lift: 0.8 },
  { clip: "42299-720", from: 2, len: 2.6, focus: [0.5, 0.45] },
  { clip: "4064-720", from: 6, len: 2.6, focus: [0.5, 0.5] },
];
const LOOP = SHOTS.reduce((s, x) => s + x.len, 0);

const LOOKS = {
  before: { filter: "contrast(0.9) saturate(0.72) brightness(1.02)", push: 0, grade: false },
  after: { filter: "contrast(1.06) saturate(1.02) brightness(1.06)", push: 0.06, grade: true },
};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(location.search);
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

function cover(src, shot, look, p) {
  const vw = src.videoWidth || src.width;
  const vh = src.videoHeight || src.height;
  const k = Math.max(W / vw, H / vh) * (1.02 + look.push * p);
  const w = vw * k;
  const h = vh * k;
  const x = clamp(W / 2 - shot.focus[0] * w, W - w, 0);
  const y = clamp(H / 2 - shot.focus[1] * h, H - h, 0);
  ctx.save();
  ctx.filter = `${look.filter} brightness(${shot.lift ?? 1})`;
  ctx.drawImage(src, x, y, w, h);
  ctx.restore();
}

function grade() {
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(80, 70, 165, 0.4)");
  g.addColorStop(0.55, "rgba(140, 92, 140, 0.12)");
  g.addColorStop(1, "rgba(236, 150, 108, 0.34)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.42, W / 2, H / 2, H * 1.0);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,12,0.5)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// Every frame of every shot, by seeking frame by frame.
async function collect() {
  const all = [];
  for (const shot of SHOTS) {
    const v = await load(shot.clip);
    const list = [];
    for (let f = 0; f < Math.round(shot.len * FPS); f++) {
      await seek(v, shot.from + f / FPS);
      list.push(await createImageBitmap(v));
    }
    v.remove();
    all.push(list);
  }
  return all;
}

if (params.has("record")) {
  canvas.width = W;
  canvas.height = H;
  const { mp4 } = await import("./mp4.js");
  const frames = await collect();
  const report = [`${frames.flat().length} frames, ${LOOP.toFixed(1)} s`];
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
    encoder.configure({ codec: "avc1.4d401f", width: W, height: H, bitrate: 1_400_000, framerate: FPS, avc: { format: "avc" }, latencyMode: "quality" });
    let f = 0;
    for (let s = 0; s < SHOTS.length; s++) {
      const list = frames[s];
      for (let i = 0; i < list.length; i++, f++) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, W, H);
        cover(list[i], SHOTS[s], look, i / list.length);
        if (look.grade) grade();
        if (s === 0 && i === Math.round(list.length * 0.5)) {
          const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.8));
          await fetch(`/save?file=edit-${name}.webp`, { method: "POST", body: poster });
        }
        const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
        // A key frame at every cut, and every second.
        encoder.encode(vf, { keyFrame: i === 0 || f % FPS === 0 });
        vf.close();
        if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
      }
    }
    await encoder.flush();
    encoder.close();
    const blob = mp4({ width: W, height: H, fps: FPS, avcC, samples });
    await fetch(`/save?file=edit-${name}.mp4`, { method: "POST", body: blob });
    report.push(`${name} ${blob.size} bytes`);
  }
  for (const b of frames.flat()) b.close();
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
      await seek(v, c * Math.max(1, v.duration / cols));
      ctx.drawImage(v, c * tw, r * th, tw - 2, th - 2);
      ctx.fillStyle = "#ff0";
      ctx.fillText((c * Math.max(1, v.duration / cols)).toFixed(1), c * tw + 4, r * th + 15);
    }
    v.remove();
  }
  window.__done = lengths.join("; ");
}
