"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./make.module.css";

const BUILD = 260; // ms per layer as KeyFly builds them
const HOLD = 4200; // ms with every layer built before the next start

const pad = (n) => String(n).padStart(2, "0");
const WAVE = Array.from({ length: 22 }, (_, i) => 0.25 + ((Math.sin(i * 1.5) + Math.sin(i * 0.55) + 2) / 4) * 0.75);

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const never = () => () => {};

// What each start looks like going in.
function Input({ input }) {
  if (input.kind === "prompt") {
    return (
      <p className={styles.prompt}>
        <span aria-hidden="true">›</span> {input.text}
        <i className={styles.caret} aria-hidden="true" />
      </p>
    );
  }
  if (input.kind === "files") {
    return (
      <ul className={styles.files}>
        {input.files.map(([name, length]) => (
          <li key={name}>
            <i aria-hidden="true" />
            <span>{name}</span>
            <em>{length}</em>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className={styles.template}>
      <span className={styles.thumb} aria-hidden="true">
        <Preview kind="launch" format="16:9" bleed />
      </span>
      <span className={styles.templateName}>{input.name}</span>
      <span className={styles.templateMeta}>
        {input.meta} · <b>{input.style}</b>
      </span>
    </div>
  );
}

// Each layer's small picture, drawn in CSS.
function Picture({ id }) {
  switch (id) {
    case "storyboard":
      return (
        <span className={styles.vBoards}>
          {[0, 1, 2, 3, 4].map((n) => (
            <i key={n} style={{ "--i": n }} />
          ))}
        </span>
      );
    case "footage":
      return (
        <span className={styles.vFootage}>
          {[0, 1, 2, 3].map((n) => (
            <i key={n} />
          ))}
          <b style={{ left: "24%" }} />
          <b style={{ left: "61%" }} />
        </span>
      );
    case "voice":
      return (
        <span className={styles.vWave}>
          {WAVE.map((h, n) => (
            <i key={n} style={{ "--h": h.toFixed(2) }} />
          ))}
        </span>
      );
    case "graphics":
      return (
        <span className={styles.vTitle}>
          <b>Launch</b> day<i />
        </span>
      );
    case "images":
      return (
        <span className={styles.vImages}>
          <i />
          <i />
          <i />
        </span>
      );
    case "music":
      return (
        <span className={styles.vMusic}>
          {[0.5, 0.85, 0.6, 1, 0.7, 0.9, 0.55].map((h, n) => (
            <i key={n} style={{ "--h": h }} />
          ))}
        </span>
      );
    case "sfx":
      return (
        <span className={styles.vSfx}>
          <i style={{ left: "16%" }} />
          <i style={{ left: "47%" }} />
          <i style={{ left: "80%" }} />
        </span>
      );
    default:
      return (
        <span className={styles.vVideo}>
          <i />
        </span>
      );
  }
}

/**
 * Make: three ways in (a sentence, your footage, a template) on the left,
 * each showing what goes in, and on the right the layers KeyFly builds from
 * it, each on its own track: the first (a storyboard, or your footage cut
 * down) depends on the start; voice-over, motion graphics, AI images, the
 * music bed, sound effects and generated video follow.
 *
 * When it comes on screen KeyFly "builds" the layers one by one (a mint
 * scan crosses each as it lands); then, while on screen, not held and not
 * paused, it moves on to the next start. Clicking a start chooses it and
 * stops the cycle. Reduced motion: everything built, nothing moves.
 */
export function Builder({ startLabel, makesLabel, pause, play, doors, layers }) {
  const [door, setDoor] = useState(0);
  const [built, setBuilt] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const [chosen, setChosen] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const hydrated = useSyncExternalStore(never, () => true, () => false);
  const rootRef = useRef(null);

  const d = doors[door];
  const rows = [{ id: d.id === "footage" ? "footage" : "storyboard", ...d.first }, ...layers];
  const shown = reduced ? rows.length : built;
  const cycling = visible && !held && !paused && !chosen && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // Build the layers one by one; with all built, move on to the next start.
  useEffect(() => {
    if (reduced || !visible) return;
    if (built < rows.length) {
      const timer = setTimeout(() => setBuilt((b) => b + 1), built === 0 ? 400 : BUILD);
      return () => clearTimeout(timer);
    }
    if (!cycling) return;
    const timer = setTimeout(() => {
      setDoor((x) => (x + 1) % doors.length);
      setBuilt(0);
    }, HOLD);
    return () => clearTimeout(timer);
  }, [reduced, visible, built, rows.length, cycling, doors.length]);

  function choose(i) {
    setChosen(true);
    if (i === door) return;
    setDoor(i);
    setBuilt(0);
  }

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-main=""
      data-armed={hydrated && !reduced ? "" : undefined}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      {/* Where it starts. */}
      <div className={styles.start}>
        <p className={styles.kicker}>
          <span>01</span> {startLabel}
        </p>
        <div className={styles.doors} role="radiogroup" aria-label={startLabel}>
          {doors.map((x, i) => (
            <button key={x.id} type="button" role="radio" aria-checked={i === door} className={styles.door} onClick={() => choose(i)}>
              <span className={styles.doorIndex}>{pad(i + 1)}</span>
              <span className={styles.doorBody}>
                <span className={styles.doorName}>{x.name}</span>
                <span className={styles.doorSub}>{x.sub}</span>
              </span>
            </button>
          ))}
        </div>
        <div key={d.id} className={styles.input} aria-live="polite">
          <Input input={d.input} />
        </div>
      </div>

      <span className={styles.connector} aria-hidden="true">
        <i />
      </span>

      {/* What KeyFly makes from it. */}
      <div className={styles.makes}>
        <div className={styles.makesHead}>
          <p className={styles.kicker}>
            <span>02</span> {makesLabel}
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
        <ol className={styles.layers}>
          {rows.map((row, i) => (
            <li
              key={`${d.id}-${row.id}`}
              className={styles.layer}
              data-shown={i < shown ? "" : undefined}
              data-building={!reduced && i === built - 1 ? "" : undefined}
            >
              <span className={styles.layerIndex}>{pad(i + 1)}</span>
              <span className={styles.picture} aria-hidden="true">
                <Picture id={row.id} />
              </span>
              <span className={styles.layerBody}>
                <span className={styles.layerName}>
                  {row.name}
                  {row.detail ? <em>{row.detail}</em> : null}
                </span>
                <span className={styles.layerLine}>{row.line}</span>
              </span>
              {row.tag ? <span className={styles.tag}>{row.tag}</span> : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
