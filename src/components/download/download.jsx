import { download } from "@/content/home";
import { Installer } from "./installer";
import styles from "./download.module.css";

/**
 * "Download": the closing call to action, in the same editor language as
 * the sections above: the heading, then an installer window (see
 * Installer) where Keyfly flies to the visitor's platform, with the
 * platform list and buttons in its side panel and the install on a
 * timeline beneath.
 */
export function Download() {
  const { eyebrow, title, lead, note, window: frame, ...installer } = download;

  return (
    <section id="download" className={styles.section} aria-labelledby="download-title" data-section="Download">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow} data-landing>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="download-title" className={styles.title}>
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

        <Installer {...frame} {...installer} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
