import { siteConfig } from "@/config/site";

// Site navigation. Labels and targets live only here. The anchors point at
// homepage sections.

export const primaryNav = [
  { label: "Product", href: "/#product" },
  { label: "Use cases", href: "/#use-cases" },
  // Your own AI agents, the ChatGPT and Claude apps, and export to other
  // editors ("Works with your tools").
  { label: "Integrations", href: "/#tools" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Download", href: "/#download" },
];

// The app's own sign-in and free sign-up (the links the pricing API gives
// the Free plan; the free plan never expires, and Creator has a 7-day trial).
export const signIn = { label: "Sign in", href: `${siteConfig.appUrl}/login` };

export const primaryCta = { label: "Start free", href: `${siteConfig.appUrl}/signup?plan=free` };
