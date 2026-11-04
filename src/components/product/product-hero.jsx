import { Button } from "@/components/button";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { productHero } from "@/content/product";
import { Anatomy } from "./anatomy";
import styles from "./product-hero.module.css";

/**
 * The Product page's hero: centred, oversized type with the promise and
 * its two actions, then the product itself: an illustrative KeyFly editor,
 * tipped back and settling flat as the page scrolls, with the page's six
 * stages pinned to the parts they explain (see Anatomy). The screen's mint
 * light spills up behind it; a row of facts read from the app closes it.
 */
export function ProductHero() {
  const { eyebrow, title, lead, primary, secondary, map, facts, note } = productHero;

  return (
    <section className={styles.hero} data-tone="night" aria-labelledby="product-title" data-section="Intro">
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
          <h1 id="product-title" className={styles.title}>
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

        <Anatomy {...map} />

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
