import { editWithWords } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { CommandCut } from "./command-cut";
import styles from "./edit-with-words.module.css";

/**
 * "Edit with words": the first cut is a starting point, and you change it
 * by saying what you want (see CommandCut). Centred around a command bar,
 * unlike the side-by-side sections around it.
 */
export function EditWithWords() {
  const { eyebrow, title, lead, note, ...cut } = editWithWords;

  return (
    <section id="edit" className={styles.section} aria-labelledby="edit-title" data-section="Edit with words">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowMark} aria-hidden="true" />
            {eyebrow}
            <span className={styles.eyebrowMark} aria-hidden="true" />
          </p>
          <h2 id="edit-title" className={`${styles.title} ${wipe.wipe}`}>
            {title.map((line, i) => (
              <span key={i} className={line.accent ? styles.accent : styles.plain}>
                {line.text}
                {i < title.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p className={styles.lead}>{lead}</p>
        </div>

        <CommandCut {...cut} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
