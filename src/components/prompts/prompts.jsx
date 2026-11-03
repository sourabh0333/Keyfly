import { prompts } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { PromptList } from "./prompt-list";
import styles from "./prompts.module.css";

/**
 * "Start from a prompt": example prompts to send to the hero's prompt box
 * (see PromptList), then a last row pointing to the app's templates.
 */
export function Prompts() {
  const { eyebrow, title, lead, note, templates, ...list } = prompts;

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

        <div className={styles.templates}>
          <p className={styles.goal}>{templates.label}</p>
          <div className={styles.templatesBody}>
            <p className={styles.templatesText}>
              <b>{templates.count}</b> {templates.line}
            </p>
            <span className={styles.meta}>{templates.meta}</span>
            <a className={styles.browse} href={templates.href}>
              {templates.cta}
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
