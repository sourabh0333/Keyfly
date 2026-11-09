// Cuts the four films in the homepage's "Who it's for" panels (films.js)
// from Mixkit stock clips and saves each as public/video/audience/{id}.mp4
// with a .webp poster (and, for the vertical roles, {id}-back.webp: a
// blurred still that fills the panel around the 9:16 frame).
//
// The source clips are not kept in the repository. Download them into any
// folder under their Mixkit names, then:
//   node scripts/audience-films/record.mjs <folder with the clips>
//   open http://127.0.0.1:4432/?record and wait until it saves all four
//   (frames are collected by seeking, then encoded at exact timestamps).
// http://127.0.0.1:4432/?sheet shows each clip every second.
//
// Clips (the 720p downloads; their pages say "Mixkit Stock Video Free
// License": commercial use, no attribution; checked 2026-11-09, not
// "Restricted"):
//   1817-720.mp4  mixkit.co/free-stock-video/man-introducing-a-new-business-project-1817/
//   42650-720.mp4 mixkit.co/free-stock-video/man-exposing-from-a-screen-42650/
//   34485-720.mp4 mixkit.co/free-stock-video/girl-recording-a-influencer-sitting-at-a-desk-34485/
//   44048-720.mp4 mixkit.co/free-stock-video/man-chatting-in-a-studio-for-a-podcast-44048/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outDir = path.join(root, "public/video/audience");
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4" };
const allowed = /^(marketers|product|creators|podcasters)(-back)?\.(mp4|webp)$/;

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) return path.join(clips, path.basename(urlPath));
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    // POST /save?file=creators.mp4 (or .webp, -back.webp)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!allowed.test(name)) return res.writeHead(400).end();
      fs.mkdirSync(outDir, { recursive: true });
      const out = path.join(outDir, name);
      const file = fs.createWriteStream(out);
      req.pipe(file);
      file.on("finish", () => {
        res.end("ok");
        console.log(`Saved public/video/audience/${name} (${fs.statSync(out).size} bytes)`);
      });
      return;
    }
    const file = resolve(decodeURIComponent(url.pathname));
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream", "accept-ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4432, "127.0.0.1", () => console.log(`Who it's for films at http://127.0.0.1:4432/ (clips from ${clips})`));
