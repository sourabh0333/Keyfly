import { productBrand } from "@/content/product";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { KitScan } from "./kit-scan";
import styles from "./brand.module.css";
import { MoreLink } from "@/components/more-link";

/**
 * Product page, "Brand": a website read into a brand kit, and the kit on
 * every new video (see KitScan).
 */
export function Brand() {
  const { eyebrow, title, lead, more, note, ...scan } = productBrand;

  return (
    <section id="brand" className={styles.section} aria-labelledby="brand-title" data-section="Brand">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="brand-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <KitScan {...scan} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
