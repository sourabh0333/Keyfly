// Cuts the montage for the homepage's "Edit with words" (montage.js) from
// three Mixkit stock clips and saves two loops of the same cut:
// public/video/edit-before.mp4 (the first cut, flat) and edit-after.mp4
// (graded, with slow push-ins), each with a .webp poster.
//
// The source clips are not kept in the repository. Download them into any
// folder under their Mixkit names, then:
//   node scripts/edit-montage/record.mjs <folder with the clips>
//   open http://127.0.0.1:4428/?record and wait until it saves both
//   (frames are collected by seeking, then encoded at exact timestamps).
// http://127.0.0.1:4428/?sheet shows each clip every second.
//
// Clips (the 720p downloads; their pages say "Mixkit Stock Video Free
// License": commercial use, no attribution; checked 2026-11-09, not
// "Restricted"):
//   4188-720.mp4   mixkit.co/free-stock-video/stage-of-an-electronic-music-festival-4188/
//   42299-720.mp4  mixkit.co/free-stock-video/pair-of-female-friends-having-fun-on-a-night-out-42299/
//   4064-720.mp4   mixkit.co/free-stock-video/fireworks-at-night-sky-4064/
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
    // POST /save?file=edit-before.mp4 (or .webp, or edit-after.*)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!/^edit-(before|after)\.(mp4|webp)$/.test(name)) return res.writeHead(400).end();
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
  .listen(4428, "127.0.0.1", () => console.log(`Edit with words montage at http://127.0.0.1:4428/ (clips from ${clips})`));
