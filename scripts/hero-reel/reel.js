// The hero viewer's clip on the Product page: an illustrative 8 s launch
// film cut from three real stock clips (see record.mjs), in the site's
// look: each shot pushes in slowly, a soft flash marks each cut, the
// footage is graded towards the site's dusk violet and peach, and the
// title lands a word at a time on the beat ("Launch", "day", "is here."
// with the mint point), as the CSS preview it replaces did. The viewer's
// own player bar sits beneath it on the page. The loop is seamless: the
// last shot cuts back to the first on the beat.
//
// ?t=3.2 draws one frame; ?record records the loop and its poster;
// ?sheet draws a contact sheet of each clip.

const W = 960;
const H = 540;
const LOOP = 8;
const MINT = "#5fe0b0";

// The shots: which clip, where to start in it, when the shot runs, the
// point the push-in heads for, how much to lift its exposure, its word.
const SHOTS = [
  { clip: "sunset-texting", from: 6.0, start: 0, end: 2.8, focus: [0.28, 0.5], lift: 0.92, word: "Launch" },
  { clip: "city-dusk", from: 3.0, start: 2.8, end: 5.5, focus: [0.5, 0.45], lift: 1.45, word: "day" },
  { clip: "hands-city-lights", from: 1.2, start: 5.5, end: LOOP, focus: [0.5, 0.5], lift: 0.72, word: "is here", point: true },
];

const canvas = document.querySelector("canvas");
canvas.width = W;
canvas.height = H;
canvas.style.width = `${W}px`;
canvas.style.height = `${H}px`;
const ctx = canvas.getContext("2d");
const params = new URLSearchParams(location.search);

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeOut = (x) => 1 - (1 - x) ** 3;

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

// Draw a video frame to cover the canvas, scaled up by `zoom` towards the
// focus point.
function cover(v, zoom, [fx, fy]) {
  const s = Math.max(W / v.videoWidth, H / v.videoHeight) * zoom;
  const w = v.videoWidth * s;
  const h = v.videoHeight * s;
  const x = clamp(W / 2 - fx * w + (fx - 0.5) * W * 0.6, W - w, 0);
  const y = clamp(H / 2 - fy * h + (fy - 0.5) * H * 0.6, H - h, 0);
  ctx.drawImage(v, x, y, w, h);
}

function grade() {
  // Towards dusk: violet from the top, peach from the foot.
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(64, 58, 150, 0.85)");
  g.addColorStop(0.55, "rgba(140, 92, 140, 0.35)");
  g.addColorStop(1, "rgba(232, 150, 110, 0.6)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  // A soft scrim behind the title, so the word reads on bright footage.
  const s = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.42);
  s.addColorStop(0, "rgba(10,8,20,0.32)");
  s.addColorStop(1, "rgba(10,8,20,0)");
  ctx.fillStyle = s;
  ctx.fillRect(0, 0, W, H);
  // A lens vignette.
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(6,5,10,0.6)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}

// The word for a shot, rising out of a blur as it lands.
function title(shot, t) {
  const k = easeOut(clamp((t - shot.start - 0.22) / 0.45, 0, 1));
  if (k <= 0) return;
  ctx.save();
  ctx.globalAlpha = k;
  ctx.font = "700 88px Inter";
  ctx.letterSpacing = "-3px";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 30;
  ctx.filter = `blur(${((1 - k) * 8).toFixed(1)}px)`;
  const y = H / 2 + (1 - k) * 18;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(shot.word, W / 2, y);
  if (shot.point) {
    // The mint point after the last word.
    const w = ctx.measureText(shot.word).width;
    ctx.filter = "none";
    ctx.shadowColor = MINT;
    ctx.shadowBlur = 18;
    ctx.fillStyle = MINT;
    ctx.beginPath();
    ctx.arc(W / 2 + w / 2 + 14, y + 26, 9 * k, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function frame(t, videos) {
  const shot = SHOTS.find((s) => t >= s.start && t < s.end) || SHOTS[SHOTS.length - 1];
  const v = videos[shot.clip];
  const p = (t - shot.start) / (shot.end - shot.start);
  ctx.save();
  ctx.filter = `brightness(${shot.lift}) saturate(0.9) contrast(1.06)`;
  cover(v, 1.02 + 0.07 * p, shot.focus);
  ctx.restore();
  grade();
  // A soft flash on each cut.
  const since = t - shot.start;
  if (since < 0.16) {
    ctx.fillStyle = `rgba(255, 250, 240, ${(0.35 * (1 - since / 0.16)).toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
  }
  title(shot, t);
}

async function ready() {
  const inter = new FontFace("Inter", "url(/fonts/inter-latin-wght-normal.woff2)", { weight: "100 900" });
  document.fonts.add(await inter.load());
  const list = await Promise.all(SHOTS.map((s) => load(s.clip)));
  return Object.fromEntries(SHOTS.map((s, i) => [s.clip, list[i]]));
}

// One still frame at time t (seeking its clip first).
async function still(t, videos) {
  const shot = SHOTS.find((s) => t >= s.start && t < s.end) || SHOTS[SHOTS.length - 1];
  await seek(videos[shot.clip], shot.from + (t - shot.start));
  frame(t, videos);
}

const videos = await ready();

if (params.has("record")) {
  // The poster: the first shot with its word landed.
  await still(1.1, videos);
  const poster = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.82));
  await fetch("/poster", { method: "POST", body: poster });

  for (const s of SHOTS) await seek(videos[s.clip], s.from);
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: "video/mp4;codecs=avc1.640028", videoBitsPerSecond: 1_300_000 });
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    await fetch("/save", { method: "POST", body: blob });
    window.__done = blob.size;
  };
  frame(0, videos);
  await videos[SHOTS[0].clip].play();
  const start = performance.now();
  recorder.start(1000);
  let playing = 0;
  const tick = () => {
    const t = (performance.now() - start) / 1000;
    const i = SHOTS.findIndex((s) => t >= s.start && t < s.end);
    if (i > playing) {
      playing = i;
      videos[SHOTS[i].clip].play();
    }
    frame(Math.min(t, LOOP - 0.001), videos);
    if (t < LOOP) setTimeout(tick, 1000 / 60);
    else recorder.stop();
  };
  tick();
} else if (params.has("sheet")) {
  const names = SHOTS.map((s) => s.clip);
  const cols = 10;
  const w = 192;
  const h = 108;
  canvas.width = cols * w;
  canvas.height = names.length * (h + 18);
  ctx.font = "12px sans-serif";
  for (const [r, name] of names.entries()) {
    const v = videos[name];
    for (let c = 0; c < cols; c++) {
      const t = (c * v.duration) / cols;
      await seek(v, t);
      ctx.drawImage(v, c * w, r * (h + 18), w, h);
      ctx.fillStyle = "#fff";
      ctx.fillText(`${name} ${t.toFixed(1)}s ${v.videoWidth}×${v.videoHeight}`, c * w + 4, r * (h + 18) + h + 13);
    }
  }
  window.__done = "sheet";
} else {
  await still(Number(params.get("t") || 0), videos);
  window.__done = "frame";
}
