import wipe from "@/components/scene/wipe.module.css";
import { categories, useCasesBrowse } from "@/content/use-cases";
import { CategoryBrowser } from "./category-browser";
import styles from "./browse.module.css";

/**
 * Use cases page, "Browse by category": every one of KeyFly's 91
 * templates, in the app's ten categories, with the app's own filters and
 * a sticky index (see CategoryBrowser).
 */
export function Browse() {
  const { eyebrow, title, lead, note, ...browser } = useCasesBrowse;

  return (
    <section id="categories" className={styles.section} aria-labelledby="categories-title" data-section="Categories">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="categories-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <CategoryBrowser categories={categories} {...browser} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
