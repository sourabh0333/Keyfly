import { AccentText } from "./accent-text";
import rise from "./rise.module.css";
import styles from "./section-head.module.css";

/**
 * A section's opening: a small status chip and the heading on the left,
 * a short paragraph on the right, rising in as they scroll into view.
 */
export function SectionHead({ id, chip, title, aside }) {
  return (
    <header className={styles.head}>
      <div className={styles.main}>
        <p className={`${styles.chip} ${rise.rise}`}>
          <span className={styles.dot} aria-hidden="true" />
          {chip}
        </p>
        <h2 id={id} className={`${styles.title} ${rise.rise}`} style={{ "--rise-delay": "6%" }}>
          <AccentText text={title} />
        </h2>
      </div>
      {aside ? (
        <p className={`${styles.aside} ${rise.rise}`} style={{ "--rise-delay": "12%" }}>
          {aside}
        </p>
      ) : null}
    </header>
  );
}
