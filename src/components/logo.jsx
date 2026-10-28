import Image from "next/image";
import Link from "next/link";
import { cx } from "@/lib/cx";
import styles from "./logo.module.css";

// The brand-kit lockups, unaltered. `on` names the background the logo sits
// on: "paper" uses the ink lockup, "night" the paper-and-tungsten one.
const LOCKUPS = {
  paper: "/brand/lockup-light.svg",
  night: "/brand/lockup-dark.svg",
};

// Lockup artboard is 212×64 (symbol 64×64 + wordmark).
const RATIO = 212 / 64;

export function Logo({ on = "paper", height = 36, href = "/", eager = false, className }) {
  const image = (
    <Image
      src={LOCKUPS[on]}
      alt="Keyfly"
      width={Math.round(height * RATIO)}
      height={height}
      loading={eager ? "eager" : "lazy"}
    />
  );

  if (!href) {
    return <span className={cx(styles.logo, className)}>{image}</span>;
  }

  return (
    <Link href={href} className={cx(styles.logo, className)}>
      {image}
    </Link>
  );
}
