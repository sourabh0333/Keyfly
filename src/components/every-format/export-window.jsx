"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./every-format.module.css";

const HOLD = 2800; // ms each format stays before the next (matches the row's fill)
const SUBJECT = 66; // where the subject (the sun) sits across the source, in %
const WORDS = ["Your", "story,", "cut", "in", "seconds"];
const CUTS = [0, 11, 19, 32, 41, 55, 63, 77, 88, 100];

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// The crop for a format over the 16:9 source: full height, its own width,
// centred on the subject as far as the edges allow (shares of the source).
function crop({ w, h }) {
  const width = Math.min(100, ((w / h) * 9 * 100) / 16);
  const left = Math.min(100 - width, Math.max(0, SUBJECT - width / 2));
  return { left, width };
}

/**
 * The Keyfly editor's export: the viewer shows the one cut with the crop
 * for the format in play (outside it dimmed, its corners marked, the
 * subject tracked and the captions inside it), the export panel lists the
 * formats (each reframing, then ready), and one timeline beneath stands
 * for the single edit they all come from. Rows choose the format; it moves
 * on by itself while on screen and not hovered or focused. With reduced
 * motion it waits for a click and changes without easing.
 */
export function ExportWindow({ file, panel, panelSub, tracked, ready, rendering, queued, allReady, timeline, formats }) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(() => new Set([0]));
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !held && !reduced;
  const format = formats[active];
  const box = crop(format);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => pick((active + 1) % formats.length), HOLD);
    return () => clearTimeout(timer);
  }, [auto, active, formats.length]);

  function pick(i) {
    setActive(i);
    setDone((d) => new Set(d).add(i));
  }

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
          {formats.length} formats · 1 cut
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.viewer} aria-hidden="true">
          <div className={styles.frame} style={{ "--l": `${box.left}%`, "--w": `${box.width}%`, "--s": `${SUBJECT}%` }}>
            <Preview kind="launch" format="16:9" bleed />
            <span className={styles.crop}>
              <span className={styles.corners} />
              <p className={styles.captions}>
                {WORDS.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </p>
            </span>
            <span className={styles.subject}>
              <i />
            </span>
            <span className={styles.tag}>
              <b>{format.ratio}</b> · {format.size}
            </span>
            <span className={styles.track}>
              <i />
              {tracked}
            </span>
          </div>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelHead}>
            {panel}
            <span>{panelSub}</span>
          </p>
          <ol className={styles.formats}>
            {formats.map((f, i) => {
              const on = i === active;
              const state = on && auto ? "rendering" : done.has(i) ? "ready" : "queued";
              return (
                <li key={f.id}>
                  <button type="button" className={styles.row} aria-pressed={on} data-state={state} onClick={() => pick(i)}>
                    <span className={styles.rowIndex}>{pad(i + 1)}</span>
                    <span className={styles.shape} style={{ "--r": f.w / f.h }} aria-hidden="true" />
                    <span className={styles.rowText}>
                      <span className={styles.rowName}>
                        <b>{f.ratio}</b> {f.name}
                      </span>
                      <span className={styles.rowUse}>
                        {f.use} · {f.size}
                      </span>
                    </span>
                    <span className={styles.rowState}>
                      {state === "ready" ? ready : state === "rendering" ? rendering : queued}
                    </span>
                    <i key={`${active}`} className={styles.rowFill} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
          <p className={styles.panelFoot}>
            <span className={styles.readyCount}>{done.size}</span>/{formats.length} {allReady}
          </p>
        </div>
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
          <span className={styles.laneLabel}>FR</span>
          <div className={styles.laneBody}>
            <i className={styles.reframe} style={{ "--k": active }}>
              {format.ratio} reframe
            </i>
          </div>
        </div>
        <span className={styles.rail}>
          <i className={styles.playhead} />
        </span>
      </div>
    </div>
  );
}
