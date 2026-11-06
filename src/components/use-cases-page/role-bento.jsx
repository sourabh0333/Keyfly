"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./roles.module.css";

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const ratio = (shape) => {
  const [w, h] = shape.split(":").map(Number);
  return w / h;
};

/**
 * The roles as a bento: four cards in two rows (wide, narrow / narrow,
 * wide). Each card: its number and count, the role's name and line, its
 * first template playing at its real shape with more in a row beside it
 * (as many as fit), and
 * its categories as links into the shelves above. Calm: nothing turns by
 * itself; the previews play while the cards are on screen, and "Pause"
 * stops them (WCAG 2.2.2). Reduced motion: stills.
 */
export function RoleBento({ roles, pause, play, countLabel, see }) {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const on = visible && !paused && !reduced;
    rootRef.current.querySelectorAll("video").forEach((v) => (on ? v.play().catch(() => {}) : v.pause()));
  }, [visible, paused, reduced]);

  return (
    <div ref={rootRef} className={styles.bentoWrap} data-main="">
      <ul className={styles.bento}>
        {roles.map((role, i) => {
          const [main, ...rest] = role.clips;
          return (
            <li key={role.id} className={styles.card} data-wide={i === 0 || i === 3 ? "" : undefined}>
              <p className={styles.cardTop}>
                <span className={styles.num}>{pad(i + 1)}</span>
                <span className={styles.pill}>
                  <b>{role.count}</b> {countLabel}
                </span>
              </p>
              <h3 className={styles.cardName}>{role.name}</h3>
              <p className={styles.cardLine}>{role.line}</p>

              <div className={styles.media}>
                <a className={styles.mainClip} href={`#${main.category}`} style={{ "--r": ratio(main.shape), backgroundImage: `url(${main.clip}.webp)` }} aria-label={main.name}>
                  <video src={`${main.clip}.mp4`} muted loop playsInline preload="none" aria-hidden="true" />
                  <span className={styles.tag}>
                    {main.name} · {main.shape} · {main.seconds}s
                  </span>
                </a>
                {rest.slice(0, 3).map((t) => (
                  <a key={t.name} className={styles.sideClip} href={`#${t.category}`} style={{ "--r": ratio(t.shape), backgroundImage: `url(${t.clip}.webp)` }} aria-label={t.name} title={t.name} />
                ))}
              </div>

              <p className={styles.cardCats}>
                {role.cats.map((c) => (
                  <a key={c.id} href={`#${c.id}`}>
                    {c.name} <span>{c.templates.length}</span>
                  </a>
                ))}
              </p>
              <a className={styles.cardSee} href={`#${role.cats[0].id}`}>
                {see} ↑
              </a>
            </li>
          );
        })}
      </ul>

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
