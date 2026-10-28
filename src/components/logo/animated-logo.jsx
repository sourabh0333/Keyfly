"use client";

import { useEffect, useId, useRef } from "react";
import { cx } from "@/lib/cx";
import {
  K_ARM_TIP,
  K_FLIGHT_PATH,
  K_POINT,
  K_STEM_PATH,
  K_STROKE,
  LOGO_RATIO,
  LOGO_VIEWBOX,
  WORD_SHIFT,
} from "./k-geometry";
import { WORDMARK_LETTERS } from "./lockup-geometry";
import styles from "./animated-logo.module.css";

const LETTERS = WORDMARK_LETTERS.slice(1); // "eyfly"; the K is drawn

// Timeline (ms). The comet climbs the stem, hops to the leg, paints the
// flight curve, then becomes the point.
const STEM_MS = 360;
const HOP_MS = 220;
const CURVE_MS = 820;
const LAND_MS = 140;
const COMET_MS = STEM_MS + HOP_MS + CURVE_MS + LAND_MS;
const CURVE_AT = STEM_MS + HOP_MS;
const INK_LAG_MS = 110; // the ink follows the hot trail, "cooling"
const LAND_AT = COMET_MS - 40;
const LETTERS_AT = 980;
const GLINT_AT = 1250;

const HOP_CONTROL = [31, -2];
const SAMPLES = 56;

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
const lerp = (a, b, t) => a + (b - a) * t;
const range = (steps) => Array.from({ length: steps + 1 }, (_, i) => i / steps);

// One keyframe list for the whole comet flight, so a single linear
// animation carries every segment's easing.
function cometFrames(stemPath, curvePath) {
  const frames = [];
  const push = (x, y, ms) =>
    frames.push({ transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`, offset: ms / COMET_MS });

  const stemLength = stemPath.getTotalLength();
  range(14).forEach((s) => {
    const p = stemPath.getPointAtLength(stemLength * easeInOut(s));
    push(p.x, p.y, s * STEM_MS);
  });

  const top = stemPath.getPointAtLength(stemLength);
  const [footX, footY] = [37, 41.5];
  range(10).forEach((s) => {
    if (!s) return;
    const t = easeInOut(s);
    const a = (1 - t) ** 2;
    const b = 2 * (1 - t) * t;
    const c = t * t;
    push(a * top.x + b * HOP_CONTROL[0] + c * footX, a * top.y + b * HOP_CONTROL[1] + c * footY, STEM_MS + s * HOP_MS);
  });

  const curveLength = curvePath.getTotalLength();
  range(SAMPLES).forEach((s) => {
    if (!s) return;
    const p = curvePath.getPointAtLength(curveLength * easeInOut(s));
    push(p.x, p.y, CURVE_AT + s * CURVE_MS);
  });

  range(6).forEach((s) => {
    if (!s) return;
    const t = easeOut(s);
    push(lerp(K_ARM_TIP[0], K_POINT.cx, t), lerp(K_ARM_TIP[1], K_POINT.cy, t), CURVE_AT + CURVE_MS + s * LAND_MS);
  });
  return frames;
}

// Dash frames drawing a pathLength="1" stroke in step with the comet.
function drawFrames(steps) {
  return range(steps).map((s) => {
    const p = easeInOut(s);
    return { strokeDashoffset: p === 0 ? 1.1 : 1 - p, offset: s };
  });
}

function intro(parts) {
  const animations = [];
  const run = (el, frames, options) => {
    if (el) animations.push(el.animate(frames, { fill: "both", ...options }));
  };

  // Comet: one flight, fading in at the base and out as the point lands.
  run(parts.comet, cometFrames(parts.stemMeasure, parts.curveMeasure), {
    duration: COMET_MS,
    easing: "linear",
  });
  run(
    parts.comet.firstElementChild,
    [{ opacity: 0 }, { opacity: 1, offset: 0.04 }, { opacity: 1, offset: 0.93 }, { opacity: 0 }],
    { duration: COMET_MS + 120 },
  );

  // The stem is drawn by the climbing comet.
  run(parts.stem, drawFrames(14), { duration: STEM_MS, easing: "linear" });

  // The hot trail tracks the comet exactly, then cools away; the ink line
  // follows a moment behind.
  run(parts.hot, drawFrames(SAMPLES), { duration: CURVE_MS, delay: CURVE_AT, easing: "linear" });
  const hotSpan = CURVE_MS + 700;
  run(
    parts.hot,
    [{ opacity: 1 }, { opacity: 1, offset: (CURVE_MS - 180) / hotSpan }, { opacity: 0 }],
    { duration: hotSpan, delay: CURVE_AT, easing: "linear" },
  );
  run(parts.curve, drawFrames(SAMPLES), {
    duration: CURVE_MS,
    delay: CURVE_AT + INK_LAG_MS,
    easing: "linear",
  });

  // Landing: the point flashes into place with a shockwave ring.
  run(
    parts.point,
    [
      { opacity: 0, transform: "scale(0)" },
      { opacity: 1, transform: "scale(1.6)", offset: 0.4 },
      { transform: "scale(0.88)", offset: 0.72 },
      { opacity: 1, transform: "none" },
    ],
    { duration: 460, delay: LAND_AT, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  run(
    parts.ring,
    [
      { opacity: 0, transform: "scale(1)" },
      { opacity: 0.9, transform: "scale(1.2)", offset: 0.06 },
      { opacity: 0, transform: "scale(4)" },
    ],
    { duration: 700, delay: LAND_AT, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );

  // "eyfly" exposes left to right, then a glint crosses it.
  parts.letters.forEach((letter, index) => {
    run(
      letter,
      [
        { opacity: 0, transform: "translateX(-5px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 460, delay: LETTERS_AT + index * 60, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  });
  run(parts.glint, [{ transform: "translateX(-40px)" }, { transform: "translateX(150px)" }], {
    duration: 900,
    delay: GLINT_AT,
    easing: "cubic-bezier(0.65, 0, 0.35, 1)",
  });

  return animations;
}

/**
 * The Keyfly logo (K•eyfly), animated as light painting: a glowing tungsten
 * comet draws the K like a long-exposure photograph. It climbs the leaning
 * stem, hops to the leg and paints the flight curve; the trail burns amber
 * and cools into ink, the comet becomes the point with a shockwave ring,
 * and a glint sweeps across "eyfly". About 2s.
 *
 * play: "load" (on first paint), "view" (once, when scrolled into view) or
 * false (static). Reduced motion shows the finished logo. Colours follow
 * the surrounding tone.
 */
export function AnimatedLogo({ height = 36, play = "load", label = "Keyfly", className }) {
  const id = useId().replace(/[^\w-]/g, "");
  const svgRef = useRef(null);
  const stemMeasureRef = useRef(null);
  const curveMeasureRef = useRef(null);
  const stemRef = useRef(null);
  const curveRef = useRef(null);
  const hotRef = useRef(null);
  const pointRef = useRef(null);
  const ringRef = useRef(null);
  const glintRef = useRef(null);
  const cometRef = useRef(null);
  const wordRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || play === false) {
      svg.dataset.state = "done";
      return;
    }

    let animations = [];
    let observer;
    const start = () => {
      animations = intro({
        stemMeasure: stemMeasureRef.current,
        curveMeasure: curveMeasureRef.current,
        stem: stemRef.current,
        curve: curveRef.current,
        hot: hotRef.current,
        point: pointRef.current,
        ring: ringRef.current,
        glint: glintRef.current,
        comet: cometRef.current,
        letters: [...wordRef.current.children],
      });
      // Set after the animations exist, so no frame shows the finished logo.
      svg.dataset.state = "running";
    };

    if (play === "load") {
      start();
    } else if (svg.getBoundingClientRect().top < window.innerHeight) {
      // play="view" but already on screen: show it finished, no flash.
      svg.dataset.state = "done";
    } else {
      svg.dataset.state = "armed";
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          start();
        },
        { threshold: 0.4 },
      );
      observer.observe(svg);
    }

    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [play]);

  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  return (
    <svg
      ref={svgRef}
      viewBox={LOGO_VIEWBOX}
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      data-state={play === "load" ? "pending" : "done"}
      className={cx(styles.logo, className)}
      focusable="false"
      {...a11y}
    >
      <defs>
        <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-halo`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <clipPath id={`${id}-word`}>
          {LETTERS.map((letter, index) => (
            <path key={index} d={letter.d} transform={`translate(${WORD_SHIFT} 0)`} />
          ))}
        </clipPath>
        <linearGradient id={`${id}-glint`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--tungsten-amber)", stopOpacity: 0 }} />
          <stop offset="0.5" style={{ stopColor: "var(--tungsten-amber)", stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: "var(--tungsten-amber)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* Invisible copies of the paths, used only to measure the flight. */}
      <path ref={stemMeasureRef} d={K_STEM_PATH} fill="none" stroke="none" />
      <path ref={curveMeasureRef} d={K_FLIGHT_PATH} fill="none" stroke="none" />

      {/* The K: leaning stem and the flight curve. */}
      <path
        ref={stemRef}
        className={cx(styles.stroke, styles.part)}
        d={K_STEM_PATH}
        pathLength="1"
        strokeWidth={K_STROKE}
      />
      <path
        ref={curveRef}
        className={cx(styles.stroke, styles.part)}
        d={K_FLIGHT_PATH}
        pathLength="1"
        strokeWidth={K_STROKE}
      />

      {/* "eyfly": brand-kit letters. */}
      <g transform={`translate(${WORD_SHIFT} 0)`}>
        <g ref={wordRef} className={styles.part}>
          {LETTERS.map((letter, index) => (
            <path key={index} className={styles.letter} d={letter.d} />
          ))}
        </g>
      </g>

      <circle ref={pointRef} className={cx(styles.point, styles.part)} {...K_POINT} />

      {/* Light: the burning trail, the glint, the shockwave and the comet. */}
      <path
        ref={hotRef}
        className={styles.hot}
        d={K_FLIGHT_PATH}
        pathLength="1"
        strokeWidth={K_STROKE}
        filter={`url(#${id}-glow)`}
      />
      <g clipPath={`url(#${id}-word)`}>
        <rect
          ref={glintRef}
          className={styles.glint}
          x="0"
          y="10"
          width="22"
          height="46"
          fill={`url(#${id}-glint)`}
        />
      </g>
      <circle ref={ringRef} className={styles.ring} {...K_POINT} />
      <g ref={cometRef} className={styles.comet}>
        <g>
          <circle r="5.5" className={styles.halo} filter={`url(#${id}-halo)`} />
          <circle r="2.4" className={styles.core} filter={`url(#${id}-glow)`} />
        </g>
      </g>
    </svg>
  );
}
