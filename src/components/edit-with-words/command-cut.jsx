"use client";

import { useEffect, useRef, useState } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./edit-with-words.module.css";

const HOLD = 4600; // ms each ask stays before the next (matches the tab's fill)
const TYPE_MS = 650; // how long an ask takes to type in

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

const BEFORE = { time: "0:42", format: "16:9", cuts: "8 cuts" };

// What each ask changes in the facts under the picture.
const AFTER = {
  shorter: { time: "0:30" },
  pauses: { time: "0:36" },
  captions: { extra: "Captions" },
  warm: { extra: "Warm grade" },
  vertical: { format: "9:16" },
  pace: { cuts: "15 cuts" },
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

// The clip bar under a picture: plain segments, changed by the ask.
function Shots({ edit }) {
  return (
    <div className={styles.shots} aria-hidden="true">
      {layout(edit).map(({ left, width, gap, pause }, i) => (
        <span key={i}>
          <i className={styles.shot} data-n={i % 3} data-split={edit === "pace" ? "" : undefined} style={{ left: `${left}%`, width: `${width}%` }} />
          {pause ? <i className={styles.gap} data-closed={gap === 0 ? "" : undefined} style={{ left: `${left + width}%`, width: `${gap || 0.001}%` }} /> : null}
        </span>
      ))}
    </div>
  );
}

function Facts({ facts, changed }) {
  return (
    <dl className={styles.facts}>
      {["time", "format", "cuts", "extra"].map((key) =>
        facts[key] ? (
          <div key={key} data-changed={changed?.[key] ? "" : undefined}>
            <dt className={styles.visuallyHidden}>{key}</dt>
            <dd>{facts[key]}</dd>
          </div>
        ) : null,
      )}
    </dl>
  );
}

/**
 * Edit with words, as a before and after: the first cut on the left, the
 * same cut with one ask applied on the right, and the ask itself between
 * them, typed into a prompt with Keyfly's reply beneath. Whatever the ask
 * changed lights mint: the running time, the format (the picture narrows
 * to 9:16), the cuts, captions on the picture, a warm grade. Six tabs
 * below choose the ask; the one in play fills as it waits, and it moves on
 * by itself while on screen and not hovered or focused. With reduced
 * motion it waits for a click and changes without easing.
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
      data-auto={auto && applied ? "" : undefined}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.diff}>
        <figure className={styles.side}>
          <figcaption className={styles.sideLabel}>Before</figcaption>
          <div className={styles.screen} aria-hidden="true">
            <div className={styles.frame}>
              <Preview kind="montage" format="16:9" bleed />
            </div>
          </div>
          <Facts facts={BEFORE} />
          <Shots edit={null} />
        </figure>

        <div className={styles.ask}>
          <p className={styles.sideLabel} aria-hidden="true">
            Your ask
          </p>
          <div className={styles.askBody}>
            {/* The pill on the connector from Before to After. */}
            <div className={styles.connector}>
              <span className={styles.flow} aria-hidden="true" />
              <div className={styles.pill} aria-live="polite">
                <span className={styles.spark} aria-hidden="true">
                  ✦
                </span>
                <span className={styles.askText}>
                  <span className={styles.visuallyHidden}>{barLabel}: </span>
                  {edit.ask.slice(0, typed)}
                  <i className={styles.caret} aria-hidden="true" />
                </span>
              </div>
            </div>
            <p key={`${active}-${applied}`} className={styles.reply} data-on={applied ? "" : undefined}>
              <i aria-hidden="true" />
              <span>{applied ? edit.reply : "Editing…"}</span>
            </p>
          </div>
        </div>

        <figure className={styles.side} data-after="">
          <figcaption className={styles.sideLabel}>After</figcaption>
          <div className={styles.screen} aria-hidden="true">
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
          <Facts facts={after} changed={change} />
          <Shots edit={shown} />
        </figure>
      </div>

      <div className={styles.tabs} role="group" aria-label={barLabel}>
        {edits.map((e, i) => (
          <button key={e.id} type="button" className={styles.tab} aria-pressed={i === active} onClick={() => ask(i)}>
            <span className={styles.tabIndex} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {e.ask}
            <i key={`${active}-${applied}`} className={styles.tabFill} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
