import { siteConfig } from "@/config/site";

// Site navigation. Labels and targets live only here. The anchors point at
// homepage sections that are still to be built (PLACEHOLDER).

export const primaryNav = [
  { label: "Product", href: "/#product" },
  { label: "Use cases", href: "/#use-cases" },
  { label: "Download", href: "/#download" },
];

export const signIn = { label: "Sign in", href: siteConfig.appUrl };

export const primaryCta = { label: "Open Keyfly", href: siteConfig.appUrl };
