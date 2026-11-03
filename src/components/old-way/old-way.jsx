import { oldWay } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { PlayOnView } from "./play-on-view";
import styles from "./old-way.module.css";

const pad = (n) => String(n).padStart(2, "0");

/**
 * "The old way": editing by hand beside one sentence to Keyfly, on one
 * grid whose rows both columns share, so each chore sits level with
 * Keyfly doing it. CSS only, on one 12s loop that starts when it comes on
 * screen (PlayOnView): the sentence types and sends, Keyfly ticks the
 * whole list and its bar fills, while by hand ticks one chore at a time
 * and never finishes. Without the loop (no JS, reduced motion) it shows
 * that moment: Keyfly done, by hand halfway.
 */
export function OldWay() {
  const { eyebrow, title, lead, note, hand, keyfly, ask, rows } = oldWay;

  return (
    <section id="old-way" className={styles.section} aria-labelledby="old-way-title" data-section="The old way">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="old-way-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <div className={styles.table}>
          <PlayOnView />
          <span className={styles.panel} aria-hidden="true" />
          <span className={styles.versus} aria-hidden="true">
            vs
          </span>

          {/* By hand */}
          <p className={`${styles.colHead} ${styles.left}`} style={{ "--r": 1 }}>
            {hand.label}
            <span className={styles.busy}>
              <i />
              {hand.busy}
            </span>
          </p>
          <p className={`${styles.start} ${styles.left}`} style={{ "--r": 2 }}>
            <span className={styles.scrub} aria-hidden="true">
              <i />
            </span>
            {hand.start}
          </p>
          <ol className={`${styles.list} ${styles.left}`} style={{ "--r": 3 }}>
            {rows.map((row, i) => (
              <li key={row.hand} className={styles.handRow} data-n={i}>
                <span className={styles.index}>{pad(i + 1)}</span>
                <span className={styles.box} aria-hidden="true">
                  <i />
                </span>
                <span className={styles.text}>{row.hand}</span>
              </li>
            ))}
          </ol>
          <div className={`${styles.barRow} ${styles.left}`} style={{ "--r": 4 }} aria-hidden="true">
            <span className={styles.bar}>
              <i className={styles.handFill} />
            </span>
          </div>

          {/* With Keyfly */}
          <p className={`${styles.colHead} ${styles.right}`} style={{ "--r": 1 }}>
            {keyfly.label}
            <span className={styles.state}>
              <span className={styles.editing}>
                <i />
                {keyfly.busy}
              </span>
              <span className={styles.ready}>
                <i />
                {keyfly.done}
              </span>
            </span>
          </p>
          <p className={`${styles.ask} ${styles.right}`} style={{ "--r": 2 }}>
            <span className={styles.chevron} aria-hidden="true">
              ›
            </span>
            <span className={styles.askText}>{ask}</span>
            <span className={styles.send} aria-hidden="true">
              <svg viewBox="0 0 16 16" width="12" height="12">
                <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </p>
          <ol className={`${styles.list} ${styles.right}`} style={{ "--r": 3 }}>
            {rows.map((row, i) => (
              <li key={row.keyfly} className={styles.keyRow} style={{ "--i": i }}>
                <span className={styles.check} aria-hidden="true">
                  <i />
                </span>
                <span className={styles.text}>{row.keyfly}</span>
              </li>
            ))}
          </ol>
          <div className={`${styles.barRow} ${styles.right}`} style={{ "--r": 4 }} aria-hidden="true">
            <span className={styles.bar}>
              <i className={styles.keyFill} />
            </span>
          </div>
        </div>

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
