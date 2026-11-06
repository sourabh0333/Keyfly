"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";
import styles from "./chat-apps.module.css";

// Moments: 0 the ask types · 1 KeyFly makes the video · 2 the reply is
// ready and plays · 3 "Open in KeyFly" is pressed · 4 the project opens in
// KeyFly · 5 hold, then the other chat app.
const DONE = 5;
const TYPE = 34; // ms a character
const HOLD = [0, 1600, 1500, 700, 2400, 3000];

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Start in the chat, finish in KeyFly, as one thread: a rail of three
 * steps (You ask · KeyFly replies · You keep editing) whose mint line draws
 * down as the story moves, beside what each step looks like: the ask set
 * large like a pull quote ("You, in ChatGPT"); KeyFly's reply in the chat,
 * the video making then playing, with "Open in KeyFly"; and the same
 * project opening in KeyFly, its clips landing on the timeline, "Opened
 * from ChatGPT". After each pass the chat switches between ChatGPT and
 * Claude; the switch picks one. While on screen only; "Pause" holds it and
 * the video (WCAG 2.2.2). The server's HTML and reduced motion show the
 * finished thread.
 */
export function ChatThread({ pause, play, apps, switchLabel, summary, ask, steps, reply, project, status }) {
  const [phase, setPhase] = useState(DONE);
  const [typed, setTyped] = useState(ask.text.length);
  const [app, setApp] = useState(0);
  const [picked, setPicked] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const startedRef = useRef(false);

  const auto = visible && !paused && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // The story's clock.
  useEffect(() => {
    if (!auto) return;
    if (phase === 0) {
      // Type the ask, a character at a time, then move on.
      if (typed >= ask.text.length) {
        const done = setTimeout(() => setPhase(1), 350);
        return () => clearTimeout(done);
      }
      const timer = setTimeout(() => setTyped((t) => t + 1), TYPE);
      return () => clearTimeout(timer);
    }
    const first = !startedRef.current;
    const timer = setTimeout(
      () => {
        startedRef.current = true;
        if (first || phase === DONE) {
          if (!first && !picked) setApp((a) => (a + 1) % apps.length);
          setTyped(0);
          setPhase(0);
        } else setPhase(phase + 1);
      },
      first ? 300 : HOLD[phase],
    );
    return () => clearTimeout(timer);
  }, [auto, phase, typed, picked, apps.length, ask.text.length]);

  // The reply's video plays once it's ready.
  useEffect(() => {
    const v = videoRef.current;
    if (auto && phase >= 2) v.play().catch(() => {});
    else v.pause();
  }, [auto, phase]);

  const name = apps[app];
  const at = (n) => (phase >= n ? "" : undefined);
  const fill = phase === 0 ? 0.12 : phase < 4 ? 0.55 : 1;
  const stepOf = phase === 0 ? 0 : phase < 4 ? 1 : 2;

  return (
    <div ref={rootRef} className={styles.wrap} data-main="">
      <p className="visually-hidden">{summary}</p>

      {/* The bar: which chat, and where each app stands. */}
      <div className={styles.bar}>
        <div className={styles.switchRow}>
          <span className={styles.switchLabel}>{switchLabel}</span>
          <div className={styles.switch} role="group" aria-label="Chat app">
            {apps.map((a, i) => (
              <button
                key={a}
                type="button"
                aria-pressed={i === app}
                onClick={() => {
                  setApp(i);
                  setPicked(true);
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <ul className={styles.avail}>
          {apps.map((a) => (
            <li key={a}>
              {a}
              <span>{status.soon}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.thread} style={{ "--fill": fill }} aria-hidden="true">
        <span className={styles.line} />

        {/* 01 You ask. */}
        <Step index="01" label={steps[0]} on={stepOf >= 0} now={stepOf === 0} />
        <div className={styles.block}>
          <blockquote className={styles.quote}>
            <span className={styles.mark}>“</span>
            {ask.text.slice(0, typed)}
            {typed < ask.text.length ? <span className={styles.caret} /> : <span className={styles.mark}>”</span>}
          </blockquote>
          <p className={styles.by}>
            {ask.by} <b key={name}>{name}</b>
          </p>
        </div>

        {/* 02 KeyFly replies in the chat. */}
        <Step index="02" label={steps[1]} on={stepOf >= 1} now={stepOf === 1} />
        <div className={styles.block}>
          <div className={styles.reply} data-on={at(1)} data-ready={at(2)}>
            <div className={styles.video}>
              <video ref={videoRef} src={reply.video} poster={reply.poster} muted loop playsInline preload="none" />
              <span className={styles.shimmer} />
              <span className={styles.length}>{reply.length}</span>
            </div>
            <div className={styles.side}>
              <p className={styles.from}>
                <span className={styles.symbol} />
                {reply.app}
                <em key={name}>in {name}</em>
              </p>
              <p className={styles.state}>
                {phase >= 2 ? (
                  <>
                    <Tick />
                    {reply.ready}
                  </>
                ) : (
                  <>
                    <span className={styles.spin} />
                    {reply.making}
                  </>
                )}
              </p>
              <p className={styles.replyTitle}>{reply.title}</p>
              <span className={styles.open} data-pressed={phase === 3 ? "" : undefined}>
                {reply.open} ↗
              </span>
            </div>
          </div>
        </div>

        {/* 03 You keep editing in KeyFly. */}
        <Step index="03" label={steps[2]} on={stepOf >= 2} now={stepOf === 2} />
        <div className={styles.block}>
          <div className={styles.project} data-on={at(4)}>
            <p className={styles.projectHead}>
              <span className={styles.liveDot} />
              <b>{project.title}</b>
              <span className={styles.opened}>
                <Tick />
                {project.opened} <b key={name}>{name}</b>
              </span>
            </p>
            <div className={styles.tracks}>
              {project.tracks.map((t, i) => (
                <div key={t} className={styles.track}>
                  <span>{t}</span>
                  <i style={{ "--i": i }} />
                </div>
              ))}
              <span className={styles.playhead} />
            </div>
            <p className={styles.sync}>{project.sync}</p>
          </div>
        </div>
      </div>

      <div className={styles.foot}>
        <a className={styles.meanwhile} href={siteConfig.appUrl}>
          {status.meanwhile}
        </a>
        {reduced ? null : (
          <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
              {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
            {paused ? play : pause}
          </button>
        )}
      </div>
    </div>
  );
}

function Step({ index, label, on, now }) {
  return (
    <div className={styles.step} data-on={on ? "" : undefined} data-now={now ? "" : undefined}>
      <span className={styles.node} />
      <span className={styles.stepIndex}>{index}</span>
      <span className={styles.stepLabel}>{label}</span>
    </div>
  );
}
