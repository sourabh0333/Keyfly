import Image from "next/image";
import { Fragment } from "react";
import shotClose from "@/assets/hero/shot-3-close.webp";
import shotMedium from "@/assets/hero/shot-2-medium.webp";
import shotWide from "@/assets/hero/shot-1-wide.webp";
import { SYMBOL_PATH, SYMBOL_POINT, SYMBOL_STROKE, SYMBOL_TRANSFORM, SYMBOL_VIEWBOX } from "@/components/logo/lockup";
import { hero } from "@/content/home";
import { HeroShell } from "./hero-shell";
import styles from "./hero.module.css";

// Each shot with the focal point to keep in frame when it is cropped, and
// its clip name on the timeline.
const PHOTOS = [
  { src: shotWide, focus: "38% 62%", clip: "01_wide.mov" },
  { src: shotMedium, focus: "62% 45%", clip: "02_medium.mov" },
  { src: shotClose, focus: "80% 55%", clip: "03_close.mov" },
];

// The soundtrack: a deterministic waveform (server and client match) and
// twelve beats, so each cut (at 1/3 and 2/3) lands on a beat.
const WAVE = Array.from({ length: 160 }, (_, i) => {
  const h = 4 + Math.abs(Math.sin(i * 0.9) * 9 + Math.sin(i * 0.37) * 7 + Math.sin(i * 2.3) * 3);
  return Math.min(h, 22);
});
const BEATS = 12;
const RULER = ["00:00", "00:06", "00:12", "00:18", "00:24", "00:30", "00:36"];

const camel = (at) => at.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const pad = (n) => String(n).padStart(2, "0");

/**
 * One word as letters, so they can arrive one after another. The last
 * word's full stop is the brand's mint point.
 */
function Word({ text, wordIndex, last }) {
  return [...text].map((char, i) => {
    if (char === " ") return <Fragment key={i}> </Fragment>;
    const point = last && char === "." && i === text.length - 1;
    return (
      <span
        key={i}
        className={point ? `${styles.letter} ${styles.point}` : styles.letter}
        style={{ "--w": wordIndex, "--l": i }}
      >
        {char}
      </span>
    );
  });
}

function Transport() {
  return (
    <div className={styles.buttons} aria-hidden="true">
      <svg viewBox="0 0 16 16" width="14" height="14">
        <path d="M4 3.5v9M12.5 3.5v9L5.5 8z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className={styles.play}>
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M5 3.5v9L12 8z" fill="currentColor" />
        </svg>
      </span>
      <svg viewBox="0 0 16 16" width="14" height="14">
        <path d="M12 3.5v9M3.5 3.5v9L10.5 8z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

/**
 * The homepage hero as the Keyfly editor: the viewer plays three shots,
 * the timeline below holds them as clips (with title clips above and the
 * soundtrack's beats below), and scrolling moves the playhead. Each time it
 * crosses a cut, the viewer cuts to the next shot, the camera dollies in,
 * and that shot's title arrives letter by letter. The notes play as
 * captions. A viewfinder preloader opens onto it.
 *
 * An illustration of editing in Keyfly, not a screenshot. Server-rendered:
 * the first shot's title is the h1, and without JS the first shot shows.
 */
export function Hero() {
  const count = hero.shots.length;

  return (
    <HeroShell className={styles.hero} shots={count}>
      <div className={styles.stage}>
        <h1 id="hero-title" className="visually-hidden">
          {hero.title}
        </h1>

        {/* Without JS nothing marks the hero ready, so show the first shot's
            title and caption here. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>.${styles.chapter}[data-chapter="0"] .${styles.letter},.${styles.chapter}[data-chapter="0"] .${styles.note}{opacity:1;filter:none;transform:none}</style>`,
          }}
        />

        <div className={styles.app}>
          {/* ---- Viewer ---- */}
          <div className={styles.viewer}>
            <div className={styles.frames} aria-hidden="true">
              {PHOTOS.map((photo, i) => (
                <div key={photo.clip} className={styles.frame} data-frame={i}>
                  <Image
                    src={photo.src}
                    alt=""
                    fill
                    sizes="100vw"
                    priority={i === 0}
                    placeholder="blur"
                    className={styles.photo}
                    style={{ objectPosition: photo.focus }}
                  />
                </div>
              ))}
            </div>
            <div className={styles.shade} aria-hidden="true" />
            <div className={styles.guides} aria-hidden="true">
              <span />
              <span />
            </div>

            {hero.shots.map((shot, i) => (
              <div key={shot.id} className={styles.chapter} data-chapter={i} data-active={i === 0} aria-hidden="true">
                {shot.words.map((word, w) => (
                  <p key={word.text} className={`${styles.word} ${styles[camel(word.at)]}`}>
                    <Word text={word.text} wordIndex={w} last={w === shot.words.length - 1} />
                  </p>
                ))}
                {/* The note plays as a caption on the shot. */}
                <p className={`${styles.note} ${styles[camel(shot.note.at)]}`}>
                  <span>{shot.note.text}</span>
                </p>
              </div>
            ))}

            <span className={styles.viewerTag} aria-hidden="true">
              <span className={styles.rec} />
              Viewer
            </span>
          </div>

          {/* ---- Transport ---- */}
          <div className={styles.transport} aria-hidden="true">
            <span className={styles.project}>
              Launch film <span className={styles.dim}>/ Keyfly</span>
            </span>
            <Transport />
            <span className={styles.timecode} data-timecode>
              00:00:00:00
            </span>
          </div>

          {/* ---- Timeline ---- */}
          <div className={styles.timeline} aria-hidden="true">
            <div className={styles.heads}>
              <span />
              <span>T1</span>
              <span>V1</span>
              <span>A1</span>
            </div>
            <div className={styles.lanes}>
              <div className={styles.ruler}>
                {RULER.map((tick, i) => (
                  <span key={tick} style={{ left: `${(i / (RULER.length - 1)) * 100}%` }}>
                    {tick}
                  </span>
                ))}
              </div>

              <div className={styles.track}>
                {hero.shots.map((shot, i) => (
                  <span
                    key={shot.id}
                    className={`${styles.clip} ${styles.titleClip}`}
                    data-clip={i}
                    style={{ "--i": i, "--n": count }}
                  >
                    T&nbsp; {shot.words.map((word) => word.text).join(" ")}
                  </span>
                ))}
              </div>

              <div className={`${styles.track} ${styles.videoTrack}`}>
                {PHOTOS.map((photo, i) => (
                  <span
                    key={photo.clip}
                    className={`${styles.clip} ${styles.videoClip}`}
                    data-clip={i}
                    style={{ "--i": i, "--n": count, backgroundImage: `url(${photo.src.src})` }}
                  >
                    <span className={styles.clipName}>{photo.clip}</span>
                    <span className={`${styles.key} ${styles.keyIn}`} />
                    <span className={`${styles.key} ${styles.keyOut}`} />
                  </span>
                ))}
              </div>

              <div className={`${styles.track} ${styles.audioTrack}`}>
                <svg className={styles.wave} viewBox={`0 0 ${WAVE.length * 4} 24`} preserveAspectRatio="none">
                  {WAVE.map((h, i) => (
                    <rect key={i} x={i * 4} y={12 - h / 2} width="2.2" height={h} rx="1" />
                  ))}
                </svg>
                {Array.from({ length: BEATS + 1 }, (_, i) => (
                  <span key={i} className={styles.beat} style={{ left: `${(i / BEATS) * 100}%` }} />
                ))}
              </div>

              <span className={styles.playhead} data-playhead />
            </div>
          </div>
        </div>

        {/* Preloader: a camera viewfinder. The Keyfly symbol draws its
            flight path as the page loads and the timecode runs; at 100% the
            point lands, then the frame opens like cinema bars. */}
        <div className={styles.preloader} data-preloader aria-hidden="true">
          <span className={`${styles.bar} ${styles.barTop}`} />
          <span className={`${styles.bar} ${styles.barBottom}`} />
          <div className={styles.viewfinder}>
            <span className={`${styles.corner} ${styles.cornerTL}`} />
            <span className={`${styles.corner} ${styles.cornerTR}`} />
            <span className={`${styles.corner} ${styles.cornerBL}`} />
            <span className={`${styles.corner} ${styles.cornerBR}`} />
            <span className={`${styles.vfLabel} ${styles.vfTL}`}>Keyfly</span>
            <span className={`${styles.vfLabel} ${styles.vfTR}`}>
              <span className={styles.vfRec} />
              Rec
            </span>
            <span className={`${styles.vfLabel} ${styles.vfBL}`}>Shot 01 / {pad(count)}</span>
            <span className={`${styles.vfLabel} ${styles.vfBR}`} data-load-time>
              00:00:00:00
            </span>
            <span className={styles.focus}>
              <i />
              <i />
              <i />
              <i />
            </span>
            <svg className={styles.mark} viewBox={SYMBOL_VIEWBOX}>
              <g transform={SYMBOL_TRANSFORM}>
                <path
                  className={styles.markLine}
                  d={SYMBOL_PATH}
                  pathLength="1"
                  strokeWidth={SYMBOL_STROKE}
                  data-load-line
                />
                <circle className={styles.markPoint} cx={SYMBOL_POINT.cx} cy={SYMBOL_POINT.cy} r={SYMBOL_POINT.r} />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </HeroShell>
  );
}
