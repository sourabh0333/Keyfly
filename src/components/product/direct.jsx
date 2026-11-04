import { productDirect } from "@/content/product";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { DirectorTimeline } from "./director-timeline";
import styles from "./direct.module.css";

/**
 * Product page, "Direct": the AI director's reply after a build, its notes
 * pinned to the cut they describe (see DirectorTimeline), then the three
 * ways to steer it.
 */
export function Direct() {
  const { eyebrow, title, lead, note, steer, ...timeline } = productDirect;

  return (
    <section id="direct" className={styles.section} aria-labelledby="direct-title" data-section="Direct">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="direct-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <DirectorTimeline {...timeline} />

        <div className={styles.steer}>
          <p className={styles.steerLabel}>{steer.label}</p>
          <ol className={styles.steerList}>
            {steer.items.map((item, i) => (
              <li key={item.title}>
                <span className={styles.steerIndex}>{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
