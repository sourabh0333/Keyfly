import Link from "next/link";
import { getPricing } from "@/lib/pricing";
import { productMinutes } from "@/content/product";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { MinuteMeter } from "./minute-meter";
import styles from "./minutes.module.css";

/**
 * Product page, "AI minutes": the pricing unit, explained once with one
 * illustrative session (see MinuteMeter), then each plan's AI minutes a
 * month as the pricing API gives them (no prices; those live in the
 * homepage's pricing section). If the API can't be reached the plans row
 * drops out and the link remains.
 */
export async function Minutes() {
  const { eyebrow, title, lead, note, plans, ...meter } = productMinutes;
  const pricing = await getPricing();
  const allowances = (pricing?.plans ?? [])
    .filter((p) => p.aiMinutes !== null && p.aiMinutes > 0)
    .sort((a, b) => a.aiMinutes - b.aiMinutes);
  const most = Math.max(1, ...allowances.map((p) => p.aiMinutes));

  return (
    <section id="minutes" className={styles.section} aria-labelledby="minutes-title" data-section="AI minutes">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="minutes-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <MinuteMeter {...meter} />
        <p className={styles.footnote}>{note}</p>

        <div className={styles.plans}>
          <p className={styles.plansLabel}>{plans.label}</p>
          {allowances.length ? (
            <ol className={styles.allowances}>
              {allowances.map((p) => (
                <li key={p.id} data-popular={p.mostPopular ? "" : undefined}>
                  <span className={styles.planName}>{p.name}</span>
                  <span className={styles.planBar} aria-hidden="true">
                    <i style={{ "--w": Math.sqrt(p.aiMinutes / most) }} />
                  </span>
                  <span className={styles.planMinutes}>
                    <b>{p.aiMinutes}</b> {plans.unit}
                    {p.seats?.perSeat ? <em> {plans.perSeat}</em> : null}
                  </span>
                </li>
              ))}
            </ol>
          ) : null}
          <p className={styles.packs}>
            {plans.packs}
            <Link href={plans.href} className={styles.plansLink}>
              {plans.link}
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
