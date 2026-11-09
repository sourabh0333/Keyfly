import { creates } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { Anatomy } from "./anatomy";
import { MoreLink } from "@/components/more-link";
import styles from "./creates.module.css";

/**
 * "What KeyFly makes": an illustrative film of how KeyFly makes a video,
 * played beside its panel and above its own timeline (see Anatomy).
 */
export function Creates() {
  const { eyebrow, title, lead, more, note, ...film } = creates;

  return (
    <section id="makes" className={styles.section} aria-labelledby="makes-title" data-section="What KeyFly makes">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="makes-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>
            {lead}
            <MoreLink {...more} />
          </p>
        </div>

        <Anatomy {...film} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
