"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./tools.module.css";

const CYCLE = 3600; // ms per hand-off: a new AI, then a new editor
const OUT_DELAY = 1200; // ms after the AI changes before the editor does
const RESUME = 10000; // ms after a click before it runs by itself again

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const pad = (n) => String(n).padStart(2, "0");

// The timeline in the hub: four tracks of clips, as [start, length] in
// percent of the lane.
const LANES = [
  { id: "t1", label: "T1", clips: [[0, 18], [44, 16], [80, 20]] },
  { id: "v1", label: "V1", clips: [[0, 24], [24, 27], [51, 23], [74, 26]] },
  { id: "a1", label: "A1", clips: [[2, 42], [48, 46]] },
  { id: "a2", label: "A2", clips: [[0, 100]] },
];

/** A cubic curve from (x1, y1) to (x2, y2), leaving and arriving level. */
function curve(x1, y1, x2, y2) {
  const dx = (x2 - x1) * 0.55;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

/**
 * The hand-off: the AI that edits (left), one KeyFly timeline (middle) and
 * the editor it goes to (right). Choosing an AI or an editor moves the mint
 * wire to it and updates the hub.
 *
 * It plays by itself as a continuous hand-off while on screen: each cycle a
 * new AI takes the edit (the light runs in along the left wire), then the
 * timeline goes to a new editor (out along the right). The mouse resting
 * over it doesn't stop it; a click pauses it for a while, and keyboard focus
 * inside holds it. With reduced motion it waits for a click. The wires are
 * an SVG drawn from the rows' measured positions (re-measured on resize).
 */
export function Handoff({ in: inSide, hub, out }) {
  const [agent, setAgent] = useState(1);
  const [editor, setEditor] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [resting, setResting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [wires, setWires] = useState(null);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const hubRef = useRef(null);
  const inRefs = useRef([]);
  const outRefs = useRef([]);

  const a = inSide.options[agent];
  const e = out.options[editor];
  const auto = visible && !held && !resting && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // After a click, rest a while, then play on.
  useEffect(() => {
    if (!clicks) return;
    const timer = setTimeout(() => setResting(false), RESUME);
    return () => clearTimeout(timer);
  }, [clicks]);

  // Each cycle: a new AI, then (OUT_DELAY later) a new editor.
  useEffect(() => {
    if (!auto) return;
    let outTimer = 0;
    const cycle = () => {
      setAgent((x) => (x + 1) % inSide.options.length);
      outTimer = setTimeout(() => setEditor((x) => (x + 1) % out.options.length), OUT_DELAY);
    };
    const timer = setInterval(cycle, CYCLE);
    return () => {
      clearInterval(timer);
      clearTimeout(outTimer);
    };
  }, [auto, inSide.options.length, out.options.length]);

  // Measure the wires: from the chosen AI to the hub, and from the hub to
  // the chosen editor. Hidden (null) where the columns stack.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const measure = () => {
      const box = root.getBoundingClientRect();
      const hubBox = hubRef.current.getBoundingClientRect();
      const from = inRefs.current[agent]?.getBoundingClientRect();
      const to = outRefs.current[editor]?.getBoundingClientRect();
      if (!from || !to || hubBox.left < from.right) return setWires(null);
      const hy = hubBox.top + hubBox.height / 2 - box.top;
      setWires({
        w: box.width,
        h: box.height,
        in: curve(from.right - box.left, from.top + from.height / 2 - box.top, hubBox.left - box.left, hy),
        out: curve(hubBox.right - box.left, hy, to.left - box.left, to.top + to.height / 2 - box.top),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [agent, editor]);

  function rest() {
    setResting(true);
    setClicks((n) => n + 1);
  }

  function chooseAgent(i) {
    setAgent(i);
    rest();
  }

  function chooseEditor(i) {
    setEditor(i);
    rest();
  }

  // Only keyboard focus holds it (a click focuses its button too).
  function onFocus(event) {
    if (event.target.matches(":focus-visible")) setHeld(true);
  }

  return (
    <div
      ref={rootRef}
      className={styles.handoff}
      data-auto={auto ? "" : undefined}
      data-paused={visible ? undefined : ""}
      onFocus={onFocus}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
      data-main=""
    >
      {wires ? (
        <svg className={styles.wires} viewBox={`0 0 ${wires.w} ${wires.h}`} aria-hidden="true">
          <path className={styles.wire} d={wires.in} />
          <path key={`in-${agent}`} className={styles.flow} d={wires.in} pathLength="100" />
          <path className={styles.wire} d={wires.out} />
          <path key={`out-${editor}`} className={`${styles.flow} ${styles.flowOut}`} d={wires.out} pathLength="100" />
        </svg>
      ) : null}

      {/* Left: the AI that edits. */}
      <div className={styles.column}>
        <p className={styles.kicker}>
          <span>01</span> {inSide.kicker}
        </p>
        <div className={styles.options} role="radiogroup" aria-label={inSide.kicker}>
          {inSide.options.map((o, i) => (
            <button
              key={o.id}
              ref={(el) => (inRefs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={i === agent}
              className={styles.option}
              onClick={() => chooseAgent(i)}
              data-own={o.id === "cloud" ? undefined : ""}
            >
              <span className={styles.optionIndex}>{pad(i + 1)}</span>
              <span className={styles.optionBody}>
                <span className={styles.optionName}>{o.name}</span>
                <span className={styles.optionNote}>{o.note}</span>
              </span>
              <span className={styles.cost}>{o.cost}</span>
            </button>
          ))}
        </div>
        <p className={styles.foot}>{inSide.foot}</p>
      </div>

      {/* Middle: one KeyFly timeline, edited by the AI and handed off. */}
      <div ref={hubRef} className={styles.hub} aria-live="polite">
        <div className={styles.hubChrome}>
          <span className={styles.dots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.file}>{hub.file}</span>
        </div>

        <div key={a.id} className={styles.agentLine}>
          <span className={styles.kicker}>{hub.editing}</span>
          <span className={styles.agentName}>{a.name}</span>
          <span className={styles.agentCost} data-own={a.id === "cloud" ? undefined : ""}>
            {a.cost}
          </span>
        </div>

        <div className={styles.chat}>
          <p className={styles.ask}>
            <span aria-hidden="true">›</span> {hub.ask}
          </p>
          <p key={`reply-${a.id}`} className={styles.reply}>
            <span aria-hidden="true">✓</span> {hub.reply}
          </p>
        </div>

        <div className={styles.lanes} aria-hidden="true">
          {LANES.map((lane) => (
            <div key={lane.id} className={styles.lane}>
              <span className={styles.laneLabel}>{lane.label}</span>
              <span className={`${styles.laneTrack} ${styles[lane.id]}`}>
                {lane.clips.map(([x, w], i) => (
                  <i key={i} style={{ left: `${x}%`, width: `${w}%` }} />
                ))}
              </span>
            </div>
          ))}
          <span className={styles.headTrack}>
            <span className={styles.playhead} />
          </span>
        </div>

        <div key={e.id} className={styles.handOff}>
          <span className={styles.kicker}>{hub.handOff}</span>
          <span className={styles.format}>{e.format}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
          <span className={styles.target}>{e.name}</span>
        </div>
      </div>

      {/* Right: the editor it goes to. */}
      <div className={styles.column}>
        <p className={styles.kicker}>
          <span>02</span> {out.kicker}
        </p>
        <div className={styles.options} role="radiogroup" aria-label={out.kicker}>
          {out.options.map((o, i) => (
            <button
              key={o.id}
              ref={(el) => (outRefs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={i === editor}
              className={`${styles.option} ${styles.optionOut}`}
              onClick={() => chooseEditor(i)}
            >
              <span className={styles.optionIndex}>{pad(i + 1)}</span>
              <span className={styles.optionBody}>
                <span className={styles.optionName}>{o.name}</span>
                <span className={styles.optionNote}>{o.format}</span>
              </span>
            </button>
          ))}
        </div>
        <p className={styles.foot}>{out.foot}</p>
      </div>
    </div>
  );
}
