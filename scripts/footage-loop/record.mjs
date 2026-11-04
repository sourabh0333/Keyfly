// Records the illustrative talking-head loop for the Product page's
// "Footage" section (loop.js) to public/video/footage-loop.mp4, and its
// first frame to public/video/footage-loop.webp (the poster).
//
// Usage: node scripts/footage-loop/record.mjs
//   Then open http://127.0.0.1:4418/?record in Chrome (or headless Chrome)
//   for 8 s; the MP4 and the poster are saved when it ends.
//   http://127.0.0.1:4418/?t=2.5 shows a single frame, for checking.
//
// The loop has no sound, and every motion repeats every 8 s, so it plays
// seamlessly with `loop`. Its two pauses match the transcript's (see
// `productFootage` in src/content/product.js).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const outs = { "/save": "public/video/footage-loop.mp4", "/poster": "public/video/footage-loop.webp" };
const types = { ".html": "text/html", ".js": "text/javascript" };

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
    const file = path.join(here, new URL(req.url, "http://x").pathname.slice(1) || "index.html");
    if (!file.startsWith(here) || !fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4418, "127.0.0.1", () => console.log("Loop at http://127.0.0.1:4418/ (add ?record to record)"));
