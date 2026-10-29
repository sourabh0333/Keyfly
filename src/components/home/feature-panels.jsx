import { InView } from "./in-view";
import styles from "./feature-panels.module.css";

/*
 * Illustrative panels for the feature rows (pictures of the tools, not
 * screenshots). Each plays once when it is well inside the viewport
 * (InView); without JS or with reduced motion they show their finished
 * state.
 */

const STEPS = [
  { name: "lay out first cut", fill: 1, state: "done" },
  { name: "match cuts to beat", fill: 1, state: "done" },
  { name: "add captions", fill: 0.62, state: "running" },
  { name: "reframe 9:16", fill: 0, state: "queued" },
];

export function CutPanel() {
  return (
    <InView className={styles.panel}>
      <div className={styles.head}>
        <span>run / launch film</span>
        <span className={styles.headNote}>first cut</span>
      </div>
      <ul className={styles.steps}>
        {STEPS.map((step, i) => (
          <li key={step.name} className={styles.step} data-state={step.state} style={{ "--i": i, "--fill": step.fill }}>
            <span className={styles.check} aria-hidden="true" />
            <span className={styles.stepName}>{step.name}</span>
            <span className={styles.track}>
              <span className={styles.fill} />
            </span>
            <span className={styles.stepState}>{step.state}</span>
          </li>
        ))}
      </ul>
      <div className={styles.axis} aria-hidden="true">
        {["0", "25", "50", "75", "100 %"].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </InView>
  );
}

// After the director's change the clips close up edge to edge and the logo
// clip lands on the drop at 66% (--moved is a share of each clip's own
// width: 2, 4 and 6 points of the timeline).
const CLIPS = [
  { from: 0, to: 22, moved: 0 },
  { from: 24, to: 46, moved: -9.09 },
  { from: 48, to: 70, moved: -18.18 },
  { from: 72, to: 96, moved: -25 },
];

export function DirectorPanel() {
  return (
    <InView className={styles.panel}>
      <div className={styles.head}>
        <span>#launch-film</span>
        <span className={styles.headNote}>ai director</span>
      </div>
      <div className={styles.chat}>
        <p className={styles.prompt}>
          <span className={styles.typed}>
            Make the opening faster and land the logo on the drop.
            <span className={styles.caret} aria-hidden="true" />
          </span>
        </p>
        <div className={styles.reply}>
          <span className={styles.replyMark} aria-hidden="true" />
          <div className={styles.replyBody}>
            <p>Tightened the opening and set the logo on the drop. Every change is on the timeline.</p>
            <ul className={styles.changes}>
              <li>trim / intro</li>
              <li>move / logo to drop</li>
              <li>ease / scale</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.timeline} aria-hidden="true">
        {CLIPS.map((clip, i) => (
          <span
            key={clip.from}
            className={i === 3 ? `${styles.clip} ${styles.clipLogo}` : styles.clip}
            style={{ left: `${clip.from}%`, width: `${clip.to - clip.from}%`, "--moved": `${clip.moved}%`, "--i": i }}
          />
        ))}
        <span className={styles.drop} />
      </div>
    </InView>
  );
}

// Isometric bars: the side faces are skewed rectangles scaled from the
// floor, the top is a rhombus lifted by the same amount (--h, animated).
const B = 160;
const W = 15;
const U = 100;
const RISE = 26.565; // atan(1/2): the isometric slope
const BARS = [0.55, 0.8, 0.62, 1.05, 0.7, 0.92, 1.2];

function Bar({ index, h }) {
  const cx = 44 + index * 54;
  const last = index === BARS.length - 1;
  return (
    <g className={last ? `${styles.bar} ${styles.barLit}` : styles.bar} style={{ "--hi": h, "--i": index }}>
      <rect
        className={styles.left}
        x={cx - W}
        y={B - U}
        width={W}
        height={U}
        style={{ transformOrigin: `${cx - W}px ${B}px`, "--skew": `${RISE}deg` }}
      />
      <rect
        className={styles.right}
        x={cx}
        y={B + W / 2 - U}
        width={W}
        height={U}
        style={{ transformOrigin: `${cx}px ${B + W / 2}px`, "--skew": `${-RISE}deg` }}
      />
      <polygon
        className={styles.top}
        points={`${cx},${B - W / 2} ${cx + W},${B} ${cx},${B + W / 2} ${cx - W},${B}`}
      />
      <text x={cx} y={B + 34} className={styles.beatLabel} textAnchor="middle">
        {(index % 4) + 1}
      </text>
    </g>
  );
}

export function BeatPanel() {
  return (
    <InView className={styles.panel}>
      <div className={styles.head}>
        <span>beat grid / soundtrack</span>
        <span className={styles.headNote}>on the beat</span>
      </div>
      <svg className={styles.bars} viewBox="0 0 420 210" aria-hidden="true">
        {BARS.map((h, i) => (
          <Bar key={i} index={i} h={h} />
        ))}
      </svg>
    </InView>
  );
}
