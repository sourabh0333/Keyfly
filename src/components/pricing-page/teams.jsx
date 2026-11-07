import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { pricingTeams } from "@/content/pricing";
import styles from "./teams.module.css";
import { TeamSeats } from "./team-seats";

const amount = (s) => Number(String(s).replace(/[^0-9.]/g, ""));

/**
 * Pricing page, "Teams and Enterprise": type, hairlines and one timeline; no
 * boxes. Left, Team as a seat calculator (see TeamSeats): the API's
 * per-seat prices and allowances times the seats chosen. Right, across a
 * hairline, Enterprise in type: "Custom", the API's tagline and its plan
 * lines set large, and its contact link. Without the API, or without the
 * Team plan, the section isn't shown.
 */
export function Teams({ data }) {
  if (!data) return null;
  const team = data.plans.find((p) => p.id === "team");
  const ent = data.plans.find((p) => p.id === "enterprise");
  if (!team || !(team.annual || team.monthly)) return null;
  const { eyebrow, title, lead, seats, totals, custom, perSeatMonth, monthlyAlt, note } = pricingTeams;

  const per = {
    yearly: team.annual ? amount(team.annual.amount) : null,
    monthly: team.monthly ? amount(team.monthly.amount) : null,
    minutes: team.aiMinutes,
    storage: team.storageGb,
  };

  return (
    <section id="teams" className={styles.section} aria-labelledby="teams-title" data-section="Teams">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="teams-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <div className={styles.stage} data-main="">
          <TeamSeats
            plan={{
              name: team.name,
              tagline: team.tagline,
              includes: team.includes,
              features: team.features,
              price: (team.annual || team.monthly).amount,
              billed: [team.annual?.billed, team.monthly && team.annual ? monthlyAlt.replace("{amount}", team.monthly.amount) : null].filter(Boolean),
              cta: team.cta ? { label: team.cta.label, href: team.links?.year?.signup || team.cta.href } : null,
            }}
            per={per}
            min={team.seats?.minimum ?? 1}
            currency={data.currency || "USD"}
            copy={{ seats, totals, perSeatMonth }}
          />

          {ent ? (
            <div className={styles.enterprise}>
              <p className={styles.planName}>{ent.name}</p>
              <p className={styles.custom}>{custom}</p>
              {ent.tagline ? <p className={styles.tagline}>{ent.tagline}</p> : null}
              {ent.includes ? <p className={styles.includes}>{ent.includes}</p> : null}
              <ul className={styles.bigLines}>
                {ent.features.map((f) => (
                  <li key={f}>
                    <i aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              {ent.cta ? (
                <a className={styles.cta} href={ent.contact || ent.cta.href}>
                  {ent.cta.label} <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <p className={styles.foot}>{note.replace("{currency}", data.currency || "USD")}</p>
      </div>
    </section>
  );
}

