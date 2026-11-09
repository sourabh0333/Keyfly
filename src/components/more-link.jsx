import Link from "next/link";
import styles from "./more-link.module.css";

/**
 * A quiet link at the end of a section's lead to the page that covers the
 * section in depth ("How KeyFly cleans up a recording →"). It sits in the
 * body text on purpose: links in the copy tell search engines (and readers)
 * where each topic is explained in full, more than header or footer links.
 */
export function MoreLink({ label, href }) {
  if (!label || !href) return null;

  return (
    <>
      {" "}
      <Link href={href} className={styles.more}>
        {label}
        <span aria-hidden="true"> →</span>
      </Link>
    </>
  );
}
