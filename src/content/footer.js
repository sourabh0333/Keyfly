import { siteConfig } from "@/config/site";
import { download, useCases } from "./home";

// The footer. Every link points at something that exists: the homepage
// sections, the presets, the two platforms and the web app.
export const footer = {
  cta: {
    title: [{ text: "Your next video" }, { text: "starts with a sentence.", accent: true }],
    primary: { label: "Open Keyfly", href: siteConfig.appUrl },
    secondary: { label: "Download", href: "/#download" },
  },
  // PLACEHOLDER until the product positioning is agreed (siteConfig).
  about: siteConfig.description,
  platforms: download.platforms.map((p) => p.label).join(" · "),
  columns: [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "/#product" },
        { label: "Use cases", href: "/#use-cases" },
        { label: "Download", href: "/#download" },
      ],
    },
    { title: "Use cases", links: useCases.items.map((item) => ({ label: item.label, href: "/#use-cases" })) },
    {
      title: "Keyfly",
      links: [
        { label: "Open Keyfly", href: siteConfig.appUrl },
        { label: "Sign in", href: siteConfig.appUrl },
        ...download.platforms.map((p) => ({ label: `Keyfly for ${p.label}`, href: "/#download" })),
      ],
    },
  ],
  company: siteConfig.company,
  domain: "keyfly.si",
  top: "Back to top",
};
