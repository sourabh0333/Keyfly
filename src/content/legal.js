import { siteConfig } from "@/config/site";

// The legal pages. The app's sign-in links to keyfly.si/terms and
// keyfly.si/privacy, so these pages must exist. Their full text comes from
// the team: until it arrives each page says so, and never invents terms.
// Privacy lists only what the KeyFly app itself states (read 2026-11-03),
// quoted, and says it isn't the policy.

const contact = { label: "help@keyfly.si", href: "mailto:help@keyfly.si" };

export const legal = {
  terms: {
    path: "/terms",
    eyebrow: "Legal",
    title: [{ text: "Terms of" }, { text: "Service.", accent: true }],
    meta: "Terms of Service",
    description: `The terms for using ${siteConfig.name}.`,
    status: "Being finalised",
    intro: `The full terms for using ${siteConfig.name}, on the web, on the desktop and inside ChatGPT and Claude, are being finalised. They'll be published on this page.`,
    sections: [],
    contactLine: "Questions about the terms? Write to us and we'll answer within one working day.",
    contact,
    company: `KeyFly.si is a ${siteConfig.company} product.`,
  },
  privacy: {
    path: "/privacy",
    eyebrow: "Legal",
    title: [{ text: "Privacy" }, { text: "Policy.", accent: true }],
    meta: "Privacy Policy",
    description: `How ${siteConfig.name} handles your footage and data.`,
    status: "Being finalised",
    intro: `The full privacy policy for ${siteConfig.name} is being finalised and will be published on this page. Until then, here is what the app itself tells you.`,
    sections: [
      {
        title: "What the app already tells you",
        note: "Quoted from the KeyFly app. This is not the privacy policy.",
        items: [
          { where: "Desktop app", text: "Footage stays on your computer. Nothing uploads unless an AI step needs it." },
          { where: "Export", text: "Made on this device. Nothing is uploaded." },
          { where: "Usage data", text: "Which features you use, so we can make KeyFly better. Never your videos, prompts or files." },
          { where: "Your projects", text: "Your projects stay yours and you can always export them." },
          { where: "Deleting your account", text: "Email support@keyfly.si from the address you sign in with, and we'll remove it and your videos." },
        ],
      },
    ],
    contactLine: "Questions about privacy? Write to us and we'll answer within one working day.",
    contact,
    company: `KeyFly.si is a ${siteConfig.company} product.`,
  },
  back: { label: "Back to KeyFly", href: "/" },
};
