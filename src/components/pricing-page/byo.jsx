import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { pricingByo } from "@/content/pricing";
import styles from "./byo.module.css";
import { ByoConsole } from "./byo-console";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Export sizes by their width in pixels, to compare them.
const WIDTH = { "720p": 1280, "1080p": 1920, "2K": 2560, "4K": 3840 };
// How full a meter stands for a plan's limit when the other plan has none.
const CAPPED = 0.34;

const minutesOf = (p) => {
  const line = p.features.find((x) => /^Videos up to/i.test(x));
  const n = line && Number(line.match(/(\d+)\s*minute/i)?.[1]);
  return n ? { n, text: line.replace(/^Videos up to/i, "Up to") } : null;
};

// One channel for both plans: each plan's value as text, and how full its
// meter stands (0 to 1). Where both are numbers the meters keep their true
// ratio; "Unlimited" fills the meter.
function channel(id, a, b, w) {
  const pair = (x, y, text) => {
    const max = Math.max(x ?? 0, y ?? 0) || 1;
    return [
      { text: text(x), level: (x ?? 0) / max },
      { text: text(y), level: (y ?? 0) / max },
    ];
  };
  const limitPair = (x, y) => {
    // x and y are text; "unlimited" (any case) fills the meter.
    const open = (t) => /unlimited/i.test(t);
    return [x, y].map((t) => ({ text: open(t) ? w.unlimited : t, level: open(t) ? 1 : CAPPED, open: open(t) }));
  };

  if (id === "agent") {
    const line = (p) => p.features.find((x) => /Claude|Codex|Cursor/.test(x));
    const tail = (p) => (line(p) ? cap(line(p).split(", ").at(-1)) : w.none);
    return limitPair(tail(a), tail(b));
  }
  if (id === "exports") {
    const t = (p) => (p.exportsPerMonth === null ? w.unlimited : w.perMonthCount.replace("{n}", p.exportsPerMonth));
    return limitPair(t(a), t(b));
  }
  if (id === "size") return pair(WIDTH[a.exportResolution], WIDTH[b.exportResolution], (v) => Object.keys(WIDTH).find((k) => WIDTH[k] === v) || w.none);
  if (id === "length") {
    const [x, y] = [minutesOf(a), minutesOf(b)];
    const max = Math.max(x?.n ?? 0, y?.n ?? 0) || 1;
    return [x, y].map((m) => ({ text: m ? m.text : w.none, level: m ? m.n / max : 0 }));
  }
  if (id === "storage") return pair(a.storageGb, b.storageGb, (v) => (v === null ? w.none : w.gb.replace("{n}", v)));
  if (id === "voice") return pair(a.aiMinutes, b.aiMinutes, (v) => (v ? w.aiMinutes.replace("{n}", v) : w.none));
  return [
    { text: w.none, level: 0 },
    { text: w.none, level: 0 },
  ];
}

// A plan's price and button, for the console's foot.
function plan(p, w) {
  const price = p.annual || p.monthly;
  const alt = p.annual && p.monthly && p.monthly.amount !== p.annual.amount ? p.monthly.amount : null;
  return {
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    amount: price ? price.amount : w.zero,
    per: price ? w.perMonth : w.forever,
    billed: [p.annual?.billed, alt ? w.monthly.replace("{amount}", alt) : null].filter(Boolean),
    size: p.exportResolution,
    mark: p.watermark === true,
    cta: p.cta ? { label: p.cta.label, href: p.links?.year?.signup || p.cta.href } : null,
  };
}

/**
 * Pricing page, "Bring your own AI": the two plans where your own agent
 * does the work, as an editor's limiter (see ByoConsole). Every value is
 * the pricing API's; without either plan the section isn't shown.
 */
export function Byo({ data }) {
  if (!data) return null;
  const { eyebrow, title, lead, plans, console: copy, film, channels, words, connect, pause, play, note } = pricingByo;
  const [free, byo] = plans.map((id) => data.plans.find((p) => p.id === id));
  if (!free || !byo) return null;
  const meters = channels.map((c) => {
    const [a, b] = channel(c.id, free, byo, words);
    return { ...c, free: a, byo: b };
  });

  return (
    <section id="byo" className={styles.section} aria-labelledby="byo-title" data-section="Your own AI">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="byo-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <ByoConsole copy={copy} film={film} meters={meters} plans={[plan(free, words), plan(byo, words)]} mark={words.mark} pause={pause} play={play} />

        <p className={styles.foot}>
          <span>{note}</span>
          <a href={connect.href}>{connect.label} →</a>
        </p>
      </div>
    </section>
  );
}
