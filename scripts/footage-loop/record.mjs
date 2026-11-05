// Edits the talking-head loop for the Product page's "Footage" section
// (reel.js) from a real Mixkit stock clip and saves
// public/video/footage-loop.mp4 and its poster footage-loop.webp.
//
// The source clip is not kept in the repository. Download it into any
// folder as vlog-studio.mp4, then:
//   node scripts/footage-loop/record.mjs <folder with the clip>
//   open http://127.0.0.1:4418/?record in Chrome for about 9 s.
// http://127.0.0.1:4418/?t=2.5 shows one frame; ?sheet shows a contact
// sheet of the speaker's face, for finding where he pauses.
//
// Clip (its page says "Mixkit Stock Video Free License": commercial use,
// no attribution; checked 2026-11-05):
//   vlog-studio.mp4  mixkit.co/free-stock-video/youtuber-vlogging-in-his-studio-41272/
//                    (assets.mixkit.co/videos/41272/41272-720.mp4)
//
// The loop has no sound and repeats every 8 s (its end cross-fades into
// its start). The speaker's words aren't the transcript's, which stays
// illustrative (see `productFootage` in src/content/product.js).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const clips = path.resolve(process.argv[2] || ".");
const outs = { "/save": "public/video/footage-loop.mp4", "/poster": "public/video/footage-loop.webp" };
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4", ".woff2": "font/woff2" };

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) return path.join(clips, path.basename(urlPath));
  return path.join(here, path.basename(urlPath) || "index.html");
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
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4418, "127.0.0.1", () => console.log(`Footage loop at http://127.0.0.1:4418/ (clip from ${clips})`));
