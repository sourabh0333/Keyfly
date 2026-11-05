// Edits the hero's viewer clip for the Product page (reel.js) from three
// Mixkit stock clips (Mixkit Stock Video Free License; see README below)
// and saves public/video/hero-reel.mp4 and its poster hero-reel.webp.
//
// The source clips are not kept in the repository. Download them into any
// folder, then:
//   node scripts/hero-reel/record.mjs <folder with the clips>
//   open http://127.0.0.1:4419/?record in Chrome for 9 s.
// http://127.0.0.1:4419/?t=3.2 shows one frame; ?sheet shows a contact
// sheet of each clip, for picking in-points.
//
// Clips (each page says "commercial or personal use, under the Mixkit
// Stock Video Free License", checked 2026-11-05):
//   sunset-texting.mp4     mixkit.co/free-stock-video/silhouette-of-a-man-texting-during-the-sunset-4808/
//   city-dusk.mp4          mixkit.co/free-stock-video/tour-high-above-a-city-at-dusk-41375/
//   hands-city-lights.mp4  mixkit.co/free-stock-video/silhouetted-hands-connecting-under-city-lights-100951/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outs = { "/save": "public/video/hero-reel.mp4", "/poster": "public/video/hero-reel.webp" };
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
  .listen(4419, "127.0.0.1", () => console.log(`Reel at http://127.0.0.1:4419/ (clips from ${clips})`));
