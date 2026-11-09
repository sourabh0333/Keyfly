// Cuts the shot for the homepage's "One edit, every format" (shots.js)
// from one Mixkit stock clip and saves public/video/format-loop.mp4 with
// its .webp poster.
//
// The source clip is not kept in the repository. Download it into any
// folder under its Mixkit name, then:
//   node scripts/format-loop/record.mjs <folder with the clip>
//   open http://127.0.0.1:4430/?record and wait until it saves (frames are
//   collected by seeking, then encoded at exact timestamps).
// http://127.0.0.1:4430/?sheet shows the clip every second.
//
// Clip (the 720p download; its page says "Mixkit Stock Video Free License":
// commercial use, no attribution; checked 2026-11-09, not "Restricted"):
//   34468-720.mp4  mixkit.co/free-stock-video/recording-a-blog-girl-walking-down-the-street-34468/
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
    // POST /save?file=format-loop.mp4 (or .webp)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!/^format-loop\.(mp4|webp)$/.test(name)) return res.writeHead(400).end();
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
  .listen(4430, "127.0.0.1", () => console.log(`Every format loop at http://127.0.0.1:4430/ (clips from ${clips})`));
