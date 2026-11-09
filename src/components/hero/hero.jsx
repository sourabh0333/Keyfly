import { hero, prompt } from "@/content/home";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { FloorPause } from "./floor-pause";
import { PromptBox } from "./prompt-box";
import { TimelineFloor } from "./timeline-floor";
import styles from "./hero.module.css";

/**
 * The homepage hero: a headline, the KeyFly prompt box (as it appears in the
 * app) after a row of what KeyFly doesn't lock you into, and, below it, an
 * editing timeline that runs away to the horizon with a mint playhead, so
 * the first screen already reads as video editing.
 */
export function Hero() {
  let word = 0;

  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-section="Intro">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.aurora} />
        <TimelineFloor films={hero.floor.films} />
        <div className={styles.grain} />
      </div>
      <PauseOffscreen />
      <FloorPause pause={hero.floor.pause} play={hero.floor.play} />

      <div className={styles.inner}>
        {/* The eyebrow is part of the h1, so the page's main heading names
            what KeyFly is ("The AI video editor") as well as its promise.
            It looks exactly as it did as a separate line. */}
        <h1 id="hero-title" className={styles.heading}>
          <span className={styles.eyebrow}>
            <span className={styles.rec} aria-hidden="true" />
            {hero.eyebrow}
            <span className="visually-hidden">: </span>
          </span>
          <span className={styles.title}>
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
          </span>
        </h1>

        <p className={styles.lead}>{hero.lead}</p>

        <ul className={styles.proof}>
          {hero.proof.map((item) => (
            <li key={item.label}>
              <a href={item.href}>
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                  <path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.promptWrap}>
          <PromptBox {...prompt} />
        </div>
      </div>
    </section>
  );
}
