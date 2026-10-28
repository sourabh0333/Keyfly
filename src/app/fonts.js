import localFont from "next/font/local";

// Both fonts are self-hosted (SIL OFL, licences in src/fonts) so no build or
// page load depends on Google Fonts.

// Brand display face: Syne 700, the weight the wordmark is drawn in.
export const syne = localFont({
  src: "../fonts/syne-latin-700-normal.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-display",
});

// Text face: Inter variable (weights 100–900).
export const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-text",
});
