# Keyfly Marketing Website — Project Context

Last updated: 2026-10-31

The durable handoff for anyone (people or coding agents) working on the Keyfly website. Update it whenever a lasting decision changes. The step-by-step build order lives in `PLAN.md`.

## Product (what we know so far)

- Keyfly is a desktop app for macOS, Windows and Linux, made by Cevrynt Inc.
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

The root layout renders the skip link, `SiteHeader` and `<main id="main">`. Pages render a fragment or `<div>`, never their own `<main>`. There is no footer until it is designed again. Navigation labels and targets live only in `src/content/navigation.js`. The menu is a placeholder (Product, Use cases, Download) until those sections exist.

- **`SiteHeader`** (`src/components/header/site-header.jsx`, a client component):
  - Layout: the logo, centred links, then "Sign in" and the mint "Open Keyfly" button. Both buttons go to the app.
  - At the top of the page it is an open bar. Once scrolled (`data-scrolled`), it gathers into a floating glass pill.
  - It slides away while scrolling down past 240px (`data-hidden`) and comes back on the way up.
  - A light slides under the hovered or focused link (`--lx`, `--lw`).
  - At 860px and below the links fold into a menu panel behind a two-line button, which closes on Escape. Below 420px only the menu button remains.

## Homepage (step by step, from 2026-10-30)

`src/app/page.jsx` renders Hero → HowItWorks (`#product`) → UseCases (`#use-cases`) → Download (`#download`). All copy lives in `src/content/home.js`. Lines marked `PLACEHOLDER` wait for the confirmed product description, so the page is `noindex` until then.

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
  - **Continuity:** the hero's playhead runs on down into the section (`.leadIn`), and the hero's backdrop fades to Night at its foot.
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
- **Use cases** (`src/components/use-cases/`, added 2026-10-31, redesigned the same day): the six prompt-box presets as live feeds on a **multicam switcher**, captioned "Illustrative previews". The first version, a pinned reel under a playhead, broke on short laptop screens and was dropped. This one is not pinned, so it fits any height.
  - **Program monitor (left):** the feed on air plays large, with a cut-in and a white flash on each cut. It has:
    - an "● On air" tally, the CAM number and a running timecode;
    - viewfinder corners and rule-of-thirds lines.
  - **Under the monitor:** the number and name, the line, the format and the mint "Try this prompt" button. A mint countdown line runs to the next auto-cut.
  - **Sources (right):** a 2×3 grid of CAM 01–06 tiles, each a live `Preview` with a tally light (mint on air) and a key number. On narrow screens it becomes three columns below the monitor.
  - **Cutting:** click a tile or press 1–6 while the switcher has focus. It auto-cuts every 6s while at least 35% of it is on screen and it isn't hovered or focused. All previews pause (`data-paused`) when it's off screen. With reduced motion there is no auto-cut and the previews hold still.
  - **"Try this prompt":** dispatches `keyfly:prompt` with the preset's label. `PromptBox` listens, scrolls back to the hero and types that preset in.
  - **`Preview`:** a CSS-drawn loop at the use case's format, sized in `cqw`/`cqh` of its screen. `bleed` fills a monitor edge to edge and pillarboxes 9:16.
    - Launch: title cards on the beat.
    - UGC: a selfie with word-by-word captions.
    - Explainer: a diagram that builds.
    - Montage: fast cuts with a speed ramp.
    - Product demo: a cursor click, then a zoom.
    - Podcast: a speaker, a waveform and a quote.
  - **Copy:** in `useCases` (content file), PLACEHOLDER.
- **Download** (`src/components/download/`, added 2026-10-31): the closing call to action, centred: "Land Keyfly *on your desktop.*"
  - **`Installer`** (client) animates the install moment from the brand kit's DMG art ("Drag Keyfly to Applications to install"):
    - A copy of the unaltered app icon (`/brand/app-icon-macos.svg`) lifts off and flies one loop of a flight path, like the symbol's gesture, leaving a mint trail. It lands on the platform with a glow and a ring, and the icon appears in place.
    - It runs on an SVG SMIL timeline (4.8s loop) that is paused off screen. With reduced motion the icon shows already in place.
    - Destinations are generic shapes, never an operating system's own artwork: an Applications folder (macOS), a desktop monitor (Windows), an app grid (Linux).
  - **Platform:** the visitor's system is detected (`useSyncExternalStore`) and marked "Your system". Tabs switch platform. Phones get "On a phone? Keyfly runs in the browser."
  - **Buttons:** each platform's `href` in `download.platforms` is `null` until its build is published.
    - With an `href`, the primary button is "Download for {platform}" and "Open in your browser" is secondary.
    - Without one, "Open in your browser" (`app.keyfly.si`) is primary, beside a "{platform} · Coming soon" chip.
  - **Copy:** the Windows and Linux steps are PLACEHOLDER. The macOS step and the "Keyfly.si is a Cevrynt Inc. product" line come from the brand kit's installer art.
- **Gotchas:**
  - **Grid overflow:** grid containers that hold the scrolling chip row need `grid-template-columns: minmax(0, 1fr)`. Without it the row's `max-content` width widens the page on mobile.
  - **No large blur:** never put a large `filter: blur()` in a 3D, animated stage.
  - **Smooth scrolling:** `html` scrolls smoothly, so test scripts must pass `behavior: "instant"`.
- **Verifying:** Playwright (pre-installed Chromium) screenshots at 1440×900 and 390×844, plus `reducedMotion: "reduce"`.
