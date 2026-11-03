"use client";

import { useEffect, useRef } from "react";
import styles from "./camera-frame.module.css";

const PAD = 12; // px the frame stands off its subject (8 on phones)
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

/**
 * One mint frame that travels down the page with you, like the camera
 * moving from shot to shot: it settles around each section's main picture
 * (elements marked data-frame="Label"), holds there while you read, then
 * flies and reshapes to the next as you scroll, with a label naming the
 * shot. Placed from the subjects' screen boxes on every scroll frame
 * (one rAF, lookups only), so it follows pinned stages too. Before the
 * first subject and after the last it fades away. Hidden with reduced
 * motion.
 */
export function CameraFrame({ pageRef }) {
  const frameRef = useRef(null);
  const labelRef = useRef(null);
  const indexRef = useRef(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const page = pageRef.current;
    const frame = frameRef.current;
    let raf = 0;
    let shown = "";

    function place() {
      raf = 0;
      const subjects = [...page.querySelectorAll("[data-frame]")].filter((el) => el.offsetParent);
      if (!subjects.length) return;
      const vh = innerHeight;
      const mid = vh * 0.5;
      const pad = innerWidth < 640 ? 8 : PAD;
      const boxes = subjects.map((el) => el.getBoundingClientRect());

      // Each subject holds the frame while the screen's middle is within
      // its middle stretch (a quarter in from each end, at least 60px).
      const hold = boxes.map((r) => {
        const inset = Math.min(r.height * 0.25, Math.max(60, r.height * 0.5 - 1));
        return [r.top + inset, r.bottom - inset];
      });

      let from = 0;
      let to = 0;
      let t = 0;
      let i = hold.findIndex(([a, b]) => mid >= a && mid <= b);
      if (i >= 0) {
        from = to = i;
      } else {
        // Between two subjects: fly from the one above to the one below.
        i = hold.findIndex(([a]) => a > mid);
        if (i === -1) {
          from = to = hold.length - 1;
          t = 0;
        } else if (i === 0) {
          from = to = 0;
        } else {
          from = i - 1;
          to = i;
          const gapStart = hold[from][1];
          const gapEnd = hold[to][0];
          t = smooth(Math.min(1, Math.max(0, (mid - gapStart) / Math.max(1, gapEnd - gapStart))));
        }
      }

      const a = boxes[from];
      const b = boxes[to];
      const x = lerp(a.left, b.left, t) - pad;
      const y = lerp(a.top, b.top, t) - pad;
      const w = lerp(a.width, b.width, t) + pad * 2;
      const h = lerp(a.height, b.height, t) + pad * 2;
      frame.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      frame.style.width = `${w.toFixed(1)}px`;
      frame.style.height = `${h.toFixed(1)}px`;

      // Moving between shots: brighter. Off the ends of the page: fade.
      const flying = from !== to && t > 0.02 && t < 0.98;
      const first = hold[0][0] - vh * 0.35;
      const last = boxes.at(-1).bottom + pad;
      const visible = mid > first && last > vh * 0.12;
      frame.toggleAttribute("data-flying", flying);
      frame.toggleAttribute("data-on", visible);

      const now = t < 0.5 ? from : to;
      const label = subjects[now].dataset.frame;
      if (label !== shown) {
        shown = label;
        labelRef.current.textContent = label;
        indexRef.current.textContent = String(now + 1).padStart(2, "0");
      }
    }

    const schedule = () => (raf ||= requestAnimationFrame(place));
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(page);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [pageRef]);

  return (
    <div ref={frameRef} className={styles.frame} aria-hidden="true">
      <i className={styles.corner} data-c="tl" />
      <i className={styles.corner} data-c="tr" />
      <i className={styles.corner} data-c="bl" />
      <i className={styles.corner} data-c="br" />
      <span className={styles.tag}>
        <b ref={indexRef}>01</b>
        <span ref={labelRef} />
      </span>
    </div>
  );
}
