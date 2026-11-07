// Edits the film in the Pricing page's "Bring your own AI" monitor
// (reel.js) from four Mixkit stock clips and saves
// public/video/coffee-reel.mp4 and its poster coffee-reel.webp.
//
// The source clips are not kept in the repository. Download them into any
// folder, then:
//   node scripts/coffee-reel/record.mjs <folder with the clips>
//   open http://127.0.0.1:4425/?record in Chrome and wait until it saves
//   (about a minute: it collects each shot's frames, then encodes them).
// http://127.0.0.1:4425/?t=3.2 shows one rough frame; ?sheet shows each
// clip across its length, for picking in-points.
//
// Clips (the Full HD downloads, kept under their Mixkit names; Mixkit Stock
// Video Free License, commercial or personal use, no attribution; checked
// 2026-11-07):
//   3572-1080.mp4   mixkit.co/free-stock-video/tamping-coffee-for-a-coffee-maker-3572/
//   3576-1080.mp4   mixkit.co/free-stock-video/frothing-milk-seen-in-detail-3576/
//   810-1080.mp4    mixkit.co/free-stock-video/latte-art-810/
//   41858-1080.mp4  mixkit.co/free-stock-video/close-up-view-serving-a-sparkling-cappuccino-41858/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outs = { "/save": "public/video/coffee-reel.mp4", "/poster": "public/video/coffee-reel.webp" };
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4", ".woff2": "font/woff2" };

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) return path.join(clips, path.basename(urlPath));
  if (urlPath.startsWith("/fonts/")) return path.join(root, "src/fonts", path.basename(urlPath));
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    if (req.method === "POST" && outs[req.url]) {
      const out = path.join(root, outs[req.url]);
      const file = fs.createWriteStream(out);
      req.pipe(file);
      file.on("finish", () => {
        res.end("ok");
        console.log(`Saved ${outs[req.url]} (${fs.statSync(out).size} bytes)`);
      });
      return;
    }
    const file = resolve(decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream", "accept-ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4425, "127.0.0.1", () => console.log(`Reel at http://127.0.0.1:4425/ (clips from ${clips})`));
