import { Button } from "@/components/button";
import { productYourWay } from "@/content/product";
import wipe from "@/components/scene/wipe.module.css";
import { Ledger } from "./ledger";
import styles from "./your-way.module.css";
import { MoreLink } from "@/components/more-link";

/**
 * Product page, "Your way": what KeyFly doesn't lock you into, as a ledger
 * of five rows that unlock as they come into view (see Ledger), then one
 * way in.
 */
export function YourWay() {
  const { eyebrow, title, lead, more, counter, previewNote, rows, cta } = productYourWay;

  return (
    <section id="your-way" className={styles.section} aria-labelledby="your-way-title" data-section="Your way" data-tone="night">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="your-way-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Ledger counter={counter} rows={rows} previewNote={previewNote} />

        <div className={styles.cta}>
          <Button href={cta.href} variant="ghost" arrow>
            {cta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
