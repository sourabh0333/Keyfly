"use client";

import { useEffect, useRef, useState } from "react";
import { Preview } from "./preview";
import styles from "./use-cases.module.css";

const HOLD = 6000; // ms each use case stays on air before the auto-cut

const pad = (n) => String(n).padStart(2, "0");

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The six use cases as an open index beside a frameless projection: the
 * one on air plays on the right, its edges dissolving into the night, and
 * its row opens with the line and "Try this prompt". Clicking a row or
 * pressing 1–6 cuts to it, and it cuts on by itself every few seconds
 * while on screen and not hovered or focused. With reduced motion it
 * never auto-cuts and the feeds hold still.
 */
export function Switcher({ items, cta, hint }) {
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

  // Auto-cut to the next use case.
  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => cut((active + 1) % items.length), HOLD);
    return () => clearTimeout(timer);
  }, [auto, active, cuts, items.length]);

  // A running timecode while on screen.
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
      <div className={styles.indexCol}>
        <p className={styles.hint}>{hint}</p>
        <ol className={styles.index}>
          {items.map((it, i) => {
            const on = i === active;
            return (
              <li key={it.label} className={styles.row} data-on={on ? "" : undefined}>
                <button type="button" className={styles.rowButton} aria-pressed={on} aria-controls={`case-${i}`} onClick={() => cut(i)}>
                  <span className={styles.rowNum}>{pad(i + 1)}</span>
                  <span className={styles.rowName}>{it.label}</span>
                  <span className={styles.rowFormat}>{it.format}</span>
                </button>
                <div id={`case-${i}`} className={styles.detail} inert={!on}>
                  <div className={styles.detailInner}>
                    <p className={styles.detailBody}>{it.body}</p>
                    <button
                      type="button"
                      className={styles.try}
                      onClick={() => window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { label: it.label } }))}
                    >
                      {cta}
                      <Arrow />
                    </button>
                  </div>
                </div>
                {on ? <span key={cuts} className={styles.countdown} aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className={styles.projection}>
        <div className={styles.tally} aria-hidden="true">
          <span className={styles.onAir}>
            <i />
            On air
          </span>
          <span className={styles.cam}>
            {pad(active + 1)} · {items[active].label}
          </span>
          <span className={styles.code} ref={codeRef}>
            00:00:00:00
          </span>
        </div>
        <div className={styles.program}>
          {items.map((it, i) => (
            <div key={it.label} className={styles.feed} data-on={i === active ? "" : undefined} data-paused={i === active ? undefined : ""}>
              <Preview kind={it.kind} format={it.format} bleed />
            </div>
          ))}
          <span key={cuts} className={styles.flash} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
