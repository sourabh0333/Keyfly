"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./scrubber.module.css";

// The page plays as a cut this long, for the timecode.
const DURATION = 48;
const FPS = 30;

const pad = (n) => String(n).padStart(2, "0");
const slug = (label) => label.toLowerCase().replace(/\s+/g, "-");

function measure() {
  const top0 = scrollY;
  return [...document.querySelectorAll("main [data-section]")].map((section) => {
    const r = section.getBoundingClientRect();
    return { label: section.dataset.section, top: r.top + top0, height: r.height };
  });
}

/**
 * The page as an edit: a slim timeline standing in the right-hand margin,
 * with one clip per section (sized by its length) and a mint playhead at
 * the scroll position. It stays out of the way of the content: hovering
 * or focusing it names the clips and shows the section under the playhead
 * with a running timecode, and clicking a clip scrubs to it. It comes in
 * once the hero is left behind, on screens wide enough to have a margin.
 */
export function Scrubber() {
  const [clips, setClips] = useState([]);
  const [current, setCurrent] = useState(0);
  const [shown, setShown] = useState(false);
  const trackRef = useRef(null);
  const codeRef = useRef(null);

  // Lay the clips out, and again whenever the page changes size.
  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      setClips(measure());
    };
    const schedule = () => (frame ||= requestAnimationFrame(run));
    const observer = new ResizeObserver(schedule);
    observer.observe(document.querySelector("main"));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  // Follow the scroll.
  useEffect(() => {
    if (!clips.length) return;
    const total = clips.reduce((sum, c) => sum + c.height, 0);
    const start = clips[0].top;
    let frame = 0;

    function update() {
      frame = 0;
      const vh = innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, scrollY / max);
      const pos = Math.min(1, Math.max(0, (scrollY + vh * p - start) / total));
      trackRef.current.style.setProperty("--pos", pos.toFixed(4));
      const t = pos * DURATION;
      codeRef.current.textContent = `00:00:${pad(Math.floor(t))}:${pad(Math.floor((t % 1) * FPS))}`;
      const probe = scrollY + vh / 2;
      setCurrent(Math.max(0, clips.findLastIndex((c) => c.top <= probe)));
      setShown(scrollY > vh * 0.45);
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
  }, [clips]);

  if (!clips.length) return null;
  const now = clips[current];

  return (
    <nav className={styles.scrubber} data-shown={shown ? "" : undefined} aria-label="Page timeline" inert={!shown}>
      <div ref={trackRef} className={styles.track}>
        {clips.map((clip, i) => (
          <button
            key={clip.label}
            type="button"
            className={styles.clip}
            style={{ flexGrow: clip.height }}
            data-key={slug(clip.label)}
            aria-current={i === current ? "step" : undefined}
            aria-label={`Go to ${clip.label}`}
            onClick={() => scrollTo({ top: clip.top + 1, behavior: "smooth" })}
          >
            <span className={styles.clipLabel}>{clip.label}</span>
          </button>
        ))}
        <span className={styles.head} aria-hidden="true">
          <span className={styles.tag}>
            <span className={styles.tagIndex}>{pad(current + 1)}</span>
            {now.label}
            <span ref={codeRef} className={styles.code}>
              00:00:00:00
            </span>
          </span>
        </span>
      </div>
    </nav>
  );
}
