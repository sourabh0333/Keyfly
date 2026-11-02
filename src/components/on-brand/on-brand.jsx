import { onBrand } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { BrandReel } from "./brand-reel";
import styles from "./on-brand.module.css";

/**
 * "On brand, every time": one brand kit applied across a reel of
 * different videos (see BrandReel).
 */
export function OnBrand() {
  const { eyebrow, title, lead, note, ...kit } = onBrand;

  return (
    <section id="brand" className={styles.section} aria-labelledby="brand-title" data-section="On brand">
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
          <p className={styles.lead}>{lead}</p>
        </div>

        <BrandReel {...kit} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
