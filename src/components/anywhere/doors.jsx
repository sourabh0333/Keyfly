"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./anywhere.module.css";

const STEP = 3600; // ms each surface stays in use while it runs by itself

const pad = (n) => String(n).padStart(2, "0");

// Which way a pulse runs on each wire: "in" is from the surface to the
// project. The chat wire runs left to right into the hub, the browser
// wire right to left, the desktop wire top to bottom.
const WIRES = {
  chat: { axis: "x", in: "fwd", out: "back" },
  browser: { axis: "x", in: "back", out: "fwd" },
  desktop: { axis: "y", in: "fwd", out: "back" },
};

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Chat({ s }) {
  return (
    <div className={styles.chat}>
      <p className={styles.bar}>
        <span className={styles.bubbleIcon} />
        {s.where}
      </p>
      <div className={styles.thread}>
        <p className={styles.ask}>{s.ask}</p>
        <p className={styles.reply}>{s.reply}</p>
        <div className={styles.appCard}>
          <span className={styles.appThumb}>
            <Preview kind="launch" format="16:9" bleed />
          </span>
          <span className={styles.appText}>
            <b>KeyFly</b>
            <span>Launch Video · 0:30</span>
          </span>
          <span className={styles.appButton}>{s.card}</span>
        </div>
      </div>
    </div>
  );
}

function Browser({ s }) {
  return (
    <div className={styles.browser}>
      <p className={styles.bar}>
        <span className={styles.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.address}>
          <svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true">
            <path d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5M2.5 5.5h7v5h-7z" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          {s.where}
        </span>
      </p>
      <div className={styles.viewer}>
        <Preview kind="launch" format="16:9" bleed />
        <span className={styles.subs}>Built for launch day</span>
      </div>
      <p className={styles.status}>
        <i />
        {s.action}
      </p>
    </div>
  );
}

function Desktop({ s }) {
  return (
    <div className={styles.desktop}>
      <p className={styles.bar}>
        <span className={styles.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.appName}>KeyFly</span>
      </p>
      <div className={styles.desk}>
        <span className={styles.side}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.viewer}>
          <Preview kind="launch" format="16:9" bleed />
        </span>
      </div>
      <p className={styles.status}>
        <span className={styles.export}>
          <i />
        </span>
        {s.action}
      </p>
    </div>
  );
}

const SURFACE = { chat: Chat, browser: Browser, desktop: Desktop };

/**
 * One project, three doors: the KeyFly project in the middle, the chat
 * (ChatGPT · Claude) to its left, the browser to its right and the desktop
 * app above, joined by straight wires. The surface in use sends a pulse
 * into the project, the project updates (its last change and version) and
 * sends pulses out to the other two. The surfaces are picked from the list
 * top left; the history top right. It moves from surface to surface by
 * itself while on screen and not held, until one is picked. Reduced
 * motion: no pulses and no self-running.
 */
export function Doors({ openIn, history, project, surfaces }) {
  const n = surfaces.length;
  const [active, setActive] = useState(0);
  const [round, setRound] = useState(0); // restarts the pulses
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !held && !touched && !reduced;
  const current = surfaces[active];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => {
      setActive((a) => (a + 1) % n);
      setRound((r) => r + 1);
    }, STEP);
    return () => clearTimeout(timer);
  }, [auto, active, n]);

  function pick(i) {
    setTouched(true);
    setActive(i);
    setRound((r) => r + 1);
  }

  return (
    <div
      ref={rootRef}
      className={styles.doors}
      data-main=""
      data-active={current.id}
      data-auto={auto ? "" : undefined}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.tabs}>
        <p className={styles.kicker}>{openIn}</p>
        <div role="group" aria-label={openIn} className={styles.tabList}>
          {surfaces.map((s, i) => (
            <button key={s.id} type="button" className={styles.tab} aria-pressed={i === active} onClick={() => pick(i)}>
              <span className={styles.tabIndex}>{pad(i + 1)}</span>
              <span className={styles.tabName}>{s.name}</span>
              <span className={styles.tabWhere}>{s.where}</span>
              <i key={i === active ? `on${round}` : "off"} className={styles.tabFill} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.log}>
        <p className={styles.kicker}>{history}</p>
        <ol className={styles.logList}>
          {surfaces
            .map((s, i) => ({ s, i }))
            .reverse()
            .map(({ s, i }) => (
              <li key={s.id} data-now={i === active ? "" : undefined} data-done={i < active ? "" : undefined}>
                <span>v{i + 1}</span>
                {s.log}
              </li>
            ))}
        </ol>
      </div>

      {surfaces.map((s) => {
        const Surface = SURFACE[s.id];
        return (
          <figure key={s.id} className={styles.surface} data-id={s.id} data-on={s.id === current.id ? "" : undefined} aria-hidden="true">
            <Surface s={s} />
            <figcaption className={styles.caption}>
              {s.name}
              <span>{s.where}</span>
            </figcaption>
          </figure>
        );
      })}

      <div className={styles.hub} aria-live="polite">
        <p className={styles.caption}>
          {project.label}
          <span className={styles.synced}>
            <i />
            {project.synced}
          </span>
        </p>
        <div className={styles.projectWrap}>
          {Object.entries(WIRES).map(([id, w]) => (
            <span key={`${id}-${round}`} className={styles.wire} data-wire={id} data-axis={w.axis} aria-hidden="true">
              {reduced ? null : <i data-run={id === current.id ? w.in : w.out} data-phase={id === current.id ? "in" : "out"} />}
            </span>
          ))}
          <div key={round} className={styles.project} data-flash={reduced ? undefined : ""}>
            <span className={styles.projectThumb} aria-hidden="true">
              <Preview kind="launch" format="16:9" bleed />
            </span>
            <p className={styles.projectName}>
              {project.name}
              <span>{project.meta}</span>
            </p>
            <p className={styles.projectLast}>
              <span>v{active + 1}</span>
              {current.log}
            </p>
            <span className={styles.projectStrip} aria-hidden="true">
              {[18, 12, 22, 9, 16, 14, 9].map((w, i) => (
                <i key={i} style={{ flexGrow: w }} />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
