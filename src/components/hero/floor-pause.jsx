"use client";

import { useState } from "react";
import styles from "./hero.module.css";

/**
 * Pauses the hero's timeline floor and its films (WCAG 2.2.2): it sets
 * `data-floor-paused` on the hero, which holds the reel's animation and
 * stops the films (see TimelineFloor). Hidden with reduced motion, where
 * nothing moves.
 */
export function FloorPause({ pause, play }) {
  const [paused, setPaused] = useState(false);
  const label = paused ? play : pause;

  const toggle = (event) => {
    const next = !paused;
    event.currentTarget.closest("section")?.toggleAttribute("data-floor-paused", next);
    setPaused(next);
  };

  return (
    <button type="button" className={styles.floorPause} aria-label={label} title={label} aria-pressed={paused} onClick={toggle}>
      {paused ? (
        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
          <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
          <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
