import { howItWorks } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import motion from "@/components/scene/motion.module.css";
import { ScrollStage } from "./scroll-stage";
import styles from "./how-it-works.module.css";

// The demo timeline, in fractions of its length. Shot boundaries fall at
// 1/3 and 2/3, so the titles, video and viewer cut together. `k` is when a
// clip lands during assembly (0–1 of the assembly phase).
const TITLES = [
  { at: 0.02, width: 0.22, k: 0.55 },
  { at: 0.35, width: 0.2, k: 0.65 },
  { at: 0.68, width: 0.24, k: 0.75 },
];

const VIDEO = [
  { at: 0, width: 0.14, scene: 1, k: 0.05 },
  { at: 0.14, width: 0.19, scene: 1, k: 0.12 },
  { at: 0.333, width: 0.17, scene: 2, k: 0.19 },
  { at: 0.503, width: 0.164, scene: 2, k: 0.26 },
  { at: 0.667, width: 0.16, scene: 3, k: 0.33 },
  { at: 0.827, width: 0.173, scene: 3, k: 0.4 },
];

const BEATS = Array.from({ length: 12 }, (_, i) => (i + 1) / 12);

// A mirrored waveform as vertical bars in a 200 × 20 box.
function wave() {
  let s = 41;
  let d = "";
  for (let i = 0; i < 100; i++) {
    s = (s * 16807) % 2147483647;
    const beat = i % 8 === 0 ? 2.2 : 1;
    const h = Math.min(9.5, (1.5 + ((s - 1) / 2147483646) * 6) * beat);
    d += `M${i * 2 + 1} ${(10 - h).toFixed(2)}V${(10 + h).toFixed(2)}`;
  }
  return d;
}

function Title({ lines }) {
  return lines.map((line, i) => (
    <span key={i} className={line.accent ? styles.accent : styles.plain}>
      {line.text}
      {i < lines.length - 1 ? " " : null}
    </span>
  ));
}

/**
 * "How it works": three steps beside an illustrative Keyfly editor that
 * plays them out as the page scrolls. The prompt types itself in, clips
 * land on the timeline and the playhead plays the cut, then the frame tries
 * each format and the export fills. Without JS or with reduced motion it is
 * one still frame showing the finished cut.
 */
export function HowItWorks() {
  const { eyebrow, title, steps, demo } = howItWorks;

  return (
    <ScrollStage className={styles.section} id="product" labelledBy="how-title" label="How it works" prompt={demo.prompt}>
      <span className={motion.beam} aria-hidden="true" />
      <div className={styles.stage}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowMark} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id="how-title" className={`${styles.title} ${wipe.wipe}`}>
            <Title lines={title} />
          </h2>

          <ol className={styles.steps}>
            <span className={styles.rail} aria-hidden="true">
              <span className={styles.railFill} />
            </span>
            {steps.map((step, i) => (
              <li key={step.title} className={styles.step} data-i={i}>
                <span className={styles.stepIndex}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <figure className={`${styles.demo} ${motion.reveal}`}>
          <div className={styles.window} aria-hidden="true" data-spotlight>
            <div className={styles.chrome}>
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.file}>
                {demo.file}
                <span className={styles.fileMuted}> · Keyfly</span>
              </span>
              <span className={styles.timecode} data-timecode>
                00:00:30:00
              </span>
            </div>

            <div className={styles.body}>
              <div className={styles.viewer}>
                <div className={styles.frame}>
                  {demo.shots.map((shot, i) => (
                    <div key={shot.title} className={styles.scene} data-scene={i + 1}>
                      <div className={styles.sceneArt} />
                      <p className={styles.sceneTitle}>
                        {shot.title}
                        <span className={styles.point} />
                      </p>
                      <p className={styles.sceneCaption}>{shot.caption}</p>
                    </div>
                  ))}
                  <div className={styles.empty}>
                    <span className={styles.emptyWait}>Your video appears here</span>
                    <span className={styles.emptyBuild}>
                      <span className={styles.spinner} />
                      Building the timeline
                    </span>
                  </div>
                  <span className={styles.guides} />
                </div>
                <div className={styles.formats}>
                  {demo.formats.map((format) => (
                    <span key={format} data-format={format}>
                      {format}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.panel}>
                <p className={styles.panelLabel}>Prompt</p>
                <p className={styles.bubble}>
                  <span data-typed>{demo.prompt}</span>
                  <span className={styles.caret} />
                </p>
                <ul className={styles.plan}>
                  {demo.plan.map((item, i) => (
                    <li key={item} style={{ "--k": (0.12 + (i * 0.75) / demo.plan.length).toFixed(3) }}>
                      <span className={styles.tick} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className={styles.export}>
                  <span className={styles.exportLabel}>
                    <span data-export-label>Export</span>
                    <span data-percent>100%</span>
                  </span>
                  <span className={styles.exportBar}>
                    <span />
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.timeline}>
              <div className={styles.ruler} />
              <div className={styles.track} data-kind="title">
                <span className={styles.trackLabel}>T1</span>
                <div className={styles.lane}>
                  {TITLES.map((clip, i) => (
                    <span key={i} className={styles.clip} style={{ left: `${clip.at * 100}%`, width: `${clip.width * 100}%`, "--k": clip.k }}>
                      T
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.track} data-kind="video">
                <span className={styles.trackLabel}>V1</span>
                <div className={styles.lane}>
                  {VIDEO.map((clip, i) => (
                    <span
                      key={i}
                      className={styles.clip}
                      data-scene={clip.scene}
                      style={{ left: `${clip.at * 100}%`, width: `${clip.width * 100}%`, "--k": clip.k }}
                    >
                      <i className={styles.key} />
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.track} data-kind="audio">
                <span className={styles.trackLabel}>A1</span>
                <div className={styles.lane}>
                  <span className={styles.clip} style={{ left: 0, width: "100%", "--k": 0.85 }}>
                    <svg className={styles.wave} viewBox="0 0 200 20" preserveAspectRatio="none">
                      <path d={wave()} />
                    </svg>
                    {BEATS.map((beat) => (
                      <i key={beat} className={styles.beat} style={{ left: `${beat * 100}%` }} />
                    ))}
                  </span>
                </div>
              </div>
              <div className={styles.playheadLane}>
                <span className={styles.playhead} />
              </div>
            </div>
          </div>
          <figcaption className={styles.note}>{demo.note}</figcaption>
        </figure>
      </div>
    </ScrollStage>
  );
}
