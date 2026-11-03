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
 * Keyfly by role: the roles as a numbered index of large type on the left,
 * the one open showing what it makes and in which formats; on the right, a
 * preview of what that role makes, and its prompt to try (sent to the
 * hero's prompt box). It moves on by itself while on screen and not held,
 * until a role is chosen (by click, so nothing shifts under the pointer).
 * Reduced motion: no self-running.
 */
export function Roles({ roles, makes, formatsLabel, promptLabel, try: tryLabel }) {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const role = roles[active];
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

  function choose(i) {
    setActive(i);
    setTouched(true);
  }

  function send() {
    window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { text: role.prompt } }));
  }

  return (
    <div
      ref={rootRef}
      className={styles.roles}
      data-auto={auto ? "" : undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <ol className={styles.index}>
        {roles.map((r, i) => {
          const on = i === active;
          return (
            <li key={r.id} className={styles.role} data-on={on ? "" : undefined}>
              <button type="button" className={styles.roleHead} aria-expanded={on} onClick={() => choose(i)}>
                <span className={styles.roleIndex}>{pad(i + 1)}</span>
                <span className={styles.roleName}>{r.name}</span>
                <svg className={styles.arrow} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                  <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className={styles.roleBody}>
                <div className={styles.roleInner}>
                  <p className={styles.roleLine}>{r.line}</p>
                  <dl className={styles.facts}>
                    <div>
                      <dt>{makes}</dt>
                      <dd>
                        {r.presets.map((p) => (
                          <span key={p} className={styles.chip}>
                            {p}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt>{formatsLabel}</dt>
                      <dd className={styles.mono}>{r.formats.join(" · ")}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <i key={on ? `on${active}` : "off"} className={styles.fill} aria-hidden="true" />
            </li>
          );
        })}
      </ol>

      <div className={styles.show}>
        <div className={styles.screen} aria-hidden="true">
          {roles.map((r, i) => (
            <span key={r.id} className={styles.shot} data-on={i === active ? "" : undefined} data-paused={i === active ? undefined : ""}>
              <Preview kind={r.kind} format={r.format} bleed />
            </span>
          ))}
          <span key={role.id} className={styles.tag}>
            <i />
            {role.presets[0]} · {role.format}
          </span>
        </div>
        <div className={styles.try}>
          <p key={role.id} className={styles.prompt}>
            <span>{promptLabel}</span>“{role.prompt}”
          </p>
          <button type="button" className={styles.tryButton} onClick={send}>
            {tryLabel}
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
