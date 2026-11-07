import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { pricingFit } from "@/content/pricing";
import styles from "./plan-fit.module.css";
import { PlanRoute } from "./plan-route";

/**
 * Pricing page, "Which plan fits": two questions as a map of three tracks
 * (see PlanRoute), every price and plan line from the pricing API. Matched
 * to the API by plan id; a plan it doesn't list is left out, and without
 * the API the section isn't shown.
 */
export function PlanFit({ data }) {
  if (!data) return null;
  const { eyebrow, title, lead, questions, tracks, start, result, note, compare } = pricingFit;
  const ids = new Set(data.plans.map((p) => p.id));
  const shown = tracks.map((t) => ({ ...t, stops: t.stops.filter((s) => ids.has(s.plan)) })).filter((t) => t.stops.length);
  if (!shown.length) return null;
  const used = new Set(shown.flatMap((t) => t.stops.map((s) => s.plan)));
  const first = used.has(start) ? start : shown[0].stops[0].plan;

  return (
    <section id="fit" className={styles.section} aria-labelledby="fit-title" data-section="Plan fit">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="fit-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <PlanRoute tracks={shown} plans={data.plans.filter((p) => used.has(p.id))} start={first} questions={questions} copy={result} />

        <p className={styles.foot}>
          <span>{note}</span>
          <a href={compare.href}>{compare.label} ↓</a>
        </p>
      </div>
    </section>
  );
}
