import Link from "next/link";
import { cx } from "@/lib/cx";
import styles from "./button.module.css";

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M2.5 8h10M9 4.5 12.5 8 9 11.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One button for every call to action.
 * - variant "solid": round mint fill (white text on Paper, Mint ink on
 *   Night), for the single primary action.
 * - variant "ghost": round glass with a hairline, for the secondary action
 *   beside it.
 * - variant "link": text with a drawn underline, for quieter actions.
 * Renders a Next.js Link for internal hrefs, <a> for external ones and
 * <button> when there is no href. Colours come from the surrounding tone.
 */
export function Button({
  href,
  variant = "solid",
  size = "m",
  arrow = false,
  className,
  children,
  ...rest
}) {
  const classes = cx(styles.button, styles[variant], styles[size], className);
  const content = (
    <>
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </>
  );

  if (!href) {
    return (
      <button type="button" className={classes} {...rest}>
        {content}
      </button>
    );
  }

  if (/^(https?:|mailto:)/.test(href)) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
