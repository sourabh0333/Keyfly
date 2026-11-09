import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { integrationsCost } from "@/content/integrations";
import { CostLedger } from "./cost-ledger";
import styles from "./cost.module.css";
import { MoreLink } from "@/components/more-link";

/**
 * Integrations page, "Cost and your data": a ledger of each way of working,
 * its AI minutes and where your files go (see CostLedger), then three
 * promises between hairlines.
 */
export function Cost() {
  const { eyebrow, title, lead, more, promises, note, ...ledger } = integrationsCost;

  return (
    <section id="cost" className={styles.section} aria-labelledby="cost-title" data-section="Cost and data">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="cost-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>
            {lead}
            <MoreLink {...more} />
          </p>
        </div>

        <CostLedger {...ledger} />

        <dl className={styles.promises}>
          {promises.map((p) => (
            <div key={p.title} className={styles.promise}>
              <dt>{p.title}</dt>
              <dd>
                {p.body}
                {p.link ? (
                  <>
                    {" "}
                    <a href={p.link.href}>{p.link.label}</a>
                  </>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
