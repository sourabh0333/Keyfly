"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./byo.module.css";

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const list = matchMedia(MOTION);
  list.addEventListener("change", callback);
  return () => list.removeEventListener("change", callback);
}

const SEGMENTS = 16;
const lit = (level) => (level > 0 ? Math.max(1, Math.round(level * SEGMENTS)) : 0);

function Meter({ m, on }) {
  const now = m[on];
  const capped = m.free.level < m.byo.level;
  const n = lit(now.level);
  return (
    <div className={styles.channel} data-open={now.open ? "" : undefined}>
      <p className={styles.value}>
        {now.open ? <i aria-hidden="true">∞</i> : null}
        {now.text}
      </p>
      <div className={styles.meter} aria-hidden="true">
        <span className={styles.segments}>
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <i key={i} data-on={i < n ? "" : undefined} style={{ "--d": `${i * 22}ms` }} />
          ))}
        </span>
        {capped ? (
          <span className={styles.limit} style={{ "--at": lit(m.free.level) / SEGMENTS }} data-ghost={on === "byo" ? "" : undefined} />
        ) : null}
      </div>
      <p className={styles.channelName}>{m.label}</p>
    </div>
  );
}

/**
 * "Bring your own AI" as an editor's limiter, in one glass console. The top
 * bar: your own AI (the agents), the AI minutes it uses (none), and a Free
 * | BYO switch. Left, the output monitor: one film, tagged with the chosen
 * plan's export size, with the small KeyFly mark on Free. Right, a channel
 * meter per allowance (LED segments, as the price sheet's AI-minutes meter):
 * on Free each stops at a dashed limit; on BYO they run past it (Unlimited
 * fills the meter) and a faint tick stays where Free stopped. The foot: the
 * chosen plan's price and button. It starts on Free and, the first time it
 * comes on screen, takes the limits off once by itself; after that only the
 * switch changes it. The film plays muted while on screen and not paused
 * (WCAG 2.2.2); with reduced motion it rests on its poster.
 */
export function ByoConsole({ copy, film, meters, plans, mark, pause, play }) {
  const [on, setOn] = useState("free");
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(null); // null: not chosen yet
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => true);
  const stopped = paused ?? reduced;
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const touched = useRef(false);

  useEffect(() => {
    let timer;
    let first = true;
    const observer = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        // The first time it's well on screen, the limits come off.
        if (e.isIntersecting && first) {
          first = false;
          timer = setTimeout(() => !touched.current && setOn("byo"), 1100);
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (visible && !stopped) v.play().catch(() => {});
    else v.pause();
  }, [visible, stopped]);

  const choose = (id) => {
    touched.current = true;
    setOn(id);
  };
  const p = plans.find((x) => x.id === on) || plans[0];
  const [free, byo] = plans;

  return (
    <div ref={rootRef} className={styles.console} data-main="" data-on={on}>
      <div className={styles.top}>
        <p className={styles.agents}>
          <span className={styles.label}>
            <i aria-hidden="true" />
            {copy.label}
          </span>
          {copy.agents.map((a) => (
            <em key={a}>{a}</em>
          ))}
        </p>
        <p className={styles.readout}>
          {copy.minutes} <b>0</b>
        </p>
        <div className={styles.switch} role="group" aria-label={copy.switch}>
          {plans.map((x) => (
            <button key={x.id} type="button" aria-pressed={on === x.id} onClick={() => choose(x.id)}>
              {x.name}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        <figure className={styles.monitor}>
          <figcaption className={styles.small}>{copy.monitor}</figcaption>
          <div className={styles.screen}>
            <video ref={videoRef} src={film.src} poster={film.poster} muted loop playsInline preload="none" aria-hidden="true" />
            <span className={styles.tag} aria-hidden="true">
              <b>{p.name}</b>
              {p.size}
            </span>
            <span className={styles.mark} data-on={p.mark ? "" : undefined} aria-hidden="true">
              <i />
              {mark}
            </span>
            <button type="button" className={styles.pause} aria-label={stopped ? play : pause} title={stopped ? play : pause} onClick={() => setPaused(!stopped)}>
              {stopped ? (
                <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                  <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                  <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </figure>

        <div className={styles.meters}>
          <p className={styles.metersHead}>
            <span className={styles.small}>{copy.channels}</span>
            <span className={styles.legend}>
              <i aria-hidden="true" />
              {copy.limit}
            </span>
          </p>
          <div className={styles.channels} aria-hidden="true">
            {meters.map((m) => (
              <Meter key={m.id} m={m} on={on} />
            ))}
          </div>
          {/* The same values as a list, for assistive technology. */}
          <dl className={styles.hidden}>
            {meters.map((m) => (
              <div key={m.id}>
                <dt>{m.label}</dt>
                <dd>
                  {free.name}: {m.free.text}. {byo.name}: {m.byo.text}.
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className={styles.bottom} aria-live="polite">
        <div className={styles.price}>
          <p className={styles.planName}>{p.name}</p>
          <p className={styles.amount}>
            <b>{p.amount}</b>
            <span>{p.per}</span>
          </p>
          {p.billed.length ? (
            <p className={styles.billed}>
              {p.billed.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </p>
          ) : null}
        </div>
        {p.tagline ? <p className={styles.tagline}>{p.tagline}</p> : null}
        {p.cta ? (
          <a className={styles.ctaLink} data-solid={p.id === byo.id ? "" : undefined} href={p.cta.href}>
            {p.cta.label}
            <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
