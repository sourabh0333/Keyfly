import { Logo } from "@/components/logo";
import { getKeyfly } from "@/content/home";
import { AccentText } from "./accent-text";
import rise from "./rise.module.css";
import styles from "./get-keyfly.module.css";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 2.5v9M4 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The close: a Night card with the logo beside a soft mint card that
 * carries the download, one button per desktop. Until a platform has a
 * link its button reads "soon" and does nothing.
 */
export function GetKeyfly() {
  return (
    <section id={getKeyfly.id} className={styles.section} aria-labelledby="get-keyfly-title">
      <div className={styles.inner}>
        <div className={`${styles.brandCard} ${rise.rise}`}>
          <Logo height={30} play="view" />
          <p className={styles.brandNote}>{getKeyfly.brandNote}</p>
          <p className={styles.platformsNote}>macOS / Windows / Linux</p>
        </div>

        <div className={`${styles.mintCard} ${rise.rise}`} style={{ "--rise-delay": "8%" }}>
          <p className={styles.kicker}>{getKeyfly.kicker}</p>
          <h2 id="get-keyfly-title" className={styles.title}>
            <AccentText text={getKeyfly.title} />
          </h2>
          <p className={styles.text}>{getKeyfly.text}</p>
          <ul className={styles.platforms}>
            {getKeyfly.platforms.map((platform) => (
              <li key={platform.id}>
                {platform.href ? (
                  <a href={platform.href} className={styles.platform}>
                    {platform.name}
                    <Arrow />
                  </a>
                ) : (
                  <span className={`${styles.platform} ${styles.soon}`}>
                    {platform.name}
                    <span className={styles.soonTag}>soon</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
