"use client";

import { useEffect, useRef } from "react";

const LOAD_MS = 1500; // the preloader's minimum run from 0 to 100%
const CLEAR_MS = 1250; // the point landing and the frame opening, before the words
const FPS = 24;
const SECONDS = 36; // the timecode's run across the whole hero

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (f) => f * f * (3 - 2 * f);
const pad = (n) => String(n).padStart(2, "0");

/**
 * Drives the hero, writing straight to the DOM (no re-renders):
 * - the preloader: the symbol's line draws and the timecode runs to one
 *   second as the first photo and the fonts load; at 100% (data-loaded) the
 *   point lands, the frame opens and the camera pushes in, then the first
 *   words arrive (data-ready);
 * - the scroll: it moves the timeline's playhead (--p). The viewer's camera
 *   dollies into each shot (scale) and cuts to the next where the playhead
 *   crosses a clip boundary; that shot's title swaps in and its clips light
 *   up (data-active);
 * - the timecode, which runs with the playhead.
 * Reduced motion: no preloader, no dolly; shots and words still change
 * with the scroll, as cuts.
 */
export function HeroShell({ className, shots, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frames = [...section.querySelectorAll("[data-frame]")];
    const chapters = [...section.querySelectorAll("[data-chapter]")];
    const clips = [...section.querySelectorAll("[data-clip]")];
    const timecode = section.querySelector("[data-timecode]");
    const loadTime = section.querySelector("[data-load-time]");
    const loadLine = section.querySelector("[data-load-line]");
    const firstPhoto = frames[0]?.querySelector("img");
    section.dataset.js = "true";
    // The header stays hidden while the preloader runs (header.module.css).
    section.dataset.intro = "loading";

    let ready = false;
    let active = -1;
    let frame = 0;
    let timers = [];

    const setActive = (index) => {
      if (index === active) return;
      active = index;
      chapters.forEach((chapter, i) => {
        chapter.dataset.active = String(ready && i === index);
      });
      clips.forEach((clip) => {
        clip.dataset.active = String(Number(clip.dataset.clip) === index);
      });
    };

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      // The last screen is covered by the next section rising over it, so
      // the shots play out before then.
      const span = Math.max(1, rect.height - 2 * window.innerHeight);
      const p = clamp(-rect.top / span);
      const u = p * shots; // position in shots: 0 … shots
      section.style.setProperty("--p", p.toFixed(4)); // the playhead

      frames.forEach((el, i) => {
        // A quick cut (a few frames' dissolve) right at the clip boundary.
        const opacity = i === 0 ? 1 : smooth(clamp((u - (i - 0.03)) / 0.06));
        const scale = reduced ? 1 : 1.02 + 0.14 * clamp(u - i + 0.1, 0, 1.2);
        el.style.opacity = String(opacity);
        el.style.transform = `scale(${scale.toFixed(4)})`;
      });

      // The shot under the playhead.
      const index = Math.min(shots - 1, Math.floor(u));
      if (ready) setActive(index);

      const total = Math.round(p * SECONDS * FPS);
      const ff = total % FPS;
      const ss = Math.floor(total / FPS);
      timecode.textContent = `00:00:${pad(ss)}:${pad(ff)}`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const start = () => {
      ready = true;
      section.dataset.ready = "true";
      section.dataset.intro = "done";
      active = -1;
      update();
    };

    // Hide the first shot's words until the preloader has cleared, so they
    // arrive rather than sit there.
    chapters.forEach((chapter) => {
      chapter.dataset.active = "false";
    });
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    let raf = 0;
    if (reduced) {
      section.dataset.loaded = "true";
      start();
    } else {
      let loaded = false;
      const assets = [document.fonts?.ready, firstPhoto?.decode?.().catch(() => {})];
      Promise.all(assets).then(() => (loaded = true));

      const began = performance.now();
      const tick = (now) => {
        const t = clamp((now - began) / LOAD_MS);
        const value = smooth(Math.min(t, loaded ? 1 : 0.9));
        // The line draws with the progress (hidden at offset 1.1, drawn at
        // 0), and the timecode runs through one second of frames.
        loadLine.style.strokeDashoffset = String(1.1 * (1 - value));
        const frames24 = Math.round(value * FPS);
        loadTime.textContent = `00:00:${pad(Math.floor(frames24 / FPS))}:${pad(frames24 % FPS)}`;
        if (value >= 1) {
          section.dataset.loaded = "true";
          timers.push(setTimeout(start, CLEAR_MS));
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [shots]);

  return (
    <section ref={ref} className={className} aria-labelledby="hero-title" data-section="Home" data-intro="pending">
      {children}
    </section>
  );
}
