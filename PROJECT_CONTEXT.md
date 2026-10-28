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
