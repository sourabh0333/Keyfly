import { closing, prompt } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { PromptBox } from "@/components/hero/prompt-box";
import styles from "./closing.module.css";

/**
 * The closing call to action: a big two-line heading and the hero's
 * working prompt box again (a second instance, so it doesn't take the
 * page's drops or "Try this prompt"; those stay with the hero's), over a
 * ruler with the mint playhead under the box, the hero's horizon echoed.
 */
export function Closing() {
  const { eyebrow, title, lead, alt } = closing;

  return (
    <section id="start" className={styles.section} aria-labelledby="start-title" data-section="Start">
      <PauseOffscreen />
      <span className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.rec} aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id="start-title" className={`${styles.title} ${wipe.wipe}`}>
          {title.map((line, i) => (
            <span key={i} className={line.accent ? styles.accent : styles.plain}>
              {line.text}
              {i < title.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <p className={styles.lead}>{lead}</p>

        <div className={styles.box}>
          <PromptBox {...prompt} id="closing-prompt" primary={false} />
        </div>

        <a className={styles.alt} href={alt.href}>
          {alt.label}
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
            <path d="M8 3v9.5M3.5 8 8 12.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* The horizon: a ruler across the page with the playhead under the box. */}
      <div className={styles.horizon} aria-hidden="true">
        <i />
      </div>
    </section>
  );
}
