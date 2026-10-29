import { overview } from "@/content/home";
import { CountUp } from "./count-up";
import { InView } from "./in-view";
import rise from "./rise.module.css";
import { SectionHead } from "./section-head";
import styles from "./overview.module.css";

const TRACKS = [
  { name: "V2", clips: [[8, 30, "title"], [58, 74]] },
  { name: "V1", clips: [[0, 22], [23, 47], [48, 71], [72, 100]] },
  { name: "A1", clips: [[0, 100, "audio"]] },
];
const CAPTION = ["Every", "shot,", "landed", "right", "on", "the", "beat."];
const WAVE_A = "M0 40 C 25 10, 50 10, 75 40 S 125 70, 150 40 S 200 10, 225 40 S 275 70, 300 40 S 350 10, 375 40 S 425 70, 450 40 S 500 10, 525 40 S 575 70, 600 40";
const WAVE_B = "M0 40 C 37 20, 75 20, 112 40 S 187 60, 225 40 S 300 20, 337 40 S 412 60, 450 40 S 525 20, 562 40 S 637 60, 675 40";
const EASE = "M14 112 C 90 112, 110 22, 206 20";

function Card({ title, note, className = "", delay = "0%", children }) {
  return (
    <InView className={`${styles.card} ${className} ${rise.rise}`} style={{ "--rise-delay": delay }}>
      <div className={styles.cardHead}>
        <span>{title}</span>
        {note ? <span className={styles.cardNote}>{note}</span> : null}
      </div>
      {children}
    </InView>
  );
}

/**
 * An illustrative look at an edit in Keyfly: the timeline, the export, the
 * captions, the soundtrack and an ease curve, each moving on its own clock.
 * Decorative pictures of the tools, labelled as such by the section chip.
 */
export function Overview() {
  return (
    <section className={styles.overview} aria-labelledby="overview-title">
      <div className={styles.inner}>
        <SectionHead id="overview-title" chip={overview.chip} title={overview.title} aside={overview.aside} />

        <div className={styles.grid} aria-hidden="true">
          <Card title="timeline / launch film" note="next: captions" className={styles.wide}>
            <div className={styles.tracks}>
              {TRACKS.map((track) => (
                <div key={track.name} className={styles.track}>
                  <span className={styles.trackName}>{track.name}</span>
                  <div className={styles.lane}>
                    {track.clips.map(([from, to, kind]) => (
                      <span
                        key={from}
                        className={kind ? `${styles.clip} ${styles[kind]}` : styles.clip}
                        style={{ left: `${from}%`, width: `${to - from}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className={styles.playheadLane}>
                <span className={styles.playhead} />
              </div>
            </div>
          </Card>

          <Card title="export" note="launch film" delay="6%">
            <div className={styles.ring}>
              <svg viewBox="0 0 120 120" className={styles.ringSvg}>
                <circle cx="60" cy="60" r="50" className={styles.ringTrack} />
                <circle cx="60" cy="60" r="50" pathLength="1" className={styles.ringFill} />
              </svg>
              <span className={styles.ringValue}>
                <CountUp to={100} suffix="%" delay={300} />
              </span>
            </div>
          </Card>

          <Card title="captions" note="in time">
            <div className={styles.caption}>
              {CAPTION.map((word, i) => (
                <span key={word} className={styles.captionWord} style={{ "--i": i, "--n": CAPTION.length }}>
                  {word}
                </span>
              ))}
            </div>
          </Card>

          <Card title="soundtrack" note="beat grid" delay="6%">
            <div className={styles.waves}>
              <svg viewBox="0 0 300 80" preserveAspectRatio="none" className={styles.waveSvg}>
                <path d={WAVE_A} className={styles.waveA} />
                <path d={WAVE_B} className={styles.waveB} />
              </svg>
              <div className={styles.beats}>
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className={styles.beat} style={{ "--i": i }} />
                ))}
              </div>
            </div>
          </Card>

          <Card title="keyframes" note="ease in-out" delay="12%">
            <svg viewBox="0 0 220 130" className={styles.ease}>
              <path d="M14 20 H206 M14 66 H206 M14 112 H206" className={styles.grid1} />
              <path d={EASE} pathLength="1" className={styles.curve} />
              <rect x="9" y="107" width="10" height="10" transform="rotate(45 14 112)" className={styles.key} />
              <rect x="201" y="15" width="10" height="10" transform="rotate(45 206 20)" className={styles.key} />
              <circle r="4.5" className={styles.easeDot}>
                <animateMotion dur="2.8s" repeatCount="indefinite" path={EASE} keyPoints="0;1;1" keyTimes="0;0.75;1" calcMode="linear" />
              </circle>
            </svg>
          </Card>
        </div>
      </div>
    </section>
  );
}
