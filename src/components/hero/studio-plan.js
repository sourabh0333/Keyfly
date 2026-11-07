// Sketches a first plan from the visitor's prompt, in the browser, for the
// hero's studio. It is not KeyFly's AI: it reads a few plain things from the
// words (a product name or domain, a length, a shape, the kind of video) and
// lays out a storyboard in the shape the app's AI director replies with
// (storyboard, hook, voice, music, captions, look). The studio says so.

// The kinds follow six of the app's use-case types (as the hero's chips).
// Voices are the app's (its director's reply names Eyal, Bronwen, Elaine and
// Quinn); styles are the prompt box's motion styles. The stand-in footage is
// the site's own stock loops (public/video/cells/).
const KINDS = {
  launch: { type: "Launch film", style: "editorial", length: 30, voice: ["Eyal", "Bronwen"], tone: "calm and confident", music: "Minimal tech", bpm: 122 },
  ugc: { type: "UGC ad", style: "bold", length: 20, voice: ["Elaine", "Quinn"], tone: "warm and casual", music: "Upbeat pop", bpm: 118, shape: "9:16" },
  explainer: { type: "Explainer", style: "explainer", length: 60, voice: ["Bronwen", "Eyal"], tone: "calm and clear", music: "Soft pulse", bpm: 96 },
  event: { type: "Event promo", style: "bold", length: 30, voice: ["Quinn", "Eyal"], tone: "big and energetic", music: "Driving electronic", bpm: 128 },
  demo: { type: "Product demo", style: "explainer", length: 45, voice: ["Eyal", "Elaine"], tone: "clear and friendly", music: "Light corporate", bpm: 104 },
  podcast: { type: "Podcast clip", style: "warm", length: 30, voice: ["Your speaker"], tone: "the speaker's own voice", music: "No music under speech", bpm: 0, shape: "9:16" },
};

const DETECT = [
  ["podcast", /\b(podcast|episode|interview|talking head)/i],
  ["demo", /\b(demo|screen ?recording|walkthrough|tutorial|onboarding)/i],
  ["explainer", /\b(explain|explainer|how (it|our|the) .{0,20}works?)/i],
  ["event", /\b(event|conference|festival|meetup|summit|recap|webinar|concert|wedding)/i],
  ["ugc", /\b(ugc|selfie|creator|influencer|tiktok|testimonial)/i],
  ["launch", /\b(launch|release|announce|teaser|trailer|promo)/i],
];

const STOP = new Set(["our", "my", "the", "a", "an", "your", "new", "this", "that", "their", "it"]);

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/** The product's name and domain, if the prompt gives them. */
function nameFrom(text) {
  const domain = text.match(/\b([a-z0-9][a-z0-9-]{1,30})\.(io|com|app|ai|co|so|dev|si|net|org|xyz|tv|fm|me|studio)\b/i);
  if (domain) return { name: cap(domain[1].toLowerCase()), domain: domain[0].toLowerCase() };
  const called = text.match(/\b(?:for|called|named|introducing|meet)\s+([A-Z][\w-]{1,24})/);
  if (called && !STOP.has(called[1].toLowerCase())) return { name: called[1], domain: null };
  return { name: null, domain: null };
}

/** "our habit-tracking app" → "habit-tracking app". */
function subjectFrom(text) {
  const m = text.match(/(?:,|for)\s+(?:our|my|a|an|the)\s+(?:new\s+)?([a-z][a-z -]{2,32}?(?:app|tool|product|platform|brand|shop|store|service|game|course|studio|cafe|café|restaurant|startup|company|feature))\b/i);
  return m ? m[1].toLowerCase() : null;
}

function lengthFrom(text) {
  const min = text.match(/\b(\d{1,2})\s*-?\s*(?:min|mins|minute|minutes)\b/i);
  if (min) return Number(min[1]) * 60;
  const sec = text.match(/\b(\d{1,3})\s*-?\s*(?:s|sec|secs|second|seconds)\b/i);
  return sec ? Number(sec[1]) : null;
}

function shapeFrom(text) {
  if (/\b(vertical|9:16|reels?|tiktok|shorts|stories)\b/i.test(text)) return "9:16";
  if (/\b(square|1:1)\b/i.test(text)) return "1:1";
  if (/\b(4:5|portrait)\b/i.test(text)) return "4:5";
  if (/\b(16:9|landscape|youtube|widescreen)\b/i.test(text)) return "16:9";
  return null;
}

/** The scenes for each kind: a name, a layout the animatic draws, the words on
 * screen and the voice-over line (also the captions). */
function scenesFor(kind, { name, domain, subject, length }) {
  const N = name || "your product";
  const Nc = name || "Your product";
  const end = domain || (name ? `Try ${name}` : "Try it today");
  const thing = subject || "product";
  switch (kind) {
    case "ugc":
      return [
        { name: "Hook", layout: "footage", text: "Wait, you need to see this", vo: "Okay, you need to see this." },
        { name: "The problem", layout: "footage", text: `Before ${N}…`, vo: `This is me before ${N}.` },
        { name: "Show it", layout: "device", text: Nc, vo: `So I tried ${N}, and look.` },
        { name: "The moment", layout: "footage", text: "That's it. Really.", vo: "That's it. That's the whole thing." },
        { name: "Call to action", layout: "cta", text: end, vo: "Link's below. Go try it." },
        { name: "Reaction", layout: "footage", text: "Told you", vo: "Told you." },
      ];
    case "explainer":
      return [
        { name: "Question", layout: "title", text: `How does ${N} work?`, vo: `So how does ${N} actually work?` },
        { name: "Step 1", layout: "steps", step: 1, text: "Start in a sentence", vo: "First, you tell it what you need." },
        { name: "Step 2", layout: "steps", step: 2, text: "It does the heavy lifting", vo: "Then it takes care of the busywork." },
        { name: "Step 3", layout: "steps", step: 3, text: "You stay in control", vo: "And you can change anything, any time." },
        { name: "Call to action", layout: "cta", text: end, vo: `That's ${N}. Try it today.` },
        { name: "Recap", layout: "lines", text: "Simple, start to finish", vo: "Simple, start to finish." },
      ];
    case "event":
      return [
        { name: "Hook", layout: "footage", text: "Last year", vo: "Last year was something else." },
        { name: "Best moments", layout: "footage", text: "The best moments", vo: "The crowd. The music. The moments." },
        { name: "Speed ramp", layout: "footage", text: "All of it", vo: "All of it." },
        { name: "This year", layout: "title", text: name ? `${name} is back` : "It's back", vo: name ? `And this year, ${name} is back.` : "And this year, it's back." },
        { name: "Call to action", layout: "cta", text: domain || "Save your spot", vo: "Save your spot now." },
        { name: "Date", layout: "lines", text: "Save the date", vo: "Save the date." },
      ];
    case "demo":
      return [
        { name: "Intro", layout: "title", text: `${Nc} in ${length}s`, vo: `Here's ${N} in ${length} seconds.` },
        { name: "First click", layout: "device", zoom: true, text: "Start here", vo: "Everything starts here." },
        { name: "Zoom", layout: "device", zoom: true, text: "One click", vo: "One click, and it's done." },
        { name: "Result", layout: "lines", text: "Pauses trimmed, captions on", vo: "No waiting around." },
        { name: "Call to action", layout: "cta", text: end, vo: `Try ${N} yourself.` },
        { name: "Recap", layout: "lines", text: "That's the tour", vo: "That's the tour." },
      ];
    case "podcast":
      return [
        { name: "Cold open", layout: "footage", text: "“Here's the thing nobody tells you.”", vo: "Here's the thing nobody tells you." },
        { name: "The quote", layout: "quote", text: "“Start before you're ready.”", vo: "You start before you're ready." },
        { name: "Speaker", layout: "footage", text: "“That's the whole secret.”", vo: "That's the whole secret." },
        { name: "Call to action", layout: "cta", text: name ? `Full episode · ${name}` : "Full episode in bio", vo: "The full episode is out now." },
        { name: "Clip 2", layout: "quote", text: "“Nobody has it figured out.”", vo: "Nobody has it figured out." },
        { name: "Clip 3", layout: "footage", text: "“And that's fine.”", vo: "And that's fine." },
      ];
    default:
      return [
        { name: "Hook", layout: "title", text: name ? `Meet ${name}` : "Something new", vo: name ? `Meet ${name}.` : "Something new is here." },
        { name: "The idea", layout: "lines", text: subject ? `The ${thing} you'll actually use` : "Made for the way you work", vo: subject ? `The ${thing} you'll actually use.` : "Made for the way you work." },
        { name: "Product", layout: "device", text: Nc, vo: "Here's how it works." },
        { name: "Call to action", layout: "cta", text: end, vo: name ? `${name}. Try it today.` : "Try it today." },
        { name: "Feature", layout: "lines", text: "Built to be simple", vo: "Every part, built to be simple." },
        { name: "Moment", layout: "footage", text: "Ready when you are", vo: "Ready when you are." },
      ];
  }
}

// Where footage sits for each kind (a stand-in loop per footage scene).
const STAND_INS = {
  ugc: ["creator", "phone", "lake", "creator"],
  event: ["park", "meadow", "aerial", "park"],
  podcast: ["host", "host", "host"],
  launch: ["aerial"],
  explainer: [],
  demo: [],
};

/**
 * The plan: everything the studio shows. `files` are the visitor's own
 * media (object URLs), used in footage scenes before any stand-in.
 */
export function sketchPlan({ text, format, style, styles, files = [], force = {} }) {
  const words = text.trim() || "A short video";
  const kind = (DETECT.find(([, re]) => re.test(words)) || ["launch"])[0];
  const base = KINDS[kind];
  const { name, domain } = nameFrom(words);
  const subject = subjectFrom(words);
  const asked = lengthFrom(words);
  const length = force.length || Math.max(6, Math.min(180, asked || base.length));
  const promptShape = shapeFrom(words);
  const shape = force.shape || promptShape || (format.id !== "16:9" ? format.id : base.shape || "16:9");
  const shapeWhy = force.shape ? "You asked" : promptShape ? "From your prompt" : format.id !== "16:9" ? "Your pick" : base.shape ? `Made for ${base.type.toLowerCase()}s` : "Your pick";
  const lookId = force.look || (style.id === "ai" ? base.style : style.id);
  const look = styles.find((s) => s.id === lookId) || styles[1];

  const count = length <= 15 ? 4 : length <= 45 ? 5 : 6;
  const raw = scenesFor(kind, { name, domain, subject, length }).slice(0, count);
  // The call to action always closes the cut.
  const cta = raw.findIndex((s) => s.layout === "cta");
  const ordered = cta >= 0 ? [...raw.slice(0, cta), ...raw.slice(cta + 1), raw[cta]] : raw;

  // Footage scenes take the visitor's files first, then stand-ins.
  const media = files.filter((f) => f.kind === "video" || f.kind === "image");
  const stand = STAND_INS[kind];
  let used = 0;
  let stood = 0;
  const weights = ordered.map((s, i) => (i === 0 ? 0.8 : s.layout === "cta" ? 1.1 : 1));
  const total = weights.reduce((a, b) => a + b, 0);
  let at = 0;
  const scenes = ordered.map((scene, i) => {
    const dur = (weights[i] / total) * length;
    const start = at;
    at += dur;
    let footage = null;
    if (scene.layout === "footage" || (scene.layout === "quote" && kind === "podcast")) {
      if (media[used]) footage = { ...media[used++], own: true };
      else {
        const name = stand[stood++ % Math.max(1, stand.length)] || "aerial";
        footage = { kind: "video", url: `/video/cells/${name}.mp4`, poster: `/video/cells/${name}.webp`, own: false };
      }
    }
    return { ...scene, index: i, start, dur, footage };
  });

  const title = name ? `${name} · ${base.type}` : base.type;
  const ownCount = scenes.filter((s) => s.footage?.own).length;
  const standCount = scenes.filter((s) => s.footage && !s.footage.own).length;

  const notes = [
    { id: "storyboard", label: "Storyboard", value: `${scenes.length} scenes · ${fmt(length)}`, detail: scenes.map((s) => s.name).join(" → ") },
    { id: "hook", label: "Hook", value: `Opens on “${scenes[0].text.replace(/[“”]/g, "")}”` },
    {
      id: "voice",
      label: "Voice-over",
      value: kind === "podcast" ? "Your speaker's own voice" : `${base.voice[0]}, ${base.tone}`,
      detail: kind === "podcast" ? "Silences and filler words cut" : `Also fits: ${base.voice.slice(1).concat(["Quinn", "Elaine"]).filter((v, i, a) => v !== base.voice[0] && a.indexOf(v) === i).slice(0, 2).join(", ")}`,
    },
    { id: "music", label: "Music", value: base.bpm ? `${base.music} · ${base.bpm} bpm` : base.music, detail: base.bpm ? "Licensed for you" : null },
    { id: "captions", label: "Captions", value: "Word by word, on every line" },
    { id: "look", label: "Look", value: look.label, detail: force.look ? "You asked" : look.note, assumed: style.id === "ai" && !force.look },
    { id: "shape", label: "Shape", value: shape, detail: shapeWhy },
  ];
  if (ownCount) notes.push({ id: "footage", label: "Footage", value: `${ownCount} of your files`, detail: "Played right here, in your browser" });
  else if (standCount) notes.push({ id: "footage", label: "Footage", value: "Stand-in shots for now", detail: "Drop your own footage to see it here" });

  return { kind, type: base.type, name, domain, title, length, shape, look, scenes, notes, prompt: words };
}

export { fmt };
