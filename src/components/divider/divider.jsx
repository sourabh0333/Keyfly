import styles from "./divider.module.css";

/**
 * The break between two homepage sections: a timeline ruler across the
 * content column with the mint playhead in the middle, and the link: a
 * flight path down the middle of the gap, from where one section ends to
 * where the next begins. It swings out to one side, crosses the ruler
 * through the playhead and swings back the other way (gaps alternate
 * sides). SceneCuts shapes the curve to the gap, draws it as you scroll
 * (its tip riding the middle of the screen), and when it reaches the next
 * section that section's main content racks into focus (data-lit on its
 * [data-main]). It takes no height, so the gap stays the sections' own
 * padding.
 *
 * `ruler={false}` draws only the link (after the hero, whose timeline
 * floor is already a ruler); `up` and `down` set how far the link reaches
 * into the gap above and below (default: a section's padding each way).
 */
export function Divider({ ruler = true, up, down }) {
  return (
    <div className={styles.divider} data-divider={ruler ? "" : undefined} data-link="" aria-hidden="true" style={{ "--up": up, "--down": down }}>
      <span className={styles.link} data-link-line="">
        <svg className={styles.curve}>
          <path className={styles.track} data-path="" />
          <path className={styles.glow} data-path="" data-draw="" />
          <path className={styles.fill} data-path="" data-draw="" />
        </svg>
        <i className={styles.linkHead} data-link-head="" />
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
