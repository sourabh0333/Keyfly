import { siteConfig } from "@/config/site";
import { primaryCta } from "./navigation";

// The Use cases page (/use-cases), built section by section from the plan
// in PLAN.md. It is organised the way the KeyFly app is: its 91 templates
// in ten categories. Every template name, shape, length and look comes from
// the app's Templates page (read 2026-11-05; the full list is in
// research_notes/use-cases/app-templates.md). The pictures are the site's
// own, illustrative. PREMIUM and NEW tags change, so none is typed here.

export const useCasesMeta = {
  title: "Use cases",
  description:
    "Launch films, social ads, UGC, demos, podcasts and more: KeyFly's 91 templates in ten categories, each filled by the AI director with your product and your brand kit.",
};

// The app's looks, as their cards name them, and the key each uses here.
export const looks = {
  editorial: "Editorial Minimal",
  bold: "Bold Social",
  warm: "Warm Lifestyle",
  midnight: "Midnight Tech",
  explainer: "Product Explainer",
  luxury: "Luxury Mono",
  neon: "Neon Gradient",
  corporate: "Corporate Blue",
  founder: "Founder Launch",
};

// A template as the app's card shows it: [name, shape, seconds, look].
// `clip` is its preview, recorded from the app's Templates page (its own
// renderer's hover preview, 2026-11-05) into public/video/templates/: a
// muted loop of about 5 s at the app's size (384 × 216 for 16:9), with a
// still of the same name (.webp), for all 91. A template without one would
// fall back to a picture drawn in its look.
const slug = (name) =>
  name
    .toLowerCase()
    .replace(/→/g, "to")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const t = (name, shape, seconds, look, type) => ({ name, shape, seconds, look, type, clip: `/video/templates/${slug(name)}` });

export const useCasesHero = {
  eyebrow: "Use cases",
  title: [{ text: "91 ways to start." }, { text: "One sentence to finish.", accent: true }],
  lead: "Launch films, social ads, UGC, demos, podcasts and more: start from one of KeyFly's templates, and the AI director fills it with your product and your brand kit.",
  primary: primaryCta,
  secondary: { label: "Browse by category", href: "#categories" },
  // The wall of templates: three rows drifting in turn, each card at its
  // real shape. Chosen to show every category, shape and look.
  wall: {
    label: "A few of KeyFly's templates",
    pause: "Pause",
    play: "Play",
    rows: [
      [
        t("SaaS launch film", "16:9", 25, "editorial"),
        t("Scroll-stopping hook", "9:16", 15, "bold"),
        t("Podcast clip", "9:16", 45, "midnight"),
        t("Product walkthrough", "16:9", 60, "explainer"),
        t("Stats reel", "1:1", 20, "bold"),
        t("App Store launch", "9:16", 20, "neon"),
        t("Logo reveal", "16:9", 6, "luxury"),
        t("Recipe in 30 seconds", "9:16", 30, "warm"),
        t("App feature spotlight", "4:5", 15, "explainer"),
      ],
      [
        t("UGC product review", "9:16", 30, "warm"),
        t("KPI recap", "16:9", 30, "corporate"),
        t("Hot take", "9:16", 30, "bold"),
        t("Founder launch film", "16:9", 45, "founder"),
        t("How it works in 3 steps", "1:1", 30, "explainer"),
        t("Feature drop", "9:16", 15, "midnight"),
        t("Customer testimonial", "16:9", 40, "editorial"),
        t("POV hook", "9:16", 12, "bold"),
        t("Score card", "1:1", 20, "explainer"),
      ],
      [
        t("Screen recording demo", "16:9", 45, "explainer"),
        t("Before / after split", "9:16", 15, "bold"),
        t("Year in review", "16:9", 40, "midnight"),
        t("Revenue milestone", "9:16", 12, "bold"),
        t("Brand story", "16:9", 60, "warm"),
        t("Follower milestone", "9:16", 10, "neon"),
        t("Investor update", "16:9", 45, "luxury"),
        t("UGC ad: problem → product", "9:16", 25, "bold"),
        t("Integration explainer", "16:9", 45, "corporate"),
      ],
    ],
  },
  facts: [
    { value: "91", label: "templates", detail: "Free and Premium" },
    { value: "10", label: "categories", detail: "From launches to local" },
    { value: "4", label: "shapes", detail: "16:9 · 9:16 · 1:1 · 4:5" },
    { value: "4–90", label: "seconds", detail: "From a sting to a tutorial" },
    // The app's "Any use case" filter lists 20 types.
    { value: "20", label: "use-case types", detail: "UGC ads to real estate" },
  ],
  note: "Template names, shapes, lengths and previews from the KeyFly app",
};

// The ten categories, in the app's order, with every template in the app's
// order: name, shape, seconds, look and type, as each card shows them.
export const categories = [
  {
    id: "product-launches",
    name: "Product launches",
    line: "Launch films, teasers and reveals for a new product, app or version.",
    templates: [
      t("SaaS launch film", "16:9", 25, "editorial", "Launch film"),
      t("Feature drop", "9:16", 15, "midnight", "Launch film"),
      t("Founder launch film", "16:9", 45, "founder", "Launch film"),
      t("App Store launch", "9:16", 20, "neon", "App launch"),
      t("Product Hunt teaser", "16:9", 20, "neon", "Launch film"),
      t("Waitlist teaser", "9:16", 12, "midnight", "Launch film"),
      t("Founder manifesto", "16:9", 40, "luxury", "Launch film"),
      t("App feature spotlight", "4:5", 15, "explainer", "App launch"),
      t("Version 2.0 reveal", "16:9", 30, "luxury", "Launch film"),
      t("Hardware product reveal", "16:9", 35, "luxury", "Launch film"),
    ],
  },
  {
    id: "explainers-and-demos",
    name: "Explainers and demos",
    line: "Walkthroughs and how-it-works videos that show your product in use.",
    templates: [
      t("Product walkthrough", "16:9", 60, "explainer", "Product demo"),
      t("How it works in 3 steps", "1:1", 30, "explainer", "Explainer"),
      t("Problem → solution", "16:9", 40, "editorial", "Explainer"),
      t("Us vs. them", "16:9", 30, "corporate", "Product demo"),
      t("Onboarding welcome", "16:9", 30, "warm", "Explainer"),
      t("Integration explainer", "16:9", 45, "corporate", "Explainer"),
      t("Top questions answered", "9:16", 45, "warm", "Explainer"),
      t("Checkout flow demo", "16:9", 30, "explainer", "Product demo"),
      t("Docs to data", "16:9", 35, "explainer", "Explainer"),
    ],
  },
  {
    id: "social-ads",
    name: "Social ads",
    line: "Hooks, listicles, offers and before-and-afters, cut for the feed.",
    templates: [
      t("Scroll-stopping hook", "9:16", 15, "bold", "Hook-first short"),
      t("POV hook", "9:16", 12, "bold", "Hook-first short"),
      t("Before / after split", "9:16", 15, "bold", "Before/after"),
      t("Stats reel", "1:1", 20, "bold", "Social ad"),
      t("5 reasons listicle", "9:16", 25, "bold", "Listicle"),
      t("Question hook", "9:16", 15, "neon", "Hook-first short"),
      t("Limited offer", "4:5", 12, "neon", "Social ad"),
      t("Shop now product ad", "4:5", 15, "warm", "Social ad"),
      t("3 mistakes to avoid", "4:5", 20, "editorial", "Listicle"),
      t("Before / after wipe", "1:1", 10, "luxury", "Before/after"),
      t("Kinetic quote", "9:16", 10, "editorial", "Social ad"),
      t("5-star social proof", "1:1", 15, "corporate", "Social ad"),
    ],
  },
  {
    id: "ugc-and-creators",
    name: "UGC and creators",
    line: "Reviews, testimonials, unboxings and day-in-the-life videos.",
    templates: [
      t("UGC product review", "9:16", 30, "warm", "UGC ad"),
      t("UGC ad: problem → product", "9:16", 25, "bold", "UGC ad"),
      t("Customer testimonial", "16:9", 40, "editorial", "Testimonial"),
      t("3 tips carousel", "9:16", 20, "warm", "Listicle"),
      t("Unboxing highlights", "9:16", 25, "bold", "UGC ad"),
      t("UGC ad: 3 hook variants", "9:16", 20, "neon", "UGC ad"),
      t("Testimonial reel", "9:16", 45, "warm", "Testimonial"),
      t("Day in the life", "9:16", 30, "warm", "UGC ad"),
      t("Testimonial quote card", "1:1", 12, "luxury", "Testimonial"),
      t("Get ready with me", "9:16", 35, "warm", "UGC ad"),
    ],
  },
  {
    id: "talking-heads-and-podcasts",
    name: "Talking heads and podcasts",
    line: "Clips, hot takes and highlights from people talking to camera.",
    templates: [
      t("Podcast clip", "9:16", 45, "midnight", "Podcast clip"),
      t("Hot take", "9:16", 30, "bold", "Talking head"),
      t("Founder update", "16:9", 60, "editorial", "Talking head"),
      t("Podcast audiogram", "1:1", 30, "editorial", "Podcast clip"),
      t("LinkedIn talking head", "1:1", 45, "corporate", "Talking head"),
      t("Podcast guest intro", "16:9", 20, "midnight", "Podcast clip"),
      t("Expert tip", "9:16", 40, "corporate", "Talking head"),
      t("Webinar highlight", "16:9", 60, "corporate", "Talking head"),
      t("Interview highlights", "16:9", 60, "luxury", "Talking head"),
      t("Long talk with chapters", "16:9", 90, "explainer", "Talking head"),
    ],
  },
  {
    id: "screen-recordings",
    name: "Screen recordings",
    line: "Demos, tutorials and release recaps made from your screen.",
    templates: [
      t("Screen recording demo", "16:9", 45, "explainer", "Screen recording"),
      t("Step-by-step tutorial", "16:9", 90, "corporate", "Tutorial"),
      t("60-second how-to", "9:16", 60, "explainer", "Tutorial"),
      t("Feature tour", "16:9", 60, "midnight", "Product demo"),
      t("Release notes recap", "16:9", 30, "midnight", "Screen recording"),
      t("Developer demo", "16:9", 45, "midnight", "Product demo"),
      t("Support answer", "16:9", 40, "warm", "Tutorial"),
    ],
  },
  {
    id: "brand-and-logo",
    name: "Brand and logo",
    line: "Logo reveals, intro stings, end cards and your brand story.",
    templates: [
      t("Logo reveal", "16:9", 6, "luxury", "Brand"),
      t("Intro sting", "16:9", 4, "neon", "Brand"),
      t("End card", "9:16", 5, "editorial", "Brand"),
      t("Subscribe reminder", "16:9", 5, "bold", "Brand"),
      t("YouTube end screen", "16:9", 15, "bold", "Brand"),
      t("Brand story", "16:9", 60, "warm", "Brand"),
      t("Logo bug and frame", "16:9", 10, "corporate", "Brand"),
    ],
  },
  {
    id: "data-and-reports",
    name: "Data and reports",
    line: "KPIs, milestones and reviews that turn numbers into a story.",
    templates: [
      t("KPI recap", "16:9", 30, "corporate", "Data story"),
      t("Revenue milestone", "9:16", 12, "bold", "Data story"),
      t("Follower milestone", "9:16", 10, "neon", "Data story"),
      t("Year in review", "16:9", 40, "midnight", "Data story"),
      t("Investor update", "16:9", 45, "luxury", "Data story"),
      t("Score card", "1:1", 20, "explainer", "Data story"),
      t("Survey results", "16:9", 30, "corporate", "Data story"),
    ],
  },
  {
    id: "events-and-promos",
    name: "Events and promos",
    line: "Sales, countdowns, invites and recaps for an event or an offer.",
    templates: [
      t("Flash sale", "9:16", 10, "bold", "Event promo"),
      t("Webinar promo", "16:9", 20, "corporate", "Event promo"),
      t("Event countdown", "9:16", 15, "neon", "Event promo"),
      t("Conference recap", "16:9", 45, "bold", "Event promo"),
      t("Workshop sign-up", "1:1", 20, "warm", "Event promo"),
      t("Going live", "9:16", 8, "midnight", "Event promo"),
      t("Launch party invite", "4:5", 15, "luxury", "Event promo"),
    ],
  },
  {
    id: "lifestyle-and-local",
    name: "Lifestyle and local",
    line: "Food, fitness and property videos for local businesses.",
    templates: [
      t("Recipe in 30 seconds", "9:16", 30, "warm", "Food"),
      t("Workout routine", "9:16", 30, "bold", "Fitness"),
      t("Transformation story", "9:16", 25, "warm", "Fitness"),
      t("Just listed reel", "9:16", 20, "warm", "Real estate"),
      t("Property listing tour", "16:9", 45, "luxury", "Real estate"),
      t("Restaurant ad", "9:16", 20, "warm", "Food"),
      t("Taste test", "9:16", 25, "bold", "Food"),
      t("Form tip", "9:16", 20, "explainer", "Fitness"),
      t("Menu special", "4:5", 12, "luxury", "Food"),
      t("Sold announcement", "1:1", 10, "bold", "Real estate"),
      t("Neighbourhood guide", "9:16", 40, "editorial", "Real estate"),
      t("Class schedule promo", "4:5", 15, "neon", "Fitness"),
    ],
  },
];

// "Browse by category": a filter bar (shape and length, the app's own
// filters), an index of the ten categories with live counts, and a shelf of
// every template per category. The lines under each category name what its
// templates are, from their names.
export const useCasesBrowse = {
  eyebrow: "Browse by category",
  title: [{ text: "Ten kinds of video." }, { text: "Every template inside.", accent: true }],
  lead: "Filter by shape or length, or jump to a category. Every template here is in the app today; open one in KeyFly and the AI director fills it with your product.",
  filters: {
    shape: {
      label: "Shape",
      options: [
        { id: "all", label: "Any shape" },
        { id: "16:9", label: "16:9" },
        { id: "9:16", label: "9:16" },
        { id: "1:1", label: "1:1" },
        { id: "4:5", label: "4:5" },
      ],
    },
    length: {
      label: "Length",
      options: [
        { id: "all", label: "Any length", min: 0, max: Infinity },
        { id: "short", label: "Up to 15s", min: 0, max: 15 },
        { id: "mid", label: "16–30s", min: 16, max: 30 },
        { id: "long", label: "31–60s", min: 31, max: 60 },
        { id: "xl", label: "Over 60s", min: 61, max: Infinity },
      ],
    },
  },
  count: "{n} of 91 templates",
  clear: "Clear filters",
  indexLabel: "Categories",
  empty: "No template here matches. Try another shape or length.",
  open: { label: "Open in KeyFly", href: `${siteConfig.appUrl}/templates` },
  note: "Template names, shapes, lengths, looks and previews from the KeyFly app",
};

// "From template to your video": one real template from the app (SaaS
// launch film, 16:9, 25s, Editorial Minimal; its recorded preview), taken
// through four steps on the illustrative brand the Product page uses
// (habitly.io). The steps follow the app: "Start from a proven structure;
// the AI director fills it with your product", "One click starts a video
// with your brand kit", the chat ("Type @ to point at a scene"), Revert and
// Retry, and the export sheet. The brand, the change asked for and its
// reply are illustrative.
export const useCasesFill = {
  eyebrow: "From template to your video",
  title: [{ text: "Pick a template." }, { text: "It becomes yours.", accent: true }],
  lead: "One template, start to finish: the AI director fills it with your product and your brand kit, you steer it in plain words, and it's ready to post.",
  pause: "Pause",
  play: "Play",
  template: { name: "SaaS launch film", shape: "16:9", seconds: 25, look: "Editorial Minimal", type: "Launch film", clip: "/video/templates/saas-launch-film" },
  brand: { name: "Habitly", url: "habitly.io", headline: "Build the habit. Keep the streak.", line: "One tap a day. Your streak does the rest." },
  steps: [
    { id: "pick", label: "Pick", title: "Start from a proven structure", body: "A template sets the pacing, the scenes and the look. This one is a 25-second launch film." },
    { id: "fill", label: "Fill", title: "The AI director fills it in", body: "Your product, your brand kit, a script, a voice-over and music, in the template's structure." },
    { id: "steer", label: "Steer", title: "Change it by asking", body: "Point at a scene with @ and say what you want. Revert or retry any time." },
    { id: "export", label: "Export", title: "Ready to post", body: "Download it, share it for review, or hand the timeline to your editor." },
  ],
  panel: {
    pick: { label: "Template", cta: "Use template", meta: "Free and Premium · 91 templates" },
    fill: {
      label: "AI director",
      rows: [
        { key: "Product", value: "habitly.io" },
        { key: "Brand kit", value: "Habitly · Default" },
        { key: "Script", value: "5 scenes, written for Habitly" },
        { key: "Voice-over", value: "Bronwen" },
        { key: "Music", value: "Minimal tech · 122 bpm" },
      ],
    },
    steer: { ask: "@scene 2 make the headline bigger", reply: "Done. Scene 2's headline is bigger; nothing else changed.", revert: "Revert", retry: "Retry" },
    export: { file: "habitly-launch.mp4", meta: "MP4 · 16:9 · 0:25", ready: "Ready", routes: ["Download", "Share for review", "Hand it on"], more: { label: "Every way out", href: "/product#deliver" } },
  },
  // The app's chat box, at the foot of the panel.
  chat: "What should we change? (@ to mention, / for commands)",
  scenes: 5,
  note: "Template and preview from the KeyFly app · Brand, changes and replies illustrative",
};

// Questions about templates and use cases. Every answer is the app's (its
// Templates page, Home's "Suggested for you", chat, brand kits, Help (read
// 2026-11-06: "Each action shows its cost first, and failed jobs are
// refunded automatically") and export sheet)
// or follows from the pricing API's rule that AI minutes count only while
// KeyFly's AI works. Which plans include Premium templates isn't in the
// API, so the answer only says what the app shows and points at the plans.
export const useCasesFaq = {
  eyebrow: "Questions",
  title: [{ text: "Templates," }, { text: "answered.", accent: true }],
  lead: "What a template is, what you can change, and what it costs.",
  help: { label: "Something else?", line: "We answer within one working day.", email: "help@keyfly.si" },
  items: [
    {
      q: "What's in a template?",
      a: "A proven structure: the scenes, the pacing, the shape and the look. Pick one and the AI director fills it with your product: the script, the voice-over, the motion graphics and the music.",
    },
    {
      q: "Which template should I start with?",
      a: "KeyFly suggests some. Its Home shows templates picked for your brand, and one click starts a video with your brand kit. Or browse all 91 here by category, shape and length.",
      link: { label: "Browse by category", href: "#categories" },
    },
    {
      q: "Can I change it after the AI fills it in?",
      a: "Yes, all of it. Ask in the chat (type @ to point at a scene, / for a command), change any layer yourself on the timeline, or Revert and Retry.",
      link: { label: "How the AI director works", href: "/product#direct" },
    },
    {
      q: "Will it use my brand?",
      a: "Yes. Templates start with your brand kit: your logo, colours, font, tone of voice and voice-over. New videos use your default kit automatically, and KeyFly can fill the kit in from your website.",
      link: { label: "How the brand kit fills itself", href: "/product#brand" },
    },
    {
      q: "Which shapes and lengths are there?",
      a: "Templates come in 16:9, 9:16, 1:1 and 4:5, from a 4-second sting to a 90-second tutorial. When you export, you can pick a shape and a preset for TikTok, Reels, YouTube, Shorts, LinkedIn or X.",
      link: { label: "Every way out", href: "/product#deliver" },
    },
    {
      q: "Can I start from my own footage instead?",
      a: "Yes. Add your clips and KeyFly cuts the silences and filler words, adds captions, and zooms on what matters. You can start from a sentence too, with no template at all.",
      link: { label: "Your recording, minus the chores", href: "/product#footage" },
    },
    {
      q: "Does using a template use AI minutes?",
      a: "Only while KeyFly's AI works, like filling the template or making a change you ask for. Each action shows its cost first, and failed jobs are refunded automatically. Editing by hand uses none, and so does your own agent (Claude Code, Codex, Cursor and others).",
      link: { label: "How AI minutes count", href: "/product#minutes" },
    },
    {
      q: "What does Premium mean?",
      a: "The app marks every template Free or Premium. The plans show what each one includes.",
      link: { label: "See plans", href: "/pricing" },
    },
    {
      q: "My video isn't on the list. What then?",
      a: "Describe it. Any video, in a sentence, or from your own footage: the AI director builds it from scratch, no template needed.",
      link: { label: "Start free", href: primaryCta.href },
    },
    {
      q: "Where do I find all 91?",
      a: "On this page, in their ten categories, and in the app's Templates page, where you can filter by shape, look and use case and start one in a click.",
      link: { label: "Browse templates", href: `${siteConfig.appUrl}/templates`, external: true },
    },
  ],
};

// "By role": four kinds of people who make videos, and the template
// categories that fit each. The roles are the homepage's (Who it's for);
// which categories fit which role is the site's own grouping, made only
// from the categories' names, and every template shown is in the app.
// Each role is a track: its categories' first templates laid end to end
// as clips (the picks first), and how many more there are.
const CLIPS = 9;
const roleOf = (role) => {
  const cats = role.categories.map((id) => categories.find((c) => c.id === id));
  const all = cats.flatMap((c) => c.templates.map((t) => ({ ...t, category: c.id })));
  const picks = role.picks.map((name) => all.find((t) => t.name === name));
  const rest = all.filter((t) => !role.picks.includes(t.name));
  const clips = [...picks, ...rest].slice(0, CLIPS);
  return { ...role, cats, count: all.length, clips, more: all.length - clips.length };
};

export const useCasesRoles = {
  eyebrow: "By role",
  title: [{ text: "Your job." }, { text: "Your templates.", accent: true }],
  lead: "Four kinds of people who make videos, and the templates that fit each. Every one is in the app today.",
  pause: "Pause",
  play: "Play",
  countLabel: "templates",
  see: "See them",
  roles: [
    {
      id: "marketers",
      name: "Marketers & founders",
      line: "Launch films, social ads and promos for whatever you're shipping.",
      categories: ["product-launches", "social-ads", "events-and-promos"],
      picks: ["Founder manifesto", "Scroll-stopping hook", "Flash sale"],
    },
    {
      id: "product",
      name: "Product & SaaS teams",
      line: "Walkthroughs, demos and release recaps, from your product and your screen.",
      categories: ["explainers-and-demos", "screen-recordings", "data-and-reports"],
      picks: ["Product walkthrough", "60-second how-to", "Score card"],
    },
    {
      id: "creators",
      name: "Creators",
      line: "UGC ads, hooks and day-in-the-life videos, cut for vertical.",
      categories: ["ugc-and-creators", "social-ads", "lifestyle-and-local"],
      picks: ["Customer testimonial", "UGC product review", "Stats reel"],
    },
    {
      id: "speakers",
      name: "Podcasters & speakers",
      line: "Episodes, talks and interviews cut into clips, with intros and end cards.",
      categories: ["talking-heads-and-podcasts", "brand-and-logo"],
      picks: ["Webinar highlight", "Podcast clip", "Podcast audiogram"],
    },
  ].map(roleOf),
};
