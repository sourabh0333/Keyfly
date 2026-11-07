"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./minutes-explained.module.css";

const noop = () => () => {};

/**
 * The AI-minute packs on a ruler scaled in minutes, as an editor's timeline:
 * each pack a keyframe at its true place, its bonus minutes a mint stretch
 * just before it, its minutes and bonus above the line, its price, price a
 * minute and Buy link beneath (the lowest price a minute named). The first
 * time it comes on screen a mint playhead runs the ruler once and lights
 * each pack as it passes; the server's HTML and reduced motion show it run.
 */
export function PackRuler({ marks, max, copy }) {
  const [seen, setSeen] = useState(false);
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.packs}>
      <div className={styles.packsHead}>
        <p className={styles.listLabel}>{copy.label}</p>
        <p className={styles.packsLine}>{copy.line}</p>
      </div>

      <ol ref={ref} className={styles.ruler} data-armed={hydrated && !seen ? "" : undefined} style={{ "--max": max }}>
        <li className={styles.track} aria-hidden="true">
          <span className={styles.ticks} />
          <span className={styles.fill} />
          <span className={styles.zero}>0</span>
        </li>
        {marks.map((m) => (
          <li key={m.minutes} className={styles.mark} style={{ "--x": m.x, "--from": m.from }} data-best={m.best ? "" : undefined}>
            {m.bonus ? <span className={styles.bonusSpan} aria-hidden="true" /> : null}
            <span className={styles.above}>
              {m.best ? <em>{copy.best}</em> : null}
              <b>
                {m.minutes}
                <small>{copy.min}</small>
              </b>
              <span className={styles.bonus}>{m.bonus || " "}</span>
            </span>
            <i className={styles.key} aria-hidden="true" />
            <span className={styles.below}>
              <strong>{m.price}</strong>
              {m.perMinute ? <span>{m.perMinute}</span> : null}
              {m.href ? (
                <a href={m.href}>
                  {copy.buy} <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
