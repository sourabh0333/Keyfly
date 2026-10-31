import { yourCall } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { DecisionTimeline } from "./decision-timeline";
import styles from "./your-call.module.css";

/**
 * "You make the calls": every decision Keyfly made, pinned to the
 * timeline with its reason and a switch to change it (see
 * DecisionTimeline).
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

        <DecisionTimeline {...timeline} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
