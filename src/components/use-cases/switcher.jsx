"use client";

import { useEffect, useRef, useState } from "react";
import { Preview } from "./preview";
import styles from "./use-cases.module.css";

const HOLD = 6000; // ms each feed stays on air before the auto-cut

const pad = (n) => String(n).padStart(2, "0");

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A multicam switcher. Every use case is a live source feed; the one on air
 * plays large on the program monitor with its name, line and "Try this
 * prompt" beneath. Clicking a feed or pressing 1–6 cuts to it, and it cuts
 * on by itself every few seconds while the section is on screen and not
 * being hovered or focused. With reduced motion it never auto-cuts and the
 * feeds hold still.
 */
export function Switcher({ items, cta, sources, hint }) {
  const [active, setActive] = useState(0);
  const [cuts, setCuts] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef(null);
  const codeRef = useRef(null);

  const auto = visible && !held && !reduced;

  function cut(index) {
    setActive(index);
    setCuts((n) => n + 1);
  }

  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Auto-cut to the next feed.
  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => cut((active + 1) % items.length), HOLD);
    return () => clearTimeout(timer);
  }, [auto, active, cuts, items.length]);

  // A running program timecode while on screen.
  useEffect(() => {
    if (!visible || reduced) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = (now - start) / 1000;
      const s = Math.floor(t);
      if (codeRef.current) codeRef.current.textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(Math.floor((t - s) * 30))}`;
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, reduced]);

  function onKeyDown(event) {
    const n = Number(event.key);
    if (n >= 1 && n <= items.length && !event.target.matches("input, textarea")) {
      event.preventDefault();
      cut(n - 1);
    }
  }

  const item = items[active];

  return (
    <div
      ref={ref}
      className={styles.switcher}
      data-paused={visible ? undefined : ""}
      data-auto={auto ? "" : undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.programCol}>
        <div className={styles.program}>
          {items.map((it, i) => (
            <div key={it.label} className={styles.feed} data-on={i === active ? "" : undefined} data-paused={i === active ? undefined : ""}>
              <Preview kind={it.kind} format={it.format} bleed />
            </div>
          ))}
          <span key={cuts} className={styles.flash} aria-hidden="true" />
          <span className={styles.thirds} aria-hidden="true" />
          <span className={styles.corners} aria-hidden="true" />
          <div className={styles.programBar} aria-hidden="true">
            <span className={styles.onAir}>
              <i />
              On air
            </span>
            <span className={styles.programCam}>CAM {pad(active + 1)}</span>
            <span className={styles.programCode} ref={codeRef}>
              00:00:00:00
            </span>
          </div>
        </div>

        <div className={styles.info} aria-live="polite">
          <span key={`${active}-${cuts}`} className={styles.countdown} aria-hidden="true" />
          <div key={active} className={styles.infoMain}>
            <span className={styles.infoIndex}>{pad(active + 1)}</span>
            <div>
              <h3 className={styles.infoTitle}>{item.label}</h3>
              <p className={styles.infoBody}>{item.body}</p>
            </div>
          </div>
          <div className={styles.infoSide}>
            <span className={styles.format}>{item.format}</span>
            <button
              type="button"
              className={styles.try}
              onClick={() => window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { label: item.label } }))}
            >
              {cta}
              <Arrow />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sources}>
        <p className={styles.sourcesHead}>
          <span>
            {sources} <span className={styles.sourcesCount}>· {pad(items.length)}</span>
          </span>
          <span className={styles.hint}>{hint}</span>
        </p>
        <ul className={styles.grid}>
          {items.map((it, i) => (
            <li key={it.label}>
              <button type="button" className={styles.tile} data-on={i === active ? "" : undefined} aria-pressed={i === active} onClick={() => cut(i)}>
                <span className={styles.thumb}>
                  <Preview kind={it.kind} format={it.format} bleed />
                  <span className={styles.tileCam} aria-hidden="true">
                    <i />
                    CAM {pad(i + 1)}
                  </span>
                </span>
                <span className={styles.tileLabel}>
                  <span className={styles.tileKey} aria-hidden="true">
                    {i + 1}
                  </span>
                  {it.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
