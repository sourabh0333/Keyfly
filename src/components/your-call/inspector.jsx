"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./your-call.module.css";

const STEP = 1700; // ms per step of the self-running demo

const TAKES = ["explainer", "demo", "launch"]; // the opening shot, per take
const CUTS = [
  [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  [0, 20, 40, 60, 80, 100],
  [0, 14, 22, 38, 47, 63, 71, 86, 100],
];
const TITLE_WIDTH = [6, 11, 16];
const TITLE_AT = 56;
const VOICE = [76, 96];
const DUCK = [0, 0.32, 0.62];
const MUSIC = [0.92, 0.6, 0.34];
const MARKERS = [5, 35, 61, 86]; // where each decision is marked on the timeline

const VOICE_BARS = Array.from({ length: 34 }, (_, i) => 0.25 + ((Math.sin(i * 1.7) + Math.sin(i * 0.63) + 2) / 4) * 0.75);

const pad = (n) => String(n).padStart(2, "0");

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
 * The Keyfly editor with its inspector open: the viewer on the left, the
 * inspector on the right listing every decision Keyfly made (its reason
 * and a switch to change it), and the timeline beneath with each decision
 * marked where it acts. Changing a switch changes the viewer and the
 * timeline: the opening take, where the cuts fall, the chapter title's
 * hold, the music's level under the voice.
 *
 * Until someone touches a switch it demonstrates itself: one decision at
 * a time tries its other options, then returns to Keyfly's pick (while on
 * screen, not hovered or focused, and with motion allowed).
 */
export function Inspector({ file, inspector, inspectorSub, decisions, why, pickLabel, changedLabel, reset }) {
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

  // The demo: decision = step / 3, trying pick + 1, pick + 2, then pick.
  const demoCard = Math.floor(step / 3) % decisions.length;
  const demoPhase = step % 3;
  const choice = touched ? mine : picks.map((p, i) => (i === demoCard && step > 0 ? (p + ((demoPhase + 1) % 3)) % 3 : p));
  const active = touched ? focus : demoCard;
  const changes = choice.filter((c, i) => c !== picks[i]).length;

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

  function choose(i, option) {
    const next = touched ? [...mine] : [...picks];
    next[i] = option;
    setMine(next);
    setTouched(true);
    setFocus(i);
  }

  function backToKeyfly() {
    setMine(picks);
    setTouched(true);
  }

  const [take, cuts, title, duck] = choice;
  const points = CUTS[cuts];

  return (
    <div
      ref={rootRef}
      className={styles.window}
      data-frame="You make the calls"
      data-active={decisions[active].id}
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
          <span className={styles.fileMuted}> · Keyfly</span>
        </span>
        <span className={styles.count} data-changed={changes ? "" : undefined}>
          {decisions.length} decisions{changes ? ` · ${changes} changed` : ""}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.viewer} aria-hidden="true">
          <div className={styles.frame}>
            {TAKES.map((kind, i) => (
              <div key={kind} className={styles.shot} data-on={i === take ? "" : undefined} data-paused={i === take ? undefined : ""}>
                <Preview kind={kind} format="16:9" bleed />
              </div>
            ))}
            <span key={`take${take}`} className={styles.take} data-for="take">
              <i />
              Take {take + 1}
            </span>
            <div className={styles.lower} data-for="title">
              <span className={styles.lowerTitle}>Chapter 2</span>
              <span className={styles.hold}>
                {[0, 1, 2].map((s) => (
                  <i key={s} data-on={s <= title ? "" : undefined} />
                ))}
                <b>{title + 1}s</b>
              </span>
            </div>
            <div className={styles.meters} data-for="duck">
              <span className={styles.meter}>
                <i style={{ "--l": MUSIC[duck] }} />
                <b>M</b>
              </span>
              <span className={styles.meter} data-voice="">
                <i style={{ "--l": 0.86 }} />
                <b>V</b>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelHead}>
            {inspector}
            <span>{inspectorSub}</span>
          </p>
          <ol className={styles.decisions}>
            {decisions.map((d, i) => {
              const isChanged = choice[i] !== d.pick;
              const on = i === active;
              return (
                <li key={d.id} className={styles.decision} data-on={on ? "" : undefined} data-changed={isChanged ? "" : undefined}>
                  <div className={styles.decisionHead}>
                    <span className={styles.decisionIndex}>{pad(i + 1)}</span>
                    <span className={styles.decisionLabel}>{d.label}</span>
                    <span className={styles.decisionState}>{isChanged ? changedLabel : pickLabel}</span>
                  </div>
                  <div className={styles.switch} role="group" aria-label={d.label}>
                    {d.options.map((option, o) => (
                      <button key={option} type="button" aria-pressed={choice[i] === o} data-pick={o === d.pick ? "" : undefined} onClick={() => choose(i, o)}>
                        {option}
                      </button>
                    ))}
                  </div>
                  {on ? (
                    <p key={`${i}`} className={styles.reason}>
                      <span>{why}</span>
                      {d.reason}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <button type="button" className={styles.reset} disabled={!changes || !touched} onClick={backToKeyfly}>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5V5h2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {reset}
          </button>
        </div>
      </div>

      <div className={styles.timeline} aria-hidden="true">
        <div className={styles.markers}>
          {MARKERS.map((x, i) => (
            <span key={i} className={styles.marker} data-on={i === active ? "" : undefined} data-changed={choice[i] !== picks[i] ? "" : undefined} style={{ left: `${x}%` }}>
              <i />
              {pad(i + 1)}
            </span>
          ))}
        </div>
        <div className={styles.ruler} />
        <div className={styles.track}>
          <span className={styles.trackLabel}>T1</span>
          <div className={styles.lane}>
            <i className={styles.titleClip} data-on={active === 2 ? "" : undefined} style={{ left: `${TITLE_AT}%`, width: `${TITLE_WIDTH[title]}%` }}>
              Chapter 2
            </i>
          </div>
        </div>
        <div className={styles.track}>
          <span className={styles.trackLabel}>V1</span>
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
          <span className={styles.trackLabel}>A1</span>
          <div className={`${styles.lane} ${styles.music}`} data-on={active === 3 ? "" : undefined}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.level}>
              <path d={level(DUCK[duck])} />
            </svg>
          </div>
        </div>
        <div className={styles.track}>
          <span className={styles.trackLabel}>A2</span>
          <div className={styles.lane}>
            <span className={styles.voice} style={{ left: `${VOICE[0]}%`, width: `${VOICE[1] - VOICE[0]}%` }}>
              {VOICE_BARS.map((h, i) => (
                <i key={i} style={{ "--h": h.toFixed(2) }} />
              ))}
            </span>
          </div>
        </div>
        <span className={styles.rail}>
          <i className={styles.playhead} />
        </span>
      </div>
    </div>
  );
}
