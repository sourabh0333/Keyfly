"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./footage.module.css";

const STEP = 1700; // ms per pass
const HOLD = 3600; // ms with every pass done, before it starts again

const pad = (n) => String(n).padStart(2, "0");
const WAVE = Array.from({ length: 60 }, (_, i) => 0.25 + ((Math.sin(i * 1.4) + Math.sin(i * 0.43) + 2) / 4) * 0.75);
// The recording's track: speech, with its two pauses, as % of its length.
const TRACK = [
  { speech: 30 },
  { pause: 9 },
  { speech: 34 },
  { pause: 6 },
  { speech: 21 },
];

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * Footage's stage: one recording cleaned up in four passes. Left, the
 * picture (the recording: an illustrative silent loop of the presenter
 * speaking, its pauses where the transcript has them) with its track
 * beneath; right, its transcript, word by word. Beneath both, the four
 * passes as a bar.
 *
 * Passes apply in order and what each does stays: 1 the pauses close on
 * the track and in the transcript; 2 the filler words strike through and
 * fold away; 3 captions appear on the picture; 4 the shot zooms on the
 * speaker and a callout lands. The length counts down as they run, and
 * the transcript's log gains a line per pass. The stage carries data-done
 * ("1 2 3 4", matched with ~=).
 *
 * It runs while on screen, holds, then starts again; clicking a pass
 * shows the cleanup up to it and stops the cycle; a button pauses the
 * passes and the recording (WCAG 2.2.2). Reduced motion: every pass done,
 * the recording on its poster, nothing moves.
 */
export function Cleanup({ file, video, pause, play, transcriptLabel, words, caption, callout, zoomTag, lengths, log, passes }) {
  const [done, setDone] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [chosen, setChosen] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  const shown = reduced ? passes.length : done;
  const running = visible && !paused && !chosen && !reduced;
  const reached = Array.from({ length: shown }, (_, i) => i + 1).join(" ");

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // The recording plays while on screen and not paused; with reduced
  // motion it rests on its poster.
  useEffect(() => {
    const el = videoRef.current;
    if (visible && !paused && !reduced) el.play().catch(() => {});
    else el.pause();
  }, [visible, paused, reduced]);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setDone((d) => (d < passes.length ? d + 1 : 0)), done === passes.length ? HOLD : done === 0 ? 900 : STEP);
    return () => clearTimeout(timer);
  }, [running, done, passes.length]);

  return (
    <div ref={rootRef} className={styles.stage} data-main="" data-done={reached} data-paused={visible ? undefined : ""}>
      {/* The picture, and its track. */}
      <div className={styles.picture}>
        <p className={styles.fileBar}>
          <span>
            <i aria-hidden="true" />
            {file}
          </span>
          <b>
            <span key={lengths[shown]}>{lengths[shown]}</span>
          </b>
        </p>
        <div className={styles.frame} aria-hidden="true">
          <div className={styles.shot}>
            <video ref={videoRef} className={styles.video} src={video.src} poster={video.poster} muted loop playsInline preload="metadata" />
          </div>
          <span className={styles.zoomTag}>{zoomTag}</span>
          <span className={styles.callout}>
            <i />
            {callout}
          </span>
          <p className={styles.caption}>
            {caption.map((w, i) => (
              <span key={i} style={{ "--i": i }}>
                {w}
              </span>
            ))}
          </p>
        </div>
        <div className={styles.track} aria-hidden="true">
          {TRACK.map((part, i) =>
            part.pause ? (
              <b key={i} className={styles.gap} style={{ "--w": part.pause }} />
            ) : (
              <span key={i} className={styles.speech} style={{ "--w": part.speech }}>
                {WAVE.slice(i * 12, i * 12 + Math.round(part.speech / 2.4)).map((h, n) => (
                  <i key={n} style={{ "--h": h.toFixed(2) }} />
                ))}
              </span>
            ),
          )}
        </div>
      </div>

      {/* The transcript. */}
      <div className={styles.transcript}>
        <p className={styles.transcriptHead}>
          {transcriptLabel}
          {reduced ? null : (
            <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
              <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
                {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
              </svg>
              {paused ? play : pause}
            </button>
          )}
        </p>
        <p className={styles.words}>
          {words.map((w, i) =>
            typeof w === "string" ? (
              <span key={i} className={styles.word}>
                {w}{" "}
              </span>
            ) : w.filler ? (
              <span key={i} className={styles.filler}>
                <span>{w.filler} </span>
              </span>
            ) : (
              <span key={i} className={styles.silence}>
                <span>⏸ {w.pause}s </span>
              </span>
            ),
          )}
        </p>
        <ol className={styles.log}>
          {log.map((line, i) => (
            <li key={line} data-done={i < shown ? "" : undefined}>
              <span>{pad(i + 1)}</span>
              {line}
            </li>
          ))}
        </ol>
      </div>

      {/* The four passes. */}
      <ol className={styles.passes}>
        {passes.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              className={styles.pass}
              data-done={i < shown ? "" : undefined}
              data-now={i === shown - 1 ? "" : undefined}
              onClick={() => {
                setChosen(true);
                setDone(i + 1);
              }}
            >
              <span className={styles.passIndex}>{pad(i + 1)}</span>
              <span className={styles.passName}>{p.name}</span>
              <span className={styles.passDetail}>{p.detail}</span>
              <span className={styles.tick} aria-hidden="true">
                <svg viewBox="0 0 16 16" width="10" height="10">
                  <path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
