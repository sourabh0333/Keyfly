import Link from "next/link";
import { Logo } from "@/components/logo";
import { primaryCta, primaryNav } from "@/content/navigation";
import { HeaderShell } from "./header-shell";
import { MenuBar } from "./menu-bar";
import styles from "./header.module.css";

/**
 * Server-rendered header, kept almost empty so the page's images lead:
 * the logo top left, one small call to action top right, and the menu bar
 * floating at the bottom of the screen.
 */
export function SiteHeader() {
  return (
    <HeaderShell className={styles.header}>
      <div className={styles.bar}>
        {/* Animated logo; its colours follow the header's tone. */}
        <Logo className={styles.brand} height={28} />

        <Link href={primaryCta.href} className={styles.cta}>
          <svg className={styles.ctaArrow} viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
            <path d="M2 2l8 8M10 4v6H4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {primaryCta.label}
        </Link>
      </div>

      <MenuBar items={primaryNav} cta={primaryCta} />
    </HeaderShell>
  );
}
