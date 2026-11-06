import { primaryCta } from "./navigation";

// The Pricing page (/pricing), built section by section from the plan in
// PLAN.md and the research in research_notes/pricing/. The rule from the
// client's "Pricing API" document: no price, allowance or plan line is typed
// into the website. Every number on this page comes from
// api.keyfly.si/v1/public/pricing (src/lib/pricing.js); this file holds only
// the words around them. Say "AI minutes", never "credits".

export const pricingMeta = {
  title: "Pricing",
  description:
    "Start free, bring the AI you already pay for, or let KeyFly's AI do the work. Every plan, its price and its AI minutes, in one place.",
};

export const pricingHero = {
  eyebrow: "Pricing",
  title: [{ text: "Pay for the AI's work." }, { text: "Nothing else.", accent: true }],
  lead: "Start free, bring the AI you already pay for, or let KeyFly's AI do the work. AI minutes count only the AI's actual work, never idle time.",
  // The films beside the heading: three bars a side, the first six in
  // order (left outer to inner, then right outer to inner), the rest
  // waiting; one bar at a time cuts to the film that has waited longest.
  // Single-shot loops cut from real stock clips (scripts/pricing-cells/)
  // and the founder recording. `at` keeps the subject in the narrow bar
  // (object-position). Illustrative.
  films: [
    { src: "/video/cells/lake.mp4", poster: "/video/cells/lake.webp", at: "44% 50%" },
    { src: "/video/cells/aerial.mp4", poster: "/video/cells/aerial.webp", at: "50% 50%" },
    { src: "/video/cells/host.mp4", poster: "/video/cells/host.webp", at: "62% 50%" },
    { src: "/video/cells/meadow.mp4", poster: "/video/cells/meadow.webp", at: "50% 50%" },
    { src: "/video/cells/park.mp4", poster: "/video/cells/park.webp", at: "50% 50%" },
    { src: "/video/cells/creator.mp4", poster: "/video/cells/creator.webp", at: "46% 50%" },
    { src: "/video/cells/phone.mp4", poster: "/video/cells/phone.webp", at: "50% 50%" },
    { src: "/video/footage-loop.mp4", poster: "/video/footage-loop.webp", at: "46% 50%" },
  ],
  pauseFilms: "Pause the films",
  playFilms: "Play the films",
  switch: { label: "Billing", monthly: "Monthly", yearly: "Yearly", save: "save up to {n}%" },
  sheet: {
    label: "Every plan",
    // The sheet's three lanes.
    ownLane: "With the AI you already pay for",
    mainLane: "With KeyFly's AI",
    teamLane: "For teams",
    free: "Free",
    forever: "forever",
    custom: "Custom",
    perMonth: "a month",
    perSeat: "a seat a month",
    minutes: "AI minutes a month",
    perSeatMinutes: "AI minutes a seat",
    noMinutes: "Your own AI",
    customMinutes: "Custom",
    popular: "Most popular",
    off: "{n}% off",
    noCard: "No card needed",
    trialMinutes: "{n} AI minutes to try",
    seatsMin: "from {n} seats",
  },
  // A line of what holds for every plan, from the API's own plan lines.
  promises: ["Free plan never expires", "Projects never expire", "AI minutes count only the AI's work", "Prices in {currency}"],
  primary: primaryCta,
  compare: { label: "Compare every plan", href: "#compare" },
  note: "Prices and allowances live from KeyFly's pricing API · Videos illustrative",
  pending: {
    title: "Plans are loading.",
    lead: "We couldn't reach our prices just now. You can start free today; every plan is in the app.",
    open: "Open KeyFly",
  },
};
