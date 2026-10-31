import { download } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import motion from "@/components/scene/motion.module.css";
import { Landing } from "./landing";
import styles from "./download.module.css";

/**
 * "Download": the closing call to action. The scroll flies Keyfly onto the
 * visitor's desktop (see Landing).
 */
export function Download() {
  const { eyebrow, title, lead, note, ...landing } = download;

  return (
    <section id="download" className={styles.section} aria-labelledby="download-title" data-section="Download">
      <span className={motion.beam} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="download-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={`${styles.lead} ${motion.reveal}`}>{lead}</p>
        </div>

        <Landing {...landing} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
