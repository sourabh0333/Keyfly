// Records the illustrative film for "What KeyFly makes" (film.js) to
// public/video/keyfly-film.mp4.
//
// Usage: powershell -File scripts/keyfly-film/voice.ps1 (the voice-over, once)
//        node scripts/keyfly-film/record.mjs
//   Then open http://127.0.0.1:4417/?record in Chrome (or headless Chrome
//   with --autoplay-policy=no-user-gesture-required) and keep the tab in
//   front for 30 s; the MP4, with its sound, is saved when it ends.
//   http://127.0.0.1:4417/?t=12.3 shows a single frame, for checking.
//
// It serves this folder, the site's fonts (src/fonts) and brand files
// (public/brand). Chrome records H.264 MP4 with MediaRecorder; no other tools
// are needed. After recording, update the poster (public/video/keyfly-film.webp)
// and, if the scenes changed, the scenes and clips in `creates`
// (src/content/home.js).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const out = path.join(root, "public/video/keyfly-film.mp4");
const types = { ".html": "text/html", ".js": "text/javascript", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".wav": "audio/wav" };

function resolve(urlPath) {
  if (urlPath.startsWith("/fonts/")) return path.join(root, "src/fonts", urlPath.slice(7));
  if (urlPath.startsWith("/brand/")) return path.join(root, "public/brand", urlPath.slice(7));
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    if (req.method === "POST" && req.url === "/save") {
      const file = fs.createWriteStream(out);
      req.pipe(file);
      file.on("finish", () => {
        res.end("ok");
        console.log(`Saved ${path.relative(root, out)} (${fs.statSync(out).size} bytes)`);
      });
      return;
    }
    const file = resolve(decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!file.startsWith(root) || !fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4417, "127.0.0.1", () => console.log("Film at http://127.0.0.1:4417/ (add ?record to record)"));
