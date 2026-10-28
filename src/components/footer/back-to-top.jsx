"use client";

import styles from "./footer.module.css";

export function BackToTop() {
  function goTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <button type="button" className={styles.top} onClick={goTop}>
      <span>Back to top</span>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path
          d="M8 13.5v-10M4.5 7 8 3.5 11.5 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
