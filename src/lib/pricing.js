// KeyFly's plans come from its pricing API, never typed into the website
// (see the client's "Pricing API" document). Fetched on the server, at
// build time and then at most every 5 minutes (ISR); if a refresh fails,
// Next keeps serving the last good page. If there has never been a good
// fetch, getPricing returns null and the section shows its fallback.
const API = "https://api.keyfly.si/v1/public/pricing";
const ATTRIBUTION = "utm_source=keyfly.si&utm_medium=website&utm_campaign=pricing";

export const PRICING_REVALIDATE = 300;

const str = (v) => (typeof v === "string" && v.trim() ? v : null);
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const usd = (cents) => (num(cents) === null ? null : `$${Number.isInteger(cents / 100) ? cents / 100 : (cents / 100).toFixed(2)}`);

function price(p) {
  if (!p) return null;
  const amount = str(p.perMonthDisplay);
  if (!amount) return null;
  // The list price struck through when this one is lower (the API's field
  // is perMonthCents; an earlier version read "cents", so it never showed).
  const now = num(p.perMonthCents) ?? num(p.cents);
  const listDisplay = num(p.listCents) !== null && now !== null && p.listCents > now ? usd(p.listCents) : null;
  return { amount, cents: now, billed: str(p.billedDisplay), was: listDisplay, reason: str(p.reason), discount: num(p.discountPercent) };
}

function links(l) {
  const one = (x) => (x ? { checkout: str(x.checkout), signup: str(x.signup), login: str(x.login) } : null);
  return { month: one(l?.month), year: one(l?.year) };
}

function plan(p, i) {
  const id = str(p.id) || str(p.slug) || (str(p.name) || `plan-${i}`).toLowerCase().replace(/\s+/g, "-");
  return {
    id,
    name: str(p.name) || id,
    tagline: str(p.tagline),
    includes: str(p.includes),
    monthly: price(p.price?.monthly),
    annual: price(p.price?.annual),
    mostPopular: Boolean(p.mostPopular),
    // The API says cardRequired: false; an earlier version read noCard.
    trial: p.trial
      ? {
          days: num(p.trial.days),
          noCard: p.trial.cardRequired === false || Boolean(p.trial.noCard),
          aiMinutes: num(p.trial.aiMinutes),
          after: str(p.trial.afterTrial),
        }
      : null,
    aiMinutes: num(p.aiMinutesPerMonth),
    storageGb: num(p.storageGb),
    exportsPerMonth: num(p.exportsPerMonth),
    generatedVideoSeconds: num(p.generatedVideoSecondsPerMonth),
    exportResolution: str(p.maxExportResolution),
    watermark: typeof p.watermark === "boolean" ? p.watermark : null,
    seats: p.seats ? { perSeat: Boolean(p.seats.perSeat), minimum: num(p.seats.minimum), included: num(p.seats.included) } : null,
    features: Array.isArray(p.features) ? p.features.filter(str).slice(0, 5) : [],
    cta: p.cta && str(p.cta.label) && str(p.cta.href) ? { label: p.cta.label, href: p.cta.href } : null,
    contact: str(p.links?.month?.contact) || str(p.links?.year?.contact),
    links: links(p.links),
  };
}

function normalise(raw) {
  if (!raw || !Array.isArray(raw.plans) || !raw.plans.length) return null;
  const offer = raw.launchOffer;
  return {
    plans: raw.plans.map(plan),
    annualSavingsPercent: num(raw.annualSavingsPercent),
    launchOffer: offer ? str(offer.label) || str(offer.text) || str(offer.title) : null,
    currency: str(raw.currency),
    unit: raw.unit ? { name: str(raw.unit.name), description: str(raw.unit.description) } : null,
    packs: Array.isArray(raw.packs)
      ? raw.packs
          .map((k) => ({
            minutes: num(k.aiMinutes) ?? num(k.minutes),
            price: str(k.priceDisplay),
            bonus: num(k.bonusPercent),
            perMinuteCents: num(k.centsPerAiMinute),
            href: str(k.checkoutUrl),
          }))
          .filter((k) => k.minutes !== null && k.price && k.href)
      : [],
  };
}

// Development only: with the API out of reach (a sandbox, offline), a copy
// of its response can be read from a file outside the repository, named by
// KEYFLY_PRICING_FIXTURE. Never in production.
async function fixture() {
  const path = process.env.KEYFLY_PRICING_FIXTURE;
  if (!path || process.env.NODE_ENV === "production") return null;
  const { readFile } = await import("node:fs/promises");
  return JSON.parse(await readFile(path, "utf8"));
}

export async function getPricing() {
  try {
    const res = await fetch(`${API}?${ATTRIBUTION}`, {
      headers: { accept: "application/json" },
      next: { revalidate: PRICING_REVALIDATE },
    });
    if (!res.ok) throw new Error(`Pricing unavailable (${res.status})`);
    return normalise(await res.json());
  } catch {
    try {
      return normalise(await fixture());
    } catch {
      return null;
    }
  }
}
