"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./your-call.module.css";

const WRITE = 380; // ms per line as the note writes itself
const STEP = 1900; // ms per step of the self-running demo

// What the preview shows for each option, by decision.
const VOICE_SPEED = [1, 0.75, 1.2, 0.9]; // each voice speaks at its own pace
const LOOKS = ["midnight", "editorial", "warm"];
const WAVE = Array.from({ length: 14 }, (_, i) => 0.3 + ((Math.sin(i * 1.3) + Math.sin(i * 0.5) + 2) / 4) * 0.7);

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const never = () => () => {};

/**
 * The AI director's note on the cut it built, beside that cut. The note
 * (left) is laid out like its reply in the app: the prompt, "Built …",
 * one line per decision (what it chose, why, and the options that also
 * fit, as chips), the self-check, what it would try next, Revert and
 * Retry. The cut (right) follows the choices: the hook picks the opening
 * shot, the voice its name and waveform, the music its level, the look
 * the grade; a readout beneath names all four.
 *
 * When it first comes on screen the note writes itself line by line. Then,
 * until someone picks a chip, it demonstrates itself: one decision at a
 * time tries another option and returns (while on screen, not hovered or
 * focused, and with motion allowed). Retry writes it again.
 */
export function DirectorNote({ report, decisions, pickLabel, changedLabel, assumedLabel, check, next, revert, retry, preview }) {
  const picks = decisions.map((d) => d.pick);
  const lines = decisions.length + 2; // the decisions, then the foot
  const [mine, setMine] = useState(picks);
  const [touched, setTouched] = useState(false);
  const [focus, setFocus] = useState(0);
  const [step, setStep] = useState(0);
  const [written, setWritten] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [round, setRound] = useState(0); // remounts the "Updated" tag
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  // The server's HTML (and no JS) shows the note written; only a hydrated
  // page hides the lines it hasn't written yet.
  const hydrated = useSyncExternalStore(never, () => true, () => false);
  const rootRef = useRef(null);
  const hookRefs = useRef([]);

  const shown = reduced ? lines : written;
  const ready = shown >= lines;
  const auto = ready && visible && !held && !reduced && !touched;

  // The demo: decision = step / 2; even steps try an option, odd ones return.
  const n = decisions.length;
  const demoRow = Math.floor(step / 2) % n;
  const demoTry = step % 2 === 0 && step > 0;
  const lap = Math.floor(step / (2 * n));
  const choice = touched
    ? mine
    : picks.map((p, i) => {
        if (i !== demoRow || !demoTry) return p;
        const count = decisions[i].options.length;
        return (p + 1 + (lap % (count - 1))) % count;
      });
  const active = touched ? focus : demoRow;
  const changed = choice.map((c, i) => c !== picks[i]);
  const changes = changed.filter(Boolean).length;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // The note writes itself once it's on screen.
  useEffect(() => {
    if (reduced || !visible || written >= lines) return;
    const timer = setTimeout(() => setWritten((w) => w + 1), written === 0 ? 250 : WRITE);
    return () => clearTimeout(timer);
  }, [reduced, visible, written, lines]);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => {
      setStep((s) => s + 1);
      setRound((r) => r + 1);
    }, STEP);
    return () => clearTimeout(timer);
  }, [auto, step]);

  function choose(i, option) {
    // The first pick starts from KeyFly's picks, not whatever the demo is trying.
    const nextChoice = touched ? [...mine] : [...picks];
    nextChoice[i] = option;
    setMine(nextChoice);
    setTouched(true);
    setFocus(i);
    setRound((r) => r + 1);
  }

  function revertAll() {
    setMine(picks);
    setTouched(true);
    setRound((r) => r + 1);
  }

  function retryAll() {
    setMine(picks);
    setTouched(false);
    setStep(0);
    setWritten(0);
  }

  const [hook, voice, music, look] = choice;

  // Only the opening shot in use plays, and only while the cut is on screen;
  // with reduced motion they rest on their posters.
  useEffect(() => {
    hookRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === hook && visible && !reduced) {
        if (video.paused) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      } else video.pause();
    });
  }, [hook, visible, reduced]);
  const filled = Math.min(1, check.score / check.of);

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-main=""
      data-active={decisions[active].id}
      data-ready={ready ? "" : undefined}
      data-armed={hydrated && !reduced ? "" : undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      {/* The note. */}
      <div className={styles.note}>
        <p className={styles.from}>
          <i aria-hidden="true" />
          {report.from}
          <span>{report.meta}</span>
        </p>
        <p className={styles.prompt}>
          <span aria-hidden="true">›</span>
          {report.prompt}
        </p>
        <p className={styles.built}>
          {report.built} <em>“{report.name}”</em>
        </p>

        <ol className={styles.calls}>
          {decisions.map((d, i) => (
            <li
              key={d.id}
              className={styles.call}
              data-shown={i < shown ? "" : undefined}
              data-on={i === active && ready ? "" : undefined}
              data-changed={changed[i] ? "" : undefined}
            >
              <span className={styles.index}>{pad(i + 1)}</span>
              <p className={styles.label}>
                {d.label}
                {d.assumed ? <span className={styles.assumed}>{assumedLabel}</span> : null}
              </p>
              <div className={styles.body}>
                <p className={styles.pick}>
                  <span key={choice[i]} className={styles.pickValue}>
                    {d.options[choice[i]]}
                  </span>
                  <span className={styles.state}>{changed[i] ? changedLabel : pickLabel}</span>
                </p>
                <p className={styles.why}>{d.why}</p>
                <div className={styles.options} role="group" aria-label={d.label}>
                  {d.options.map((option, o) => (
                    <button
                      key={option}
                      type="button"
                      className={styles.chip}
                      aria-pressed={choice[i] === o}
                      data-pick={o === d.pick ? "" : undefined}
                      onClick={() => choose(i, o)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.foot} data-shown={shown > n ? "" : undefined}>
          <p className={styles.check}>
            <span className={styles.footLabel}>{check.label}</span>
            <span className={styles.meter} style={{ "--f": filled }} aria-hidden="true">
              {Array.from({ length: check.of }, (_, i) => (
                <i key={i} style={{ "--i": i }} />
              ))}
            </span>
            <b>
              {check.score}/{check.of}
            </b>
          </p>
          <p className={styles.next}>
            <span className={styles.footLabel}>{next.label}</span>
            {next.items.join(" · ")}
          </p>
        </div>

        <div className={styles.actions} data-shown={shown > n + 1 ? "" : undefined}>
          <button type="button" className={styles.revert} disabled={!changes} onClick={revertAll}>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5V5h2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {revert}
          </button>
          <button type="button" className={styles.retry} onClick={retryAll}>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5V5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {retry}
          </button>
        </div>
      </div>

      {/* The cut, following the note. */}
      <div className={styles.cut} aria-hidden="true">
        <p className={styles.cutLabel}>
          {preview.label}
          <span>
            {report.name} · 0:30 · 16:9
          </span>
        </p>
        <div className={styles.frame} data-look={LOOKS[look]} data-paused={visible ? undefined : ""}>
          {preview.hooks.map((film, i) => (
            <div key={film.src} className={styles.shot} data-on={i === hook ? "" : undefined}>
              <video
                ref={(el) => (hookRefs.current[i] = el)}
                className={styles.film}
                src={film.src}
                poster={film.poster}
                muted
                loop
                playsInline
                preload="none"
                tabIndex={-1}
              />
              {i === 0 ? (
                <p className={styles.titleLine}>
                  {preview.titleLine.map((line, l) => (
                    <span key={line} style={{ "--l": l }}>
                      {line}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          ))}
          <span className={styles.grade}>
            {LOOKS.map((l) => (
              <i key={l} data-l={l} />
            ))}
          </span>
          {changes > 0 && round > 0 ? (
            <span key={round} className={styles.updated}>
              <i />
              {preview.updated}
            </span>
          ) : null}
          <span className={styles.voiceTag} data-for="voice">
            <span className={styles.wave} style={{ "--s": VOICE_SPEED[voice] }}>
              {WAVE.map((h, i) => (
                <i key={i} style={{ "--h": h.toFixed(2), "--i": i }} />
              ))}
            </span>
            {preview.voiceOver} · {decisions[1].options[voice]}
          </span>
          <span className={styles.musicTag} data-for="music" data-off={music === 2 ? "" : undefined} data-up={music === 1 ? "" : undefined}>
            <span className={styles.level}>
              <i />
              <i />
              <i />
              <i />
            </span>
            {music === 2 ? preview.noMusic : decisions[2].options[music]}
          </span>
        </div>

        <dl className={styles.readout}>
          {decisions.map((d, i) => (
            <div key={d.id} data-on={i === active && ready ? "" : undefined} data-changed={changed[i] ? "" : undefined}>
              <dt>{d.label}</dt>
              <dd>{d.options[choice[i]]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
