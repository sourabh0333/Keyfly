"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./audience.module.css";

const HOLD = 5000; // ms each role stays open while it runs by itself

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * Keyfly by role, as expanding panels: four tall panels side by side, each
 * filled with what its role makes. The open one is wide and shows the
 * role, its line, what it makes and its prompt to try (sent to the hero's
 * prompt box); the others are slim strips with the role's name written up
 * the side. Hovering (mouse) or clicking a panel opens it; it also moves on
 * by itself while on screen and not held, until one is clicked. On phones
 * the panels stack, the open one tall. Reduced motion: no self-running,
 * and panels open without easing.
 */
export function Roles({ roles, makes, formatsLabel, promptLabel, try: tryLabel }) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !held && !touched && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % roles.length), HOLD);
    return () => clearTimeout(timer);
  }, [auto, active, roles.length]);

  function send(role) {
    window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { text: role.prompt } }));
  }

  return (
    <div
      ref={rootRef}
      className={styles.panels}
      data-main=""
      data-auto={auto ? "" : undefined}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      {roles.map((role, i) => {
        const on = i === active;
        return (
          <div
            key={role.id}
            className={styles.panel}
            data-on={on ? "" : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType !== "mouse") return;
              setHeld(true);
              setActive(i);
            }}
            onClick={() => {
              setActive(i);
              setTouched(true);
            }}
          >
            <span className={styles.media} aria-hidden="true" data-paused={on ? undefined : ""}>
              <Preview kind={role.kind} format={role.format} bleed />
            </span>
            <span className={styles.shade} aria-hidden="true" />

            {/* Closed: the name up the side. */}
            <span className={styles.strip} aria-hidden="true">
              <span className={styles.stripIndex}>{pad(i + 1)}</span>
              <span className={styles.stripName}>{role.name}</span>
            </span>

            {/* Open: the role in full. */}
            <div className={styles.body} inert={on ? undefined : true}>
              <h3 className={styles.name}>
                <button type="button" className={styles.nameButton} aria-expanded={on} onClick={() => setActive(i)} onFocus={() => setActive(i)}>
                  <span className={styles.index}>{pad(i + 1)}</span>
                  {role.name}
                </button>
              </h3>
              <p className={styles.line}>{role.line}</p>
              <div className={styles.meta}>
                <span className={styles.metaLabel}>{makes}</span>
                {role.presets.map((p) => (
                  <span key={p} className={styles.chip}>
                    {p}
                  </span>
                ))}
                <span className={styles.metaLabel}>{formatsLabel}</span>
                <span className={styles.mono}>{role.formats.join(" · ")}</span>
              </div>
              <div className={styles.try}>
                <p className={styles.prompt}>
                  <span>{promptLabel}</span>“{role.prompt}”
                </p>
                <button
                  type="button"
                  className={styles.tryButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    send(role);
                  }}
                >
                  {tryLabel}
                  <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                    <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <i key={on ? `on${active}` : "off"} className={styles.fill} aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}
