// Cuts the three shots for the homepage's "How it works" editor (shots.js)
// from three Mixkit stock clips and saves public/video/how-shot-{1,2,3}.mp4
// with a .webp poster each: Launch day, Built for speed, Try it today.
//
// The source clips are not kept in the repository. Download them into any
// folder under their Mixkit names, then:
//   node scripts/how-shots/record.mjs <folder with the clips>
//   open http://127.0.0.1:4427/?record and wait until it saves all three
//   (frames are collected by seeking, then encoded at exact timestamps).
// http://127.0.0.1:4427/?sheet shows each clip every second, for picking
// the in-points.
//
// Clips (the 720p downloads; their pages say "Mixkit Stock Video Free
// License": commercial use, no attribution; checked 2026-11-09, not
// "Restricted"):
//   4837-720.mp4   mixkit.co/free-stock-video/young-man-on-the-street-typing-on-his-cell-phone-4837/
//   1711-720.mp4   mixkit.co/free-stock-video/a-person-texting-on-a-smartphone-1711/
//   41375-720.mp4  mixkit.co/free-stock-video/tour-high-above-a-city-at-dusk-41375/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outDir = path.join(root, "public/video");
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4" };

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) return path.join(clips, path.basename(urlPath));
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    // POST /save?file=how-shot-1.mp4 (or .webp)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!/^how-shot-[1-3]\.(mp4|webp)$/.test(name)) return res.writeHead(400).end();
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
  .listen(4427, "127.0.0.1", () => console.log(`How it works shots at http://127.0.0.1:4427/ (clips from ${clips})`));
