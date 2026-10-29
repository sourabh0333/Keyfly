# KeyFly logo and brand guide

## The symbol: "Flight path"
One continuous gesture rises from the lower left, loops once, and lifts to land on a mint point:
the camera's flight, and the moment a shot lands.
- `symbol/symbol-dark.svg`: for dark backgrounds (warm white line, soft mint point)
- `symbol/symbol-light.svg`: for light backgrounds (ink line, deep mint point)
- `symbol/mark.svg`: the symbol on its dark tile (sidebar, small app icons)
- `symbol/mark-mono-black.svg`, `mark-mono-white.svg`: one colour (stamps, embossing, single-colour print)

## Wordmark and lockups
"Keyfly" in **Syne 700**, tracking −1%, converted to outlines (no font needed).
- `wordmark/`: the name alone (ink and white)
- `lockups/`: symbol + name; `lockup-dark` for dark backgrounds, `lockup-light` for light
- `fonts/`: Syne 700 (SIL Open Font License, see the licence file) for anything new you set

## Colours
| Name | Hex | Use |
|---|---|---|
| Soft mint | #5FE0B0 | Accent on dark: the landing point, primary buttons, highlights |
| Deep mint | #12805B | The point on light backgrounds; buttons and selection in the light app theme (white text on it: 4.9:1) |
| Mint text (light) | #0E6B4C | Accent used as text on white (6.5:1) |
| Mint text (dark) | #82E8C2 | Accent used as text on dark panels |
| Night | #0B0B0D | Dark surfaces, app icon tile bottom |
| Night top | #202026 | App icon tile top |
| Paper | #F4F1EA | The line and text on dark |
| Ink | #141416 | The line and text on light |
| Mint ink | #06231A | Text on soft mint (dark theme buttons) |

Text on soft mint is Mint ink; text on deep mint is white. Mint is the one vivid colour on screen: warnings stay amber and success stays a status green, so "go" and "careful" never look alike.

## App icons
- `app-icons/macos/icon.icns`, `app-icons/windows/icon.ico`, `app-icons/linux/*.png`
- `app-icons/app-icon-macos*.svg/png` (1024 masters, Big Sur grid) and `app-icon-flat.*` (square tile; small-size cut)

## Web
`web/favicon.svg`, `favicon.ico` (16/32/48) and `apple-touch-icon.png` (180).

## Installer art
macOS DMG window background (`background.png`, `@2x`) and Windows installer sidebar/header bitmaps.

## Usage
- **Clear space:** keep at least the point's diameter of empty space around the symbol, and half the symbol's width around a lockup.
- **Minimum size:** 16 px for the tile icon (it uses the heavier small-size cut); 20 px for the bare symbol; lockups at least 80 px wide.
- **Don't:** recolour the line, swap the mint point for another colour, rotate or stretch it, add effects, or redraw the wordmark in another font.

## Motion
- **Intro (once, where the app opens):** the line draws itself along its path in 0.9 s (ease-in-out), then the point lands with a small settle (0.35 s, ease-out). 
- **Loader (only while loading):** draw, hold, undraw, on a loop of 1.8 s, with the point pulsing at the hold.
- **Reduced motion:** a simple fade.

The masters live in the repository at `packages/design-tokens/brand/` and are regenerated with `pnpm brand:assets`.

## Icons
Keyfly's own icons (`packages/editor-ui/src/components/brand/KeyflyIcons.tsx`) are for features that
are ours: AI director, first cut, keyframe, beat sync, trailer, brand kit, templates, captions,
reframe. They follow the symbol: one 1.75 px line on a 24 px grid in the text colour, round caps
and joins, and the mint point where the action lands (it pops slightly on hover). General
actions (save, delete, settings…) keep lucide icons.

## In the apps
`KeyflyMark` (tile or bare symbol; `animated` for the intro, `"loader"` while loading),
`KeyflyWordmark` and `KeyflyLockup`, from `@keyfly/editor-ui`. The accent colour in both apps is
soft mint (`packages/design-tokens/src/tokens.ts`): deep mint with white text in the light theme,
soft mint with Mint ink text in the dark theme.
