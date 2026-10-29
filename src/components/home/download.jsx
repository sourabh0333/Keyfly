import { Fragment } from "react";
import { downloadSection } from "@/content/home";
import { InView } from "./in-view";
import styles from "./download.module.css";

const camel = (at) => at.replace(/-(\w)/g, (_, c) => c.toUpperCase());

/** Letters that arrive one after another; the last full stop is the point. */
function Word({ text, wordIndex, last }) {
  return [...text].map((char, i) => {
    if (char === " ") return <Fragment key={i}> </Fragment>;
    const point = last && char === "." && i === text.length - 1;
    return (
      <span
        key={i}
        className={point ? `${styles.letter} ${styles.point}` : styles.letter}
        style={{ "--w": wordIndex, "--l": i }}
      >
        {char}
      </span>
    );
  });
}

function Arrow() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
      <path d="M2 2l8 8M10 4v6H4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The download, on the mint the glance section's point grows into, so the
 * two read as one frame. Three words are set on the frame like the hero's
 * and arrive letter by letter when it comes into view; the platforms sit in
 * the free corner. A platform without a link reads "soon".
 */
export function Download() {
  const { words, platforms } = downloadSection;

  return (
    <InView
      as="section"
      id={downloadSection.id}
      className={styles.download}
      data-section="Download"
      data-tone="paper"
      aria-labelledby="download-title"
      threshold={0.4}
    >
      <div className={styles.grid} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <h2 id="download-title" className="visually-hidden">
        {downloadSection.title}
      </h2>

      <p className={styles.label}>
        {downloadSection.label.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>

      <div aria-hidden="true">
        {words.map((word, w) => (
          <p key={word.text} className={`${styles.word} ${styles[camel(word.at)]}`}>
            <Word text={word.text} wordIndex={w} last={w === words.length - 1} />
          </p>
        ))}
      </div>

      <div className={styles.get}>
        <ul className={styles.platforms}>
          {platforms.map((platform) => (
            <li key={platform.id}>
              {platform.href ? (
                <a href={platform.href} className={styles.platform}>
                  <span>{platform.name}</span>
                  <Arrow />
                </a>
              ) : (
                <span className={`${styles.platform} ${styles.soon}`} aria-disabled="true">
                  <span>{platform.name}</span>
                  <span className={styles.soonTag}>Soon</span>
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className={styles.note}>{downloadSection.note}</p>
      </div>
    </InView>
  );
}
