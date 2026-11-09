// Single source for site-wide facts.
export const siteConfig = {
  name: "KeyFly",
  // The app's About: "KeyFly.si is a Cevrynt Inc. product."
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://keyfly.si",
  // The KeyFly web app. Every "open the app" action points here.
  appUrl: "https://app.keyfly.si",
  company: "Cevrynt Inc.",
  // From the app ("Describe it in a sentence. KeyFly writes the storyboard,
  // voice-over and motion graphics") and its download page.
  description: "The AI video editor for Mac, Windows and the browser. Describe a video in a sentence, and KeyFly writes the storyboard, voice-over and motion graphics, on a timeline you can change.",
  locale: "en_US",
  // Whether search engines may index the site. On, now that no copy is
  // marked PLACEHOLDER. Set NEXT_PUBLIC_NOINDEX=true on any preview or
  // staging deploy so it never competes with keyfly.si in search.
  indexable: process.env.NEXT_PUBLIC_NOINDEX !== "true",
};

// The robots setting for the site's public pages (the homepage, Product,
// Use cases, Integrations and Pricing). Legal pages and the styleguide keep
// their own noindex.
export const publicRobots = siteConfig.indexable
  ? { index: true, follow: true }
  : { index: false, follow: false };

// The public pages, for the sitemap (src/app/sitemap.js). `updated` is the
// date of the page's last significant change: its copy, its sections, its
// structured data or its links (not a style tweak). Google uses a sitemap's
// lastmod only while it stays accurate, so change the date only when the
// page really changes, and add a page here when it goes public.
export const publicPages = [
  { path: "/", updated: "2026-11-09" },
  { path: "/product", updated: "2026-11-09" },
  { path: "/use-cases", updated: "2026-11-09" },
  { path: "/integrations", updated: "2026-11-09" },
  { path: "/pricing", updated: "2026-11-09" },
  { path: "/blog", updated: "2026-11-09" },
];
