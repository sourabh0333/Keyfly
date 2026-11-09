import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { integrationsEditors } from "@/content/integrations";
import { RoundTrip } from "./round-trip";
import styles from "./editors.module.css";
import { MoreLink } from "@/components/more-link";

/**
 * Integrations page, "Your editor": the round trip from KeyFly to another
 * editor (see RoundTrip), then the three timeline formats in a strip
 * between hairlines, and what the plans say about timeline export.
 */
export function Editors() {
  const { eyebrow, title, lead, more, formats, plans, note, ...trip } = integrationsEditors;

  return (
    <section id="editors" className={styles.section} aria-labelledby="editors-title" data-section="Your editor">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="editors-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <RoundTrip {...trip} />

        <dl className={styles.formats}>
          {formats.map((format) => (
            <div key={format.name} className={styles.format}>
              <dt>{format.name}</dt>
              <dd>{format.detail}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.foot}>
          <p className={styles.plans}>
            {plans.text} <a href={plans.href}>{plans.link}</a>
          </p>
          <p className={styles.note}>{note}</p>
        </div>
      </div>
    </section>
  );
}
