// Site navigation. Placeholder structure until the product pages are agreed
// (PLAN.md, open questions): the anchors point at homepage sections that are
// built in steps 5–8. Change labels and targets here only.

export const primaryNav = [
  { label: "Product", href: "/#product" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Download", href: "/#download" },
  { label: "FAQ", href: "/#faq" },
];

export const primaryCta = { label: "Get Keyfly", href: "/#download" };

export const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/#product" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Download", href: "/#download" },
    ],
  },
  {
    title: "Help",
    links: [{ label: "FAQ", href: "/#faq" }],
  },
  {
    title: "Company",
    links: [{ label: "Cevrynt Inc.", href: "https://www.cevrynt.com" }],
  },
];

// Placeholder closing line, drawn from the brand idea ("the moment a shot
// lands"). Replace once the positioning is agreed.
export const footerContent = {
  closing: "Land the shot.",
  note: "Keyfly is a Cevrynt Inc. product.",
};
