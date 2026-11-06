"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./agents.module.css";

const STEP = 1900; // ms each moment holds while it plays
const HOLD = 4500; // ms the finished edit holds before it starts again

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * One studio panel around a playing video. Header: the project, the agent
 * at work (via the desktop app) and the AI minutes used, which stay at 0.
 * Body: the video (the site's illustrative launch reel) with its scrub bar,
 * where the trim shows and the captions land, beside the chat: your asks
 * as bubbles, the agent's replies with its badge (and "is working" while
 * it edits), its limit as an amber notice, KeyFly's offer of Codex or
 * Cloud, Codex finishing; newest at the foot, older ones moving up. Footer: every agent it works with, the one at work lit,
 * KeyFly Cloud last with its cost. While on screen the video plays and a
 * moment passes every 1.9s, holds, then starts again; "Pause" holds both
 * (WCAG 2.2.2). The server's HTML and reduced motion show the finished
 * edit on the video's poster.
 */
export function AgentStudio({ pause, play, summary, video, studio, agents, cloud, plan, events, you, keyfly }) {
  const last = events.length - 1;
  const [phase, setPhase] = useState(last);
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

  useEffect(() => {
    const el = videoRef.current;
    if (auto) el.play().catch(() => {});
    else el.pause();
  }, [auto]);

  useEffect(() => {
    if (!auto) return;
    const first = !startedRef.current;
    const delay = first ? 300 : phase === last ? HOLD : STEP;
    const timer = setTimeout(() => {
      startedRef.current = true;
      setPhase(first || phase === last ? 0 : phase + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [auto, phase, last]);

  const working = phase >= last ? 1 : 0;
  const limited = phase >= events.findIndex((e) => e.limit);
  const trimmed = phase >= 1;
  const captioned = phase >= last;
  const name = (who) => (who === "you" ? you : who === "keyfly" ? keyfly : agents[who]);

  return (
    <div ref={rootRef} className={styles.studioWrap} data-main="">
      <p className="visually-hidden">{summary}</p>

      <div className={styles.studio} data-playing={auto ? "" : undefined} aria-hidden="true">
        {/* Header: the project, the agent at work, the AI minutes. */}
        <div className={styles.studioHead}>
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          <b className={styles.project}>{studio.title}</b>
          <span className={styles.working} data-limit={limited && !working ? "" : undefined}>
            <span className={styles.live} />
            {studio.editing} <b key={working}>{agents[working]}</b>
            <small>{studio.via}</small>
          </span>
          <span className={styles.minutes}>
            {studio.meter}
            <strong>{studio.value}</strong>
          </span>
        </div>

        {/* Body: the video and the activity. */}
        <div className={styles.studioBody}>
          <div className={styles.player}>
            <div className={styles.screen}>
              <video ref={videoRef} src={video.src} poster={video.poster} muted loop playsInline preload="none" />
              <span className={styles.captionLine} data-on={captioned ? "" : undefined}>
                {video.caption}
              </span>
              <span className={styles.updated} key={trimmed && phase === 1 ? "t" : captioned ? "c" : "rest"} data-on={phase === 1 || phase === last ? "" : undefined}>
                <Tick /> Updated
              </span>
            </div>
            <div className={styles.scrub}>
              <div className={styles.segments} data-trimmed={trimmed ? "" : undefined}>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className={styles.capTrack} data-on={captioned ? "" : undefined}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <span className={styles.scrubHead} />
            </div>
          </div>

          <div className={styles.chat}>
            <div className={styles.chatHead}>
              <span>{studio.chat}</span>
              <span className={styles.chatAgent} key={working}>
                <span className={styles.badge}>{"›_"}</span>
                {agents[working]}
              </span>
            </div>

            <div className={styles.thread}>
              {events.slice(0, phase + 1).map((event, i) => {
                if (event.who === "you")
                  return (
                    <p key={i} className={styles.mine}>
                      {event.text}
                    </p>
                  );
                if (event.limit)
                  return (
                    <p key={i} className={styles.system}>
                      <span className={styles.systemMark}>!</span>
                      <span>
                        <b>{name(event.who)}</b> {event.text}
                      </span>
                    </p>
                  );
                const isKeyfly = event.who === "keyfly";
                return (
                  <div key={i} className={styles.theirs} data-keyfly={isKeyfly ? "" : undefined}>
                    <span className={styles.avatar} data-keyfly={isKeyfly ? "" : undefined}>
                      {isKeyfly ? null : "›_"}
                    </span>
                    <div className={styles.bubble}>
                      <small>{name(event.who)}</small>
                      <p>
                        {event.done ? <Tick /> : null}
                        {event.text}
                      </p>
                      {event.options ? (
                        <span className={styles.choices} data-pressed="">
                          {event.options.map((option, j) => (
                            <i key={option} data-pick={j === 0 ? "" : undefined}>
                              {option}
                            </i>
                          ))}
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              {events[phase].who === "you" ? (
                <p className={styles.typing}>
                  <span className={styles.dotsTyping}>
                    <i />
                    <i />
                    <i />
                  </span>
                  {agents[working]} {studio.working}
                </p>
              ) : null}
            </div>

            <p className={styles.composer}>{studio.composer}</p>
          </div>
        </div>

        {/* Footer: every agent it works with. */}
        <div className={styles.studioFoot}>
          <ul className={styles.roster}>
            {agents.map((agent, i) => (
              <li key={agent} data-state={i === working ? "on" : i === 0 && limited ? "limit" : undefined}>
                <span className={styles.rosterDot} />
                {agent}
              </li>
            ))}
            <li data-cloud="">
              <span className={styles.rosterDot} />
              {cloud.name}
              <small>{cloud.cost}</small>
            </li>
          </ul>
          <span className={styles.plan}>{plan}</span>
        </div>
      </div>

      {reduced ? null : (
        <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
            {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
          {paused ? play : pause}
        </button>
      )}
    </div>
  );
}
