import styles from "./timeline-floor.module.css";

// A small seeded random, so the server and every visit draw the same floor.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Tracks from the horizon (top) to the front edge (bottom).
const TRACKS = [
  { kind: "title", seed: 3 },
  { kind: "video", seed: 7 },
  { kind: "fx", seed: 13 },
  { kind: "video", seed: 11 },
  { kind: "title", seed: 17 },
  { kind: "video", seed: 23 },
  { kind: "fx", seed: 19 },
  { kind: "video", seed: 37 },
  { kind: "audio", seed: 29 },
  { kind: "audio", seed: 31 },
];

// One loop of each track, in percent of a loop's width. Every loop is drawn
// twice side by side, so sliding by one loop is seamless.
function clipsFor({ kind, seed }) {
  const rand = seeded(seed);
  const clips = [];
  let at = rand() * 4;
  while (at < 96) {
    const min = kind === "title" || kind === "fx" ? 3 : 4;
    const width = Math.min(min + rand() * (kind === "audio" ? 14 : 8), 99 - at);
    if (width < 2) break;
    clips.push({ at, width, lit: rand() > 0.78, keys: kind === "video" && rand() > 0.4 });
    at += width + (kind === "title" || kind === "fx" ? 2 + rand() * 9 : 0.25 + rand() * 0.6);
  }
  return clips;
}

// A mirrored waveform as vertical bars in a 100 × 20 box.
function wave(seed) {
  const rand = seeded(seed);
  let d = "";
  for (let i = 0; i < 40; i++) {
    const h = 2 + rand() * 7.5;
    d += `M${(i * 2.5 + 1.25).toFixed(2)} ${(10 - h).toFixed(2)}V${(10 + h).toFixed(2)}`;
  }
  return d;
}

function Loop({ track }) {
  return (
    <div className={styles.loop}>
      {clipsFor(track).map((clip, i) => (
        <span
          key={i}
          className={styles.clip}
          data-kind={track.kind}
          data-lit={clip.lit ? "" : undefined}
          style={{ left: `${clip.at}%`, width: `${clip.width}%` }}
        >
          {track.kind === "audio" ? (
            <svg className={styles.wave} viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
              <path d={wave(track.seed + i)} />
            </svg>
          ) : null}
          {clip.keys ? (
            <>
              <i className={styles.key} style={{ left: 0 }} />
              <i className={styles.key} style={{ left: "100%" }} />
            </>
          ) : null}
        </span>
      ))}
    </div>
  );
}

/**
 * An editing timeline laid flat and running toward the horizon: title,
 * video, effect and audio tracks slide under a fixed mint playhead, the way
 * footage moves past the playhead during playback. CSS only; with reduced
 * motion it stands still.
 */
export function TimelineFloor() {
  return (
    <div className={styles.stage}>
      <div className={styles.plane}>
        {/* One reel holds the ruler and every track, twice over, and slides
            as a single layer. */}
        <div className={styles.reel}>
          <div className={styles.ruler} />
          {TRACKS.map((track) => (
            <div key={track.seed} className={styles.track} data-kind={track.kind}>
              <Loop track={track} />
              <Loop track={track} />
            </div>
          ))}
        </div>
        <div className={styles.playhead} />
      </div>
    </div>
  );
}
