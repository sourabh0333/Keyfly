import { download } from "@/content/home";
import { Installer } from "./installer";
import styles from "./download.module.css";

/**
 * "Download": the closing call to action. A centred heading over the
 * installer stage (see Installer), where Keyfly flies to the visitor's
 * platform, with the download or browser buttons beneath.
 */
export function Download() {
  const { eyebrow, title, lead, note, ...installer } = download;

  return (
    <section id="download" className={styles.section} aria-labelledby="download-title" data-section="Download">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowMark} aria-hidden="true" />
          {eyebrow}
          <span className={styles.eyebrowMark} aria-hidden="true" />
        </p>
        <h2 id="download-title" className={styles.title}>
          {title.map((line, i) => (
            <span key={i} className={line.accent ? styles.accent : styles.plain}>
              {line.text}
              {i < title.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <p className={styles.lead}>{lead}</p>

        <Installer {...installer} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
