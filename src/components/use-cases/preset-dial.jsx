"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "./preview";
import styles from "./use-cases.module.css";

const TICKS = Array.from({ length: 90 }, (_, i) => i * 4);

const pad = (n) => String(n).padStart(2, "0");
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const easeOut = (t) => 1 - Math.pow(1 - t, 4);
const smooth = (t) => t * t * (3 - 2 * t);

// Scroll → wheel: each preset holds for the middle half of its stretch of
// scroll and the wheel turns between them, like the detents of a jog wheel.
function detent(x) {
  const i = Math.floor(x);
  return i + smooth(clamp((x - i - 0.25) / 0.5, 0, 1));
}

// Wheel → scroll, for drags and clicks: the inverse of detent().
function undetent(pos) {
  const i = Math.floor(pos);
  const t = pos - i;
  return t === 0 ? i : i + 0.25 + 0.5 * t;
}

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
 * in.
 *
 * Scrolling turns the wheel: the stage pins (data-live on the track) and
 * the wheel turns one preset per stretch of scroll, resting on each.
 * Dragging the wheel, clicking a name, the arrow keys and 1–6 scroll the
 * page to match. Where the stage doesn't fit the screen, or with reduced
 * motion, nothing pins and the wheel turns by drag, click and keys alone.
 */
export function PresetDial({ items, cta, dialLabel, promptLabel, hint }) {
  const narrow = useSyncExternalStore(onNarrowChange, () => matchMedia(NARROW).matches, () => false);
  const [pos, setPos] = useState(0);
  const [live, setLive] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const dialRef = useRef(null);
  const typedRef = useRef(null);
  const posRef = useRef(0);
  const tweenRef = useRef(0);
  const dragRef = useRef(null);
  const reducedRef = useRef(false);

  const base = narrow ? -90 : 0;
  const step = narrow ? 46 : 24;
  const last = items.length - 1;
  const active = clamp(Math.round(pos), 0, last);
  const item = items[active];

  function place(next) {
    posRef.current = next;
    setPos(next);
  }

  // Where the page must be scrolled for the wheel to read `p`.
  function scrollFor(p) {
    const track = trackRef.current;
    const top = track.getBoundingClientRect().top + scrollY;
    return top + (undetent(p) / last) * (track.offsetHeight - innerHeight);
  }

  function go(target) {
    if (live) {
      scrollTo({ top: scrollFor(target), behavior: reducedRef.current ? "instant" : "smooth" });
      return;
    }
    cancelAnimationFrame(tweenRef.current);
    const from = posRef.current;
    if (reducedRef.current || from === target) {
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

  // Pin only where the stage fits the screen and motion is welcome.
  useEffect(() => {
    reducedRef.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const check = () => {
      frame = 0;
      const content = stageRef.current.firstElementChild.offsetHeight;
      setLive(!reducedRef.current && content + 96 <= innerHeight);
    };
    const schedule = () => (frame ||= requestAnimationFrame(check));
    // Re-check whenever the stage's own size settles or changes, and on
    // resize (the screen's height is the other half of the test).
    const observer = new ResizeObserver(schedule);
    observer.observe(stageRef.current.firstElementChild);
    addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(tweenRef.current);
      removeEventListener("resize", schedule);
    };
  }, []);

  // While pinned, the scroll turns the wheel.
  useEffect(() => {
    if (!live) return;
    let frame = 0;
    function update() {
      frame = 0;
      const track = trackRef.current;
      const r = track.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
      place(detent(p * last));
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [live, last]);

  // The prompt types itself in for each preset.
  useEffect(() => {
    const el = typedRef.current;
    const text = item.prompt;
    if (reducedRef.current) {
      el.textContent = text;
      return;
    }
    const start = performance.now();
    let frame = requestAnimationFrame(function type(now) {
      const n = Math.min(text.length, Math.round(((now - start) / 1000) * text.length));
      el.textContent = text.slice(0, n);
      if (n < text.length) frame = requestAnimationFrame(type);
    });
    return () => cancelAnimationFrame(frame);
  }, [item.prompt]);

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
    if (!drag.moved) return;
    const next = clamp(drag.start - drag.turned / step, 0, last);
    if (live) scrollTo({ top: scrollFor(next), behavior: "instant" });
    else place(next);
  }

  function onPointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag?.moved) return;
    setDragging(false);
    go(clamp(Math.round(posRef.current), 0, last));
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
    go(next);
  }

  const turn = base - pos * step;
  const tryIt = () => window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { label: item.label } }));

  return (
    <div
      ref={trackRef}
      className={styles.track}
      data-live={live ? "" : undefined}
      style={{ "--count": items.length }}
    >
      <div ref={stageRef} className={styles.pin}>
        <div className={styles.stage} data-format={item.format} onKeyDown={onKeyDown}>
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
                {/* How far through the six the wheel has turned. */}
                <circle r="34" pathLength="1" className={styles.progress} style={{ strokeDashoffset: 1 - pos / last }} />
              </svg>

              {/* The knurled inner ring, which turns with the wheel. */}
              <span className={styles.knurl} aria-hidden="true" />

              {items.map((it, i) => {
                const near = Math.abs(i - pos);
                return (
                  <button
                    key={it.label}
                    type="button"
                    tabIndex={-1}
                    className={styles.name}
                    data-on={i === active ? "" : undefined}
                    style={{ "--a": `${base + (i - pos) * step}deg`, opacity: clamp(1 - near * 0.36, 0, 1), pointerEvents: near > 2.2 ? "none" : undefined }}
                    onClick={() => go(i)}
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
            <p className={styles.hint} aria-hidden="true">
              <span data-when="live">{hint.live}</span>
              <span data-when="still">{hint.still}</span>
            </p>
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
      </div>
    </div>
  );
}
