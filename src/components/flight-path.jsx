"use client";

import { useRef } from "react";
import { cx } from "@/lib/cx";
import { usePlayState } from "@/lib/use-play-state";
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
 * A line that draws itself and lands on the mint point (brand motion:
 * draw 0.9s, then a 0.35s settle). Defaults to the brand symbol; pass a
 * different `shape` for longer page-level flight paths.
 *
 * play: "load" | "view" | false (see usePlayState).
 *
 * Colours come from the surrounding tone: Ink + deep mint on Paper,
 * Paper + soft mint on Night.
 */
export function FlightPath({ shape = FLIGHT_SYMBOL, play = "view", size, label, className }) {
  const ref = useRef(null);
  const state = usePlayState(ref, play);
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg
      ref={ref}
      viewBox={shape.viewBox}
      preserveAspectRatio={shape.preserveAspectRatio}
      width={size}
      height={size}
      data-state={state}
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
