// The Footage section's recording on the Product page: 8 s of a real
// talking-head stock clip (see record.mjs), graded gently towards the
// site's dusk (violet above, a little peach below) with a lens vignette.
// To loop without a seam, the last 0.6 s cross-fades into the 0.6 s of
// footage just before the in-point, so the end flows into the start.
//
// ?t=3.2 draws one frame; ?record records the loop and its poster;
// ?sheet&from=0&step=0.2&crop=x,y,w,h draws a contact sheet of a region.

const W = 1280;
const H = 720;
const LOOP = 8;
const FROM = 3; // the in-point in the clip
const FADE = 0.6; // the cross-fade back to the start
const ZOOM = 1.04; // a touch of reframing, so the edges stay clean

const canvas = document.querySelector("canvas");
canvas.width = W;
canvas.height = H;
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(location.search);

function load() {
  return new Promise((res, rej) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = "/clips/vlog-studio.mp4";
    v.addEventListener("loadeddata", () => res(v), { once: true });
    v.addEventListener("error", () => rej(new Error("clip")), { once: true });
  });
}
const seek = (v, t) =>
  new Promise((r) => {
    v.addEventListener("seeked", r, { once: true });
    v.currentTime = t;
  });

function draw(v, alpha = 1) {
  const w = W * ZOOM;
  const h = H * ZOOM;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.filter = "contrast(1.05) saturate(0.92)";
  ctx.drawImage(v, (W - w) / 2, (H - h) * 0.35, w, h);
  ctx.restore();
}

function grade() {
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(92, 82, 170, 0.5)");
  g.addColorStop(0.6, "rgba(120, 96, 150, 0.2)");
  g.addColorStop(1, "rgba(226, 150, 112, 0.45)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const v = ctx.createRadialGradient(W * 0.55, H * 0.42, H * 0.35, W / 2, H / 2, H * 1.05);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,12,0.55)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// a plays the loop; b holds the footage just before the in-point, which
// the end fades into.
function frame(t, a, b) {
  draw(a);
  if (t > LOOP - FADE) draw(b, (t - (LOOP - FADE)) / FADE);
  grade();
}

const a = await load();
const b = await load();

if (params.has("record")) {
  await seek(a, FROM);
  frame(0, a, b);
  const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.82));
  await fetch("/poster", { method: "POST", body: poster });

  await seek(b, FROM - FADE);
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: "video/mp4;codecs=avc1.640028", videoBitsPerSecond: 1_400_000 });
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    await fetch("/save", { method: "POST", body: blob });
    window.__done = blob.size;
  };
  await a.play();
  const start = performance.now();
  recorder.start(1000);
  let fading = false;
  const tick = () => {
    const t = (performance.now() - start) / 1000;
    if (!fading && t >= LOOP - FADE) {
      fading = true;
      b.play();
    }
    frame(Math.min(t, LOOP - 0.001), a, b);
    if (t < LOOP) setTimeout(tick, 1000 / 60);
    else recorder.stop();
  };
  tick();
} else if (params.has("sheet")) {
  const from = Number(params.get("from") || 0);
  const step = Number(params.get("step") || 0.25);
  const [cx, cy, cw, ch] = (params.get("crop") || `0,0,${W},${H}`).split(",").map(Number);
  const cols = 10;
  const rows = 8;
  const w = 160;
  const h = 120;
  canvas.width = cols * w;
  canvas.height = rows * h;
  ctx.font = "12px sans-serif";
  for (let i = 0; i < cols * rows; i++) {
    const t = from + i * step;
    if (t > a.duration) break;
    await seek(a, t);
    const x = (i % cols) * w;
    const y = Math.floor(i / cols) * h;
    ctx.drawImage(a, cx, cy, cw, ch, x, y, w, h);
    ctx.fillStyle = "#ff0";
    ctx.fillText(t.toFixed(2), x + 3, y + 13);
  }
  window.__done = "sheet";
} else {
  const t = Number(params.get("t") || 0);
  await seek(a, FROM + t);
  await seek(b, FROM + t - LOOP);
  frame(t, a, b);
  window.__done = "frame";
}
