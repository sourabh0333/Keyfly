import { siteConfig } from "@/config/site";

// The 404 page (src/app/not-found.jsx) and the error pages
// (src/app/error.jsx, src/app/global-error.jsx). Each reads as a moment in
// an edit: a missing clip on the timeline, or a render that stopped.

const help = { label: "help@keyfly.si", href: "mailto:help@keyfly.si" };

// Where to go instead: the site's pages, each with a line of what's there
// (from the pages themselves).
const pages = [
  { label: "Home", href: "/", line: "The AI video editor for Mac, Windows and the web." },
  { label: "Product", href: "/product", line: "Every part of the editor, from prompt to export." },
  { label: "Use cases", href: "/use-cases", line: "91 templates in 10 categories." },
  { label: "Integrations", href: "/integrations", line: "Your own AI agent, and your own editor." },
  { label: "Pricing", href: "/pricing", line: "Start free. Plans, AI minutes and packs." },
];

export const notFound = {
  meta: {
    title: "Page not found",
    description: `This page isn't on ${siteConfig.name}. Here's where to go instead.`,
  },
  eyebrow: "Error 404",
  title: [{ text: "This shot" }, { text: "didn't make the cut.", accent: true }],
  lead: "The page you're looking for has moved, been renamed or never existed. Nothing's lost: pick up from one of these.",
  primary: { label: "Back to the homepage", href: "/" },
  secondary: { label: "Open KeyFly", href: siteConfig.appUrl },
  timeline: { gap: "404 · Missing clip", timecode: "00:04:04" },
  pagesLabel: "Try instead",
  pages,
  report: { line: "Followed a broken link? Tell us where you found it.", ...help },
};

export const serverError = {
  meta: { title: `Something went wrong · ${siteConfig.name}` },
  eyebrow: "Something went wrong",
  title: [{ text: "The render" }, { text: "stopped halfway.", accent: true }],
  lead: "Something on our side didn't load. Try again, and if it keeps happening, let us know.",
  retry: "Try again",
  home: { label: "Back to the homepage", href: "/" },
  timeline: { gap: "Render stopped", timecode: "00:05:00" },
  report: { line: "Still not working? Write to us and we'll look into it.", ...help },
};
