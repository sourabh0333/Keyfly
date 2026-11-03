"use client";

import { useEffect, useRef, useState } from "react";
import { Shot } from "@/components/shot/shot";
import styles from "./old-way.module.css";

const AUTO = 2800; // ms per step when it isn't pinned to the scroll
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const pad = (n) => String(n).padStart(2, "0");

// The raw footage (V1), the voice (A1, with its pauses) and where things
// happen on them, as % of the timeline.
const RAW = [0, 9, 17, 28, 36, 47, 55, 66, 74, 86, 100];
const ZOOMS = [1, 4, 7]; // the clips that get a zoom keyframe
const PAUSES = [[24, 29], [51, 57], [79, 84]];
const WAVE = Array.from({ length: 64 }, (_, i) => 0.25 + ((Math.sin(i * 0.8) + Math.sin(i * 0.33) + 2) / 4) * 0.75);
const CAPTIONS = [4, 30, 56, 80];
// With KeyFly: the finished cut.
const CUT = [0, 18, 34, 50, 68, 84, 100];

/**
 * Your footage, edited two ways, as two mirrored columns on four
 * shared rows (head, line, picture, timeline) with a strip of the six
 * steps across both beneath. By hand (left), each step acts out one chore
 * (scrubbing, keyframing zooms, razor cuts, music keyframes, typing
 * captions, dragging a 9:16 crop), and what each chore leaves stays on
 * the timeline. With KeyFly (right): the sentence, the finished picture
 * and timeline. In the strip, each step pairs the chore with what KeyFly
 * did; the one in play is lit.
 *
 * Where the stage fits the screen and motion is welcome, it pins and the
 * scroll moves through the steps (data-live on the track); otherwise it
 * moves on by itself every few seconds while on screen. Reduced motion:
 * step 6, still. The segments under the editor jump to a step.
 */
export function Story({ hand, keyfly, ask, zoom, hint, steps }) {
  const n = steps.length;
  const [step, setStep] = useState(1);
  const [live, setLive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const trackRef = useRef(null);
  const pinRef = useRef(null);

  // Pin only where the stage fits the screen and motion is welcome.
  useEffect(() => {
    const motionless = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const check = () => {
      frame = 0;
      setReduced(motionless);
      setLive(!motionless && pinRef.current.firstElementChild.offsetHeight + 96 <= innerHeight);
    };
    const schedule = () => (frame ||= requestAnimationFrame(check));
    const observer = new ResizeObserver(schedule);
    observer.observe(pinRef.current.firstElementChild);
    addEventListener("resize", schedule);
    schedule();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("resize", schedule);
    };
  }, []);

  // Pinned: the scroll picks the step.
  useEffect(() => {
    if (!live) return;
    const track = trackRef.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = track.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 0.9999);
      setStep(Math.floor(p * n) + 1);
    };
    const schedule = () => (frame ||= requestAnimationFrame(update));
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [live, n]);

  // Not pinned: move on by itself while on screen (never with reduced motion).
  useEffect(() => {
    if (live || reduced) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) timer = setInterval(() => setStep((s) => (s % n) + 1), AUTO);
    }, { threshold: 0.3 });
    observer.observe(trackRef.current);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [live, reduced, n]);

  // A segment: pinned, scroll to its stretch; otherwise show it.
  function go(i) {
    if (!live) {
      setStep(i);
      return;
    }
    const track = trackRef.current;
    const top = track.getBoundingClientRect().top + scrollY;
    const span = track.offsetHeight - innerHeight;
    scrollTo({ top: top + span * ((i - 0.5) / n), behavior: "smooth" });
  }

  const shown = reduced ? n : step;
  const reached = Array.from({ length: shown }, (_, i) => i + 1).join(" ");
  const current = steps[shown - 1];

  return (
    <div
      ref={trackRef}
      className={styles.track}
      data-live={live ? "" : undefined}
    >
      <div ref={pinRef} className={styles.pin}>
        {/* Two mirrored columns on four shared rows (head, line, picture,
            timeline), then the six steps across both. */}
        <div className={styles.stage} data-step={shown} data-reached={reached} data-main="">
          {/* By hand. */}
          <div className={`${styles.side} ${styles.hand}`}>
            <div className={styles.sideHead}>
              <p className={styles.sideName}>{hand.label}</p>
              <p className={styles.counter} aria-live="polite">
                {hand.step} <b>{pad(shown)}</b> {hand.of} {pad(n)}
              </p>
            </div>

            <div key={shown} className={styles.line}>
              <p className={styles.lineTitle}>{current.title}</p>
              <p className={styles.lineBody}>{current.body}</p>
            </div>

            <div className={styles.viewer} aria-hidden="true">
              <Shot />
              <span className={styles.rawWash} />
              <span className={styles.timecode}>00:00:12:04</span>
              <span className={styles.zoom}>{zoom}</span>
              <span className={styles.typing}>
                Built for launch<i />
              </span>
              <span className={styles.crop} />
              {/* The hand doing the work: one cursor, at each step's tool. */}
              <span className={styles.cursor}>
                <svg viewBox="0 0 12 16" width="15" height="20">
                  <path d="M1 1v12l3.2-3 2.3 5 2-.9-2.2-5H11Z" />
                </svg>
              </span>
            </div>

            <div className={styles.timeline} aria-hidden="true">
              <span className={styles.code}>V1</span>
              <div className={styles.lane}>
                {RAW.slice(0, -1).map((at, i) => (
                  <i key={at} className={styles.raw} data-zoom={ZOOMS.includes(i) ? "" : undefined} style={{ left: `${at}%`, width: `${RAW[i + 1] - at}%` }} />
                ))}
              </div>
              <span className={styles.code}>A1</span>
              <div className={`${styles.lane} ${styles.voice}`}>
                {WAVE.map((h, i) => (
                  <i key={i} style={{ "--h": h.toFixed(2) }} />
                ))}
                {PAUSES.map(([a, b]) => (
                  <span key={a} className={styles.pause} style={{ left: `${a}%`, width: `${b - a}%` }} />
                ))}
              </div>
              <span className={styles.code}>A2</span>
              <div className={`${styles.lane} ${styles.music}`}>
                <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 5H22L25 13H58L61 5H100" />
                </svg>
                {[22, 25, 58, 61].map((x) => (
                  <i key={x} className={styles.key} style={{ left: `${x}%` }} />
                ))}
              </div>
              <span className={styles.code}>C1</span>
              <div className={styles.lane}>
                {CAPTIONS.map((at, i) => (
                  <i key={at} className={styles.word} style={{ left: `${at}%`, "--i": i }} />
                ))}
              </div>
              <span className={`${styles.rail} ${styles.handRail}`}>
                <i />
              </span>
            </div>
          </div>

          <span className={styles.divide} aria-hidden="true">
            <i>vs</i>
          </span>

          {/* With KeyFly: the same four rows, finished. */}
          <div className={`${styles.side} ${styles.keyfly}`}>
            <div className={styles.sideHead}>
              <p className={styles.sideName}>{keyfly.label}</p>
              <p className={styles.doneBadge}>
                <i />
                {keyfly.done}
              </p>
            </div>

            <div className={styles.line}>
              <p className={styles.ask}>
                <span>›</span>
                {ask}
              </p>
            </div>

            <div className={`${styles.viewer} ${styles.cut}`} aria-hidden="true">
              <Shot />
              <span className={styles.lower}>
                <b>{keyfly.title}</b>
                <span>{keyfly.sub}</span>
              </span>
              <span className={styles.captions}>
                {keyfly.captions.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </span>
              <span className={styles.ready}>
                <i />
                {keyfly.ready}
              </span>
            </div>

            <div className={styles.timeline} aria-hidden="true">
              <span className={styles.code}>V1</span>
              <div className={styles.lane}>
                {CUT.slice(0, -1).map((at, i) => (
                  <i key={at} className={styles.clip} data-n={i % 3} style={{ left: `${at}%`, width: `${CUT[i + 1] - at}%` }} />
                ))}
              </div>
              <span className={styles.code}>A1</span>
              <div className={`${styles.lane} ${styles.voice}`}>
                {WAVE.slice(0, 52).map((h, i) => (
                  <i key={i} style={{ "--h": h.toFixed(2) }} />
                ))}
              </div>
              <span className={styles.code}>A2</span>
              <div className={`${styles.lane} ${styles.music} ${styles.musicDone}`}>
                <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 5H18L21 13H70L73 5H100" />
                </svg>
              </div>
              <span className={styles.code}>C1</span>
              <div className={styles.lane}>
                {CAPTIONS.map((at) => (
                  <i key={at} className={`${styles.word} ${styles.wordDone}`} style={{ left: `${at}%` }} />
                ))}
              </div>
              <span className={`${styles.rail} ${styles.keyRail}`}>
                <i />
              </span>
            </div>
          </div>

          {/* The six steps, across both: the chore by hand above, what
              KeyFly did below. They jump to a step. */}
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  className={styles.stepBtn}
                  aria-current={i + 1 === shown ? "step" : undefined}
                  data-done={i + 1 < shown ? "" : undefined}
                  onClick={() => go(i + 1)}
                >
                  <span className={styles.stepBar} />
                  <span className={styles.stepHand}>
                    <em>{pad(i + 1)}</em>
                    {s.title}
                  </span>
                  <span className={styles.stepKey}>
                    <svg viewBox="0 0 18 18" width="14" height="14" aria-hidden="true">
                      <circle cx="9" cy="9" r="9" />
                      <path d="M5 9.3 7.6 12 13 6.4" />
                    </svg>
                    {s.keyfly}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className={styles.hint}>{hint}</p>
        </div>
      </div>
    </div>
  );
}
