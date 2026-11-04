import { prompt, useCases } from "@/content/home";
import { productMake } from "@/content/product";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Builder } from "./builder";
import styles from "./make.module.css";

/**
 * Product page, "Make": where a video starts and the layers KeyFly builds
 * from it (see Builder), then a strip of the motion styles (the prompt
 * box's own list) and the templates.
 */
export function Make() {
  const { eyebrow, title, lead, note, styles: stylesStrip, ...builder } = productMake;
  const { templates } = useCases;

  return (
    <section id="make" className={styles.section} aria-labelledby="make-title" data-section="Make">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="make-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Builder {...builder} />

        <div className={styles.strip}>
          <p className={styles.stripLabel}>
            {stylesStrip.label}
            <span>{stylesStrip.note}</span>
          </p>
          <ul className={styles.styleList}>
            {prompt.styles.options
              .filter((o) => o.id !== "ai")
              .map((o) => (
                <li key={o.id} title={o.note}>
                  {o.label}
                </li>
              ))}
          </ul>
          <a className={styles.browse} href={templates.href}>
            <b>{templates.count}</b> {templates.cta}
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
