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
