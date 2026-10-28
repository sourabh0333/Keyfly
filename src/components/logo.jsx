import Link from "next/link";
import { cx } from "@/lib/cx";
import { AnimatedLogo } from "./logo/animated-logo";
import styles from "./logo.module.css";

/**
 * The Keyfly lockup, animated (see AnimatedLogo), optionally as a home link.
 * Colours follow the surrounding tone, so the same component serves Paper
 * and Night surfaces. The static brand-kit files in /public/brand remain for
 * places that cannot run CSS (share images, emails).
 */
export function Logo({ height = 36, href = "/", play = "load", className, onClick }) {
  if (!href) {
    return (
      <span className={cx(styles.logo, className)}>
        <AnimatedLogo height={height} play={play} />
      </span>
    );
  }

  return (
    <Link href={href} className={cx(styles.logo, className)} aria-label="Keyfly home" onClick={onClick}>
      <AnimatedLogo height={height} play={play} label={null} />
    </Link>
  );
}
