import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { Magnetic } from "@/components/magnetic";
import { primaryCta, primaryNav } from "@/content/navigation";
import { DesktopNav } from "./desktop-nav";
import { HeaderShell } from "./header-shell";
import { MobileMenu } from "./mobile-menu";
import styles from "./header.module.css";

// Server-rendered header: every link is in the HTML. Client pieces add the
// scroll state, the tone switch and the flying nav point on top.
export function SiteHeader() {
  return (
    <HeaderShell className={styles.header}>
      <div className={styles.bar}>
        {/* Animated lockup; its colours follow the header's tone. */}
        <Logo className={styles.brand} height={36} />

        <DesktopNav items={primaryNav} className={styles.nav} />

        <div className={styles.actions}>
          <Magnetic className={styles.cta}>
            <Button href={primaryCta.href} arrow>
              {primaryCta.label}
            </Button>
          </Magnetic>
          <MobileMenu items={primaryNav} cta={primaryCta} />
        </div>
      </div>

      {/* Reading progress: the flight path along the header's edge, with the
          point travelling at its tip. Scroll-driven CSS, no JS. */}
      <span className={styles.progress} aria-hidden="true">
        <span className={styles.flight}>
          <span className={styles.trail} />
          <span className={styles.tip} />
        </span>
      </span>
    </HeaderShell>
  );
}
