"use client";

import { useEffect, useRef, useState } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./edit-with-words.module.css";

const HOLD = 4800; // ms each ask stays before the next (matches the row's fill)
const TYPE_MS = 600; // how long an ask takes to type in

// The first cut: shot lengths and the pause after each, as shares of the
// bar.
const SHOTS = [
  { w: 13, g: 2 },
  { w: 10, g: 0 },
  { w: 12, g: 3 },
  { w: 9, g: 0 },
  { w: 14, g: 2 },
  { w: 10, g: 0 },
  { w: 11, g: 3 },
  { w: 9, g: 0 },
];

const COLUMNS = [
  ["time", "Time"],
  ["format", "Format"],
  ["cuts", "Cuts"],
  ["look", "Look"],
];

const BEFORE = { time: "0:42", format: "16:9", cuts: "8", look: "Original" };

// What each ask changes in the facts.
const AFTER = {
  shorter: { time: "0:30" },
  pauses: { time: "0:36" },
  captions: { look: "Captions" },
  warm: { look: "Warm grade" },
  vertical: { format: "9:16" },
  pace: { cuts: "15" },
};

const WORDS = ["Your", "story,", "cut", "in", "seconds"];

// Where each shot (and the pause after it) sits once an ask is applied.
function layout(edit) {
  let x = 0;
  return SHOTS.map(({ w, g }) => {
    const width = edit === "shorter" ? w * 0.7 : w;
    const gap = edit === "pauses" ? 0 : g;
    const shot = { left: x, width, gap, pause: g > 0 };
    x += width + gap;
    return shot;
  });
}

function Shots({ edit }) {
  return (
    <span className={styles.shots} aria-hidden="true">
      {layout(edit).map(({ left, width, gap, pause }, i) => (
        <span key={i}>
          <i className={styles.shot} data-n={i % 3} data-split={edit === "pace" ? "" : undefined} style={{ left: `${left}%`, width: `${width}%` }} />
          {pause ? <i className={styles.gap} data-closed={gap === 0 ? "" : undefined} style={{ left: `${left + width}%`, width: `${gap || 0.001}%` }} /> : null}
        </span>
      ))}
    </span>
  );
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/**
 * Edit with words: the asks as a numbered list on the left, and on the
 * right one picture split before | after by a slider, over a table of
 * the cut's facts. Each ask types itself in under its row; when it lands,
 * a mint line sweeps in from the right to the middle and the After half
 * shows the change (a warm grade, captions, a 9:16 reframe), while the
 * table's After row lights what changed. The line can be dragged to
 * compare. The list moves on by itself while on screen and not hovered or
 * focused; with reduced motion it waits for a click and nothing sweeps.
 */
export function CommandCut({ edits, barLabel }) {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(edits[0].ask.length);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [split, setSplit] = useState(null);
  const rootRef = useRef(null);
  const pictureRef = useRef(null);
  const afterRef = useRef(null);
  const handleRef = useRef(null);

  const edit = edits[active];
  const applied = typed >= edit.ask.length;
  const shown = applied ? edit.id : null;
  const auto = visible && !held && !reduced;
  const change = AFTER[shown] ?? {};
  const after = { ...BEFORE, ...change };

  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // Type the ask in, then apply it.
  useEffect(() => {
    if (typed >= edit.ask.length) return;
    const start = performance.now() - (typed / edit.ask.length) * TYPE_MS;
    let frame = requestAnimationFrame(function type(now) {
      const n = Math.min(edit.ask.length, Math.round(((now - start) / TYPE_MS) * edit.ask.length));
      setTyped(n);
      if (n < edit.ask.length) frame = requestAnimationFrame(type);
    });
    return () => cancelAnimationFrame(frame);
  }, [typed, edit]);

  // When an ask lands, After sweeps in from the right to the line. Animated
  // in place (not re-mounted), so both halves keep playing the same frame.
  useEffect(() => {
    if (!applied || reduced || split !== null) return;
    const options = { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };
    const sweep = afterRef.current.animate([{ clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 50%)" }], options);
    const line = handleRef.current.animate([{ left: "100%" }, { left: "50%" }], options);
    return () => {
      sweep.cancel();
      line.cancel();
    };
    // Only on a new ask landing; dragging (split) must not replay it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, applied, reduced]);

  // Move on to the next ask.
  useEffect(() => {
    if (!auto || !applied) return;
    const timer = setTimeout(() => ask((active + 1) % edits.length), HOLD);
    return () => clearTimeout(timer);
    // ask() only sets state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, applied, active, edits.length]);

  function ask(index) {
    setActive(index);
    setSplit(null);
    setTyped(reduced ? edits[index].ask.length : 0);
  }

  // Dragging the line to compare.
  function drag(event) {
    const r = pictureRef.current.getBoundingClientRect();
    setSplit(clamp(((event.clientX - r.left) / r.width) * 100, 4, 96));
  }

  function onKeyDown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setSplit((s) => clamp((s ?? 50) + (event.key === "ArrowLeft" ? -5 : 5), 4, 96));
  }

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-edit={shown ?? undefined}
      data-auto={auto && applied ? "" : undefined}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <ol className={styles.asks} aria-label={barLabel}>
        {edits.map((e, i) => {
          const on = i === active;
          return (
            <li key={e.id} className={styles.row} data-on={on ? "" : undefined}>
              <button type="button" className={styles.rowButton} aria-pressed={on} onClick={() => ask(i)}>
                <span className={styles.rowIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.rowAsk}>
                  {on ? edit.ask.slice(0, typed) : e.ask}
                  {on && !applied ? <i className={styles.caret} aria-hidden="true" /> : null}
                </span>
              </button>
              {on ? (
                <p key={`${active}-${applied}`} className={styles.rowReply} data-on={applied ? "" : undefined} aria-live="polite">
                  <i aria-hidden="true" />
                  {applied ? e.reply : "Editing…"}
                </p>
              ) : null}
              <i key={`f${active}-${applied}`} className={styles.rowFill} aria-hidden="true" />
            </li>
          );
        })}
      </ol>

      <div className={styles.compare}>
        <div
          ref={pictureRef}
          className={styles.picture}
          style={split === null ? undefined : { "--split": `${split}%` }}
          data-dragged={split === null ? undefined : ""}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            drag(event);
          }}
          onPointerMove={(event) => event.buttons && drag(event)}
        >
          <div className={styles.layer} aria-hidden="true">
            <Preview kind="montage" format="16:9" bleed />
          </div>
          <div ref={afterRef} className={`${styles.layer} ${styles.after}`} aria-hidden="true">
            <div className={styles.afterFrame}>
              <Preview kind="montage" format="16:9" bleed />
              <span className={styles.grade} />
              <p className={styles.captions}>
                {WORDS.map((word, i) => (
                  <span key={word} style={{ "--i": i }}>
                    {word}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <span className={`${styles.tag} ${styles.tagBefore}`} aria-hidden="true">
            Before
          </span>
          <span className={`${styles.tag} ${styles.tagAfter}`} aria-hidden="true">
            After
          </span>
          <span
            ref={handleRef}
            className={styles.handle}
            role="slider"
            tabIndex={0}
            aria-label="Compare before and after"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(split ?? 50)}
            onKeyDown={onKeyDown}
          >
            <i />
          </span>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">
                <span className={styles.visuallyHidden}>Version</span>
              </th>
              {COLUMNS.map(([key, label]) => (
                <th key={key} scope="col">
                  {label}
                </th>
              ))}
              <th scope="col">Shots</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Before</th>
              {COLUMNS.map(([key]) => (
                <td key={key}>{BEFORE[key]}</td>
              ))}
              <td className={styles.shotsCell}>
                <Shots edit={null} />
              </td>
            </tr>
            <tr data-after="">
              <th scope="row">After</th>
              {COLUMNS.map(([key]) => (
                <td key={key} data-changed={change[key] ? "" : undefined}>
                  {after[key]}
                </td>
              ))}
              <td className={styles.shotsCell}>
                <Shots edit={shown} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
