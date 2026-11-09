import { useCases } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { PresetDial } from "./preset-dial";
import { MoreLink } from "@/components/more-link";
import styles from "./use-cases.module.css";

/**
 * "Use cases": six of the app's use-case types (the hero's chips) on a jog wheel, with
 * the one at the notch playing beside it (see PresetDial), then a row
 * pointing to the app's templates.
 */
export function UseCases() {
  const { eyebrow, title, lead, more, note, templates, ...dial } = useCases;

  return (
    <section id="use-cases" className={styles.section} aria-labelledby="cases-title" data-section="Use cases">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="cases-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <PresetDial {...dial} />

        <p className={styles.note}>{note}</p>

        <div className={styles.templates}>
          <p className={styles.templatesLabel}>{templates.label}</p>
          <p className={styles.templatesText}>
            <b>{templates.count}</b> {templates.line}
          </p>
          <span className={styles.templatesMeta}>{templates.meta}</span>
          <a className={styles.browse} href={templates.href}>
            {templates.cta}
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
