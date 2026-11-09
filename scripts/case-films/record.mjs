// Cuts the six films in the homepage's "Use cases" viewer (films.js) from
// Mixkit stock clips and saves each, in its use case's shape, as
// public/video/cases/{kind}.mp4 with a .webp poster.
//
// The source clips are not kept in the repository. Download them into any
// folder under their Mixkit names, then:
//   node scripts/case-films/record.mjs <folder with the clips>
//   open http://127.0.0.1:4433/?record and wait until it saves all six
//   (frames are collected by seeking, then encoded at exact timestamps).
// http://127.0.0.1:4433/?sheet shows each clip every second;
// ?frame=demo&t=2 draws one finished frame.
//
// Clips (the 720p downloads; their pages say "Mixkit Stock Video Free
// License": commercial use, no attribution; checked 2026-11-09, not
// "Restricted"):
//   3257-720.mp4   mixkit.co/free-stock-video/couple-of-men-working-with-design-software-3257/
//   4547-720.mp4   mixkit.co/free-stock-video/people-having-a-work-meeting-around-a-table-4547/
//   42122-720.mp4  mixkit.co/free-stock-video/couple-opening-a-package-with-an-alarm-clock-42122/
//   51257-720.mp4  mixkit.co/free-stock-video/a-young-woman-captured-eating-a-delicious-ramen-and-engaging-51257/
//   100088-720.mp4 mixkit.co/free-stock-video/a-sleek-tablet-featuring-a-green-screen-100088/
//                  (assets.mixkit.co/active_storage/video_items/100088/1719948852/100088-video-720.mp4)
//   52076-720.mp4  mixkit.co/free-stock-video/on-a-round-table-the-hands-of-a-young-man-52076/
//   478-720.mp4    mixkit.co/free-stock-video/a-long-haired-woman-singing-on-stage-478/
//   4269-720.mp4   mixkit.co/free-stock-video/audience-at-a-concert-4269/
//   486-720.mp4    mixkit.co/free-stock-video/guitarist-playing-on-stage-486/
//   4187-720.mp4   mixkit.co/free-stock-video/dj-playing-on-a-stage-with-led-screens-4187/
//   52181-720.mp4  mixkit.co/free-stock-video/three-women-in-their-thirties-talking-on-a-podcast-52181/
//
// The titles and captions burnt in are set in the site's own fonts
// (src/fonts, served at /fonts/).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outDir = path.join(root, "public/video/cases");
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const allowed = /^(launch|ugc|explainer|montage|demo|podcast)\.(mp4|webp)$/;

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) return path.join(clips, path.basename(urlPath));
  if (urlPath.startsWith("/fonts/")) return path.join(root, "src/fonts", path.basename(urlPath));
  if (urlPath.startsWith("/brand/")) return path.join(root, "public/brand", path.basename(urlPath));
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    // POST /save?file=demo.mp4 (or .webp)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!allowed.test(name)) return res.writeHead(400).end();
      fs.mkdirSync(outDir, { recursive: true });
      const out = path.join(outDir, name);
      const file = fs.createWriteStream(out);
      req.pipe(file);
      file.on("finish", () => {
        res.end("ok");
        console.log(`Saved public/video/cases/${name} (${fs.statSync(out).size} bytes)`);
      });
      return;
    }
    const file = resolve(decodeURIComponent(url.pathname));
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream", "accept-ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4433, "127.0.0.1", () => console.log(`Use case films at http://127.0.0.1:4433/ (clips from ${clips})`));
