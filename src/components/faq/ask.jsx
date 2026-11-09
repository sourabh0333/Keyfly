"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./faq.module.css";

const CHAR = 14; // ms per character as the answer types in

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * The FAQ as a conversation with KeyFly: the questions as a numbered list
 * on the left, and on the right a panel styled like the app's prompt box,
 * where the chosen question is "sent" and its answer types in beneath it
 * with a mint caret. The first answer types when the panel first comes on
 * screen. Nothing changes by itself after that.
 *
 * Every question and answer is also in the page as a definition list for
 * screen readers and search; the panel is decorative (aria-hidden), and
 * the list's buttons point at it. Reduced motion: answers appear whole.
 */
export function Ask({ panel, listLabel, next, items }) {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState(0); // characters shown
  const [started, setStarted] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const panelRef = useRef(null);

  const item = items[active];
  const full = item.a.length;
  const shown = reduced || !started ? full : typed;
  const typing = shown < full;

  // Start typing the first answer once the panel is on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setStarted(true);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduced || typed >= full) return;
    const timer = setTimeout(() => setTyped((t) => Math.min(full, t + 2)), CHAR * 2);
    return () => clearTimeout(timer);
  }, [started, reduced, typed, full]);

  function ask(i) {
    setActive(i);
    setTyped(0);
    setStarted(true);
    // On narrow screens the panel sits above the list: bring it into view.
    const box = panelRef.current.getBoundingClientRect();
    if (box.top < 0 || box.bottom > innerHeight) panelRef.current.scrollIntoView({ block: "nearest", behavior: reduced ? "instant" : "smooth" });
  }

  return (
    <div className={styles.ask} data-main="">
      <ol className={styles.list} aria-label={listLabel}>
        {items.map((it, i) => (
          <li key={it.q}>
            <button type="button" className={styles.question} aria-pressed={i === active} onClick={() => ask(i)}>
              <span className={styles.index}>{pad(i + 1)}</span>
              <span className={styles.qText}>{it.q}</span>
              <svg className={styles.arrow} viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </li>
        ))}
      </ol>

      <div ref={panelRef} className={styles.panel} aria-hidden="true">
        <p className={styles.panelHead}>
          <span className={styles.panelName}>
            <i />
            {panel}
          </span>
          <span className={styles.count}>
            {pad(active + 1)} / {pad(items.length)}
          </span>
        </p>

        <p key={`q${active}`} className={styles.sent}>
          <span className={styles.chevron}>›</span>
          {item.q}
        </p>

        <p className={styles.answer} data-typing={typing ? "" : undefined}>
          {item.a.slice(0, shown)}
          <span className={styles.caret} />
          <span className={styles.ghost}>{item.a.slice(shown)}</span>
        </p>

        <div className={styles.panelFoot}>
          {item.link ? (
            <a className={styles.link} href={item.link.href} tabIndex={-1} data-ready={typing ? undefined : ""}>
              {item.link.label}
              {/* Down to a section on this page; right to another page of the
                  site; out to anything else. */}
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path d={item.link.href.startsWith("#") ? "M8 3v9M4.5 8.5 8 12l3.5-3.5" : item.link.href.startsWith("/") ? "M3 8h9M8.5 4.5 12 8l-3.5 3.5" : "M4 12 12 4M5.5 4H12v6.5"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <span />
          )}
          <button type="button" className={styles.next} tabIndex={-1} onClick={() => ask((active + 1) % items.length)}>
            {next}
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <dl className={styles.srOnly}>
        {items.map((it) => (
          <div key={it.q}>
            <dt>{it.q}</dt>
            <dd>{it.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
