"use client";

import { useEffect, useId, useRef } from "react";
import { cx } from "@/lib/cx";
import { LOGO_RATIO, LOGO_VIEWBOX, SYMBOL_OFFSET_Y, WORDMARK_SHIFT_X } from "./composition";
import {
  FLAT_SYMBOL_PATH,
  FLAT_SYMBOL_POINT,
  FLAT_SYMBOL_STROKE,
  WORDMARK_LETTERS,
} from "./lockup";
import styles from "./animated-logo.module.css";

const POINT = FLAT_SYMBOL_POINT;

// Intro timeline (ms). The comet sweeps in, paints the symbol's line, then
// becomes the point.
const FLIGHT_MS = 1120;
const LAND_MS = 140;
const INK_LAG_MS = 110; // the ink follows the hot trail, "cooling"
const LETTERS_AT = 700;
// Relight (hover): a quicker pass over the finished symbol.
const RELIGHT_MS = 680;

const SAMPLES = 64;
const SPARKS = 30;
const RELIGHT_SPARKS = 16;
const STREAK = 0.17; // length of the burning tail, as a share of the line
const CORE = 0.07; // length of the white-hot core
const SVG_NS = "http://www.w3.org/2000/svg";
const OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

// The comet's route: a short run-in on the line's own starting direction.
const [START_X, START_Y, CTRL_X, CTRL_Y] = FLAT_SYMBOL_PATH.match(/-?\d*\.?\d+/g).map(Number);
const RUN = Math.hypot(CTRL_X - START_X, CTRL_Y - START_Y);
const ENTRY = [START_X - ((CTRL_X - START_X) / RUN) * 9, START_Y - ((CTRL_Y - START_Y) / RUN) * 9];
const ROUTE_PATH = `M${ENTRY[0].toFixed(2)} ${ENTRY[1].toFixed(2)} L${FLAT_SYMBOL_PATH.slice(1)}`;
const END = FLAT_SYMBOL_PATH.match(/-?\d*\.?\d+/g).map(Number).slice(-2);

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
const lerp = (a, b, t) => a + (b - a) * t;
const range = (steps) => Array.from({ length: steps + 1 }, (_, i) => i / steps);
const translate = (x, y) => `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;

/**
 * Samples the comet's route once. On that one clock it returns where the
 * comet is, how much of the line is drawn, and keyframes for the trail,
 * the burning tail and the white-hot core.
 */
function flight(route, line, flightMs, withRunIn) {
  const routeLength = route.getTotalLength();
  const lineLength = line.getTotalLength();
  const runIn = withRunIn ? routeLength - lineLength : 0;
  const path = withRunIn ? route : line;
  const length = withRunIn ? routeLength : lineLength;
  const totalMs = flightMs + LAND_MS;

  const positions = [];
  const comet = [];
  const trail = [];
  const tail = [];
  const core = [];
  range(SAMPLES).forEach((s) => {
    const distance = length * easeInOut(s);
    const p = path.getPointAtLength(distance);
    const drawn = Math.min(1, Math.max(0, (distance - runIn) / lineLength));
    positions.push({ x: p.x, y: p.y, ms: s * flightMs, drawn });
    comet.push({ transform: translate(p.x, p.y), offset: (s * flightMs) / totalMs });
    trail.push({ strokeDashoffset: drawn === 0 ? 1.1 : 1 - drawn, offset: s });
    // A dash of length L ending at the comet: offset = L - drawn.
    tail.push({ strokeDashoffset: STREAK - drawn, opacity: drawn > 0 && s < 1 ? 1 : 0, offset: s });
    core.push({ strokeDashoffset: CORE - drawn, opacity: drawn > 0 && s < 1 ? 1 : 0, offset: s });
  });
  range(6).forEach((s) => {
    if (!s) return;
    const t = easeOut(s);
    comet.push({
      transform: translate(lerp(END[0], POINT.cx, t), lerp(END[1], POINT.cy, t)),
      offset: (flightMs + s * LAND_MS) / totalMs,
    });
  });
  return { positions, comet, trail, tail, core, totalMs };
}

/**
 * Embers shed by the comet: each leaves its position on the line with a
 * small kick, falls under gravity, shrinks and dies out.
 */
function sparks(group, positions, count) {
  const animations = [];
  const along = positions.filter((p) => p.drawn > 0.02 && p.drawn < 0.99);
  for (let i = 0; i < count; i += 1) {
    const from = along[Math.floor(Math.random() * along.length)];
    const spark = document.createElementNS(SVG_NS, "circle");
    spark.setAttribute("r", (0.35 + Math.random() * 0.55).toFixed(2));
    spark.setAttribute("class", Math.random() < 0.3 ? styles.sparkHot : styles.spark);
    group.appendChild(spark);

    const vx = (Math.random() - 0.5) * 22;
    const vy = -(4 + Math.random() * 12);
    const gravity = 46;
    const life = 0.55 + Math.random() * 0.45; // seconds
    const frames = range(6).map((s) => {
      const t = s * life;
      return {
        transform: `${translate(from.x + vx * t, from.y + vy * t + 0.5 * gravity * t * t)} scale(${1 - 0.8 * s})`,
        opacity: s === 0 ? 0 : 1 - s ** 1.6,
        offset: s,
      };
    });
    frames[1].opacity = 1;
    const animation = spark.animate(frames, {
      duration: life * 1000,
      delay: from.ms,
      easing: "linear",
      fill: "both",
    });
    animation.finished.then(() => spark.remove(), () => spark.remove());
    animations.push(animation);
  }
  return animations;
}

function landing(parts, at, run, strong) {
  run(
    parts.point,
    strong
      ? [
          { opacity: 0, transform: "scale(0)" },
          { opacity: 1, transform: "scale(1.6)", offset: 0.4 },
          { transform: "scale(0.88)", offset: 0.72 },
          { opacity: 1, transform: "none" },
        ]
      : [{ transform: "none" }, { transform: "scale(1.4)", offset: 0.35 }, { transform: "none" }],
    { duration: 460, delay: at, easing: OUT },
  );
  run(
    parts.ring,
    [
      { opacity: 0, transform: "scale(1)" },
      { opacity: 0.9, transform: "scale(1.2)", offset: 0.06 },
      { opacity: 0, transform: "scale(4)" },
    ],
    { duration: 700, delay: at, easing: OUT },
  );
  if (strong) {
    // Light spills from the landing point across the word.
    run(
      parts.bloom,
      [
        { opacity: 0, transform: "scale(0.3)" },
        { opacity: 1, transform: "scale(0.9)", offset: 0.25 },
        { opacity: 0, transform: "scale(1.3)" },
      ],
      { duration: 900, delay: at, easing: OUT },
    );
  }
  // A glint crosses "Keyfly".
  run(parts.glint, [{ transform: "translateX(0)" }, { transform: "translateX(170px)" }], {
    duration: 1000,
    delay: at - 220,
    easing: "cubic-bezier(0.65, 0, 0.35, 1)",
  });
}

function intro(parts) {
  const animations = [];
  const run = (el, frames, options) => {
    if (el) animations.push(el.animate(frames, { fill: "both", ...options }));
  };
  const f = flight(parts.route, parts.lineMeasure, FLIGHT_MS, true);

  // Comet: one flight, fading in as it enters and out as the point lands.
  run(parts.comet, f.comet, { duration: f.totalMs, easing: "linear" });
  run(
    parts.comet.firstElementChild,
    [{ opacity: 0 }, { opacity: 1, offset: 0.08 }, { opacity: 1, offset: 0.93 }, { opacity: 0 }],
    { duration: f.totalMs + 120 },
  );

  // Light changes temperature behind the comet: a white-hot core, a
  // burning mint tail, a mint trail that cools, and the line itself.
  run(parts.core, f.core, { duration: FLIGHT_MS, easing: "linear" });
  run(parts.tail, f.tail, { duration: FLIGHT_MS, easing: "linear" });
  run(parts.hot, f.trail, { duration: FLIGHT_MS, easing: "linear" });
  const hotSpan = FLIGHT_MS + 700;
  run(
    parts.hot,
    [{ opacity: 1 }, { opacity: 1, offset: (FLIGHT_MS - 180) / hotSpan }, { opacity: 0 }],
    { duration: hotSpan, easing: "linear" },
  );
  run(parts.line, f.trail, { duration: FLIGHT_MS, delay: INK_LAG_MS, easing: "linear" });

  animations.push(...sparks(parts.sparks, f.positions, SPARKS));
  landing(parts, f.totalMs - 40, run, true);

  // "Keyfly" develops like a photograph: each letter flashes with a mint
  // afterglow as it appears, then settles.
  parts.letters.forEach((letter, index) => {
    const at = LETTERS_AT + index * 60;
    run(letter, [{ opacity: 0, transform: "translateX(-5px)" }, { opacity: 1, transform: "none" }], {
      duration: 460,
      delay: at,
      easing: OUT,
    });
    run(parts.afterglow[index], [{ opacity: 0 }, { opacity: 0.95, offset: 0.2 }, { opacity: 0 }], {
      duration: 700,
      delay: at,
      easing: "ease-out",
    });
  });

  return animations;
}

// Hover: the comet relights the finished symbol, with fresh sparks.
function relight(parts) {
  const animations = [];
  const run = (el, frames, options) => {
    if (el) animations.push(el.animate(frames, { fill: "none", ...options }));
  };
  const f = flight(parts.route, parts.lineMeasure, RELIGHT_MS, false);
  run(parts.comet, f.comet, { duration: f.totalMs, easing: "linear" });
  run(
    parts.comet.firstElementChild,
    [{ opacity: 0 }, { opacity: 1, offset: 0.06 }, { opacity: 1, offset: 0.92 }, { opacity: 0 }],
    { duration: f.totalMs },
  );
  run(parts.core, f.core, { duration: RELIGHT_MS, easing: "linear" });
  run(parts.tail, f.tail, { duration: RELIGHT_MS, easing: "linear" });
  animations.push(...sparks(parts.sparks, f.positions, RELIGHT_SPARKS));
  landing(parts, f.totalMs - 60, run, false);
  return animations;
}

/**
 * The Keyfly logo: the brand kit's symbol and wordmark, unchanged in shape
 * and colour, set as in composition.js and animated as light painting.
 *
 * A glowing mint comet sweeps in and paints the symbol's line: a white-hot
 * core leads a burning mint tail that cools into the line, shedding sparks
 * that fall and die out. The comet becomes the point with a shockwave and a
 * bloom of light, "Keyfly" develops letter by letter with a mint
 * afterglow, and a glint crosses the word. Hovering relights the symbol.
 * About 2s.
 *
 * play: "load" (on first paint), "view" (once, when scrolled into view) or
 * false (static). Reduced motion shows the finished logo with no relight.
 * Colours follow the surrounding tone: the kit's lockup-light pair on
 * Paper, lockup-dark on Night.
 */
export function AnimatedLogo({ height = 32, play = "load", label = "Keyfly", className }) {
  const id = useId().replace(/[^\w-]/g, "");
  const svgRef = useRef(null);
  const routeRef = useRef(null);
  const lineMeasureRef = useRef(null);
  const lineRef = useRef(null);
  const hotRef = useRef(null);
  const tailRef = useRef(null);
  const coreRef = useRef(null);
  const pointRef = useRef(null);
  const ringRef = useRef(null);
  const bloomRef = useRef(null);
  const glintRef = useRef(null);
  const cometRef = useRef(null);
  const sparksRef = useRef(null);
  const wordRef = useRef(null);
  const afterglowRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || play === false) {
      svg.dataset.state = "done";
      return;
    }

    const parts = {
      route: routeRef.current,
      lineMeasure: lineMeasureRef.current,
      line: lineRef.current,
      hot: hotRef.current,
      tail: tailRef.current,
      core: coreRef.current,
      point: pointRef.current,
      ring: ringRef.current,
      bloom: bloomRef.current,
      glint: glintRef.current,
      comet: cometRef.current,
      sparks: sparksRef.current,
      letters: [...wordRef.current.children],
      afterglow: [...afterglowRef.current.children],
    };

    let animations = [];
    let relighting = [];
    let observer;

    const start = () => {
      animations = intro(parts);
      // Set after the animations exist, so no frame shows the finished logo.
      svg.dataset.state = "running";
      Promise.all(animations.map((a) => a.finished)).then(
        () => (svg.dataset.state = "done"),
        () => {},
      );
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

    // Hover relight, once the intro has finished (mouse and trackpad only).
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const target = svg.closest("a") ?? svg;
    const onEnter = () => {
      if (svg.dataset.state !== "done") return;
      if (relighting.some((a) => a.playState === "running")) return;
      relighting = relight(parts);
    };
    if (canHover) target.addEventListener("pointerenter", onEnter);

    return () => {
      observer?.disconnect();
      target.removeEventListener("pointerenter", onEnter);
      [...animations, ...relighting].forEach((animation) => animation.cancel());
      parts.sparks.replaceChildren();
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
        <filter id={`${id}-afterglow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <clipPath id={`${id}-word`}>
          {WORDMARK_LETTERS.map((letter, index) => (
            <path key={index} d={letter.d} />
          ))}
        </clipPath>
        <linearGradient id={`${id}-glint`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: "var(--color-glow)", stopOpacity: 0 }} />
          <stop offset="0.5" style={{ stopColor: "var(--color-glow)", stopOpacity: 0.95 }} />
          <stop offset="1" style={{ stopColor: "var(--color-glow)", stopOpacity: 0 }} />
        </linearGradient>
        <radialGradient id={`${id}-bloom`}>
          <stop offset="0" style={{ stopColor: "var(--color-glow)", stopOpacity: 0.55 }} />
          <stop offset="0.45" style={{ stopColor: "var(--color-glow)", stopOpacity: 0.16 }} />
          <stop offset="1" style={{ stopColor: "var(--color-glow)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* The symbol, raised so its tail rests on the wordmark's baseline. */}
      <g transform={`translate(0 ${SYMBOL_OFFSET_Y})`}>
        {/* Invisible paths, used only to measure the comet's flight. */}
        <path ref={routeRef} d={ROUTE_PATH} fill="none" stroke="none" />
        <path ref={lineMeasureRef} d={FLAT_SYMBOL_PATH} fill="none" stroke="none" />

        {/* Bloom of light from the landing point, behind everything. */}
        <circle
          ref={bloomRef}
          className={styles.bloom}
          cx={POINT.cx}
          cy={POINT.cy}
          r="62"
          fill={`url(#${id}-bloom)`}
        />

        <path
          ref={lineRef}
          className={cx(styles.stroke, styles.part)}
          d={FLAT_SYMBOL_PATH}
          pathLength="1"
          strokeWidth={FLAT_SYMBOL_STROKE}
        />
        <circle ref={pointRef} className={cx(styles.point, styles.part)} {...POINT} />
      </g>

      {/* "Keyfly": the brand-kit letters, plus their mint afterglow. */}
      <g transform={`translate(${WORDMARK_SHIFT_X} 0)`}>
        <g ref={afterglowRef} className={styles.afterglow} filter={`url(#${id}-afterglow)`}>
          {WORDMARK_LETTERS.map((letter, index) => (
            <path key={index} d={letter.d} />
          ))}
        </g>
        <g ref={wordRef} className={styles.part}>
          {WORDMARK_LETTERS.map((letter, index) => (
            <path key={index} className={styles.letter} d={letter.d} />
          ))}
        </g>
        <g clipPath={`url(#${id}-word)`}>
          <rect
            ref={glintRef}
            className={styles.glint}
            x="60"
            y="10"
            width="24"
            height="46"
            fill={`url(#${id}-glint)`}
          />
        </g>
      </g>

      {/* Light over the symbol: cooling trail, burning tail, white-hot core,
          shockwave, sparks and the comet itself. */}
      <g transform={`translate(0 ${SYMBOL_OFFSET_Y})`}>
        <g filter={`url(#${id}-glow)`}>
          <path
            ref={hotRef}
            className={styles.hot}
            d={FLAT_SYMBOL_PATH}
            pathLength="1"
            strokeWidth={FLAT_SYMBOL_STROKE}
          />
          <path
            ref={tailRef}
            className={styles.tail}
            d={FLAT_SYMBOL_PATH}
            pathLength="1"
            strokeWidth={FLAT_SYMBOL_STROKE * 1.15}
          />
          <path
            ref={coreRef}
            className={styles.core}
            d={FLAT_SYMBOL_PATH}
            pathLength="1"
            strokeWidth={FLAT_SYMBOL_STROKE * 0.45}
          />
        </g>
        <circle ref={ringRef} className={styles.ring} {...POINT} />
        <g ref={sparksRef} className={styles.sparks} filter={`url(#${id}-glow)`} />
        <g ref={cometRef} className={styles.comet}>
          <g>
            <circle r="5.5" className={styles.halo} filter={`url(#${id}-halo)`} />
            <circle r="2.4" className={styles.cometCore} filter={`url(#${id}-glow)`} />
          </g>
        </g>
      </g>
    </svg>
  );
}
