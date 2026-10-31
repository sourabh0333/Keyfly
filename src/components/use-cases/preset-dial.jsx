"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "./preview";
import styles from "./use-cases.module.css";

const HOLD = 6000; // ms each preset stays up before the dial turns on
const TICKS = Array.from({ length: 90 }, (_, i) => i * 4);

const pad = (n) => String(n).padStart(2, "0");
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const easeOut = (t) => 1 - Math.pow(1 - t, 4);

// Phones turn the dial on its side: the notch sits at the top and the
// names stand upright, further apart.
const NARROW = "(max-width: 860px)";
function onNarrowChange(callback) {
  const query = matchMedia(NARROW);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The presets on a jog wheel, the dial editors spin to move through
 * footage. The six names sit around its rim and the one at the mint notch
 * plays in the viewer beside it, at its own format, with its prompt typing
 * in. Drag the wheel round, click a name, use the arrow keys or 1–6, or let
 * it turn on by itself every few seconds while on screen (hovering,
 * focusing or dragging holds it). With reduced motion it never turns by
 * itself and every move is instant.
 */
export function PresetDial({ items, cta, dialLabel, promptLabel }) {
  const narrow = useSyncExternalStore(onNarrowChange, () => matchMedia(NARROW).matches, () => false);
  const [pos, setPos] = useState(0);
  const [cuts, setCuts] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef(null);
  const dialRef = useRef(null);
  const typedRef = useRef(null);
  const posRef = useRef(0);
  const tweenRef = useRef(0);
  const dragRef = useRef(null);

  const base = narrow ? -90 : 0;
  const step = narrow ? 46 : 24;
  const last = items.length - 1;
  const active = clamp(Math.round(pos), 0, last);
  const item = items[active];
  const auto = visible && !held && !dragging && !reduced;

  function place(next) {
    posRef.current = next;
    setPos(next);
  }

  function go(target) {
    cancelAnimationFrame(tweenRef.current);
    const from = posRef.current;
    if (reduced || from === target) {
      place(target);
      return;
    }
    const start = performance.now();
    const duration = 650 + Math.abs(target - from) * 90;
    tweenRef.current = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      place(from + (target - from) * easeOut(t));
      if (t < 1) tweenRef.current = requestAnimationFrame(tick);
    });
  }

  function choose(index) {
    go(index);
    setCuts((n) => n + 1);
  }

  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(tweenRef.current);
    };
  }, []);

  // Turn on to the next preset (and back round to the first).
  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => {
      go((active + 1) % items.length);
      setCuts((n) => n + 1);
    }, HOLD);
    return () => clearTimeout(timer);
    // go() reads only refs and stable values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, active, cuts, items.length]);

  // The prompt types itself in for each preset.
  useEffect(() => {
    const el = typedRef.current;
    const text = item.prompt;
    if (reduced) {
      el.textContent = text;
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function type(now) {
      const n = Math.min(text.length, Math.round(((now - start) / 1200) * text.length));
      el.textContent = text.slice(0, n);
      if (n < text.length) frame = requestAnimationFrame(type);
    });
    return () => cancelAnimationFrame(frame);
  }, [item.prompt, reduced]);

  // The page's light takes its colours from the preset up (see SceneLight).
  useEffect(() => {
    document.documentElement.dataset.feed = item.kind;
  }, [item.kind]);

  useEffect(() => () => delete document.documentElement.dataset.feed, []);

  // Dragging the wheel round.
  function angleOf(event) {
    const r = dialRef.current.getBoundingClientRect();
    return (Math.atan2(event.clientY - (r.top + r.height / 2), event.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    cancelAnimationFrame(tweenRef.current);
    dragRef.current = { start: posRef.current, angle: angleOf(event), turned: 0, moved: false };
  }

  function onPointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;
    const angle = angleOf(event);
    let delta = angle - drag.angle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    drag.angle = angle;
    drag.turned += delta;
    // Only a real turn takes the pointer, so a plain click still reaches
    // the name under it.
    if (!drag.moved && Math.abs(drag.turned) > 4) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    if (drag.moved) place(clamp(drag.start - drag.turned / step, -0.35, last + 0.35));
  }

  function onPointerUp() {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    setDragging(false);
    choose(clamp(Math.round(posRef.current), 0, last));
  }

  function onKeyDown(event) {
    const n = Number(event.key);
    let next = null;
    if (n >= 1 && n <= items.length) next = n - 1;
    else if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(last, active + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, active - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null || event.target.matches("input, textarea")) return;
    event.preventDefault();
    choose(next);
  }

  const turn = base - pos * step;
  const tryIt = () => window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { label: item.label } }));

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-format={item.format}
      data-paused={visible ? undefined : ""}
      data-auto={auto ? "" : undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
      onKeyDown={onKeyDown}
    >
      <div className={styles.dialWrap}>
        <div
          ref={dialRef}
          className={styles.dial}
          role="slider"
          tabIndex={0}
          aria-label={dialLabel}
          aria-valuemin={1}
          aria-valuemax={items.length}
          aria-valuenow={active + 1}
          aria-valuetext={item.label}
          data-dragging={dragging ? "" : undefined}
          style={{ "--turn": `${turn}deg`, "--base": `${base}deg` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <svg className={styles.wheel} viewBox="-100 -100 200 200" aria-hidden="true">
            <defs>
              <radialGradient id="dial-face" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0.3" stopColor="#141518" />
                <stop offset="0.92" stopColor="#0d0e10" />
                <stop offset="1" stopColor="#1a1b1f" />
              </radialGradient>
            </defs>
            <circle r="99" className={styles.face} fill="url(#dial-face)" />
            <g className={styles.ticks}>
              {TICKS.map((a) => (
                <line key={a} x1="91" x2={a % 24 === 0 ? 85 : 95} transform={`rotate(${a})`} className={a % 24 === 0 ? styles.major : undefined} />
              ))}
            </g>
            <circle r="80" className={styles.groove} />
            <circle r="34" className={styles.hubRing} />
            <circle key={cuts} r="34" pathLength="1" className={styles.countdown} />
          </svg>

          {/* The knurled inner ring, which turns with the wheel. */}
          <span className={styles.knurl} aria-hidden="true" />

          {items.map((it, i) => {
            const offset = (i - pos) * step;
            const near = Math.abs(i - pos);
            return (
              <button
                key={it.label}
                type="button"
                tabIndex={-1}
                className={styles.name}
                data-on={i === active ? "" : undefined}
                style={{ "--a": `${base + offset}deg`, opacity: clamp(1 - near * 0.36, 0, 1), pointerEvents: near > 2.2 ? "none" : undefined }}
                onClick={() => choose(i)}
              >
                <span className={styles.nameIndex}>{pad(i + 1)}</span>
                {it.label}
              </button>
            );
          })}

          <div className={styles.hub} aria-hidden="true">
            <span className={styles.hubIndex}>
              {pad(active + 1)}
              <span>/{pad(items.length)}</span>
            </span>
            <span className={styles.hubFormat}>{item.format}</span>
          </div>

          <span className={styles.notch} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.output}>
        <div className={styles.viewer} aria-hidden="true">
          <div className={styles.frame}>
            {items.map((it, i) => (
              <div key={it.label} className={styles.feed} data-on={i === active ? "" : undefined} data-paused={i === active ? undefined : ""}>
                <Preview kind={it.kind} format={it.format} bleed />
              </div>
            ))}
            <span key={active} className={styles.flash} />
          </div>
        </div>

        <div key={active} className={styles.caption} aria-live="polite">
          <h3 className={styles.caseTitle}>{item.label}</h3>
          <p className={styles.caseBody}>{item.body}</p>
        </div>

        <div className={styles.promptRow}>
          <p className={styles.prompt} aria-label={`${promptLabel}: ${item.prompt}`}>
            <span className={styles.promptLabel} aria-hidden="true">
              {promptLabel}
            </span>
            <span aria-hidden="true">
              <span ref={typedRef} />
              <span className={styles.caret} />
            </span>
          </p>
          <button type="button" className={styles.try} onClick={tryIt}>
            {cta}
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}
