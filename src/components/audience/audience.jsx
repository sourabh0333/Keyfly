import { audience } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Roles } from "./roles";
import styles from "./audience.module.css";

/**
 * "Who it's for": Keyfly by role, with a preview of what each makes
 * (see Roles).
 */
export function Audience() {
  const { eyebrow, title, lead, note, ...roles } = audience;

  return (
    <section id="audience" className={styles.section} aria-labelledby="audience-title" data-section="Audience">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="audience-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Roles {...roles} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
