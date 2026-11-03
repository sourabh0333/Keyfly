import { pricing } from "@/content/home";
import { siteConfig } from "@/config/site";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Render } from "./render";
import styles from "./pricing.module.css";

/**
 * Pricing, not decided yet: shown as an export that's still rendering
 * (see Render), with what you can do today beneath. The status is also in
 * the heading and lead, so the render itself is decorative.
 */
export function Pricing() {
  const { eyebrow, title, lead, until, primary, secondary, ...render } = pricing;

  return (
    <section id="pricing" className={styles.section} aria-labelledby="pricing-title" data-section="Pricing">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="pricing-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Render {...render} />

        <div className={styles.actions}>
          <span className={styles.until}>{until}</span>
          <a className={styles.primary} href={siteConfig.appUrl}>
            {primary}
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a className={styles.secondary} href="#download">
            {secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
