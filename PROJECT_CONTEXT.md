# Keyfly Marketing Website — Project Context

Last updated: 2026-10-28

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
- Fonts are self-hosted through `next/font/local` (`src/app/fonts.js`): Syne 700 (`--font-display`) for headings and Inter variable (`--font-text`) for text. Licences sit beside the files in `src/fonts/`.
- Icons use the App Router file conventions: `src/app/favicon.ico`, `icon.svg` and `apple-icon.png`, copied unchanged from the brand kit.
- Hosting: Cloudflare, either as a static export on Pages or through OpenNext on Workers, decided before deploy.
- Performance targets: LCP ≤ 1.5s, CLS ≤ 0.1, INP ≤ 200ms. Each page has one H1 and complete metadata.

## Brand

The full kit lives in `brand-kit/` (see `brand-kit/README.md`). Web copies are in `public/brand/`.

| Token | Hex | Use |
|---|---|---|
| `--tungsten-amber` | #FFB23E | Accent on dark |
| `--deep-amber` | #D97E00 | The point on light backgrounds |
| `--amber-ui` | #C27400 | Buttons and selection on light |
| `--amber-text` | #935400 | Accent used as text on light |
| `--night` / `--night-top` | #0B0B0D / #202026 | Dark surfaces (the app itself) |
| `--paper` | #F4F1EA | Page background |
| `--ink` | #141416 | Text on light, text on amber |

- Text on amber is always Ink, never white.
- Never recolour, redraw, rotate or stretch the mark, and never add effects. Leave clear space equal to the point's diameter.
- Brand motion: the line draws in 0.9s ease-in-out, then the point lands with a 0.35s ease-out settle. Reduced motion falls back to a fade.

## Design direction: "Paper and tungsten"

The reference site (cardboard.ai) is studied for clarity only. Keyfly must not resemble it: no all-black cinematic theme, no prompt-box hero, no pill buttons, no numbered 01/02/03 feature cards.

- Light-first pages on Paper with Ink type. Night appears only where the product is shown, as an app window set into the light page.
- Amber is rare: it marks the single primary action and the "landing" moments.
- No bordered card, tile or pill layouts (a standing preference of the team). Use open hairline rules, editorial spacing and line-drawn connections.
- Signature motion: one flight-path line that draws through the page and lands on the amber point at key actions, drawn once with no looping decoration.
- Animate only transform, opacity and SVG stroke drawing. Respect `prefers-reduced-motion`.

## Design foundations (step 2)

`/styleguide` shows every token and component in development and returns 404 in production. Check it after changing a foundation.

- **Tokens** (`src/app/globals.css`): the brand colours, a fluid type scale (`--text-display` … `--text-label`), 4px spacing (`--space-1`…`--space-10`, `--section-pad`), small radii (no pills) and motion timings that match the brand kit.
- **Tone:** components read only role tokens (`--color-text`, `--color-muted`, `--color-line`, `--color-point`, `--accent-fill`, `--accent-ink`). Any element with `data-tone="night"` switches its contents to Paper and tungsten amber, so never hard-code brand hexes in a component.
- **`Logo`** (`src/components/logo.jsx`): the unaltered lockup. Its `on` prop ("paper" or "night") names the background it sits on.
- **`Button`:** `variant="solid"` (amber, Ink text) for the one primary action per view, and `variant="link"` (drawn underline) for everything else. It renders Link, `<a>` or `<button>` from `href`.
- **`Section` / `SectionHeading`:** a full-width band with the content column, a `tone` and an optional hairline `rule`, plus an eyebrow, h2 and lead. Pair `SectionHeading id` with `Section labelledBy`.
- **`FlightPath`:** the brand line that draws in 0.9s and lands its point in 0.35s.
  - `play="load"` uses CSS only. `play="view"` draws once on scroll, and its server HTML is already drawn, so nothing is hidden without JS. `play={false}` is static.
  - Pass a `shape` for longer page-level paths. Reduced motion gets a fade.

## Animated logo: the flight-path K (added 2026-10-28)

The team asked for the icon to become the K of the name, and approved the final look and motion on 2026-10-28. Its rest state is **K•eyfly**: a K with a **leaning stem** and a flight curve in the symbol's own gesture (the leg rises, loops once at the junction, and lifts as the upper arm to land the amber point), followed by the wordmark's "eyfly". This version is on the website only; the brand kit files, app icons and favicons still use the original symbol.

Motion, chosen by the team: **light painting**. `src/components/logo/animated-logo.jsx` is used by `Logo` everywhere (header, mobile menu, footer, styleguide) and directly on the homepage. The intro takes about 2s:

1. A glowing tungsten comet climbs and draws the leaning stem, then hops to the K's leg.
2. It paints the flight curve. The amber trail burns, then cools into the ink line that follows 110ms behind.
3. The comet becomes the amber point with a flash and a shockwave ring.
4. "eyfly" exposes left to right and a tungsten glint sweeps across it.

How it is built:
- Web Animations API, driven from JS. The comet's path is sampled from the real stem and curve geometry (`getPointAtLength`), so the comet, the hot trail and the ink stay on one clock.
- `data-state`: "pending" in the server HTML keeps the parts hidden until the intro starts, so there is no flash of the finished logo. A 3s CSS fallback reveals it if JS never runs. "armed" waits for scroll (`play="view"`), "running" plays, and "done" is static.
- Reduced motion and `play={false}` show the finished logo.

Geometry:
- `lockup-geometry.js` is generated from the brand kit; the wordmark is only split into letters.
- `k-geometry.js` holds the hand-authored K in lockup units (viewBox 0 0 136 64). Its stroke of 4.95 matches the wordmark's stem weight. "eyfly" is the brand-kit letters shifted 74 units left.

## Header and footer (step 3)

The root layout renders the skip link, `SiteHeader`, `<main id="main">` and `SiteFooter`, so pages render a fragment or `<div>`, never their own `<main>`. Navigation labels and targets live only in `src/content/navigation.js`; the current menu is a placeholder until the pages are agreed.

- **Header** (`src/components/header/`):
  - It is server-rendered. `HeaderShell` writes `data-scrolled` (shows the frosted band and hairline) and `data-tone` straight to the element, with no re-renders.
  - Tone comes from whatever sits under the header's centre line, so it switches to Paper-on-Night over any `data-tone="night"` section, the footer included.
- **Header effects:**
  - Desktop nav: one amber point hops between items in a 9px arc (Web Animations API) on hover or focus, and fades when the pointer leaves.
  - Reading progress: the bottom hairline fills as you scroll, with the point at its tip. It is CSS scroll-driven and hidden where unsupported.
- **Mobile menu:** a native modal `<dialog>` that traps focus, closes on Escape and makes the page behind inert.
  - It opens as a circle growing from the toggle using CSS `@starting-style`. Do not reintroduce rAF-timed opening; it stalls when frames are throttled.
  - It closes through `data-closing`, then `dialog.close()`. The links stagger in, the symbol redraws on every open, and scrolling is locked through `html[data-scroll-locked]`.
- **Footer** (`src/components/footer/`):
  - A Night surface with the app icon's warm corner light.
  - A long flight path draws on scroll and lands its point above the closing CTA. On narrow screens it crops the run-in (`xMaxYMid slice`) rather than squashing the loop.
  - A tungsten light follows the pointer (`GlowSurface`, transform only, mouse and trackpad only). Links slide over to make room for a landing point, and there's a back-to-top button.
- **`Magnetic`:** wraps a primary CTA so it leans toward the pointer. Not used on touch devices or with reduced motion.
