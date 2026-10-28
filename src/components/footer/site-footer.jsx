import Link from "next/link";
import { Button } from "@/components/button";
import { FlightPath } from "@/components/flight-path";
import { Logo } from "@/components/logo";
import { Magnetic } from "@/components/magnetic";
import { footerContent, footerNav, primaryCta } from "@/content/navigation";
import { BackToTop } from "./back-to-top";
import { GlowSurface } from "./glow-surface";
import styles from "./footer.module.css";

/**
 * The footer's flight: a long run-in from the left, one loop, then a lift to
 * land the amber point above the closing call to action. Same gesture as the
 * symbol, stretched across the page. "xMaxYMid slice" keeps the loop and the
 * landing in view on narrow screens, where the run-in is cropped instead of
 * the drawing being squashed.
 */
const FOOTER_FLIGHT = {
  viewBox: "0 0 1200 220",
  preserveAspectRatio: "xMaxYMid slice",
  d: "M0 200 C 260 198, 560 182, 780 130 C 880 106, 930 64, 896 40 C 862 18, 822 58, 862 92 C 900 124, 1010 112, 1150 44",
  point: { cx: 1177, cy: 31, r: 12 },
  strokeWidth: 4,
};

function isExternal(href) {
  return /^https?:/.test(href);
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <GlowSurface as="footer" data-tone="night" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.landing}>
          <FlightPath shape={FOOTER_FLIGHT} play="view" className={styles.flight} />
          <div className={styles.closingRow}>
            <h2 className={styles.closing}>{footerContent.closing}</h2>
            <Magnetic>
              <Button href={primaryCta.href} size="l" arrow>
                {primaryCta.label}
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className={styles.columns}>
          <div className={styles.brandCol}>
            <Logo height={32} play="view" />
            <p className={styles.note}>{footerContent.note}</p>
          </div>

          <nav aria-label="Footer" className={styles.groups}>
            {footerNav.map((group) => (
              <div key={group.title} className={styles.group}>
                <p className={styles.groupTitle} id={`footer-${group.title.toLowerCase()}`}>
                  {group.title}
                </p>
                <ul className={styles.links} aria-labelledby={`footer-${group.title.toLowerCase()}`}>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {isExternal(link.href) ? (
                        <a href={link.href} className={styles.link} rel="noopener">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={styles.link}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>© {year} Cevrynt Inc. All rights reserved.</p>
          <BackToTop />
        </div>
      </div>
    </GlowSurface>
  );
}
