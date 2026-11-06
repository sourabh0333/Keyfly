// Edits the film in the Integrations page's "Your editor" panel (reel.js)
// from three Mixkit stock clips and saves public/video/road-reel.mp4 and its
// poster road-reel.webp.
//
// The source clips are not kept in the repository. Download them into any
// folder, then:
//   node scripts/road-reel/record.mjs <folder with the clips>
//   open http://127.0.0.1:4421/?record in Chrome and wait until it saves
//   (about a minute: it collects each shot's frames, then encodes them).
// http://127.0.0.1:4421/?t=3.2 shows one rough frame.
//
// Clips (the Full HD downloads, kept under their Mixkit names; Mixkit Stock
// Video Free License, commercial or personal use, no attribution; checked
// 2026-11-06):
//   50267-1080.mp4  mixkit.co/free-stock-video/natural-landscape-with-a-road-at-sunset-50267/
//   41570-1080.mp4  mixkit.co/free-stock-video/woman-in-sunroof-on-a-road-trip-through-nature-41570/
//   41568-1080.mp4  mixkit.co/free-stock-video/couple-taking-photos-during-a-road-trip-in-nature-41568/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outs = { "/save": "public/video/road-reel.mp4", "/poster": "public/video/road-reel.webp" };
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
  .listen(4421, "127.0.0.1", () => console.log(`Reel at http://127.0.0.1:4421/ (clips from ${clips})`));
