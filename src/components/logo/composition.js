// How the website sets the brand kit's lockup parts together (2026-10-29).
// The shapes come unchanged from lockup.js (generated from the kit); only
// their placement is adjusted, because the kit's file leaves a wide gap and
// lets the symbol's tail drop below the wordmark's baseline:
// - the symbol moves up 7.93 units so its tail rests on the baseline (44.02);
// - the wordmark moves left 32.45 units, set optically: the true distance
//   from the symbol's nearest ink (the arm and point) to the K equals the
//   point's diameter (7.65), the kit's clear space. Measured box to box this
//   overlaps; the point now hovers just above the K's top-left corner.
// The viewBox wraps the ink with an even 2.65-unit margin.

export const SYMBOL_OFFSET_Y = -7.93;
export const WORDMARK_SHIFT_X = -32.45;

export const LOGO_VIEWBOX = "8 0 171.48 54.07";
export const LOGO_RATIO = 171.48 / 54.07;

// The box is taller than the type (the point floats above the cap line and
// y and f descend), so its middle sits above the letters' middle. To centre
// the letters (cap line 20.09 to baseline 44.02) on a line, lift the logo by
// this share of its height.
export const OPTICAL_LIFT = ((20.09 + 44.02) / 2 - 54.07 / 2) / 54.07; // ≈ 0.093
