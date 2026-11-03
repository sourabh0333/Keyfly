import { oldWay } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { PlayOnView } from "./play-on-view";
import styles from "./old-way.module.css";

// By hand: raw footage in many small pieces (a fixed pattern, so server
// and client match), and the chores' places along the timeline.
const RAW = [3, 5, 2, 4, 6, 3, 2, 5, 4, 3, 6, 2, 4, 5, 3, 2, 6, 4, 3, 5, 4, 3, 2, 5];
const RAW_TOTAL = RAW.reduce((a, b) => a + b, 0);
const RAW_CLIPS = RAW.reduce((list, w) => {
  const left = list.length ? list.at(-1).left + list.at(-1).width : 0;
  return [...list, { left, width: (w / RAW_TOTAL) * 100 }];
}, []);
const CHORE_AT = [8, 22, 36, 52, 68, 84]; // % along the timeline
const WAVE = Array.from({ length: 72 }, (_, i) => 0.2 + ((Math.sin(i * 0.9) + Math.sin(i * 0.37) + 2) / 4) * 0.8);

// With Keyfly: the finished cut.
const CUT = [0, 16, 31, 44, 60, 77, 100];
const CAPTION_AT = [6, 30, 54, 76];

/**
 * "The old way": two editing timelines on one ruler. By hand, the
 * playhead crawls along a track of raw pieces, cutting as it goes and
 * reaching one chore after another; it is still editing when the loop
 * starts again. With Keyfly, one sentence is sent and the whole cut (title,
 * clips, music, captions) lands at once, and its playhead runs to the end.
 *
 * CSS only, one 12s loop that starts when the panel comes on screen
 * (PlayOnView). Without it (no JS, reduced motion) the CSS defaults show
 * the moment that says it: Keyfly finished, by hand three chores in.
 */
export function OldWay() {
  const { eyebrow, title, lead, note, hand, keyfly, ask, chores, tracks } = oldWay;

  return (
    <section id="old-way" className={styles.section} aria-labelledby="old-way-title" data-section="The old way">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="old-way-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>{lead}</p>
        </div>

        <div className={styles.panel}>
          <PlayOnView />

          {/* The shared ruler. */}
          <div className={styles.ruler} aria-hidden="true">
            {["0:00", "0:08", "0:15", "0:23", "0:30"].map((t, i) => (
              <span key={t} style={{ left: `${i * 25}%` }}>
                {t}
              </span>
            ))}
          </div>

          {/* By hand. */}
          <div className={`${styles.who} ${styles.handWho}`}>
            <p className={styles.whoName}>{hand.label}</p>
            <p className={styles.busy}>
              <i />
              {hand.busy}
            </p>
            <p className={styles.whoNote}>{hand.note}</p>
          </div>

          <div className={`${styles.lane} ${styles.flags}`} style={{ "--r": 2 }} aria-hidden="true">
            {chores.map((c, i) => (
              <span key={c} className={styles.flag} data-n={i} style={{ left: `${CHORE_AT[i]}%` }}>
                <i />
                <b>{c}</b>
                {/* The same flag, reached: laid over and faded in. */}
                <span className={styles.reached}>
                  <i />
                  <b>{c}</b>
                </span>
              </span>
            ))}
          </div>
          <span className={styles.code} style={{ "--r": 3 }} aria-hidden="true">
            V1
          </span>
          <div className={`${styles.lane} ${styles.track}`} style={{ "--r": 3 }} aria-hidden="true">
            {RAW_CLIPS.map((c, i) => (
              <i key={i} className={styles.raw} style={{ left: `${c.left}%`, width: `${c.width}%` }} />
            ))}
            {/* What's been cut so far: revealed up to the playhead. */}
            <span className={styles.worked}>
              {RAW_CLIPS.map((c, i) => (
                <i key={i} className={styles.cutPiece} style={{ left: `${c.left}%`, width: `${c.width}%` }} />
              ))}
            </span>
          </div>
          <span className={styles.code} style={{ "--r": 4 }} aria-hidden="true">
            A1
          </span>
          <div className={`${styles.lane} ${styles.track} ${styles.wave}`} style={{ "--r": 4 }} aria-hidden="true">
            {WAVE.map((h, i) => (
              <i key={i} style={{ "--h": h.toFixed(2) }} />
            ))}
          </div>
          <span className={`${styles.rail} ${styles.handRail}`} aria-hidden="true">
            <i />
          </span>

          <span className={styles.divider} aria-hidden="true" />

          {/* With Keyfly. */}
          <div className={`${styles.who} ${styles.keyWho}`}>
            <p className={styles.whoName}>{keyfly.label}</p>
            <p className={styles.state}>
              <span className={styles.editing}>
                <i />
                {keyfly.busy}
              </span>
              <span className={styles.ready}>
                <i />
                {keyfly.done}
              </span>
            </p>
            <p className={styles.whoNote}>{keyfly.note}</p>
          </div>

          <div className={`${styles.lane} ${styles.k} ${styles.askLane}`} style={{ "--r": 8 }}>
            <p className={styles.ask}>
              <span className={styles.chevron} aria-hidden="true">
                ›
              </span>
              <span className={styles.askText}>{ask}</span>
              <span className={styles.send} aria-hidden="true">
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </p>
          </div>
          <span className={`${styles.code} ${styles.k}`} style={{ "--r": 9 }} aria-hidden="true">
            T1
          </span>
          <div className={`${styles.lane} ${styles.k} ${styles.track}`} style={{ "--r": 9 }} aria-hidden="true">
            <i className={styles.titleClip} style={{ "--k": 0 }}>
              {tracks.title}
            </i>
          </div>
          <span className={`${styles.code} ${styles.k}`} style={{ "--r": 10 }} aria-hidden="true">
            V1
          </span>
          <div className={`${styles.lane} ${styles.k} ${styles.track}`} style={{ "--r": 10 }} aria-hidden="true">
            {CUT.slice(0, -1).map((at, i) => (
              <i key={at} className={styles.clip} data-n={i % 3} style={{ left: `${at}%`, width: `${CUT[i + 1] - at}%`, "--k": i + 1 }} />
            ))}
          </div>
          <span className={`${styles.code} ${styles.k}`} style={{ "--r": 11 }} aria-hidden="true">
            A1
          </span>
          <div className={`${styles.lane} ${styles.k} ${styles.track} ${styles.music}`} style={{ "--r": 11, "--k": 7 }} aria-hidden="true">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 6H40L42 12H66L68 6H100" />
            </svg>
          </div>
          <span className={`${styles.code} ${styles.k}`} style={{ "--r": 12 }} aria-hidden="true">
            C1
          </span>
          <div className={`${styles.lane} ${styles.k} ${styles.track}`} style={{ "--r": 12 }} aria-hidden="true">
            {CAPTION_AT.map((at, i) => (
              <i key={at} className={styles.word} style={{ left: `${at}%`, "--k": 8 + i }}>
                {tracks.captions[i]}
              </i>
            ))}
          </div>
          <span className={`${styles.rail} ${styles.keyRail}`} aria-hidden="true">
            <i />
          </span>
        </div>

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
