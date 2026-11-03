import { anywhere } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Doors } from "./doors";
import styles from "./anywhere.module.css";

/**
 * "Works where you work": one KeyFly project with the chat, the browser
 * and the desktop app around it (see Doors).
 */
export function Anywhere() {
  const { eyebrow, title, lead, note, ...doors } = anywhere;

  return (
    <section id="anywhere" className={styles.section} aria-labelledby="anywhere-title" data-section="Anywhere">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="anywhere-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Doors {...doors} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
