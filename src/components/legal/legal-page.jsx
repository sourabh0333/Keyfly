import Link from "next/link";
import { legal } from "@/content/legal";
import styles from "./legal-page.module.css";

/**
 * A legal page (Terms, Privacy): the heading as on the homepage's sections,
 * a status chip while the text is being finalised, the intro, any sections
 * (each a hairline list), and how to reach us.
 */
export function LegalPage({ page }) {
  const { eyebrow, title, status, intro, sections, contactLine, contact, company } = page;

  return (
    <article className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowMark} aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className={styles.title}>
          {title.map((line, i) => (
            <span key={i} className={line.accent ? styles.accent : styles.plain}>
              {line.text}
              {i < title.length - 1 ? " " : null}
            </span>
          ))}
        </h1>

        {status ? (
          <p className={styles.status}>
            <i aria-hidden="true" />
            {status}
          </p>
        ) : null}

        <p className={styles.intro}>{intro}</p>

        {sections.map((section) => (
          <section key={section.title} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            {section.note ? <p className={styles.note}>{section.note}</p> : null}
            <dl className={styles.list}>
              {section.items.map((item) => (
                <div key={item.where} className={styles.row}>
                  <dt>{item.where}</dt>
                  <dd>“{item.text}”</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <div className={styles.contact}>
          <p>{contactLine}</p>
          <a href={contact.href} className={styles.mail}>
            {contact.label}
          </a>
        </div>

        <p className={styles.foot}>
          <span>{company}</span>
          <Link href={legal.back.href} className={styles.back}>
            {legal.back.label}
          </Link>
        </p>
      </div>
    </article>
  );
}
