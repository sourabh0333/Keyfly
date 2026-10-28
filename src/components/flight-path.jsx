"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import styles from "./flight-path.module.css";

// The "Flight path" symbol geometry, exactly as in brand-kit/symbol/*.svg.
export const FLIGHT_SYMBOL = {
  viewBox: "0 0 256 256",
  transform: "translate(128 126) scale(0.9) translate(-128 -116)",
  d: "M44 196 C 90 192, 130 166, 142 128 C 154 90, 132 62, 107 74 C 82 86, 90 128, 132 131 C 166 133, 190 102, 201 70",
  point: { cx: 214, cy: 40, r: 17 },
  strokeWidth: 22,
};

/**
 * A line that draws itself and lands on the amber point (brand motion:
 * draw 0.9s, then a 0.35s settle). Defaults to the brand symbol; pass a
 * different `shape` for longer page-level flight paths.
 *
 * play:
 * - "load": animates on first paint, from CSS alone (works without JS).
 * - "view": animates once when scrolled into view. Server HTML is the drawn
 *   state, so it is never hidden without JS or when already on screen.
 * - false:  static, fully drawn.
 *
 * Colours come from the surrounding tone: Ink + deep amber on Paper,
 * Paper + tungsten amber on Night.
 */
export function FlightPath({ shape = FLIGHT_SYMBOL, play = "view", size, label, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (play !== "view" || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen at hydration: leave it drawn rather than flash it.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.state = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.state = "play";
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [play]);

  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg
      ref={ref}
      viewBox={shape.viewBox}
      width={size}
      height={size}
      data-state={play === "load" ? "play" : "static"}
      className={cx(styles.root, className)}
      focusable="false"
      {...a11y}
    >
      <g transform={shape.transform}>
        <path
          className={styles.line}
          d={shape.d}
          pathLength="1"
          strokeWidth={shape.strokeWidth}
        />
        <circle className={styles.point} {...shape.point} />
      </g>
    </svg>
  );
}
