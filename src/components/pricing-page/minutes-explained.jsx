import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { pricingMinutes } from "@/content/pricing";
import styles from "./minutes-explained.module.css";
import { PackRuler } from "./pack-ruler";

const dollars = (cents) => `$${(cents / 100).toFixed(2)}`;

/**
 * Pricing page, "AI minutes explained": type and hairlines only, no boxes.
 * First the unit as a dictionary entry (the term in the serif accent, the
 * pricing API's own definition) beside what counts and what never does;
 * then the AI-minute packs on a ruler scaled in minutes (see PackRuler).
 * The definition, packs and prices are the API's; without packs the ruler
 * is left out, and without the API the section isn't shown.
 */
export function MinutesExplained({ data }) {
  if (!data) return null;
  const { eyebrow, title, lead, term, kind, counts, never, promise, packs: copy, note } = pricingMinutes;
  const packs = [...data.packs].sort((a, b) => a.minutes - b.minutes);
  const max = Math.max(...packs.map((p) => p.minutes), 1);
  const best = Math.min(...packs.map((p) => p.perMinuteCents ?? Infinity));
  const marks = packs.map((p) => {
    const base = p.bonus ? Math.round(p.minutes / (1 + p.bonus / 100)) : p.minutes;
    return {
      minutes: p.minutes,
      base,
      x: p.minutes / max,
      from: base / max,
      price: p.price,
      bonus: p.bonus ? copy.bonus.replace("{n}", p.bonus) : null,
      perMinute: p.perMinuteCents ? copy.perMinute.replace("{amount}", dollars(p.perMinuteCents)) : null,
      best: packs.length > 1 && p.perMinuteCents === best,
      href: p.href,
    };
  });

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

        <div className={styles.entry} data-main="">
          <div className={styles.term}>
            <p className={styles.word}>
              {term}
              <span>{kind}</span>
            </p>
            {data.unit?.description ? <p className={styles.definition}>{data.unit.description}</p> : null}
          </div>

          <div className={styles.lists}>
            {[counts, never].map((list, i) => (
              <div key={list.label} className={styles.list} data-kind={i === 0 ? "counts" : "never"}>
                <p className={styles.listLabel}>{list.label}</p>
                <ul>
                  {list.items.map((item) => (
                    <li key={item}>
                      <i aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className={styles.promise}>{promise}</p>
          </div>
        </div>

        {marks.length ? <PackRuler marks={marks} max={max} copy={copy} /> : null}

        <p className={styles.foot}>{note}</p>
      </div>
    </section>
  );
}
