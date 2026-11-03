import styles from "./divider.module.css";

/**
 * The break between two homepage sections: a timeline ruler across the
 * content column with the mint playhead in the middle. It takes no
 * height, so the gap between sections stays their own padding.
 */
export function Divider() {
  return (
    <div className={styles.divider} data-divider="" aria-hidden="true">
      <div className={styles.ruler}>
        <span className={styles.rail}>
          <i data-divider-head="" />
        </span>
      </div>
    </div>
  );
}
