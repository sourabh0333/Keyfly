# Keyfly website: build plan

Last updated: 2026-10-28

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
