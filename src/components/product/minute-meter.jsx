"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./minutes.module.css";

const LOOP = 12000; // ms for one pass through the session
const HOLD = 0.08; // the share of the loop the finished session rests

// Where each part starts and ends along the bar (0 to 1).
function spansOf(session) {
  let at = 0;
  return session.map((s) => {
    const span = [at, at + s.share / 100];
    at = span[1];
    return span;
  });
}

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * AI minutes' meter: one illustrative editing session as a bar of four
 * parts (KeyFly's AI builds; you trim by hand; KeyFly's AI changes it on
 * request; your own agent makes a pass), a playhead running along it, and
 * a counter that only climbs while the playhead is over a part that
 * counts. The playhead, the counter and the part in play are written to
 * the DOM each frame (no re-render), only while on screen and not paused;
 * a button pauses it (WCAG 2.2.2). Reduced motion: the session finished,
 * the total shown.
 */
export function MinuteMeter({ pause, play, meter, session, counts, free }) {
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const elapsed = useRef(0);

  const total = session.reduce((sum, s) => sum + s.minutes, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const spans = spansOf(session);
    // The minutes counted up to position p along the bar.
    const used = (p) =>
      session.reduce((sum, s, i) => {
        const [a, b] = spans[i];
        return sum + s.minutes * Math.min(1, Math.max(0, (p - a) / (b - a)));
      }, 0);
    const draw = (p) => {
      const i = spans.findIndex(([a, b]) => p >= a && p < b);
      const part = session[i === -1 ? session.length - 1 : i];
      root.style.setProperty("--p", p.toFixed(4));
      root.dataset.part = part.id;
      root.toggleAttribute("data-counting", p < 1 && part.counts);
      countRef.current.textContent = used(p).toFixed(1);
    };

    if (reduced) {
      draw(1);
      return;
    }
    if (!visible || paused) {
      draw(Math.min(1, elapsed.current / (LOOP * (1 - HOLD))));
      return;
    }
    let frame = 0;
    let last = performance.now();
    const tick = (now) => {
      elapsed.current = (elapsed.current + now - last) % LOOP;
      last = now;
      draw(Math.min(1, elapsed.current / (LOOP * (1 - HOLD))));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, paused, reduced, session]);

  return (
    <div ref={rootRef} className={styles.meterPanel} data-main="" data-paused={visible ? undefined : ""} style={{ "--p": 1 }} data-part={session[session.length - 1].id}>
      <div className={styles.readout}>
        <p className={styles.readoutLabel}>{meter.label}</p>
        <p className={styles.count}>
          <b ref={countRef}>{total.toFixed(1)}</b>
          <span className={styles.state}>
            <i />
            <em className={styles.on}>{meter.counting}</em>
            <em className={styles.off}>{meter.stopped}</em>
          </span>
        </p>
        {reduced ? null : (
          <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
              {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
            {paused ? play : pause}
          </button>
        )}
      </div>

      <div className={styles.session}>
        <div className={styles.bar} aria-hidden="true">
          {session.map((s) => (
            <span key={s.id} className={styles.seg} data-counts={s.counts ? "" : undefined} data-id={s.id} style={{ flexBasis: `${s.share}%` }} />
          ))}
          <span className={styles.playhead} />
        </div>
        <ol className={styles.parts}>
          {session.map((s) => (
            <li key={s.id} data-id={s.id} data-counts={s.counts ? "" : undefined} style={{ flexBasis: `${s.share}%` }}>
              <span className={styles.who}>{s.who}</span>
              <span className={styles.what}>{s.what}</span>
              <span className={styles.tag}>{s.counts ? `${counts} · +${s.minutes}` : free}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
