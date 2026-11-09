import Link from "next/link";
import { legal } from "@/content/legal";
import { LegalToc } from "./legal-toc";
import styles from "./legal-page.module.css";

/**
 * A legal page (Terms, Privacy), laid out like the market's best: the
 * heading with its dates, a plain-language "In short", then numbered
 * sections with anchors beside a sticky contents list (a fold-out list on
 * narrow screens).
 *
 * The text lives in src/content/legal.js. Inline markup in any string:
 *   [label](href)   a link
 *   **text**        emphasis
 *   {{text}}        a fact the team must confirm, marked in amber
 * While `draft` is true the page carries a "Draft for review" chip, stays
 * out of search and out of the sitemap.
 */

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\{\{([^}]+)\}\}/g;

function Inline({ text }) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1]) {
      const href = m[2];
      out.push(
        href.startsWith("/") || href.startsWith("#") ? (
          <Link key={key} href={href} className={styles.link}>
            {m[1]}
          </Link>
        ) : (
          <a key={key} href={href} className={styles.link}>
            {m[1]}
          </a>
        ),
      );
    } else if (m[3]) {
      out.push(<strong key={key}>{m[3]}</strong>);
    } else {
      out.push(
        <mark key={key} className={styles.confirm} title="To confirm before publishing">
          {m[4]}
        </mark>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Block({ block }) {
  if (typeof block === "string") {
    return (
      <p>
        <Inline text={block} />
      </p>
    );
  }
  if (block.list) {
    return (
      <ul className={styles.bullets}>
        {block.list.map((item, i) => (
          <li key={i}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.terms) {
    return (
      <dl className={styles.terms}>
        {block.terms.map(([term, text]) => (
          <div key={term} className={styles.row}>
            <dt>
              <Inline text={term} />
            </dt>
            <dd>
              <Inline text={text} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  if (block.table) {
    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {block.table.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} data-label={block.table.head[c]}>
                    <Inline text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.callout) {
    return (
      <p className={styles.callout}>
        <Inline text={block.callout} />
      </p>
    );
  }
  return null;
}

export function LegalPage({ page }) {
  const { eyebrow, title, draft, updated, effective, intro, summary, sections, related, contact, company } =
    page;
  const toc = sections.map((s, i) => ({ id: s.id, label: s.title, n: i + 1 }));

  return (
    <article className={styles.page}>
      <header className={styles.head}>
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

        <p className={styles.dates}>
          {draft ? (
            <span className={styles.status}>
              <i aria-hidden="true" />
              {legal.draftLabel}
            </span>
          ) : null}
          <span>
            Last updated <time dateTime={updated.iso}>{updated.text}</time>
          </span>
          {effective ? (
            <span>
              Effective <time dateTime={effective.iso}>{effective.text}</time>
            </span>
          ) : null}
        </p>

        <div className={styles.intro}>
          {intro.map((p, i) => (
            <p key={i}>
              <Inline text={p} />
            </p>
          ))}
        </div>
      </header>

      {summary ? (
        <section className={styles.summary} aria-labelledby="in-short">
          <h2 id="in-short" className={styles.summaryTitle}>
            {summary.title}
          </h2>
          <ul className={styles.summaryList}>
            {summary.items.map((item) => (
              <li key={item.title}>
                <span className={styles.tick} aria-hidden="true" />
                <strong>{item.title}</strong>
                <span>
                  <Inline text={item.text} />
                </span>
              </li>
            ))}
          </ul>
          {summary.note ? <p className={styles.summaryNote}>{summary.note}</p> : null}
        </section>
      ) : null}

      <div className={styles.layout}>
        <LegalToc items={toc} label={legal.tocLabel} />

        <div className={styles.body}>
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className={styles.section} data-legal-section>
              <h2 className={styles.sectionTitle}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <a href={`#${section.id}`} className={styles.anchor}>
                  {section.title}
                </a>
              </h2>
              {section.plain ? (
                <p className={styles.plainWords}>
                  <span>{legal.plainLabel}</span>
                  <Inline text={section.plain} />
                </p>
              ) : null}
              <div className={styles.prose}>
                {section.blocks.map((block, b) => (
                  <Block key={b} block={block} />
                ))}
              </div>
            </section>
          ))}

          <div className={styles.contact}>
            <p>{contact.line}</p>
            <a href={contact.href} className={styles.mail}>
              {contact.label}
            </a>
          </div>

          <nav className={styles.related} aria-label="Related">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className={styles.relatedLink}>
                <span>{r.kicker}</span>
                {r.label} →
              </Link>
            ))}
          </nav>

          <p className={styles.foot}>
            <span>{company}</span>
            <Link href={legal.back.href} className={styles.back}>
              {legal.back.label}
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
