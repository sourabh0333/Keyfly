import styles from "./divider.module.css";

/**
 * The break between two homepage sections: a timeline ruler across the
 * content column with the mint playhead in the middle. It takes no height
 * of its own, so the gap between sections stays the sections' own padding
 * (--section-pad on each side) and the ruler sits exactly in its middle.
 */
export function Divider() {
  return (
    <div className={styles.divider} aria-hidden="true">
      <div className={styles.ruler}>
        <i />
      </div>
    </div>
  );
}
