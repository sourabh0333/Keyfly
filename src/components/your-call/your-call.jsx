import { yourCall } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { DirectorNote } from "./director-note";
import { MoreLink } from "@/components/more-link";
import styles from "./your-call.module.css";

/**
 * "You make the calls": the AI director's note on the cut it built, every
 * decision with its reason and the options that also fit, beside the cut
 * itself (see DirectorNote).
 */
export function YourCall() {
  const { eyebrow, title, lead, more, note, ...director } = yourCall;

  return (
    <section id="control" className={styles.section} aria-labelledby="control-title" data-section="Your call">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="control-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>
            {lead}
            <MoreLink {...more} />
          </p>
        </div>

        <DirectorNote {...director} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
