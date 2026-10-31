import Link from "next/link";
import { Logo } from "@/components/logo";
import wipe from "@/components/scene/wipe.module.css";
import { siteConfig } from "@/config/site";
import { footer } from "@/content/footer";
import { PromptBar } from "./prompt-bar";
import styles from "./site-footer.module.css";

function Credit({ label, href }) {
  if (!href) return <span className={styles.name}>{label}</span>;
  const external = href.startsWith("http");
  return external ? (
    <a href={href} className={styles.name}>
      {label}
    </a>
  ) : (
    <Link href={href} className={styles.name}>
      {label}
    </Link>
  );
}

/**
 * The footer as a film's end credits: an end card that hands back to the
 * prompt, the site's links rolled as credits either side of a mint spine,
 * and the final frame, where the reel's playhead reaches the end and the
 * Keyfly lockup draws itself in.
 */
export function SiteFooter() {
  const { eyebrow, title, bar, credits, end, top, domain } = footer;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-labelledby="footer-title">
      <div className={styles.inner}>
        <div className={styles.endCard}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowMark} aria-hidden="true" />
            {eyebrow}
            <span className={styles.eyebrowMark} aria-hidden="true" />
          </p>
          <h2 id="footer-title" className={`${styles.title} ${wipe.wipe}`}>
            {title.map((line, i) => (
              <span key={i} className={line.accent ? styles.accent : styles.plain}>
                {line.text}
                {i < title.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <PromptBar {...bar} />
        </div>

        <nav aria-label="Footer">
          <dl className={styles.credits}>
            {credits.map((credit) => (
              <div key={credit.role} className={styles.credit}>
                <dt className={styles.role}>{credit.role}</dt>
                <dd className={styles.names}>
                  {credit.links.map((link, i) => (
                    <span key={link.label}>
                      {i > 0 ? <span className={styles.sep} aria-hidden="true" /> : null}
                      <Credit {...link} />
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </nav>

        <div className={styles.final}>
          <div className={styles.reel} aria-hidden="true">
            <span className={styles.ruler} />
            <span className={styles.playhead} />
            <span className={styles.endTag}>
              {end.code} · {end.label}
            </span>
          </div>

          <div className={styles.lockup}>
            <Logo height={64} play="view" />
          </div>

          <div className={styles.legal}>
            <span>
              © {year} {siteConfig.company}
            </span>
            <span className={styles.domain}>{domain}</span>
            <a href="#main" className={styles.top}>
              {top}
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
