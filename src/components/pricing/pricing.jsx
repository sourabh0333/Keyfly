import { pricing } from "@/content/home";
import { siteConfig } from "@/config/site";
import { getPricing } from "@/lib/pricing";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Plans } from "./plans";
import { Render } from "./render";
import styles from "./pricing.module.css";

function Heading({ eyebrow, title, lead }) {
  return (
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
  );
}

/**
 * Pricing: the plans from Keyfly's pricing API (see Plans and
 * src/lib/pricing.js). Until there has been a good fetch, it shows the
 * plans "still rendering" (see Render) with what you can do today.
 */
export async function Pricing() {
  const data = await getPricing();
  const { eyebrow, title, lead, plans, pending } = pricing;

  return (
    <section id="pricing" className={styles.section} aria-labelledby="pricing-title" data-section="Pricing">
      <PauseOffscreen />
      <div className={styles.inner}>
        {data ? (
          <>
            <Heading eyebrow={eyebrow} title={title} lead={lead} />
            <Plans data={data} copy={plans} />
          </>
        ) : (
          <>
            <Heading eyebrow={eyebrow} title={pending.title} lead={pending.lead} />
            <Render file={pending.file} status={pending.status} statusNote={pending.statusNote} />
            <div className={styles.actionsRow}>
              <span className={styles.until}>{pending.until}</span>
              <a className={styles.primaryLink} href={siteConfig.appUrl}>
                {pending.primary}
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a className={styles.secondaryLink} href="#download">
                {pending.secondary}
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
