import Image from "next/image";
import soundstage from "@/assets/numbers/soundstage.webp";
import { glance } from "@/content/home";
import { GlanceShell } from "./glance-shell";
import styles from "./glance.module.css";

const camel = (at) => at.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const pad = (n) => String(n).padStart(2, "0");

/**
 * Keyfly at a glance, after the reference's numbers screen: a pinned frame
 * on a film set, a short statement top left and three true figures in the
 * corners that count up as the section arrives. The mint point waits in
 * the middle; scrolling on, it grows until it fills the frame.
 *
 * Server-rendered with the final figures; GlanceShell adds the motion.
 */
export function Glance() {
  return (
    <GlanceShell className={styles.glance}>
      <div className={styles.stage}>
        <div className={styles.backdrop} aria-hidden="true">
          <Image src={soundstage} alt="" fill sizes="100vw" placeholder="blur" className={styles.photo} />
          <div className={styles.shade} />
          <div className={styles.grid}>
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={styles.content}>
          <h2 id="glance-title" className="visually-hidden">
            {glance.title}
          </h2>
          <p className={styles.statement}>
            {glance.statement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          <dl className={styles.figures}>
            {glance.figures.map((figure) => (
              <div key={figure.id} className={`${styles.figure} ${styles[camel(figure.at)]}`}>
                <dt className={styles.label}>{figure.label}</dt>
                <dd className={styles.value} data-figure={figure.value}>
                  {pad(figure.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <span className={styles.point} aria-hidden="true" />
        <span className={styles.fill} data-fill aria-hidden="true" />
      </div>
    </GlanceShell>
  );
}
