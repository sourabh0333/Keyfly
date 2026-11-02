import styles from "./shot.module.css";

/** An illustrative shot drawn in CSS: dusk through a window, a presenter. */
export function Shot() {
  return (
    <span className={styles.scene} aria-hidden="true">
      <span className={styles.sky} />
      <span className={styles.panes} />
      <span className={styles.floorLine} />
      <span className={styles.lamp} />
      <span className={styles.desk} />
      <span className={styles.subject}>
        <span className={styles.figure}>
          <i />
          <b />
        </span>
      </span>
    </span>
  );
}
