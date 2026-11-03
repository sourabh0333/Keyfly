import styles from "./divider.module.css";

/**
 * The break between two homepage sections: a timeline ruler across the
 * content column with the mint playhead in the middle, and the link: a
 * vertical line down the middle of the gap, from where one section ends to
 * where the next begins, through the playhead. The line draws itself as
 * you scroll (SceneCuts sets --d, 0 to 1, its tip riding a fixed height on
 * screen), and when it reaches the next section that section's main
 * content lights up (data-lit on its [data-main]). It takes no height, so
 * the gap stays the sections' own padding.
 *
 * `ruler={false}` draws only the link (after the hero, whose timeline
 * floor is already a ruler); `up` and `down` set how far the link reaches
 * into the gap above and below (default: a section's padding each way).
 */
export function Divider({ ruler = true, up, down }) {
  return (
    <div className={styles.divider} data-divider={ruler ? "" : undefined} data-link="" aria-hidden="true" style={{ "--up": up, "--down": down }}>
      <span className={styles.link} data-link-line="">
        <i className={styles.linkFill} />
        <i className={styles.linkHead} />
      </span>
      {ruler ? (
        <div className={styles.ruler}>
          <span className={styles.rail}>
            <i data-divider-head="" />
          </span>
        </div>
      ) : null}
    </div>
  );
}
