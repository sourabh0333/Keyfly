import { useCases } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { Switcher } from "./switcher";
import styles from "./use-cases.module.css";

/**
 * "Use cases": the six presets from the prompt box as an open index
 * beside a frameless live preview (see Switcher), under the section heading.
 */
export function UseCases() {
  const { eyebrow, title, lead, cta, hint, note, items } = useCases;

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

        <Switcher items={items} cta={cta} hint={hint} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
