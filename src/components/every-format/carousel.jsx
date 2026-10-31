"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./every-format.module.css";

const HOLD = 3200; // ms each format stays in front before the carousel turns
const TURN_MS = 850;
const WORDS = ["Your", "story,", "cut", "in", "seconds"];

const easeOut = (t) => 1 - Math.pow(1 - t, 4);
const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// The shortest signed distance from the carousel's position to frame i,
// around a ring of n.
function offset(i, pos, n) {
  let d = (((i - pos) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

/**
 * The formats on a curved 3D carousel: every frame is the same cut at its
 * own shape and one height; the one in front is large, lit and playing,
 * and the rest turn away to either side and fade. Its ratio, size and use
 * sit beneath. It turns by drag, by the arrows, by the keys, by clicking a
 * frame or a dot, and by itself while on screen and not held. With reduced
 * motion it never turns by itself and every turn is instant.
 */
export function Carousel({ formats, hint, prev, next, carousel }) {
  const n = formats.length;
  const [pos, setPos] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [dragging, setDragging] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const posRef = useRef(0);
  const tweenRef = useRef(0);
  const dragRef = useRef(null);

  const active = ((Math.round(pos) % n) + n) % n;
  const front = formats[active];
  const auto = visible && !held && !dragging && !reduced;

  function place(p) {
    posRef.current = p;
    setPos(p);
  }

  // Turn to a position (a whole number), easing from where it is.
  function turnTo(target) {
    cancelAnimationFrame(tweenRef.current);
    const from = posRef.current;
    if (reduced || from === target) {
      place(target);
      return;
    }
    const start = performance.now();
    tweenRef.current = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / TURN_MS);
      place(from + (target - from) * easeOut(t));
      if (t < 1) tweenRef.current = requestAnimationFrame(tick);
    });
  }

  const step = (dir) => turnTo(Math.round(posRef.current) + dir);
  const show = (i) => turnTo(Math.round(posRef.current) + offset(i, Math.round(posRef.current), n));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(tweenRef.current);
    };
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => step(1), HOLD);
    return () => clearTimeout(timer);
    // step() reads refs and stable values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, active]);

  // Dragging turns it; letting go settles on the nearest frame.
  function onPointerDown(event) {
    if (event.button !== 0) return;
    cancelAnimationFrame(tweenRef.current);
    dragRef.current = { x: event.clientX, start: posRef.current, moved: false, width: rootRef.current.offsetWidth };
  }

  function onPointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (drag.moved) place(drag.start - (dx / drag.width) * 2.2);
  }

  function onPointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    setDragging(false);
    turnTo(Math.round(posRef.current));
  }

  function onKeyDown(event) {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    event.preventDefault();
  }

  return (
    <div
      ref={rootRef}
      className={styles.carousel}
      data-dragging={dragging ? "" : undefined}
      data-auto={auto ? "" : undefined}
      data-paused={visible ? undefined : ""}
      role="group"
      aria-roledescription="carousel"
      aria-label={carousel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.ring} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <span className={styles.floor} aria-hidden="true" />
        {formats.map((f, i) => {
          const d = offset(i, pos, n);
          const near = Math.min(1, Math.abs(d));
          return (
            <button
              key={f.id}
              type="button"
              className={styles.slide}
              data-on={i === active ? "" : undefined}
              data-paused={Math.abs(d) < 0.5 ? undefined : ""}
              aria-label={`${f.ratio} ${f.name}`}
              aria-current={i === active ? "true" : undefined}
              tabIndex={-1}
              onClick={() => !dragging && i !== active && show(i)}
              style={{
                "--r": f.w / f.h,
                "--d": d.toFixed(4),
                "--dist": Math.abs(d).toFixed(4),
                zIndex: 10 - Math.round(Math.abs(d) * 2),
                opacity: Math.max(0, 1 - Math.max(0, Math.abs(d) - 1) * 1.2) * (1 - near * 0.45),
              }}
            >
              <span className={styles.screen} aria-hidden="true">
                <span className={styles.source}>
                  <Preview kind="launch" format="16:9" bleed />
                </span>
                <span className={styles.captions}>
                  {WORDS.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </span>
                <span className={styles.chip}>{f.ratio}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.caption} aria-live="polite">
        <button type="button" className={styles.arrow} aria-label={prev} onClick={() => step(-1)}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div key={front.id} className={styles.spec}>
          <p className={styles.specRatio}>{front.ratio}</p>
          <p className={styles.specName}>
            <span>{pad(active + 1)}</span> {front.name}
          </p>
          <p className={styles.specMeta}>
            {front.px[0]} × {front.px[1]} · {front.use}
          </p>
        </div>

        <button type="button" className={styles.arrow} aria-label={next} onClick={() => step(1)}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.dots}>
        {formats.map((f, i) => (
          <button key={f.id} type="button" className={styles.dot} aria-label={`${f.ratio} ${f.name}`} aria-pressed={i === active} onClick={() => show(i)}>
            <i key={i === active && !dragging ? `${active}-on` : i} />
          </button>
        ))}
      </div>
      <p className={styles.hint} aria-hidden="true">
        {hint}
      </p>
    </div>
  );
}
