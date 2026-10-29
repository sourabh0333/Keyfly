import { Fragment } from "react";

/**
 * Renders content text where *one word* takes the serif italic accent
 * (an <em>, styled in globals.css for headings).
 */
export function AccentText({ text }) {
  return text.split(/\*(.+?)\*/).map((part, index) =>
    index % 2 ? <em key={index}>{part}</em> : <Fragment key={index}>{part}</Fragment>,
  );
}

/** The same text without the accent markers, for labels. */
export function plainText(text) {
  return text.replace(/\*/g, "");
}
