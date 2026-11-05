import { memo } from "react";
import styles from "./row-preview.module.css";

// One looping clip per row of "Your way", drawn in CSS (8 s loops, sized
// in cqw of the box). Each is illustrative.

function Platform({ places, project, synced }) {
  return (
    <div className={styles.platform}>
      {places.map((p, i) => (
        <span key={p} className={styles.place} style={{ "--i": i }} data-kind={i}>
          <span className={styles.placeBar}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.placeBody} />
          <em>{p}</em>
        </span>
      ))}
      <span className={styles.project}>
        <i />
        {project}
      </span>
      <span className={styles.synced}>● {synced}</span>
    </div>
  );
}

function Ai({ agents, cloud, own }) {
  return (
    <div className={styles.ai}>
      <ul className={styles.agents}>
        {agents.map((a) => (
          <li key={a}>{a}</li>
        ))}
        <span className={styles.pick} />
      </ul>
      <span className={styles.cost}>
        <b>{cloud}</b>
        <b>{own}</b>
      </span>
    </div>
  );
}

function Projects({ file, timeline, zip }) {
  return (
    <div className={styles.projects}>
      <span className={styles.strip}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className={`${styles.out} ${styles.outFile}`}>
        <b>{file}</b>
        <span className={styles.bar}>
          <i />
        </span>
      </span>
      <span className={`${styles.out} ${styles.outTimeline}`}>
        <b>{timeline}</b>
        <em>{zip}</em>
      </span>
    </div>
  );
}

function Data({ local, step }) {
  return (
    <div className={styles.data}>
      <span className={styles.laptop}>
        <span className={styles.screen}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.base} />
        <span className={styles.padlock} />
        <em>{local}</em>
      </span>
      <span className={styles.cloud}>
        <em>{step}</em>
      </span>
      <span className={styles.packet} />
    </div>
  );
}

function Team({ kit, people, comments }) {
  return (
    <div className={styles.team}>
      <span className={styles.kit}>
        <b>{kit}</b>
        <span className={styles.swatches}>
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </span>
      {people.map((p, i) => (
        <span key={p} className={styles.person} style={{ "--i": i }}>
          {p}
        </span>
      ))}
      {comments.map((c, i) => (
        <span key={c} className={styles.bubble} style={{ "--i": i }}>
          {c}
        </span>
      ))}
    </div>
  );
}

const KINDS = { platform: Platform, ai: Ai, projects: Projects, data: Data, team: Team };

/** The clip for one row (`kind` is the row's id). */
export const RowPreview = memo(function RowPreview({ kind, preview }) {
  const Kind = KINDS[kind];
  return (
    <div className={styles.clip} aria-hidden="true">
      <Kind {...preview} />
    </div>
  );
});
