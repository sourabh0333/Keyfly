"use client";

import { memo, useEffect, useRef, useState } from "react";
import styles from "./timeline-floor.module.css";

// A small seeded random, so the server and every visit draw the same floor.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Tracks from the horizon (top) to the front edge (bottom). The footage sits
// in front, where the floor is largest; the sound runs further back.
const TRACKS = [
  { kind: "title", seed: 3 },
  { kind: "audio", seed: 29 },
  { kind: "video", seed: 7 },
  { kind: "fx", seed: 13 },
  { kind: "audio", seed: 31 },
  { kind: "video", seed: 11 },
  { kind: "title", seed: 17 },
  { kind: "video", seed: 23 },
  { kind: "video", seed: 37 },
  { kind: "video", seed: 41 },
];

// One loop of each track, in percent of a loop's width. Every loop is drawn
// twice side by side, so sliding by one loop is seamless. Video clips carry
// footage; the mint "selected" look is kept for the other tracks.
function clipsFor({ kind, seed }) {
  const rand = seeded(seed);
  const clips = [];
  let at = rand() * 4;
  while (at < 96) {
    const min = kind === "title" || kind === "fx" ? 3 : 4;
    const width = Math.min(min + rand() * (kind === "audio" ? 14 : 8), 99 - at);
    if (width < 2) break;
    const lit = rand() > 0.78;
    clips.push({ at, width, lit: lit && kind !== "video", keys: kind === "video" && rand() > 0.4 });
    at += width + (kind === "title" || kind === "fx" ? 2 + rand() * 9 : 0.25 + rand() * 0.6);
  }
  return clips;
}

const CLIPS = TRACKS.map(clipsFor);
const VIDEO_ROW = TRACKS.map((track, t) => TRACKS.slice(0, t).filter((x) => x.kind === "video").length);

// A mirrored waveform as vertical bars in a 100 × 20 box.
function wave(seed) {
  const rand = seeded(seed);
  let d = "";
  for (let i = 0; i < 40; i++) {
    const h = 2 + rand() * 7.5;
    d += `M${(i * 2.5 + 1.25).toFixed(2)} ${(10 - h).toFixed(2)}V${(10 + h).toFixed(2)}`;
  }
  return d;
}

// The footage a video clip shows: neighbours always differ.
const filmFor = (films, t, i) => films[(VIDEO_ROW[t] * 3 + i) % films.length];

/** The film playing in a clip under the playhead; it fades in once it plays. */
function LiveFilm({ film, running }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (running) video.play().catch(() => {});
    else video.pause();
  }, [running]);

  return (
    <video
      ref={ref}
      className={styles.film}
      data-on={on ? "" : undefined}
      src={film.src}
      muted
      loop
      playsInline
      preload="auto"
      onPlaying={() => setOn(true)}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

const Loop = memo(function Loop({ track, t, copy, films, live, running }) {
  return (
    <div className={styles.loop}>
      {CLIPS[t].map((clip, i) => {
        const film = track.kind === "video" ? filmFor(films, t, i) : null;
        const isLive = live === `${copy}-${i}`;
        return (
          <span
            key={i}
            className={styles.clip}
            data-kind={track.kind}
            data-lit={clip.lit ? "" : undefined}
            data-playing={isLive ? "" : undefined}
            style={{ left: `${clip.at}%`, width: `${clip.width}%`, ...(film ? { "--still": `url(${film.poster})` } : null) }}
          >
            {track.kind === "audio" ? (
              <svg className={styles.wave} viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
                <path d={wave(track.seed + i)} />
              </svg>
            ) : null}
            {isLive ? <LiveFilm film={film} running={running} /> : null}
            {clip.keys ? (
              <>
                <i className={styles.key} style={{ left: 0 }} />
                <i className={styles.key} style={{ left: "100%" }} />
              </>
            ) : null}
          </span>
        );
      })}
    </div>
  );
});

/**
 * An editing timeline laid flat and running toward the horizon (it no
 * longer turns with the pointer): title,
 * video, effect and audio tracks slide under a fixed mint playhead, the way
 * footage moves past the playhead during playback. The video clips carry
 * real footage as stills; on the three front-most video tracks on screen
 * (two on phones) the clip under the playhead lights up and plays its
 * film, so at most three films play at once. The reel itself is CSS; a light tick reads
 * its animation's time to find the clip under the playhead. Only while on
 * screen and not paused (the hero's pause button sets
 * `data-floor-paused`); with reduced motion everything stands still and no
 * film plays.
 */
export function TimelineFloor({ films }) {
  const stage = useRef(null);
  const reel = useRef(null);
  const [live, setLive] = useState({});
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 720px)");
    let seen = false;
    let timer = 0;
    let wasRunning = true;
    let anim = null;
    let playing = [];
    let measure = 0;
    let current = {};

    // The front-most video tracks on screen play: three, two on phones.
    // (The hero is taller than the screen on laptops, so the front ones can
    // sit below the fold.) Measured only when the page scrolls or resizes:
    // measuring on every tick forced a style pass over the whole page.
    const findPlaying = () => {
      measure = 0;
      const rows = reel.current?.children;
      if (!rows) return;
      playing = TRACKS.map((track, t) => t)
        .filter((t) => {
          if (TRACKS[t].kind !== "video") return false;
          const r = rows[t + 1].getBoundingClientRect();
          return r.top + r.height / 2 < window.innerHeight - 8;
        })
        .slice(narrow.matches ? -2 : -3);
    };
    const remeasure = () => {
      if (!measure) measure = requestAnimationFrame(findPlaying);
    };

    const tick = () => {
      const paused = !!stage.current?.closest("[data-floor-paused]");
      const run = seen && !paused;
      if (run !== wasRunning) {
        wasRunning = run;
        setRunning(run);
      }
      if (!seen || paused || motion.matches) {
        if (motion.matches && Object.keys(current).length) {
          current = {};
          setLive(current);
        }
        return;
      }
      anim = anim || reel.current?.getAnimations()[0] || null;
      if (!anim) return;
      const duration = anim.effect.getComputedTiming().duration;
      const p = ((Number(anim.currentTime) || 0) % duration) / duration;
      // The playhead stands at the plane's middle; the reel has slid by p
      // of one loop, so it reads (0.5 + p) of a loop from the reel's start.
      const x = 0.5 + p;
      const copy = x >= 1 ? 1 : 0;
      const pos = (x % 1) * 100;

      // Only a change of clip renders: most ticks change nothing.
      const prev = current;
      const next = {};
      playing.forEach((t) => {
        // A clip starts a moment before it reaches the playhead.
        const i = CLIPS[t].findIndex((c) => pos >= c.at - 0.4 && pos <= c.at + c.width);
        next[t] = i < 0 ? prev[t] : `${copy}-${i}`;
      });
      const same = Object.keys(next).length === Object.keys(prev).length && Object.keys(next).every((k) => next[k] === prev[k]);
      if (!same) {
        current = next;
        setLive(next);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      tick();
    });
    // Start once the first screen has settled, so the films never compete
    // with the headline for the first load.
    const start = window.setTimeout(() => {
      findPlaying();
      observer.observe(stage.current);
      timer = window.setInterval(tick, 200);
    }, 1200);
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
      cancelAnimationFrame(measure);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={stage} className={styles.stage}>
      <div className={styles.plane}>
        {/* One reel holds the ruler and every track, twice over, and slides
            as a single layer. */}
        <div ref={reel} className={styles.reel}>
          <div className={styles.ruler} />
          {TRACKS.map((track, t) => (
            <div key={track.seed} className={styles.track} data-kind={track.kind}>
              <Loop track={track} t={t} copy={0} films={films} live={live[t]} running={running} />
              <Loop track={track} t={t} copy={1} films={films} live={live[t]} running={running} />
            </div>
          ))}
        </div>
        <div className={styles.playhead} />
      </div>
    </div>
  );
}
