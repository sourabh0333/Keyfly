import { siteConfig } from "@/config/site";
import { categories } from "./use-cases";

// Homepage copy. Facts come from the KeyFly app (read 2026-11-03) and the
// team. No line is marked PLACEHOLDER any more, so the page is open to
// search (2026-11-09; see siteConfig.indexable).

// The page's title and description in search results and shares
// (2026-11-09, from the SEO audit): the title names the category and where
// it runs (53 characters); the description fits before Google cuts it off
// and names the three things only KeyFly offers together (130 characters).
export const homeMeta = {
  title: "KeyFly · AI video editor for Mac, Windows and the web",
  description:
    "Describe a video or drop in footage. KeyFly edits it on a timeline, works with your own Claude or Codex, and exports to Final Cut.",
};

// The promise (2026-11-04): KeyFly makes the video from a sentence, and
// unlike closed AI editors it lets you finish it your way: your own AI
// agents, your own editing app, on Mac, Windows or the web.
export const hero = {
  eyebrow: "The AI video editor, your way",
  // Each line is a list of words; `accent` words are set in the serif italic.
  title: [
    [{ text: "Describe" }, { text: "the" }, { text: "video." }],
    [{ text: "Take", accent: true }, { text: "it", accent: true }, { text: "anywhere.", accent: true }],
  ],
  lead: "KeyFly turns a sentence or your footage into an edited video, then lets you finish it your way.",
  // Footage on the timeline floor's video tracks: single-shot loops cut
  // from real stock clips (scripts/pricing-cells/, as on the Pricing hero).
  // Each video clip shows a still of one; the clips under the playhead play
  // theirs. Illustrative.
  floor: {
    films: ["lake", "aerial", "host", "meadow", "park", "creator", "phone"].map((name) => ({
      src: `/video/cells/${name}.mp4`,
      poster: `/video/cells/${name}.webp`,
    })),
    pause: "Pause the timeline",
    play: "Play the timeline",
  },
  // The three things it doesn't lock you into, between the lead and the
  // prompt box. Each points to where the page shows it.
  proof: [
    { label: "Mac · Windows · Web", href: "#tools" },
    { label: "Your own Claude, Codex or Cursor", href: "#tools" },
    { label: "Hands off to Final Cut, Resolve, Premiere", href: "#tools" },
  ],
};

// The prompt box, as it appears in the KeyFly app's "New video" box (read
// from the app on 2026-11-03: its placeholder, Add media, the aspect ratios,
// the motion styles, the brand kit picker, Enhance, Create and Blank
// project).
export const prompt = {
  label: "Describe your video",
  placeholder: "e.g. A 30s launch film for habitly.io, our habit-tracking app.",
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
  // Starting points: six of the app's use-case types (its Templates page's
  // "Any use case" filter, read 2026-11-05; the app's New video box no
  // longer has preset chips). Clicking one writes the site's example prompt
  // for it into the box.
  presets: [
    { label: "Launch film", prompt: "A 30-second launch film for our new app: bold title cards, quick cuts on the beat and a clear call to action at the end." },
    { label: "UGC ad", prompt: "A selfie-style UGC ad, vertical, with punchy captions, a hook in the first two seconds and natural jump cuts." },
    { label: "Explainer", prompt: "A 60-second explainer that walks through how our product works, with simple animated callouts and a calm voiceover." },
    { label: "Event promo", prompt: "An event promo from last year's footage: the best moments cut to the music, speed ramps, the date and a sign-up call to action." },
    { label: "Product demo", prompt: "A product demo from my screen recording: zoom into each click, add short captions and trim the pauses." },
    { label: "Podcast clip", prompt: "Turn my podcast episode into three vertical clips with the strongest quotes, speaker framing and captions." },
  ],
  // Create opens this studio over the page instead of sending people away
  // (2026-11-07, the team's request). It is laid out like the app's editor
  // (read from the app the same day: its header, menus, panels, player bar,
  // storyboard, timeline and AI director panel, and its sign-up card). The
  // plan is sketched from the prompt in the browser; nothing plays, and
  // pressing play asks them to sign up.
  studio: {
    label: "Preview",
    saved: "Saved",
    menus: ["File", "Edit", "Clip", "View", "Help"],
    edit: "Edit",
    noBrandKit: "No brand kit",
    share: "Share",
    export: "Export",
    close: "Close",
    tabs: [
      { id: "media", label: "Media" },
      { id: "text", label: "Text" },
      { id: "graphics", label: "Graphics" },
      { id: "transitions", label: "Transitions" },
    ],
    drop: "Drop video, images or audio",
    dropNote: "or click to choose",
    play: "Play the preview",
    storyboard: "Storyboard",
    scenes: "scenes",
    curves: "Curves",
    allTracks: "Show all tracks",
    split: "Split",
    track: "Track",
    snap: "Snap",
    tracks: { scenes: "Scenes", transitions: "Transitions", video: "Video", voice: "Voice-over", music: "Music" },
    director: "AI director",
    aspect: "Aspect ratio",
    planning: "Planning",
    sketched: "Sketched from your words",
    reply: {
      built: "Planned",
      hook: "Hook: opens on",
      voice: "Voice:",
      music: "Music:",
      look: "Look:",
      assumed: "Assumed:",
      storyboard: "Storyboard:",
      next: "Next: press play to make it.",
    },
    revert: "Revert",
    retry: "Retry",
    composer: "What should we change? (@ to mention, / for commands)",
    send: "Send",
    enhance: "Enhance",
    cloud: "Cloud",
    auto: "Auto",
    signup: `${siteConfig.appUrl}/signup?plan=free`,
    signIn: `${siteConfig.appUrl}/login`,
    gate: {
      back: "Back to the preview",
      ready: "ready to make",
      title: "Create your account",
      trial: "Every new account starts with a 7-day Creator trial, no card.",
      continueWith: "Continue with",
      providers: ["Google", "GitHub", "LinkedIn"],
      or: "or with email",
      email: "Continue with email",
      have: "Already have an account?",
      signIn: "Sign in",
      legal: ["By continuing you agree to the ", "Terms of Service", " and ", "Privacy Policy", "."],
      company: "KeyFly.si is a Cevrynt Inc. product",
    },
  },
  // "or make it in …". These open the section that explains it until the
  // apps have their own install links (the KeyFly app shows none yet).
  elsewhere: [
    { label: "ChatGPT", href: "#tools" },
    { label: "Claude", href: "#tools" },
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
    { title: "Share or hand off", body: "Send a review link for comments and approval, export in 16:9, 9:16, 1:1 or 4:5 up to 4K, or hand the timeline to Final Cut, Resolve or Premiere." },
  ],
  // What the illustrative editor shows.
  demo: {
    file: "Launch Video",
    prompt: presetPrompt("Launch film"),
    // KeyFly's notes in the side panel, ticked off as the playhead passes.
    plan: ["Found 6 shots", "Cut on the beat", "Added title cards", "Wrote captions"],
    // The title and caption on the viewer, one per shot.
    // Each shot plays a real stock loop (scripts/how-shots/, Mixkit clips
    // 4837, 1711 and 41375, Mixkit Stock Video Free License); the titles and
    // captions are laid over it. Illustrative.
    shots: [
      { title: "Launch day", caption: "Meet the new app", film: { src: "/video/how-shot-1.mp4", poster: "/video/how-shot-1.webp" } },
      { title: "Built for speed", caption: "Everything in one place", film: { src: "/video/how-shot-2.mp4", poster: "/video/how-shot-2.webp" } },
      { title: "Try it today", caption: "Available now", film: { src: "/video/how-shot-3.mp4", poster: "/video/how-shot-3.webp" } },
    ],
    formats: ["16:9", "9:16", "1:1", "4:5"],
    note: "Illustrative interface · Real stock footage",
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
  lead: "Describe a video and KeyFly writes the storyboard, records the voice-over, builds the motion graphics and lays in licensed music, each on its own track you can change.",
  // A link from the lead to the page that covers this in depth.
  more: { label: "What goes in, and every layer that comes out", href: "/product#make" },
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
  // A link from the lead to the page that covers this in depth.
  more: { label: "How KeyFly cleans up a recording", href: "/product#footage" },
  note: "Illustrative · Real stock footage",
  // A real talking-head recording (scripts/footage-home/, from Mixkit clip
  // 10457, Mixkit Stock Video Free License), the same 8 s twice: as shot,
  // for "By hand", and graded, for "With KeyFly". Illustrative: the
  // captions and edits laid over it are the site's.
  footage: {
    raw: { src: "/video/footage-raw.mp4", poster: "/video/footage-raw.webp" },
    cut: { src: "/video/footage-cut.mp4", poster: "/video/footage-cut.webp" },
  },
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
  // A link from the lead to the page that covers this in depth.
  more: { label: "Steer a template with words", href: "/use-cases#template-to-video" },
  barLabel: "Ask KeyFly to change the cut",
  note: "Illustrative interface · Real stock footage",
  // The cut on both sides: an illustrative event promo from three real
  // stock clips (scripts/edit-montage/, Mixkit 4188, 42299 and 4064, Mixkit
  // Stock Video Free License), saved flat for Before and graded for After.
  films: {
    before: { src: "/video/edit-before.mp4", poster: "/video/edit-before.webp" },
    after: { src: "/video/edit-after.mp4", poster: "/video/edit-after.webp" },
  },
  edits: [
    { id: "shorter", ask: "Make it shorter", reply: "Trimmed to 0:30 · kept the strongest takes" },
    { id: "pauses", ask: "Cut the pauses", reply: "Removed 4 pauses · 6 seconds tighter" },
    { id: "captions", ask: "Add captions", reply: "Captions on · word by word" },
    { id: "warm", ask: "Warmer colours", reply: "Graded warm · across every shot" },
    { id: "vertical", ask: "Make it vertical", reply: "Reframed to 9:16 · subject kept in frame" },
    { id: "pace", ask: "Faster pace", reply: "Recut on the beat · 8 cuts became 15" },
  ],
};

// "You make the calls": the AI director's note on the cut it built. From
// the KeyFly editor (read 2026-11-04): after each build the AI director
// replies with what it chose ("Hook: opens on 'Describe a video. Get a
// video.'", "Voice: Eyal, calm, confident, premium (also fits: Bronwen,
// Elaine, Quinn)", "Calm, modern, minimal electronic with a soft pulse
// music bed"), what it assumed (the look), a self-check (3.4/5) and
// "Next:" ideas, with Revert and Retry ("Cloud · Worked for 43s · 18
// steps"). The other hook and music options are illustrative; the looks
// are the app's motion styles.
export const yourCall = {
  eyebrow: "You make the calls",
  title: [{ text: "KeyFly decides." }, { text: "You have the final say.", accent: true }],
  lead: "No black box. After every edit the AI director tells you what it chose and why, what else would fit and what it would try next. Change any call, or revert it in one click.",
  // A link from the lead to the page that covers this in depth.
  more: { label: "Read the AI director’s notes", href: "/product#direct" },
  note: "Illustrative interface · Real stock footage",
  report: {
    from: "AI director",
    meta: "Cloud · worked for 43s · 18 steps",
    prompt: "A 30-second launch film for our new app.",
    built: "Built",
    name: "Launch Video",
  },
  pickLabel: "KeyFly's pick",
  changedLabel: "Your call",
  assumedLabel: "Assumed",
  // In the order the note lists them. Each option's index also picks what
  // the preview shows (see DirectorNote).
  decisions: [
    { id: "hook", label: "Hook", why: "Opens on the whole idea in one line: “Describe a video. Get a video.”", options: ["Title line", "Product demo", "Quick montage"], pick: 0 },
    { id: "voice", label: "Voice", why: "Calm, confident and premium, as you asked.", options: ["Eyal", "Bronwen", "Elaine", "Quinn"], pick: 0 },
    { id: "music", label: "Music", why: "Calm, minimal electronic with a soft pulse, kept under every word.", options: ["Soft pulse", "Upbeat", "No music"], pick: 0 },
    { id: "look", label: "Look", assumed: true, why: "Near-black with a mint accent, read from your prompt.", options: ["Midnight Tech", "Editorial Minimal", "Warm Lifestyle"], pick: 0 },
  ],
  check: { label: "Self-check", score: 3.4, of: 5 },
  next: { label: "Next", items: ["Open on the prompt typing", "Warmer voice in scene 3", "Try a 9:16 cut for Reels"] },
  revert: "Revert",
  retry: "Retry",
  preview: {
    label: "The cut",
    updated: "Updated",
    voiceOver: "Voice-over",
    noMusic: "No music",
    // The opening shot for each hook option, for a launch film of KeyFly
    // itself: real stock loops (scripts/call-hooks/, Mixkit 41161, 44737,
    // 100079, 4911, 39774 and 43259, Mixkit Stock Video Free License), with
    // KeyFly keyed onto the green screens. The title line is laid over the
    // first.
    titleLine: ["Describe a video.", "Get a video."],
    hooks: [1, 2, 3].map((n) => ({ src: `/video/call-hook-${n}.mp4`, poster: `/video/call-hook-${n}.webp` })),
  },
};

// "One edit, every format": one cut in each shape. The four shapes are the
// app's ("Frame shape" in the editor: 16:9, 9:16, 1:1, 4:5), and its export
// sheet has presets for TikTok, Reels, YouTube, Shorts, LinkedIn and X.
// The app doesn't say how it recomposes a shot, so the copy doesn't either.
export const everyFormat = {
  eyebrow: "One edit, every format",
  title: [{ text: "One edit." }, { text: "Every screen.", accent: true }],
  lead: "Make the cut once, then switch its frame shape. Export it for TikTok, Reels, YouTube, Shorts, LinkedIn or X, in up to 4K.",
  // A link from the lead to the page that covers this in depth.
  more: { label: "Every export option", href: "/product#deliver" },
  note: "Illustrative interface · Real stock footage",
  formatLabel: "Format",
  madeFor: "Made for",
  keeps: { label: "KeyFly keeps", items: ["The same cut and timing", "Your voice-over and music", "Your brand kit"] },
  bar: "Formats",
  captions: ["Your", "story,", "cut", "in", "seconds"],
  // The cut being reframed: a real stock loop of a creator filming herself
  // as she walks (scripts/format-loop/, Mixkit 34468, Mixkit Stock Video
  // Free License). Illustrative.
  film: { src: "/video/format-loop.mp4", poster: "/video/format-loop.webp" },
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
  // A link from the lead to the page that covers this in depth.
  more: { label: "How the brand kit fills itself", href: "/product#brand" },
  note: "Illustrative interface · Real stock footage",
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
  // Illustrative videos, each in its own shape, each a real stock loop
  // (scripts/brand-tiles/, Mixkit 100319, 50423, 2957, 4623, 1787 and 4185,
  // Mixkit Stock Video Free License) with the kit laid over it.
  videos: [
    { kind: "launch", ratio: "16:9", w: 16, h: 9, title: "Launch day", label: "Launch film" },
    { kind: "ugc", ratio: "9:16", w: 9, h: 16, title: "Real results", label: "UGC ad" },
    { kind: "podcast", ratio: "1:1", w: 1, h: 1, title: "Episode 12", label: "Podcast clip" },
    { kind: "explainer", ratio: "16:9", w: 16, h: 9, title: "How it works", label: "Explainer" },
    { kind: "demo", ratio: "4:5", w: 4, h: 5, title: "New: Publish", label: "Product demo" },
    { kind: "montage", ratio: "16:9", w: 16, h: 9, title: "Highlights", label: "Event promo" },
  ].map((video) => ({ ...video, film: { src: `/video/brand/${video.kind}.mp4`, poster: `/video/brand/${video.kind}.webp` } })),
};

// "Open by design" (2026-11-04; it merges "Works where you work" and "Works
// with your tools"): where KeyFly runs, the AI that edits, and the editors
// the timeline goes to. From the KeyFly app (read 2026-11-03): the desktop
// builds (app.keyfly.si/download), the ChatGPT and Claude apps (confirmed
// by the team on 2026-11-02; the project then opens in KeyFly and syncs:
// "everything syncs when you're back"), the AI picker (Cloud, or your own
// agents), Settings → Agents, and the export sheet's "Timeline for other
// editors" and "Package for editing". The ask and reply in the middle are
// illustrative.
export const tools = {
  eyebrow: "Open by design",
  title: [{ text: "Your computer. Your AI." }, { text: "Your editor.", accent: true }],
  lead: "KeyFly doesn't lock you in. Run it on Mac, Windows or the web, or start in ChatGPT and Claude. Edit with the AI you already pay for, then hand the timeline to the editor you already use.",
  // A link from the lead to the page that covers this in depth.
  more: { label: "Every AI agent and editor KeyFly works with", href: "/integrations" },
  note: "Illustrative interface",
  on: {
    index: "01",
    kicker: "Run it on",
    // `href` null: no install link yet (see prompt.elsewhere).
    options: [
      { id: "mac", name: "macOS", note: "Desktop app · Apple silicon and Intel", href: "#download" },
      { id: "windows", name: "Windows", note: "Desktop app · Windows 10 and 11", href: "#download" },
      { id: "web", name: "Web", note: "app.keyfly.si · nothing to install", href: siteConfig.appUrl },
      { id: "chatgpt", name: "ChatGPT", note: "Start a video in the chat", href: null },
      { id: "claude", name: "Claude", note: "Start a video in the chat", href: null },
    ],
    foot: "One project everywhere: start it in a chat, finish it on your desktop. Everything syncs when you're back online.",
  },
  in: {
    index: "02",
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
    index: "03",
    kicker: "Finish in your editor",
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
  // A link from the lead to the page that covers this in depth.
  more: { label: "Templates for your role", href: "/use-cases#by-role" },
  note: "Illustrative previews · Real stock footage",
  makes: "Makes",
  formatsLabel: "Formats",
  promptLabel: "Try",
  try: "Try this prompt",
  // Each role's film is a real stock loop in the role's own shape
  // (scripts/audience-films/, Mixkit 1817, 42650, 34485 and 44048, Mixkit
  // Stock Video Free License); `at` centres a wide film's crop, and `back`
  // is the blurred still around a 9:16 film.
  roles: [
    { id: "marketers", name: "Marketers & founders", line: "Launch films, social ads and event promos, from one sentence or your own footage.", presets: ["Launch film", "Event promo"], formats: ["16:9", "9:16"], film: { src: "/video/audience/marketers.mp4", poster: "/video/audience/marketers.webp", at: "62% 35%" }, prompt: presetPrompt("Launch film") },
    { id: "product", name: "Product & SaaS teams", line: "Walkthroughs, explainers and screen-recording demos, with zooms and callouts.", presets: ["Product demo", "Explainer"], formats: ["16:9", "1:1"], film: { src: "/video/audience/product.mp4", poster: "/video/audience/product.webp", at: "45% 92%" }, prompt: presetPrompt("Product demo") },
    { id: "creators", name: "Creators", line: "UGC ads and scroll-stopping hooks, captioned and cut for vertical.", presets: ["UGC ad"], formats: ["9:16"], film: { src: "/video/audience/creators.mp4", poster: "/video/audience/creators.webp", back: "/video/audience/creators-back.webp" }, prompt: presetPrompt("UGC ad") },
    { id: "podcasters", name: "Podcasters", line: "Episodes and talking heads cut into clips, with silences and filler words removed.", presets: ["Podcast clip"], formats: ["9:16"], film: { src: "/video/audience/podcasters.mp4", poster: "/video/audience/podcasters.webp", back: "/video/audience/podcasters-back.webp" }, prompt: presetPrompt("Podcast clip") },
  ],
};

export const useCases = {
  eyebrow: "Use cases",
  title: [{ text: "Pick a use case." }, { text: "Make it yours.", accent: true }],
  lead: "Six of the twenty kinds of video KeyFly's templates are made for, each with a prompt to start from. Or describe your own.",
  // A link from the lead to the page that covers this in depth.
  more: { label: "Browse all 91 templates", href: "/use-cases#categories" },
  cta: "Try this prompt",
  dialLabel: "Use case",
  // "8 templates", counted from the app's templates (src/content/use-cases.js).
  templatesLink: { label: "{n} templates", href: "/use-cases#categories" },
  hint: { live: "Scroll or drag to turn", still: "Drag or click to turn" },
  promptLabel: "Prompt",
  note: "Illustrative previews · Real stock footage",
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
  // Six of the app's use-case types, each with the site's example prompt,
  // the number of the app's templates of that type and its film: real stock
  // footage cut in its shape with that use case's edit set in
  // (scripts/case-films/, Mixkit Stock Video Free License).
  items: [
    { label: "Launch film", kind: "launch", format: "16:9", body: "Title cards, quick cuts on the beat and a clear call to action at the end." },
    { label: "UGC ad", kind: "ugc", format: "9:16", body: "Selfie-style ads with a hook in the first two seconds and punchy captions." },
    { label: "Explainer", kind: "explainer", format: "16:9", body: "Walk people through how something works, with simple callouts and a calm voiceover." },
    { label: "Event promo", kind: "montage", format: "16:9", body: "The best moments from your footage, cut to the music, with the date and a way to sign up." },
    { label: "Product demo", kind: "demo", format: "16:9", body: "Screen recordings with a zoom on every click, short captions and the pauses trimmed." },
    { label: "Podcast clip", kind: "podcast", format: "9:16", body: "Long episodes turned into vertical clips with the strongest quotes and captions." },
  ].map((item) => ({
    ...item,
    prompt: presetPrompt(item.label),
    templates: templatesOfType(item.label),
    film: { src: `/video/cases/${item.kind}.mp4`, poster: `/video/cases/${item.kind}.webp` },
  })),
};

function presetPrompt(label) {
  return prompt.presets.find((preset) => preset.label === label).prompt;
}

function templatesOfType(type) {
  return categories.reduce((n, category) => n + category.templates.filter((t) => t.type === type).length, 0);
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
      link: { label: "Open by design", href: "#tools" },
    },
    {
      // The app's AI picker and Settings → Agents.
      q: "Can I use my own AI agents?",
      a: "Yes. Connect Claude Code, Codex, Cursor, Antigravity or any other ACP agent through the KeyFly desktop app, and it edits with your own plan, without using your AI minutes. Or let KeyFly Cloud pick the best model for each step.",
      link: { label: "Bring your own agent", href: "/integrations#agents" },
    },
    {
      // The app's AI director takes changes in chat ("What should we change?",
      // with Revert), and every clip is on an editable timeline.
      q: "Can I change the video after KeyFly edits it?",
      a: "Yes. Ask the AI director for changes in plain words, like “make the intro faster”, and undo any AI change with one click. Or change it yourself on the timeline.",
      link: { label: "Edit with words", href: "#edit" },
    },
    {
      // The app's help: with a recording, KeyFly cuts silences and filler
      // words, adds captions, zooms on the focus area and adds callouts.
      q: "Can KeyFly edit footage I shot myself?",
      a: "Yes. Drop in a talking head, a screen recording or your own clips, and KeyFly cuts the silences and filler words, adds captions, and zooms in and adds callouts where they help.",
      link: { label: "How KeyFly cleans up a recording", href: "/product#footage" },
    },
    {
      // Follows from the app: a sentence starts a video, changes are asked
      // for in plain words, and every clip is on an editable timeline.
      q: "Do I need video editing experience?",
      a: "No. Describe the video in a sentence, or pick one of 91 templates, and ask for changes in plain words. If you do know editing, every layer is a real track on the timeline, and you can take the cut to Final Cut, Resolve, Premiere or Avid.",
      link: { label: "Browse the templates", href: "/use-cases" },
    },
    {
      // The plans' features in the pricing API: AI images and AI
      // voice-overs (Starter), generated video and voice cloning (Creator
      // and up); the editor's Audio panel makes music beds and sound
      // effects, "Licensed for you".
      q: "What can KeyFly's AI make?",
      a: "The storyboard, voice-over and motion graphics for every video, plus AI images, music beds and sound effects (licensed for you). Higher plans add generated video and a clone of your own voice.",
      link: { label: "What KeyFly makes", href: "#makes" },
    },
    {
      q: "Can KeyFly keep my videos on brand?",
      a: "Yes. A brand kit holds your logo, colours, font and voice, and KeyFly can fill it from your website. Every new video uses your default kit automatically.",
      link: { label: "On brand, every time", href: "#brand" },
    },
    {
      // The editor's Share button: "Share for review. Anyone with the link
      // can watch, comment at a moment, approve or ask for changes. They
      // can't edit anything."
      q: "How do I get feedback on a video?",
      a: "Share it for review. Anyone with the link can watch it, comment at a moment, and approve it or ask for changes, without being able to edit anything.",
      link: { label: "How it works", href: "#product" },
    },
    {
      // The Team and Enterprise plans in the pricing API.
      q: "Can my team use KeyFly together?",
      a: "Yes. The Team plan shares brand kits and a library across your team, with roles and comments and one bill. Enterprise adds SSO and SCIM, a DPA and data residency.",
      link: { label: "Pricing", href: "#pricing" },
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
      a: "You can start free and upgrade when you need more AI minutes. Every plan, with its price and what it includes, is on the pricing page.",
      link: { label: "Every plan", href: "/pricing" },
    },
    {
      // The pricing API's own wording ("AI minutes", never "credits"), and
      // its packs.
      q: "What are AI minutes?",
      a: "The time KeyFly's AI spends building and editing your videos. They count only while the AI is working, so changes you make yourself on the timeline use none. Plans come with AI minutes every month, and packs add more when you need them.",
      link: { label: "AI minutes explained", href: "/pricing#minutes" },
    },
    {
      // The app's Help page: its answers, "Take the tour", and "Contact us:
      // We answer within one working day" (help@keyfly.si).
      q: "How do I get help?",
      a: "Open Help in the KeyFly app for answers and a tour of the editor, or email help@keyfly.si. The team answers within one working day.",
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
  // A link from the lead to the page that covers this in depth.
  more: { label: "Compare every plan", href: "/pricing#compare" },
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
