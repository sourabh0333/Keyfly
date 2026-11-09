// Cuts the three opening shots for the homepage's "You make the calls"
// (hooks.js), one per hook option, from six Mixkit stock clips and saves
// public/video/call-hook-{1,2,3}.mp4 with a .webp poster each: 1 Title
// line, 2 Product demo, 3 Quick montage.
//
// The source clips are not kept in the repository. Download them into any
// folder under their Mixkit names, then:
//   node scripts/call-hooks/record.mjs <folder with the clips>
//   open http://127.0.0.1:4429/?record and wait until it saves all three
//   (frames are collected by seeking, then encoded at exact timestamps).
// http://127.0.0.1:4429/?sheet shows each clip every second, for picking
// the in-points.
//
// Clips (the 720p downloads; their pages say "Mixkit Stock Video Free
// License": commercial use, no attribution; checked 2026-11-09, not
// "Restricted"):
//   41161-720.mp4  mixkit.co/free-stock-video/night-movement-of-a-main-avenue-of-a-big-city-41161/
//   43259-720.mp4  mixkit.co/free-stock-video/woman-working-on-laptop-she-drinks-coffee-43259/
//   44737-720.mp4  mixkit.co/free-stock-video/man-working-on-computer-with-chroma-green-background-44737/
//   100079-720.mp4 mixkit.co/free-stock-video/mobile-phone-featuring-a-green-screen-surrounded-by-several-books-100079/
//                  (assets.mixkit.co/active_storage/video_items/100079/1719944500/100079-video-720.mp4)
//   4911-720.mp4   mixkit.co/free-stock-video/young-woman-lying-down-watching-images-on-her-cell-phone-4911/
//   39774-720.mp4  mixkit.co/free-stock-video/hands-of-a-young-woman-typing-on-her-smartphone-39774/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outDir = path.join(root, "public/video");
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4", ".svg": "image/svg+xml" };

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) return path.join(clips, path.basename(urlPath));
  // The brand kit symbol, drawn unchanged on the keyed screens.
  if (urlPath === "/brand/symbol-dark.svg") return path.join(root, "public/brand/symbol-dark.svg");
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    // POST /save?file=call-hook-1.mp4 (or .webp)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!/^call-hook-[1-3]\.(mp4|webp)$/.test(name)) return res.writeHead(400).end();
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
  .listen(4429, "127.0.0.1", () => console.log(`You make the calls hooks at http://127.0.0.1:4429/ (clips from ${clips})`));
