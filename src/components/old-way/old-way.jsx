import { oldWay } from "@/content/home";
import { siteConfig } from "@/config/site";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Shot } from "@/components/shot/shot";
import { PlayOnView } from "./play-on-view";
import styles from "./old-way.module.css";

// By hand: raw footage in many small pieces (a fixed pattern, so server
// and client match).
const RAW = [3, 5, 2, 4, 6, 3, 2, 5, 4, 3, 6, 2, 4, 5, 3, 2, 6, 4, 3, 5];
const RAW_TOTAL = RAW.reduce((a, b) => a + b, 0);
const RAW_CLIPS = RAW.reduce((list, w) => {
  const left = list.length ? list.at(-1).left + list.at(-1).width : 0;
  return [...list, { left, width: (w / RAW_TOTAL) * 100 }];
}, []);

// With Keyfly: the finished cut.
const CUT = [0, 18, 34, 50, 68, 84, 100];
const CAPTION_AT = [4, 28, 52, 76];

function Check() {
  return (
    <svg className={styles.mark} viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <circle cx="9" cy="9" r="9" />
      <path d="M5 9.3 7.6 12 13 6.4" />
    </svg>
  );
}

function Dash() {
  return (
    <svg className={styles.mark} viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
      <circle cx="9" cy="9" r="8.25" />
      <path d="M6 9h6" />
    </svg>
  );
}

/**
 * "The old way": a comparison table. Three columns (the question, by hand,
 * with Keyfly) on one grid: the heads, then each side's editor (a viewer
 * over its timeline), then six rows that compare them, and Keyfly's column
 * on a mint-edged panel with a call to action at its foot.
 *
 * By hand, the viewer shows raw footage and the playhead crawls along raw
 * pieces, cutting as it goes; with Keyfly, the finished cut plays. CSS
 * only; the loops start when the table comes on screen (PlayOnView), and
 * without them (no JS, reduced motion) both editors hold still.
 */
export function OldWay() {
  const { eyebrow, title, lead, note, hand, keyfly, rows, cta } = oldWay;

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

        <div className={styles.table} role="table" aria-label={`${hand.label} / ${keyfly.label}`}>
          <PlayOnView />
          <span className={styles.panel} aria-hidden="true" />

          {/* Heads. */}
          <div className={styles.row} role="row">
            <span className={styles.corner} role="columnheader" />
            <p className={`${styles.colHead} ${styles.handCol}`} role="columnheader">
              {hand.label}
              <span className={styles.busy}>
                <i />
                {hand.busy}
              </span>
            </p>
            <p className={`${styles.colHead} ${styles.keyCol}`} role="columnheader">
              {keyfly.label}
              <span className={styles.ready}>
                <i />
                {keyfly.done}
              </span>
            </p>
          </div>

          {/* The two editors. */}
          <div className={`${styles.row} ${styles.screens}`} aria-hidden="true">
            <span className={`${styles.corner} ${styles.q}`}>{oldWay.editLabel}</span>
            <div className={`${styles.editor} ${styles.handCol} ${styles.handEditor}`}>
              <div className={styles.viewer}>
                <Shot />
                <span className={styles.rawWash} />
                <span className={styles.tag}>{hand.clip}</span>
              </div>
              <div className={styles.timeline}>
                <div className={styles.track}>
                  {RAW_CLIPS.map((c, i) => (
                    <i key={i} className={styles.raw} style={{ left: `${c.left}%`, width: `${c.width}%` }} />
                  ))}
                  <span className={styles.worked}>
                    {RAW_CLIPS.map((c, i) => (
                      <i key={i} className={styles.cutPiece} style={{ left: `${c.left}%`, width: `${c.width}%` }} />
                    ))}
                  </span>
                </div>
                <div className={`${styles.track} ${styles.empty}`} />
                <span className={`${styles.rail} ${styles.handRail}`}>
                  <i />
                </span>
              </div>
            </div>

            <div className={`${styles.editor} ${styles.keyCol} ${styles.keyEditor}`}>
              <div className={styles.viewer}>
                <Shot />
                <span className={styles.lower}>
                  <b>{keyfly.title}</b>
                  <span>{keyfly.sub}</span>
                </span>
                <span className={styles.captions}>
                  {keyfly.captions.map((w, i) => (
                    <span key={w} style={{ "--i": i }}>
                      {w}
                    </span>
                  ))}
                </span>
                <span className={`${styles.tag} ${styles.tagMint}`}>
                  <i />
                  {keyfly.clip}
                </span>
              </div>
              <div className={styles.timeline}>
                <div className={styles.track}>
                  <i className={styles.titleClip} />
                  {CUT.slice(0, -1).map((at, i) => (
                    <i key={at} className={styles.clip} data-n={i % 3} style={{ left: `${at}%`, width: `${CUT[i + 1] - at}%` }} />
                  ))}
                </div>
                <div className={styles.track}>
                  {CAPTION_AT.map((at) => (
                    <i key={at} className={styles.word} style={{ left: `${at}%` }} />
                  ))}
                </div>
                <span className={`${styles.rail} ${styles.keyRail}`}>
                  <i />
                </span>
              </div>
            </div>
          </div>

          {/* The comparison. */}
          {rows.map((row) => (
            <div key={row.q} className={styles.row} role="row">
              <span className={styles.q} role="rowheader">
                {row.q}
              </span>
              <span className={`${styles.cell} ${styles.handCol}`} role="cell">
                <Dash />
                {row.hand}
              </span>
              <span className={`${styles.cell} ${styles.keyCol} ${styles.yes}`} role="cell">
                <Check />
                {row.keyfly}
              </span>
            </div>
          ))}

          <div className={`${styles.row} ${styles.foot}`}>
            <span className={styles.corner} />
            <span className={styles.handCol} />
            <span className={styles.keyCol}>
              <a className={styles.cta} href={siteConfig.appUrl}>
                {cta}
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </span>
          </div>
        </div>

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
