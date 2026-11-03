import { siteConfig } from "@/config/site";
import { download, useCases } from "./home";
import { primaryCta, signIn } from "./navigation";

// The footer. Every link points at something that exists: the homepage
// sections, the presets, the two platforms and the web app.
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
        { label: "How it works", href: "/#product" },
        { label: "Use cases", href: "/#use-cases" },
        { label: "Integrations", href: "/#tools" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Download", href: "/#download" },
      ],
    },
    { title: "Use cases", links: useCases.items.map((item) => ({ label: item.label, href: "/#use-cases" })) },
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
