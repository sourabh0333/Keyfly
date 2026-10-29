// Homepage copy. Facts come only from the brand kit: Keyfly is a desktop
// video editor for macOS, Windows and Linux (it ships installers for all
// three), and its own tools are the AI director, first cut, keyframes, beat
// sync, trailer, brand kit, templates, captions and reframe
// (brand-kit/README.md, "Icons"). No numbers, customers or pricing: the
// panels are illustrative interface, labelled as such.
// PLACEHOLDER marks copy to confirm once the product details are agreed.
// In titles, *one word* takes the serif italic accent.

// The hero is three "shots" the camera moves through as you scroll. Each
// has three words, placed at a spot on the frame (top-left, middle-right,
// bottom-right…), and a short note in the free bottom corner. The first
// shot's words are the page's h1. Photos: Unsplash License (see
// src/assets/hero/CREDITS.md).
export const hero = {
  title: "Every shot, landed.",
  shots: [
    {
      id: "wide",
      words: [
        { text: "Every", at: "top-left" },
        { text: "shot,", at: "middle-right" },
        { text: "landed.", at: "bottom-left" },
      ],
      note: {
        at: "bottom-right",
        text: "Keyfly is a desktop video editor for macOS, Windows and Linux. It takes your footage from the first cut to the final frame.", // PLACEHOLDER
      },
    },
    {
      id: "medium",
      words: [
        { text: "Cut", at: "top-right" },
        { text: "on the", at: "middle-left" },
        { text: "beat.", at: "bottom-right" },
      ],
      note: {
        at: "bottom-left",
        text: "Beat sync lines your cuts up with the music, so the edit moves with the track.", // PLACEHOLDER
      },
    },
    {
      id: "close",
      words: [
        { text: "Frame", at: "top-left" },
        { text: "by", at: "middle-center" },
        { text: "frame.", at: "bottom-right" },
      ],
      note: {
        at: "bottom-left",
        text: "Keyframes and an AI director shape every move, until the shot lands exactly where you want it.", // PLACEHOLDER
      },
    },
  ],
};

// The tools showcase after the hero: one tool at a time, like the
// reference's featured project. The visuals are illustrative interface
// (feature-panels.jsx), not screenshots.
export const toolsShowcase = {
  id: "product",
  label: "Keyfly's own tools",
  slides: [
    {
      id: "director",
      name: "Director",
      kicker: "AI director",
      text: "Tell the AI director what the edit needs, in plain words. Every change lands on the timeline, where you can see it and shape it.", // PLACEHOLDER
    },
    {
      id: "first-cut",
      name: "First cut",
      kicker: "First cut",
      text: "Start from a first cut of your footage instead of an empty timeline, then make it yours.", // PLACEHOLDER
    },
    {
      id: "beat-sync",
      name: "Beat sync",
      kicker: "Beat sync",
      text: "Line your cuts up with the beat of the music, so the edit moves with the track.", // PLACEHOLDER
    },
  ],
};

// Keyfly at a glance, after the reference's numbers. Only true facts from
// the brand kit: nine tools of its own, three desktops, one editor.
export const glance = {
  title: "Keyfly at a glance",
  statement: ["From the first cut", "to the final frame"],
  figures: [
    { id: "tools", value: 9, label: "Tools of its own", at: "top-right" },
    { id: "desktops", value: 3, label: "Desktops: macOS, Windows, Linux", at: "bottom-left" },
    { id: "editor", value: 1, label: "Editor for all of it", at: "bottom-right" },
  ],
};

// The download, on the mint the glance section's point grows into. Words
// are placed on the frame like the hero's. Each platform reads "soon" until
// it has a real link (href: null).
export const downloadSection = {
  id: "download",
  title: "Download Keyfly",
  label: ["Get Keyfly", "macOS · Windows · Linux"],
  words: [
    { text: "Land", at: "top-right" },
    { text: "your next", at: "middle-left" },
    { text: "shot.", at: "bottom-left" },
  ],
  note: "Download links are coming soon.", // PLACEHOLDER
  platforms: [
    { id: "macos", name: "macOS", href: null },
    { id: "windows", name: "Windows", href: null },
    { id: "linux", name: "Linux", href: null },
  ],
};

export const toolStrip = {
  label: "keyfly's own tools, on one timeline",
  tools: [
    { short: "AI", name: "director" },
    { short: "FC", name: "first cut" },
    { short: "KF", name: "keyframes" },
    { short: "BS", name: "beat sync" },
    { short: "TR", name: "trailer" },
    { short: "BK", name: "brand kit" },
    { short: "TP", name: "templates" },
    { short: "CC", name: "captions" },
    { short: "RF", name: "reframe" },
  ],
};

export const features = {
  id: "how-it-works",
  chip: "how it works",
  title: "Most of an edit is *busywork.*",
  aside:
    "Laying out a first pass. Matching cuts to the beat. Reframing for every screen. Keyfly's own tools take the busywork and leave you the decisions.", // PLACEHOLDER
  rows: [
    {
      id: "first-cut",
      kicker: "01 / first cut",
      title: "One timeline, every cut",
      text: "Start from a first cut of your footage instead of an empty timeline, then shape it.", // PLACEHOLDER
    },
    {
      id: "director",
      kicker: "02 / ai director",
      title: "Direct it in plain words",
      text: "Tell the AI director what the edit needs. Every change lands on the timeline, where you can see it.", // PLACEHOLDER
    },
    {
      id: "beat-sync",
      kicker: "03 / beat sync",
      title: "Every cut on the beat",
      text: "Line your cuts up with the beat of the music, so the edit moves with the track.", // PLACEHOLDER
    },
  ],
};

export const statement = {
  kicker: "// the idea",
  // Revealed word by word as you scroll; *word* takes the accent.
  text: "The best cut is the one *nobody* notices.",
};

export const desktops = {
  id: "product",
  chip: "one editor",
  title: "*Every* desktop, every screen.",
  aside: "Keyfly runs on macOS, Windows and Linux, and reframes one edit for wide, square and vertical screens.", // PLACEHOLDER
  hub: {
    title: "One editor, every desktop",
    text: "The same Keyfly on macOS, Windows and Linux.",
    nodes: ["macOS", "Windows", "Linux"],
    note: "one project / three desktops",
  },
  reframe: {
    title: "Reframe for every screen",
    text: "Reframe one edit for wide, square and vertical formats.", // PLACEHOLDER
    formats: [
      { id: "wide", label: "wide", ratio: "16:9" },
      { id: "square", label: "square", ratio: "1:1" },
      { id: "vertical", label: "vertical", ratio: "9:16" },
    ],
  },
};

export const overview = {
  chip: "illustrative interface",
  title: "An edit, *seen* from Keyfly.",
  aside: "The timeline, the export, the captions and the music, side by side. A picture of the tools, not a screenshot.",
};

export const getKeyfly = {
  id: "download",
  brandNote: "The desktop video editor for the moment a shot lands.", // PLACEHOLDER
  kicker: "// get keyfly",
  title: "Land your *next* shot.",
  text: "Keyfly is coming to macOS, Windows and Linux.", // PLACEHOLDER
  // href: null until the download links exist; the button then reads "soon".
  platforms: [
    { id: "macos", name: "macOS", href: null },
    { id: "windows", name: "Windows", href: null },
    { id: "linux", name: "Linux", href: null },
  ],
};
