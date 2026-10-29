import { features } from "@/content/home";
import { BeatPanel, CutPanel, DirectorPanel } from "./feature-panels";
import rise from "./rise.module.css";
import { SectionHead } from "./section-head";
import styles from "./features.module.css";

const PANELS = { "first-cut": CutPanel, director: DirectorPanel, "beat-sync": BeatPanel };

/**
 * "Most of an edit is busywork": three rows, each a short claim beside an
 * illustrative glass panel that plays as it scrolls into view. Rows
 * alternate sides on wide screens.
 */
export function Features() {
  return (
    <section className={styles.features} aria-labelledby="features-title">
      <div className={styles.inner} id={features.id}>
        <SectionHead id="features-title" chip={features.chip} title={features.title} aside={features.aside} />

        <div className={styles.rows}>
          {features.rows.map((row) => {
            const Panel = PANELS[row.id];
            return (
              <article key={row.id} className={styles.row}>
                <div className={`${styles.text} ${rise.rise}`}>
                  <p className={styles.kicker}>{row.kicker}</p>
                  <h3 className={styles.title}>{row.title}</h3>
                  <p className={styles.body}>{row.text}</p>
                </div>
                <div className={`${styles.visual} ${rise.rise}`} style={{ "--rise-delay": "8%" }}>
                  <Panel />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
