import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// The picture shown when a KeyFly link is shared (Open Graph and X). Every
// page without its own image uses it. The lockup is the brand kit's own file
// (public/brand/lockup-dark.svg, the wordmark already outlined), placed
// unchanged on Night; only the line beneath it is set here.
export const alt = "KeyFly, the AI video editor for Mac, Windows and the web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The kit's file as an image, at its own proportions (read from its viewBox).
async function lockup() {
  const svg = await readFile(join(process.cwd(), "public/brand/lockup-dark.svg"), "utf8");
  const box = svg.match(/viewBox="([\d.\s-]+)"/)?.[1].trim().split(/\s+/).map(Number) ?? [0, 0, 212, 64];
  return { src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`, ratio: box[2] / box[3] };
}

export default async function Image() {
  const logo = await lockup();
  const height = 132;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0D",
          backgroundImage: "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(95,224,176,0.16), rgba(11,11,13,0) 70%)",
          color: "#F4F1EA",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img only */}
        <img src={logo.src} width={Math.round(height * logo.ratio)} height={height} alt="" />
        <div style={{ marginTop: 56, fontSize: 52, fontWeight: 600, letterSpacing: "-0.03em" }}>
          The AI video editor, your way
        </div>
        <div style={{ marginTop: 18, fontSize: 30, color: "rgba(244,241,234,0.62)" }}>
          Describe the video. Take it anywhere. · Mac · Windows · Web
        </div>
      </div>
    ),
    size,
  );
}
