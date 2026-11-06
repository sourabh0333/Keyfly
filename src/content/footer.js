import { siteConfig } from "@/config/site";
import { download } from "./home";
import { primaryCta, signIn } from "./navigation";
import { categories } from "./use-cases";

// The footer. Every link points at something that exists: the pages and
// homepage sections, the app's template categories (on the Use cases
// page; the app no longer has the six presets), the two platforms and the
// web app.
export const footer = {
  cta: {
    title: [{ text: "Your next video" }, { text: "starts with a sentence.", accent: true }],
    primary: primaryCta,
    secondary: { label: "Download", href: "/#download" },
  },
  about: siteConfig.description,
  platforms: download.platforms.map((p) => p.label).join(" · "),
  columns: [
    {
      title: "Product",
      links: [
        { label: "Overview", href: "/product" },
        { label: "How it works", href: "/#product" },
        { label: "Use cases", href: "/use-cases" },
        { label: "Integrations", href: "/#tools" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Download", href: "/#download" },
      ],
    },
    {
      title: "Use cases",
      links: [
        ...categories.slice(0, 5).map((c) => ({ label: c.name, href: `/use-cases#${c.id}` })),
        { label: "All 91 templates", href: "/use-cases#categories" },
      ],
    },
    {
      title: "KeyFly",
      links: [
        { label: "Open KeyFly", href: siteConfig.appUrl },
        signIn,
        ...download.platforms.map((p) => ({ label: `KeyFly for ${p.label}`, href: p.href || "/#download" })),
        { label: "Help", href: "mailto:help@keyfly.si" },
      ],
    },
  ],
  company: siteConfig.company,
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
  domain: "keyfly.si",
  top: "Back to top",
};
