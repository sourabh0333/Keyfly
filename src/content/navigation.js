import { siteConfig } from "@/config/site";

// Site navigation. Labels and targets live only here.
//
// Plain links only (2026-11-05, the team's decision): a menu of items that
// are only sections, not pages of their own, read as pages that don't
// exist. The header still supports a dropdown (`menu: { groups, feature,
// all }`, see src/components/header/mega-menu.jsx) for when items have
// pages of their own. When the Use cases, Integrations and Download pages
// are built, point these links at them (PLAN.md, "Site pages"); Use cases
// points at its page from 2026-11-05, while it is being built.

export const primaryNav = [
  { label: "Product", href: "/product" },
  { label: "Use cases", href: "/use-cases" },
  // Your own AI agents, the ChatGPT and Claude apps, and export to other
  // editors ("Open by design").
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/pricing" },
];

// The app's own sign-in and free sign-up (the links the pricing API gives
// the Free plan; the free plan never expires, and Creator has a 7-day trial).
export const signIn = { label: "Sign in", href: `${siteConfig.appUrl}/login` };

export const primaryCta = { label: "Start free", href: `${siteConfig.appUrl}/signup?plan=free` };

// The header's Download button names the visitor's system (the real builds
// at app.keyfly.si/download, 2026-11-03). Other systems, and the server's
// HTML, get the Download section; phones get the web app.
// A Mac gets the Apple silicon build, or the Intel build where the browser
// can tell it's an Intel Mac (Chrome and Edge can; Safari can't). After a
// click, a small note says the download is starting, what to do with the
// file, and offers the other Mac build and a retry.
export const download = {
  label: "Download",
  mac: { label: "Download for Mac", href: `${siteConfig.appUrl}/download/mac` },
  macIntel: { label: "Download for Intel Mac", href: `${siteConfig.appUrl}/download/mac-intel` },
  windows: { label: "Download for Windows", href: `${siteConfig.appUrl}/download/windows` },
  started: {
    title: "Your download is starting",
    build: { mac: "KeyFly for Mac · Apple silicon", macIntel: "KeyFly for Mac · Intel", windows: "KeyFly for Windows" },
    // The app download page's own steps (as in the homepage's Download).
    next: {
      mac: "Open the .dmg and drag KeyFly to Applications.",
      windows: "Run the installer. Windows asks once before KeyFly first opens.",
    },
    other: { mac: "Intel Mac? Get that build", macIntel: "Apple silicon Mac? Get that build" },
    retry: "Didn't start? Try again",
    close: "Close",
  },
  other: { label: "Download", href: "/#download" },
  phone: { label: "Open in browser", href: siteConfig.appUrl },
};
