"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./post.module.css";

const clock = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * Reading the post as playing a cut. Beside the text (wide screens), the
 * post's sections as clips on a vertical track, each as long as its part of
 * the text, with a mint playhead that runs down as you read and a timecode
 * against the read time. On narrow screens, a bar along the foot of the
 * screen: the section being read, the timecode and a progress line.
 * Clicking a clip jumps to its section. Scrolling writes `--p` and the
 * timecode straight to the DOM; React re-renders only when the section
 * changes.
 */
export function ReadingTimeline({ sections, minutes, bodyId, label }) {
  const total = minutes * 60;
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const timeRefs = useRef([]);
  const [active, setActive] = useState(0);
  const [shares, setShares] = useState(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const body = document.getElementById(bodyId);
    if (!body) return undefined;
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    let geometry = null;
    let frame = 0;
    let last = -1;
    let lastShown = null;

    const measure = () => {
      const top = body.getBoundingClientRect().top + scrollY;
      const height = body.offsetHeight;
      const starts = els.map((el) => el.getBoundingClientRect().top + scrollY - top);
      geometry = { top, height, starts };
      const lengths = starts.map((s, i) => (starts[i + 1] ?? height) - s);
      setShares(lengths.map((l) => Math.max(0.06, l / height)));
    };

    const update = () => {
      frame = 0;
      if (!geometry) return;
      const { top, height, starts } = geometry;
      const line = scrollY + innerHeight * 0.35 - top;
      const p = Math.min(1, Math.max(0, line / height));
      const time = clock(p * total);
      for (const el of [trackRef.current, barRef.current]) el?.style.setProperty("--p", p.toFixed(4));
      for (const el of timeRefs.current) if (el) el.textContent = time;
      let current = 0;
      starts.forEach((s, i) => {
        if (line >= s) current = i;
      });
      if (current !== last) {
        last = current;
        setActive(current);
      }
      const shown = line > 0 && line < height + innerHeight * 0.2;
      if (shown !== lastShown) {
        lastShown = shown;
        setShowBar(shown);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    update();
    const observer = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    observer.observe(body);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [sections, bodyId, total]);

  const readout = (i) => (
    <span className={styles.readout}>
      <b ref={(el) => (timeRefs.current[i] = el)}>00:00</b> / {clock(total)}
    </span>
  );

  return (
    <>
      <nav className={styles.timeline} aria-label={label}>
        <p className={styles.timelineHead}>
          <span>{label}</span>
          {readout(0)}
        </p>
        <div className={styles.trackWrap} ref={trackRef}>
          <ol className={styles.track}>
          {sections.map((s, i) => (
            <li key={s.id} style={{ flexGrow: shares ? shares[i] : 1 }}>
              <a
                href={`#${s.id}`}
                className={styles.clip}
                data-state={i < active ? "done" : i === active ? "now" : undefined}
                aria-current={i === active ? "location" : undefined}
              >
                <span className={styles.clipNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.clipName}>{s.title}</span>
              </a>
            </li>
          ))}
          </ol>
          <span className={styles.playhead} aria-hidden="true" />
        </div>
      </nav>

      <div className={styles.bar} ref={barRef} data-shown={showBar || undefined} aria-hidden="true">
        <span className={styles.barLine} />
        <span className={styles.barNum}>{String(active + 1).padStart(2, "0")}</span>
        <span className={styles.barName}>{sections[active]?.title}</span>
        {readout(1)}
      </div>
    </>
  );
}
