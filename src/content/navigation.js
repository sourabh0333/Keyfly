// Site navigation. The anchors point at homepage sections: #product is
// "Every desktop, every screen", #how-it-works the feature rows, #download
// the closing card. Change labels and targets here only.

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/#product" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Download", href: "/#download" },
];

export const primaryCta = { label: "Get Keyfly", href: "/#download" };

export const footerNav = [
  {
    title: "Explore",
    links: [
      { label: "Product", href: "/#product" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Download", href: "/#download" },
    ],
  },
  {
    title: "Company",
    links: [{ label: "Cevrynt Inc.", href: "https://www.cevrynt.com" }],
  },
];

export const footerContent = {
  lead: "A desktop video editor for macOS, Windows and Linux, from the first cut to the final frame.", // PLACEHOLDER
  note: "Keyfly is a Cevrynt Inc. product.",
};
