import { primaryCta } from "./navigation";

// The Integrations page (/integrations), built section by section from the
// plan in PLAN.md and the research in research_notes/integrations/. Every
// fact is the KeyFly app's (Settings → Agents, the AI picker, Help and the
// export sheet, read 2026-11-06) or its pricing API's. Agents, editors and
// platforms are named in text only: no logos. The ChatGPT and Claude apps
// have no install links yet, so they are marked "Coming soon".

// In search results and shares (2026-11-09, from the SEO audit). The title
// names what people search for (58 characters with " · KeyFly"); the
// description fits before Google cuts it off (146 characters).
export const integrationsMeta = {
  title: "Claude Code, Codex and Final Cut Pro integrations",
  description:
    "Edit videos with your own Claude Code, Codex or Cursor, no AI minutes, then hand the timeline to Final Cut Pro, DaVinci Resolve, Premiere or Avid.",
};

export const integrationsHero = {
  // Part of the h1 (2026-11-09), so it names the topic as well as the page.
  eyebrow: "Integrations · Agents and editors",
  title: [{ text: "Plugs into your AI." }, { text: "Hands off to your editor.", accent: true }],
  lead: "Edit with Claude Code, Codex, Cursor, Antigravity or any ACP agent on your own plan, then take the timeline to Final Cut Pro, Resolve, Premiere or Avid with every file it uses.",
  primary: primaryCta,
  secondary: { label: "Get the desktop app", href: "/#download" },
  // The map: KeyFly in the middle; where it runs on the inner ring; your AI
  // (left), your editor (right) and where it posts (top) on the outer ring.
  map: {
    label: "What KeyFly connects to",
    center: "KeyFly",
    // The film every integration connects to: an illustrative skate montage
    // cut from real stock footage (scripts/skate-reel/).
    film: { src: "/video/skate-reel.mp4", poster: "/video/skate-reel.webp", length: "0:08", edited: "Edited with" },
    pause: "Pause",
    play: "Play",
    rings: {
      runs: { label: "Runs on", items: ["Mac", "Windows", "Web"] },
      ai: {
        label: "Your AI",
        items: [
          { name: "Claude Code", note: "No AI minutes" },
          { name: "Codex", note: "No AI minutes" },
          { name: "Cursor", note: "No AI minutes" },
          { name: "Antigravity", note: "No AI minutes" },
          { name: "Any ACP agent", note: "No AI minutes" },
          { name: "KeyFly Cloud", note: "AI minutes" },
        ],
      },
      editors: {
        label: "Your editor",
        items: [
          { name: "Final Cut Pro", note: "FCPXML" },
          { name: "DaVinci Resolve", note: "FCPXML · EDL · OTIO" },
          { name: "Premiere Pro", note: "EDL" },
          { name: "Avid", note: "EDL" },
        ],
      },
      posts: { label: "Where it posts", items: ["TikTok", "Reels", "YouTube", "Shorts", "LinkedIn", "X"] },
    },
  },
  facts: [
    { value: "5+", label: "AI agents", detail: "Any ACP agent, on your own plan" },
    { value: "4", label: "editors", detail: "Final Cut, Resolve, Premiere, Avid" },
    { value: "3", label: "timeline formats", detail: "FCPXML · EDL · OpenTimelineIO" },
    { value: "6", label: "export presets", detail: "TikTok to X, up to 4K" },
    { value: "0", label: "uploads to export", detail: "Encoded on your device" },
  ],
  note: "From the KeyFly app: Settings → Agents, the AI picker and the export sheet",
};

// "Your own AI agent" (#agents): one studio panel around a playing video.
// You ask; your agent (on your computer, through the KeyFly desktop app)
// makes the edit; it reaches its limit and KeyFly hands the work on, as
// Help describes; the AI minutes stay at 0. Then the app's three steps to
// set it up. The picker's, Settings' and Help's wording are the app's; the
// asks, replies, reset time and counts are illustrative.
export const integrationsAgents = {
  eyebrow: "Your own AI agent",
  title: [{ text: "Bring your own agent." }, { text: "Keep your AI minutes.", accent: true }],
  lead: "Claude Code, Codex, Cursor, Antigravity and other ACP agents edit your video on your own plan. You ask in KeyFly; your agent does the work on your computer.",
  // A link from the lead to the page that goes further.
  more: { label: "What the AI director does", href: "/product#direct" },
  pause: "Pause",
  play: "Play",
  summary:
    "An illustration: you ask KeyFly to make the intro faster, and Claude Code, on your computer, trims scene 1. You ask for captions; Claude Code reaches its limit, KeyFly offers Codex or KeyFly Cloud, and Codex adds the captions. The AI minutes used stay at 0.",
  // An illustrative podcast highlight cut from real stock footage
  // (scripts/agent-reel/).
  video: { src: "/video/agent-reel.mp4", poster: "/video/agent-reel.webp", caption: "Okay, here's what changed this week." },
  studio: {
    title: "Podcast highlight",
    editing: "Editing with",
    via: "via the KeyFly desktop app",
    meter: "AI minutes used",
    value: "0",
    chat: "Chat",
    working: "is working",
    composer: "What should we change? (@ to mention, / for commands)",
  },
  agents: ["Claude Code", "Codex", "Cursor", "Antigravity", "Any ACP agent"],
  cloud: { name: "KeyFly Cloud", cost: "AI minutes" },
  plan: "Your plan",
  // One entry per moment, in order. `who` is "you", "keyfly" or an index
  // into `agents`.
  events: [
    { who: "you", text: "Make the intro faster" },
    { who: 0, text: "Trimmed scene 1 to 2.4s", done: true },
    { who: "you", text: "Add captions" },
    { who: 0, text: "reached its limit · resets at 14:00", limit: true },
    { who: "keyfly", text: "Switch to Codex, or use KeyFly Cloud?", options: ["Switch to Codex", "Use KeyFly Cloud"] },
    { who: 1, text: "Captions on · 23 words", done: true },
  ],
  you: "You",
  keyfly: "KeyFly",
  setup: {
    label: "Set up once",
    steps: [
      { name: "Get the desktop app", line: "Mac or Windows", link: { label: "Download ↓", href: "/#download" } },
      { name: "Turn on agents", line: "Settings → Agents → Use agents on this computer" },
      { name: "Pick your agent", line: "AI picker → Your agents" },
    ],
    help: "Can't connect? Use a pairing code.",
  },
  note: "Wording from the KeyFly app · Asks, work and times illustrative",
};

// "Your editor" (#editors): the round trip to another editor, on an
// illustrative road-trip film (its own real footage). From the
// app's export sheet (read 2026-11-06): "Timeline for other editors" (FCPXML
// for Final Cut Pro, also DaVinci Resolve; EDL CMX 3600 for Premiere, Resolve
// and Avid; OpenTimelineIO for Resolve and pipelines) and "Package for
// editing" (a .zip with a folder per editor: the timeline plus every file it
// uses, linked by relative paths so it opens with its media; optionally the
// graphics, titles and captions as 1080p PNG sequences with transparency).
// Timeline export depends on the plan (pricing API). File and
// folder names are illustrative.
export const integrationsEditors = {
  eyebrow: "Your editor",
  title: [{ text: "Finish it anywhere." }, { text: "Every file comes along.", accent: true }],
  lead: "Hand the timeline to Final Cut Pro, DaVinci Resolve, Premiere Pro or Avid, packed with every file it uses, so it opens ready to edit.",
  // A link from the lead to the page that goes further.
  more: { label: "Every export option", href: "/product#deliver" },
  pause: "Pause",
  play: "Play",
  summary:
    "An illustration: a road-trip film's timeline in KeyFly is exported as a package, a .zip with a folder per editor holding the timeline and every file it uses, and opens in the chosen editor with its media linked.",
  // An illustrative road-trip film cut from real stock footage
  // (scripts/road-reel/).
  project: { name: "Road trip film", file: "road-trip", video: "/video/road-reel.mp4", poster: "/video/road-reel.webp", length: "0:08" },
  stages: [
    { index: "01", label: "Your cut in KeyFly", action: "Export → Timeline for other editors" },
    { index: "02", label: "The package", action: "Package for editing" },
    { index: "03", label: "Opens in your editor", action: "Media linked" },
  ],
  tracks: [
    { name: "Video", clips: [[0, 34], [36, 62], [64, 100]] },
    { name: "Voice-over", clips: [[0, 96]] },
    { name: "Music", clips: [[0, 100]] },
    { name: "Graphics", clips: [[4, 30], [70, 96]] },
  ],
  // The package's media, the same in every format's folder.
  media: [
    { name: "footage", files: ["aerial-road.mp4", "sunroof.mp4", "meadow.mp4"] },
    { name: "voice-over", files: ["voice-over.wav"] },
    { name: "music", files: ["music-bed.wav"] },
    { name: "pictures", files: ["logo.png"] },
  ],
  graphics: { name: "graphics", files: ["title_0001.png …", "captions_0001.png …"] },
  toggle: { label: "Include graphics, titles and captions", note: "PNG sequences with transparency, 1080p · bigger download" },
  folders: [
    { id: "fcpxml", name: "final-cut-pro", ext: "fcpxml" },
    { id: "edl", name: "edl", ext: "edl" },
    { id: "otio", name: "opentimelineio", ext: "otio" },
  ],
  editors: [
    { name: "Final Cut Pro", formats: ["FCPXML"], folder: "fcpxml" },
    { name: "DaVinci Resolve", formats: ["FCPXML", "EDL", "OTIO"], folder: "otio" },
    { name: "Premiere Pro", formats: ["EDL"], folder: "edl" },
    { name: "Avid", formats: ["EDL"], folder: "edl" },
  ],
  zipNote: "Each format's folder has its own copy of the media. Pick one editor for a smaller file.",
  relative: "Linked by relative paths, so it opens with its media.",
  formats: [
    { name: "FCPXML", detail: "Final Cut Pro, also DaVinci Resolve" },
    { name: "EDL", detail: "CMX 3600 · Premiere Pro, DaVinci Resolve, Avid" },
    { name: "OpenTimelineIO", detail: ".otio · DaVinci Resolve and pipelines" },
  ],
  plans: { text: "Timeline export depends on your plan.", link: "See plans →", href: "/pricing" },
  note: "Formats and package from the KeyFly app's export sheet · Project and file names illustrative",
};

// "Where it goes" (#destinations): a departures board of the export sheet's
// presets beside an export pass for the one in focus. Everything on the
// pass is the export sheet's (read 2026-11-06): For: Custom, TikTok,
// Instagram Reels, YouTube, YouTube Shorts, LinkedIn, X; tabs Video, Sound,
// Frames; 720p, 1080p, 4K; 23.976–60 fps; MP4, MOV, WebM, MKV, GIF; H.264,
// HEVC (H.265); "Smooth motion (motion blur)"; "MP4 (H.264), encoded on this
// device. Nothing is uploaded." What each preset sets isn't confirmed, so
// the pass lists the options rather than a preset's values. The board's
// order and timing are illustrative; the file continues the road-trip film.
export const integrationsDestinations = {
  eyebrow: "Where it goes",
  title: [{ text: "Ready for every feed." }, { text: "Encoded on your computer.", accent: true }],
  lead: "Pick where the video is going and KeyFly exports it on your device, for TikTok, Reels, YouTube, Shorts, LinkedIn or X. Nothing is uploaded.",
  // A link from the lead to the page that goes further.
  more: { label: "Templates in every shape", href: "/use-cases#categories" },
  pause: "Pause",
  play: "Play",
  board: {
    title: "Exports",
    file: "road-trip.mp4",
    where: "Encoded on this device",
    columns: { index: "No.", destination: "Destination", status: "Status" },
    statuses: { waiting: "WAITING", encoding: "ENCODING", ready: "READY" },
    presets: ["Custom", "TikTok", "Instagram Reels", "YouTube", "YouTube Shorts", "LinkedIn", "X"],
  },
  pass: {
    brand: "KeyFly",
    kind: "Export pass",
    from: { label: "From", value: "This computer" },
    to: { label: "To" },
    file: { label: "File", value: "road-trip.mp4" },
    tabs: { label: "Export", items: ["Video", "Sound", "Frames"] },
    rows: [
      { label: "Format", items: ["MP4", "MOV", "WebM", "MKV", "GIF"], pick: "MP4" },
      { label: "Codec", items: ["H.264", "HEVC (H.265)"], pick: "H.264" },
      { label: "Size", items: ["720p", "1080p", "4K"] },
      { label: "Frame rate", items: ["23.976", "24", "25", "29.97", "30", "50", "59.94", "60"] },
    ],
    defaultNote: "Default: MP4 (H.264)",
    extra: "Smooth motion (motion blur)",
    stub: { line: "Encoded on this device", sub: "Nothing is uploaded.", count: "0", countLabel: "uploads" },
  },
  plans: { text: "Export size and the KeyFly mark depend on your plan.", link: "See plans →", href: "/pricing" },
  note: "Presets and options from the KeyFly app's export sheet · Board illustrative",
};

// "Chat apps" (#chat): KeyFly in ChatGPT and Claude, as one thread down
// the page: your ask set large like a pull quote, KeyFly's reply in the
// chat (the video), and the same project opening in KeyFly. Confirmed by
// the team (2026-11-02, as in the homepage FAQ): "KeyFly runs as an app
// inside ChatGPT and Claude. Ask for a video in the chat, then open the
// project in KeyFly when you want to keep working on it." and one project
// everywhere, synced. The apps have no install links yet, so both are
// "Coming soon". The chat apps are named in text only (never their look);
// the ask, the reply (the road-trip film) and the project are illustrative.
export const integrationsChat = {
  eyebrow: "Chat apps",
  title: [{ text: "Start in the chat." }, { text: "Finish in KeyFly.", accent: true }],
  lead: "KeyFly runs as an app inside ChatGPT and Claude. Ask for a video in the chat, then open the project in KeyFly when you want to keep working on it.",
  pause: "Pause",
  play: "Play",
  apps: ["ChatGPT", "Claude"],
  switchLabel: "Ask in",
  summary:
    "An illustration: you ask for an 8-second road-trip teaser in ChatGPT or Claude, KeyFly replies in the chat with the video, and you open the same project in KeyFly to keep editing.",
  ask: { text: "Make an 8-second teaser for our road-trip weekend.", by: "You, in" },
  steps: ["You ask", "KeyFly replies", "You keep editing"],
  reply: {
    app: "KeyFly",
    making: "Making your video",
    ready: "Ready",
    title: "Road-trip teaser",
    length: "0:08",
    video: "/video/road-reel.mp4",
    poster: "/video/road-reel.webp",
    open: "Open in KeyFly",
  },
  project: {
    title: "KeyFly · Road-trip teaser",
    opened: "Opened from",
    tracks: ["Video", "Voice-over", "Music", "Graphics"],
    sync: "One project on Mac, Windows and the web",
  },
  status: {
    soon: "Coming soon",
    meanwhile: "Until then, start free in your browser →",
  },
  note: "Chat and project illustrative · ChatGPT and Claude named in text only",
};

// "Cost and your data" (#cost): a ledger of what each way of working costs
// in AI minutes and where your files go, in the desktop app. From the app:
// cloud AI uses AI minutes, each action shows its cost first and failed
// jobs are refunded (Help); your own agents edit with your own plan,
// without AI minutes, through the desktop app (Settings → Agents); footage
// stays on your computer and is uploaded only when a cloud AI step needs it,
// and usage data never includes your videos, prompts or files (data notes);
// exports are encoded on the device and nothing is uploaded (export sheet);
// the package is a .zip you download; projects stay yours, exportable even
// if you cancel (Help). Editing by hand and exporting use no AI minutes,
// since AI minutes count only while KeyFly's AI works (as on the Product
// page). Each row's route is a diagram of the same facts.
export const integrationsCost = {
  eyebrow: "Cost and your data",
  title: [{ text: "What it costs." }, { text: "Where your files go.", accent: true }],
  lead: "Only KeyFly's cloud AI uses AI minutes, and every action shows its cost first. In the desktop app, everything else stays on your computer.",
  // A link from the lead to the page that goes further.
  more: { label: "The plan for your own AI", href: "/pricing#byo" },
  pause: "Pause",
  play: "Play",
  columns: { what: "When you…", minutes: "AI minutes", files: "Where your files go" },
  zones: { local: "This computer", cloud: "Cloud" },
  rows: [
    {
      id: "hand",
      name: "Edit by hand",
      line: "Trim, move and change anything on the timeline.",
      minutes: { value: "0", free: true },
      route: { kind: "hand", target: null },
      files: "Stay on your computer.",
    },
    {
      id: "agent",
      name: "Edit with your own agent",
      line: "Claude Code, Codex, Cursor, Antigravity or any ACP agent.",
      minutes: { value: "0", free: true, note: "Your own plan" },
      route: { kind: "agent", target: "Your agent" },
      files: "Through the desktop app, to the agent on this computer.",
    },
    {
      id: "cloud",
      name: "Ask KeyFly's cloud AI",
      line: "KeyFly picks the best model for each step.",
      minutes: { value: "AI minutes", note: "Shown before it runs · refunded if it fails" },
      route: { kind: "cloud", target: "Cloud AI" },
      files: "Uploaded only when a cloud AI step needs them.",
    },
    {
      id: "export",
      name: "Export a video",
      line: "MP4, MOV, WebM, MKV or GIF, up to 4K.",
      minutes: { value: "0", free: true },
      route: { kind: "export", target: "video.mp4" },
      files: "Encoded on this device. Nothing is uploaded.",
    },
    {
      id: "package",
      name: "Hand off to your editor",
      line: "The timeline and every file it uses, as a .zip.",
      minutes: { value: "0", free: true },
      route: { kind: "export", target: "package.zip" },
      files: "Downloaded to your computer as a .zip.",
    },
  ],
  promises: [
    { title: "Usage data", body: "Never includes your videos, prompts or files." },
    { title: "Your projects", body: "Stay yours. You can always export them, even if you cancel." },
    { title: "Need more AI minutes?", body: "Add an AI-minute pack any time.", link: { label: "See plans →", href: "/pricing" } },
  ],
  note: "In the desktop app · From the KeyFly app's Help, data notes and export sheet",
};

// "Questions" (#questions): the questions as a list grouped by topic, and
// the answer to the one you pick set beside it, joined by a mint wire.
// Every answer is the app's (Settings → Agents, the AI picker, Help, the
// export sheet, data notes) or the team's (the chat apps); the links go to
// the section on this page that shows it.
export const integrationsFaq = {
  eyebrow: "Questions",
  title: [{ text: "Integrations," }, { text: "answered.", accent: true }],
  lead: "Pick a topic, then a question. Every answer comes from the KeyFly app.",
  labels: { topic: "Topic", question: "Question", answer: "Answer" },
  topics: [
    { id: "agents", label: "AI agents" },
    { id: "editors", label: "Editors" },
    { id: "export", label: "Export" },
    { id: "chat", label: "Chat apps" },
    { id: "data", label: "Cost and data" },
    { id: "requests", label: "Requests" },
  ],
  items: [
    {
      topic: "agents",
      q: "Which AI agents can I use?",
      a: "Claude Code, Codex, Cursor, Antigravity and other ACP agents. Or let KeyFly Cloud pick the best model for each step.",
      link: { label: "Your own AI agent", href: "#agents" },
    },
    {
      topic: "agents",
      q: "Do my own agents use AI minutes?",
      a: "No. They edit with your own plan, without using your AI minutes. Only KeyFly Cloud uses AI minutes.",
    },
    {
      topic: "agents",
      q: "How does an agent connect to KeyFly?",
      a: "Through the KeyFly desktop app on the same computer, which opens itself when an agent needs it. Turn it on in Settings → Agents → Use agents on this computer, then pick Your agents in the editor's AI picker. If it can't connect, use a pairing code.",
      link: { label: "Get the desktop app", href: "/#download" },
    },
    {
      topic: "agents",
      q: "What happens when my agent reaches its limit?",
      a: "KeyFly tells you when it resets and offers another agent that still has capacity, or KeyFly Cloud if your plan includes it.",
    },
    {
      topic: "editors",
      q: "Which editors can open my timeline?",
      a: "Final Cut Pro (FCPXML), DaVinci Resolve (FCPXML, EDL or OpenTimelineIO), Premiere Pro (EDL) and Avid (EDL).",
      link: { label: "Your editor", href: "#editors" },
    },
    {
      topic: "editors",
      q: "What's in Package for editing?",
      a: "A .zip with a folder per editor: the timeline plus every file it uses (footage, voice-over, music, pictures), linked by relative paths so it opens with its media. You can include graphics, titles and captions as 1080p PNG sequences with transparency. Each folder has its own copy of the media, so pick one editor for a smaller file.",
    },
    {
      topic: "editors",
      q: "Is timeline export on every plan?",
      a: "Timeline export depends on your plan. The plans show what each one includes.",
      link: { label: "See plans", href: "/pricing" },
    },
    {
      topic: "export",
      q: "Which export presets are there?",
      a: "TikTok, Instagram Reels, YouTube, YouTube Shorts, LinkedIn and X, or Custom. You can export at 720p, 1080p or 4K, from 23.976 to 60 fps, as MP4, MOV, WebM, MKV or GIF, in H.264 or HEVC. Sound and frames export on their own too.",
      link: { label: "Where it goes", href: "#destinations" },
    },
    {
      topic: "export",
      q: "Is my video uploaded when I export?",
      a: "No. The video is encoded on your device, and nothing is uploaded.",
    },
    {
      topic: "chat",
      q: "Can I use KeyFly in ChatGPT or Claude?",
      a: "Yes. KeyFly runs as an app inside ChatGPT and Claude. Ask for a video in the chat, then open the project in KeyFly when you want to keep working on it. The install links are coming soon.",
      link: { label: "Chat apps", href: "#chat" },
    },
    {
      topic: "data",
      q: "Does my footage leave my computer?",
      a: "In the desktop app your footage stays on your computer. It is uploaded only when a cloud AI step needs it. Usage data never includes your videos, prompts or files.",
      link: { label: "Cost and your data", href: "#cost" },
    },
    {
      topic: "data",
      q: "How do I know what an AI step will cost?",
      a: "Each action shows its cost in AI minutes before it runs, and failed jobs are refunded automatically. Editing by hand, exporting and your own agents use none.",
    },
    {
      topic: "requests",
      q: "Can you add an integration I need?",
      a: "Tell us which one and how you'd use it. Email help@keyfly.si; we answer within one working day.",
      link: { label: "Email help@keyfly.si", href: "mailto:help@keyfly.si" },
    },
  ],
  help: { title: "Something else?", line: "We answer within one working day.", email: "help@keyfly.si" },
};
