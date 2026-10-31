"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./your-call.module.css";

const STEP = 1700; // ms per step of the self-running demo

// Each decision acts where its annotation's leader line lands: at the
// start of its quarter of the timeline (0, 25, 50, 75%).
// Cut points for each "cuts" option, as shares of the video track.
const CUTS = [
  [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  [0, 20, 40, 60, 80, 100],
  [0, 14, 22, 38, 47, 63, 71, 86, 100],
];

const TITLE_WIDTH = [6, 11, 16]; // the chapter title's width per length
const TITLE_AT = 50.6;
const VOICE = [75.6, 96]; // where the voice-over runs
const DUCK = [0, 0.32, 0.62]; // how far the music dips under it

// The voice's waveform: thin bars, seeded so server and client match.
const VOICE_BARS = Array.from({ length: 38 }, (_, i) => 0.25 + ((Math.sin(i * 1.7) + Math.sin(i * 0.63) + 2) / 4) * 0.75);

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// The music level as an SVG path over 100 × 20, dipping under the voice.
function level(duck) {
  const top = 5;
  const low = top + duck * 12;
  const [a, b] = VOICE;
  return `M0 ${top}H${a - 2}L${a} ${low}H${b}L${b + 2} ${top}H100`;
}

/**
 * The decisions behind a cut as an annotated diagram: four open notes in a
 * row (what Keyfly chose, why, and inline switches to change it), each
 * with a leader line running down onto the timeline beneath, to the point
 * where that decision acts. Changing a switch
 * changes the timeline: the opening take, where the cuts fall, how long
 * the chapter title holds, how far the music dips under the voice.
 *
 * Until someone touches a switch it demonstrates itself: one decision at
 * a time tries its other options, then returns to Keyfly's pick and moves
 * on (while on screen, not hovered or focused, and with motion allowed).
 */
export function DecisionTimeline({ decisions, chose, pick, changed }) {
  const picks = decisions.map((d) => d.pick);
  const [mine, setMine] = useState(picks);
  const [touched, setTouched] = useState(false);
  const [focus, setFocus] = useState(0);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !held && !reduced && !touched;

  // The demo: card = step / 3, trying pick + 1, pick + 2, then pick.
  const demoCard = Math.floor(step / 3) % decisions.length;
  const demoPhase = step % 3;
  const choice = touched
    ? mine
    : picks.map((p, i) => (i === demoCard && step > 0 ? (p + ((demoPhase + 1) % 3)) % decisions[i].options.length : p));
  const active = touched ? focus : demoCard;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setStep((s) => s + 1), STEP);
    return () => clearTimeout(timer);
  }, [auto, step]);

  function choose(card, option) {
    const next = touched ? [...mine] : [...picks];
    next[card] = option;
    setMine(next);
    setTouched(true);
    setFocus(card);
  }

  const [take, cuts, title, duck] = choice;
  const points = CUTS[cuts];

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <ol className={styles.notes}>
        {decisions.map((d, i) => {
          const isChanged = choice[i] !== d.pick;
          return (
            <li key={d.id} className={styles.note} data-on={i === active ? "" : undefined} data-changed={isChanged ? "" : undefined}>
              <span className={styles.leader} aria-hidden="true">
                <i />
              </span>
              <p className={styles.noteHead}>
                <span className={styles.noteIndex}>{String(i + 1).padStart(2, "0")}</span>
                {d.label}
              </p>
              <p className={styles.noteChoice}>
                <span className={styles.noteChose}>{chose}</span>
                <span key={choice[i]} className={styles.noteValue}>
                  {d.options[choice[i]]}
                </span>
              </p>
              <p className={styles.noteReason}>{d.reason}</p>
              <div className={styles.options} role="group" aria-label={d.label}>
                {d.options.map((option, o) => (
                  <button key={option} type="button" className={styles.option} aria-pressed={choice[i] === o} data-pick={o === d.pick ? "" : undefined} onClick={() => choose(i, o)}>
                    {option}
                  </button>
                ))}
              </div>
              <p className={styles.status}>{isChanged ? changed : pick}</p>
            </li>
          );
        })}
      </ol>

      <div className={styles.timeline} aria-hidden="true">
        <div className={styles.ruler} />

        <div className={styles.lane} data-kind="title">
          <i className={styles.titleClip} data-on={active === 2 ? "" : undefined} style={{ left: `${TITLE_AT}%`, width: `${TITLE_WIDTH[title]}%` }}>
            Chapter 2
          </i>
        </div>

        <div className={styles.lane} data-kind="video">
          {points.slice(0, -1).map((at, i) => (
            <i
              key={`${cuts}-${i}`}
              className={styles.clip}
              data-n={i === 0 ? `take${take}` : i % 3}
              data-on={(i === 0 && active === 0) || active === 1 ? "" : undefined}
              style={{ left: `${at}%`, width: `${points[i + 1] - at}%` }}
            />
          ))}
        </div>

        <div className={styles.lane} data-kind="music" data-on={active === 3 ? "" : undefined}>
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.level}>
            <path d={level(DUCK[duck])} />
          </svg>
        </div>

        <div className={styles.lane} data-kind="voice">
          <span className={styles.voice} style={{ left: `${VOICE[0]}%`, width: `${VOICE[1] - VOICE[0]}%` }}>
            {VOICE_BARS.map((h, i) => (
              <i key={i} style={{ "--h": h.toFixed(2) }} />
            ))}
          </span>
        </div>

        <span className={styles.rail}>
          <i className={styles.playhead} />
        </span>
      </div>
    </div>
  );
}
