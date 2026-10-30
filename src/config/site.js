// Single source for site-wide facts. Placeholder copy is marked; replace it
// once the product description is confirmed (see PLAN.md, open questions).
export const siteConfig = {
  name: "Keyfly",
  // Domain taken from the installer art ("Keyfly.si"); unconfirmed.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://keyfly.si",
  // The Keyfly web app. Every "open the app" action points here.
  appUrl: "https://app.keyfly.si",
  company: "Cevrynt Inc.",
  // PLACEHOLDER until the product positioning is agreed.
  description: "Describe your video, or drop in your footage, and Keyfly edits it into a finished video.",
  locale: "en_US",
};
