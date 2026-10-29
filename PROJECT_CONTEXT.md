# Keyfly Marketing Website — Project Context

Last updated: 2026-10-29

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

## Design direction: "Cinematic" (changed 2026-10-29)

On 2026-10-29 the team replaced two directions in turn: the light "Paper and mint", then a dark glass "Relay" style. The current reference is a screen recording of an architecture studio's site. It is followed for **style and motion only**: its copy, brand, projects and numbers are not used. cardboard.ai is still not a model.

- **It must read as a video editor.** The client's review (2026-10-29) said the photo-led hero looked like a photography site, so the hero is now the Keyfly editor itself. It shows a viewer, transport and timeline, and scrolling drives the playhead. Every section should show editing, not just footage.
- **Photography as footage.** The shots play in the viewer, and the camera moves in as you scroll. The current shots are Unsplash photos (`src/assets/hero/CREDITS.md`) until Keyfly has its own footage.
- **Huge words on the frame.** Inter at 420 with tight tracking, set at different places on the frame (corners, middle), revealed letter by letter out of a blur. The final full stop of a phrase is the mint point.
- **Quiet chrome.**
  - The header is only the logo and a small spaced-capitals call to action.
  - Navigation is a floating bar at the bottom.
  - Faint quarter grid lines over the photos; a running timecode as a video-editor detail.
- **Night surfaces, mint rare.** The body is `data-tone="night"`. Mint marks the landing point, the primary button and small indicators.
- **Respect `prefers-reduced-motion`:** cuts instead of moves, and no preloader.
- **Built step by step.** The header and hero come first. Each later section is added only after the previous step is agreed.
- **Unused components:** those from the "Relay" direction stay in `src/components/home/` but are not rendered. They are features, statement, desktops, overview, get-keyfly, tool-strip and light-field, with their helpers. Reuse or delete them as the next steps are agreed.
  - `feature-panels.jsx` and `in-view.jsx` are reused by the tools showcase.
- **No other company's software in photos:** a competitor's editor on screen would mislead.

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
  - **Optical centring:** the box is taller than the type (point above, descenders below), so where the logo sits beside text it is lifted by `OPTICAL_LIFT` (9.3% of its height). In the header and mobile menu (`translate: 0 -9.3%`) its letters centre on the bar's centre line with the navigation and the menu button. This was measured at 36.0px against nav text at 35.9px, desktop and 375px.
- `src/components/logo/animated-logo.jsx` renders that markup inline, so the colours follow the tone: Ink + deep mint on Paper, Paper + soft mint on Night, exactly the kit's pairs. It is used by `Logo` everywhere (header and mobile menu 32px tall, footer 28px, styleguide) and directly on the homepage.
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

## Header and footer (step 3)

The root layout renders the skip link, `SiteHeader`, `<main id="main">` and `SiteFooter`, so pages render a fragment or `<div>`, never their own `<main>`. Navigation labels and targets live only in `src/content/navigation.js`; the current menu is a placeholder until the pages are agreed.

- **Header** (`src/components/header/`, rebuilt 2026-10-29):
  - Server-rendered with no band. It holds the logo top left and "↘ Get Keyfly" in small spaced capitals top right.
  - The header element lets clicks through (`pointer-events: none`), so its children turn them back on.
  - `HeaderShell` writes `data-tone` from whatever sits under the header's centre line.
- **Menu bar** (`menu-bar.jsx`), on all screen sizes:
  - A floating bar at the bottom centre names the current section, taken from the nearest `[data-section]` at the middle of the viewport. A mint line along its foot fills as the page scrolls (CSS scroll-driven).
  - It opens the menu: a native modal `<dialog>` on Night that traps focus, closes on Escape and makes the page behind inert. It shows big numbered links, the CTA and a note.
  - It opens as a circle growing from the bar using CSS `@starting-style`. Do not reintroduce rAF-timed opening; it stalls when frames are throttled.
  - It closes through `data-closing`, then `dialog.close()`, and scrolling is locked through `html[data-scroll-locked]`.
  - Sections mark themselves with `data-section="Label"`.
- **Footer** (`src/components/footer/`, rebuilt 2026-10-29 in the hero's pattern): the page's last shot, a full frame (`min-height: 100svh`, `data-section="Get Keyfly"`).
  - The hero's first photo returns full-bleed, so the page bookends, with the same shade and faint quarter grid. The camera pushes in (scale 1.18 → 1.02) as it scrolls into view (CSS `view()` timeline).
  - Top left: a small dark "↘ Get Keyfly" tab and a one-line note. Top right: link groups (Explore, Company) in spaced capitals.
  - Bottom: copyright and back-to-top on a hairline, then the brand lockup (unaltered) at the full width of the frame, playing its light-painting intro when it comes into view (`Logo play="view"`).
  - Content clears the fixed header and the menu bar.
- **`Magnetic`:** wraps a primary CTA so it leans toward the pointer. Not used on touch devices or with reduced motion.

## Homepage (step by step, from 2026-10-29)

`src/app/page.jsx` renders Hero → ToolsShowcase (`#product`) → Glance → Download (`#download`); later sections are added one step at a time. All copy lives in `src/content/home.js`, and lines marked `PLACEHOLDER` wait for the confirmed product description, so the page is `noindex` until then. The menu still lists Product, How it works and Download, whose sections don't exist yet.

- **Hero** (`hero.jsx` markup, `hero-shell.jsx` motion, written straight to the DOM): 460svh tall with a sticky 100svh stage.
  - The last screen stays pinned while the next section rises over it (that section has `margin-top: -100svh`), so the scroll progress leaves it out (`height - 2 × viewport`).
  - **An illustration of editing in Keyfly**, not a screenshot. The stage holds the editor (`.app`) between the site header and the menu bar:
    - **Viewer:** a wide, rounded monitor with rule-of-thirds guides and a "● Viewer" tag.
    - **Transport:** "Launch film / Keyfly", ⏮ ▶ ⏭, and the timecode.
    - **Timeline:** a ruler, T1 title clips, V1 filmstrip clips (the shot repeated as thumbnails, with keyframe diamonds at their ends) and A1, a waveform with 12 beat markers, so the cuts at 1/3 and 2/3 land on beats.
  - **Three shots:** wide (a filmmaker at a tripod), medium (an operator with a rig) and close (the camera's screen framing the sunset).
  - **Scroll = playhead:** scrolling moves the mint playhead (`--p` on the section, `translate` in `cqw`). Where it crosses a clip boundary the viewer cuts (a few frames' dissolve) to the next shot. The camera dollies in on each shot, and the clips under the playhead light up (`data-clip` / `data-active`).
  - **Titles:** each shot's three words are titles on the video, at set places in the viewer (`at`; sized in `cqw` of the viewer), revealed letter by letter out of a blur. The shot's note plays as a caption (subtitle boxes) in the free corner.
  - **h1:** the first shot's words, kept as a visually hidden heading. The visible titles are decorative.
  - **Preloader: a camera viewfinder** (redesigned 2026-10-29; the team rejected a plain black counter).
    - Corner brackets frame the screen, with camera labels: KEYFLY, ● REC, SHOT 01 / 03, and a timecode that runs to one second as it loads.
    - In the centre, the kit's symbol (dark pair, unaltered) draws its line with the loading progress while autofocus brackets hunt around it.
    - At 100% (`data-loaded`) the point lands and the brackets lock on in mint. The frame then opens like cinema bars sliding apart while the camera pushes in on the first shot (scale 1.14 → 1). The first words follow (`data-ready`).
    - The header stays hidden until then (`data-intro` on the hero: pending → loading → done; `body:has()` rules in `header.module.css`).
    - Keep the preloader solid Night: blurred tiles over a loading photo showed seams.
    - Without JS a `<noscript>` rule shows the first shot's words and the preloader clears itself.
    - With reduced motion there is no preloader, and shots and words change as cuts.
  - **Small screens:** a tall viewer crop and a slimmer timeline; title clips show only "T"; the caption sits between the middle and bottom titles; the transport buttons hide.
- **Tools showcase** (`tools-showcase.jsx`, added 2026-10-29), after the reference's featured-project card: one full screen that rises over the pinned hero.
  - **Backdrop:** an Unsplash desk photo (`src/assets/tools/CREDITS.md`) with the same faint grid.
  - **Left:** a frosted panel with "Keyfly's own tools 01 / 03", the tool's name huge and revealed letter by letter out of a blur (with the mint point), a line about it, and ◀ ⏸ ▶ controls with a timer line.
  - **Right:** the tool's illustrative interface panel (`feature-panels.jsx`: Director, First cut, Beat sync), replayed on each slide, captioned "Illustrative interface".
  - **Autoplay:** every 7s, only while half on screen. It pauses on hover, focus or the pause button, and is off with reduced motion. Inactive slides are `inert`.
  - **Copy:** the tools and lines are in `toolsShowcase` (content file), marked PLACEHOLDER.
- **Glance** (`glance.jsx` markup, `glance-shell.jsx` motion, added 2026-10-29), after the reference's numbers screen: a pinned frame on an Unsplash film-set photo (credits in `src/assets/tools/CREDITS.md`).
  - **Content:** a two-line statement top left and three true figures in the corners, in a `<dl>`: 09 tools of its own, 03 desktops, 01 editor. Never add numbers that aren't facts.
  - **Count-up:** the figures count up from 00 as the section rises into view.
  - **The point grows:** once pinned, the mint point in the centre grows (a `clip-path: circle()` on a mint layer, so the edge stays crisp) until it fills the frame, while the figures fade.
  - **Header over the mint:** while the mint covers the header line, the section sets `data-tone="paper"` so the header turns Ink. `HeaderShell` reads tones one frame late on purpose, so section changes made in the same frame are in place.
  - **Fallback:** it only becomes 280svh tall and pinned (`data-live`) once the script runs. Without JS or with reduced motion it is one still frame with the final figures.
- **Download** (`download.jsx`, added 2026-10-29), on the mint the glance point grows into.
  - **Seamless join:** same soft mint and dot grid, with the dots `background-attachment: fixed`, so the two frames meet without a seam. The section is `data-tone="paper"`, so the header reads Ink.
  - **Words:** "Land / your next / shot." are set on the frame like the hero's, in Mint ink, with a deep mint full stop. They arrive letter by letter when in view (`InView`).
  - **Platforms:** macOS, Windows and Linux as dark slates in the free corner. Each reads "Soon" until its `href` is set in `downloadSection`.
  - **Small screens:** the three words stack together under the label and the slates take the bottom.
- **Gotchas:**
  - **Word spacing:** keep the spaces between inline-block word masks, not inside them, or the words run together.
  - **No large blur:** never put a large `filter: blur()` in a 3D, scroll-animated stage. Chrome drops the whole frame once the page scrolls.
  - **Clipping wrapped text:** `clip-path` on a wrapping inline element clips only its first line, so use a block.
  - **Smooth scrolling:** `html` scrolls smoothly, so test scripts must pass `behavior: "instant"`.
- **Verifying:** the in-app browser pane often captures blank or stale frames when it is hidden or scrolled. Headless Chrome driven over the DevTools protocol (scroll, then `Page.captureScreenshot`; `Emulation.setEmulatedMedia` for reduced motion) gives reliable shots.
