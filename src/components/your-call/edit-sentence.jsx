"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./your-call.module.css";

const STEP = 1700; // ms per step of the self-running demo

const TAKES = ["explainer", "demo", "launch"]; // the opening shot, per take
const CUTS = [
  [10, 20, 30, 40, 50, 60, 70, 80, 90],
  [20, 40, 60, 80],
  [14, 22, 38, 47, 63, 71, 86],
];
const MUSIC = [0.92, 0.6, 0.34]; // the music meter's level, per setting

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * Keyfly's edit explained in one sentence, where every choice is a switch:
 * clicking a highlighted phrase flips it to the next option, and the
 * monitor beside it shows the result (the opening shot and its take, the
 * cut marks, the chapter title's hold, the music and voice levels). Under
 * the sentence, why Keyfly made the call in focus, and a way back to
 * Keyfly's cut once anything has changed.
 *
 * Until someone clicks it demonstrates itself: one phrase at a time flips
 * through its options and back (while on screen, not hovered or focused,
 * and with motion allowed).
 */
export function EditSentence({ sentence, decisions, why, reset, hint }) {
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

  // The demo: phrase = step / 3, trying pick + 1, pick + 2, then pick.
  const demoCard = Math.floor(step / 3) % decisions.length;
  const demoPhase = step % 3;
  const choice = touched ? mine : picks.map((p, i) => (i === demoCard && step > 0 ? (p + ((demoPhase + 1) % 3)) % 3 : p));
  const active = touched ? focus : demoCard;
  const edited = choice.some((c, i) => c !== picks[i]);

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

  function flip(i) {
    const next = touched ? [...mine] : [...picks];
    next[i] = (choice[i] + 1) % decisions[i].options.length;
    setMine(next);
    setTouched(true);
    setFocus(i);
  }

  function backToKeyfly() {
    setMine(picks);
    setTouched(true);
  }

  const [take, cuts, title, duck] = choice;

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-active={decisions[active].id}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.words}>
        <p className={styles.sentence}>
          {sentence.map((part, k) => {
            if (typeof part === "string") return <span key={k}>{part}</span>;
            const d = decisions[part];
            const value = d.options[choice[part]];
            return (
              <button
                key={k}
                type="button"
                className={styles.phrase}
                data-on={part === active ? "" : undefined}
                data-changed={choice[part] !== d.pick ? "" : undefined}
                aria-label={`${d.label}: ${value}. Change`}
                onClick={() => flip(part)}
                onPointerEnter={() => touched && setFocus(part)}
              >
                <span key={value} className={styles.phraseValue}>
                  {value}
                </span>
                <svg className={styles.phraseIcon} viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M3 4.5 6 1.5l3 3M3 7.5l3 3 3-3" />
                </svg>
              </button>
            );
          })}
        </p>

        <div className={styles.why} aria-live="polite">
          <span className={styles.whyIndex}>
            {String(active + 1).padStart(2, "0")}
            <span>/{String(decisions.length).padStart(2, "0")}</span>
          </span>
          <p key={active} className={styles.whyText}>
            <span className={styles.whyLabel}>
              {why} · {decisions[active].label}
            </span>
            {decisions[active].reason}
          </p>
        </div>

        <div className={styles.foot}>
          <p className={styles.hint}>{hint}</p>
          <button type="button" className={styles.reset} data-on={edited && touched ? "" : undefined} onClick={backToKeyfly} tabIndex={edited && touched ? 0 : -1}>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5V5h2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {reset}
          </button>
        </div>
      </div>

      <div className={styles.monitor} aria-hidden="true">
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

        <div className={styles.cutline} data-for="cuts">
          {CUTS[cuts].map((x) => (
            <i key={`${cuts}-${x}`} style={{ left: `${x}%` }} />
          ))}
          <span className={styles.cutHead} />
        </div>
      </div>
    </div>
  );
}
