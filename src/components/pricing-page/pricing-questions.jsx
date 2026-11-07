import wipe from "@/components/scene/wipe.module.css";
import { pricingFaq } from "@/content/pricing";
import { CaptionTrack } from "./caption-track";
import styles from "./pricing-questions.module.css";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// The facts the answers need, from the pricing API. Anything the API
// doesn't give stays undefined, and its question is left out.
function facts(data) {
  const plans = data.plans;
  const byId = (id) => plans.find((p) => p.id === id);
  const free = byId("free");
  const team = byId("team");
  const ent = byId("enterprise");
  const trialPlan = plans.find((p) => p.trial?.days);
  const agentLine = free?.features.find((f) => /Claude|Codex|Cursor/.test(f));
  const packs = [...data.packs].sort((a, b) => a.minutes - b.minutes).map((k) => `${k.minutes} for ${k.price}`);
  const paid = plans.filter((p) => p.id !== "free" && p.exportResolution);
  const save = Math.max(0, ...plans.map((p) => p.annual?.discount ?? 0));
  return {
    unit: data.unit?.description,
    trialPlan: trialPlan?.name,
    trialDays: trialPlan?.trial.days,
    trialMinutes: trialPlan?.trial.aiMinutes,
    afterTrial: trialPlan?.trial.after,
    freeRequests: agentLine ? agentLine.split(", ").at(-1) : undefined,
    packs: packs.length ? (packs.length > 1 ? `${packs.slice(0, -1).join(", ")} or ${packs.at(-1)}` : packs[0]) : undefined,
    save: save || undefined,
    freeSize: free?.watermark ? free.exportResolution : undefined,
    maxSize: paid.some((p) => p.watermark) ? undefined : paid.find((p) => p.exportResolution === "4K")?.exportResolution,
    editorPlan: plans.find((p) => p.features.some((f) => /Premiere|Final Cut|DaVinci/.test(f)))?.name,
    seatMin: team?.seats?.minimum,
    seatPrice: team?.annual?.amount,
    contact: (ent?.contact || ent?.cta?.href || "").replace(/^mailto:/, "") || undefined,
  };
}

// An answer with its tokens filled, or null when a fact is missing.
function fill(text, f) {
  let missing = false;
  const out = text.replace(/\{(\w+)\}/g, (_, k) => {
    if (f[k] === undefined || f[k] === null) missing = true;
    return String(f[k] ?? "");
  });
  return missing ? null : cap(out);
}

/**
 * Pricing page, "Questions": the pricing questions as a captions track
 * (see CaptionTrack); no boxes. Every number in an answer is the pricing
 * API's; a question whose facts it doesn't give is left out. Without the
 * API the section isn't shown.
 */
export function PricingQuestions({ data }) {
  if (!data) return null;
  const { eyebrow, title, lead, track, of, questions, help } = pricingFaq;
  const f = facts(data);
  const items = questions.map((q) => ({ ...q, a: fill(q.a, f) })).filter((q) => q.a);
  if (!items.length) return null;

  return (
    <section id="questions" className={styles.section} aria-labelledby="questions-title" data-section="Questions">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="questions-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <CaptionTrack items={items} label={track} of={of} />

        <p className={styles.help}>
          <span>{help.label}</span>
          <a href={`mailto:${help.email}`}>{help.email}</a>
          <span>{help.line}</span>
        </p>

      </div>
    </section>
  );
}
