# Keyfly website: build plan

Last updated: 2026-10-31

## What we know from the brand kit

- **Product:** Keyfly is a desktop app for macOS, Windows and Linux (the kit has icons and installer art for all three). The symbol, "Flight path", stands for "the camera's flight, and the moment a shot lands", so the product is about video.
- **Owner:** "Keyfly.si is a Cevrynt Inc. product" (from the DMG installer art). The domain looks like `keyfly.si`.
- **Brand assets:** the symbol, wordmark and lockups (light and dark versions), favicons, app icons and Syne 700 (OFL licence).
- **Colours (updated kit, 2026-10-29):** Soft mint `#5FE0B0`, Deep mint `#12805B`, Mint text `#0E6B4C`, Mint text on dark `#82E8C2`, Mint ink `#06231A`, Night `#0B0B0D`, Night top `#202026`, Paper `#F4F1EA`, Ink `#141416`. White text on deep mint, Mint ink on soft mint.
- **Brand motion:** the line draws itself in 0.9s, then the point lands with a 0.35s settle. Reduced motion falls back to a simple fade.
- **Rules:** never recolour, rotate, stretch or redraw the mark, and never add effects to it. Leave clear space around it equal to the point's diameter.

## Tech stack

| Choice | Why |
|---|---|
| **Next.js 16 (App Router), JavaScript/JSX** | It's the same stack as the Cevrynt site, so the team already knows it. It renders on the server for SEO and builds pages statically for speed. |
| **pnpm** | Same package manager as Cevrynt. |
| **Plain CSS with CSS Modules and design tokens as CSS variables** | No Tailwind. Each component loads only its own CSS, which avoids Cevrynt's 860 KB global stylesheet. |
| **Motion only where it earns it** | CSS for simple transitions; GSAP only for the flight-path line drawing. |
| **Self-hosted fonts** | Syne 700 from the kit for headings, plus one neutral text face for body copy (proposal: Inter, which matches the installer art). Nothing loads from Google at runtime. |
| **Cloudflare (Workers via OpenNext, or static export)** | Same host as Cevrynt. If the site stays fully static we use a static export on Cloudflare Pages, which is simpler. |

Performance targets: LCP ≤ 1.5s, CLS ≤ 0.1, INP ≤ 200ms. Each page has one H1, real metadata, a sitemap and Open Graph images.

## Design direction: "Paper and mint"

The reference site (cardboard.ai) is all black and cinematic, with a prompt-box hero, pill buttons and numbered 01/02/03 feature cards. Keyfly avoids all of that:

- **Light first:** a Paper (`#F4F1EA`) page with Ink type. Night is used only where the product itself appears, as a dark app window set into the light page.
- **Mint is rare:** it marks the one primary action and the moments where something "lands", like the point in the logo.
- **Lines, not boxes:** sections are separated by hairlines and connected by a drawn flight-path line rather than bordered cards and tiles.
- **Signature motion:** a single flight-path line moves through the page and lands on the mint point at each key action. It's drawn once per section, with no looping decoration.
- **Typography:** Syne 700 headings set large, editorial spacing and short copy.

## Build steps (one at a time, each checked in the browser at desktop and mobile)

1. **Scaffold:** set up Next.js 16 in JS with pnpm and git, lint, folder structure, brand assets in `/public`, self-hosted fonts and the project docs (`AGENTS.md`, `PROJECT_CONTEXT.md`).
2. **Design foundations:** colour and spacing tokens, type scale, the base layout and primitives (logo, button, section, `FlightPath` line component).
3. **Header and footer:** a floating light header with the lockup, navigation and a primary CTA; a complete server-rendered footer.
4. **Hero:** the headline, one CTA and the flight-path entrance motion.
5. **Product showcase:** the app window with real screenshots or video of Keyfly.
6. **How it works and features**, drawn as one connected path.
7. **Download:** macOS, Windows and Linux, with OS detection. Pricing goes here too if there is any.
8. **FAQ and closing CTA.**
9. **SEO:** metadata, OG images, sitemap, robots, favicons and JSON-LD.
10. **Performance and accessibility pass, then deploy.**

## Open questions (needed before step 4)

1. What does Keyfly do, in one or two sentences? What are its main features?
2. Who is it for?
3. What is the main action on the site: download, join a waitlist, buy, or book a demo?
4. Is there pricing? Is there a free tier?
5. Do we have real screenshots or screen recordings of the app?
6. Is the domain `keyfly.si`?


## Homepage expansion (planned 2026-10-31)

The homepage reads as too short (Hero, How it works, Use cases, Download, footer). The team asked for a bigger homepage built around what Keyfly does that competitors don't, planned first and then built one section at a time.

### The competition, briefly (from 2026 reviews)

- **Descript:** edit video by editing its transcript; an AI co-editor on metered credits.
- **Runway:** generative video; its core is a model, not a timeline.
- **CapCut:** free and social-first (auto captions, reframe, templates), with little prompt-based editing.
- **OpusClip:** long video to short clips, billed by minute.

None of them let you **describe a whole video and get an edited cut back**, then refine it in plain words, inside a desktop editor. That is Keyfly's lane as far as we can see.

### What we know Keyfly does (from the app's prompt box and installer art)

- You describe a video or drop footage, and Keyfly edits it.
- Presets: Launch Video, UGC, Explainer, Montage, Product Demo, Podcast.
- Formats: Auto, 16:9, 9:16, 1:1 (the list is a placeholder).
- "Or make it in ChatGPT · Claude": Keyfly can apparently be used from inside ChatGPT and Claude.
- A desktop app (macOS, Windows) plus a web app at app.keyfly.si.

Everything else below that names a feature must be **confirmed by the team before it is built**. We never invent features, customers, metrics or pricing.

### What the market says (research, 2026-10-31)

- **Chat-based editing** has arrived (ChatCut, NemoVideo, Riverside), but it mostly replaces the timeline with a prompt box. The gap is **iterating by talking while keeping a real timeline**.
- **Creators accept AI for mechanical work** (captions, reframing, trimming) and **protect creative control**, so the message is: AI does the busywork, you make the calls.
- **Recurring pains:** caption accuracy, re-cutting 16:9 to 9:16, staying on brand, black-box results and confusing credit pricing.

### The homepage, decided (the team asked us to choose: "do as you want, but better than competitors")

Copy for anything not yet confirmed is marked PLACEHOLDER in `src/content/home.js` and its visuals are captioned "Illustrative".

| # | Section | Status | Why it's there |
|---|---|---|---|
| 1 | Hero | ✅ | The promise and the prompt box |
| 2 | How it works | ✅ | Describe → Keyfly edits → Export |
| 2a | **What Keyfly makes** (`#makes`) | ✅ built 2026-11-03 | An illustrative film (until the app's output is ready), played over its own timeline: storyboard, voice-over, motion graphics, transitions |
| 2b | **Your footage** (`#footage`, was The old way) | ✅ built 2026-11-03, rebuilt as a six-step scroll story, then refocused on editing your own footage the same day | Footage chores by hand (silences and filler words, zooms and callouts, captions…) vs one sentence to KeyFly; no names, no numbers |
| 3 | **Edit with words** (`#edit`) | ✅ built 2026-10-31 | The core differentiator: refine the cut by asking, with the timeline following |
| 4 | **You make the calls** (`#control`) | ✅ built 2026-10-31, rebuilt 2026-11-04 as the AI director's note (no editor window) | Against black-box generators: the AI director says what it chose and why; change any call or revert it |
| 5 | **One edit, every format** (`#formats`) | ✅ built 2026-10-31, rebuilt 2026-11-02 | The 16:9 → 9:16 → 1:1 pain: one cut reframes, captions follow |
| 6 | **On brand, every time** (`#brand`) | ✅ built 2026-11-02 (brand kit confirmed) | Brand consistency: your fonts, colours and logo applied to every cut |
| 7 | **Works where you work** (✗ merged into Open by design, 2026-11-04) (`#anywhere`) | ✅ built 2026-11-02 (chat app confirmed) | ChatGPT · Claude, desktop and browser; before Use cases so the thread's loop stays clear |
| 7a | **Open by design** (was Works with your tools; 2026-11-04 adds where it runs) (`#tools`) | ✅ built 2026-11-03 | Bring your own AI (Claude Code, Codex, Cursor, Antigravity: no AI minutes) and hand the timeline to Final Cut, Resolve, Premiere or Avid |
| 7b | **Who it's for** (`#audience`) | ✅ built 2026-11-03 | Keyfly by role, from the confirmed presets |
| 8 | Use cases | ✅ | Six presets on the jog wheel |
| 8b | **Prompt gallery** (`#prompts`) | ✗ removed 2026-11-04 (repeated Use cases); its templates row moved to Use cases | Example prompts to try; competitors lean on templates |
| 9 | Download | ✅ | Get the app |
| 9b | **Pricing** (`#pricing`) | ✅ built 2026-11-03, from the client's pricing API | Seven plans, live from api.keyfly.si; "still rendering" fallback when it can't be reached |
| 10 | **FAQ, "Ask Keyfly"** (`#faq`) | ✅ built 2026-11-02 | Formats, export, privacy, ownership, pricing |
| 11 | Footer | ✅ | |

### Still missing (review, 2026-11-03), waiting for facts from the team

Against Descript, OpusClip, Submagic and VEED, the page still lacks: **social proof** (logos, testimonials, ratings, user numbers), **pricing** (plans or a free tier), **a showcase** (real videos made with Keyfly), **exports and integrations** (where it publishes, NLE export), **languages** (captions, translation, dubbing), **privacy and security** (ownership, training, storage), and **teams or an API**. The team said (2026-11-03) it can supply facts for social proof, pricing, and showcase/exports/languages. None of these is built until the facts arrive.

A closing call-to-action section was built and removed on 2026-11-03; its ruler-and-playhead became the divider between every two sections.

Proof (logos, numbers, reviews), before/after footage and pricing are added once real material exists.

### Questions for the team (to swap placeholders for facts)

1. What can Keyfly do after the first cut? (Follow-up prompts? Which kinds of change?)
2. What are the 4–6 features you're proudest of, especially ones Descript, CapCut, Runway or OpusClip don't have?
3. How does "make it in ChatGPT · Claude" work, and where do its links go?
4. Does Keyfly reframe one edit to several formats? Which formats and which export settings?
5. What does the desktop app do that the browser doesn't (speed, local files, offline, privacy)?
6. Is there pricing or a free tier?
7. Any real numbers, customers or reviews we may show?
8. Can we have real footage or screen recordings (for before/after and the feature visuals)?

## Product page (`/product`)

Planned from `reports/AI video editor product pages.md`. Built one section at a time.

| # | Section | Status | Notes |
|---|---|---|---|
| 0 | Hero | ✅ built 2026-11-04, rebuilt the same day as a real hero | Centred promise; the annotated editor (six callouts wired to its parts, touring), tilting flat on scroll; facts row |
| 1 | Make (`#make`) | ✅ built 2026-11-04 | Three starts (sentence, footage, template) → seven layers built one by one; motion styles and templates strip |
| 2 | Direct (`#direct`) | ✅ built 2026-11-04, redesigned the same day | The AI director's notes pinned to its own cut's timeline, a playhead touring them; three ways to steer |
| 3 | Footage (`#footage`) | ✅ built 2026-11-04 | One recording cleaned in four passes (picture, transcript, log); where footage goes |
| 4 | Brand (`#brand`) | ✅ built 2026-11-04 | habitly.io read into a brand kit field by field; every new video on-brand; the app's suggestions |
| 5 | Deliver (`#deliver`) | ✅ built 2026-11-05 | One cut branching to three cards: export specs, review link, format-by-editor grid; plans line |
| 6 | Your way (`#your-way`) | ✅ built 2026-11-05 | A ledger of five choices (platform, AI, projects, data, team) that unlock as they come into view |
| 7 | AI minutes (`#minutes`) | ✅ built 2026-11-05 | An illustrative session whose meter counts only while KeyFly's AI works; each plan's minutes from the API |
| 8 | Close | ✅ built 2026-11-05 | A reel of the six parts (links back) ending on "Your video"; Start free / Download |


## Site pages: build order (agreed 2026-11-05)

The site isn't live yet, so every page the navbar points at gets built now, one at a time, in the navbar's order, before anything else. Each page follows the Product page's process: research competitors' pages, a plan the team approves, then one section at a time, each checked at desktop and phone. Tick a page off here when it's done, so none is forgotten.

| # | Page | Status | Navbar today | Facts we have / what's missing |
|---|---|---|---|---|
| 1 | Product `/product` | ✅ done 2026-11-05 | Product | All nine sections built |
| 2 | Use cases `/use-cases` | ⏳ next | Use cases → `/#use-cases` | Six presets with their real prompts, four roles, 91 templates (11 categories). Missing: real videos made with KeyFly and customer stories, so previews stay illustrative |
| 3 | Integrations `/integrations` | ⏳ | Integrations → `/#tools` | Agents (Settings → Agents), editors and timeline formats, Package for editing, platforms. Missing: ChatGPT and Claude app install links |
| 4 | Pricing `/pricing` | ⏳ | Pricing → `/#pricing` | Everything from the pricing API (plans, prices, AI minutes, packs, Team, Enterprise) |
| 5 | Download `/download` | ⏳ | Download button → the build, or `/#download` | Real builds (version 1.1.7), macOS 13+ (Apple silicon, Intel), Windows 10 and 11 |

When a page is built, point its navbar and footer links at it (`src/content/navigation.js`, `src/content/footer.js`) and remove the homepage anchor from them.

Not until the team sends content: Blog, Changelog, About, Customers, Enterprise, a public Templates gallery, and the full Terms and Privacy text.
