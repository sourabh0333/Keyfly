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

// "Use cases": the presets in the prompt box as six live feeds on a
// multicam switcher. The one on air plays on the program monitor, and
// "Try this prompt" hands its preset back to the hero's prompt box.
// PLACEHOLDER until the product description is confirmed.
export const useCases = {
  eyebrow: "Use cases",
  title: [{ text: "Made for" }, { text: "every kind of video.", accent: true }],
  lead: "Start from a preset or describe your own. Six of the videos people make most:",
  cta: "Try this prompt",
  file: "Presets",
  promptLabel: "Prompt",
  trackLabel: "P1",
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
  lead: "Keyfly runs on macOS, Windows and Linux. Or open it in your browser, with nothing to install.",
  // The installer window: its title, panel labels and the install's
  // three stages on the timeline (they run with the flight).
  window: {
    title: "Install",
    platformLabel: "Platform",
    stepLabel: "Step",
    trackLabel: "I1",
    stages: ["Download", "Install", "Open"],
  },
  detected: "Your system",
  soon: "Coming soon",
  browser: { label: "Open in your browser", href: siteConfig.appUrl },
  phone: "On a phone? Keyfly runs in the browser.",
  note: "Keyfly.si is a Cevrynt Inc. product",
  platforms: [
    { id: "macos", label: "macOS", target: "Applications", step: "Drag Keyfly to Applications to install.", href: null },
    { id: "windows", label: "Windows", target: "Desktop", step: "Run the installer and Keyfly is ready.", href: null }, // PLACEHOLDER step
    { id: "linux", label: "Linux", target: "Apps", step: "Install it and open Keyfly from your apps.", href: null }, // PLACEHOLDER step
  ],
};
