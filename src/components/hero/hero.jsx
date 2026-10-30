import { hero, prompt } from "@/content/home";
import { PointerField } from "./pointer-field";
import { PromptBox } from "./prompt-box";
import { TimelineFloor } from "./timeline-floor";
import styles from "./hero.module.css";

/**
 * The homepage hero: a headline, the Keyfly prompt box (as it appears in the
 * app) and, below it, an editing timeline that runs away to the horizon
 * with a mint playhead, so the first screen already reads as video editing.
 */
export function Hero() {
  let word = 0;

  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-section="Home">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.aurora} />
        <TimelineFloor />
        <div className={styles.grain} />
      </div>
      <PointerField className={styles.spot} />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.rec} aria-hidden="true" />
          {hero.eyebrow}
        </p>

        <h1 id="hero-title" className={styles.title}>
          {hero.title.map((line, l) => (
            <span key={l} className={styles.line}>
              {line.map((w, i) => (
                <span key={i}>
                  <span className={w.accent ? styles.accent : styles.word} style={{ "--w": word++ }}>
                    {w.text}
                  </span>
                  {i < line.length - 1 ? " " : null}
                </span>
              ))}{" "}
            </span>
          ))}
        </h1>

        <p className={styles.lead}>{hero.lead}</p>

        <PromptBox {...prompt} />
      </div>
    </section>
  );
}
