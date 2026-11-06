"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./cost.module.css";

const STEP = 2800; // ms each row is in focus while the ledger plays

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * A row's route: two zones, This computer and Cloud, with KeyFly on the
 * left and the row's target placed where it really is (your agent, the
 * exported file or the .zip inside this computer; Cloud AI across the
 * line). A packet travels to the target and back while the row is in
 * focus; for editing by hand it only pulses on KeyFly.
 */
function Route({ route, zones }) {
  const local = route.kind !== "cloud";
  return (
    <div className={styles.route} data-kind={route.kind} aria-hidden="true">
      <div className={styles.zone} data-zone="local">
        <span className={styles.zoneLabel}>{zones.local}</span>
        <span className={styles.node} data-at="start">
          <span className={styles.symbol} />
        </span>
        {route.target && local ? (
          <span className={styles.node} data-at="end">
            <i />
            <small>{route.target}</small>
          </span>
        ) : null}
      </div>
      <div className={styles.zone} data-zone="cloud">
        <span className={styles.zoneLabel}>{zones.cloud}</span>
        {route.target && !local ? (
          <span className={styles.node} data-at="cloud">
            <i />
            <small>{route.target}</small>
          </span>
        ) : null}
      </div>
      <span className={styles.packet} />
    </div>
  );
}

/**
 * The ledger: one row per way of working, with what it costs in AI
 * minutes (0 in mint, or "AI minutes" with "shown before it runs ·
 * refunded if it fails") and where your files go, as a route diagram and a
 * line. While on screen the row in focus moves on every 2.8s and its
 * packet runs; pointing at or focusing a row holds it, and "Pause" stops
 * it (WCAG 2.2.2). The server's HTML and reduced motion: nothing moves.
 */
export function CostLedger({ pause, play, columns, zones, rows }) {
  const [current, setCurrent] = useState(0);
  const [held, setHeld] = useState(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !paused && held === null && !reduced;
  const focus = held ?? current;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setCurrent((c) => (c + 1) % rows.length), STEP);
    return () => clearTimeout(timer);
  }, [auto, current, rows.length]);

  return (
    <div ref={rootRef} className={styles.wrap} data-main="" data-live={visible && !paused && !reduced ? "" : undefined}>
      <div className={styles.table} role="table" aria-label={`${columns.what} ${columns.minutes} · ${columns.files}`}>
        <div className={styles.cols} role="row">
          <span role="columnheader">{columns.what}</span>
          <span role="columnheader">{columns.minutes}</span>
          <span role="columnheader">{columns.files}</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.id}
            role="row"
            tabIndex={0}
            className={styles.row}
            data-focus={i === focus ? "" : undefined}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(i)}
            onPointerLeave={() => setHeld(null)}
            onFocus={() => setHeld(i)}
            onBlur={() => setHeld(null)}
          >
            <div role="cell" className={styles.what}>
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              <b>{row.name}</b>
              <small>{row.line}</small>
            </div>
            <div role="cell" className={styles.minutes} data-free={row.minutes.free ? "" : undefined}>
              <strong>{row.minutes.value}</strong>
              {row.minutes.note ? <small>{row.minutes.note}</small> : null}
            </div>
            <div role="cell" className={styles.files}>
              <Route route={row.route} zones={zones} />
              <p>{row.files}</p>
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
