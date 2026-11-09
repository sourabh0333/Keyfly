import Link from "next/link";

/**
 * Light inline markup for long-form copy (the legal pages, the blog):
 *   [label](href)   a link (Next's Link for site paths)
 *   **text**        emphasis
 *   `text`          a name from the app, set in mono (Settings → Agents)
 *   {{text}}        a fact the team must confirm, marked in amber
 * `classes` gives the caller's class for each: { link, code, confirm }.
 */
const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\{\{([^}]+)\}\}/g;

export function InlineText({ text, classes = {} }) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1]) {
      const href = m[2];
      out.push(
        href.startsWith("/") || href.startsWith("#") ? (
          <Link key={key} href={href} className={classes.link}>
            {m[1]}
          </Link>
        ) : (
          <a key={key} href={href} className={classes.link}>
            {m[1]}
          </a>
        ),
      );
    } else if (m[3]) {
      out.push(<strong key={key}>{m[3]}</strong>);
    } else if (m[4]) {
      out.push(
        <code key={key} className={classes.code}>
          {m[4]}
        </code>,
      );
    } else {
      out.push(
        <mark key={key} className={classes.confirm} title="To confirm before publishing">
          {m[5]}
        </mark>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Plain text of a marked-up string (for reading time, feeds, metadata). */
export function plainText(text) {
  return text.replace(INLINE, (_, l, _h, b, c, f) => l || b || c || f || "");
}
