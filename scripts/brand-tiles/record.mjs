// Cuts the six videos in the homepage's "On brand, every time" reel
// (tiles.js) from Mixkit stock clips and saves each, in its own shape, as
// public/video/brand/{kind}.mp4 with a .webp poster.
//
// The source clips are not kept in the repository. Download them into any
// folder under their Mixkit names, then:
//   node scripts/brand-tiles/record.mjs <folder with the clips>
//   open http://127.0.0.1:4431/?record and wait until it saves all six
//   (frames are collected by seeking, then encoded at exact timestamps).
// http://127.0.0.1:4431/?sheet shows each clip every second.
//
// Clips (the 720p downloads; their pages say "Mixkit Stock Video Free
// License": commercial use, no attribution; checked 2026-11-09, not
// "Restricted"):
//   100319-720.mp4 mixkit.co/free-stock-video/team-collaboration-in-a-colorful-workspace-100319/
//                  (assets.mixkit.co/active_storage/video_items/100319/1722990360/100319-video-720.mp4)
//   50423-720.mp4  mixkit.co/free-stock-video/a-young-influencer-recording-a-moisturizing-skincare-video-at-home-50423/
//   2957-720.mp4   mixkit.co/free-stock-video/female-broadcaster-speaking-to-the-microphone-2957/
//   4623-720.mp4   mixkit.co/free-stock-video/young-teacher-teaching-complicated-equations-4623/
//   1787-720.mp4   mixkit.co/free-stock-video/a-woman-writing-an-email-on-her-smartphone-1787/
//   4185-720.mp4   mixkit.co/free-stock-video/audience-of-a-music-festival-4185/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outDir = path.join(root, "public/video/brand");
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4" };
const allowed = /^(launch|ugc|podcast|explainer|demo|montage)\.(mp4|webp)$/;

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) return path.join(clips, path.basename(urlPath));
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    // POST /save?file=launch.mp4 (or .webp)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!allowed.test(name)) return res.writeHead(400).end();
      fs.mkdirSync(outDir, { recursive: true });
      const out = path.join(outDir, name);
      const file = fs.createWriteStream(out);
      req.pipe(file);
      file.on("finish", () => {
        res.end("ok");
        console.log(`Saved public/video/brand/${name} (${fs.statSync(out).size} bytes)`);
      });
      return;
    }
    const file = resolve(decodeURIComponent(url.pathname));
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream", "accept-ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4431, "127.0.0.1", () => console.log(`On brand tiles at http://127.0.0.1:4431/ (clips from ${clips})`));
