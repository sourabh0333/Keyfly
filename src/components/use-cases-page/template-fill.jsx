"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./fill.module.css";

const STEP = 3600; // ms each step holds while the section plays
const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * One template taken to a finished video in four steps. On the left, the
 * frame: the template's own preview from the app (Pick), then the same
 * structure in the brand (Fill), its headline changed on request (Steer),
 * and the render (Export), with the cut's scenes beneath. On the right, the
 * panel for the step: the template card, what the AI director filled, the
 * ask and its reply, the export. What each step does stays (data-reached).
 * While on screen it moves on every 3.6s; choosing a step stops it, and
 * "Pause" holds it (WCAG 2.2.2). Reduced motion: no turning, the steps
 * still choose.
 */
export function TemplateFill({ pause, play, template, brand, steps, panel, chat, scenes }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  const auto = visible && !paused && !chosen && !reduced;
  const id = steps[step].id;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP);
    return () => clearTimeout(timer);
  }, [auto, step, steps.length]);

  // The template's preview plays while it's the step on screen.
  useEffect(() => {
    const video = videoRef.current;
    if (visible && id === "pick" && !reduced && !paused) video.play().catch(() => {});
    else video.pause();
  }, [visible, id, reduced, paused]);

  const reached = steps
    .slice(0, step + 1)
    .map((s) => s.id)
    .join(" ");

  return (
    <div ref={rootRef} className={styles.stage} data-step={id} data-reached={reached} data-auto={auto ? "" : undefined} data-main="">
      <div className={styles.work}>
        <div className={styles.frameCol}>
          <div className={styles.frame} aria-hidden="true">
            <video ref={videoRef} className={styles.clip} src={`${template.clip}.mp4`} poster={`${template.clip}.webp`} muted loop playsInline preload="none" />
            <div className={styles.branded}>
              <span className={styles.logo}>
                <i />
                {brand.name}
              </span>
              <p className={styles.headline}>{brand.headline}</p>
              <p className={styles.line}>{brand.line}</p>
              <span className={styles.bar} />
              <span className={styles.phone}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
            <span className={styles.frameTag}>
              {template.shape} · {template.seconds}s
            </span>
            <span className={styles.progress}>
              <i />
            </span>
          </div>
          <ol className={styles.scenes} aria-hidden="true">
            {Array.from({ length: scenes }, (_, n) => (
              <li key={n} style={{ "--n": n }}>
                <i />
                <span>{pad(n + 1)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.panel}>
          <div className={styles.pane} data-pane="pick" inert={id !== "pick"}>
            <p className={styles.paneLabel}>{panel.pick.label}</p>
            <p className={styles.tplName}>{template.name}</p>
            <p className={styles.tplMeta}>
              {template.type} · {template.look}
            </p>
            <p className={styles.tplChips}>
              <span>{template.shape}</span>
              <span>{template.seconds}s</span>
            </p>
            <span className={styles.useBtn}>{panel.pick.cta}</span>
            <p className={styles.paneFoot}>{panel.pick.meta}</p>
          </div>

          <div className={styles.pane} data-pane="fill" inert={id !== "fill"}>
            <p className={styles.paneLabel}>
              <i className={styles.dot} />
              {panel.fill.label}
            </p>
            <ul className={styles.rows}>
              {panel.fill.rows.map((row, i) => (
                <li key={row.key} style={{ "--i": i }}>
                  <span className={styles.ring}>
                    <Tick />
                  </span>
                  <em>{row.key}</em>
                  <b>{row.value}</b>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.pane} data-pane="steer" inert={id !== "steer"}>
            <p className={styles.paneLabel}>
              <i className={styles.dot} />
              {panel.fill.label}
            </p>
            <p className={styles.ask}>
              <span>›</span> {panel.steer.ask}
            </p>
            <p className={styles.reply}>{panel.steer.reply}</p>
            <p className={styles.actions}>
              <span>{panel.steer.revert}</span>
              <span>{panel.steer.retry}</span>
            </p>
          </div>

          <div className={styles.pane} data-pane="export" inert={id !== "export"}>
            <p className={styles.paneLabel}>Export</p>
            <p className={styles.file}>
              {panel.export.file}
              <span className={styles.ready}>
                <i />
                {panel.export.ready}
              </span>
            </p>
            <p className={styles.fileMeta}>{panel.export.meta}</p>
            <span className={styles.render}>
              <i />
            </span>
            <p className={styles.routes}>
              {panel.export.routes.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </p>
            <a className={styles.more} href={panel.export.more.href}>
              {panel.export.more.label} →
            </a>
          </div>

          <p className={styles.chat} aria-hidden="true">
            <span>{chat}</span>
            <i>
              <svg viewBox="0 0 16 16" width="12" height="12">
                <path d="M8 12.5v-9M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
          </p>
        </div>
      </div>

      <div className={styles.stepsRow}>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={styles.step}
                aria-pressed={i === step}
                data-done={i < step ? "" : undefined}
                onClick={() => {
                  setStep(i);
                  setChosen(true);
                }}
              >
                <em>{pad(i + 1)}</em>
                <b>{s.label}</b>
                <span className={styles.stepTitle}>{s.title}</span>
                <span className={styles.stepBody}>{s.body}</span>
                <i className={styles.fillLine} style={{ "--dur": `${STEP}ms` }} />
              </button>
            </li>
          ))}
        </ol>
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
