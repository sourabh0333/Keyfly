import { useCases } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PresetDial } from "./preset-dial";
import styles from "./use-cases.module.css";

/**
 * "Use cases": the six presets from the prompt box on a jog wheel, with
 * the one at the notch playing beside it (see PresetDial).
 */
export function UseCases() {
  const { eyebrow, title, lead, note, ...dial } = useCases;

  return (
    <section id="use-cases" className={styles.section} aria-labelledby="cases-title" data-section="Use cases">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow} data-landing>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="cases-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <PresetDial {...dial} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
