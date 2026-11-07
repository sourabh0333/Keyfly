// A small MP4 writer for H.264 from WebCodecs (VideoEncoder with
// avc: { format: "avc" }): one video track, every frame the same length,
// the index (moov) before the data so it starts playing at once. Used so
// the reel is encoded frame by frame with exact timings, not recorded in
// real time (which stalled and froze the picture).

const enc = new TextEncoder();
const u8 = (...n) => new Uint8Array(n);
const u16 = (n) => u8((n >> 8) & 255, n & 255);
const u32 = (n) => u8((n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255);
const zeros = (n) => new Uint8Array(n);
const str = (s) => enc.encode(s);

function concat(parts) {
  const len = parts.reduce((a, p) => a + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function box(type, ...parts) {
  const body = concat(parts);
  return concat([u32(body.length + 8), str(type), body]);
}
const full = (type, version, flags, ...parts) => box(type, u8(version, (flags >> 16) & 255, (flags >> 8) & 255, flags & 255), ...parts);

const MATRIX = concat([u32(0x00010000), u32(0), u32(0), u32(0), u32(0x00010000), u32(0), u32(0), u32(0), u32(0x40000000)]);

/**
 * samples: [{ data: Uint8Array, key: boolean }] in decode order; fps: frames
 * per second; avcC: the encoder's decoderConfig.description.
 */
export function mp4({ width, height, fps, avcC, samples }) {
  const n = samples.length;
  const durationMs = Math.round((n / fps) * 1000);
  const ftyp = box("ftyp", str("isom"), u32(0x200), str("isom"), str("iso2"), str("avc1"), str("mp41"));

  const build = (dataOffset) => {
    const avc1 = box(
      "avc1",
      zeros(6),
      u16(1),
      zeros(16),
      u16(width),
      u16(height),
      u32(0x00480000),
      u32(0x00480000),
      u32(0),
      u16(1),
      zeros(32),
      u16(0x18),
      u16(0xffff),
      box("avcC", new Uint8Array(avcC)),
    );
    const keys = samples.flatMap((s, i) => (s.key ? [i + 1] : []));
    const stbl = box(
      "stbl",
      full("stsd", 0, 0, u32(1), avc1),
      full("stts", 0, 0, u32(1), u32(n), u32(1)),
      full("stss", 0, 0, u32(keys.length), ...keys.map(u32)),
      full("stsc", 0, 0, u32(1), u32(1), u32(n), u32(1)),
      full("stsz", 0, 0, u32(0), u32(n), ...samples.map((s) => u32(s.data.length))),
      full("stco", 0, 0, u32(1), u32(dataOffset)),
    );
    const minf = box(
      "minf",
      full("vmhd", 0, 1, zeros(8)),
      box("dinf", full("dref", 0, 0, u32(1), full("url ", 0, 1))),
      stbl,
    );
    const mdia = box(
      "mdia",
      full("mdhd", 0, 0, u32(0), u32(0), u32(fps), u32(n), u16(0x55c4), u16(0)),
      full("hdlr", 0, 0, u32(0), str("vide"), zeros(12), str("VideoHandler\0")),
      minf,
    );
    const tkhd = full("tkhd", 0, 3, u32(0), u32(0), u32(1), u32(0), u32(durationMs), zeros(8), u16(0), u16(0), u16(0), u16(0), MATRIX, u32(width << 16), u32(height << 16));
    const mvhd = full("mvhd", 0, 0, u32(0), u32(0), u32(1000), u32(durationMs), u32(0x00010000), u16(0x0100), zeros(10), MATRIX, zeros(24), u32(2));
    return box("moov", mvhd, box("trak", tkhd, mdia));
  };

  const moovSize = build(0).length;
  const moov = build(ftyp.length + moovSize + 8);
  const payload = concat(samples.map((s) => s.data));
  const mdat = concat([u32(payload.length + 8), str("mdat"), payload]);
  return new Blob([ftyp, moov, mdat], { type: "video/mp4" });
}
