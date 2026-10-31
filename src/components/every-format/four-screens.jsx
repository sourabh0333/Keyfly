"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./every-format.module.css";

const HOLD = 2600; // ms each format is highlighted before the next
const WORDS = ["Your", "story,", "cut", "in", "seconds"];
const CUTS = [0, 11, 19, 32, 41, 55, 63, 77, 88, 100];

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * One cut, four screens: the formats side by side at their real shapes and
 * one height (the grid's columns are in proportion to their ratios), each
 * framing the same 16:9 cut around its subject, playing in sync, with its
 * captions re-wrapped to fit. Their details sit beneath them in the same
 * columns, and one timeline runs under all four. One format at a time is
 * highlighted (mint), moving on by itself while on screen and not hovered
 * or focused; pointing at or choosing a screen highlights it.
 */
export function FourScreens({ file, panel, formats, ready, allReady, timeline }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !held && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % formats.length), HOLD);
    return () => clearTimeout(timer);
  }, [auto, active, formats.length]);

  return (
    <div
      ref={rootRef}
      className={styles.window}
      data-auto={auto ? "" : undefined}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.file}>
          {file}
          <span className={styles.fileMuted}> · {panel}</span>
        </span>
        <span className={styles.count}>
          {formats.length} {allReady}
        </span>
      </div>

      <div className={styles.screens} style={{ "--cols": formats.map((f) => `${(f.w / f.h).toFixed(4)}fr`).join(" ") }}>
        {formats.map((f, i) => {
          const on = i === active;
          return (
            <button
              key={f.id}
              type="button"
              className={styles.format}
              aria-pressed={on}
              onClick={() => setActive(i)}
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(i)}
            >
              <span className={styles.screen} style={{ "--r": f.w / f.h }} aria-hidden="true">
                <span className={styles.source}>
                  <Preview kind="launch" format="16:9" bleed />
                </span>
                <span className={styles.captions}>
                  {WORDS.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </span>
                <span className={styles.corners} />
              </span>
              <span className={styles.spec}>
                <span className={styles.specTop}>
                  <span className={styles.ratio}>{f.ratio}</span>
                  <span className={styles.specIndex}>{pad(i + 1)}</span>
                </span>
                <span className={styles.name}>{f.name}</span>
                <span className={styles.size}>{f.size}</span>
                <span className={styles.use}>{f.use}</span>
                <span className={styles.ready}>✓ {ready}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.timeline} aria-hidden="true">
        <span className={styles.timelineLabel}>{timeline}</span>
        <div className={styles.ruler} />
        <div className={styles.lane}>
          <span className={styles.laneLabel}>V1</span>
          <div className={styles.laneBody}>
            {CUTS.slice(0, -1).map((at, i) => (
              <i key={i} className={styles.clip} data-n={i % 3} style={{ left: `${at}%`, width: `${CUTS[i + 1] - at}%` }} />
            ))}
          </div>
        </div>
        <div className={styles.lane}>
          <span className={styles.laneLabel}>C1</span>
          <div className={styles.laneBody}>
            {CUTS.slice(0, -1).map((at, i) => (
              <i key={i} className={styles.caption} style={{ left: `${at + 1}%`, width: `${CUTS[i + 1] - at - 2}%` }} />
            ))}
          </div>
        </div>
        <div className={styles.lane}>
          <span className={styles.laneLabel}>OUT</span>
          <div className={`${styles.laneBody} ${styles.outs}`}>
            {formats.map((f, i) => (
              <i key={f.id} data-on={i === active ? "" : undefined}>
                {f.ratio}
              </i>
            ))}
          </div>
        </div>
        <span className={styles.rail}>
          <i className={styles.playhead} />
        </span>
      </div>
    </div>
  );
}
