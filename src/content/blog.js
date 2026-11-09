import { siteConfig } from "@/config/site";
import { plainText } from "@/components/inline-text";

// The blog: guides and workflows for making video with KeyFly.
//
// Every post is built only from what the KeyFly app, its help, its export
// sheet and the pricing API state (the same facts the rest of the site
// uses). No customers, results or numbers are invented, and prices are
// never typed in: posts link to /pricing, which reads the pricing API.
// The covers are the site's own illustrative stock reels.
//
// `seoTitle` (optional) is the shorter title for search results and the
// browser tab, when the headline runs past about 50 characters.
//
// Inline markup: [label](href), **bold**, `App name` (mono), as InlineText.
// Blocks: a string (paragraph), { list }, { steps: [[title, text]] },
// { table: { head, rows } }, { tip } (an "In KeyFly" note), { quote }.

const author = { name: `${siteConfig.name} team` };

export const blogPage = {
  path: "/blog",
  meta: {
    title: "Blog: AI video editing guides and workflows",
    description:
      "Guides and workflows for making video with KeyFly: AI minutes, your own AI agent, handing off to Final Cut Pro and Resolve, brand kits and export settings.",
  },
  eyebrow: "Blog",
  title: [{ text: "Notes from" }, { text: "the edit.", accent: true }],
  lead: "Guides and workflows for making video with KeyFly, from the first sentence to the final export. Written by the team that builds it.",
  rss: { label: "RSS feed", href: "/blog/rss.xml" },
  featuredLabel: "Now playing",
  read: "Read the post",
  topicsLabel: "Topics",
  all: "All posts",
  view: { label: "View", grid: "Grid", list: "List" },
  columns: { title: "Title", topic: "Topic", length: "Read", date: "Published" },
  empty: "No posts in this topic yet.",
  coverNote: "Illustrative · Real stock footage",
};

export const topics = [
  { id: "guides", label: "Guides", line: "How KeyFly works, part by part." },
  { id: "workflows", label: "Workflows", line: "KeyFly with the tools you already use." },
  { id: "product", label: "Product", line: "Features, explained." },
];

const posts = [
  {
    slug: "what-is-an-ai-minute",
    topic: "guides",
    date: { iso: "2026-11-09", text: "9 November 2026" },
    title: "What an AI minute is, and what it never is",
    dek: "KeyFly measures the AI's work in one unit. Here's what counts, what never does, and how to see the cost before anything runs.",
    cover: { video: "/video/coffee-reel.mp4", poster: "/video/coffee-reel.webp", alt: "Latte art being poured into a cup" },
    sections: [
      {
        id: "one-unit",
        title: "One unit for the AI's work",
        blocks: [
          "Most AI video tools sell credits, and few say what a credit buys. KeyFly uses one unit with a plain definition: **AI minutes are what KeyFly's cloud AI uses** for building, editing, voice, captions and images.",
          "They count only the AI's actual work. Idle time, waiting and time on the clock never count, so leaving a project open costs nothing.",
        ],
      },
      {
        id: "what-counts",
        title: "What counts",
        blocks: [
          "AI minutes are used when KeyFly's own AI does the work:",
          {
            list: [
              "**Building a video** from a sentence, your footage or a template.",
              "**Editing with KeyFly's AI**: every ask in the chat, such as \"Make the intro faster\".",
              "**AI voice-overs**, including a cloned voice on the plans that have cloning.",
              "**Captions.**",
              "**AI images** made for the scenes that need them.",
            ],
          },
          "Generated video has its own allowance, in seconds, on the plans that include it. The [pricing page](/pricing#compare) lists it plan by plan.",
        ],
      },
      {
        id: "never-counts",
        title: "What never counts",
        blocks: [
          {
            list: [
              "**Editing by hand.** Trimming, moving and deleting on the timeline is yours, and free.",
              "**Your own AI agent.** Claude Code, Codex, Cursor and other agents edit with your own plan with their provider, [without using your AI minutes](/blog/edit-video-with-claude-code-codex-cursor).",
              "**Exporting.** Videos are encoded on your device. Nothing is uploaded.",
              "**Waiting.** Idle time and time on the clock.",
            ],
          },
        ],
      },
      {
        id: "cost-first",
        title: "You see the cost before it runs",
        blocks: [
          "Each AI action shows its cost before it runs, so you decide whether it's worth it. And if a job fails, its AI minutes come back automatically.",
          { tip: "The AI director's reply ends with what it used, for example `Used 6 AI minutes`, beside `Revert` and `Retry`." },
        ],
      },
      {
        id: "a-session",
        title: "A session, minute by minute",
        blocks: [
          "Here's how one illustrative session adds up:",
          {
            table: {
              head: ["Step", "Who does it", "AI minutes"],
              rows: [
                ["Build the first cut", "KeyFly's AI", "4"],
                ["Trim it on the timeline", "You", "0"],
                ["\"Make the intro faster\"", "KeyFly's AI", "2"],
                ["Make the next pass", "Your Claude Code", "0"],
                ["Export to MP4", "Your computer", "0"],
              ],
            },
          },
          "Six AI minutes for a finished video, with the hand edits, the agent's pass and the export free. The numbers are illustrative; the rule is the point.",
        ],
      },
      {
        id: "more",
        title: "When you need more",
        blocks: [
          "Every paid plan includes AI minutes each month, and you can add an AI-minute pack at any time. Bigger packs carry bonus minutes, so each minute costs less. The [pricing page](/pricing#minutes) shows every plan's minutes and every pack, with its price per minute.",
        ],
      },
    ],
  },
  {
    slug: "export-timeline-to-final-cut-resolve-premiere-avid",
    topic: "workflows",
    date: { iso: "2026-11-09", text: "9 November 2026" },
    title: "Hand off a KeyFly cut to Final Cut Pro, Resolve, Premiere or Avid",
    seoTitle: "Export to Final Cut Pro, Resolve, Premiere and Avid",
    dek: "Finish in the editor you know. Which timeline format each editor opens, and how Package for editing brings every file along.",
    cover: { video: "/video/road-reel.mp4", poster: "/video/road-reel.webp", alt: "An aerial shot of a road at sunset" },
    sections: [
      {
        id: "why",
        title: "Why hand off at all",
        blocks: [
          "KeyFly makes the first cut, and you can finish there. But sometimes the last mile belongs in another editor: a colourist's grade, a client's house template, or an editor who lives in Avid. KeyFly doesn't lock the timeline in. It exports it, with every file it uses.",
        ],
      },
      {
        id: "formats",
        title: "Three timeline formats",
        blocks: [
          "The export sheet's **Timeline for other editors** writes three formats:",
          {
            table: {
              head: ["Format", "Opens in"],
              rows: [
                ["FCPXML", "Final Cut Pro, and DaVinci Resolve"],
                ["EDL (CMX 3600)", "Premiere Pro, DaVinci Resolve and Avid"],
                ["OpenTimelineIO (.otio)", "DaVinci Resolve, and pipelines that read OTIO"],
              ],
            },
          },
          "Resolve opens all three. Final Cut Pro wants FCPXML; Premiere Pro and Avid take EDL.",
        ],
      },
      {
        id: "package",
        title: "Package for editing: the timeline and every file",
        blocks: [
          "A timeline on its own points at media your editor doesn't have. **Package for editing** solves that: a .zip with a folder per editor, each holding the timeline plus every file it uses (footage, voice-over, music, pictures), linked by relative paths so it opens with its media.",
          {
            steps: [
              ["Open the export sheet", "Choose `Package for editing`."],
              ["Pick your editor", "`Final Cut Pro`, `EDL` or `OpenTimelineIO`. Each format's folder has its own copy of the media, so pick just one for a smaller file."],
              ["Choose graphics", "Switch on `Include graphics, titles and captions` to get them rendered at 1080p as PNG sequences with transparency. It makes a bigger download."],
              ["Download", "Press `Download package (.zip)`."],
            ],
          },
        ],
      },
      {
        id: "open",
        title: "Opening it in your editor",
        blocks: [
          "Unzip the package and keep its folders together: the timeline finds its media by relative paths, so moving the timeline file away from its folders breaks the links. Then open or import the timeline file in your editor as usual.",
          { tip: "Graphics, titles and captions come across as PNG sequences with transparency, ready to sit on their own track above the footage." },
        ],
      },
      {
        id: "plans",
        title: "Which plans include it",
        blocks: [
          "Timeline export depends on your plan. The [plan comparison](/pricing#compare) shows which plans include export to Premiere Pro, Final Cut Pro and DaVinci Resolve. Exporting a finished video (MP4, MOV and more) works on every plan.",
        ],
      },
    ],
  },
  {
    slug: "edit-video-with-claude-code-codex-cursor",
    topic: "workflows",
    date: { iso: "2026-11-09", text: "9 November 2026" },
    title: "Edit video with your own AI agent: Claude Code, Codex or Cursor",
    seoTitle: "Edit video with Claude Code, Codex or Cursor",
    dek: "Already pay for an AI agent? Connect it to KeyFly and it edits your timeline on your own plan, without using AI minutes.",
    cover: { video: "/video/agent-reel.mp4", poster: "/video/agent-reel.webp", alt: "A podcast host talking into a microphone" },
    sections: [
      {
        id: "what",
        title: "Your agent, in your editor",
        blocks: [
          "KeyFly works with the AI agents on your computer: **Claude Code, Codex, Cursor, Antigravity and other ACP agents**. They edit with your own plan with their provider, without using your AI minutes.",
          "KeyFly connects to them through the KeyFly desktop app on your computer, and opens it for you if it's closed.",
        ],
      },
      {
        id: "set-up",
        title: "Set it up once",
        blocks: [
          {
            steps: [
              ["Get the desktop app", "KeyFly for Mac (Apple silicon or Intel) or Windows 10 and 11, from the [download section](/#download)."],
              ["Turn on agents", "In `Settings → Agents`, press `Use agents on this computer`."],
              ["Pick your agent", "In the AI picker, choose it under `Your agents`."],
            ],
          },
          { tip: "Can't connect? Use a pairing code: it's offered right under `Use agents on this computer`." },
        ],
      },
      {
        id: "work",
        title: "Working with it",
        blocks: [
          "You talk to your agent in the same chat as KeyFly's own AI: `What should we change?` Type @ to point at a scene and / for a command. Its edits land on the timeline as real tracks, so you can keep changing them by hand, or go back with `Revert`.",
          "You can switch between your agent and KeyFly Cloud at any time. KeyFly Cloud picks the best model for each step and uses AI minutes; your agent uses neither.",
        ],
      },
      {
        id: "limits",
        title: "When your agent hits its limit",
        blocks: [
          "Agents have their own usage limits. When yours reaches one, KeyFly tells you when it resets, and offers another agent that still has capacity, or KeyFly Cloud if your plan includes it.",
        ],
      },
      {
        id: "plans",
        title: "Which plan",
        blocks: [
          "The Free plan lets you edit with your own Claude, Codex or Cursor with a daily limit. The BYO plan takes the limits off, using the AI you already pay for. [Compare them](/pricing#byo).",
        ],
      },
    ],
  },
  {
    slug: "clean-up-talking-head-video",
    topic: "guides",
    date: { iso: "2026-11-09", text: "9 November 2026" },
    title: "From a talking-head recording to a finished clip",
    dek: "Silences, filler words, captions, zooms and callouts: the chores KeyFly does for you, and how to change any of them.",
    cover: { video: "/video/footage-loop.mp4", poster: "/video/footage-loop.webp", alt: "A man talking to camera in a studio" },
    sections: [
      {
        id: "chores",
        title: "The chores, done for you",
        blocks: [
          "Drop a recording of someone talking to camera, and KeyFly does the work that usually takes the longest by hand:",
          {
            steps: [
              ["Silences", "The pauses are cut out, so the talk keeps moving."],
              ["Filler words", "\"Um\", \"uh\", \"like\" and \"you know\" come out."],
              ["Captions", "Captions are added, word by word."],
              ["Zooms and callouts", "The shot zooms on the focus area, and callouts land on what matters."],
            ],
          },
        ],
      },
      {
        id: "change",
        title: "Change anything",
        blocks: [
          "Every layer KeyFly adds is a real track on the timeline. Bring back a pause you liked, move a zoom, rewrite a caption: by hand, or by asking in the chat (\"keep the pause before the punchline\"). And `Revert` takes the last change back.",
        ],
      },
      {
        id: "templates",
        title: "Start from a template",
        blocks: [
          "The **Talking heads and podcasts** category has ten templates, at their own shapes and lengths. [Browse them](/use-cases#talking-heads-and-podcasts), or start from your footage alone.",
        ],
      },
      {
        id: "privacy",
        title: "Where your recording goes",
        blocks: [
          "In the desktop app, your footage stays on your computer. It's uploaded only when a cloud AI step needs it, and exports are made on your device. Your projects stay yours, and you can always export them.",
        ],
      },
    ],
  },
  {
    slug: "brand-kit-from-your-website",
    topic: "product",
    date: { iso: "2026-11-09", text: "9 November 2026" },
    title: "Fill a brand kit from your website",
    dek: "Paste your address, press Analyze with AI, and every new video starts on brand: logo, colours, font, tone and voice.",
    cover: { video: "/video/brand/launch.mp4", poster: "/video/brand/launch.webp", alt: "A team gathered round a laptop" },
    sections: [
      {
        id: "holds",
        title: "What a brand kit holds",
        blocks: [
          {
            table: {
              head: ["Part", "What goes in"],
              rows: [
                ["Logo", "Your logo, plus its versions and banners"],
                ["Colours", "Five colours"],
                ["Font", "Your typeface"],
                ["Tone of voice", "How your brand sounds in scripts"],
                ["Voice-over", "An AI voice, or a clone of your own"],
              ],
            },
          },
        ],
      },
      {
        id: "analyze",
        title: "Fill it from your website",
        blocks: [
          "You don't have to fill the kit by hand. Paste your website's address and press `Analyze with AI`: KeyFly reads your public pages and fills in the logo, colours, font and tone it finds. Check each part, and change anything it got wrong.",
        ],
      },
      {
        id: "default",
        title: "Make it the default",
        blocks: [
          "Mark a kit as `Default` and new videos use it automatically. Home then suggests templates picked for your brand under `Suggested for you`.",
          { tip: "On a team, everyone shares the same kits, so every video from every member starts on brand." },
        ],
      },
      {
        id: "voice",
        title: "A voice that sounds like you",
        blocks: [
          "The kit's voice-over can be one of KeyFly's AI voices, or, on higher plans, a clone of your own voice. Only clone a voice that's yours, or that you have clear permission to use.",
          "How many kits you can keep depends on your plan: see the [plans](/pricing#compare).",
        ],
      },
    ],
  },
  {
    slug: "video-export-settings-every-platform",
    topic: "guides",
    date: { iso: "2026-11-09", text: "9 November 2026" },
    title: "One edit, every screen: KeyFly's export settings explained",
    seoTitle: "Video export settings for every platform, explained",
    dek: "Frame shapes, sizes, formats, codecs and presets: what each setting in the export sheet does, and when to change it.",
    cover: { video: "/video/format-loop.mp4", poster: "/video/format-loop.webp", alt: "A creator filming herself on a city street" },
    sections: [
      {
        id: "shapes",
        title: "Four frame shapes",
        blocks: [
          {
            table: {
              head: ["Shape", "Name", "Typical home"],
              rows: [
                ["16:9", "Landscape", "YouTube, websites, presentations"],
                ["9:16", "Vertical", "TikTok, Reels, Shorts"],
                ["1:1", "Square", "Feeds that show square posts"],
                ["4:5", "Portrait", "Feeds that favour taller posts"],
              ],
            },
          },
          "Pick a shape when you start, in the prompt box, and choose again at export.",
        ],
      },
      {
        id: "presets",
        title: "Presets",
        blocks: [
          "Not sure which settings a platform wants? The export sheet has presets for **TikTok, Instagram Reels, YouTube, YouTube Shorts, LinkedIn and X**, plus `Custom` for your own.",
        ],
      },
      {
        id: "settings",
        title: "Every setting",
        blocks: [
          {
            table: {
              head: ["Setting", "Options"],
              rows: [
                ["Format", "MP4, MOV, WebM, MKV, GIF"],
                ["Codec", "H.264, HEVC (H.265)"],
                ["Size", "720p, 1080p, up to 4K"],
                ["Frame rate", "23.976 to 60"],
                ["Also", "Sound as WAV, frames as pictures"],
              ],
            },
          },
          "The default is MP4 (H.264): it plays almost everywhere. Choose HEVC for smaller files where it's supported, and MOV when an editor or client asks for it.",
        ],
      },
      {
        id: "local",
        title: "Made on your computer",
        blocks: [
          "Exports are encoded on your device. Nothing is uploaded, and exporting uses no AI minutes.",
          "Export size and the small KeyFly mark depend on your plan: the Free plan exports in 1080p with the mark, and paid plans go up to 4K without it. [See the plans](/pricing#compare).",
        ],
      },
    ],
  },
];

// Reading time from the words (220 a minute), at least one minute.
function blockText(block) {
  if (typeof block === "string") return block;
  if (block.list) return block.list.join(" ");
  if (block.steps) return block.steps.flat().join(" ");
  if (block.table) return [...block.table.head, ...block.table.rows.flat()].join(" ");
  return block.tip || block.quote || "";
}

function minutesFor(post) {
  const text = [post.title, post.dek, ...post.sections.flatMap((s) => [s.title, ...s.blocks.map(blockText)])]
    .map(plainText)
    .join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}

export const allPosts = posts.map((post) => ({
  ...post,
  author,
  path: `/blog/${post.slug}`,
  minutes: minutesFor(post),
  topicLabel: topics.find((t) => t.id === post.topic)?.label ?? post.topic,
}));

export function getPost(slug) {
  return allPosts.find((p) => p.slug === slug) ?? null;
}

// Up to three other posts: same topic first, then the newest.
export function relatedPosts(post, count = 3) {
  const others = allPosts.filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => p.topic === post.topic), ...others.filter((p) => p.topic !== post.topic)].slice(
    0,
    count,
  );
}

export const postPage = {
  breadcrumb: "Blog",
  by: "By",
  minRead: "min read",
  contents: "In this post",
  progress: "Reading",
  share: { copy: "Copy link", copied: "Link copied" },
  tipLabel: "In KeyFly",
  cta: {
    eyebrow: "Try it",
    title: [{ text: "Your next video" }, { text: "starts with a sentence.", accent: true }],
    line: "Start free in your browser, or download KeyFly for Mac or Windows.",
    primary: { label: "Start free", href: `${siteConfig.appUrl}/signup?plan=free` },
    secondary: { label: "Download", href: "/#download" },
  },
  related: "Keep reading",
  back: { label: "All posts", href: "/blog" },
};
