// Single source for site-wide facts. Placeholder copy is marked; replace it
// once the product description is confirmed (see PLAN.md, open questions).
export const siteConfig = {
  name: "Keyfly",
  // Domain taken from the installer art ("Keyfly.si"); unconfirmed.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://keyfly.si",
  company: "Cevrynt Inc.",
  // Placeholder until the product positioning is agreed.
  description: "Keyfly is a desktop app for macOS, Windows and Linux.",
  locale: "en_US",
};
