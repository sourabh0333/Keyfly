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
