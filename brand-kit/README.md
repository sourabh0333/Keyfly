# Keyfly brand kit

## The symbol: "Flight path"
One continuous gesture rises from the lower left, loops once, and lifts to land on an amber point:
the camera's flight, and the moment a shot lands.
- `symbol/symbol-dark.svg`: for dark backgrounds (warm white line, tungsten amber point)
- `symbol/symbol-light.svg`: for light backgrounds (ink line, deep amber point)
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
| Tungsten amber | #FFB23E | Accent on dark: the landing point, primary buttons, highlights |
| Deep amber | #D97E00 | The point on light backgrounds |
| Amber (UI, light) | #C27400 | Buttons and selection in the light app theme |
| Amber text (light) | #935400 | Accent used as text on white (4.5:1) |
| Night | #0B0B0D | Dark surfaces, app icon tile bottom |
| Night top | #202026 | App icon tile top |
| Paper | #F4F1EA | The line and text on dark |
| Ink | #141416 | The line and text on light; text on amber |

Text on amber is always Ink, never white.

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
- **Don't:** recolour the line, swap the amber point for another colour, rotate or stretch it, add effects, or redraw the wordmark in another font.

## Motion
- **Intro (once, where the app opens):** the line draws itself along its path in 0.9 s (ease-in-out), then the point lands with a small settle (0.35 s, ease-out). 
- **Loader (only while loading):** draw, hold, undraw, on a loop of 1.8 s, with the point pulsing at the hold.
- **Reduced motion:** a simple fade.

The masters live in the repository at `packages/design-tokens/brand/` and are regenerated with `pnpm brand:assets`.
