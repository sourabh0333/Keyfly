import { siteConfig } from "@/config/site";
import { download, prompt, useCases } from "./home";

// The footer, laid out as a film's end credits. Every credit points at
// something that exists: the homepage sections, the presets, the two
// platforms and the web app.
export const footer = {
  eyebrow: "That's a wrap",
  title: [{ text: "Your next video" }, { text: "starts with a sentence.", accent: true }],
  bar: { placeholder: prompt.placeholder, label: "Back to the prompt" },
  credits: [
    { role: "Product", links: [{ label: "How it works", href: "/#product" }] },
    { role: "Use cases", links: useCases.items.map((item) => ({ label: item.label, href: "/#use-cases" })) },
    { role: "Download", links: download.platforms.map((p) => ({ label: p.label, href: "/#download" })) },
    {
      role: "The app",
      links: [
        { label: "Open Keyfly", href: siteConfig.appUrl },
        { label: "Sign in", href: siteConfig.appUrl },
      ],
    },
    { role: "A product of", links: [{ label: siteConfig.company, href: null }] },
  ],
  // The page plays as 48 seconds on the page timeline (see Scrubber).
  end: { code: "00:00:48:00", label: "End of reel" },
  top: "Back to top",
  domain: "keyfly.si",
};
