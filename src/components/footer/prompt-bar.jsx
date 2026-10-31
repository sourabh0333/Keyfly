"use client";

import styles from "./site-footer.module.css";

/**
 * The hero's prompt box in miniature. It is not a second form: clicking it
 * takes the visitor back up to the real one and puts the cursor in it (see
 * PromptBox's "keyfly:prompt" listener), so the page ends where it began.
 */
export function PromptBar({ placeholder, label }) {
  return (
    <button type="button" className={styles.bar} aria-label={label} onClick={() => window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: {} }))}>
      <span className={styles.barPlus} aria-hidden="true">
        +
      </span>
      <span className={styles.barText}>
        {placeholder}
        <i className={styles.barCaret} aria-hidden="true" />
      </span>
      <span className={styles.barSend} aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
