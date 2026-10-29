import localFont from "next/font/local";

// All fonts are self-hosted (SIL OFL, licences in src/fonts) so no build or
// page load depends on Google Fonts.

// Brand display face: Syne 700, the weight the wordmark is drawn in.
export const syne = localFont({
  src: "../fonts/syne-latin-700-normal.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-display",
});

// Text and heading face: Inter variable (weights 100–900).
export const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-text",
});

// Accent face: Instrument Serif italic, only for the one emphasised word in
// a heading (written *like this* in the content files).
export const instrumentSerif = localFont({
  src: "../fonts/instrument-serif-latin-400-italic.woff2",
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-accent",
});
