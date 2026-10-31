import { memo } from "react";
import styles from "./preview.module.css";

const BARS = Array.from({ length: 18 }, (_, i) => i);

function Launch() {
  return (
    <div className={styles.launch}>
      <span className={styles.flash} />
      <p className={styles.launchWords}>
        {["Launch", "day", "is here"].map((word, i) => (
          <span key={word} style={{ "--i": i }}>
            {word}
            {i === 2 ? <i className={styles.point} /> : null}
          </span>
        ))}
      </p>
      <span className={styles.beats}>
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </span>
    </div>
  );
}

function Ugc() {
  return (
    <div className={styles.ugc}>
      <span className={styles.ringLight} />
      <span className={styles.person} />
      <span className={styles.hook}>
        <i />
        0:02
      </span>
      <p className={styles.captions}>
        {["This", "app", "edits", "for", "me"].map((word, i) => (
          <span key={word} style={{ "--i": i }}>
            {word}
          </span>
        ))}
      </p>
    </div>
  );
}

function Explainer() {
  return (
    <div className={styles.explainer}>
      <svg viewBox="0 0 160 90" className={styles.diagram}>
        <path className={styles.link} d="M44 45H66" />
        <path className={styles.link} d="M94 45h22" style={{ "--i": 1 }} />
        <rect className={styles.node} x="14" y="33" width="30" height="24" rx="5" />
        <rect className={styles.node} x="66" y="33" width="28" height="24" rx="5" style={{ "--i": 1 }} />
        <rect className={styles.node} x="116" y="33" width="30" height="24" rx="5" style={{ "--i": 2 }} />
        <circle className={styles.dot} cx="29" cy="45" r="3" />
        <circle className={styles.dot} cx="80" cy="45" r="3" style={{ "--i": 1 }} />
        <circle className={styles.dot} cx="131" cy="45" r="3" style={{ "--i": 2 }} />
      </svg>
      <span className={styles.callout}>Step 2</span>
      <span className={styles.voice}>
        {BARS.slice(0, 10).map((i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </span>
    </div>
  );
}

function Montage() {
  return (
    <div className={styles.montage}>
      {[1, 2, 3, 4].map((shot) => (
        <span key={shot} className={styles.shot} data-shot={shot} style={{ "--i": shot - 1 }} />
      ))}
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.ramp}>
        <path d="M0 16 C 20 16, 25 4, 45 4 S 70 16, 100 10" />
      </svg>
      <span className={styles.beats}>
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </span>
    </div>
  );
}

function Demo() {
  return (
    <div className={styles.demo}>
      <div className={styles.ui}>
        <span className={styles.uiSide} />
        <span className={styles.uiRows}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.uiButton}>Publish</span>
        <span className={styles.click} />
      </div>
      <svg viewBox="0 0 12 16" className={styles.cursor}>
        <path d="M1 1v12l3.2-3 2.3 5 2-.9-2.2-5H11Z" />
      </svg>
      <span className={styles.zoomTag}>Zoom 2×</span>
    </div>
  );
}

function Podcast() {
  return (
    <div className={styles.podcast}>
      <span className={styles.speaker}>
        <i />
      </span>
      <span className={styles.wave}>
        {BARS.map((i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
      </span>
      <p className={styles.quote}>“Start before you feel ready.”</p>
    </div>
  );
}

const KINDS = { launch: Launch, ugc: Ugc, explainer: Explainer, montage: Montage, demo: Demo, podcast: Podcast };

/**
 * A small looping preview of one use case, drawn in CSS at the use case's
 * format. Decorative: the text beside it says what it is. `bleed` fills a
 * monitor edge to edge (a vertical format is pillarboxed). Any ancestor
 * with data-paused pauses it, and it holds still with reduced motion.
 */
export const Preview = memo(function Preview({ kind, format, bleed = false }) {
  const Kind = KINDS[kind];
  return (
    <div className={styles.stage} data-bleed={bleed ? "" : undefined} aria-hidden="true">
      <div className={styles.screen} data-format={format}>
        <Kind />
        <span className={styles.safe} />
      </div>
    </div>
  );
});
