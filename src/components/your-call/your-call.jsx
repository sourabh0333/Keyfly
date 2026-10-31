import { yourCall } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { EditSentence } from "./edit-sentence";
import styles from "./your-call.module.css";

/**
 * "You make the calls": Keyfly's edit explained in one sentence whose
 * choices are switches, beside a monitor of the result (see EditSentence).
 */
export function YourCall() {
  const { eyebrow, title, lead, note, ...timeline } = yourCall;

  return (
    <section id="control" className={styles.section} aria-labelledby="control-title" data-section="Your call">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="control-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <EditSentence {...timeline} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
