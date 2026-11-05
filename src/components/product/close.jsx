import { Button } from "@/components/button";
import { productClose, productHero } from "@/content/product";
import wipe from "@/components/scene/wipe.module.css";
import styles from "./close.module.css";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Product page, "Close": a reel of the page's six parts, each a clip that
 * links back to its section, ending on a dashed, glowing clip still to
 * make ("Your video"). A mint playhead runs along the reel as it scrolls
 * up the screen (a view timeline, so it scrubs both ways) and lands on
 * that last clip. Then the headline and the two actions. Without
 * scroll-driven animation support, or with reduced motion, the playhead
 * rests on the last clip.
 */
export function Close() {
  const { eyebrow, title, lead, reelLabel, yours, primary, secondary } = productClose;
  const { stages } = productHero.map;

  return (
    <section id="close" className={styles.section} aria-labelledby="close-title" data-section="Close" data-tone="night">
      <div className={styles.inner}>
        <nav className={styles.reel} aria-label={reelLabel} data-main="">
          <ol className={styles.clips}>
            {stages.map((s, i) => (
              <li key={s.id}>
                <a href={s.href} className={styles.clip}>
                  <em>{pad(i + 1)}</em>
                  {s.name}
                </a>
              </li>
            ))}
            <li className={styles.yoursItem}>
              <span className={styles.yours}>
                <b>{yours.name}</b>
                <em>{yours.meta}</em>
              </span>
            </li>
          </ol>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.playhead} />
          </span>
        </nav>

        <div className={styles.head}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowMark} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id="close-title" className={`${styles.title} ${wipe.wipe}`}>
            {title.map((line, i) => (
              <span key={i} className={line.accent ? styles.accent : styles.plain}>
                {line.text}
                {i < title.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.actions}>
            <Button href={primary.href} arrow>
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="ghost">
              {secondary.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
