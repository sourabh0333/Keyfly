// The film in the Integrations page's "Your editor" panel, the cut you take
// to another editor: an illustrative 8 s road-trip film from three real
// landscape stock clips (see record.mjs): an aerial over a road at sunset,
// a woman in the sunroof with her arm in the wind, a couple raising their
// arms in a meadow. Each shot pushes in slowly, shots dissolve into each
// other, and the footage is graded gently towards the site's dusk with a
// soft vignette.
//
// ?record makes public/video/road-reel.mp4 and its poster; ?t=3.2 draws
// one frame (by seeking, so only roughly right).

const W = 1280;
const H = 720;
const FPS = 30;
const LOOP = 8;
const FADE = 0.35; // s each dissolve lasts

// The shots: which clip, where to start in it, when the shot runs, the
// point the push-in heads for, how far it pushes, and a small exposure lift.
// In-points are where each clip moves most (measured frame to frame).
const SHOTS = [
  { clip: "50267-1080", from: 0.5, start: 0, end: 2.8, focus: [0.5, 0.6], push: [1.03, 1.12], lift: 1.0 },
  { clip: "41570-1080", from: 0.1, start: 2.8, end: 5.2, focus: [0.4, 0.4], push: [1.1, 1.02], lift: 1.02 },
  { clip: "41568-1080", from: 7.2, start: 5.2, end: LOOP, focus: [0.5, 0.48], push: [1.04, 1.13], lift: 1.0 },
];

const canvas = document.querySelector("canvas");
canvas.width = W;
canvas.height = H;
canvas.style.width = `${W / 2}px`;
canvas.style.height = `${H / 2}px`;
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(location.search);

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const smooth = (x) => x * x * (3 - 2 * x);
const dims = (v) => [v.videoWidth || v.width, v.videoHeight || v.height];
const shotAt = (t) => SHOTS.find((s) => t >= s.start && t < s.end) || SHOTS[SHOTS.length - 1];

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

// Draw a picture to cover the frame, pushed in by `zoom` towards the focus.
function cover(src, zoom, [fx, fy], alpha = 1, lift = 1) {
  const [vw, vh] = dims(src);
  const s = Math.max(W / vw, H / vh) * zoom;
  const w = vw * s;
  const h = vh * s;
  const x = clamp(W / 2 - fx * w + (fx - 0.5) * W * 0.6, W - w, 0);
  const y = clamp(H / 2 - fy * h + (fy - 0.5) * H * 0.6, H - h, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = `brightness(${lift}) saturate(0.92) contrast(1.05)`;
  ctx.drawImage(src, x, y, w, h);
  ctx.restore();
}

function grade() {
  // Towards dusk: a little violet from the top, a little peach from the foot.
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(70, 62, 160, 0.42)");
  g.addColorStop(0.55, "rgba(140, 92, 140, 0.12)");
  g.addColorStop(1, "rgba(236, 150, 108, 0.34)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  // A soft vignette.
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.42, W / 2, H / 2, H * 1.05);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,10,0.5)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

const zoomAt = (shot, t) => {
  const p = smooth(clamp((t - shot.start) / (shot.end - shot.start + FADE), 0, 1));
  return shot.push[0] + (shot.push[1] - shot.push[0]) * p;
};

// One frame at time t. `pick(i, t)` returns the picture for shot i at t.
function frame(t, pick) {
  const shot = shotAt(t);
  const i = SHOTS.indexOf(shot);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const since = t - shot.start;
  if (i > 0 && since < FADE) {
    // Dissolve: the previous shot carries on underneath.
    const prev = SHOTS[i - 1];
    cover(pick(i - 1, t), zoomAt(prev, t), prev.focus, 1, prev.lift);
    cover(pick(i, t), zoomAt(shot, t), shot.focus, smooth(since / FADE), shot.lift);
  } else {
    cover(pick(i, t), zoomAt(shot, t), shot.focus, 1, shot.lift);
  }
  grade();
}

// Collect the frames a shot needs (plus the dissolve's overhang) by
// playing its clip, fast up to the range and at half speed through it.
// Seeking isn't trusted: some stock files return black or stale frames.
async function collect(i) {
  const shot = SHOTS[i];
  const v = await load(shot.clip);
  const [vw, vh] = dims(v);
  const k = Math.min(1, 1440 / vw);
  const from = shot.from - 0.05;
  const until = shot.from + (shot.end - shot.start) + FADE + 0.05;
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

// The last collected frame at or before the shot's moment for time t.
function nearest(list, shot, t) {
  const want = shot.from + (t - shot.start);
  let best = list[0][1];
  for (const [m, bmp] of list) if (m <= want + 0.001) best = bmp;
  return best;
}

if (params.has("record")) {
  const inter = new FontFace("Inter", "url(/fonts/inter-latin-wght-normal.woff2)", { weight: "100 900" });
  document.fonts.add(await inter.load());
  const { mp4 } = await import("./mp4.js");
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
  encoder.configure({ codec: "avc1.4d401f", width: W, height: H, bitrate: 2_000_000, framerate: FPS, avc: { format: "avc" }, latencyMode: "quality" });

  // Shot by shot, so only two shots' frames are held at once.
  const lists = [];
  const counts = [];
  for (let i = 0; i < SHOTS.length; i++) {
    lists[i] = await collect(i);
    counts.push(lists[i].length);
    if (i >= 2) {
      for (const [, b] of lists[i - 2]) b.close();
      lists[i - 2] = null;
    }
    const pick = (j, t) => nearest(lists[j], SHOTS[j], t);
    const shot = SHOTS[i];
    for (let f = Math.round(shot.start * FPS); f < Math.round(shot.end * FPS); f++) {
      const t = f / FPS;
      frame(t, pick);
      if (i === 0 && f === Math.round(1.4 * FPS)) {
        // The poster: the aerial over the sunset road.
        const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.82));
        await fetch("/poster", { method: "POST", body: poster });
      }
      const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      encoder.encode(vf, { keyFrame: f % FPS === 0 });
      vf.close();
      if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
    }
  }
  await encoder.flush();
  const blob = mp4({ width: W, height: H, fps: FPS, avcC, samples });
  await fetch("/save", { method: "POST", body: blob });
  window.__done = `${blob.size} bytes; frames collected per shot ${counts.join(", ")}`;
} else {
  // One rough still at ?t= (seeking each clip).
  const t = Number(params.get("t") || 0);
  const videos = await Promise.all(SHOTS.map((s) => load(s.clip)));
  await Promise.all(
    SHOTS.map(
      (s, i) =>
        new Promise((r) => {
          videos[i].addEventListener("seeked", () => setTimeout(r, 300), { once: true });
          videos[i].currentTime = s.from + clamp(t - s.start, 0, s.end - s.start + FADE);
        }),
    ),
  );
  frame(t, (i) => videos[i]);
  window.__done = "frame";
}
