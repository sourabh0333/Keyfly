import { faq } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Ask } from "./ask";
import styles from "./faq.module.css";

/**
 * FAQ: the questions beside a panel where KeyFly answers them (see Ask).
 */
export function Faq() {
  const { eyebrow, title, lead, ...ask } = faq;

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title" data-section="FAQ">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="faq-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Ask {...ask} />
      </div>
    </section>
  );
}
