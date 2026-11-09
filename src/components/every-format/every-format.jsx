import { everyFormat } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Morph } from "./morph";
import { MoreLink } from "@/components/more-link";
import styles from "./every-format.module.css";

/**
 * "One edit, every format": one frame that morphs through every shape
 * (see Morph).
 */
export function EveryFormat() {
  const { eyebrow, title, lead, more, note, ...editor } = everyFormat;

  return (
    <section id="formats" className={styles.section} aria-labelledby="formats-title" data-section="Every format">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="formats-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>
            {lead}
            <MoreLink {...more} />
          </p>
        </div>

        <Morph {...editor} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
