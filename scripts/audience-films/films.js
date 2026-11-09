// The four films in "Who it's for", one real stock clip per role (see
// record.mjs): Marketers & founders, 16:9 (a founder pitching by a
// whiteboard); Product & SaaS teams, 16:9 (a dashboard walked through on a
// screen); Creators, 9:16 (a creator filming a guest at a desk); Podcasters,
// 9:16 (a host in headphones at a studio mic). Graded gently towards the
// site's dusk with a soft vignette. Each loop's end cross-fades into the
// footage just before its in-point, so it loops without a seam. The 9:16
// films also get a blurred, darkened still ({id}-back.webp) that fills the
// panel around them.
//
// ?record saves all four (?record&only=creators for some); ?sheet draws each
// clip every second (by seeking), for picking `from` and `focus`.

const FPS = 30;
const LOOP = 6; // s (a film may set its own len)
const XF = 0.6; // s, the seam

// id: the file's name (the role's); w × h: its shape; clip: the source;
// from: the in-point; focus: where the crop centres (x, y).
const FILMS = [
  { id: "marketers", w: 960, h: 540, clip: "1817-720", from: 6, focus: [0.5, 0.5] },
  { id: "product", w: 960, h: 540, clip: "42650-720", from: 0.65, len: 3.3, focus: [0.5, 0.5] }, // a short clip
  { id: "creators", w: 360, h: 640, clip: "34485-720", from: 3, focus: [0.26, 0.5] },
  { id: "podcasters", w: 360, h: 640, clip: "44048-720", from: 4, focus: [0.5, 0.5] },
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

// Draws src to cover W × H around film.focus, `zoom` larger than cover.
function cover(src, film, W, H, alpha = 1, zoom = 1.03, filter = "brightness(1.02) contrast(1.05) saturate(0.94)") {
  const vw = src.videoWidth || src.width;
  const vh = src.videoHeight || src.height;
  const k = Math.max(W / vw, H / vh) * zoom;
  const w = vw * k;
  const h = vh * k;
  const x = clamp(W / 2 - film.focus[0] * w, W - w, 0);
  const y = clamp(H / 2 - film.focus[1] * h, H - h, 0);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = filter;
  ctx.drawImage(src, x, y, w, h);
  ctx.restore();
}

function grade(W, H) {
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(80, 70, 165, 0.36)");
  g.addColorStop(0.55, "rgba(140, 92, 140, 0.1)");
  g.addColorStop(1, "rgba(236, 150, 108, 0.3)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const m = Math.max(W, H);
  const v = ctx.createRadialGradient(W / 2, H / 2, m * 0.3, W / 2, H / 2, m * 0.72);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,12,0.45)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// The frames a loop needs, by seeking frame by frame, from just before its
// in-point (for the seam) to its end.
async function collect(film) {
  const v = await load(film.clip);
  const list = [];
  for (let m = film.from - XF - 0.05; m <= film.from + (film.len ?? LOOP) + 0.05; m += 1 / FPS) {
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

const save = (blob, file) => fetch(`/save?file=${file}`, { method: "POST", body: blob });
const webp = () => new Promise((r) => canvas.toBlob(r, "image/webp", 0.8));

if (params.has("record")) {
  const { mp4 } = await import("./mp4.js");
  const only = params.get("only")?.split(",");
  const report = [];
  for (const film of FILMS.filter((f) => !only || only.includes(f.id))) {
    const { w: W, h: H } = film;
    const list = await collect(film);
    const len = film.len ?? LOOP;

    // The 9:16 films' surround: the poster frame, wide, blurred and dark.
    if (H > W) {
      canvas.width = 480;
      canvas.height = 270;
      ctx.fillStyle = "#0e0f12";
      ctx.fillRect(0, 0, 480, 270);
      cover(nearest(list, film.from + len * 0.3), { focus: [0.5, 0.5] }, 480, 270, 1, 1.25, "blur(16px) brightness(0.5) saturate(0.85)");
      await save(await webp(), `${film.id}-back.webp`);
    }

    canvas.width = W;
    canvas.height = H;
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
    encoder.configure({ codec: "avc1.4d401f", width: W, height: H, bitrate: 900_000, framerate: FPS, avc: { format: "avc" }, latencyMode: "quality" });
    for (let f = 0; f < Math.round(len * FPS); f++) {
      const t = f / FPS;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      cover(nearest(list, film.from + t), film, W, H);
      if (t >= len - XF) cover(nearest(list, film.from + t - len), film, W, H, smooth((t - (len - XF)) / XF));
      grade(W, H);
      if (f === Math.round(len * 0.3 * FPS)) await save(await webp(), `${film.id}.webp`);
      const vf = new VideoFrame(canvas, { timestamp: Math.round((f * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      encoder.encode(vf, { keyFrame: f % FPS === 0 });
      vf.close();
      if (encoder.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
    }
    await encoder.flush();
    encoder.close();
    for (const [, b] of list) b.close();
    const blob = mp4({ width: W, height: H, fps: FPS, avcC, samples });
    await save(blob, `${film.id}.mp4`);
    report.push(`${film.id} ${blob.size} bytes`);
  }
  window.__done = report.join("; ");
} else {
  // A contact sheet: each clip every second, one row per clip.
  const tw = 192;
  const th = 108;
  const cols = 14;
  canvas.width = cols * tw;
  canvas.height = FILMS.length * th;
  ctx.font = "13px monospace";
  const lengths = [];
  for (let r = 0; r < FILMS.length; r++) {
    const v = await load(FILMS[r].clip);
    lengths.push(`${FILMS[r].id} ${v.duration.toFixed(1)}s ${v.videoWidth}x${v.videoHeight}`);
    for (let c = 0; c < cols && c < v.duration; c++) {
      await seek(v, c);
      ctx.drawImage(v, c * tw, r * th, tw - 2, th - 2);
      ctx.fillStyle = "#ff0";
      ctx.fillText(`${FILMS[r].id} ${c}`, c * tw + 4, r * th + 15);
    }
    v.remove();
  }
  window.__done = lengths.join("; ");
}
