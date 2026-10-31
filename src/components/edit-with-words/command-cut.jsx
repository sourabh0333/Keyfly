"use client";

import { useEffect, useRef, useState } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./edit-with-words.module.css";

const HOLD = 4200; // ms each edit stays before the next is asked
const TYPE_MS = 650; // how long an ask takes to type in

// The cut on the timeline: clip widths and the pause after each, as
// shares of the track.
const BASE = [
  { w: 13, g: 2 },
  { w: 10, g: 0 },
  { w: 12, g: 3 },
  { w: 9, g: 0 },
  { w: 14, g: 2 },
  { w: 10, g: 0 },
  { w: 11, g: 3 },
  { w: 9, g: 0 },
];

// What each edit does to the cut, and the running time it leaves.
function layout(edit) {
  let x = 0;
  return BASE.map(({ w, g }) => {
    const width = edit === "shorter" ? w * 0.7 : w;
    const gap = edit === "pauses" ? 0 : g;
    const clip = { x, width, gap };
    x += width + gap;
    return clip;
  });
}

const LENGTH = { shorter: "0:30", pauses: "0:36" };
const WORDS = ["Your", "story,", "cut", "in", "seconds"];

/**
 * The first cut, changed by words: a command bar under the picture where
 * each ask ("Make it shorter", "Cut the pauses", …) types itself in and
 * lands as a visible change, to the timeline (clips shrink, pauses close,
 * cuts double), the picture (a warm grade, captions, a vertical reframe)
 * and the running time, with Keyfly's reply beneath. The asks are buttons
 * too; it moves on by itself while on screen and not hovered or focused.
 * With reduced motion it waits for a click and changes without easing.
 */
export function CommandCut({ edits, barLabel }) {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(edits[0].ask.length);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef(null);

  const edit = edits[active];
  const applied = typed >= edit.ask.length;
  const shown = applied ? edit.id : null;
  const clips = layout(shown);
  const auto = visible && !held && !reduced;

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
    setTyped(reduced ? edits[index].ask.length : 0);
  }

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-edit={shown ?? undefined}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.viewer} aria-hidden="true">
        <div className={styles.frame}>
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

      <div className={styles.meta} aria-hidden="true">
        <span>
          Launch video
          <span className={styles.metaMuted}> · first cut</span>
        </span>
        <span className={styles.length}>{LENGTH[shown] ?? "0:42"}</span>
        <span className={styles.format}>{shown === "vertical" ? "9:16" : "16:9"}</span>
      </div>

      <div className={styles.timeline} aria-hidden="true">
        <div className={styles.track}>
          <span className={styles.trackLabel}>V1</span>
          <div className={styles.lane}>
            {clips.map((clip, i) => (
              <span key={i}>
                <i className={styles.clip} data-n={i % 3} style={{ left: `${clip.x}%`, width: `${clip.width}%` }} />
                {BASE[i].g ? <i className={styles.pause} style={{ left: `${clip.x + clip.width}%`, width: `${clip.gap}%` }} /> : null}
              </span>
            ))}
            <span className={styles.rail}>
              <i className={styles.playhead} />
            </span>
          </div>
        </div>
        <div className={styles.track} data-kind="captions">
          <span className={styles.trackLabel}>C1</span>
          <div className={styles.lane}>
            {clips.map((clip, i) => (
              <i key={i} className={styles.caption} style={{ left: `${clip.x + 1}%`, width: `${Math.max(0, clip.width - 2)}%`, "--i": i }} />
            ))}
          </div>
        </div>
        <div className={styles.track} data-kind="grade">
          <span className={styles.trackLabel}>FX</span>
          <div className={styles.lane}>
            <i className={styles.gradeBar} />
          </div>
        </div>
      </div>

      <div className={styles.command}>
        <div className={styles.bar} aria-live="polite">
          <span className={styles.spark} aria-hidden="true">
            ✦
          </span>
          <span className={styles.ask}>
            <span className={styles.visuallyHidden}>{barLabel}: </span>
            {edit.ask.slice(0, typed)}
            <i className={styles.caret} aria-hidden="true" />
          </span>
          <span className={styles.send} data-on={applied ? "" : undefined} aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <p key={`${active}-${applied}`} className={styles.reply} data-on={applied ? "" : undefined}>
          <i aria-hidden="true" />
          {applied ? edit.reply : "Editing…"}
        </p>

        <div className={styles.chips} role="group" aria-label={barLabel}>
          {edits.map((e, i) => (
            <button key={e.id} type="button" className={styles.chip} aria-pressed={i === active} onClick={() => ask(i)}>
              {e.ask}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
