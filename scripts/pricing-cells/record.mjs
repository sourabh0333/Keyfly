// Cuts the square film loops beside the Pricing hero's heading (cells.js)
// from seven Mixkit stock clips and saves each as
// public/video/cells/{name}.mp4 with its poster {name}.webp.
//
// The source clips are not kept in the repository. Download them into any
// folder, then:
//   node scripts/pricing-cells/record.mjs <folder with the clips> [more folders]
//   open http://127.0.0.1:4424/?record in Chrome and wait until it saves
//   all seven (a minute or two: each loop's frames are collected by
//   playback, then encoded at exact timestamps).
// http://127.0.0.1:4424/?sheet shows every loop at its start, middle and
// seam, with each clip's length.
//
// Clips (the Full HD downloads, kept under their Mixkit names; Mixkit Stock
// Video Free License, commercial or personal use, no attribution; checked
// 2026-11-06):
//   34382-1080.mp4  mixkit.co/free-stock-video/boy-doing-a-pirouette-with-a-skateboard-in-a-park-34382/
//   52184-1080.mp4  mixkit.co/free-stock-video/a-mature-beautiful-woman-talking-lively-to-the-microphone-in-52184/
//   49647-1080.mp4  mixkit.co/free-stock-video/a-young-smiling-woman-filming-a-video-by-the-lake-49647/
//   50267-1080.mp4  mixkit.co/free-stock-video/natural-landscape-with-a-road-at-sunset-50267/
//   41568-1080.mp4  mixkit.co/free-stock-video/couple-taking-photos-during-a-road-trip-in-nature-41568/
//   42308-720.mp4   mixkit.co/free-stock-video/cheerful-girl-recording-herself-with-a-colorful-background-42308/ (720p)
//   42323-720.mp4   mixkit.co/free-stock-video/portrait-of-an-influencer-talking-to-the-camera-42323/ (720p)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const folders = (process.argv.length > 2 ? process.argv.slice(2) : ["."]).map((f) => path.resolve(f));
const outDir = path.join(root, "public/video/cells");
const types = { ".html": "text/html", ".js": "text/javascript", ".mp4": "video/mp4" };

function resolve(urlPath) {
  if (urlPath.startsWith("/clips/")) {
    const name = path.basename(urlPath);
    const found = folders.map((f) => path.join(f, name)).find((f) => fs.existsSync(f));
    return found || path.join(folders[0], name);
  }
  return path.join(here, urlPath.slice(1) || "index.html");
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    // POST /save?file=bowl.mp4 (or bowl.webp)
    if (req.method === "POST" && url.pathname === "/save") {
      const name = path.basename(url.searchParams.get("file") || "");
      if (!/^[a-z0-9-]+\.(mp4|webp)$/.test(name)) return res.writeHead(400).end();
      fs.mkdirSync(outDir, { recursive: true });
      const out = path.join(outDir, name);
      const file = fs.createWriteStream(out);
      req.pipe(file);
      file.on("finish", () => {
        res.end("ok");
        console.log(`Saved public/video/cells/${name} (${fs.statSync(out).size} bytes)`);
      });
      return;
    }
    const file = resolve(decodeURIComponent(url.pathname));
    if (!fs.existsSync(file)) return res.writeHead(404).end();
    res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream", "accept-ranges": "bytes" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4424, "127.0.0.1", () => console.log(`Cells at http://127.0.0.1:4424/ (clips from ${folders.join(", ")})`));
