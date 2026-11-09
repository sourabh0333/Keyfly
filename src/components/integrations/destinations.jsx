import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { integrationsDestinations } from "@/content/integrations";
import { Departures } from "./departures";
import styles from "./destinations.module.css";
import { MoreLink } from "@/components/more-link";

/**
 * Integrations page, "Where it goes": a departures board of the export
 * presets beside an export pass for the one in focus (see Departures).
 */
export function Destinations() {
  const { eyebrow, title, lead, more, plans, note, ...board } = integrationsDestinations;

  return (
    <section id="destinations" className={styles.section} aria-labelledby="destinations-title" data-section="Where it goes">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="destinations-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Departures {...board} />

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
