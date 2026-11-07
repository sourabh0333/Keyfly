import wipe from "@/components/scene/wipe.module.css";
import { pricingCompare } from "@/content/pricing";
import styles from "./compare.module.css";
import { ComparePaths } from "./compare-paths";

const amount = (s) => Number(String(s).replace(/[^0-9.]/g, ""));

// Each plan's value on a track, from the API's fields: a number (placed on
// a scale), a label (placed on a stop), or "custom" for a plan by
// arrangement that has no number for it.
function value(id, p, w) {
  const custom = Boolean(p.contact);
  const perSeat = p.seats?.perSeat;
  if (id === "price") {
    const pr = p.annual || p.monthly;
    if (pr) {
      const alt = p.annual && p.monthly && p.monthly.amount !== p.annual.amount ? w.monthly.replace("{amount}", p.monthly.amount) : null;
      return { n: amount(pr.amount), text: `${pr.amount}${perSeat ? ` ${w.perSeat}` : ""}`, sub: [p.annual?.billed, alt].filter(Boolean).join(" · ") };
    }
    return p.id === "free" ? { n: 0, text: w.zero } : { custom: true, text: w.custom };
  }
  if (id === "minutes") {
    if (p.aiMinutes === null) return custom ? { custom: true, text: w.custom } : { n: 0, text: w.none };
    return { n: p.aiMinutes, text: p.aiMinutes ? w.minutes.replace("{n}", p.aiMinutes) : w.none, sub: perSeat && p.aiMinutes ? w.perSeat : null };
  }
  if (id === "video") {
    if (p.generatedVideoSeconds === null) return custom ? { custom: true, text: w.custom } : { n: 0, text: w.none };
    return { n: p.generatedVideoSeconds, text: p.generatedVideoSeconds ? w.seconds.replace("{n}", p.generatedVideoSeconds) : w.none };
  }
  if (id === "storage") {
    if (p.storageGb === null) return custom ? { custom: true, text: w.custom } : { n: 0, text: w.none };
    return { n: p.storageGb, text: w.gb.replace("{n}", p.storageGb), sub: perSeat ? w.perSeat : null };
  }
  if (id === "exports") return { stop: p.exportsPerMonth === null ? w.unlimited : w.perMonthCount.replace("{n}", p.exportsPerMonth) };
  if (id === "size") return { stop: p.exportResolution || w.none };
  if (id === "mark") return { stop: p.watermark ? w.markOn : w.markOff };
  if (id === "seats") return { stop: custom ? w.custom : perSeat ? w.seatsFrom.replace("{n}", p.seats.minimum ?? 1) : w.seatsOne.replace("{n}", p.seats?.included ?? 1), sub: perSeat && !custom ? w.perSeat : null };
  if (id === "trial") return { stop: p.trial?.days ? (p.trial.noCard ? w.trial : w.trialCard).replace("{n}", p.trial.days) : w.none };
  return { stop: w.none };
}

// A scale's end label, in the track's own unit.
const ends = { price: (n) => `$${n}`, minutes: (n) => `${n}`, video: (n) => `${n} s`, storage: (n) => `${n} GB` };

/**
 * Pricing page, "Compare every plan": every plan as a path through the
 * editor's tracks (see ComparePaths), every number from the pricing API's
 * fields. Without the API the section isn't shown.
 */
export function Compare({ data }) {
  if (!data?.plans.length) return null;
  const { eyebrow, title, lead, lanes, tracks: defs, words, note } = pricingCompare;
  const plans = data.plans;

  const tracks = defs.map((t) => {
    const vals = Object.fromEntries(plans.map((p) => [p.id, value(t.id, p, words)]));
    if (t.kind === "scale") {
      const max = Math.max(1, ...Object.values(vals).map((v) => v.n ?? 0));
      const points = Object.fromEntries(
        Object.entries(vals).map(([id, v]) => [id, { x: v.custom ? null : Math.sqrt((v.n ?? 0) / max), text: v.text, sub: v.sub || null }]),
      );
      return { ...t, ends: [ends[t.id](0), ends[t.id](max)], custom: Object.values(vals).some((v) => v.custom), points };
    }
    // Stops: each value once, in the plans' order (the API lists them from
    // the smallest plan up), spread evenly.
    const stops = [...new Set(plans.map((p) => vals[p.id].stop))];
    const at = (s) => (stops.length > 1 ? stops.indexOf(s) / (stops.length - 1) : 0.5);
    const points = Object.fromEntries(Object.entries(vals).map(([id, v]) => [id, { x: at(v.stop), text: v.stop, sub: v.sub || null }]));
    return { ...t, stops: stops.map((s) => ({ label: s, x: at(s) })), custom: false, points };
  });

  // The plans, grouped in their lanes in the API's order; a plan not named
  // in a lane joins the one without a list (KeyFly's AI).
  const named = lanes.flatMap((l) => l.plans || []);
  const groups = lanes
    .map((l) => ({ name: l.name, plans: plans.filter((p) => (l.plans ? l.plans.includes(p.id) : !named.includes(p.id))) }))
    .filter((g) => g.plans.length)
    .map((g) => ({
      name: g.name,
      plans: g.plans.map((p) => ({
        id: p.id,
        name: p.name,
        popular: p.mostPopular,
        tagline: p.tagline,
        includes: p.includes,
        features: p.features,
        cta: p.cta ? { label: p.cta.label, href: p.contact || p.links?.year?.signup || p.cta.href } : null,
      })),
    }));
  const start = (plans.find((p) => p.mostPopular) || plans[0]).id;

  return (
    <section id="compare" className={styles.section} aria-labelledby="compare-title" data-section="Compare">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="compare-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <ComparePaths groups={groups} tracks={tracks} start={start} words={words} caption={title.map((l) => l.text).join(" ")} />

        <p className={styles.foot}>{note.replace("{currency}", data.currency || "USD")}</p>
      </div>
    </section>
  );
}
