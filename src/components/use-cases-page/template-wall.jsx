"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { TemplateCard as Card } from "./template-card";
import styles from "./use-cases-hero.module.css";

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * The hero's wall of templates: three rows drifting in turn (the middle
 * one the other way), each card at its template's real shape. Each row is
 * two copies of its cards moved by half its width, so it loops without a
 * seam; only the rows' transforms animate. The previews play only while
 * their card is on screen (an IntersectionObserver), so a dozen or two
 * small loops play at once, never all 54. "Pause" stops the drift and the
 * previews (WCAG 2.2.2); reduced motion holds the wall still on the stills
 * and hides the button. The first copy of each row is a list for assistive
 * technology; the second is hidden from it.
 */
export function TemplateWall({ label, pause, play, rows }) {
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const wallRef = useRef(null);

  useEffect(() => {
    const videos = [...wallRef.current.querySelectorAll("video")];
    if (paused || reduced) {
      videos.forEach((v) => v.pause());
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) target.play().catch(() => {});
          else target.pause();
        }
      },
      { rootMargin: "0px 120px" },
    );
    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, [paused, reduced]);

  return (
    <div className={styles.wallWrap}>
      <div ref={wallRef} className={styles.wall} data-paused={paused ? "" : undefined} role="group" aria-label={label}>
        {rows.map((row, r) => (
          <div key={r} className={styles.row} data-dir={r % 2 ? "right" : "left"} style={{ "--dur": `${70 + r * 12}s` }}>
            <div className={styles.track}>
              <ul className={styles.set}>
                {row.map((template) => (
                  <li key={template.name}>
                    <Card template={template} />
                  </li>
                ))}
              </ul>
              <ul className={styles.set} aria-hidden="true">
                {row.map((template) => (
                  <li key={template.name}>
                    <Card template={template} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {reduced ? null : (
        <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
            {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
          {paused ? play : pause}
        </button>
      )}
    </div>
  );
}
