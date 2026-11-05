import Link from "next/link";
import { productDeliver } from "@/content/product";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Routes } from "./routes";
import styles from "./deliver.module.css";

/**
 * Product page, "Deliver": one finished cut and its three ways out (see
 * Routes), then a line on what the plans decide.
 */
export function Deliver() {
  const { eyebrow, title, lead, note, plans, ...routes } = productDeliver;

  return (
    <section id="deliver" className={styles.section} aria-labelledby="deliver-title" data-section="Deliver">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="deliver-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <Routes {...routes} />

        <div className={styles.planLine}>
          <p>{plans.text}</p>
          <Link href={plans.href} className={styles.plansLink}>
            {plans.link}
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className={styles.footnote}>{note}</span>
        </div>
      </div>
    </section>
  );
}
