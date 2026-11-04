import { primaryCta } from "./navigation";

// The Product page (/product), built section by section from the plan in
// reports/AI video editor product pages.md. Every fact comes from the
// KeyFly app or its pricing API (read 2026-11-03 and 2026-11-04); never
// claim what they don't show, and never name a competitor.

export const productMeta = {
  title: "Product",
  description:
    "Everything KeyFly does, stage by stage: what the AI director makes, how you steer it, your footage, your brand kit, every export and where KeyFly runs.",
};

// The hero: the promise, then an illustrative KeyFly editor with the
// page's six stages pinned to the parts of it they explain (each links to
// its section as the sections are built), then a row of facts read from
// the app.
export const productHero = {
  eyebrow: "Product",
  title: [{ text: "The AI video editor," }, { text: "shown in full.", accent: true }],
  lead: "Every part of KeyFly, from the first sentence to the file you hand on: what the AI makes, how you steer it, and where the video goes next.",
  primary: primaryCta,
  secondary: { label: "Download", href: "/#download" },
  map: {
    label: "KeyFly, part by part",
    pause: "Pause the tour",
    play: "Play the tour",
    // The six stages of the page, in its order, and the part of the
    // editor each one points at (see Anatomy).
    stages: [
      { id: "make", name: "Make", line: "Describe it, drop footage or pick a template.", href: "#make" },
      { id: "direct", name: "Direct", line: "The AI director explains each call.", href: "#direct" },
      { id: "footage", name: "Footage", line: "Pauses and filler words cut, captions added.", href: "#footage" },
      { id: "brand", name: "Brand", line: "Your kit, filled from your website.", href: "#brand" },
      { id: "deliver", name: "Deliver", line: "Export, share for review, or hand it on.", href: "#deliver" },
      { id: "your-way", name: "Your way", line: "Mac, Windows, web, ChatGPT or Claude.", href: "#your-way" },
    ],
    // The illustrative editor's own labels.
    editor: {
      file: "Launch Video",
      platforms: "macOS · Windows · Web",
      export: "Export",
      brand: { label: "Brand kit", logo: "Logo", font: "Inter", voice: "Voice · Eyal" },
      director: { label: "AI director", rows: [["Hook", "Title line"], ["Voice", "Eyal"], ["Music", "Soft pulse"]] },
      ask: "Make the intro faster",
      caption: "Launch day is here",
      tracks: ["Storyboard", "Voice-over", "Graphics", "Music"],
    },
  },
  // Counts that are simply true in the app (templates page, the motion
  // styles, the frame shapes, the export sheet's timeline formats, where
  // it runs). No user numbers, speed claims or ratings.
  facts: [
    { value: "91", label: "templates", detail: "Free and Premium" },
    { value: "9", label: "motion styles", detail: "Or let the AI pick" },
    { value: "4", label: "frame shapes", detail: "16:9 · 9:16 · 1:1 · 4:5" },
    { value: "3", label: "timeline formats", detail: "FCPXML · EDL · OTIO" },
    { value: "5", label: "places to run it", detail: "Mac · Windows · Web · ChatGPT · Claude" },
  ],
  note: "Illustrative interface",
};

// "Make": where a video starts, and the layers KeyFly builds from it.
// From the app: the New video box (a sentence, Add media, a template), the
// AI director ("writes the storyboard, voice-over and motion graphics"),
// the Templates page ("Start from a proven structure; the AI director
// fills it with your product"), the editor's Audio panel (music beds made
// to a mood, genre and tempo, sound effects, "Licensed for you"), and the
// plans (AI images and AI voice-overs; generated video and voice cloning
// on higher plans). The inputs shown are illustrative.
export const productMake = {
  eyebrow: "Make",
  title: [{ text: "One sentence in." }, { text: "Every layer out.", accent: true }],
  lead: "Start from a sentence, your own footage or a template. The AI director writes the storyboard and builds every layer on its own track, so you can change any one of them.",
  note: "Illustrative interface",
  startLabel: "Start from",
  makesLabel: "KeyFly makes",
  pause: "Pause",
  play: "Play",
  doors: [
    {
      id: "sentence",
      name: "A sentence",
      sub: "Describe the video you want",
      input: { kind: "prompt", text: "A 30-second launch film for our habit-tracking app, calm and premium." },
      first: { name: "Storyboard", line: "Written from your sentence, scene by scene." },
    },
    {
      id: "footage",
      name: "Your footage",
      sub: "Clips, a talking head or a screen recording",
      input: { kind: "files", files: [["interview.mp4", "12:40"], ["screen-demo.mov", "3:15"], ["office-b-roll.mp4", "0:48"]] },
      first: { name: "Your footage", line: "The best moments kept; pauses and filler words cut." },
    },
    {
      id: "template",
      name: "A template",
      sub: "One of 91, Free and Premium",
      input: { kind: "template", name: "SaaS launch film", meta: "16:9 · 25s", style: "Editorial Minimal" },
      first: { name: "Storyboard", line: "The template's proven structure, filled with your product." },
    },
  ],
  // Every layer after the first, in the order KeyFly builds them. `tag`
  // marks what only higher plans include (from the pricing API).
  layers: [
    { id: "voice", name: "Voice-over", line: "An AI voice, or a clone of your own.", tag: "Cloning on higher plans" },
    { id: "graphics", name: "Motion graphics", line: "Titles, callouts and kinetic type in your motion style." },
    { id: "images", name: "AI images", line: "Pictures made for the scenes that need them." },
    { id: "music", name: "Music bed", line: "Made to a mood, genre and tempo. Licensed for you.", detail: "Minimal tech · 122 bpm" },
    { id: "sfx", name: "Sound effects", line: "From the library, on their own track." },
    { id: "video", name: "Generated video", line: "Shots made for what you can't film.", tag: "Higher plans" },
  ],
  styles: { label: "Motion styles", note: "Or let the AI pick" },
};

// "Direct": the AI director's reply, pinned to its own cut. Read from the
// KeyFly editor on 2026-11-04: after each build it replies "Built …" with
// the hook, the voice and the voices that "also fit", the music bed, what
// it "Assumed", a "Self-check" score out of five, "Next:" ideas, Revert and
// Retry, "Used 6 AI minutes", "Cloud · Worked for 43s · 18 steps", and a
// chat box: "What should we change? (@ to mention, / for commands)".
// Help: "How do I undo an AI change?" (Revert). The project, its values
// and the times the notes sit at are illustrative.
export const productDirect = {
  eyebrow: "Direct",
  title: [{ text: "Every cut comes with" }, { text: "the director's notes.", accent: true }],
  lead: "KeyFly's AI director doesn't just hand you a video. It pins a note to every call it made, says what it guessed and what it would try next, and every call stays yours to change.",
  note: "Illustrative project",
  reply: {
    from: "AI director",
    engine: "Cloud",
    worked: "Worked for 43s · 18 steps",
    prompt: "A 30-second launch film for our habit-tracking app. Calm, confident voice.",
    built: "Launch Video",
    revert: "Revert",
    retry: "Retry",
    used: "Used 6 AI minutes",
    ask: "What should we change? (@ to mention, / for commands)",
    pause: "Pause",
    play: "Play",
  },
  // The cut's tracks, top to bottom, and where it ends (% of the lanes;
  // past the end sit the "Next" ideas, as clips not yet made).
  tracks: [
    { id: "video", label: "Video" },
    { id: "voice", label: "Voice-over" },
    { id: "music", label: "Music" },
    { id: "look", label: "Look" },
  ],
  ruler: [["0:00", 0], ["0:10", 28], ["0:20", 56]],
  end: { at: 84, label: "0:30 · End", after: "After the cut" },
  // The director's notes, in the reply's order: where each sits (track and
  // % across), its time, what it says, and what it means for you.
  notes: [
    { id: "hook", track: "video", x: 4, at: "0:00", key: "Hook", value: "Opens on “Build the habit. Keep the streak.”", body: "The first seconds decide whether anyone keeps watching, so it tells you the opening it chose. Want another? Ask for one." },
    { id: "voice", track: "voice", x: 15, at: "0:04", key: "Voice", value: "Eyal: calm, confident, premium", body: "The voice it cast to read the script, and the others that would also fit.", chipsLabel: "Also fits", chips: ["Bronwen", "Elaine", "Quinn"] },
    { id: "music", track: "music", x: 33, at: "0:12", key: "Music", value: "Calm, minimal electronic with a soft pulse", body: "The bed under the voice, on a track of its own, so you can change it or drop it." },
    { id: "assumed", track: "look", x: 52, at: "0:00–0:30", key: "Assumed", value: "A near-black look with one accent colour", body: "Anything your prompt didn't say, it names as a guess, so a wrong one is easy to spot and correct." },
    { id: "check", track: "ruler", x: 84, at: "0:30", key: "Self-check", value: "3.4 out of 5", score: 3.4, of: 5, body: "The director scores the cut it made, so you can see how it rates its own work." },
    { id: "next", track: "video", x: 93, at: "After 0:30", key: "Next", value: "Three ideas for the next pass", body: "Pick one, or ignore them all.", chips: ["Open on the prompt typing", "Warmer voice in scene 3", "A 9:16 cut for Reels"] },
  ],
  steer: {
    label: "Three ways to steer",
    items: [
      { title: "Ask in the chat", body: "Brief it the way you'd brief an editor: “make the intro faster”. Type @ to point at a scene, / for a command." },
      { title: "Change it yourself", body: "Every layer is a real track on the timeline. Trim it, move it or replace it by hand, like any editor." },
      { title: "Revert or retry", body: "Undo any AI change in one click, or build it again. Nothing it does is final until you say so." },
    ],
  },
};

// "Footage": what KeyFly does to a recording. From the app's help ("Can I
// edit a talking-head or screen recording? Yes. Drop the recording in; the
// AI cuts silences and filler words, adds captions, zooms on the focus
// area and adds callouts. Scenes are optional for footage edits.") and its
// data notes (the desktop app keeps footage on your computer and uploads
// it only when a cloud AI step needs it; "Your projects stay yours and you
// can always export them"). The recording, its words and its lengths are
// illustrative.
export const productFootage = {
  eyebrow: "Footage",
  title: [{ text: "Your recording," }, { text: "minus the chores.", accent: true }],
  lead: "Drop in a talking head or a screen recording. KeyFly cuts the silences and filler words, adds captions, zooms on what matters and adds callouts. No storyboard needed.",
  note: "Illustrative recording",
  file: "founder-update.mov",
  // The recording: an illustrative 8 s silent loop, drawn on canvas in the
  // site's dusk room (source: scripts/footage-loop/; its pauses match the
  // transcript's). Replace it with a real recording when the team has one.
  video: { src: "/video/footage-loop.mp4", poster: "/video/footage-loop.webp" },
  pause: "Pause",
  play: "Play",
  transcriptLabel: "Transcript",
  // The recording's words in order. `filler` words are cut by pass 2;
  // `pause` entries (seconds) are closed by pass 1.
  words: [
    "So,", { filler: "um," }, "today", "I", "want", "to", "show", "you", { pause: 1.4 },
    "how", "the", "app", "keeps", "your", { filler: "uh," }, "streak", "alive.", { pause: 0.9 },
    { filler: "Like," }, "every", "morning", "you", "open", "it", "and", { filler: "you know," }, "just", "tap", "once.",
  ],
  caption: ["Every", "morning,", "just", "tap", "once."],
  callout: "Tap once",
  zoomTag: "Zoom on the speaker",
  // The length after each pass (two pauses, 2.3s; four filler words, about
  // 1.5s), and what each pass changed, for the transcript's log.
  lengths: ["0:48", "0:46", "0:44", "0:44", "0:44"],
  log: ["2 pauses closed · −2.3s", "4 filler words cut · −1.5s", "Captions on · 23 words", "1 zoom · 1 callout"],
  // The four passes, in the order KeyFly runs them.
  passes: [
    { id: "silences", name: "Silences", detail: "Long pauses closed" },
    { id: "fillers", name: "Filler words", detail: "Um, uh, like: cut" },
    { id: "captions", name: "Captions", detail: "Timed to every word" },
    { id: "zoom", name: "Zooms and callouts", detail: "On what matters" },
  ],
  // Where the footage goes (the app's own wording, shortened).
  data: {
    label: "Where your footage goes",
    items: [
      { title: "In the desktop app", body: "Your footage stays on your computer. It is uploaded only when a cloud AI step needs it." },
      { title: "Always", body: "Your projects stay yours, and you can always export them, even if you cancel." },
    ],
    link: { label: "Download for Mac or Windows", href: "/#download" },
  },
};

// "Brand": how a brand kit gets filled, and where it goes. From the app's
// Brand kits page ("Your logo, colours, font and voice in one place. New
// videos use the default kit automatically"; "Analyze with AI" fills a kit
// from your website; a kit holds a logo with its versions and banners, five
// colours, a font, a tone of voice and a voice-over, AI-chosen or your
// cloned voice) and its home page ("Suggested for you · Picked for {kit}.
// One click starts a video with your brand kit", with the SaaS launch film,
// App Store launch and Feature drop templates). Team plans share kits (the
// pricing API). The website, its brand and its values are illustrative.
export const productBrand = {
  eyebrow: "Brand",
  title: [{ text: "Paste your website." }, { text: "Get your brand kit.", accent: true }],
  lead: "Point KeyFly at your site and it reads your logo, colours, font and tone into a brand kit. From then on, every new video uses it automatically.",
  note: "Illustrative brand",
  pause: "Pause",
  play: "Play",
  site: {
    url: "habitly.io",
    analyze: "Analyze with AI",
    name: "habitly",
    nav: ["Features", "Pricing", "Blog"],
    headline: "Build the habit. Keep the streak.",
    sub: "One tap a day. Habitly keeps count, so you don't have to.",
    cta: "Start your streak",
    scanning: "Reading habitly.io",
  },
  kit: {
    label: "Brand kit",
    name: "Habitly",
    default: "Default",
    // The kit's fields, in the order the scan fills them.
    fields: [
      { id: "logo", label: "Logo", value: "Mark, wordmark, 2 versions, 3 banners" },
      { id: "colours", label: "Colours", value: "Five, from your site" },
      { id: "font", label: "Font", value: "Instrument Serif" },
      { id: "tone", label: "Tone of voice", value: "Warm, encouraging, plain-spoken" },
      { id: "voice", label: "Voice-over", value: "Bronwen, or clone your own" },
    ],
    done: "New videos use this kit automatically",
  },
  colours: ["#ff7a59", "#1e2a4a", "#fff4e6", "#ffc145", "#2bb3a3"],
  every: {
    label: "Every new video",
    videos: [
      { ratio: "16:9", w: 16, h: 9, title: "Keep the streak." },
      { ratio: "9:16", w: 9, h: 16, title: "One tap a day." },
      { ratio: "1:1", w: 1, h: 1, title: "Day 30." },
    ],
    suggested: { label: "Suggested for you", sub: "Picked for Habitly", items: ["SaaS launch film", "App Store launch", "Feature drop"] },
    team: "On a team, everyone shares the same kits.",
  },
};
