"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./your-call.module.css";

const STEP = 1700; // ms per step of the self-running demo

// Where each decision's pin sits on the timeline (share of its width).
const PINS = [9, 44, 68, 86];

// Cut points for each "cuts" option, as shares of the V1 track.
const CUTS = [
  [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  [0, 20, 40, 60, 80, 100],
  [0, 14, 22, 38, 47, 63, 71, 86, 100],
];

const TITLE_WIDTH = [5, 9, 13]; // the chapter title's width per length
const TITLE_AT = 64;
const VOICE = [76, 95]; // where the voice-over runs
const DUCK = [0, 0.32, 0.62]; // how far the music dips under it

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
 * The decisions behind a cut, laid out where they happen: a timeline with
 * Keyfly's calls pinned to it (01–04), and beneath it a card for each:
 * what Keyfly chose, why, and a switch to change it. Changing a switch
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
      <div className={styles.timeline} aria-hidden="true">
        <div className={styles.pins}>
          {PINS.map((x, i) => (
            <span key={i} className={styles.pin} data-on={i === active ? "" : undefined} data-changed={choice[i] !== picks[i] ? "" : undefined} style={{ left: `${x}%` }}>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <i />
            </span>
          ))}
        </div>

        <div className={styles.ruler} />

        <div className={styles.track}>
          <span className={styles.label}>T1</span>
          <div className={styles.lane}>
            <i className={styles.titleClip} data-on={active === 2 ? "" : undefined} style={{ left: `${TITLE_AT}%`, width: `${TITLE_WIDTH[title]}%` }}>
              Chapter 2
            </i>
          </div>
        </div>

        <div className={styles.track}>
          <span className={styles.label}>V1</span>
          <div className={styles.lane}>
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
        </div>

        <div className={styles.track}>
          <span className={styles.label}>A1</span>
          <div className={`${styles.lane} ${styles.music}`} data-on={active === 3 ? "" : undefined}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.level}>
              <path d={level(DUCK[duck])} />
            </svg>
          </div>
        </div>

        <div className={styles.track}>
          <span className={styles.label}>A2</span>
          <div className={styles.lane}>
            <i className={styles.voice} style={{ left: `${VOICE[0]}%`, width: `${VOICE[1] - VOICE[0]}%` }}>
              Voice
            </i>
          </div>
        </div>

        <span className={styles.rail}>
          <i className={styles.playhead} />
        </span>
      </div>

      <ol className={styles.cards}>
        {decisions.map((d, i) => {
          const isChanged = choice[i] !== d.pick;
          return (
            <li key={d.id} className={styles.card} data-on={i === active ? "" : undefined}>
              <p className={styles.cardHead}>
                <span className={styles.cardIndex}>{String(i + 1).padStart(2, "0")}</span>
                {d.label}
              </p>
              <p className={styles.cardChoice}>
                <span className={styles.cardChose}>{chose}</span>
                {d.options[d.pick]}
              </p>
              <p className={styles.cardReason}>{d.reason}</p>
              <div className={styles.options} role="group" aria-label={d.label}>
                {d.options.map((option, o) => (
                  <button key={option} type="button" className={styles.option} aria-pressed={choice[i] === o} onClick={() => choose(i, o)}>
                    {option}
                  </button>
                ))}
              </div>
              <p className={styles.status} data-changed={isChanged ? "" : undefined}>
                <i aria-hidden="true" />
                {isChanged ? changed : pick}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
