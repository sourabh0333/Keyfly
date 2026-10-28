// The Keyfly logo at rest: K•eyfly. The K is the brand symbol's own gesture
// (rise, loop once, lift to land the point) redrawn as a letter, with a stem
// leaning forward into the flight. All values are in lockup units (viewBox
// 0 0 136 64); the stroke matches the wordmark's stem weight. Hand-authored;
// the "eyfly" letters come unaltered from lockup-geometry.js (generated from
// the brand kit).

export const LOGO_VIEWBOX = "0 0 136 64";
export const LOGO_RATIO = 136 / 64;
export const K_STROKE = 4.95;

// The stem, leaning forward, drawn from the base up.
export const K_STEM_PATH = "M14.2 41.5 L18.2 15";

// Leg → loop at the junction → upper arm, drawn as one flight.
export const K_FLIGHT_PATH =
  "M37 41.5 C 34.5 37.5, 31.5 31, 28.5 24.5 C 26.5 21.5, 20.5 22, 20 28 C 19.5 33.5, 26.5 35, 30 29 C 32 25.5, 34 21, 36 17.5";

// The landing point, just past the upper arm along its direction.
export const K_POINT = { cx: 39.7, cy: 11.1, r: 3.825 };
export const K_ARM_TIP = [36, 17.5];

// "eyfly" sits after the K: the brand-kit letters moved left by 74 units.
export const WORD_SHIFT = -74;
