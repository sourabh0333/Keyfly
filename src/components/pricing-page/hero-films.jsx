"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./pricing-hero.module.css";

const MOTION = "(prefers-reduced-motion: reduce)";
const WIDE = "(min-width: 1241px)";
function subscribe(query) {
  return (callback) => {
    const list = matchMedia(query);
    list.addEventListener("change", callback);
    return () => list.removeEventListener("change", callback);
  };
}
const onMotion = subscribe(MOTION);
const onWide = subscribe(WIDE);

const SLOTS = 6; // 0–2 the left bars, outer to inner; 3–5 the right bars
const ORDER = [2, 5, 1, 4, 0, 3]; // the cuts ripple out from the heading
const EVERY = 2600; // ms between cuts
const CUT = 800; // ms a cut's wipe lasts

/**
 * The films either side of the hero's heading (each side a column of its
 * own, so they never touch the text): three bars a side as a waveform,
 * centred on the heading's middle and rising towards it, mirrored, so the
 * heading is the peak. The bars draw out from the centre line on load.
 * Every 2.6s one bar cuts to the film that has waited longest (a mint
 * playhead wipes it in, towards the heading), rippling out from the
 * heading, so no film is ever on screen twice. Each bar is a viewfinder:
 * mint corner brackets that focus in and a scrub line that follows its
 * film. The films play muted, and cut, only while on screen and only where
 * shown (wide screens); a small button beneath the right side pauses them
 * (WCAG 2.2.2). Reduced motion: still posters, no cuts. Renders the two
 * sides as siblings, placed in the hero's grid by `data-side`.
 */
export function HeroFilms({ films, pauseLabel, playLabel }) {
  const [layers, setLayers] = useState(() => Array.from({ length: SLOTS }, (_, i) => [i]));
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => true);
  const wide = useSyncExternalStore(onWide, () => matchMedia(WIDE).matches, () => false);
  const playing = visible && wide && !reduced && !paused;

  const sides = useRef([]);
  const cells = useRef([]);
  const playingRef = useRef(false);
  const current = useRef(Array.from({ length: SLOTS }, (_, i) => i));
  const queue = useRef(films.map((_, i) => i).slice(SLOTS));
  const step = useRef(0);

  // On screen if either side is.
  useEffect(() => {
    const seen = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting);
        setVisible([...seen.values()].some(Boolean));
      },
      { threshold: 0.1 },
    );
    for (const el of sides.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play or pause every film; the scrub lines follow them while playing.
  useEffect(() => {
    playingRef.current = playing;
    const videos = sides.current.flatMap((el) => (el ? [...el.querySelectorAll("video")] : []));
    for (const v of videos) {
      if (playing) v.play().catch(() => {});
      else v.pause();
    }
    if (!playing) return;
    let id;
    const tick = () => {
      for (const cell of cells.current) {
        const all = cell?.querySelectorAll("video");
        const v = all?.[all.length - 1];
        if (v?.duration) cell.style.setProperty("--p", (v.currentTime / v.duration).toFixed(4));
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  // The cuts: one bar at a time takes the film that has waited longest.
  useEffect(() => {
    if (!playing || films.length <= SLOTS) return;
    const now = current.current; // the films each bar shows (changed in place)
    const timers = [];
    const id = setInterval(() => {
      const k = ORDER[step.current++ % SLOTS];
      const out = now[k];
      const next = queue.current.shift();
      queue.current.push(out);
      now[k] = next;
      setLayers((all) => all.map((l, i) => (i === k ? [out, next] : l)));
      timers.push(setTimeout(() => setLayers((all) => all.map((l, i) => (i === k ? [next] : l))), CUT + 60));
    }, EVERY);
    return () => {
      clearInterval(id);
      for (const t of timers) clearTimeout(t);
      // Settle any cut in flight.
      setLayers(now.map((f) => [f]));
    };
  }, [playing, films.length]);

  // A film that arrives while playing starts at once.
  const attach = useCallback((el) => {
    if (el && playingRef.current) el.play().catch(() => {});
  }, []);

  const side = (name, from) => (
    <div key={name} ref={(el) => (sides.current[from ? 1 : 0] = el)} className={styles.frames} data-side={name}>
      <div className={styles.wall} aria-hidden="true">
        {[0, 1, 2].map((j) => {
          const k = from + j;
          return (
            <div key={k} ref={(el) => (cells.current[k] = el)} className={styles.cell} style={{ "--i": j }}>
              {layers[k].map((f, n) => (
                <div key={films[f].src} className={styles.layer} data-in={n > 0 ? "" : undefined}>
                  <video ref={attach} src={films[f].src} poster={films[f].poster} style={{ objectPosition: films[f].at }} muted loop playsInline preload="none" />
                </div>
              ))}
              <span className={styles.corners}>
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className={styles.scrub} />
            </div>
          );
        })}
      </div>
      {name === "right" && !reduced && films.length > SLOTS ? (
        <button type="button" className={styles.filmsPause} aria-label={paused ? playLabel : pauseLabel} title={paused ? playLabel : pauseLabel} onClick={() => setPaused((p) => !p)}>
          {paused ? (
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
              <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" fill="currentColor" />
            </svg>
          )}
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      {side("left", 0)}
      {side("right", 3)}
    </>
  );
}
