import { Button } from "@/components/button";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { integrationsHero } from "@/content/integrations";
import { OrbitMap } from "./orbit-map";
import styles from "./integrations-hero.module.css";

/**
 * The Integrations page's hero: centred, oversized type with the promise
 * and its two actions, then the orbit of what KeyFly connects to (see
 * OrbitMap), and a row of facts between hairlines.
 */
export function IntegrationsHero() {
  const { eyebrow, title, lead, primary, secondary, map, facts, note } = integrationsHero;

  return (
    <section className={styles.hero} data-tone="night" aria-labelledby="integrations-title" data-section="Intro">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.grain} />
      </div>
      <PauseOffscreen />

      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>
            <span className={styles.rec} aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 id="integrations-title" className={styles.title}>
            {title.map((line, i) => (
              <span key={i} className={line.accent ? styles.accent : styles.plain}>
                {line.text}
                {i < title.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.actions}>
            <Button href={primary.href} arrow>
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="ghost">
              {secondary.label}
            </Button>
          </div>
        </div>

        <OrbitMap {...map} />

        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>
                <b>{fact.value}</b> {fact.label}
              </dt>
              <dd>{fact.detail}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
