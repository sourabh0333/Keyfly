import { siteConfig } from "@/config/site";

// Structured data (JSON-LD, schema.org) for the homepage: who makes KeyFly,
// the site, the app itself with its plans as offers, and the FAQ. It only
// states what the page already says; prices come from the pricing API, and
// there are no ratings or reviews until there are real ones.

const org = { "@id": `${siteConfig.url}/#organization` };
const site = { "@id": `${siteConfig.url}/#website` };
const app = { "@id": `${siteConfig.url}/#app` };

// What KeyFly does, for search engines: only what the app, its help, its
// export sheet and its download page confirm (the same facts the Product
// page shows).
const features = [
  "Make a video from a sentence, your own footage or one of 91 templates",
  "AI director writes the storyboard, voice-over and motion graphics",
  "Notes on every call the AI director makes, with revert and retry",
  "Silences and filler words cut from recordings",
  "Captions, zooms and callouts added automatically",
  "Brand kit filled from your website",
  "AI images, music beds and sound effects",
  "Export in 16:9, 9:16, 1:1 and 4:5, up to 4K",
  "Review links for comments and approval",
  "Timeline export as FCPXML, EDL and OpenTimelineIO for Final Cut Pro, DaVinci Resolve, Premiere Pro and Avid",
  "Edit with your own Claude Code, Codex, Cursor or other ACP agent",
  "Desktop apps for macOS and Windows, and a web app",
];

// Each plan the API prices, month to month. Free has no price in the API
// and costs nothing; a plan by arrangement (Enterprise) has no offer.
function offers(pricing) {
  if (!pricing) return undefined;
  const currency = pricing.currency || "USD";
  const list = pricing.plans
    .filter((p) => !p.contact)
    .map((p) => {
      const cents = p.monthly?.cents ?? (p.id === "free" ? 0 : null);
      if (cents === null) return null;
      return {
        "@type": "Offer",
        name: p.name,
        price: (cents / 100).toFixed(2),
        priceCurrency: currency,
        url: `${siteConfig.url}/pricing`,
        ...(p.seats?.perSeat ? { description: "Per seat, a month" } : { description: "A month" }),
      };
    })
    .filter(Boolean);
  return list.length ? list : undefined;
}

export function homeJsonLd({ description, faq, pricing }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        ...org,
        name: siteConfig.company,
        url: siteConfig.url,
        logo: `${siteConfig.url}/brand/lockup-light.svg`,
        email: "help@keyfly.si",
        brand: { "@type": "Brand", name: siteConfig.name },
      },
      {
        "@type": "WebSite",
        ...site,
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: "en",
        publisher: org,
      },
      {
        "@type": "SoftwareApplication",
        ...app,
        name: siteConfig.name,
        description,
        url: siteConfig.url,
        applicationCategory: "MultimediaApplication",
        applicationSubCategory: "AI video editor",
        // The app's download page: macOS 13 or later (Apple silicon and
        // Intel), Windows 10 and 11 (64-bit), and the browser.
        operatingSystem: "macOS 13 or later, Windows 10, Windows 11, Web browser",
        downloadUrl: [`${siteConfig.appUrl}/download/mac`, `${siteConfig.appUrl}/download/windows`],
        installUrl: siteConfig.appUrl,
        image: `${siteConfig.url}/opengraph-image`,
        publisher: org,
        featureList: features,
        offers: offers(pricing),
      },
      faqPage(faq),
    ],
  };
}

// The Product page: the page itself, where it sits (Home › Product) and the
// app it describes, with its features.
export function productJsonLd({ title, description }) {
  const url = `${siteConfig.url}/product`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: site,
        about: app,
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Product", item: url },
        ],
      },
      {
        "@type": "SoftwareApplication",
        ...app,
        name: siteConfig.name,
        url: siteConfig.url,
        applicationCategory: "MultimediaApplication",
        applicationSubCategory: "AI video editor",
        operatingSystem: "macOS 13 or later, Windows 10, Windows 11, Web browser",
        publisher: org,
        featureList: features,
      },
    ],
  };
}

// A page's place in the site, for a breadcrumb in search results.
function breadcrumb(url, name) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  };
}

// The Use cases page: a collection of the app's templates, listed by its
// ten categories (each with its template count and shelf on the page), a
// breadcrumb, and the page's questions.
export function useCasesJsonLd({ title, description, categories, faq }) {
  const url = `${siteConfig.url}/use-cases`;
  const total = categories.reduce((n, c) => n + c.templates.length, 0);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: site,
        about: app,
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#categories` },
      },
      breadcrumb(url, "Use cases"),
      {
        "@type": "ItemList",
        "@id": `${url}#categories`,
        name: `${total} KeyFly video templates, by category`,
        numberOfItems: categories.length,
        itemListElement: categories.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${c.name} (${c.templates.length} templates)`,
          description: c.line,
          url: `${url}#${c.id}`,
        })),
      },
      faqPage(faq),
    ],
  };
}

// The Integrations page: the page, its breadcrumb, the tools it works with
// (named, so search engines tie KeyFly to them) and its questions.
const integrations = [
  "Claude Code", "Codex", "Cursor", "Antigravity",
  "Final Cut Pro", "DaVinci Resolve", "Premiere Pro", "Avid",
  "ChatGPT", "Claude",
];

function faqPage(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function integrationsJsonLd({ title, description, faq }) {
  const url = `${siteConfig.url}/integrations`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: site,
        about: app,
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mentions: integrations.map((name) => ({ "@type": "SoftwareApplication", name })),
      },
      breadcrumb(url, "Integrations"),
      faqPage(faq),
    ],
  };
}

// The Pricing page: the page, its breadcrumb, the app with every plan the
// API prices as an offer, and the questions with their filled answers.
export function pricingJsonLd({ title, description, pricing, faq }) {
  const url = `${siteConfig.url}/pricing`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: site,
        about: app,
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      breadcrumb(url, "Pricing"),
      {
        "@type": "SoftwareApplication",
        ...app,
        name: siteConfig.name,
        url: siteConfig.url,
        applicationCategory: "MultimediaApplication",
        applicationSubCategory: "AI video editor",
        operatingSystem: "macOS 13 or later, Windows 10, Windows 11, Web browser",
        publisher: org,
        offers: offers(pricing),
      },
      ...(faq.length ? [faqPage(faq)] : []),
    ],
  };
}

// The lowest price a month of any paid plan with a price (billed yearly
// where the plan offers it), as "$5", or null.
export function lowestPaidPrice(pricing) {
  const cents = (pricing?.plans ?? [])
    .filter((p) => p.id !== "free" && !p.contact)
    .map((p) => p.annual?.cents ?? p.monthly?.cents)
    .filter((c) => typeof c === "number" && c > 0);
  if (!cents.length) return null;
  const low = Math.min(...cents) / 100;
  return "$" + (Number.isInteger(low) ? low : low.toFixed(2));
}

// The script tag's contents, with "<" escaped so no string can close it.
export function jsonLdHtml(data) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
