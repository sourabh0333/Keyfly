"use client";

import { useEffect, useRef, useState } from "react";
import { Preview } from "./preview";
import styles from "./use-cases.module.css";

const HOLD = 6; // seconds each preset plays before the playhead moves on

const pad = (n) => String(n).padStart(2, "0");

// A mirrored waveform as vertical bars in a 200 × 20 box, as in "How it works".
function wave() {
  let s = 23;
  let d = "";
  for (let i = 0; i < 100; i++) {
    s = (s * 16807) % 2147483647;
    const beat = i % 8 === 0 ? 2.2 : 1;
    const h = Math.min(9.5, (1.5 + ((s - 1) / 2147483646) * 6) * beat);
    d += `M${i * 2 + 1} ${(10 - h).toFixed(2)}V${(10 + h).toFixed(2)}`;
  }
  return d;
}
const WAVE = wave();

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The six presets as a reel in the same Keyfly editor as "How it works":
 * the presets sit end to end on the timeline and the playhead plays
 * through them, six seconds each. The one under the playhead plays in the
 * viewer at its format, its prompt types itself into the panel, and its
 * row on the left rail fills as it plays. Clicking a row or a clip (or
 * pressing 1–6) moves the playhead there; hovering or focusing holds it.
 * It only plays while on screen, and with reduced motion it holds still.
 * Writes --ph (playhead, 0–1) and --cp (progress of the current clip) on
 * the root, and data-format for the viewer's frame.
 */
export function PresetReel({ items, cta, file, promptLabel, trackLabel, children }) {
  const [active, setActive] = useState(0);
  const [cuts, setCuts] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef(null);
  const codeRef = useRef(null);
  const typedRef = useRef(null);
  const timeRef = useRef(0);
  const activeRef = useRef(0);

  const item = items[active];
  const length = items.length * HOLD;

  function cut(index) {
    timeRef.current = index * HOLD + 0.001;
    activeRef.current = index;
    setActive(index);
    setCuts((n) => n + 1);
  }

  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // The playhead: it runs while on screen and not held, and the clip under
  // it goes on air.
  useEffect(() => {
    const root = rootRef.current;
    function paint(t) {
      root.style.setProperty("--ph", ((t % length) / length).toFixed(4));
      root.style.setProperty("--cp", ((t % HOLD) / HOLD).toFixed(4));
      const s = Math.floor(t);
      codeRef.current.textContent = `00:00:${pad(s % 60)}:${pad(Math.floor((t - s) * 30))}`;
    }
    if (reduced) {
      paint(timeRef.current - (timeRef.current % HOLD) + HOLD / 2);
      return;
    }
    paint(timeRef.current);
    if (!visible || held) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      timeRef.current = (timeRef.current + (now - last) / 1000) % length;
      last = now;
      paint(timeRef.current);
      const index = Math.floor(timeRef.current / HOLD);
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
        setCuts((n) => n + 1);
      }
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, held, reduced, length]);

  // The prompt types itself in on every cut.
  useEffect(() => {
    const el = typedRef.current;
    const text = item.prompt;
    if (reduced) {
      el.textContent = text;
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function type(now) {
      const n = Math.min(text.length, Math.round(((now - start) / 1100) * text.length));
      el.textContent = text.slice(0, n);
      if (n < text.length) frame = requestAnimationFrame(type);
    });
    return () => cancelAnimationFrame(frame);
  }, [item.prompt, reduced, cuts]);

  // The page's light takes its colours from the clip on air (see SceneLight).
  useEffect(() => {
    document.documentElement.dataset.feed = item.kind;
  }, [item.kind]);

  useEffect(() => () => delete document.documentElement.dataset.feed, []);

  function onKeyDown(event) {
    const n = Number(event.key);
    if (n >= 1 && n <= items.length && !event.target.matches("input, textarea")) {
      event.preventDefault();
      cut(n - 1);
    }
  }

  const tryIt = () => window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { label: item.label } }));

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-format={item.format}
      data-paused={visible ? undefined : ""}
      data-playing={visible && !held && !reduced ? "" : undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.copy}>
        {children}

        <ol className={styles.rows}>
          {items.map((it, i) => (
            <li key={it.label} className={styles.row} data-on={i === active ? "" : undefined} data-past={i < active ? "" : undefined}>
              <span className={styles.rowRail} aria-hidden="true" />
              <button type="button" className={styles.rowButton} aria-pressed={i === active} onClick={() => cut(i)}>
                <span className={styles.rowIndex}>{pad(i + 1)}</span>
                <span className={styles.rowTitle}>{it.label}</span>
                <span className={styles.rowFormat}>{it.format}</span>
              </button>
              <p className={styles.rowBody}>{it.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <figure className={styles.demo}>
        <div className={styles.window}>
          <div className={styles.chrome} aria-hidden="true">
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.file}>
              {item.label}
              <span className={styles.fileMuted}> · {file}</span>
            </span>
            <span ref={codeRef} className={styles.timecode}>
              00:00:00:00
            </span>
          </div>

          <div className={styles.body}>
            <div className={styles.viewer} aria-hidden="true">
              <div className={styles.frame}>
                {items.map((it, i) => (
                  <div key={it.label} className={styles.feed} data-on={i === active ? "" : undefined} data-paused={i === active ? undefined : ""}>
                    <Preview kind={it.kind} format={it.format} bleed />
                  </div>
                ))}
                <span key={cuts} className={styles.flash} />
                <span className={styles.guides} />
              </div>
              <div className={styles.formats}>
                {["16:9", "9:16", "1:1"].map((format) => (
                  <span key={format} data-format={format}>
                    {format}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.panel}>
              <p className={styles.panelLabel}>{promptLabel}</p>
              <p className={styles.bubble} aria-live="polite" aria-label={item.prompt}>
                <span ref={typedRef} aria-hidden="true" />
                <span className={styles.caret} aria-hidden="true" />
              </p>
              <p className={styles.panelBody}>{item.body}</p>
              <button type="button" className={styles.try} onClick={tryIt}>
                {cta}
                <Arrow />
              </button>
            </div>
          </div>

          <div className={styles.timeline}>
            <div className={styles.ruler} aria-hidden="true" />
            <div className={styles.track}>
              <span className={styles.trackLabel} aria-hidden="true">
                {trackLabel}
              </span>
              <div className={styles.lane}>
                {items.map((it, i) => (
                  <button
                    key={it.label}
                    type="button"
                    className={styles.clip}
                    data-kind={it.kind}
                    data-on={i === active ? "" : undefined}
                    aria-label={`Play ${it.label}`}
                    tabIndex={-1}
                    onClick={() => cut(i)}
                  >
                    <span className={styles.clipLabel}>{it.label}</span>
                    <i className={styles.key} />
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.trackLabel}>A1</span>
              <div className={`${styles.lane} ${styles.audio}`}>
                <svg className={styles.wave} viewBox="0 0 200 20" preserveAspectRatio="none">
                  <path d={WAVE} />
                </svg>
              </div>
            </div>
            <div className={styles.playheadLane} aria-hidden="true">
              <span className={styles.playhead} />
            </div>
          </div>
        </div>
      </figure>
    </div>
  );
}
