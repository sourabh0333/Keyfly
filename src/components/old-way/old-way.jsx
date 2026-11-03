import { oldWay } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Story } from "./story";
import styles from "./old-way.module.css";

/**
 * "The old way": the same launch video made two ways, six chores by hand
 * against one sentence with Keyfly, played by the scroll (see Story).
 */
export function OldWay() {
  const { eyebrow, title, lead, note, ...story } = oldWay;

  return (
    <section id="old-way" className={styles.section} aria-labelledby="old-way-title" data-section="The old way">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="old-way-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>{lead}</p>
        </div>

        <Story {...story} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
