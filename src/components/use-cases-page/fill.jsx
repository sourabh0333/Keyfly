import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { useCasesFill } from "@/content/use-cases";
import { TemplateFill } from "./template-fill";
import styles from "./fill.module.css";

/**
 * Use cases page, "From template to your video": one real template taken
 * from the app's card to a finished, on-brand video (see TemplateFill).
 */
export function Fill() {
  const { eyebrow, title, lead, note, ...fill } = useCasesFill;

  return (
    <section id="template-to-video" className={styles.section} aria-labelledby="fill-title" data-section="Template to video">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="fill-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <TemplateFill {...fill} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
