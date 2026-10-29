import Image from "next/image";
import Link from "next/link";
import shotWide from "@/assets/hero/shot-1-wide.webp";
import { Logo } from "@/components/logo";
import { footerContent, footerNav, primaryCta } from "@/content/navigation";
import { BackToTop } from "./back-to-top";
import styles from "./footer.module.css";

function isExternal(href) {
  return /^https?:/.test(href);
}

/**
 * The footer as the page's last shot, in the hero's pattern: the opening
 * photo returns full-bleed (the camera pushes in as it scrolls into view)
 * under the same faint grid. A small call to action and a note sit top
 * left, the links top right in spaced capitals, and the Keyfly logo spans
 * the bottom of the frame, playing its light-painting intro when it comes
 * into view.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-tone="night" data-section="Get Keyfly" className={styles.footer}>
      <div className={styles.frame} aria-hidden="true">
        <Image src={shotWide} alt="" fill sizes="100vw" placeholder="blur" className={styles.photo} />
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.lead}>
            <Link href={primaryCta.href} className={styles.cta}>
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                <path
                  d="M2 2l8 8M10 4v6H4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {primaryCta.label}
            </Link>
            <p className={styles.note}>{footerContent.lead}</p>
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
          <div className={styles.meta}>
            <p>
              © {year} Cevrynt Inc. · {footerContent.note}
            </p>
            <BackToTop />
          </div>
          {/* The brand lockup, unaltered, at the full width of the frame. */}
          <Logo href={null} height={240} play="view" className={styles.bigLogo} />
        </div>
      </div>
    </footer>
  );
}
