"use client";

import { useEffect, useRef } from "react";
import styles from "./pricing.module.css";

const CEILING = 96; // it creeps towards this and never finishes
const PACE = 9000; // ms: how quickly it closes in on the ceiling
const STILL = 87; // shown before it starts, and with reduced motion
const FPS = 25;

const pad = (n) => String(n).padStart(2, "0");

/**
 * The render: pricing shown as an export that's still rendering. While on
 * screen, the percentage creeps up towards 96% (closing in, never
 * finishing), the bar and its playhead follow it, and a timecode runs.
 * Written straight to the DOM (no re-render per frame), and only while on
 * screen. With reduced motion (and before JS) it shows 87%, still.
 */
export function Render({ file, status, statusNote }) {
  const rootRef = useRef(null);
  const percentRef = useRef(null);
  const timeRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let elapsed = 0; // ms rendered so far (only while on screen)
    let last = 0;
    let shown = -1;

    function frame(now) {
      elapsed += last ? Math.min(100, now - last) : 0;
      last = now;
      const t = elapsed;
      const p = CEILING * (1 - Math.exp(-t / PACE));
      root.style.setProperty("--p", (p / 100).toFixed(4));
      const whole = Math.floor(p);
      if (whole !== shown) {
        shown = whole;
        percentRef.current.textContent = `${whole}%`;
      }
      const frames = Math.floor((t / 1000) * FPS);
      const s = Math.floor(frames / FPS);
      timeRef.current.textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(frames % FPS)}`;
      raf = requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(frame);
    }, { threshold: 0.4 });
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.render} style={{ "--p": STILL / 100 }} aria-hidden="true">
      <div className={styles.top}>
        <p className={styles.file}>
          <i />
          {file}
        </p>
        <p ref={percentRef} className={styles.percent}>
          {STILL}%
        </p>
      </div>
      <div className={styles.bar}>
        <span className={styles.ticks} />
        <span className={styles.done} />
        <span className={styles.rail}>
          <i />
        </span>
      </div>
      <div className={styles.bottom}>
        <p className={styles.status}>
          {status} <span>· {statusNote}</span>
        </p>
        <p ref={timeRef} className={styles.time}>
          00:00:42:12
        </p>
      </div>
    </div>
  );
}
