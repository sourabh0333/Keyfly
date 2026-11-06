import wipe from "@/components/scene/wipe.module.css";
import { integrationsFaq } from "@/content/integrations";
import { QuestionMap } from "./question-map";
import styles from "./questions.module.css";

/**
 * Integrations page, "Questions": topic, question and answer as three
 * columns joined by wires (see QuestionMap).
 */
export function Questions() {
  const { eyebrow, title, lead, ...map } = integrationsFaq;

  return (
    <section id="questions" className={styles.section} aria-labelledby="questions-title" data-section="Questions">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="questions-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <QuestionMap {...map} />
      </div>
    </section>
  );
}
