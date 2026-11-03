import styles from "./divider.module.css";

/**
 * The cut between two homepage sections: a timeline ruler across the
 * content column. As it scrolls through the middle of the screen its mint
 * playhead sweeps across the ruler, tied to the scroll (a view timeline,
 * CSS only), lighting the ruler behind it; when it has crossed the middle,
 * the next section is marked as arrived (data-cut, set by SceneCuts) and
 * its eyebrow lights. Without scroll-driven animation, or with reduced
 * motion, the playhead stands still in the middle. It takes no height, so
 * the gap between sections stays their own padding.
 */
export function Divider() {
  return (
    <div className={styles.divider} data-divider="" aria-hidden="true">
      <div className={styles.ruler}>
        <span className={styles.lit} />
        <span className={styles.rail}>
          <i data-divider-head="" />
        </span>
      </div>
    </div>
  );
}
