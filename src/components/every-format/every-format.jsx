import { everyFormat } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { FourScreens } from "./four-screens";
import styles from "./every-format.module.css";

/**
 * "One edit, every format": the Keyfly editor's export, one cut reframed
 * for each shape it needs (see ExportWindow).
 */
export function EveryFormat() {
  const { eyebrow, title, lead, note, ...exportWindow } = everyFormat;

  return (
    <section id="formats" className={styles.section} aria-labelledby="formats-title" data-section="Every format">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="formats-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <FourScreens {...exportWindow} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
