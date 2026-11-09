import { Button } from "@/components/button";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { useCasesHero } from "@/content/use-cases";
import { TemplateWall } from "./template-wall";
import styles from "./use-cases-hero.module.css";

/**
 * The Use cases page's hero: centred, oversized type with the promise and
 * its two actions, then a wall of KeyFly's real templates (names, shapes,
 * lengths and looks from the app; pictures illustrative) drifting in three
 * rows, and a row of facts between hairlines.
 */
export function UseCasesHero() {
  const { eyebrow, title, lead, primary, secondary, wall, facts, note } = useCasesHero;

  return (
    <section className={styles.hero} data-tone="night" aria-labelledby="use-cases-title" data-section="Intro">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.grain} />
      </div>
      <PauseOffscreen />

      <div className={styles.inner}>
        <div className={styles.head}>
          {/* The eyebrow is part of the h1, so the page's main heading names
              its topic ("AI video templates"); it looks as it did. */}
          <h1 id="use-cases-title" className={styles.heading}>
            <span className={styles.eyebrow}>
              <span className={styles.rec} aria-hidden="true" />
              {eyebrow}
              <span className="visually-hidden">: </span>
            </span>
            <span className={styles.title}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          </h1>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.actions}>
            <Button href={primary.href} arrow>
              {primary.label}
            </Button>
            <Button href={secondary.href} variant="ghost">
              {secondary.label} ↓
            </Button>
          </div>
        </div>
      </div>

      <TemplateWall {...wall} />

      <div className={styles.inner}>
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
