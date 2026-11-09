import { productFootage } from "@/content/product";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Cleanup } from "./cleanup";
import styles from "./footage.module.css";
import { MoreLink } from "@/components/more-link";

/**
 * Product page, "Footage": one recording cleaned up in four passes (see
 * Cleanup), then where your footage goes.
 */
export function Footage() {
  const { eyebrow, title, lead, more, note, data, ...cleanup } = productFootage;

  return (
    <section id="footage" className={styles.section} aria-labelledby="footage-title" data-section="Footage">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="footage-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Cleanup {...cleanup} />

        <div className={styles.data}>
          <p className={styles.dataLabel}>{data.label}</p>
          <dl className={styles.dataList}>
            {data.items.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
          <a className={styles.download} href={data.link.href}>
            {data.link.label}
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
