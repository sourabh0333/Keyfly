"use client";

import { useState } from "react";
import styles from "./post.module.css";

/** Copies the post's address, and says so for a moment. */
export function CopyLink({ url, copy }) {
  const [done, setDone] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      // clipboard unavailable: nothing to do
    }
  };
  return (
    <button type="button" className={styles.copy} onClick={onClick} data-done={done || undefined}>
      <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
        {done ? (
          <path d="M3 8.5l3 3 7-7" />
        ) : (
          <path d="M6.5 9.5l3-3M7 4.5l1.2-1.2a2.5 2.5 0 0 1 3.5 3.5L10.5 8M9 11.5l-1.2 1.2a2.5 2.5 0 0 1-3.5-3.5L5.5 8" />
        )}
      </svg>
      <span aria-live="polite">{done ? copy.copied : copy.copy}</span>
    </button>
  );
}
