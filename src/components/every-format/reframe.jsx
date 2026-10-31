"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./every-format.module.css";

const HOLD = 2800; // ms per format when it plays by itself
const SUBJECT = 0.66; // where the subject (the sun) sits across the source
const WORDS = ["Your", "story,", "cut", "in", "seconds"];

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const smooth = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - Math.pow(1 - t, 4);
const pad = (n) => String(n).padStart(2, "0");

// Scroll → shape: each format holds for the middle half of its stretch of
// scroll and the frame morphs between them; undetent() is the inverse.
function detent(x) {
  const i = Math.floor(x);
  return i + smooth(clamp((x - i - 0.25) / 0.5, 0, 1));
}

function undetent(pos) {
  const i = Math.floor(pos);
  const t = pos - i;
  return t === 0 ? i : i + 0.25 + 0.5 * t;
}

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// A format's box on the canvas: as large as fits (90% wide, 80% tall).
function fit(format, canvas) {
  const r = format.w / format.h;
  const h = Math.min(canvas.h * 0.8, (canvas.w * 0.9) / r);
  return { w: h * r, h };
}

/**
 * Reframe: one frame on a design canvas that morphs between the formats
 * as the page scrolls (the stage pins; data-live), resting on each. Faint
 * outlines mark all four shapes, measurement lines along the frame count
 * its pixels as it changes, the cut inside stays centred on its subject
 * and the captions re-flow. The formats sit on a rail beside it; clicking
 * one scrolls there. Where the stage can't pin (it doesn't fit, or motion
 * is reduced) it moves on by itself, or waits for a click.
 */
export function Reframe({ file, panel, tracked, hint, formats }) {
  const [pos, setPos] = useState(0);
  const [live, setLive] = useState(false);
  const [canvas, setCanvas] = useState({ w: 0, h: 0 });
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const trackRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const posRef = useRef(0);
  const tweenRef = useRef(0);

  const last = formats.length - 1;
  const active = clamp(Math.round(pos), 0, last);

  function place(next) {
    posRef.current = next;
    setPos(next);
  }

  function go(target) {
    if (live) {
      const track = trackRef.current;
      const top = track.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + (undetent(target) / last) * (track.offsetHeight - innerHeight), behavior: "smooth" });
      return;
    }
    cancelAnimationFrame(tweenRef.current);
    const from = posRef.current;
    if (reduced) {
      place(target);
      return;
    }
    const start = performance.now();
    tweenRef.current = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / 900);
      place(from + (target - from) * easeOut(t));
      if (t < 1) tweenRef.current = requestAnimationFrame(tick);
    });
  }

  // The canvas's size, and whether the stage fits the screen to pin.
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const c = canvasRef.current.getBoundingClientRect();
      setCanvas({ w: c.width, h: c.height });
      setLive(!reduced && pinRef.current.firstElementChild.offsetHeight + 96 <= innerHeight);
    };
    const schedule = () => (frame ||= requestAnimationFrame(check));
    const observer = new ResizeObserver(schedule);
    observer.observe(pinRef.current.firstElementChild);
    observer.observe(canvasRef.current);
    addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(tweenRef.current);
      removeEventListener("resize", schedule);
    };
  }, [reduced]);

  // While pinned, the scroll morphs the frame.
  useEffect(() => {
    if (!live) return;
    let frame = 0;
    function update() {
      frame = 0;
      const r = trackRef.current.getBoundingClientRect();
      place(detent(clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1) * last));
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
    };
  }, [live, last]);

  // Otherwise it moves on by itself while on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (live || reduced || !visible) return;
    const timer = setTimeout(() => go((active + 1) % formats.length), HOLD);
    return () => clearTimeout(timer);
    // go() reads refs and stable values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, reduced, visible, active, formats.length]);

  // The frame between the two formats either side of pos.
  const i = Math.min(last - 1, Math.floor(pos));
  const t = clamp(pos - i, 0, 1);
  const a = fit(formats[i], canvas);
  const b = fit(formats[i + 1], canvas);
  const w = a.w + (b.w - a.w) * t;
  const h = a.h + (b.h - a.h) * t;
  const pw = Math.round(formats[i].px[0] + (formats[i + 1].px[0] - formats[i].px[0]) * t);
  const ph = Math.round(formats[i].px[1] + (formats[i + 1].px[1] - formats[i].px[1]) * t);
  // The 16:9 source inside, centred on the subject as far as the edges allow.
  const sw = (h * 16) / 9;
  const sx = clamp(w / 2 - sw * SUBJECT, w - sw, 0);
  const morphing = Math.abs(pos - Math.round(pos)) > 0.02;

  return (
    <div ref={trackRef} className={styles.track} data-live={live ? "" : undefined} style={{ "--count": formats.length }}>
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.stage} data-paused={visible ? undefined : ""}>
          <ol className={styles.list} style={{ "--p": (pos / last).toFixed(4) }}>
            <span className={styles.rail} aria-hidden="true">
              <span className={styles.railFill} />
            </span>
            {formats.map((f, k) => (
              <li key={f.id} className={styles.item} data-on={k === active ? "" : undefined}>
                <button type="button" className={styles.itemButton} aria-pressed={k === active} onClick={() => go(k)}>
                  <span className={styles.itemRatio}>{f.ratio}</span>
                  <span className={styles.itemText}>
                    <span className={styles.itemName}>
                      {pad(k + 1)} · {f.name}
                    </span>
                    <span className={styles.itemUse}>
                      {f.use} · {f.px[0]} × {f.px[1]}
                    </span>
                  </span>
                </button>
              </li>
            ))}
            <p className={styles.hint} aria-hidden="true">
              {live ? hint.live : hint.still}
            </p>
          </ol>

          <div className={styles.window}>
            <div className={styles.chrome} aria-hidden="true">
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.file}>
                {file}
                <span className={styles.fileMuted}> · {panel}</span>
              </span>
              <span className={styles.readout} data-morphing={morphing ? "" : undefined}>
                {morphing ? `${pw} × ${ph}` : formats[active].ratio}
              </span>
            </div>

            <div ref={canvasRef} className={styles.canvas} aria-hidden="true">
              {/* Faint outlines of every shape; the one in play lights. */}
              {formats.map((f, k) => {
                const g = fit(f, canvas);
                return <span key={f.id} className={styles.ghost} data-on={k === active ? "" : undefined} style={{ width: g.w, height: g.h }} />;
              })}

              <div className={styles.frame} style={{ width: w, height: h }}>
                <span className={styles.clip}>
                  <span className={styles.source} style={{ width: sw, left: sx }}>
                    <Preview kind="launch" format="16:9" bleed />
                  </span>
                  <span className={styles.subject} style={{ left: sx + sw * SUBJECT }}>
                    <i />
                  </span>
                  <span className={styles.captions} style={{ fontSize: clamp(Math.min(w * 0.065, h * 0.06), 9, 22) }}>
                    {WORDS.map((word) => (
                      <span key={word}>{word}</span>
                    ))}
                  </span>
                </span>
                {["tl", "tr", "bl", "br"].map((c) => (
                  <i key={c} className={styles.handle} data-c={c} />
                ))}
                <span className={styles.measureX}>
                  <b>{pw}</b>
                </span>
                <span className={styles.measureY}>
                  <b>{ph}</b>
                </span>
              </div>

              <span className={styles.tracked}>
                <i />
                {tracked}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
