import { siteConfig } from "@/config/site";

// Structured data (JSON-LD, schema.org) for the homepage: who makes KeyFly,
// the site, the app itself with its plans as offers, and the FAQ. It only
// states what the page already says; prices come from the pricing API, and
// there are no ratings or reviews until there are real ones.

const org = { "@id": `${siteConfig.url}/#organization` };
const site = { "@id": `${siteConfig.url}/#website` };
const app = { "@id": `${siteConfig.url}/#app` };

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
        offers: offers(pricing),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

// The script tag's contents, with "<" escaped so no string can close it.
export function jsonLdHtml(data) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
