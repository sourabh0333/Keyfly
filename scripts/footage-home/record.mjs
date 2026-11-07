// Cuts the real recording for the homepage's "Your footage" section
// (loop.js) from one Mixkit stock clip and saves two loops of the same
// frames: public/video/footage-raw.mp4 (the raw recording, flat, for
// "By hand") and public/video/footage-cut.mp4 (graded, for "With KeyFly"),
// each with a .webp poster.
//
// The source clip is not kept in the repository. Download it into any
// folder as video-call.mp4, then:
//   node scripts/footage-home/record.mjs <folder with the clip>
//   open http://127.0.0.1:4426/?record in Chrome and wait until it saves
//   both loops (the frames are collected by playback, then encoded at
//   exact timestamps).
// http://127.0.0.1:4426/?sheet shows the clip every half second, for
// picking the in-point.
//
// Clip (the Full HD download; its page says "Mixkit Stock Video Free
// License": commercial use, no attribution; checked 2026-11-07, not
// "Restricted"):
//   video-call.mp4  mixkit.co/free-stock-video/guy-facing-in-the-middle-of-a-video-call-on-10457/
//                   (assets.mixkit.co/videos/10457/10457-1080.mp4)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outDir = path.join(root, "public/video");
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4" };
const allowed = new Set(["footage-raw.mp4", "footage-raw.webp", "footage-cut.mp4", "footage-cut.webp"]);

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) return path.join(clips, path.basename(urlPath));
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    // POST /save?file=footage-raw.mp4 (or .webp, or footage-cut.*)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!allowed.has(name)) return res.writeHead(400).end();
      const out = path.join(outDir, name);
      const file = fs.createWriteStream(out);
      req.pipe(file);
      file.on("finish", () => {
        res.end("ok");
        console.log(`Saved public/video/${name} (${fs.statSync(out).size} bytes)`);
      });
      return;
    }
    const file = resolve(decodeURIComponent(url.pathname));
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream", "accept-ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4426, "127.0.0.1", () => console.log(`Footage loops at http://127.0.0.1:4426/ (clip from ${clips})`));
