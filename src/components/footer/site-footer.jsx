import Link from "next/link";
import { Logo } from "@/components/logo";
import { footer } from "@/content/footer";
import styles from "./site-footer.module.css";

function FooterLink({ label, href, className }) {
  return href.startsWith("http") ? (
    <a href={href} className={className}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The site footer: a closing call to action, then the brand (logo, line,
 * platforms) beside three columns of links, and a bottom bar with the
 * copyright. Its top edge is a timeline ruler with the mint playhead at the
 * end of the reel.
 *
 * While the page is above it the footer has data-await (set by the page's
 * light, see SceneLight) and its contents wait, dimmed; as it comes well
 * into view (data-arrived) the playhead pulses, a comet of light runs round
 * the panel and the contents rise in. Without the script, everything just
 * shows.
 */
export function SiteFooter() {
  const { cta, about, platforms, columns, company, domain, top } = footer;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.panel}>
          <span className={styles.comet} aria-hidden="true" />
          <div className={styles.reel} aria-hidden="true">
            <span className={styles.playhead} />
          </div>

          <div className={styles.cta} style={{ "--i": 0 }}>
            <p className={styles.ctaTitle}>
              {cta.title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < cta.title.length - 1 ? " " : null}
                </span>
              ))}
            </p>
            <div className={styles.ctaActions}>
              <a href={cta.primary.href} className={styles.primary}>
                {cta.primary.label}
                <Arrow />
              </a>
              <Link href={cta.secondary.href} className={styles.secondary}>
                {cta.secondary.label}
              </Link>
            </div>
          </div>

          <div className={styles.main}>
            <div className={styles.brand} style={{ "--i": 1 }}>
              <Logo height={30} play="view" />
              <p className={styles.about}>{about}</p>
              <p className={styles.platforms}>
                <i aria-hidden="true" />
                {platforms}
              </p>
            </div>

            <nav className={styles.columns} aria-label="Footer">
              {columns.map((column, i) => (
                <div key={column.title} className={styles.column} style={{ "--i": i + 2 }}>
                  <p className={styles.columnTitle}>{column.title}</p>
                  <ul>
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <FooterLink {...link} className={styles.link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className={styles.bottom} style={{ "--i": 5 }}>
            <span>
              © {year} {company}
            </span>
            <span className={styles.bottomRight}>
              <span className={styles.domain}>{domain}</span>
              <a href="#main" className={styles.top}>
                {top}
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                  <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
