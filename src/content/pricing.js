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

// "Which plan fits": two questions as a map. The three tracks are the
// price sheet's three lanes (who does the work); each plan is a stop on its
// track, labelled with who it's for (from the API's own taglines). Plans
// are matched to the API by id; a plan the API doesn't list is left out.
export const pricingFit = {
  eyebrow: "Which plan fits",
  title: [{ text: "Two questions." }, { text: "One plan that fits.", accent: true }],
  lead: "Choose who does the work, then how much you'll make. The route lands on your plan, with every price from KeyFly's pricing API.",
  questions: ["Who does the work?", "How much will you make?"],
  tracks: [
    {
      id: "own",
      name: "Your own AI",
      line: "Claude Code, Codex or Cursor",
      stops: [
        { plan: "free", fit: "Just trying it" },
        { plan: "byo", fit: "No limits" },
      ],
    },
    {
      id: "keyfly",
      name: "KeyFly's AI",
      line: "AI minutes, counted only while it works",
      stops: [
        { plan: "starter", fit: "A few a month" },
        { plan: "creator", fit: "Every week" },
        { plan: "pro", fit: "Agency work" },
      ],
    },
    {
      id: "team",
      name: "A team",
      line: "Shared brand kits, one bill",
      stops: [
        { plan: "team", fit: "Shared kits" },
        { plan: "enterprise", fit: "SSO and compliance" },
      ],
    },
  ],
  start: "creator",
  result: {
    label: "Your plan",
    popular: "Most popular",
    free: "Free",
    forever: "forever",
    custom: "Custom",
    contact: "Talk to us about seats and AI minutes",
    perMonth: "a month",
    perSeat: "a seat a month",
    billedYearly: "billed yearly",
    monthly: "or {amount} month to month",
    off: "{n}% off",
    minutes: "{n} AI minutes a month",
    perSeatMinutes: "{n} AI minutes a seat",
    noMinutes: "Works with your own AI",
    customMinutes: "Custom AI minutes",
    noCard: "No card needed",
    trialMinutes: "{n} AI minutes to try",
    seatsMin: "from {n} seats",
  },
  note: "Prices a month, billed yearly, where a plan offers it",
  compare: { label: "Compare every plan", href: "#compare" },
};

// "Bring your own AI": Free and BYO, the two plans where your own agent
// does the work, as an editor's limiter: Free's limits, then BYO taking
// them off. Every value comes from the pricing API (its fields, or its own
// plan lines); these are only the words around them.
export const pricingByo = {
  eyebrow: "Bring your own AI",
  title: [{ text: "Already pay for an AI?" }, { text: "Take the limits off.", accent: true }],
  lead: "Claude Code, Codex, Cursor, Antigravity and other ACP agents edit your video on your own plan, through the KeyFly desktop app, without using AI minutes. Free lets you try it; BYO takes the limits off.",
  plans: ["free", "byo"],
  console: {
    label: "Your own AI",
    agents: ["Claude Code", "Codex", "Cursor", "Antigravity", "Any ACP agent"],
    minutes: "AI minutes your agent uses",
    switch: "Plan",
    monitor: "Your export",
    limit: "Free limit",
    channels: "What each plan allows",
  },
  film: { src: "/video/coffee-reel.mp4", poster: "/video/coffee-reel.webp" },
  channels: [
    { id: "agent", label: "Your agent's requests" },
    { id: "exports", label: "Exports" },
    { id: "size", label: "Export size" },
    { id: "length", label: "Video length" },
    { id: "storage", label: "Storage" },
    { id: "voice", label: "KeyFly voice and images" },
  ],
  words: {
    // A free plan's price: it has none in the API, and costs nothing.
    zero: "$0",
    forever: "forever",
    perMonth: "a month",
    monthly: "or {amount} month to month",
    unlimited: "Unlimited",
    perMonthCount: "{n} a month",
    mark: "KeyFly",
    none: "None",
    gb: "{n} GB",
    aiMinutes: "{n} AI min a month",
  },
  connect: { label: "How your agent connects", href: "/integrations#agents" },
  pause: "Pause",
  play: "Play",
  note: "Film illustrative · Plans from KeyFly's pricing API",
};

// "AI minutes explained": the unit defined (the API's own words), what
// counts and what never does, then the AI-minute packs on a ruler. The
// definition, the packs and their prices are the API's; the lists follow
// the API's definition and the app (editing by hand, your own agent and
// exporting use no AI minutes; each action shows its cost first, and a
// failed job's minutes come back, from the app's Help).
export const pricingMinutes = {
  eyebrow: "AI minutes",
  title: [{ text: "What an AI minute is." }, { text: "And what it never is.", accent: true }],
  lead: "One unit for everything KeyFly's cloud AI does, counted by the AI's actual work. Top up with a pack whenever you need more.",
  term: "AI minute",
  kind: "the unit",
  counts: {
    label: "Counts",
    items: ["KeyFly's AI building a video", "Editing with KeyFly's AI", "AI voice-overs", "Captions", "AI images"],
  },
  never: {
    label: "Never counts",
    items: ["Idle time and waiting", "Time on the clock", "Editing by hand", "Your own AI agent", "Exporting"],
  },
  promise: "Every action shows its cost before it runs. If a job fails, its AI minutes come back.",
  packs: {
    label: "Top up with a pack",
    line: "Bigger packs carry bonus minutes, so each minute costs less.",
    min: "min",
    bonus: "+{n}% bonus",
    perMinute: "{amount} a minute",
    best: "Lowest per minute",
    buy: "Buy",
  },
  note: "Unit, packs and prices from KeyFly's pricing API",
};

// "Compare every plan": every plan drawn as a path through the editor's
// tracks, every number from the pricing API's fields. These are only the
// labels and the words for what a value means ("Unlimited" where the API
// has no limit, "Custom" where a plan is by arrangement).
export const pricingCompare = {
  eyebrow: "Compare",
  title: [{ text: "Every plan," }, { text: "one path each.", accent: true }],
  lead: "Each line is a plan, running through every track at its true value. Point at a plan to follow its path; every number comes from KeyFly's pricing API.",
  lanes: [
    { name: "Your own AI", plans: ["free", "byo"] },
    { name: "KeyFly's AI", plans: null },
    { name: "Teams", plans: ["team", "enterprise"] },
  ],
  // Tracks: "scale" places a number (square-root scale, so small plans
  // don't crowd); "stops" places each plan's value on labelled stops.
  tracks: [
    { id: "price", label: "Price a month", hint: "Billed yearly", kind: "scale" },
    { id: "minutes", label: "AI minutes", hint: "A month", kind: "scale" },
    { id: "video", label: "Generated video", hint: "A month", kind: "scale" },
    { id: "exports", label: "Exports", hint: "A month", kind: "stops" },
    { id: "size", label: "Export size", kind: "stops" },
    { id: "mark", label: "KeyFly mark", hint: "On exports", kind: "stops" },
    { id: "storage", label: "Storage", kind: "scale" },
    { id: "seats", label: "Seats", kind: "stops" },
    { id: "trial", label: "Free trial", kind: "stops" },
  ],
  words: {
    zero: "$0",
    custom: "Custom",
    none: "None",
    unlimited: "Unlimited",
    perSeat: "a seat",
    perMonthCount: "{n} a month",
    minutes: "{n} AI minutes",
    seconds: "{n} s",
    gb: "{n} GB",
    trial: "{n} days, no card",
    trialCard: "{n} days",
    markOn: "Small mark",
    markOff: "No mark",
    seatsFrom: "From {n}",
    seatsOne: "{n}",
    monthly: "or {amount} month to month",
    popular: "Most popular",
    plans: "Plans",
  },
  note: "Yearly prices shown a month · Prices in {currency} · From KeyFly's pricing API",
};

// "Teams and Enterprise": Team as a seat calculator drawn as one shared
// timeline (a track per seat), Enterprise in type. Every price, allowance
// and plan line is the API's; the totals are its per-seat numbers times the
// seats chosen.
export const pricingTeams = {
  eyebrow: "Teams and Enterprise",
  title: [{ text: "Bring the whole team." }, { text: "One project, one bill.", accent: true }],
  lead: "Team gives every seat KeyFly's AI and shares your brand kits and library. Enterprise adds what larger organisations need for security and compliance.",
  seats: {
    label: "Seats",
    min: "From {n} seats",
    slider: "Number of seats",
    seat: "Seat {n}",
    more: "+{n} more seats",
    project: "One project",
  },
  totals: {
    yearly: "A month, billed yearly",
    year: "A year",
    monthly: "Month to month",
    minutes: "AI minutes a month",
    storage: "Storage",
    times: "{n} × {each}",
    perSeat: "a seat",
  },
  custom: "Custom",
  perSeatMonth: "a seat a month",
  monthlyAlt: "or {amount} month to month",
  note: "Totals are the API's per-seat prices and allowances times your seats · Prices in {currency}",
};

// "Questions": the pricing questions as a captions track. Every number in
// an answer is filled from the pricing API ({tokens}); a question whose
// facts the API doesn't give is left out. The rest is the app's (its Help,
// data notes and Settings → Agents). Not answered until the team says:
// refunds, taxes, payment methods, rollover and pack expiry.
export const pricingFaq = {
  eyebrow: "Questions",
  title: [{ text: "Pricing," }, { text: "in captions.", accent: true }],
  lead: "Pick a cue on the track and its answer plays above it, the way KeyFly's captions do.",
  track: "Questions",
  of: "{n} / {total}",
  questions: [
    { id: "unit", cue: "The unit", q: "What is an AI minute?", a: "{unit}", link: { label: "AI minutes explained", href: "#minutes" } },
    { id: "card", cue: "No card", q: "Do I need a card to start?", a: "No. Free is free forever, with no card needed. {trialPlan}'s {trialDays}-day trial needs no card either, and comes with {trialMinutes} AI minutes to try.", link: { label: "See every plan", href: "#compare" } },
    { id: "trial", cue: "Trial ends", q: "What happens when the trial ends?", a: "{afterTrial} Your projects stay yours." },
    { id: "own", cue: "Your own AI", q: "Can I use the AI I already pay for?", a: "Yes. Claude Code, Codex, Cursor, Antigravity and other ACP agents edit your video through the KeyFly desktop app, without using AI minutes. Free gives them {freeRequests}; BYO takes the limits off.", link: { label: "Bring your own AI", href: "#byo" } },
    { id: "packs", cue: "Run out", q: "What if I run out of AI minutes?", a: "Add an AI-minute pack any time: {packs}. Bigger packs carry bonus minutes, so each minute costs less.", link: { label: "See the packs", href: "#minutes" } },
    { id: "yearly", cue: "Yearly", q: "How much does paying yearly save?", a: "Up to {save}%, on the plans that offer a yearly price. Each plan's saving is on the price sheet, beside its price." },
    { id: "failed", cue: "Failed jobs", q: "Do I pay for a job that fails?", a: "No. Every action shows its cost before it runs, and if a job fails, its AI minutes come back." },
    { id: "projects", cue: "Projects", q: "Do my projects expire?", a: "No. Projects never expire, on any plan, and you can always export them, even if you cancel." },
    { id: "mark", cue: "The mark", q: "Which plans add the KeyFly mark?", a: "Only Free: its exports are {freeSize} with a small KeyFly mark. Every paid plan exports up to {maxSize} with no mark." },
    { id: "editors", cue: "Editors", q: "Which plans send the timeline to my editor?", a: "{editorPlan} and up: the timeline goes to Premiere, Final Cut and DaVinci, with every file it uses.", link: { label: "How the hand-off works", href: "/integrations#editors" } },
    { id: "teams", cue: "Teams", q: "How is a team billed?", a: "Per seat, from {seatMin} seats: {seatPrice} a seat a month billed yearly, on one bill for the whole team.", link: { label: "Work out your team", href: "#teams" } },
    { id: "enterprise", cue: "Enterprise", q: "How do I get Enterprise?", a: "Talk to us at {contact}. Enterprise adds SSO and SCIM, a DPA and data residency, invoicing and an uptime SLA.", link: { label: "Teams and Enterprise", href: "#teams" } },
  ],
  help: { label: "Something else?", email: "help@keyfly.si", line: "We answer within one working day." },
};
