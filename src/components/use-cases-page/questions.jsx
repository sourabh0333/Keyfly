import wipe from "@/components/scene/wipe.module.css";
import { useCasesFaq } from "@/content/use-cases";
import styles from "./questions.module.css";

const pad = (n) => String(n).padStart(2, "0");

function Arrow({ out }) {
  return out ? (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <span aria-hidden="true">→</span>
  );
}

/**
 * Use cases page, "Questions": the heading and a way to ask anything else,
 * sticky beside a list of questions that open in place. Each is a native
 * <details> (a keyboard, a screen reader and the page's search all work,
 * with no script); the first is open. Calm on purpose, and unlike the
 * homepage's "Ask KeyFly" panel, which types its answers.
 */
export function Questions() {
  const { eyebrow, title, lead, help, items } = useCasesFaq;

  return (
    <section id="questions" className={styles.section} aria-labelledby="questions-title" data-section="Questions">
      <div className={styles.inner}>
        <div className={styles.side}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowMark} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 id="questions-title" className={`${styles.title} ${wipe.wipe}`}>
            {title.map((line, i) => (
              <span key={i} className={line.accent ? styles.accent : styles.plain}>
                {line.text}
                {i < title.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.help}>
            <p className={styles.helpLabel}>{help.label}</p>
            <a className={styles.helpMail} href={`mailto:${help.email}`}>
              {help.email}
            </a>
            <p className={styles.helpLine}>{help.line}</p>
          </div>
        </div>

        <ol className={styles.list} data-main="">
          {items.map((item, i) => (
            <li key={item.q}>
              <details className={styles.item} open={i === 0}>
                <summary className={styles.q}>
                  <em>{pad(i + 1)}</em>
                  <span>{item.q}</span>
                  <i className={styles.plus} aria-hidden="true" />
                </summary>
                <div className={styles.a}>
                  <p>{item.a}</p>
                  {item.link ? (
                    <a href={item.link.href} {...(item.link.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                      {item.link.label} <Arrow out={item.link.external} />
                    </a>
                  ) : null}
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
