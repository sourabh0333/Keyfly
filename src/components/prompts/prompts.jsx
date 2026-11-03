import { prompts } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { PromptList } from "./prompt-list";
import styles from "./prompts.module.css";

/**
 * "Start from a prompt": example prompts to send to the hero's prompt box
 * (see PromptList).
 */
export function Prompts() {
  const { eyebrow, title, lead, note, ...list } = prompts;

  return (
    <section id="prompts" className={styles.section} aria-labelledby="prompts-title" data-section="Prompts">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="prompts-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <PromptList {...list} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
