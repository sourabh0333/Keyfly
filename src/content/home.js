import { siteConfig } from "@/config/site";

// Homepage copy. Lines marked PLACEHOLDER wait for the confirmed product
// description; the page stays noindex until then.

export const hero = {
  eyebrow: "The AI video editor", // PLACEHOLDER
  // Each line is a list of words; `accent` words are set in the serif italic.
  title: [
    [{ text: "Describe" }, { text: "the" }, { text: "video." }],
    [{ text: "Keyfly", accent: true }, { text: "makes", accent: true }, { text: "it.", accent: true }],
  ], // PLACEHOLDER
  lead: "Type what you have in mind, or drop in your footage, and Keyfly turns it into an edited video.", // PLACEHOLDER
};

// The prompt box, as it appears in the Keyfly app.
export const prompt = {
  label: "Describe your video",
  placeholder: "Describe your video, or drop footage...",
  // Where the prompt box sends people. The app does not take the prompt
  // from the URL yet, so it simply opens the app.
  action: siteConfig.appUrl,
  accept: "video/*,audio/*,image/*",
  // PLACEHOLDER: the formats behind "Auto" until the app's list is confirmed.
  modes: [
    { id: "auto", label: "Auto", note: "Keyfly picks the format" },
    { id: "16:9", label: "16:9", note: "Landscape" },
    { id: "9:16", label: "9:16", note: "Vertical" },
    { id: "1:1", label: "1:1", note: "Square" },
  ],
  // Starting points. Clicking one writes its example prompt into the box.
  presets: [
    { label: "Launch Video", prompt: "A 30-second launch video for our new app: bold title cards, quick cuts on the beat and a clear call to action at the end." },
    { label: "UGC", prompt: "A selfie-style UGC ad, vertical, with punchy captions, a hook in the first two seconds and natural jump cuts." },
    { label: "Explainer", prompt: "A 60-second explainer that walks through how our product works, with simple animated callouts and a calm voiceover." },
    { label: "Montage", prompt: "A travel montage from my footage, cut to the music, with the best moments and smooth speed ramps." },
    { label: "Product Demo", prompt: "A product demo from my screen recording: zoom into each click, add short captions and trim the pauses." },
    { label: "Podcast", prompt: "Turn my podcast episode into three vertical clips with the strongest quotes, speaker framing and captions." },
  ],
  // "or make it in …". Set `href` once the links are confirmed.
  elsewhere: [
    { label: "ChatGPT", href: null },
    { label: "Claude", href: null },
  ],
};

// "How it works": three steps, played out in an illustrative editor window
// as the section scrolls. PLACEHOLDER throughout until the product
// description is confirmed.
export const howItWorks = {
  eyebrow: "How it works",
  title: [{ text: "One sentence in." }, { text: "A finished cut out.", accent: true }],
  steps: [
    { title: "Describe it", body: "Type the video you have in mind, or drop in your footage. A sentence is enough to start." },
    { title: "Keyfly edits", body: "Keyfly builds the timeline: picks the shots, cuts them to the music and sets the titles and captions." },
    { title: "Export anywhere", body: "Choose landscape, vertical or square, check the cut, and export when it looks right." },
  ],
  // What the illustrative editor shows.
  demo: {
    file: "Launch Video",
    prompt: presetPrompt("Launch Video"),
    // Keyfly's notes in the side panel, ticked off as the playhead passes.
    plan: ["Found 6 shots", "Cut on the beat", "Added title cards", "Wrote captions"],
    // The title and caption on the viewer, one per shot.
    shots: [
      { title: "Launch day", caption: "Meet the new app" },
      { title: "Built for speed", caption: "Everything in one place" },
      { title: "Try it today", caption: "Available now" },
    ],
    formats: ["16:9", "9:16", "1:1"],
    note: "Illustrative interface",
  },
};

// "The old way": the chores of editing by hand beside one sentence to
// Keyfly. Qualitative only: no competitor names, no time savings or other
// numbers. The chores Keyfly handles are PLACEHOLDER (illustrative) until
// the team confirms them.
export const oldWay = {
  eyebrow: "The old way",
  title: [{ text: "Hours of editing." }, { text: "Or one sentence.", accent: true }],
  lead: "By hand, a cut is a long list of chores worked through one at a time. With Keyfly you say what you want, and the whole cut lands at once.",
  note: "Illustrative",
  hand: { label: "By hand", busy: "Still editing", clip: "RAW · A001_C014" },
  keyfly: { label: "With Keyfly", done: "First cut ready", clip: "First cut", title: "Launch day", sub: "Chapter 2", captions: ["Built", "for", "launch", "day"] },
  // The comparison, row by row: the question, by hand, with Keyfly.
  rows: [
    { q: "How you start", hand: "Open the editor and import", keyfly: "Type one sentence" },
    { q: "The chores", hand: "Scrub, cut and trim, all by you", keyfly: "Done for you" },
    { q: "Captions", hand: "Typed and timed by hand", keyfly: "Added for you" },
    { q: "Music", hand: "Laid in and balanced by hand", keyfly: "Set under the voice" },
    { q: "Other formats", hand: "Re-edit and export each one", keyfly: "Made at once" },
    { q: "Changes", hand: "Back into the timeline", keyfly: "Ask in plain words" },
  ],
  editLabel: "The edit",
  cta: "Try it in Keyfly",
};

// "Use cases": the presets in the prompt box as six live feeds on a
// multicam switcher. The one on air plays on the program monitor, and
// "Try this prompt" hands its preset back to the hero's prompt box.
// PLACEHOLDER until the product description is confirmed.
// "Edit with words": the first cut is a starting point; you change it by
// saying what you want. Every line here is PLACEHOLDER (illustrative)
// until the team confirms which follow-up edits Keyfly makes.
export const editWithWords = {
  eyebrow: "Edit with words",
  title: [{ text: "Change anything" }, { text: "by saying it.", accent: true }],
  lead: "Your first cut is a starting point. Tell Keyfly what to change, the way you'd brief an editor, and the timeline follows.",
  barLabel: "Ask Keyfly to change the cut",
  note: "Illustrative interface",
  edits: [
    { id: "shorter", ask: "Make it shorter", reply: "Trimmed to 0:30 · kept the strongest takes" },
    { id: "pauses", ask: "Cut the pauses", reply: "Removed 4 pauses · 6 seconds tighter" },
    { id: "captions", ask: "Add captions", reply: "Captions on · word by word" },
    { id: "warm", ask: "Warmer colours", reply: "Graded warm · across every shot" },
    { id: "vertical", ask: "Make it vertical", reply: "Reframed to 9:16 · subject kept in frame" },
    { id: "pace", ask: "Faster pace", reply: "Recut on the beat · 8 cuts became 15" },
  ],
};

// "You make the calls": Keyfly shows every decision it made, why, and
// lets you change it. The decisions and reasons are PLACEHOLDER
// (illustrative) until the team confirms what Keyfly exposes.
export const yourCall = {
  eyebrow: "You make the calls",
  title: [{ text: "Keyfly decides." }, { text: "You have the final say.", accent: true }],
  lead: "No black box. Every call Keyfly makes is listed in the inspector with its reason, marked on the timeline, and one click from changing.",
  file: "Launch Video",
  inspector: "Inspector",
  inspectorSub: "Keyfly's decisions",
  why: "Why",
  pickLabel: "Keyfly's pick",
  changedLabel: "Changed",
  reset: "Back to Keyfly's cut",
  note: "Illustrative interface",
  decisions: [
    { id: "take", label: "Opening shot", reason: "Take 3 has the clearest delivery and the steadiest frame.", options: ["Take 1", "Take 2", "Take 3"], pick: 2 },
    { id: "cuts", label: "Cut points", reason: "Cutting on the beat matches the music's 120 BPM.", options: ["On beat", "2 beats", "Free"], pick: 0 },
    { id: "title", label: "Chapter title", reason: "Two seconds is long enough to read it once.", options: ["1 sec", "2 sec", "3 sec"], pick: 1 },
    { id: "duck", label: "Music under voice", reason: "Twelve decibels down keeps every word clear.", options: ["Off", "−6 dB", "−12 dB"], pick: 2 },
  ],
};

// "One edit, every format": one cut, reframed for each shape. The format
// list is PLACEHOLDER until the team confirms Keyfly's export options.
export const everyFormat = {
  eyebrow: "One edit, every format",
  title: [{ text: "One edit." }, { text: "Every screen.", accent: true }],
  lead: "Make the cut once. Keyfly reframes it for every shape it needs, keeps your subject in frame and moves the captions with it.",
  note: "Illustrative interface",
  // PLACEHOLDER until the team confirms Keyfly's export options.
  formatLabel: "Format",
  madeFor: "Made for",
  keeps: { label: "Keyfly keeps", items: ["Your subject in frame", "Captions on screen", "The same cut and timing"] },
  bar: "Formats",
  captions: ["Your", "story,", "cut", "in", "seconds"],
  formats: [
    { id: "wide", ratio: "16:9", w: 16, h: 9, px: [1920, 1080], name: "Widescreen", for: ["YouTube", "Websites", "Presentations"] },
    { id: "vertical", ratio: "9:16", w: 9, h: 16, px: [1080, 1920], name: "Vertical", for: ["Reels", "Shorts", "TikTok"] },
    { id: "square", ratio: "1:1", w: 1, h: 1, px: [1080, 1080], name: "Square", for: ["Feed posts", "LinkedIn", "Carousels"] },
    { id: "portrait", ratio: "4:5", w: 4, h: 5, px: [1080, 1350], name: "Portrait", for: ["Feed ads", "Instagram posts"] },
  ],
};

// "On brand, every time": the brand kit, applied to every cut. The team
// confirmed on 2026-11-02 that Keyfly has a brand kit; the details below
// are PLACEHOLDER until the team confirms what it holds.
export const onBrand = {
  eyebrow: "On brand, every time",
  title: [{ text: "Your brand." }, { text: "On every cut.", accent: true }],
  lead: "Save your logo, colours and fonts once. Keyfly applies your brand kit to every video it makes, whatever its shape, so each one looks like yours from the first draft.",
  note: "Illustrative interface",
  kitLabel: "Brand kit",
  applied: "applied",
  videosLabel: "videos",
  // The kit, in the order Keyfly applies it.
  items: [
    { id: "logo", name: "Your logo", detail: "Corner, 80% opacity" },
    { id: "colours", name: "Your colours", detail: "Grade and accents" },
    { id: "font", name: "Your font", detail: "Titles and captions" },
    { id: "title", name: "Title style", detail: "Bar, weight, label" },
  ],
  // Illustrative videos, each in its own shape.
  videos: [
    { kind: "launch", ratio: "16:9", w: 16, h: 9, title: "Launch day", label: "Launch Video" },
    { kind: "ugc", ratio: "9:16", w: 9, h: 16, title: "Real results", label: "UGC" },
    { kind: "podcast", ratio: "1:1", w: 1, h: 1, title: "Episode 12", label: "Podcast" },
    { kind: "explainer", ratio: "16:9", w: 16, h: 9, title: "How it works", label: "Explainer" },
    { kind: "demo", ratio: "4:5", w: 4, h: 5, title: "New: Publish", label: "Product Demo" },
    { kind: "montage", ratio: "16:9", w: 16, h: 9, title: "Highlights", label: "Montage" },
  ],
};

// "Works where you work": one project across chat, browser and desktop.
// The team confirmed on 2026-11-02 that Keyfly runs as an app inside
// ChatGPT and Claude, and the project then opens in Keyfly. That the same
// project syncs between the browser and the desktop app is PLACEHOLDER
// until confirmed, as are the example edits.
export const anywhere = {
  eyebrow: "Works where you work",
  title: [{ text: "Start anywhere." }, { text: "Finish anywhere.", accent: true }],
  lead: "Ask for a video in ChatGPT or Claude, pick it up in your browser, finish it in the desktop app. One project, wherever you open it.",
  note: "Illustrative interface",
  openIn: "Open it in",
  history: "Project history",
  project: { name: "Launch Video", meta: "0:30 · 16:9", synced: "Synced", label: "One project" },
  surfaces: [
    { id: "chat", name: "Chat", where: "ChatGPT · Claude", ask: "Make a 30-second launch video from my footage", reply: "Here's your first cut.", card: "Open in Keyfly", log: "Draft made in chat" },
    { id: "browser", name: "Browser", where: "app.keyfly.si", action: "Captions added", log: "Captions added in the browser" },
    { id: "desktop", name: "Desktop app", where: "macOS · Windows", action: "Exported · 1920 × 1080", log: "Exported from the desktop" },
  ],
};

export const useCases = {
  eyebrow: "Use cases",
  title: [{ text: "Made for" }, { text: "every kind of video.", accent: true }],
  lead: "Start from a preset or describe your own. Six of the videos people make most:",
  cta: "Try this prompt",
  dialLabel: "Preset",
  hint: { live: "Scroll or drag to turn", still: "Drag or click to turn" },
  promptLabel: "Prompt",
  note: "Illustrative previews",
  // PLACEHOLDER: one line per preset until the product copy is confirmed.
  items: [
    { label: "Launch Video", kind: "launch", format: "16:9", body: "Title cards, quick cuts on the beat and a clear call to action at the end." },
    { label: "UGC", kind: "ugc", format: "9:16", body: "Selfie-style ads with a hook in the first two seconds and punchy captions." },
    { label: "Explainer", kind: "explainer", format: "16:9", body: "Walk people through how something works, with simple callouts and a calm voiceover." },
    { label: "Montage", kind: "montage", format: "16:9", body: "The best moments from your footage, cut to the music with smooth speed ramps." },
    { label: "Product Demo", kind: "demo", format: "16:9", body: "Screen recordings with a zoom on every click, short captions and the pauses trimmed." },
    { label: "Podcast", kind: "podcast", format: "9:16", body: "Long episodes turned into vertical clips with the strongest quotes and captions." },
  ].map((item) => ({ ...item, prompt: presetPrompt(item.label) })),
};

function presetPrompt(label) {
  return prompt.presets.find((preset) => preset.label === label).prompt;
}

// "Download": the install moment from the brand kit's DMG art, animated.
// Set each platform's `href` once its build is published; until then its
// button reads "Coming soon". The browser link is real.
export const download = {
  eyebrow: "Download",
  title: [{ text: "Land Keyfly" }, { text: "on your desktop.", accent: true }],
  lead: "Keyfly runs on macOS and Windows. Or open it in your browser, with nothing to install.",
  // The landing's readout: the install's three stages (they run with the
  // flight), its status in the air and on landing, and the scroll hint.
  stages: ["Download", "Install", "Open"],
  status: { flying: "Installing Keyfly", ready: "Landed" },
  hint: "Scroll to land it",
  platformLabel: "Platform",
  detected: "Your system",
  soon: "Coming soon",
  browser: { label: "Open in your browser", href: siteConfig.appUrl },
  phone: "On a phone? Keyfly runs in the browser.",
  note: "Keyfly.si is a Cevrynt Inc. product",
  platforms: [
    { id: "macos", label: "macOS", target: "Applications", step: "Drag Keyfly to Applications to install.", href: null },
    { id: "windows", label: "Windows", target: "Desktop", step: "Run the installer and Keyfly is ready.", href: null }, // PLACEHOLDER step
  ],
};

// FAQ: answers from confirmed facts where we have them. Entries marked
// PLACEHOLDER wait for the team (changing the cut, formats, ownership and
// privacy, pricing). Never fill these with guesses.
export const faq = {
  eyebrow: "Questions",
  title: [{ text: "Ask Keyfly." }, { text: "Anything.", accent: true }],
  lead: "The short answers to what people ask most. Pick a question and Keyfly answers it.",
  panel: "Ask Keyfly",
  listLabel: "Questions",
  next: "Next question",
  items: [
    {
      q: "What is Keyfly?",
      a: "Keyfly is an AI video editor. Describe the video you want, or drop in your footage, and Keyfly edits it into a first cut you can refine.",
      link: { label: "How it works", href: "#product" },
    },
    {
      q: "Does it run on Mac, Windows and the web?",
      a: "Yes. Keyfly is a desktop app for macOS and Windows, and it also runs in your browser at app.keyfly.si.",
      link: { label: "Download", href: "#download" },
    },
    {
      q: "Can I use Keyfly from ChatGPT or Claude?",
      a: "Yes. Keyfly runs as an app inside ChatGPT and Claude. Ask for a video in the chat, then open the project in Keyfly when you want to keep working on it.",
      link: { label: "Works where you work", href: "#anywhere" },
    },
    {
      // PLACEHOLDER until the team confirms what can be changed after the first cut.
      q: "Can I change the video after Keyfly edits it?",
      a: "Yes. Ask for changes in plain words, like “make it shorter” or “add captions”, or change any of Keyfly's decisions yourself on the timeline.",
      link: { label: "Edit with words", href: "#edit" },
    },
    {
      q: "Can Keyfly keep my videos on brand?",
      a: "Yes. Save your logo, colours and fonts in a brand kit, and Keyfly applies them to every video it makes.",
      link: { label: "On brand, every time", href: "#brand" },
    },
    {
      // PLACEHOLDER until the team confirms Keyfly's export options.
      q: "Which formats can I export?",
      a: "Widescreen 16:9, vertical 9:16, square 1:1 and portrait 4:5. Keyfly reframes the same edit for each shape and keeps your subject in frame.",
      link: { label: "One edit, every format", href: "#formats" },
    },
    {
      // PLACEHOLDER until the team confirms ownership and privacy terms.
      q: "Who owns my videos, and what happens to my footage?",
      a: "We'll publish the full details on ownership and privacy here soon.",
    },
    {
      // PLACEHOLDER until the team confirms pricing.
      q: "How much does Keyfly cost?",
      a: "Pricing hasn't been announced yet. We'll share the plans here soon.",
    },
  ],
};
