import { siteConfig } from "@/config/site";

// Homepage copy. Facts come from the KeyFly app (read 2026-11-03) and the
// team. Lines still marked PLACEHOLDER wait for the team; the page stays
// noindex until they're settled.

export const hero = {
  eyebrow: "The AI video editor",
  // Each line is a list of words; `accent` words are set in the serif italic.
  title: [
    [{ text: "Describe" }, { text: "the" }, { text: "video." }],
    [{ text: "KeyFly", accent: true }, { text: "makes", accent: true }, { text: "it.", accent: true }],
  ],
  // The app's own promise ("Describe it in a sentence. KeyFly writes the
  // storyboard, voice-over and motion graphics.").
  lead: "Describe it in a sentence, or drop in your footage. KeyFly writes the storyboard, voice-over and motion graphics, then you shape the cut.",
};

// The prompt box, as it appears in the KeyFly app's "New video" box (read
// from the app on 2026-11-03: its placeholder, Add media, the aspect ratios,
// the motion styles, the brand kit picker, Enhance, Create and Blank
// project).
export const prompt = {
  label: "Describe your video",
  placeholder: "e.g. A 30s launch film for habitly.io, our habit-tracking app.",
  // Where the prompt box sends people. The app does not take the prompt
  // from the URL yet, so it simply opens the app.
  action: siteConfig.appUrl,
  accept: "video/*,audio/*,image/*",
  addMedia: "Add media",
  formats: {
    label: "Aspect ratio",
    options: [
      { id: "16:9", label: "16:9", name: "landscape" },
      { id: "9:16", label: "9:16", name: "vertical" },
      { id: "1:1", label: "1:1", name: "square" },
      { id: "4:5", label: "4:5", name: "portrait" },
    ],
  },
  styles: {
    label: "Motion style",
    prefix: "Style:",
    options: [
      { id: "ai", label: "AI picks", note: "Matched to your video" },
      { id: "editorial", label: "Editorial Minimal", note: "Calm, premium launch films" },
      { id: "explainer", label: "Product Explainer", note: "B2B demos and walkthroughs" },
      { id: "midnight", label: "Midnight Tech", note: "Dark, for AI and developer tools" },
      { id: "bold", label: "Bold Social", note: "Reels and ads, high energy" },
      { id: "warm", label: "Warm Lifestyle", note: "Creators and consumer apps" },
      { id: "mono", label: "Luxury Mono", note: "Premium brands and fashion" },
      { id: "corporate", label: "Corporate Blue", note: "Enterprise, finance, SaaS" },
      { id: "neon", label: "Neon Gradient", note: "Gaming, crypto, Gen Z" },
      { id: "founder", label: "Founder Launch", note: "Startup launch films with the founder on camera" },
    ],
  },
  brandKit: { label: "Brand kit", none: "No brand kit", add: "Add your brand kit in KeyFly", href: siteConfig.appUrl },
  enhance: { label: "Enhance", title: "Rewrite your idea into a clearer prompt (free)" },
  create: "Create",
  blank: { label: "Blank project", title: "Start with an empty timeline and build it yourself", href: siteConfig.appUrl },
  // Starting points. Clicking one writes its example prompt into the box.
  presets: [
    { label: "Launch Video", prompt: "A 30-second launch video for our new app: bold title cards, quick cuts on the beat and a clear call to action at the end." },
    { label: "UGC", prompt: "A selfie-style UGC ad, vertical, with punchy captions, a hook in the first two seconds and natural jump cuts." },
    { label: "Explainer", prompt: "A 60-second explainer that walks through how our product works, with simple animated callouts and a calm voiceover." },
    { label: "Montage", prompt: "A travel montage from my footage, cut to the music, with the best moments and smooth speed ramps." },
    { label: "Product Demo", prompt: "A product demo from my screen recording: zoom into each click, add short captions and trim the pauses." },
    { label: "Podcast", prompt: "Turn my podcast episode into three vertical clips with the strongest quotes, speaker framing and captions." },
  ],
  // "or make it in …". These open the section that explains it until the
  // apps have their own install links (the KeyFly app shows none yet).
  elsewhere: [
    { label: "ChatGPT", href: "#anywhere" },
    { label: "Claude", href: "#anywhere" },
  ],
};

// "How it works": three steps, played out in an illustrative editor window
// as the section scrolls. The steps follow the app's own help ("Describe it
// on Home and press Create. The AI director writes the storyboard,
// voice-over and motion graphics, then opens the editor") and its export
// sheet; the editor window is illustrative.
export const howItWorks = {
  eyebrow: "How it works",
  title: [{ text: "One sentence in." }, { text: "A finished cut out.", accent: true }],
  steps: [
    { title: "Describe it", body: "Type the video you have in mind, or drop in your footage, and press Create. A sentence is enough to start." },
    { title: "KeyFly edits", body: "KeyFly's AI director writes the storyboard, voice-over and motion graphics, and lays them out on the timeline." },
    { title: "Export anywhere", body: "Pick 16:9, 9:16, 1:1 or 4:5 and export in up to 4K, or hand the timeline to Final Cut, Resolve or Premiere." },
  ],
  // What the illustrative editor shows.
  demo: {
    file: "Launch Video",
    prompt: presetPrompt("Launch Video"),
    // KeyFly's notes in the side panel, ticked off as the playhead passes.
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

// "What KeyFly makes": an illustrative film (made for this page, not by the
// app, which is still being built; the team asked for it on 2026-11-03),
// shown with its own timeline. Its voice-over is a Windows voice and its
// music a synthesised bed, both placeholders. The scenes, lines and clip
// times below match the film (public/video/keyfly-film.mp4), whose source is
// scripts/keyfly-film/. Replace it with a real KeyFly film when the app's
// output is ready, and update these to match.
export const creates = {
  eyebrow: "What KeyFly makes",
  title: [{ text: "KeyFly makes the pieces." }, { text: "You keep the timeline.", accent: true }],
  lead: "Describe a video and KeyFly writes the storyboard, records the voice-over and builds the motion graphics, each on its own track you can change.",
  note: "Illustrative film",
  tag: "Illustrative",
  video: { src: "/video/keyfly-film.mp4", poster: "/video/keyfly-film.webp", duration: 29.98 },
  prompt: {
    label: "The prompt",
    text: "A 30-second launch film for our new app.",
  },
  now: "Now",
  says: "Voice-over",
  tracksLabel: "On the timeline",
  sound: { on: "Sound on", off: "Sound off" },
  // The film's scenes, their lengths (seconds) and the line spoken in each.
  scenes: [
    { name: "Describe", length: 3.4, line: "Describe the video you want." },
    { name: "Prompt", length: 3.8, line: "One sentence is enough to start." },
    { name: "Storyboard", length: 4.4, line: "KeyFly writes the storyboard, scene by scene." },
    { name: "Voice-over", length: 2.9, line: "It records the voice-over," },
    { name: "Motion graphics", length: 3.3, line: "and builds the motion graphics." },
    { name: "Timeline", length: 3.6, line: "Everything lands on a real timeline." },
    { name: "Edit anything", length: 4.2, line: "Then change anything, just by asking." },
    { name: "End card", length: 4.4, line: "Describe it. KeyFly makes it." },
  ],
  // The film's tracks. Clips are [start, end] in seconds; "scenes" means one
  // clip per scene, "cuts" a mark at each scene change.
  layers: [
    { id: "storyboard", name: "Storyboard", detail: "8 scenes", clips: "scenes" },
    { id: "voice", name: "Voice-over", detail: "8 lines", clips: [[0.3, 3.0], [3.7, 6.75], [7.5, 11.45], [11.9, 14.4], [14.8, 17.65], [18.1, 21.3], [21.7, 25.4], [25.9, 29.85]] },
    { id: "graphics", name: "Motion graphics", detail: "Every scene", clips: "scenes" },
    { id: "transitions", name: "Transitions", detail: "7 cuts", clips: "cuts" },
    { id: "music", name: "Music", detail: "Soft bed", clips: [[0, 29.98]] },
  ],
};

// "Your footage" (was "The old way"): editing your own footage, chore by
// chore by hand beside one sentence to KeyFly. Qualitative only: no
// competitor names, no time savings or other numbers. What KeyFly does is
// the app's help ("Drop the recording in; the AI cuts silences and filler
// words, adds captions, zooms on the focus area and adds callouts"), its
// music bed under the voice-over and its frame shapes; the side-by-side
// itself is illustrative.
export const oldWay = {
  eyebrow: "Your footage",
  title: [{ text: "Got footage?" }, { text: "KeyFly does the chores.", accent: true }],
  lead: "Drop in a talking head, a screen recording or your clips. KeyFly cuts the silences and filler words, adds captions, and zooms in on what matters: the chores you'd otherwise do by hand.",
  note: "Illustrative",
  hand: { label: "By hand", step: "Step", of: "of" },
  keyfly: { label: "With KeyFly", done: "Done in one step", ready: "First cut ready", title: "Launch day", sub: "Chapter 2", captions: ["Built", "for", "launch", "day"] },
  ask: "Edit my footage into a 30s video with captions, plus a 9:16 cut",
  zoom: "◆ Zoom 140%",
  hint: "Scroll to work through it by hand",
  // The chores by hand, one per step, and what KeyFly did for each.
  steps: [
    { title: "Scrub the footage", body: "Watch every clip to find the good parts.", keyfly: "Footage reviewed" },
    { title: "Zoom on the moments", body: "Keyframe a zoom and a callout on every key moment.", keyfly: "Zooms and callouts added" },
    { title: "Cut the silences", body: "Find every silence and filler word, and cut it out.", keyfly: "Silences and filler words cut" },
    { title: "Balance the music", body: "Lay in a track and duck it under the voice.", keyfly: "Music set under the voice" },
    { title: "Type the captions", body: "Type every word and time it to the voice.", keyfly: "Captions added" },
    { title: "Reframe for 9:16", body: "Re-crop every shot for vertical and export again.", keyfly: "9:16 version made" },
  ],
};

// "Edit with words": the first cut is a starting point; you change it by
// saying what you want. The app confirms the idea (its AI director takes
// changes in chat: "What should we change?"). The six example asks and
// what they change are illustrative.
export const editWithWords = {
  eyebrow: "Edit with words",
  title: [{ text: "Change anything" }, { text: "by saying it.", accent: true }],
  lead: "Your first cut is a starting point. Tell KeyFly what to change, the way you'd brief an editor, and the timeline follows.",
  barLabel: "Ask KeyFly to change the cut",
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

// "You make the calls": KeyFly shows every decision it made, why, and
// lets you change it. The decisions and reasons are PLACEHOLDER
// (illustrative) until the team confirms what KeyFly exposes.
export const yourCall = {
  eyebrow: "You make the calls",
  title: [{ text: "KeyFly decides." }, { text: "You have the final say.", accent: true }],
  lead: "No black box. Every call KeyFly makes is listed in the inspector with its reason, marked on the timeline, and one click from changing.",
  file: "Launch Video",
  inspector: "Inspector",
  inspectorSub: "KeyFly's decisions",
  why: "Why",
  pickLabel: "KeyFly's pick",
  changedLabel: "Changed",
  reset: "Back to KeyFly's cut",
  note: "Illustrative interface",
  decisions: [
    { id: "take", label: "Opening shot", reason: "Take 3 has the clearest delivery and the steadiest frame.", options: ["Take 1", "Take 2", "Take 3"], pick: 2 },
    { id: "cuts", label: "Cut points", reason: "Cutting on the beat matches the music's 120 BPM.", options: ["On beat", "2 beats", "Free"], pick: 0 },
    { id: "title", label: "Chapter title", reason: "Two seconds is long enough to read it once.", options: ["1 sec", "2 sec", "3 sec"], pick: 1 },
    { id: "duck", label: "Music under voice", reason: "Twelve decibels down keeps every word clear.", options: ["Off", "−6 dB", "−12 dB"], pick: 2 },
  ],
};

// "One edit, every format": one cut in each shape. The four shapes are the
// app's ("Frame shape" in the editor: 16:9, 9:16, 1:1, 4:5), and its export
// sheet has presets for TikTok, Reels, YouTube, Shorts, LinkedIn and X.
// The app doesn't say how it recomposes a shot, so the copy doesn't either.
export const everyFormat = {
  eyebrow: "One edit, every format",
  title: [{ text: "One edit." }, { text: "Every screen.", accent: true }],
  lead: "Make the cut once, then switch its frame shape. Export it for TikTok, Reels, YouTube, Shorts, LinkedIn or X, in up to 4K.",
  note: "Illustrative interface",
  formatLabel: "Format",
  madeFor: "Made for",
  keeps: { label: "KeyFly keeps", items: ["The same cut and timing", "Your voice-over and music", "Your brand kit"] },
  bar: "Formats",
  captions: ["Your", "story,", "cut", "in", "seconds"],
  formats: [
    { id: "wide", ratio: "16:9", w: 16, h: 9, px: [1920, 1080], name: "Widescreen", for: ["YouTube", "Websites", "Presentations"] },
    { id: "vertical", ratio: "9:16", w: 9, h: 16, px: [1080, 1920], name: "Vertical", for: ["Reels", "Shorts", "TikTok"] },
    { id: "square", ratio: "1:1", w: 1, h: 1, px: [1080, 1080], name: "Square", for: ["Feed posts", "LinkedIn", "Carousels"] },
    { id: "portrait", ratio: "4:5", w: 4, h: 5, px: [1080, 1350], name: "Portrait", for: ["Feed ads", "Instagram posts"] },
  ],
};

// "On brand, every time": the brand kit, applied to every cut. From the
// app's Brand kits page: "Your logo, colours, font and voice in one place.
// New videos use the default kit automatically", and a kit can be filled
// by AI from your website ("Analyze with AI"). It holds a logo (plus logo
// versions and banners), five colours, a font, a tone of voice and a
// voice-over (AI-chosen or your cloned voice). The videos are illustrative.
export const onBrand = {
  eyebrow: "On brand, every time",
  title: [{ text: "Your brand." }, { text: "On every cut.", accent: true }],
  lead: "Your logo, colours, font and voice in one place. Point KeyFly at your website and it fills the kit for you; every new video uses it automatically.",
  note: "Illustrative interface",
  kitLabel: "Brand kit",
  applied: "applied",
  videosLabel: "videos",
  // The kit, in the order KeyFly applies it.
  items: [
    { id: "logo", name: "Your logo", detail: "Logo, versions, banners" },
    { id: "colours", name: "Your colours", detail: "Primary, accent, text" },
    { id: "font", name: "Your font", detail: "Titles and captions" },
    { id: "voice", name: "Your voice", detail: "Tone and voice-over" },
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
// The team confirmed on 2026-11-02 that KeyFly runs as an app inside
// ChatGPT and Claude, and the project then opens in KeyFly. The desktop
// app page confirms the sync ("everything syncs when you're back"). The
// example edits are illustrative.
export const anywhere = {
  eyebrow: "Works where you work",
  title: [{ text: "Start anywhere." }, { text: "Finish anywhere.", accent: true }],
  lead: "Ask for a video in ChatGPT or Claude, pick it up in your browser, finish it in the desktop app. One project, wherever you open it.",
  note: "Illustrative interface",
  openIn: "Open it in",
  history: "Project history",
  project: { name: "Launch Video", meta: "0:30 · 16:9", synced: "Synced", label: "One project" },
  surfaces: [
    { id: "chat", name: "Chat", where: "ChatGPT · Claude", ask: "Make a 30-second launch video from my footage", reply: "Here's your first cut.", card: "Open in KeyFly", log: "Draft made in chat" },
    { id: "browser", name: "Browser", where: "app.keyfly.si", action: "Captions added", log: "Captions added in the browser" },
    { id: "desktop", name: "Desktop app", where: "macOS · Windows", action: "Exported · 1920 × 1080", log: "Exported from the desktop" },
  ],
};

// "Start from a prompt": example prompts to try, grouped by goal. Each
// uses only what KeyFly is confirmed to do (the presets, the formats,
// captions, the brand kit); the preset prompts are the app's own. The two
// extra examples match the app's templates ("Feature drop", a 15s 9:16
// launch film; and its "Events and promos" category).
export const prompts = {
  eyebrow: "Prompt gallery",
  title: [{ text: "Start from" }, { text: "a prompt.", accent: true }],
  lead: "Not sure what to ask for? Pick a prompt, send it to the box at the top, and change any word you like.",
  note: "Illustrative previews",
  try: "Try it",
  // The app's Templates page (read 2026-11-03): "Start from a proven
  // structure; the AI director fills it with your product", 91 templates,
  // Free and Premium. /templates opens the signed-in workspace's page.
  templates: {
    label: "Templates",
    count: "91 templates",
    line: "for launch films, UGC ads, podcast clips, logo reveals, screen recordings and more. Pick one and the AI director fills it with your product.",
    meta: "Free and Premium",
    cta: "Browse templates",
    href: `${siteConfig.appUrl}/templates`,
  },
  groups: [
    {
      label: "Launch",
      items: [
        { text: presetPrompt("Launch Video"), preset: "Launch Video", kind: "launch", format: "16:9" },
        { text: "A 15-second vertical teaser of our launch video, with captions and our brand kit.", preset: "Launch Video", kind: "launch", format: "9:16" },
      ],
    },
    {
      label: "Social",
      items: [
        { text: presetPrompt("UGC"), preset: "UGC", kind: "ugc", format: "9:16" },
        { text: presetPrompt("Podcast"), preset: "Podcast", kind: "podcast", format: "9:16" },
      ],
    },
    {
      label: "Explain",
      items: [
        { text: presetPrompt("Explainer"), preset: "Explainer", kind: "explainer", format: "16:9" },
        { text: presetPrompt("Product Demo"), preset: "Product Demo", kind: "demo", format: "16:9" },
      ],
    },
    {
      label: "Stories",
      items: [
        { text: presetPrompt("Montage"), preset: "Montage", kind: "montage", format: "16:9" },
        { text: "A one-minute recap of our event from my footage, cut to the music, with our logo at the end.", preset: "Montage", kind: "montage", format: "16:9" },
      ],
    },
  ],
};

// "Works with your tools": the AI that edits, and the editors the timeline
// goes to. Read from the KeyFly app on 2026-11-03: the AI picker (Cloud, or
// your own agents), Settings → Agents, the desktop app page, and the export
// sheet's "Timeline for other editors" and "Package for editing". The ask
// and reply in the middle are illustrative.
export const tools = {
  eyebrow: "Works with your tools",
  title: [{ text: "Bring your own AI." }, { text: "Take the timeline anywhere.", accent: true }],
  lead: "Let KeyFly pick the model, or edit with the AI agents you already pay for. When it's ready, hand the timeline to your editor with every file it uses.",
  note: "Illustrative interface",
  in: {
    kicker: "Bring your AI",
    options: [
      { id: "cloud", name: "KeyFly Cloud", note: "Picks the best model for each step", cost: "AI minutes" },
      { id: "claude-code", name: "Claude Code", note: "Your own plan", cost: "No AI minutes" },
      { id: "codex", name: "Codex", note: "Your own plan", cost: "No AI minutes" },
      { id: "cursor", name: "Cursor", note: "Your own plan", cost: "No AI minutes" },
      { id: "antigravity", name: "Antigravity", note: "Your own plan", cost: "No AI minutes" },
    ],
    foot: "Agents connect through the KeyFly desktop app, on your computer. Any ACP agent works.",
  },
  hub: {
    file: "Launch Video · KeyFly",
    editing: "Editing with",
    ask: "Tighten the intro and add captions",
    reply: "Intro trimmed · captions added",
    handOff: "Hand off as",
  },
  out: {
    kicker: "Take it anywhere",
    options: [
      { id: "fcp", name: "Final Cut Pro", format: "FCPXML" },
      { id: "resolve", name: "DaVinci Resolve", format: "FCPXML · EDL · OTIO" },
      { id: "premiere", name: "Premiere Pro", format: "EDL (CMX 3600)" },
      { id: "avid", name: "Avid", format: "EDL (CMX 3600)" },
    ],
    foot: "Package for editing: a .zip with the timeline and every file it uses (footage, voice-over, music, pictures), so it opens with its media.",
  },
};

// "Who it's for": KeyFly by role. The roles follow the app's template
// categories (Product launches, Social ads, Events and promos; Explainers
// and demos, Screen recordings, Data and reports; UGC and creators;
// Talking heads and podcasts) and its motion styles (Founder Launch,
// Product Explainer: "B2B demos and walkthroughs"). The podcast line uses
// its help ("cuts silences and filler words, adds captions").
export const audience = {
  eyebrow: "Who it's for",
  title: [{ text: "Made for people" }, { text: "with a story to tell.", accent: true }],
  lead: "Whatever you make, you start the same way: say what you want, or drop in your footage.",
  note: "Illustrative previews",
  makes: "Makes",
  formatsLabel: "Formats",
  promptLabel: "Try",
  try: "Try this prompt",
  roles: [
    { id: "marketers", name: "Marketers & founders", line: "Launch films, social ads and event promos, from one sentence or your own footage.", presets: ["Launch Video", "Montage"], formats: ["16:9", "9:16"], kind: "launch", format: "16:9", prompt: presetPrompt("Launch Video") },
    { id: "product", name: "Product & SaaS teams", line: "Walkthroughs, explainers and screen-recording demos, with zooms and callouts.", presets: ["Product Demo", "Explainer"], formats: ["16:9", "1:1"], kind: "explainer", format: "16:9", prompt: presetPrompt("Product Demo") },
    { id: "creators", name: "Creators", line: "UGC ads and scroll-stopping hooks, captioned and cut for vertical.", presets: ["UGC"], formats: ["9:16"], kind: "ugc", format: "9:16", prompt: presetPrompt("UGC") },
    { id: "podcasters", name: "Podcasters", line: "Episodes and talking heads cut into clips, with silences and filler words removed.", presets: ["Podcast"], formats: ["9:16"], kind: "podcast", format: "9:16", prompt: presetPrompt("Podcast") },
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
  // One line per preset, drawn from its prompt in the app.
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
  title: [{ text: "Land KeyFly" }, { text: "on your desktop.", accent: true }],
  lead: "KeyFly runs on macOS and Windows. Or open it in your browser, with nothing to install.",
  // The landing's readout: the install's three stages (they run with the
  // flight), its status in the air and on landing, and the scroll hint.
  stages: ["Download", "Install", "Open"],
  status: { flying: "Installing KeyFly", ready: "Landed" },
  hint: "Scroll to land it",
  platformLabel: "Platform",
  detected: "Your system",
  soon: "Coming soon",
  browser: { label: "Open in your browser", href: siteConfig.appUrl },
  phone: "On a phone? KeyFly runs in the browser.",
  note: "KeyFly.si is a Cevrynt Inc. product",
  // Links and requirements from app.keyfly.si/download (2026-11-03). The
  // links always serve the latest build. The app isn't notarised yet, so the
  // first open asks once (as that page says).
  platforms: [
    {
      id: "macos",
      label: "macOS",
      target: "Applications",
      step: "Open the .dmg and drag KeyFly to Applications.",
      needs: "Apple silicon · macOS 13 Ventura or later",
      href: "https://app.keyfly.si/download/mac",
      alt: { label: "Intel Mac? Download for Intel", href: "https://app.keyfly.si/download/mac-intel" },
    },
    {
      id: "windows",
      label: "Windows",
      target: "Desktop",
      step: "Run the installer. Windows asks once before KeyFly first opens.",
      needs: "Windows 10 and 11 · 64-bit",
      href: "https://app.keyfly.si/download/windows",
    },
  ],
};

// FAQ: answers only from confirmed facts (the app, its help and its pricing
// API, read 2026-11-03). Never fill an answer with guesses.
export const faq = {
  eyebrow: "Questions",
  title: [{ text: "Ask KeyFly." }, { text: "Anything.", accent: true }],
  lead: "The short answers to what people ask most. Pick a question and KeyFly answers it.",
  panel: "Ask KeyFly",
  listLabel: "Questions",
  next: "Next question",
  items: [
    {
      q: "What is KeyFly?",
      a: "KeyFly is an AI video editor. Describe the video you want, or drop in your footage, and KeyFly edits it into a first cut you can refine.",
      link: { label: "How it works", href: "#product" },
    },
    {
      q: "Does it run on Mac, Windows and the web?",
      a: "Yes. KeyFly is a desktop app for macOS and Windows, and it also runs in your browser at app.keyfly.si.",
      link: { label: "Download", href: "#download" },
    },
    {
      q: "Can I use KeyFly from ChatGPT or Claude?",
      a: "Yes. KeyFly runs as an app inside ChatGPT and Claude. Ask for a video in the chat, then open the project in KeyFly when you want to keep working on it.",
      link: { label: "Works where you work", href: "#anywhere" },
    },
    {
      // The app's AI picker and Settings → Agents.
      q: "Can I use my own AI agents?",
      a: "Yes. Connect Claude Code, Codex, Cursor, Antigravity or any other ACP agent through the KeyFly desktop app, and it edits with your own plan, without using your AI minutes. Or let KeyFly Cloud pick the best model for each step.",
      link: { label: "Works with your tools", href: "#tools" },
    },
    {
      // The app's AI director takes changes in chat ("What should we change?",
      // with Revert), and every clip is on an editable timeline.
      q: "Can I change the video after KeyFly edits it?",
      a: "Yes. Ask the AI director for changes in plain words, like “make the intro faster”, and undo any AI change with one click. Or change it yourself on the timeline.",
      link: { label: "Edit with words", href: "#edit" },
    },
    {
      q: "Can KeyFly keep my videos on brand?",
      a: "Yes. A brand kit holds your logo, colours, font and voice, and KeyFly can fill it from your website. Every new video uses your default kit automatically.",
      link: { label: "On brand, every time", href: "#brand" },
    },
    {
      // The app's export sheet.
      q: "Which formats can I export?",
      a: "Video in 16:9, 9:16, 1:1 or 4:5, up to 4K, as MP4, MOV, WebM, MKV or GIF. Sound as WAV, frames as pictures, and the timeline for Final Cut, DaVinci Resolve, Premiere or Avid.",
      link: { label: "One edit, every format", href: "#formats" },
    },
    {
      // From the app: "Your projects stay yours and you can always export
      // them" (help, How do I cancel?); the desktop app keeps footage local,
      // uploading only "when a cloud AI step needs it"; exports are "made on
      // this device"; usage data is "never your videos, prompts or files".
      q: "Who owns my videos, and what happens to my footage?",
      a: "Your projects stay yours, and you can always export them, even if you cancel. In the desktop app your footage stays on your computer and is uploaded only when a cloud AI step needs it. Usage data never includes your videos, prompts or files.",
      link: { label: "Download", href: "#download" },
    },
    {
      // Prices, trials and allowances come only from the pricing API, so the
      // answer names none of them.
      q: "How much does KeyFly cost?",
      a: "You can start free and upgrade when you need more AI minutes. Every plan, with its price and what it includes, is in the pricing section below.",
      link: { label: "Pricing", href: "#pricing" },
    },
    {
      // The pricing API's own wording ("AI minutes", never "credits"), and
      // its packs.
      q: "What are AI minutes?",
      a: "The time KeyFly's AI spends building and editing your videos. They count only while the AI is working, so changes you make yourself on the timeline use none. Plans come with AI minutes every month, and packs add more when you need them.",
      link: { label: "Pricing", href: "#pricing" },
    },
    {
      // The app has a Help page; help@keyfly.si is its contact address.
      q: "How do I get help?",
      a: "Open Help in the KeyFly app for answers to common questions, or email help@keyfly.si and tell us what you need.",
      link: { label: "Email help@keyfly.si", href: "mailto:help@keyfly.si" },
    },
  ],
};

// Pricing. Plans, prices, allowances, bullets and links come only from
// the pricing API (src/lib/pricing.js); this is the section's own copy.
// `pending` is the fallback while there has never been a good fetch.
export const pricing = {
  eyebrow: "Pricing",
  title: [{ text: "Start free." }, { text: "Grow when you need to.", accent: true }],
  lead: "Every plan edits with KeyFly. Paid plans add AI minutes: the time KeyFly's AI spends building and editing your videos.",
  plans: {
    billing: "Billing",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save ~{n}%",
    popular: "Most popular",
    perMonth: "/ month",
    perSeat: "/ seat / month",
    aiMinutes: "AI minutes a month",
    aiMinutesSeat: "AI minutes per seat",
    buy: "Buy now",
    trial: "{days}-day free trial",
    noCard: "no card needed",
    export: "Export",
    storage: "Storage",
    watermark: "KeyFly mark",
    yes: "Yes",
    no: "No",
    free: "$0",
    custom: "Custom",
    minSeats: "minimum {n} seats",
    packs: "Need more AI minutes?",
    min: "min",
    axis: "AI minutes a month",
    note: "Prices in US dollars. AI minutes count only while KeyFly's AI is working.",
  },
  pending: {
    title: [{ text: "Plans," }, { text: "still rendering.", accent: true }],
    lead: "We're still working out KeyFly's plans, so there are no prices here yet. They'll appear on this page when they're ready.",
    file: "Pricing.mov",
    status: "Rendering",
    statusNote: "plans coming soon",
    until: "Until then",
    primary: "Open KeyFly in your browser",
    secondary: "Download",
  },
};
