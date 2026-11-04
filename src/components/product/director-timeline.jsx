"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./direct.module.css";

const STEP = 3400; // ms per note on the tour

const pad = (n) => String(n).padStart(2, "0");
const WAVE = Array.from({ length: 64 }, (_, i) => 0.22 + ((Math.sin(i * 1.3) + Math.sin(i * 0.41) + 2) / 4) * 0.78);
const SCENES = [[0, 14], [14, 30], [30, 47], [47, 64], [64, 84]]; // video clips, % of the lanes
const BARS = Array.from({ length: 40 }, (_, i) => 0.35 + ((Math.sin(i * 0.9) + 1) / 2) * 0.6);

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * Direct's stage: the AI director's reply as one panel, its notes pinned
 * to the cut they describe. The chrome is the reply's header; then the
 * note in play, which sits on the playhead right above the moment it is
 * about; then the cut's timeline (ruler, Video, Voice-over, Music and Look
 * tracks), each note a numbered diamond on its track at its time, with
 * the "Next" ideas as ghost clips after the end; the chat box closes it.
 *
 * A tour moves the playhead from note to note while on screen; pointing at
 * or focusing a diamond opens its note and holds it, clicking stops the
 * tour, and a button pauses it (WCAG 2.2.2). Reduced motion: no tour, the
 * first note open, the diamonds choose.
 */
export function DirectorTimeline({ reply, tracks, ruler, end, notes }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const [chosen, setChosen] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const note = notes[active];
  const auto = visible && !held && !paused && !chosen && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % notes.length), STEP);
    return () => clearInterval(timer);
  }, [auto, notes.length]);

  const diamond = (n) => {
    const i = notes.indexOf(n);
    return (
      <button
        key={n.id}
        type="button"
        className={styles.pin}
        style={{ "--x": n.x }}
        aria-pressed={i === active}
        aria-label={`${pad(i + 1)} ${n.key}`}
        onClick={() => {
          setActive(i);
          setChosen(true);
        }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          setActive(i);
          setHeld(true);
        }}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => {
          setActive(i);
          setHeld(true);
        }}
        onBlur={() => setHeld(false)}
      >
        <span>{pad(i + 1)}</span>
      </button>
    );
  };

  return (
    <div ref={rootRef} className={styles.panel} data-main="" data-paused={visible ? undefined : ""} style={{ "--at": note.x }}>
      {/* The reply's header. */}
      <div className={styles.chrome}>
        <span className={styles.from}>
          <i aria-hidden="true" />
          {reply.from}
        </span>
        <span className={styles.engine}>{reply.engine}</span>
        <span className={styles.asked}>
          <b aria-hidden="true">›</b> {reply.prompt}
        </span>
        <span className={styles.worked}>{reply.worked}</span>
      </div>

      <div className={styles.bar}>
        <p className={styles.built}>
          Built <em>“{reply.built}”</em>
        </p>
        <span className={styles.action} aria-hidden="true">
          <svg viewBox="0 0 16 16" width="12" height="12">
            <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5V5h2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {reply.revert}
        </span>
        <span className={styles.action} aria-hidden="true">
          <svg viewBox="0 0 16 16" width="12" height="12">
            <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5V5h-2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {reply.retry}
        </span>
        <span className={styles.used}>{reply.used}</span>
        {reduced ? null : (
          <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
              {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
            {paused ? reply.play : reply.pause}
          </button>
        )}
      </div>

      <div className={styles.cut}>
        {/* The note in play, on the playhead above its moment. */}
        <div className={styles.noteZone}>
          <div key={note.id} className={styles.note} aria-live="polite">
            <p className={styles.noteKicker}>
              <span>{pad(active + 1)}</span>
              {note.key}
              <em>{note.at}</em>
            </p>
            <p className={styles.noteValue}>{note.value}</p>
            {note.score ? (
              <span className={styles.meter} style={{ "--f": note.score / note.of }} aria-hidden="true">
                {Array.from({ length: note.of }, (_, i) => (
                  <i key={i} style={{ "--i": i }} />
                ))}
              </span>
            ) : null}
            <p className={styles.noteBody}>{note.body}</p>
            {note.chips ? (
              <p className={styles.chips}>
                {note.chipsLabel ? <em>{note.chipsLabel}</em> : null}
                {note.chips.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </p>
            ) : null}
          </div>
        </div>

        {/* The cut's timeline. */}
        <div className={styles.timeline}>
          <span className={styles.trackLabel} />
          <div className={styles.ruler}>
            {ruler.map(([t, x]) => (
              <span key={t} className={styles.time} style={{ "--x": x }}>
                {t}
              </span>
            ))}
            <span className={styles.endMark} style={{ "--x": end.at }}>
              {end.label}
            </span>
            {notes.filter((n) => n.track === "ruler").map(diamond)}
          </div>

          {tracks.map((t) => (
            <div key={t.id} className={styles.row}>
              <span className={styles.trackLabel}>{t.label}</span>
              <div className={`${styles.lane} ${styles[t.id]}`}>
                {t.id === "video"
                  ? SCENES.map(([a, b]) => <i key={a} className={styles.clip} style={{ left: `${a}%`, width: `${b - a}%` }} />)
                  : null}
                {t.id === "voice" ? (
                  <span className={styles.wave} style={{ width: `${end.at}%` }}>
                    {WAVE.map((h, i) => (
                      <i key={i} style={{ "--h": h.toFixed(2) }} />
                    ))}
                  </span>
                ) : null}
                {t.id === "music" ? (
                  <span className={styles.bars} style={{ width: `${end.at}%` }}>
                    {BARS.map((h, i) => (
                      <i key={i} style={{ "--h": h.toFixed(2) }} />
                    ))}
                  </span>
                ) : null}
                {t.id === "look" ? <span className={styles.grade} style={{ width: `${end.at}%` }} /> : null}
                {notes.filter((n) => n.track === t.id).map(diamond)}
              </div>
            </div>
          ))}

          {/* After the end: the "Next" ideas, as clips not yet made. */}
          <span className={styles.after} style={{ "--x": end.at }} aria-hidden="true">
            <em>{end.after}</em>
          </span>
        </div>

        {/* The playhead, from the note down through every track. */}
        <span className={styles.playhead} aria-hidden="true" />
      </div>

      <p className={styles.composer} aria-hidden="true">
        <span>{reply.ask}</span>
        <i />
      </p>
    </div>
  );
}
