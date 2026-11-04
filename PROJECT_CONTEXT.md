# Keyfly Marketing Website — Project Context

Last updated: 2026-11-02

The durable handoff for anyone (people or coding agents) working on the Keyfly website. Update it whenever a lasting decision changes. The step-by-step build order lives in `PLAN.md`.

## Product (what we know so far)

- Keyfly is a desktop app for macOS and Windows (the team confirmed on 2026-10-31 that there is no Linux build), made by Cevrynt Inc.
- **Spelling: "KeyFly"** (the team's decision, 2026-11-03), as in the app, the pricing API and the desktop app page. All site text uses it. The logo artwork keeps the brand kit's wordmark as drawn, since brand files are never redrawn.
- Its symbol, "Flight path", stands for the camera's flight and the moment a shot lands, so the product is about video.
- Domain: probably `keyfly.si` (from the installer art). `siteConfig.url` falls back to it; set `NEXT_PUBLIC_SITE_URL` to override.
- **Read from the app (2026-11-03)** and used in the copy: the AI director writes the storyboard, voice-over and motion graphics; 91 templates in 11 categories; brand kits hold logo (plus versions and banners), five colours, font, tone of voice and voice-over (AI or cloned), and can be filled from a website; help answers (own footage, changing a scene, Revert, talking heads: silences and filler words cut, captions, zooms); "Your projects stay yours and you can always export them"; help@keyfly.si.
- **Legal pages** (added 2026-11-03, because the app's sign-in links to `keyfly.si/terms` and `keyfly.si/privacy`): `src/app/terms/` and `src/app/privacy/`, built by `LegalPage` (`src/components/legal/`) from `src/content/legal.js`. Until the team sends the full text, each shows an amber "Being finalised" chip and help@keyfly.si; Privacy also quotes what the app itself states (marked "not the privacy policy"). Both are `noindex`. Never write legal terms ourselves. The footer's bottom bar links to them.
- Still open: real product screenshots or footage, and the ChatGPT and Claude app install links. Do not write product claims the app or the team hasn't confirmed.

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

## Positioning: "the AI video editor that works your way" (2026-11-04)

The team asked how to beat the main competitor rather than follow it. A prompt box that makes a video is the same promise on both sites, so the page now leads with what KeyFly does that closed AI editors don't, all confirmed in the app:

- **Mac, Windows and the web** (the competitor's own title says "Browser and Mac"), plus ChatGPT and Claude.
- **Your own AI:** Claude Code, Codex, Cursor, Antigravity or any ACP agent, without AI minutes.
- **Your own editor:** the timeline goes to Final Cut, Resolve, Premiere or Avid with every file it uses.
- Also: the AI director explains itself; the brand kit fills itself from your website; footage stays local in the desktop app; projects never expire.

Never name the competitor on the site. Next, when the team has them: real videos made with KeyFly and customer proof.

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

The root layout renders the skip link, `SiteHeader`, `<main id="main">` and `SiteFooter`. Pages render a fragment or `<div>`, never their own `<main>`. Navigation labels and targets live only in `src/content/navigation.js`. The menu links to Product, Use cases, Pricing and Download.

- **`SiteHeader`** (`src/components/header/site-header.jsx`, a client component):
  - Layout: the logo, centred links (Product, Use cases, Integrations → `#tools`, Pricing, Download), then "Sign in" (`app.keyfly.si/login`) and the mint "Start free" (`app.keyfly.si/signup?plan=free`, the Free plan's own sign-up link; updated 2026-11-03).
  - At the top of the page it is an open bar. Once scrolled (`data-scrolled`), it gathers into a floating glass pill.
  - It slides away while scrolling down past 240px (`data-hidden`) and comes back on the way up.
  - A light slides under the hovered or focused link (`--lx`, `--lw`).
  - At 1000px and below (860px before Integrations was added, 2026-11-03) the links fold into a menu panel behind a two-line button, which closes on Escape. Below 420px only the menu button remains.

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

## Product page (`/product`, from 2026-11-04)

Planned from the research in `reports/AI video editor product pages.md` (16 competitors' product pages plus best practice; notes in `research_notes/AI video editor product pages/`). Cardboard has no product page at all, so a complete, checkable one is itself a difference. The page goes deeper than the homepage instead of repeating it: it explains how each part works, with no re-mounted homepage showpieces. Built **one section at a time**, each agreed before the next. Planned order, with a sticky sub-nav: Hero → Make → Direct → Footage → Brand → Deliver → Your way → AI minutes → Close. Copy lives in `src/content/product.js`; the page is `noindex`. The header's "Product" now links here (it pointed at `/#product`); the footer's Product column adds "Overview".

- **Hero** (`src/components/product/`, 2026-11-04; rebuilt the same day: the first version, heading beside a row of stage cards, read like a section, not a hero). Now centred and oversized like the homepage hero: "● Product" pill, h1 "The AI video editor, *shown in full.*", the lead, Start free (solid) / Download (ghost). Then **one focal picture**:
  - **`Anatomy`** (client): an illustrative KeyFly editor (chrome with a "macOS · Windows · Web" chip, "Launch Video · KeyFly" and a mint Export; the brand kit; the viewer playing the launch `Preview`; the AI director's note and the prompt box; a four-track timeline with pauses marked to cut and a running playhead), sized in `cqw` of the window. Beside it, the page's six stages as callouts, three a side, each **wired** (an SVG measured from layout offsets, so it shares the stage's tilt) from its inner edge, level to beside the editor, then to the near edge of the part it explains: Your way → the platforms chip, Brand → the kit, Footage → the voice-over track, Deliver → Export, Direct → the director's note, Make → the prompt box.
  - **Tour:** one stage at a time (every 3s while on screen) lights its callout, draws its wire in mint and rings its part with a ping. Pointing at or focusing a callout holds it; "Pause the tour" stops it (WCAG 2.2.2).
  - **Depth:** the stage is tipped back (`rotateX(22deg) scale(.93)`, perspective 2200px) and settles flat as it scrolls up (a view timeline, `entry 0%` → `cover 42%`, flat with no transform after). The editor's mint light spills up behind it.
  - **Facts** beneath, between hairlines: 91 templates · 9 motion styles · 4 frame shapes · 3 timeline formats · 5 places to run it; "Illustrative interface".
  - **Narrow screens (≤1100px):** no wires; the parts carry numbered badges and the callouts form a list under the editor in the page's order (`--o`); one column below 480px. Reduced motion: no tilt, tour, ping or playhead.
  - **Gotchas:** CSS Modules reject bare attribute selectors, so the parts are styled as `.window [data-spot]`; and a container's own `cqw` refers to the page, so the window sets no `cqw` sizes on itself.
- **The page sits in the homepage's `Scene`** (2026-11-04), so it has the same links between sections, focus pull, dissolve, page timeline in the margin and footer arrival. The hero is `data-section="Intro"` and has no `[data-main]` (a blur on its tilted stage would be costly and wrong for a hero); a `Divider ruler={false}` follows it.
- **Make** (`#make`, `make.jsx`, `builder.jsx`, 2026-11-04): "One sentence in. *Every layer out.*" Heading laid out like the homepage's sections; captioned "Illustrative interface". Goes deeper than the homepage's film: what goes in, and every layer that comes out.
  - **`Builder`** (client): two columns joined by a mint connector with a running light. **01 Start from:** three hairline rows (A sentence; Your footage; A template, "One of 91, Free and Premium"), the chosen one with a mint edge, and below them what goes in, in the prompt box's glass (the prompt with a caret; three clips with lengths; the "SaaS launch film" template card with a `Preview`, "16:9 · 25s · Editorial Minimal"). **02 KeyFly makes:** seven hairline rows, each an index, a small CSS picture, the name and a line: Storyboard (or **Your footage**, "the best moments kept; pauses and filler words cut", for the footage start), Voice-over ("Cloning on higher plans"), Motion graphics, AI images, Music bed ("Minimal tech · 122 bpm"; "Licensed for you"), Sound effects, Generated video ("Higher plans").
  - **Motion:** on view KeyFly "builds" the layers one by one (260ms each, a mint scan crossing each as it lands; unbuilt rows wait faint, only once hydrated); with all built it holds 4.2s and moves to the next start, while on screen, not hovered and not paused ("Pause" button, WCAG 2.2.2). Clicking a start chooses it and stops the cycle. Reduced motion: all built, nothing moves.
  - **Strip:** "Motion styles · Or let the AI pick" with the prompt box's nine styles as chips (from `prompt.styles`), and "91 templates Browse templates ↗" (from `useCases.templates`).
  - **Narrow screens:** columns stack (≤980px), no connector; below 560px each layer's tag drops under its line.
  - **Copy:** `productMake`. Tier tags only where the pricing API shows them (cloning, generated video).
- **Direct** (`#direct`, `direct.jsx`, `director-timeline.jsx`, 2026-11-04; redesigned the same day: a first version, the reply sticky beside scrolling notes, read like documentation): "Every cut comes with *the director's notes.*" The AI director **annotates its own cut**, like comments pinned to moments in a review, so it uses the site's own motif (a timeline and a mint playhead) and differs from the homepage's "You make the calls" (chips beside a preview) and the hero (wired callouts).
  - **`DirectorTimeline`** (client): one glass panel (the prompt box's glass, a mint line along its top). Chrome: "● AI director", "Cloud", the prompt (› …), "Worked for 43s · 18 steps". Bar: "Built *“Launch Video”*", Revert, Retry, "Used 6 AI minutes", Pause. Then the **note in play**, a card riding the playhead (kept inside the panel), above **the cut's timeline**: a ruler (0:00, 0:10, 0:20, and a mint "0:30 · End" line), and Video (five scene clips), Voice-over (waveform), Music (bars) and Look (a near-black-to-mint grade) tracks, with a dashed "After the cut" area beyond the end. Each note is a numbered diamond on its track at its time: 01 Hook (Video, 0:00), 02 Voice (Voice-over, with "Also fits: Bronwen, Elaine, Quinn"), 03 Music (Music), 04 Assumed (Look), 05 Self-check (on the end line; a five-segment meter to 3.4), 06 Next (three idea chips, after the cut). The chat box closes the panel.
  - **Tour:** the playhead moves from note to note every 3.4s while on screen (the note card slides with it); pointing at or focusing a diamond opens its note and holds it; clicking one stops the tour; "Pause" stops it (WCAG 2.2.2). Reduced motion: no tour or easing, the diamonds choose.
  - **Three ways to steer** beneath, a bar of three cells between hairlines: Ask in the chat (@ for a scene, / for a command), Change it yourself (every layer is a real track), Revert or retry.
  - **Narrow screens (≤860px):** the note card sits under the timeline (the playhead spans the tracks only) and the labels column narrows; below 560px the prompt and the end's label hide.
  - **Copy:** `productDirect`. The reply's fields, their labels, the chat box and "Used 6 AI minutes" are the app's (read 2026-11-04); the project, its values and the times the notes sit at are illustrative ("Illustrative project"). The self-check is stated only as a score out of five until the team says what it measures.
- **Footage** (`#footage`, `footage.jsx`, `cleanup.jsx`, 2026-11-04): "Your recording, *minus the chores.*" The homepage's "Your footage" contrasts chores by hand with one sentence; this shows the **mechanism**, on one illustrative talking-head recording ("founder-update.mov").
  - **The recording** (2026-11-04, replacing the CSS-drawn `Shot`, which read as a still mannequin): `public/video/footage-loop.mp4` (8 s, 1280×720, H.264, no sound, 0.8 MB) and its poster `footage-loop.webp`. An illustrative presenter speaking to camera in the site's dusk room (the same window, lamp and desk as `Shot`, a city whose windows light and dim, a laptop's mint glow): the mouth moves with the syllables, the head nods, eyebrows lift on stressed words, blinks, a hand rises on the main point, and a slow handheld drift. **Its two pauses (2.35–3.05 s, 5.75–6.25 s) match the transcript's**, where the mouth closes and the head settles. Every motion repeats every 8 s, so it loops without a seam. It plays muted while on screen and not paused (the Pause button stops it too); reduced motion rests on the poster. Source: `scripts/footage-loop/` (`loop.js` draws it on a canvas; `node scripts/footage-loop/record.mjs`, then open `http://127.0.0.1:4418/?record` in Chrome for 8 s to save the MP4 and poster; `?t=2.5` shows one frame). Replace it with a real recording when the team has one.
  - **`Cleanup`** (client): left, the picture (the recording above, in a mint-edged frame) with the file name and its length above and its speech track below (pauses hatched amber); right, the transcript in the prompt box's glass, as tall as the picture, word by word (filler words amber with a dotted underline, pauses as "⏸ 1.4s"), with a log at its foot. Beneath both, **four passes** as a bar of cells (index, name, detail, a ring that becomes a mint tick; the pass in play gets a mint line along its foot).
  - **The passes apply in order, and what each does stays** (`data-done` on the stage, "1 2 3 4" matched with `~=`): 1 Silences: the pauses close on the track and fold out of the transcript; 2 Filler words: "um, uh, like, you know" fold away; 3 Captions: "Every morning, just *tap* once." appears word by word on the picture; 4 Zooms and callouts: the shot zooms on the speaker (1.3×) with a "Zoom on the speaker" tag, and a "Tap once" callout lands. The length counts down (0:48 → 0:46 → 0:44) and the log gains a line per pass ("2 pauses closed · −2.3s", "4 filler words cut · −1.5s", "Captions on · 23 words", "1 zoom · 1 callout").
  - **Motion:** while on screen it runs the passes (1.7s each), holds 3.6s, then starts again; clicking a pass shows the cleanup up to it and stops the cycle; "Pause" stops it (WCAG 2.2.2). Reduced motion: every pass done, nothing moves.
  - **Where your footage goes** beneath, between hairlines: "In the desktop app: your footage stays on your computer. It is uploaded only when a cloud AI step needs it." and "Always: your projects stay yours, and you can always export them, even if you cancel." with "Download for Mac or Windows ↓" (`/#download`).
  - **Narrow screens:** stacked below 980px, the passes 2 × 2.
  - **Copy:** `productFootage`. The four passes and the data lines are the app's (help and data notes); the recording, its words and its lengths are illustrative ("Illustrative recording").
- **Brand** (`#brand`, `brand.jsx`, `kit-scan.jsx`, 2026-11-04): "Paste your website. *Get your brand kit.*" The homepage's "On brand" shows a kit applied across a reel; this shows how the kit is **filled** ("Analyze with AI"), on an illustrative brand, **habitly.io** (the habit app the hero's prompt placeholder already names), in its own colours (coral #ff7a59, navy #1e2a4a, cream #fff4e6, sunflower #ffc145, teal #2bb3a3) and the serif headline "Build the habit. Keep the streak." (the same line Direct's hook opens on).
  - **`KitScan`** (client): left, "01 Your website": a browser (dots, the address typing in, a mint "Analyze with AI") showing habitly's page (logo, nav, headline, line, a coral button, a navy phone with a streak of dots and "30 day streak"). Right, "02 Your brand kit": a card in the prompt box's glass, "Brand kit · Habitly · Default", with five rows that fill (index, a sample, label, value, a ring that becomes a mint tick): Logo (mark, a version and a banner), Colours (five swatches), Font (*Aa*, Instrument Serif), Tone of voice ("Warm, encouraging, plain-spoken"), Voice-over ("Bronwen, or clone your own", a waveform); then "● New videos use this kit automatically". A mint connector with a running light joins them.
  - **The steps** (`data-step`; what each finds stays via `data-reached`, "1 2 …" matched with `~=`): 1 the scan (a mint beam sweeps the page, "● Reading habitly.io"); 2 a mint ring on the logo, the Logo row fills; 3 rings on the button, the phone and three picked spots (cream, sunflower, teal), the swatches pop in; 4 a ring on the headline, Font; 5 a ring on the line, Tone; 6 Voice-over; 7 "Default" turns mint and **every new video** below turns on-brand.
  - **Every new video** beneath, between hairlines: three frames (16:9, 9:16, 1:1) grey and generic until the kit is done, then navy with a coral bar, the title in the serif and the logo, a moment apart; "Suggested for you · Picked for Habitly" with the app's own suggestions (SaaS launch film, App Store launch, Feature drop), and "On a team, everyone shares the same kits."
  - **Motion:** while on screen it runs (about 0.9s a step, 1.5s for the scan), holds 4.4s when done, then starts again; "Pause" stops it (WCAG 2.2.2). Reduced motion: the kit complete and applied, nothing moves.
  - **Narrow screens:** stacked below 980px, no connector; on phones "Analyze with AI" shows only its sparkle and the kit's values wrap.
  - **Gotcha:** the illustrative logo mark is an `<i>`, so bars use their own classes (`.version`, `.bar`), not `i` selectors.
  - **Copy:** `productBrand`. The kit's fields, "Analyze with AI", "Default", "New videos use the default kit automatically" and "Suggested for you" are the app's; the brand, its site, its values and the counts in "2 versions, 3 banners" are illustrative ("Illustrative brand"). No plan allowances are typed in (kit counts per plan come only from the pricing API).

## Homepage (step by step, from 2026-10-30)

`src/app/page.jsx` renders, inside `Scene`, Hero → HowItWorks (`#product`) → Creates (`#makes`) → OldWay, "Your footage" (`#footage`) → EditWithWords (`#edit`) → YourCall (`#control`) → EveryFormat (`#formats`) → OnBrand (`#brand`) → Tools, "Open by design" (`#tools`) → Audience (`#audience`) → UseCases (`#use-cases`) → Download (`#download`) → Pricing (`#pricing`) → Faq (`#faq`), with a `Divider` between every two sections after How it works. The planned sections and their order are in `PLAN.md` ("Homepage expansion"). All copy lives in `src/content/home.js`. Lines marked `PLACEHOLDER` wait for the confirmed product description, so the page is `noindex` until then.

- **Scene** (`src/components/scene/`, added 2026-10-31 at the team's request: the page was flat black and the sections felt disconnected). It ties the sections together as one scroll:
  - **`SceneLight`:** a fixed light behind every section, so sections leave their own backgrounds transparent (the hero's backdrop fades out at its foot with a mask). Each section brings up its own layer as it fills the screen (`--w`), and the layers drift slowly:
    - How it works: dusk (violet-blue and peach, from its viewer's shots).
    - Use cases: the colours of the feed on air. `Switcher` sets `html[data-feed]`, and the colours cross-fade through registered `@property` colours.
    - Download: mint, where the thread lands.
  - **The flight thread was removed on 2026-11-03** (the team: not right, and poor on phones). Two replacements were dropped the same day: a scroll-played sweep on the dividers, and a travelling "camera frame" that flew between sections' pictures (it crossed text in flight). Rule learnt: **nothing that connects the sections may draw over content.**
  - **The dissolve** (`globals.css`): every section after the hero dissolves into the next as you scroll, like a cut in an edit. Scrolling in, it rises from 56px low, 97% size and 15% opacity to rest (`entry 0%` → `entry 30vh`, so it is at rest by the time its link arrives); scrolling away, it settles back to 97%, 40px up and 20% opacity (`exit 35vh` → `exit 100%`). Two view-timeline animations with **no fill**, so a section at rest has no transform at all (sticky pins and fixed children, such as the prompt gallery's floating preview, keep working). Transform and opacity only. Not with reduced motion, nor without scroll-driven animation support.
  - **The links** (2026-11-03, the team's idea): a thin vertical mint line down the middle of every gap, from where one section ends to where the next begins, through the divider's playhead (a node on it); the first comes out of the hero's foot (`<Divider ruler={false} up="120px" down="84px" />`), continuing the timeline floor's own playhead. Each draws itself as you scroll, its glowing tip riding **the middle of the screen**. The lines only ever sit in the empty gaps.
  - **The focus pull** (same day, "focus type"): while the page has `data-focus-ready` (set by SceneCuts; never without JS or with reduced motion), each section's main content (`[data-main]`, one per section) waits out of focus: `blur(6px) brightness(0.62) saturate(0.7)`. When its link is drawn whole (`data-lit`) it racks into focus (0.9s), and **autofocus brackets** (four mint corners, `focus.module.css`, one element absolute in the page) snap in from a wider box around it, double-flash and fade, with a mint hairline ring drawn by the same element (`.af::before`) so its rounded corners match the brackets' (it used to be an `outline` on the content, which came out square where the content has no radius). Scrolling back resets it, so it replays; anything already past on load is simply in focus.
  - **`SceneCuts`** (`scene-cuts.jsx`): one passive scroll listener. It sets each link's `--d` (0–1) and `data-done`, and `data-lit` on the next section's `[data-main]` (placing the autofocus brackets); marks each section `data-cut` once the divider before it crosses the middle of the screen; and plays the footer's arrival (`data-thread`, then `data-arrived` once the panel's top passes 75% of the screen). With reduced motion every section is marked and the footer simply shows.
  - **Arrival** (`globals.css`): a section with `data-cut` draws its eyebrow's mint mark out to 34px with a glow (matched by `[class*="eyebrowMark"]`, since modules hash class names). Its heading wipe follows straight after, so the cut reads as one movement.
  - **`Scrubber`** (added 2026-10-31, "the page is an edit"; moved the same day to the right-hand margin because, at the foot of the screen, it covered content): a slim vertical timeline fixed in the right margin once the hero is left behind. It is hidden at 1024px and below, where there is no margin.
    - One clip per `[data-section]` (Intro, How it works, Use cases, Download), sized by its length, filled with its section's light, with film-frame lines.
    - A mint playhead bar at the scroll position.
    - Hovering or focusing names the clips and shows a tag with the section under the playhead and a running timecode (the page plays as 48s).
    - It is navigation (`<nav aria-label="Page timeline">`): clicking a clip scrubs to it.
  - **Heading wipe** (`wipe.module.css`): each section's h2 is revealed by a mint playhead sweeping across it as it scrolls in. A view timeline animates the registered `--wp` (0 → 1), which drives both the `clip-path` and the line, so it scrubs both ways. Pseudo-elements can't take their own view timeline, which is why it runs through `--wp`. Without scroll-driven animation support, or with reduced motion, the heading just shows.

- **Hero** (`src/components/hero/`): one full screen. It has the eyebrow, a two-line h1 (the second line is in the serif italic accent with a mint shimmer), a lead line and the prompt box.
  - **Copy (2026-11-04, the positioning above):** eyebrow "The AI video editor, your way"; h1 "Describe the video. / *Take it anywhere.*"; lead "KeyFly turns a sentence or your footage into an edited video, then lets you finish it your way." Between the lead and the prompt box, a quiet **proof row** of three mint-ticked links to Open by design: "Mac · Windows · Web", "Your own Claude, Codex or Cursor", "Hands off to Final Cut, Resolve, Premiere" (stacked on phones). The prompt box sits in `.promptWrap` (760px).
  - **Words** arrive one by one out of a blur.
  - **`PromptBox`** (client) is the app's "New video" box, working. Its controls were brought in line with the app on 2026-11-03 (the design is unchanged): the app's placeholder, + Add media, the aspect ratio (16:9 landscape, 9:16 vertical, 1:1 square, 4:5 portrait), Style (AI picks and the app's nine motion styles, each with its line), the brand kit picker ("No brand kit", with a link to add one in the app), Enhance and a labelled Create, plus "Blank project" under the box. The box is 760px wide to fit them; on narrower screens the longer words fold away, and on phones the pickers show their icons.
    - The field grows with its text. Enter sends; Shift+Enter starts a new line.
    - + opens a file picker, and files dropped anywhere on the page land as chips. A full-screen "Drop footage to start" frame shows while dragging.
    - **Enhance** can't call the app's AI here: with an empty box it types a preset's prompt; with a prompt, it rewrites it once to name the chosen ratio and style plus a hook, captions and music. Each chip types its own example prompt into the box.
    - Create (and Blank project) open the app. The app does not read the prompt from the URL, so the prompt is not carried over.
    - A conic comet of mint light circles the box's edge and speeds up on focus. Create turns mint once there is something to make.
  - **"or make it in ChatGPT · Claude":** both link to `#anywhere` (Works where you work) until the apps have install links; the KeyFly app shows none yet (2026-11-03). Official icons are still to be supplied.
  - **Preset chips:** centred under the box; on phones (≤760px) they scroll sideways with faded edges.
  - **`TimelineFloor`** (CSS only): an editing timeline laid flat and tipped toward the horizon (`rotateX`).
    - It has a ruler and title, video, effect and audio tracks. The clips come from a seeded random, so server and client match.
    - The tracks slide under a fixed mint playhead. Some clips are lit and breathe, and keyframe diamonds sit at the ends of video clips.
    - The floor turns slightly with the pointer.
  - **Also on the hero:** a pointer light (`PointerField`, fine pointers only) and film grain.
- **How it works** (`src/components/how-it-works/`, added 2026-10-31): three steps beside an illustrative Keyfly editor window, captioned "Illustrative interface".
  - **Steps:** Describe it, KeyFly edits, Share or hand off (was "Export anywhere" until 2026-11-04; it now names the review link too), on a rail that fills with the mint point at its tip. Only the current step shows its body. On narrow screens they become one row of three.
  - **Scroll progress:** `ScrollStage` (client) pins the section (`data-live`, 420svh, sticky 100svh stage). It writes to the DOM:
    - `--p`, `--s1`, `--s2`, `--s3` (one per step), `--asm` (assembly) and `--ph` (playhead);
    - `data-step`, `data-format` and `data-ready`;
    - the typed prompt, the timecode and the export percentage.
  - **Step 1:** the Launch Video preset prompt types itself into the side panel, and the viewer waits.
  - **Step 2:** title, video and audio clips drop onto the timeline (`--k` per clip). Then the playhead plays the cut: the viewer cuts between three CSS-drawn shots at 1/3 and 2/3, and Keyfly's notes tick off.
  - **Step 3:** the frame tries 16:9, 9:16, 1:1 and 4:5 (4:5 added 2026-11-04, so the demo shows every shape the step names; its width animates at a fixed height, using `cqw` of the viewer), and the export bar fills to "Ready".
  - **Fallback:** without JS or with reduced motion there is no pin, and the CSS defaults (all progress at 1) show the finished cut.
  - **Copy:** in `howItWorks` (content file), PLACEHOLDER.
- **What Keyfly makes** (`src/components/creates/`, added 2026-11-03; the team picked "Anatomy of the cut" from three): "Keyfly makes the pieces. *You keep the timeline.*"
  - **The film is illustrative** (2026-11-03): a film made in the Keyfly app was tried first, but the app is still being built and its output was not good enough, so the team asked for a dummy film that explains the idea. It is labelled "Illustrative" in the frame and "Illustrative film" beneath.
    - **What it shows:** 30 s, 8 scenes, in the site's look (Night, mint, Inter, the serif accent): "Describe a video.", the prompt typing into a prompt box, a five-scene storyboard, a voice-over waveform, kinetic motion graphics, clips landing on a timeline, "Make the intro faster" shortening a clip, and the unaltered lockup with "Describe it. Keyfly makes it." Each scene has a voice-over line (Windows' "Microsoft Hazel" voice, from `voice.ps1`; a placeholder until Keyfly's own AI voice) with a caption that lights word by word as it's spoken, over a soft synthesised music bed. Scenes are timed to their lines.
    - **The files:** `public/video/keyfly-film.mp4` (1280×720, H.264 with AAC sound, 5.7 MB) and `keyfly-film.webp` (poster).
    - **Its source:** `scripts/keyfly-film/` (a canvas animation in `film.js`, recorded by Chrome's MediaRecorder). To change it, edit `film.js` (and the lines in `voice.ps1`, then run it), run `node scripts/keyfly-film/record.mjs`, open `http://127.0.0.1:4417/?record` in Chrome for 30 s, then update the poster and the scenes and clips in `creates`. `?t=12.3` shows one frame.
    - Replace it with a real Keyfly film once the app's output is ready.
  - **`Anatomy`** (client), redesigned 2026-11-03 (the narrow film left empty space at its sides): the film fills two-thirds of the column (16:9, mint edge); beside it, a panel of the same height with the prompt (in the prompt box's glass), "Now 03 / 08" with the scene's name and the line its voice-over speaks, the five tracks (lit while they have a clip under the playhead), and the controls (play/pause, a mint "Sound on" (shown unless `video.audio` is false), the timecode). Below 900px the panel sits under the film.
    - **The timeline:** full width beneath: a scene ruler (01–08) and the film's tracks (Storyboard, Voice-over, Motion graphics, Transitions, Music; the count sets `--tracks`) with clip times that match the film. The playhead's full-width strip is clipped sideways (`overflow-x: clip` on `.lanes`); it once widened the page as it moved. A playhead follows the video by `translate`. The clips under it, their chips and their labels light mint.
    - Clicking the lanes seeks.
    - It plays muted while on screen and pauses off it. With reduced motion it waits on the poster for play.
  - **Copy:** `creates` in the content file. If the film changes, update the scenes and clips there.
- **Your footage** (`src/components/old-way/`; built 2026-11-03 as "The old way", "Six steps by hand. *One sentence with KeyFly.*", and turned the same day into the footage section, since almost every other section shows making a video from a sentence; the file names keep "old-way"): "Got footage? *KeyFly does the chores.*" The lead names what the app's help says KeyFly does with a recording: cuts silences and filler words, adds captions, zooms on the focus area and adds callouts. Picked originally as "Hours vs one sentence" from three new sections. Captioned "Illustrative". Qualitative only: no competitor names, no time savings. Dropped the same day: two aligned checklists, two stacked timelines, a comparison table (no box shapes, the team said), and two frameless flight paths (too simple; the purpose wasn't clear). The team then picked "six steps vs one, as a scroll story".
  - **`Story`** (client): the same launch video made two ways, as **two mirrored columns on four shared rows** (head, line, picture, timeline; each side a `subgrid` of the stage), divided by a hairline with a serif-italic "vs", then **one strip of the six steps across both**. Pictures and timelines are the same size on both sides (`--pic`: the column, capped to 36svh × 16/9 while pinned), so everything sits level.
    - **By hand** (left): "By hand · Step 03 of 06"; the chore in play as a serif-italic title and a line; a raw, grey viewer; a timeline (V1, A1, A2, C1) whose playhead scrubs at step 1 and is parked after.
    - **Each step acts out its chore**, and what it leaves stays: 1 the playhead scrubs and a timecode flickers; 2 the shot zooms in on the presenter (1.4×) with a "◆ Zoom 140%" tag, and three clips get keyframe diamonds; 3 the voice's silences (hatched) are cut out with razor lines; 4 a music track appears with its level keyed; 5 a caption types into the viewer and caption chips land on C1; 6 a 9:16 crop is dragged across the picture. One cursor in the viewer moves to each step's tool.
    - **With Keyfly** (right), the same rows finished: "With Keyfly · ● Done in one step", the sentence, the graded picture (lower third, serif-italic captions, "● First cut ready", a mint edge) and the finished timeline (coloured clips, the voice, the music keyed in mint, caption chips) with a mint playhead playing it.
    - **The strip:** six equal columns, each a bar, "0N chore" (by hand) and "✓ result" (Keyfly); done bars grey, the step in play white with its result in mint. They jump to a step.
  - **The stage** carries `data-step` and `data-reached` (every step so far, matched with `~=`).
  - **Scroll:** where the stage fits the screen (content + 96px ≤ the window's height) and motion is welcome, the track pins (100svh + 6 × 46svh) and the scroll picks the step. Otherwise (short laptops, phones) it moves on by itself every 2.8s while on screen. Reduced motion: step 6, still.
  - **Narrow screens** (≤900px): by hand, "vs", Keyfly stacked; the strip in rows of three (two on phones).
  - **Copy:** `oldWay`. KeyFly's results follow the app's help (silences and filler words, captions, zooms and callouts, the music bed, frame shapes); "Footage reviewed" is illustrative.
  - **Narrow screens:** the step results wrap instead of being cut off.
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
    - The pictures are `aspect-ratio: 16 / 10` boxes (taller than 16:9 since 2026-11-03, at the team's request; 9:16 is then 35.16% wide); a size container there would stop the subgrid from sharing rows.
    - **The centre:** the ask column's body is a `1fr auto 1fr` grid, so the pill sits exactly on the pictures' middle and the reply hangs below it (a tick and a fixed two-line height, aligned to the pill's text). A `.connector` around the pill draws one straight line through its centre across both column gaps (`--cg`), from Before's edge to an arrowhead at After's edge, with the light running behind the pill.
    - The six tabs form an even bar as wide as the comparison (three per row below 1180px; scrolling sideways below 900px).
    - The shot layout is computed in a pure function, so render doesn't reassign variables (React lint).
  - **Copy:** `editWithWords` in the content file, all PLACEHOLDER until the team confirms which follow-up edits are real.
- **You make the calls** (`src/components/your-call/`, added 2026-10-31; the answer to "black box" AI; rebuilt 2026-11-04 as **"Director's note"**, because the editor-window version looked the same as What KeyFly makes and How it works, and the app has no decisions inspector): "KeyFly decides. *You have the final say.*" Heading laid out like Use cases; captioned "Illustrative interface". No editor window, no timeline.
  - **What it's built from** (the KeyFly editor, read 2026-11-04): after each build the AI director replies with what it chose ("Hook: opens on 'Describe a video. Get a video.'", "Voice: Eyal … (also fits: Bronwen, Elaine, Quinn)", a soft-pulse music bed), what it assumed (the look), a self-check (3.4/5) and "Next:" ideas, with Revert and Retry ("Cloud · Worked for 43s · 18 steps"). The other hook and music options are illustrative; the looks are the app's motion styles.
  - **`DirectorNote`** (client), two columns (stacked ≤1000px, the cut first):
    - **The note** (left), hung on a thin thread like a reply in the app (a mint point at its head, a diamond node per line): "● AI director · Cloud · worked for 43s · 18 steps", the prompt (› …), "Built *“Launch Video”*", then four hairline lines (Hook, Voice, Music, Look with an "Assumed" tag): index, label, the current choice (serif italic mint and "Your call" once changed, else "KeyFly's pick"), the reason, and every option as a chip (KeyFly's pick carries a mint point; a changed choice fills mint). Then the self-check (five segments filled to the score), "Next" and Revert / Retry.
    - **The cut** (right, sticky beside the note): "The cut · Launch Video · 0:30 · 16:9", a 16:9 frame with a mint edge (as What KeyFly makes' film) whose opening shot follows the hook (the use-case `Preview`s), a "Voice-over · {voice}" tag with a waveform at the voice's pace, a music tag (faster for Upbeat, flat for No music), a grade layer per look, and "● Updated" when it changes; beneath, a readout of all four with a mint line over the one in focus.
  - **Motion:** on first view the note writes itself line by line (only once hydrated, so the server HTML shows it written). Then, until a chip is clicked, each line in turn tries another option and returns every 1.9s (while on screen, not hovered or focused). Revert goes back to KeyFly's picks; Retry writes the note again. Reduced motion: written at once, no demo, no waveform motion.
  - **Phones:** the index and label share a row above each line's body; the readout is 2 × 2.
  - **Copy:** `yourCall` (`report`, `decisions`, `check`, `next`, `preview`).
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
    - **Kit bar:** "Brand kit" and "N/4 applied · 6 videos" above an even bar of four cells between hairlines (index, sample, name, detail, a ring that becomes a mint check): Your logo, Your colours, Your font, Your voice (the app's kit has no title style; voice replaced it on 2026-11-03 and shows as a voice-over waveform on each video, `data-voice`). The item just applied gets a mint line along its foot.
    - **Reel:** beneath, in the column with painted soft edges, six illustrative videos in their own shapes (Launch 16:9, UGC 9:16, Podcast 1:1, Explainer 16:9, Product Demo 4:5, Montage 16:9; the use-case `Preview`s, `bleed`) drift sideways as one track (two copies, `translate: -50%`, 64s). Each has a label and ratio beneath.
    - **What the kit changes,** set on `.reel` (`data-logo`, `data-colours`, `data-font`, `data-title`): the logo bug in the corner; a grade and a violet edge; the title in the serif italic with a mint first letter; the title's bar and weight.
    - **The scan:** each time an item applies, a mint scan line crosses the reel (0.9s), and each video changes as the line reaches it: just before the change, every tile gets `--delay` from where it stands, used as the transition delay (font family and style flip via `transition-behavior: allow-discrete`).
  - **Self-running:** one item every 1.7s, hold fully on brand 3.2s, then start again; while on screen and not held. Clicking a cell toggles that item and stops it. Reduced motion: everything applied, the reel still, no scan.
  - **Narrow screens:** the kit becomes 2 × 2 (names only on phones); the reel is shorter.
  - **Gotcha:** the heading uses `.title`, so the videos' titles are `.vidTitle`.
  - **Copy:** `onBrand`, PLACEHOLDER until the team confirms what the brand kit holds.
- **Works where you work** (`src/components/anywhere/`, added 2026-11-02) was **removed on 2026-11-04**: merged into Open by design (below). Its code is in git history.
- **Open by design** (`src/components/tools/`, `#tools`, the menu's "Integrations"; added 2026-11-03 as "Works with your tools", the team having picked "Hand-off" from three; on 2026-11-04 it absorbed Works where you work and became the page's main differentiator): "Your computer. Your AI. *Your editor.*" Lead: "KeyFly doesn't lock you in…"
  - **01 Run it on** (above the hand-off, server-rendered): five cells between hairlines, names in large type: macOS (desktop app, Apple silicon and Intel → `#download`), Windows (10 and 11 → `#download`), Web (`app.keyfly.si` ↗), ChatGPT and Claude (no link until the apps have install links). "One project everywhere… Everything syncs when you're back online." A mint light runs along the bar's foot (the sync; off with reduced motion; the section has `PauseOffscreen`). On narrow screens (≤860px) the cells become rows.
  - **02 Bring your AI** and **03 Finish in your editor**: the hand-off below (kicker numbers come from the content, `index`). Built from what the Keyfly app shows (read on 2026-11-03), so only the ask and reply in the middle are illustrative ("Illustrative interface").
  - **The facts it uses:**
    - the AI picker: **Cloud** ("picks the best model for each step", uses AI minutes) or **your own agents**;
    - Settings → Agents: Claude Code, Codex, Cursor, Antigravity "and other ACP agents edit with your own plan, without using your AI minutes", connected through the desktop app;
    - the export sheet's **Timeline for other editors**: FCPXML (Final Cut Pro, also DaVinci Resolve), EDL CMX 3600 (Premiere, Resolve, Avid), OpenTimelineIO;
    - **Package for editing**: a .zip with the timeline and every file it uses.
  - **`Handoff`** (client): three columns. Left, "01 Bring your AI": five hairline rows with a cost chip ("AI minutes" / mint "No AI minutes"). Middle, one Keyfly timeline window: "Editing with *{agent}*", the ask and reply, four tracks under a looping playhead, and "Hand off as {format} → {editor}". Right, "02 Take it anywhere": four editors with their formats.
  - **Wires:** an SVG behind the columns, measured from the chosen rows (`ResizeObserver`), with a bright run along each wire when it moves. Hidden when the columns stack (≤980px), where the choices become two columns of chips.
  - **Self-running** (2026-11-03, the team wanted it to keep playing): a continuous hand-off every 3.6s while on screen: a new AI (the light runs in along the left wire), then 1.2s later a new editor (out along the right). The mouse resting over it doesn't stop it; a click pauses it for 10s, keyboard focus inside holds it. Reduced motion: no self-running.
  - **No official logos:** the agents and editors are named in text only.
  - **Also seen in the app, not yet on the site:** real downloads at `app.keyfly.si/download/mac`, `/mac-intel` and `/windows` (version 1.1.7), while the Download section still says "Coming soon".
- **FAQ, "Ask Keyfly"** (`src/components/faq/`, added 2026-11-02): "Ask Keyfly. *Anything.*" The team picked "Ask Keyfly" from three layouts, and chose to include the topics we don't have facts for yet, with placeholder answers.
  - **`Ask`** (client): two columns aligned at the top. The panel keeps its own height (enough for the longest answer) and is sticky beside the list (2026-11-04: stretched to the 14-question list, it looked big and empty).
    - **Left:** fourteen questions as numbered hairline rows; the one in play has a mint edge, a tint and an arrow.
    - **Right:** a panel in the prompt box's glass (a mint line along its top): "● Ask Keyfly", "01 / 14", the question as sent (› …), the answer typing in with a mint caret (the rest is laid out but hidden, so the panel never jumps), and at its foot a link to the section that shows it (e.g. "Edit with words ↓"; a link off the page, such as "Email help@keyfly.si", gets ↗) and "Next question →".
    - The first answer types when the panel first comes on screen. Nothing changes by itself after that: it is something to read.
  - **Accessibility and search:** every question and answer is also in the page as a visually hidden `<dl>`; the panel is decorative (`aria-hidden`, its controls out of the tab order).
  - **Narrow screens:** the panel sits above the list; asking scrolls it into view.
  - **Copy:** `faq`. Every answer comes from the app, its help or the pricing API (2026-11-03). Added 2026-11-04: "How do I get feedback on a video?" (the editor's Share for review: anyone with the link can watch, comment at a moment, approve or ask for changes, but not edit), and music beds and sound effects ("Licensed for you", the editor's Audio panel) in "What can KeyFly's AI make?". Added that day: "Can I use my own AI agents?" (Settings → Agents), "What are AI minutes?" (the pricing API's wording and packs) and "How do I get help?" (the app's Help, its tour and "We answer within one working day"). Added 2026-11-04: "What can KeyFly's AI make?" (the plans' AI images and voice-overs, generated video and voice cloning) and "Can my team use KeyFly together?" (the Team and Enterprise plans).
- **Dividers** (`src/components/divider/`, added 2026-11-03 at the team's request; a scroll-played sweep was tried and dropped the same day, so it is still): between every two sections after How it works, a timeline ruler across the content column, in the middle of the gap (it takes no height). Not after the hero (its timeline floor is one) or before the footer (whose top edge is a ruler).
  - **Even gaps after pinned sections:** a pinned stage sits at the top of a pin as tall as the screen and leaves empty space below its content. `TrimPins` (`src/components/scene/trim-pins.jsx`, in `Scene`) measures that space for every `[data-live]` track and takes it off the track's bottom margin (re-measured on resize and whenever a track pins or unpins). How it works, which pins its own section, carries its padding as `margin-bottom: var(--section-pad)` while pinned.
- **Prompt gallery, removed 2026-11-04** (it repeated Use cases' six preset prompts and "Try this prompt"; its templates row moved to Use cases; the code is in git history). It was `src/components/prompts/`, added 2026-11-03 after a review of what the page lacks against competitors, who lean on templates: "Start from *a prompt.*" Picked "hover-reveal list" from three structures.
  - **`PromptList`** (client): eight prompts as a frameless, numbered list (01–08, counting on across groups) under four goals (Launch, Social, Explain, Stories), with hairlines, no boxes. Each row: index, the prompt in large quoted type, its preset and format in mono, and a mint "Try it ↑" that appears on hover or focus (the line shifts right, its index turns mint).
  - **The floating preview** (fine pointers only): the prompt's `Preview` (16:9, or 9:16 narrower) floats above and right of the pointer (its foot at the pointer, so the line stays readable) and eases after it (rAF, only while hovering). Near the right edge it moves to the pointer's left, and it never rises off the top. It is **portalled into `<body>`**: the section is transformed while it dissolves (and filtered while out of focus), and either makes a fixed child position against the section, which threw the preview off to the side on the last rows and widened the page (fixed 2026-11-03).
  - **Choosing a prompt** dispatches `keyfly:prompt` with `{ text }`; `PromptBox` now accepts any prompt's text as well as a preset label, scrolls up and types it in.
  - **Templates row** (2026-11-03): the list ends with a "Templates" row: "91 templates for launch films, UGC ads, … Pick one and the AI director fills it with your product", "Free and Premium" and a mint "Browse templates ↗" to `app.keyfly.si/templates` (it opens the signed-in workspace's Templates page). Gotcha: `.meta` takes a grid area on phones, so the row resets it.
  - **Copy:** `prompts`. Six are the app's own preset prompts; the two extra examples (a vertical teaser, an event recap) are PLACEHOLDER until the team reviews them, and use only confirmed capabilities.
- **Who it's for** (`src/components/audience/`, added 2026-11-03): "Made for people *with a story to tell.*" A first version (a role index beside a preview) was dropped the same day as too like Use cases and the FAQ; the team then picked "expanding panels".
  - **`Roles`** (client): four tall panels side by side across the column (Marketers & founders, Creators, Educators, Podcasters), `clamp(440px, 62svh, 580px)` tall. The open one grows (`flex-grow` 5.2 to 1, 0.7s) with a mint edge; the others are slim strips with their index at the top and their name written up the side.
    - **Each panel:** the role's `Preview` in its top 54% (at the role's own shape; 9:16 stands centred), fading into night where the words sit; closed panels show it dimmed.
    - **The open panel's body** (fades in after it grows): "01 Marketers & founders", its line, "Makes" (presets as mint chips) and "Formats", then a hairline, "Try" with the role's real preset prompt, and a mint "Try this prompt ↑" (sent to the hero's prompt box by `keyfly:prompt`). Closed bodies are `inert`.
  - **Turning:** hovering a panel with a mouse opens it (and holds the self-running); clicking opens it and stops the self-running; otherwise the next opens every 5s while on screen, the open panel filling along its foot. Reduced motion: no self-running, no easing.
  - **Phones** (≤760px): the panels stack; closed ones are slim rows with the name along them and no video, the open one tall with its video above.
  - **Copy:** `audience`. Built only from the confirmed presets and their prompts; the roles and lines are PLACEHOLDER until the team confirms the audience.
- **Pricing** (`src/components/pricing/`, added 2026-11-03, rebuilt the same day from the client's "Pricing API" document): "Start free. *Grow when you need to.*"
  - **The rule (from the client):** no price, allowance or bullet is typed into the website. Everything comes from `GET https://api.keyfly.si/v1/public/pricing` (no sign-in, open CORS, cached 5 min; schema at `https://api.keyfly.si/openapi.json`, tag Public, `MarketingPricing`; questions to hello@keyfly.si). Buttons use the API's links as they are; always say "AI minutes", never "credits".
  - **`src/lib/pricing.js`:** `getPricing()` fetches on the server with `next: { revalidate: 300 }` and our `utm_*` attribution, and normalises the response defensively (missing fields drop out). `src/app/page.jsx` sets `export const revalidate = 300` (ISR: if a refresh fails, the last good page keeps being served). If there has never been a good fetch it returns null, and the section shows its fallback (below). In development only, `KEYFLY_PRICING_FIXTURE` can name a JSON copy of the API's response **outside the repository** (the cloud session can't reach the API); never in production.
  - **`Plans`** (client), redesigned 2026-11-03 as an **AI-minutes timeline** (the card row looked like every other pricing page; the team picked this from three):
    - A Monthly / Yearly switch (yearly first) with the "Save ~{n}%" pill, and the launch-offer line.
    - **The ruler:** "AI minutes a month", ticks, a track filled in mint up to the playhead, and a diamond stop per plan with an allowance (Free, BYO, Starter, Creator, Pro, sorted by AI minutes), placed by the square root of their minutes (at least 9% apart; evenly on phones, ≤640px), labelled beneath with name and minutes. A **mint playhead** chooses the plan: drag it (it settles on the nearest stop), click a stop's label, or use the arrow keys / Home / End (`role="slider"`). It starts on the first plan (Free) and moves on by itself every 3.2s (round again after the last) while on screen (hovering doesn't pause it: the mouse usually rests over the section while scrolling), until a plan is chosen by drag, click or keys; not with reduced motion (2026-11-03, at the team's request).
    - **The inspector** beneath shows the plan under the playhead: name (and "Most popular"), tagline, a big price with the list price struck through, the billed line, the AI minutes in mint; then "Everything in X, plus" with up to five bullets in two columns, export / storage / Keyfly mark, and its buttons (the API's CTA, "Buy now" with the checkout link, and the trial line). The most popular plan gets a mint edge and a mint price.
    - Per-seat and custom plans (Team, Enterprise) in a slim row beneath, then the AI-minute packs, then "Prices in US dollars".
    - **Gotcha:** the section heading uses `.head`, so the playhead is `.playhead`.
  - **Fallback** ("Plans, *still rendering*"): `Render`, an export that never finishes (the percentage creeps towards 96%), with "Open Keyfly in your browser" and "Download". Shown by a build that can't reach the API.
  - **Hosting note:** ISR needs a Next server (OpenNext on Workers). A static export would fetch only at build time, so it would need scheduled rebuilds (the client suggests hourly).
  - **Open questions for the client (seen in the API's data on 2026-11-03):** `version` and `publishedAt` were empty; the launch offer says 35% off but Creator's yearly price works out to 38% and Pro's to 36%; the "~20%" saving differs per plan (17%, 22%). We show the API's values as they are.
- **`Shot`** (`src/components/shot/`): the CSS-drawn illustrative shot (dusk through a window, a presenter at 62% across), used by One edit, every format.
- **Use cases** (`src/components/use-cases/`, added 2026-10-31, redesigned four times the same day): the six prompt-box presets on a **jog wheel**, the dial editors spin to move through footage. Captioned "Illustrative previews". It is not pinned, so it fits any height. Earlier versions were dropped:
  - a pinned reel (broke on short laptop screens);
  - a boxed multicam switcher with a tile grid (the team asked for no grid or box shapes);
  - a frameless index beside a projection;
  - a copy of How it works' layout (the team wanted it different, yet matching the theme).
  - **Heading:** laid out like Download (eyebrow and h2 left, lead right), sharing the 1320px column with the gutter inside. Since 2026-11-04 it reads "Pick a preset. *Make it yours.*" (it was "Made for every kind of video", too like Who it's for's "Made for people…").
  - **Templates row** (moved here from the prompt gallery, 2026-11-04): under the note, between hairlines: "Templates", "91 templates for launch films, UGC ads, … Pick one and the AI director fills it with your product", "Free and Premium" and a mint "Browse templates ↗" to `app.keyfly.si/templates` (it opens the signed-in workspace's Templates page). Stacks on narrow screens.
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
  - **Pin and size (2026-11-03, after the header covered the dial when scrolling up on a 1352×633 laptop):** the stage is centred in the pin below an 88px band the header can occupy (`padding: 88px 0 20px`), and pins only if content + 108px fits. The dial is as big as its column allows, up to 580px and `100svh − 160px`.
  - **Short screens:** Below 780px of height (wider than 860px) the frame caps at 38svh and the caption and prompt tighten, so the stage still pins on a 1366×553 laptop.
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
- **Download** (`src/components/download/`, added 2026-10-31, redesigned twice the same day): "Land Keyfly *on your desktop.*" A **landing played by the scroll**, the page's finale. The installer-window version was dropped because the team wanted each section to be its own, yet match.
  - **Heading:** laid out like Use cases (eyebrow and h2 left, lead right).
  - **`Landing`** (client): the track (`data-live`, 260svh) pins a 100svh stage. The scroll then plays the flight:
    - Lift-off (first 12%): the icon rises off the source.
    - Flight (to 82%): a copy of the unaltered app icon (`/brand/app-icon-macos.svg`) flies one loop of the flight path, shrinking onto the platform. The mint trail draws to `--fly`, and 26 runway lights along the path come on as it passes.
    - Landing: the platform glows, a ring goes out, and the primary button lights. It waits dimmed while in the air, but is always clickable.
  - **Readout above:** "● Installing Keyfly → {target}" (then "Landed"), the stages 01 Download · 02 Install · 03 Open, and a big mono percentage.
  - **Below the flight:** platform tabs (plain text, mint underline, a "Your system" tag), the step, and the buttons.
  - **Platform:** detected with `useSyncExternalStore`. Phones get "On a phone? Keyfly runs in the browser."
  - **Destinations:** generic shapes, never an operating system's own artwork: an Applications folder (macOS) and a desktop monitor (Windows). Other systems, Linux included, see macOS until they pick.
  - **Real builds** (2026-11-03, from `app.keyfly.si/download`): macOS `/download/mac` (Apple silicon, macOS 13+, with an "Intel Mac?" link to `/download/mac-intel`) and Windows `/download/windows` (10 and 11, 64-bit). The links serve the latest build. Each platform shows its requirements under its step.
  - **Buttons:** a platform whose `href` is `null` would show "Coming soon".
    - With an `href`, the primary button is "Download for {platform}" and "Open in your browser" is secondary.
    - Without one, "Open in your browser" (`app.keyfly.si`) is primary, beside a "{platform} · Coming soon" chip.
  - **Fallback:** it pins only where the stage fits the screen (content + 96px ≤ the window's height) and motion is allowed; otherwise it shows landed. The server HTML shows it landed too.
  - **Pinned stages** (here) sit at the top of the pin (padding `clamp(64px, 10vh, 84px)`, clear of the header), so they follow their heading without a gap. Use cases differs (below).
  - **Copy:** the Windows step is PLACEHOLDER. The macOS step and the footnote ("Keyfly.si is a Cevrynt Inc. product") come from the installer art.
- **Performance rules** (2026-10-31, after the hero lagged; measured frame by frame, the hero went from about 9 to 26 fps in a GPU-less test browser, How it works from 18 to 28, Use cases from 27 to 47):
  - **Animate only `transform` and `opacity`.** Animating borders, backgrounds or shadows (as the timeline floor's breathing clips did) repaints everything around them every frame.
  - **One moving layer, not many:** the hero's timeline floor slides as one reel (`.reel`, `will-change: transform`), not one strip per track.
  - **No masks or blend modes over moving content:**
    - the floor's edge fades are night painted over it (`.stage::after`), not a mask;
    - the hero grain uses a normal blend at 0.035, not `overlay`.
  - **No filters on page-tall SVG paths:** a filter there repaints the whole page height on every scroll (learnt from the flight thread, since removed).
  - **Nothing runs out of sight:**
    - `PauseOffscreen` sets `data-offscreen` on a section once it leaves the screen, and `globals.css` pauses every animation inside it (hero, Use cases);
    - the background glows are still (no drift), and an unseen one is hidden (`data-off`).
  - **Per-frame scripts do lookups, not measurements:** the thread reads its comet position from a table of points (every 4px) built once.
  - **React:** the jog wheel's ticks are built once and `Preview` is memoised, so turning the wheel doesn't re-render the previews.
- **Gotchas:**
  - **Don't name a custom property `--a`:** the prompt box registers `--a` as an `<angle>`, which turns any other value into "0deg" and silently invalidates the declaration using it.
  - **Grid overflow:** grid containers that hold the scrolling chip row need `grid-template-columns: minmax(0, 1fr)`. Without it the row's `max-content` width widens the page on mobile.
  - **No large blur:** never put a large `filter: blur()` in a 3D, animated stage.
  - **Translated strips widen the page:** anything moved sideways by `translate` (a playhead strip, a reel) needs `overflow-x: clip` on its container, or it adds a horizontal scrollbar as it moves. `clip` (not `hidden`) keeps vertical overhangs visible.
  - **Smooth scrolling:** `html` scrolls smoothly, so test scripts must pass `behavior: "instant"`.
- **Verifying:** Playwright (pre-installed Chromium) screenshots at 1440×900 and 390×844, plus `reducedMotion: "reduce"`.
