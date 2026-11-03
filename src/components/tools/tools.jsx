import { tools } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { Handoff } from "./handoff";
import styles from "./tools.module.css";

/**
 * "Works with your tools": bring your own AI, take the timeline to your
 * editor (see Handoff).
 */
export function Tools() {
  const { eyebrow, title, lead, note, ...handoff } = tools;

  return (
    <section id="tools" className={styles.section} aria-labelledby="tools-title" data-section="Your tools">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="tools-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Handoff {...handoff} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
