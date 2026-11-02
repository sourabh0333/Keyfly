# Keyfly Marketing Website — Project Context

Last updated: 2026-11-02

The durable handoff for anyone (people or coding agents) working on the Keyfly website. Update it whenever a lasting decision changes. The step-by-step build order lives in `PLAN.md`.

## Product (what we know so far)

- Keyfly is a desktop app for macOS and Windows (the team confirmed on 2026-10-31 that there is no Linux build), made by Cevrynt Inc.
- Its symbol, "Flight path", stands for the camera's flight and the moment a shot lands, so the product is about video.
- Domain: probably `keyfly.si` (from the installer art). `siteConfig.url` falls back to it; set `NEXT_PUBLIC_SITE_URL` to override.
- Still open: what Keyfly does in detail, the audience, the main conversion (download, waitlist, purchase), pricing, and real product screenshots. Do not write product claims until these are answered.

## Technical baseline

- Next.js 16.4 (App Router), React 19.3, JavaScript/JSX only, pnpm 12.
- Server Components and static rendering by default; keep client components small.
- Plain CSS: tokens and element defaults in `src/app/globals.css`, component styles in CSS Modules.
- Fonts are self-hosted through `next/font/local` (`src/app/fonts.js`), with licences beside the files in `src/fonts/`:
  - Inter variable (`--font-text`) for headings and text.
  - Instrument Serif italic (`--font-accent`, latin subset from Fontsource, added 2026-10-29 at the team's request) for the one accent word in a heading.
  - Syne 700 (`--font-display`) remains the wordmark's face.
  - Interface labels use the system mono stack (`--font-mono-stack`).
- Icons use the App Router file conventions: `src/app/favicon.ico`, `icon.svg` and `apple-icon.png`, copied unchanged from the brand kit.
- Hosting: Cloudflare, either as a static export on Pages or through OpenNext on Workers, decided before deploy.
- Performance targets: LCP ≤ 1.5s, CLS ≤ 0.1, INP ≤ 200ms. Each page has one H1 and complete metadata.

## Brand

The full kit lives in `brand-kit/` (see `brand-kit/README.md`). Web copies are in `public/brand/`. On 2026-10-29 the kit's accent changed from tungsten amber to **mint**; the shapes, wordmark and font did not change.

| Token | Hex | Use |
|---|---|---|
| `--soft-mint` | #5FE0B0 | Accent on dark: the point, primary buttons, highlights |
| `--deep-mint` | #12805B | The point and primary buttons on light |
| `--mint-text` | #0E6B4C | Accent used as text on light (6.5:1) |
| `--mint-text-dark` | #82E8C2 | Accent used as text on dark |
| `--mint-ink` | #06231A | Text on soft mint |
| `--night` / `--night-top` | #0B0B0D / #202026 | Dark surfaces (the app itself) |
| `--paper` | #F4F1EA | Page background |
| `--ink` | #141416 | Text on light |

- Text on deep mint is white (4.9:1); text on soft mint is Mint ink.
- Mint is the one vivid colour on screen. Warnings stay amber and success a status green, so "go" and "careful" never look alike.
- Never recolour, redraw, rotate or stretch the mark, and never add effects. Leave clear space equal to the point's diameter.
- Brand motion: the line draws in 0.9s ease-in-out, then the point lands with a 0.35s ease-out settle. Reduced motion falls back to a fade.

## Design direction: "Prompt to picture" (changed 2026-10-30)

On 2026-10-30 the team dropped every earlier direction ("Paper and mint", "Relay", "Cinematic") and started again from the header and hero. The reference is cardboard.ai: it is a source of inspiration for structure and polish, never something to copy. The goal is to clearly outdo it.

- **Keyfly is an AI video editor** (from the app's prompt box): you describe a video or drop footage and Keyfly edits it. It has a web app at `app.keyfly.si` (`siteConfig.appUrl`), and every "open the app" action points there.
- **The app's prompt box must stay in the hero.** It has:
  - the placeholder "Describe your video, or drop footage...";
  - a toolbar with +, Auto ⌄, a sparkle button and a send button;
  - preset chips: Launch Video, UGC, Explainer, Montage, Product Demo, Podcast;
  - the line "or make it in ChatGPT · Claude".
- **Night surfaces, mint rare.** Mint marks the primary action, the playhead, keyframes and focus.
- **Every effect shows editing:**
  - the timeline floor;
  - a comet of light around the prompt box;
  - a recording light on the eyebrow.
- **Respect `prefers-reduced-motion`:** everything stands still, and the words fade in.
- **Built step by step:** header and hero first. Each later section is added only after the previous one is agreed.
- The cardboard.ai and app.keyfly.si pages could not be opened from the cloud session (network policy). The hero follows the team's screenshot of the app.

## Design foundations (step 2)

`/styleguide` shows every token and component in development and returns 404 in production. Check it after changing a foundation.

- **Tokens** (`src/app/globals.css`):
  - the brand colours;
  - a fluid type scale (`--text-display` … `--text-label`);
  - 4px spacing (`--space-1`…`--space-10`, `--section-pad`);
  - radii (`--radius-s` … `--radius-l`, `--radius-round` for buttons and chips);
  - the glass tokens on Night;
  - motion timings that match the brand kit.
- **Tone:** components read only role tokens (`--color-text`, `--color-muted`, `--color-line`, `--color-point`, `--accent-fill`, `--accent-ink`). Any element with `data-tone="night"` switches its contents to Paper and soft mint, so never hard-code brand hexes in a component.
- **`Logo`** (`src/components/logo.jsx`): the unaltered brand-kit lockup with the kit's intro motion, as a home link. Its colours follow the surrounding tone.
- **`Button`:** renders Link, `<a>` or `<button>` from `href`. Variants:
  - `variant="solid"`: round mint (Mint ink on Night), with a glow on hover. The one primary action per view.
  - `variant="ghost"`: round glass. The secondary action beside it.
  - `variant="link"`: a drawn underline, for quieter actions.
- **`Section` / `SectionHeading`:** a full-width band with the content column, a `tone` and an optional hairline `rule`, plus an eyebrow, h2 and lead. Pair `SectionHeading id` with `Section labelledBy`.
- **`FlightPath`:** the brand line that draws in 0.9s and lands its point in 0.35s.
  - `play="load"` uses CSS only. `play="view"` draws once on scroll, and its server HTML is already drawn, so nothing is hidden without JS. `play={false}` is static.
  - Pass a `shape` for longer page-level paths. Reduced motion gets a fade.

## Website logo (settled 2026-10-29)

The team's decision: **the website logo uses the brand kit's lockup shapes and colours, unchanged.** That means the "Flight path" symbol plus the "Keyfly" wordmark (Syne 700, outlined), as in `brand-kit/lockups/lockup-light.svg` (on Paper) and `lockup-dark.svg` (on Night). Do not redraw or recolour them; earlier experiments with a K-shaped mark and a hand-written script wordmark were dropped for this reason. Only their placement (below) and the intro's light effects (below) are the website's own, both at the team's request.

- `src/components/logo/lockup.js` is **generated** from `brand-kit/lockups/lockup-light.svg`. It holds:
  - the viewBox, symbol box, transform, path, stroke and point;
  - the symbol flattened into lockup units (`FLAT_SYMBOL_*`, the same drawing, so the comet can follow it);
  - the wordmark whole and split into letters.
  Regenerate it if the kit changes; never edit it by hand.
- **Composition** (`src/components/logo/composition.js`, hand-set on 2026-10-29 at the team's request: "make it look like a proper logo"). The kit's file leaves a 33.7-unit gap and lets the symbol's tail drop 5.5 units below the baseline, so only the placement changes; shapes and colours stay exactly as in the kit:
  - The symbol moves up 7.93 so its tail rests on the wordmark's baseline (44.02).
  - The wordmark moves left 32.45, set **optically**: the true distance from the symbol's nearest ink (its arm and point) to the K equals the point's diameter (7.65), the kit's clear space and the closest it allows. Measured box to box this would overlap; the point hovers just above the K's top-left corner. Before this the true ink gap was 13.9; across the K's height it averaged 27.8 and now averages 21.0.
  - The viewBox `8 0 171.48 54.07` keeps an even 2.65-unit margin.
  - **Optical centring:** the box is taller than the type (point above, descenders below), so where the logo sits beside text it is lifted by `OPTICAL_LIFT` (9.3% of its height). In the header (`translate: 0 -9.3%`) its letters centre on the bar's centre line.
- `src/components/logo/animated-logo.jsx` renders that markup inline, so the colours follow the tone: Ink + deep mint on Paper, Paper + soft mint on Night, exactly the kit's pairs. It is used by `Logo` everywhere (header 26px tall, styleguide) and directly on the homepage.
- **Intro: light painting** (the team asked for the whole logo to animate with distinctive effects; about 2s; the resting logo is the kit's):
  1. A glowing mint comet sweeps in and paints the symbol's line. Behind it the light cools: white-hot core, then burning mint tail, then mint trail, then the line (110ms behind). It sheds about 30 sparks that fall under gravity and die out.
  2. The comet becomes the point with a flash, a shockwave ring and a bloom of mint light.
  3. "Keyfly" develops letter by letter with a brief mint afterglow, and a glint crosses the word.
  4. Hover (mouse only, after the intro): the comet relights the symbol with fresh sparks.
- How it is built: Web Animations API from JS. The comet's run-in and the line are sampled once (`getPointAtLength`), so the comet, trail and ink share one clock. `data-state` "pending" keeps the logo hidden until the intro starts, with a 3s CSS fallback. "armed" waits for scroll (`play="view"`). Reduced motion and `play={false}` show the finished logo, with no relight.
- Verified on 2026-10-29, in the browser:
  - The wordmark and symbol shapes are identical to the kit file.
  - The symbol's tail and the K both end at y 44.0, and the true ink gap measures 7.65.
  - The intro timeline and the hover relight run as described.

## Header (rebuilt 2026-10-30)

The root layout renders the skip link, `SiteHeader`, `<main id="main">` and `SiteFooter`. Pages render a fragment or `<div>`, never their own `<main>`. Navigation labels and targets live only in `src/content/navigation.js`. The menu is a placeholder (Product, Use cases, Download) until those sections exist.

- **`SiteHeader`** (`src/components/header/site-header.jsx`, a client component):
  - Layout: the logo, centred links, then "Sign in" and the mint "Open Keyfly" button. Both buttons go to the app.
  - At the top of the page it is an open bar. Once scrolled (`data-scrolled`), it gathers into a floating glass pill.
  - It slides away while scrolling down past 240px (`data-hidden`) and comes back on the way up.
  - A light slides under the hovered or focused link (`--lx`, `--lw`).
  - At 860px and below the links fold into a menu panel behind a two-line button, which closes on Escape. Below 420px only the menu button remains.

## Footer (added 2026-10-31, rebuilt the same day)

`src/components/footer/`, with its copy in `src/content/footer.js`. The first version, "end credits", didn't read as a footer and was dropped. This one is a conventional footer in the site's style: one night panel (`#101114`, radius 26) in the 1320px column.

- **Top edge:** a timeline ruler, with the mint playhead parked at the end of the reel.
- **Call to action:** "Your next video / *starts with a sentence.*" with the mint "Open Keyfly" (the app) and the ghost "Download" (`/#download`).
- **Main row:**
  - Brand: the logo (30px, intro on scroll), the site description (PLACEHOLDER, from `siteConfig`) and a "macOS · Windows" pill.
  - Three link columns: Product (How it works, Use cases, Download); Use cases (the six presets); Keyfly (Open Keyfly, Sign in, Keyfly for macOS, Keyfly for Windows).
- **Bottom bar:** "© {year} Cevrynt Inc.", keyfly.si and Back to top.
- **The thread's arrival** (added 2026-10-31 at the team's request: "the line should extend to the footer and trigger an animation there"):
  - While `data-thread` is on and the line hasn't arrived, the contents wait at 22% opacity, 18px low and lightly blurred.
  - On `data-arrived`:
    - the playhead sends out a pulse ring;
    - a conic comet of mint light (`@property --sweep`) runs once round the panel's edge;
    - the panel's mint edge and glow come up;
    - the CTA, brand, three columns and bottom bar rise in, staggered by `--i`.
  - Without JS the footer simply shows. With reduced motion the line arrives at once and nothing animates.
- **No inventions:** no social links, no legal pages and no newsletter until they exist.
- **Narrow screens:** the brand sits above the columns. On phones the columns become two, and the CTA buttons share the row.
- **Logo fix (same day):** the logo's glowing-trail layer (`.glowLayer`) is drawn only while light runs: during the intro (`data-state="running"`) or a hover relight (`data-lit`). At rest its filter region left a faint mark beside the symbol at larger sizes. The logo's shapes and colours are unchanged.

## Homepage (step by step, from 2026-10-30)

`src/app/page.jsx` renders, inside `Scene`, Hero → HowItWorks (`#product`) → EditWithWords (`#edit`) → YourCall (`#control`) → EveryFormat (`#formats`) → OnBrand (`#brand`) → Anywhere (`#anywhere`) → UseCases (`#use-cases`) → Download (`#download`) → Faq (`#faq`). The planned sections and their order are in `PLAN.md` ("Homepage expansion"). All copy lives in `src/content/home.js`. Lines marked `PLACEHOLDER` wait for the confirmed product description, so the page is `noindex` until then.

- **Scene** (`src/components/scene/`, added 2026-10-31 at the team's request: the page was flat black and the sections felt disconnected). It ties the sections together as one scroll:
  - **`SceneLight`:** a fixed light behind every section, so sections leave their own backgrounds transparent (the hero's backdrop fades out at its foot with a mask). Each section brings up its own layer as it fills the screen (`--w`), and the layers drift slowly:
    - How it works: dusk (violet-blue and peach, from its viewer's shots).
    - Use cases: the colours of the feed on air. `Switcher` sets `html[data-feed]`, and the colours cross-fade through registered `@property` colours.
    - Download: mint, where the thread lands.
  - **`FlightThread`** (reworked 2026-10-31: "the line is just moving along one side… lackluster"): one line of light in page coordinates (SVG over the page, `pointer-events: none`), laid out from the sections and re-measured with a `ResizeObserver` on the page and the footer. It speaks the logo intro's language.
    - **Route** (re-routed 2026-10-31 at the team's request: it used to run only down the left margin). It weaves through three lanes, never across copy:
      1. From the hero's playhead it drops into How it works and runs down the **channel between the steps and the editor** (the midpoint of the gap between the two columns).
      2. It S-curves out to the **left margin**, lands on the Use cases eyebrow and runs down beside the jog wheel.
      3. It flies one loop of the brand's flight path across to the **right margin**, lands on Download's lead (right-aligned; `data-landing` is on the lead, which brightens) and runs down beside the landing.
      4. It **sweeps back across** the gap above the footer to the panel's left corner, turns onto its top edge (the ruler) and runs along it to the playhead (`[data-thread-end]`, `[data-thread-stop]`). That last run gets its own stretch of scroll (up to 260px).
      - The margins sit halfway into the gutter (at most 26px out) from the content column. Where How it works has no side-by-side channel (narrow screens), that run falls back to the left margin.
      - Keyframe diamonds sit on whichever lane their run is in.
    - **The comet:** the head rides 62% down the screen. A white-hot core leads a burning mint tail (three windows of the path, at 210, 110 and 34px, set by `stroke-dasharray` and `stroke-dashoffset`), which cools behind into the thin finished line (`.base`).
    - **Speed:** the tail stretches (up to 2.6×), brightens and the head grows with the scroll speed, measured from the line's own progress and smoothed.
    - **Sparks:** the head sheds sparks while it moves, on a fixed `<canvas>`, falling under gravity and carried with the page. There are bursts at keyframes, at each landing and at the footer's playhead.
    - **Flowing light:** pulses of light (`.pulses`, a dashed copy masked to what is drawn) keep travelling along the finished line.
    - **Keyframe diamonds** light (with a burst) wherever a pinned section changes. Each pinned track lists its stops as fractions of its scroll in `data-thread-stops`, and diamonds are only placed on the vertical runs:
      - How it works: `0.333,0.667`;
      - the jog wheel: one per preset;
      - Download: lift-off and landing.
    - **Landings** (`data-landing`, on the Use cases eyebrow and on Download's lead): the line lands as a point with a bloom, a ring and a reach towards the text, which lights in answer (`data-landed`).
    - **Footer:** it has `data-thread` while the line is on its way and `data-arrived` once the line reaches the playhead. Scrolling back up resets it, so it replays.
    - **Performance:** one rAF loop runs only while the line moves or sparks live.
    - **Reduced motion:** the line is drawn whole and still, with no pulses or sparks, and everything has landed.
  - The thread stays in margins and gaps; never route it across copy.
  - **`Scrubber`** (added 2026-10-31, "the page is an edit"; moved the same day to the right-hand margin because, at the foot of the screen, it covered content): a slim vertical timeline fixed in the right margin once the hero is left behind. It is hidden at 1024px and below, where there is no margin.
    - One clip per `[data-section]` (Intro, How it works, Use cases, Download), sized by its length, filled with its section's light, with film-frame lines.
    - A mint playhead bar at the scroll position.
    - Hovering or focusing names the clips and shows a tag with the section under the playhead and a running timecode (the page plays as 48s).
    - It is navigation (`<nav aria-label="Page timeline">`): clicking a clip scrubs to it.
  - **Heading wipe** (`wipe.module.css`): each section's h2 is revealed by a mint playhead sweeping across it as it scrolls in. A view timeline animates the registered `--wp` (0 → 1), which drives both the `clip-path` and the line, so it scrubs both ways. Pseudo-elements can't take their own view timeline, which is why it runs through `--wp`. Without scroll-driven animation support, or with reduced motion, the heading just shows.

- **Hero** (`src/components/hero/`): one full screen. It has the eyebrow, a two-line h1 (the second line is in the serif italic accent with a mint shimmer), a lead line and the prompt box.
  - **Words** arrive one by one out of a blur.
  - **`PromptBox`** (client) is the app's box, working:
    - The field grows with its text. Enter sends; Shift+Enter starts a new line.
    - + opens a file picker, and files dropped anywhere on the page land as chips. A full-screen "Drop footage to start" frame shows while dragging.
    - "Auto ⌄" opens a format list. Its options (Auto, 16:9, 9:16, 1:1) are a PLACEHOLDER until the app's list is confirmed.
    - The sparkle button types a random preset prompt, and each chip types its own example prompt into the box.
    - Send opens the app. The app does not read the prompt from the URL, so the prompt is not carried over.
    - A conic comet of mint light circles the box's edge and speeds up on focus. The send button turns mint once there is something to send.
  - **"or make it in ChatGPT · Claude":** the links render as plain text until their `href`s are set in `prompt.elsewhere`. Official icons are still to be supplied.
  - **`TimelineFloor`** (CSS only): an editing timeline laid flat and tipped toward the horizon (`rotateX`).
    - It has a ruler and title, video, effect and audio tracks. The clips come from a seeded random, so server and client match.
    - The tracks slide under a fixed mint playhead. Some clips are lit and breathe, and keyframe diamonds sit at the ends of video clips.
    - The floor turns slightly with the pointer.
  - **Also on the hero:** a pointer light (`PointerField`, fine pointers only) and film grain.
- **How it works** (`src/components/how-it-works/`, added 2026-10-31): three steps beside an illustrative Keyfly editor window, captioned "Illustrative interface".
  - **Continuity:** the flight thread (see Scene) picks up the hero's playhead at the top of the section.
  - **Steps:** Describe it, Keyfly edits, Export anywhere, on a rail that fills with the mint point at its tip. Only the current step shows its body. On narrow screens they become one row of three.
  - **Scroll progress:** `ScrollStage` (client) pins the section (`data-live`, 420svh, sticky 100svh stage). It writes to the DOM:
    - `--p`, `--s1`, `--s2`, `--s3` (one per step), `--asm` (assembly) and `--ph` (playhead);
    - `data-step`, `data-format` and `data-ready`;
    - the typed prompt, the timecode and the export percentage.
  - **Step 1:** the Launch Video preset prompt types itself into the side panel, and the viewer waits.
  - **Step 2:** title, video and audio clips drop onto the timeline (`--k` per clip). Then the playhead plays the cut: the viewer cuts between three CSS-drawn shots at 1/3 and 2/3, and Keyfly's notes tick off.
  - **Step 3:** the frame tries 16:9, 9:16 and 1:1 (its width animates at a fixed height, using `cqw` of the viewer), and the export bar fills to "Ready".
  - **Fallback:** without JS or with reduced motion there is no pin, and the CSS defaults (all progress at 1) show the finished cut.
  - **Copy:** in `howItWorks` (content file), PLACEHOLDER.
- **Edit with words** (`src/components/edit-with-words/`, added 2026-10-31; the first of the new sections in `PLAN.md`): "Change anything *by saying it.*" The core differentiator, refining the first cut by asking. The heading is centred; the stage spans the full column. It is captioned "Illustrative interface".
  - **`CommandCut`** (client), redesigned 2026-10-31 as a **before and after**; the mock editor with a striped timeline looked dated. Three columns on wide screens (stacked below 900px):
    - **Before:** the first cut, dimmed, with its facts as mono chips (0:42 · 16:9 · 8 cuts) and a clean bar of its shots.
    - **The ask:** a glowing prompt pill where the ask types itself in, Keyfly's reply beneath, and a mint line with a running light and an arrowhead from Before to After.
    - **After:** the same cut with the ask applied, with a mint edge and an "● After" label.
  - **What lights mint:** whatever the ask changed (`data-edit` on `.stage`, `data-changed` on the facts):
    - **shorter:** 0:30, and the shots shrink;
    - **pauses:** 0:36, and the dotted pauses close;
    - **captions:** words on the picture, plus a "Captions" chip;
    - **warm:** a grade, warm shots and a "Warm grade" chip;
    - **vertical:** the frame narrows to 9:16 at the same height, and "9:16";
    - **pace:** each shot is cut in two, and "15 cuts".
  - **Tabs:** six numbered tabs choose the ask. The one in play fills along its foot for 4.6s while it waits, then the next plays. It holds while hovered or focused, and on narrow screens the tabs scroll sideways. With reduced motion it waits for a click and changes without easing.
  - **Layout** (tidied 2026-10-31; a list-plus-slider restructure was tried and reverted at the team's request):
    - The three columns share one set of rows through `subgrid` (labels "Before · Your ask · After", pictures, facts, shot bars), so everything lines up across, and the prompt is centred against the pictures.
    - The pictures are `aspect-ratio: 16 / 9` boxes; a size container there would stop the subgrid from sharing rows.
    - **The centre:** the ask column's body is a `1fr auto 1fr` grid, so the pill sits exactly on the pictures' middle and the reply hangs below it (a tick and a fixed two-line height, aligned to the pill's text). A `.connector` around the pill draws one straight line through its centre across both column gaps (`--cg`), from Before's edge to an arrowhead at After's edge, with the light running behind the pill.
    - The six tabs form an even bar as wide as the comparison (three per row below 1180px; scrolling sideways below 900px).
    - The shot layout is computed in a pure function, so render doesn't reassign variables (React lint).
  - **Copy:** `editWithWords` in the content file, all PLACEHOLDER until the team confirms which follow-up edits are real.
  - **Flight thread:** it crosses from How it works' channel to the left margin in the gap before this section and runs down beside it.
- **You make the calls** (`src/components/your-call/`, added 2026-10-31; the answer to "black box" AI): "Keyfly decides. *You have the final say.*" Heading laid out like Use cases; captioned "Illustrative interface". Earlier versions were dropped as not matching the page: a timeline panel with cards, an annotated diagram, and an editable sentence. The team then picked this structure from three options.
  - **`Inspector`** (client): the Keyfly editor with its inspector open, in the same window language and values as How it works.
    - **Chrome:** "Launch Video · Keyfly", and "4 decisions · N changed" in mint.
    - **Viewer:** the opening shot per take (a `Preview`), a "● Take N" tag, a "Chapter 2" lower third with a three-step hold bar, and music and voice level meters.
    - **Inspector panel:** "Inspector · Keyfly's decisions", four rows (index, label, a "Keyfly's pick" / mint "Changed" state, and a segmented switch; a mint point marks Keyfly's pick). The row in focus has a mint edge and shows "Why" with the reason. "Back to Keyfly's cut" sits at the foot (disabled until something changes).
    - **Timeline:** numbered diamond markers (01–04) where each decision acts, the ruler, T1 chapter title, V1 clips, A1 music level and A2 voice waveform, with the playhead on a rail.
  - **What lights up:** the decision in focus lights its marker, the clips or title involved, and its part of the viewer (`data-active` on `.window`).
  - **Focus changes only on click,** not hover: a hover-driven focus opened and closed reasons under the pointer and made clicks miss.
  - **The self-running demo:** until a switch is touched, each decision in turn tries its other options and returns, every 1.7s, while on screen and not hovered or focused. Reduced motion is read with `useSyncExternalStore`.
  - **Narrow screens:** below 900px the inspector moves under the viewer, with its rows in 2 columns, then 1.
  - **Copy:** `yourCall`, PLACEHOLDER until the team confirms which decisions Keyfly exposes.
- **One edit, every format** (`src/components/every-format/`, added 2026-10-31, rebuilt 2026-11-02): "One edit. *Every screen.*" Heading laid out like Use cases; captioned "Illustrative interface". Dropped before it: an export window, four screens in a row, a scroll-driven reframe, a 3D carousel and a reframe editor window (too like You make the calls). The team then picked "one frame that morphs".
  - **`Morph`** (client), no window: three columns over a bar of tabs.
    - **Left:** "Format 02 / 04", then the ratio in large mono type with the mint gradient, its name in the serif italic, and its pixel size.
    - **Middle, the stage** (`--h` tall, a size container): faint dashed guides of every shape, and one frameless picture with a mint edge, crop marks and a ratio tag, whose width and height ease (0.8s) to the format's shape (`min(100cqw, 100cqh × r)`). Inside, the CSS-drawn 16:9 shot (dusk through a window, a presenter) stays centred on the subject (`left: clamp(...)` in container units) and the captions re-flow.
    - **Right:** "Made for" (the format's platforms, in large type) and "Keyfly keeps" (three mint-checked lines).
    - **Beneath:** four equal tabs (index, shape glyph, ratio, name) styled as Edit with words' tabs; the one up fills along its foot while it waits.
  - **Turning:** the next format every 4.2s while on screen and not held, until a tab is clicked. Reduced motion: no auto-turn, changes at once.
  - **Narrow screens:** the ratio and name sit in a row above the stage, the tabs show only glyph and ratio, and the lists go beneath.
  - **Copy:** `everyFormat`, PLACEHOLDER until the team confirms Keyfly's export options.
- **On brand, every time** (`src/components/on-brand/`, added 2026-11-02; the team confirmed that day that Keyfly has a brand kit): "Your brand. *On every cut.*" Heading laid out like Use cases; captioned "Illustrative interface". Dropped the same day: an exploded 3D layer stack (not well aligned) and Plain cut | Kit | On brand (too like Edit with words). The team then picked "one brand, every video".
  - **`BrandReel`** (client):
    - **Kit bar:** "Brand kit" and "N/4 applied · 6 videos" above an even bar of four cells between hairlines (index, sample, name, detail, a ring that becomes a mint check): Your logo, Your colours, Your font, Title style. The item just applied gets a mint line along its foot.
    - **Reel:** beneath, in the column with painted soft edges, six illustrative videos in their own shapes (Launch 16:9, UGC 9:16, Podcast 1:1, Explainer 16:9, Product Demo 4:5, Montage 16:9; the use-case `Preview`s, `bleed`) drift sideways as one track (two copies, `translate: -50%`, 64s). Each has a label and ratio beneath.
    - **What the kit changes,** set on `.reel` (`data-logo`, `data-colours`, `data-font`, `data-title`): the logo bug in the corner; a grade and a violet edge; the title in the serif italic with a mint first letter; the title's bar and weight.
    - **The scan:** each time an item applies, a mint scan line crosses the reel (0.9s), and each video changes as the line reaches it: just before the change, every tile gets `--delay` from where it stands, used as the transition delay (font family and style flip via `transition-behavior: allow-discrete`).
  - **Self-running:** one item every 1.7s, hold fully on brand 3.2s, then start again; while on screen and not held. Clicking a cell toggles that item and stops it. Reduced motion: everything applied, the reel still, no scan.
  - **Narrow screens:** the kit becomes 2 × 2 (names only on phones); the reel is shorter.
  - **Gotcha:** the heading uses `.title`, so the videos' titles are `.vidTitle`.
  - **Copy:** `onBrand`, PLACEHOLDER until the team confirms what the brand kit holds.
- **Works where you work** (`src/components/anywhere/`, added 2026-11-02): "Start anywhere. *Finish anywhere.*" Heading laid out like Use cases; captioned "Illustrative interface". The team confirmed on 2026-11-02 that Keyfly runs as an app inside ChatGPT and Claude and the project then opens in Keyfly; browser–desktop sync and the example edits are PLACEHOLDER. Picked "one project, three doors" from three structures. It sits before Use cases because the flight thread's loop runs from Use cases straight to Download.
  - **`Doors`** (client): a 3 × 2 grid, `"tabs desktop log" / "chat hub browser"`.
    - **Top left, "Open it in":** the three surfaces as hairline rows (index, name, where); the one in use fills along its foot while it waits.
    - **Top right, "Project history":** v3 · v2 · v1, the current one lit, earlier ones read.
    - **Surfaces** (each captioned above, so wires meet the window): Desktop app (window, sidebar, viewer, export bar that fills); Chat (generic chat panel titled "ChatGPT · Claude", the ask, the reply and a Keyfly app card with "Open in Keyfly"; no official logos); Browser (address bar `app.keyfly.si`, viewer whose captions appear when in use). The one in use has a mint edge; the others dim.
    - **The project** (centre, row 2): "One project · ● Synced", a thumbnail, "Launch Video · 0:30 · 16:9", the last change with its version, and a clip strip.
    - **Wires:** straight lines from the project through the gaps to each surface (`--cg`, `--rg`; the desktop wire also crosses the 30px caption). Each round, a bright streak runs in from the surface in use (0.7s), the project flashes, then streaks run out to the other two. Each wire is `clip-path`ped to its length, and the streak is a rail translated by its own length.
  - **Self-running:** the next surface every 3.6s while on screen and not held, until one is picked. Reduced motion: no pulses, no self-running.
  - **Narrow screens:** list, project, then chat and browser side by side, desktop and history (one column on phones); wires hidden.
  - **Copy:** `anywhere`.
- **FAQ, "Ask Keyfly"** (`src/components/faq/`, added 2026-11-02): "Ask Keyfly. *Anything.*" The team picked "Ask Keyfly" from three layouts, and chose to include the topics we don't have facts for yet, with placeholder answers.
  - **`Ask`** (client): two columns that share their top and bottom edges.
    - **Left:** eight questions as numbered hairline rows; the one in play has a mint edge, a tint and an arrow.
    - **Right:** a panel in the prompt box's glass (a mint line along its top): "● Ask Keyfly", "01 / 08", the question as sent (› …), the answer typing in with a mint caret (the rest is laid out but hidden, so the panel never jumps), and at its foot a link to the section that shows it (e.g. "Edit with words ↓") and "Next question →".
    - The first answer types when the panel first comes on screen. Nothing changes by itself after that: it is something to read.
  - **Accessibility and search:** every question and answer is also in the page as a visually hidden `<dl>`; the panel is decorative (`aria-hidden`, its controls out of the tab order).
  - **Narrow screens:** the panel sits above the list; asking scrolls it into view.
  - **Copy:** `faq`. Answers come from confirmed facts where we have them. Changing the cut, formats, ownership and privacy, and pricing are PLACEHOLDER; ownership, privacy and pricing say the details are coming rather than guessing.
  - **Flight thread:** the sweep to the footer now starts below the last section (`main [data-section]`), so the line runs down the right margin beside the FAQ and never crosses it.
- **`Shot`** (`src/components/shot/`): the CSS-drawn illustrative shot (dusk through a window, a presenter at 62% across), used by One edit, every format.
- **Use cases** (`src/components/use-cases/`, added 2026-10-31, redesigned four times the same day): the six prompt-box presets on a **jog wheel**, the dial editors spin to move through footage. Captioned "Illustrative previews". It is not pinned, so it fits any height. Earlier versions were dropped:
  - a pinned reel (broke on short laptop screens);
  - a boxed multicam switcher with a tile grid (the team asked for no grid or box shapes);
  - a frameless index beside a projection;
  - a copy of How it works' layout (the team wanted it different, yet matching the theme).
  - **Heading:** laid out like Download (eyebrow and h2 left, lead right), sharing the 1320px column with the gutter inside.
  - **`PresetDial`** (client), left: a round dial.
    - It has ticks, a knurled inner ring and a hub showing "02/06" and the format.
    - The six names sit along the radius around the rim. A fixed mint notch with a wedge of light reads the one up, and a mint line runs from the notch to the viewer.
    - The wheel position `pos` is a float tweened in JS (ease-out). Names are placed by `--a`, and the ticks and knurl turn by `--turn`.
  - **Turning the wheel, by scroll (changed 2026-10-31 at the team's request; it used to turn on a timer):**
    - The track (`data-live`) is 100svh plus 55svh per preset. The stage pins (sticky, 100svh), and the scroll turns the wheel one preset per stretch.
    - `detent()` makes the wheel rest on each preset for the middle half of its stretch and turn between them.
    - Dragging the wheel, clicking a name, the arrow keys, Home/End and 1–6 scroll the page to match (`undetent()` is the inverse). The dial is a `role="slider"`.
    - The pointer is only captured after a 4° turn, so clicks still reach the names. `touch-action: pan-y` keeps vertical swipes scrolling.
    - A mint arc around the hub shows how far through the six the wheel has turned. A hint under it reads "Scroll or drag to turn".
    - **Fallback:** it pins only where the stage fits the screen (content + 96px ≤ the window's height; re-checked by a `ResizeObserver` and on resize) and motion is allowed. Otherwise the wheel turns by drag, click and keys with a JS ease-out, and the hint reads "Drag or click to turn".
  - **Right:** the preset up, at its format. The frame keeps a 16:9 height, capped at 46svh, and takes the preset's width from the left edge, so the change animates. Below it are the title (serif italic mint), its line, its real prompt from `prompt.presets` typing in, and the mint "Try this prompt" button.
  - **Short screens:** the dial is capped at 64svh. Below 780px of height (wider than 860px) the frame caps at 38svh and the caption and prompt tighten, so the stage still pins on a 1366×553 laptop.
  - **Narrow screens (≤860px):** the order becomes viewer, wheel, then caption. The wheel lies on its side with only its top showing, the notch at the top and the names upright (46° apart). The hub hides.
  - **"Try this prompt":** dispatches `keyfly:prompt` with the preset's label. `PromptBox` listens, scrolls back to the hero and types that preset in.
  - **`Preview`:** a CSS-drawn loop at the use case's format, sized in `cqw`/`cqh` of its screen. `bleed` fills its parent edge to edge with no backing or corner marks, and stands 9:16 in the middle.
    - Launch: title cards on the beat.
    - UGC: a selfie with word-by-word captions.
    - Explainer: a diagram that builds.
    - Montage: fast cuts with a speed ramp.
    - Product demo: a cursor click, then a zoom.
    - Podcast: a speaker, a waveform and a quote.
  - **Copy:** in `useCases` (content file), PLACEHOLDER.
- **Download** (`src/components/download/`, added 2026-10-31, redesigned twice the same day): "Land Keyfly *on your desktop.*" A **landing played by the scroll**, the page's finale, where the flight thread lands too. The installer-window version was dropped because the team wanted each section to be its own, yet match.
  - **Heading:** laid out like Use cases (eyebrow and h2 left, lead right).
  - **`Landing`** (client): the track (`data-live`, 260svh) pins a 100svh stage. The scroll then plays the flight:
    - Lift-off (first 12%): the icon rises off the source.
    - Flight (to 82%): a copy of the unaltered app icon (`/brand/app-icon-macos.svg`) flies one loop of the flight path, shrinking onto the platform. The mint trail draws to `--fly`, and 26 runway lights along the path come on as it passes.
    - Landing: the platform glows, a ring goes out, and the primary button lights. It waits dimmed while in the air, but is always clickable.
  - **Readout above:** "● Installing Keyfly → {target}" (then "Landed"), the stages 01 Download · 02 Install · 03 Open, and a big mono percentage.
  - **Below the flight:** platform tabs (plain text, mint underline, a "Your system" tag), the step, and the buttons.
  - **Platform:** detected with `useSyncExternalStore`. Phones get "On a phone? Keyfly runs in the browser."
  - **Destinations:** generic shapes, never an operating system's own artwork: an Applications folder (macOS) and a desktop monitor (Windows). Other systems, Linux included, see macOS until they pick.
  - **Buttons:** each platform's `href` in `download.platforms` is `null` until its build is published.
    - With an `href`, the primary button is "Download for {platform}" and "Open in your browser" is secondary.
    - Without one, "Open in your browser" (`app.keyfly.si`) is primary, beside a "{platform} · Coming soon" chip.
  - **Fallback:** it pins only where the stage fits the screen (content + 96px ≤ the window's height) and motion is allowed; otherwise it shows landed. The server HTML shows it landed too.
  - **Pinned stages** (here and in Use cases) sit at the top of the pin (padding `clamp(64px, 10vh, 84px)`, clear of the header), not centred, so they follow their heading without a gap.
  - **Copy:** the Windows step is PLACEHOLDER. The macOS step and the footnote ("Keyfly.si is a Cevrynt Inc. product") come from the installer art.
- **Performance rules** (2026-10-31, after the hero lagged; measured frame by frame, the hero went from about 9 to 26 fps in a GPU-less test browser, How it works from 18 to 28, Use cases from 27 to 47):
  - **Animate only `transform` and `opacity`.** Animating borders, backgrounds or shadows (as the timeline floor's breathing clips did) repaints everything around them every frame.
  - **One moving layer, not many:** the hero's timeline floor slides as one reel (`.reel`, `will-change: transform`), not one strip per track.
  - **No masks or blend modes over moving content:**
    - the floor's edge fades are night painted over it (`.stage::after`), not a mask;
    - the hero grain uses a normal blend at 0.035, not `overlay`.
  - **No filters on page-tall SVG paths** (the flight thread): a filter there repaints the whole page height on every scroll. The comet's glow comes from its wide soft stroke, and only the small head keeps a drop-shadow. The always-running light pulses were removed.
  - **Nothing runs out of sight:**
    - `PauseOffscreen` sets `data-offscreen` on a section once it leaves the screen, and `globals.css` pauses every animation inside it (hero, Use cases);
    - the background glows are still (no drift), and an unseen one is hidden (`data-off`).
  - **Per-frame scripts do lookups, not measurements:** the thread reads its comet position from a table of points (every 4px) built once.
  - **React:** the jog wheel's ticks are built once and `Preview` is memoised, so turning the wheel doesn't re-render the previews.
- **Gotchas:**
  - **Don't name a custom property `--a`:** the prompt box registers `--a` as an `<angle>`, which turns any other value into "0deg" and silently invalidates the declaration using it.
  - **Grid overflow:** grid containers that hold the scrolling chip row need `grid-template-columns: minmax(0, 1fr)`. Without it the row's `max-content` width widens the page on mobile.
  - **No large blur:** never put a large `filter: blur()` in a 3D, animated stage.
  - **Smooth scrolling:** `html` scrolls smoothly, so test scripts must pass `behavior: "instant"`.
- **Verifying:** Playwright (pre-installed Chromium) screenshots at 1440×900 and 390×844, plus `reducedMotion: "reduce"`.
