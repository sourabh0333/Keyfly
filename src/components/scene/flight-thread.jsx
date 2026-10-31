"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./scene.module.css";

// Where the head of the line rides, as a share of the viewport's height.
const HEAD = 0.62;

const f = (n) => n.toFixed(1);

// Builds the line in page coordinates from the sections as laid out now.
// It picks up the hero's playhead, swings out to the left margin, runs down
// past "How it works" (keyframes where its steps change), lands on the
// "Use cases" eyebrow, then flies one loop of the brand's flight path across
// the gap and lands on "Download".
function measure(page, path) {
  const top0 = page.getBoundingClientRect().top + scrollY;
  const y = (el) => el.getBoundingClientRect().top + scrollY - top0;
  const how = document.getElementById("product");
  const cases = document.getElementById("use-cases");
  const land = document.getElementById("download");
  const marks = [cases, land].map((s) => s?.querySelector("[data-landing]"));
  if (!how || !cases || !land || marks.includes(null)) return null;

  const vh = innerHeight;
  const w = page.clientWidth;
  const left = Math.min(...marks.map((m) => m.getBoundingClientRect().left));
  const tx = Math.max(7, left - Math.min(26, left / 2));
  const landings = marks.map((m) => {
    const r = m.getBoundingClientRect();
    return { x: r.left, y: y(m) + r.height / 2 };
  });

  // How it works: in, and the swing to the margin.
  const a = y(how);
  const s = Math.min(240, vh * 0.26);
  const swing = `C${f(w / 2)} ${f(a + s * 0.55)} ${f(tx)} ${f(a + s * 0.3)} ${f(tx)} ${f(a + s)}`;

  // The gap between the two last sections, for the loop.
  const style = getComputedStyle(cases);
  const casesEnd = y(cases) + cases.offsetHeight - parseFloat(style.paddingBottom);
  const g0 = casesEnd + 16;
  const g1 = landings[1].y;
  const span = Math.min(w - tx * 2, 900);
  const X = (u) => f(tx + u * span);
  const Y = (v) => f(g0 + v * (g1 - g0));
  const loop =
    `C${X(0)} ${Y(0.3)} ${X(0.25)} ${Y(0.55)} ${X(0.5)} ${Y(0.52)}` +
    `C${X(0.75)} ${Y(0.49)} ${X(0.86)} ${Y(0.1)} ${X(0.68)} ${Y(0.07)}` +
    `C${X(0.52)} ${Y(0.05)} ${X(0.49)} ${Y(0.4)} ${X(0.43)} ${Y(0.62)}` +
    `C${X(0.38)} ${Y(0.8)} ${X(0)} ${Y(0.68)} ${X(0)} ${Y(1)}`;

  const segs = [
    [swing, a + s],
    [`V${f(landings[0].y)}`, landings[0].y],
    [`V${f(g0)}`, g0],
    [loop, g1],
  ];
  const start = `M${f(w / 2)} ${f(a)}`;
  const keys = [[a, 0]];
  let d = start;
  for (const [seg, endY] of segs) {
    d += seg;
    path.setAttribute("d", d);
    keys.push([endY, path.getTotalLength()]);
  }

  // Keyframes on the margin where the pinned steps change.
  const pinned = how.offsetHeight - vh;
  const frames = pinned > vh ? [1 / 3, 2 / 3].map((k) => a + k * pinned + HEAD * vh) : [];

  return {
    top0,
    w,
    h: page.offsetHeight,
    d,
    keys,
    total: keys.at(-1)[1],
    frames: frames.map((fy) => ({ x: tx, y: fy, len: lengthAt(keys, fy) })),
    landings: landings.map((l, i) => ({ ...l, tx, len: keys[i === 0 ? 2 : 4][1] })),
  };
}

// The length of line drawn when the head is at page height `t`.
function lengthAt(keys, t) {
  if (t <= keys[0][0]) return 0;
  for (let i = 1; i < keys.length; i++) {
    const [y1, l1] = keys[i];
    if (t <= y1) {
      const [y0, l0] = keys[i - 1];
      return l0 + ((t - y0) / (y1 - y0 || 1)) * (l1 - l0);
    }
  }
  return keys.at(-1)[1];
}

/**
 * The flight thread: one mint line that ties the page together. It draws
 * itself as you scroll, its glowing head riding a fixed height on screen,
 * lights a keyframe each time "How it works" changes step, and lands as a
 * point on each section's eyebrow, which lights in answer (data-landed).
 * With reduced motion it is drawn whole and every point has landed.
 */
export function FlightThread({ pageRef }) {
  const [geo, setGeo] = useState(null);
  const lineRef = useRef(null);
  const headRef = useRef(null);
  const svgRef = useRef(null);

  // Lay the line out, and again whenever the page changes size.
  useEffect(() => {
    const page = pageRef.current;
    let frame = 0;
    const run = () => {
      frame = 0;
      setGeo(measure(page, lineRef.current));
    };
    const schedule = () => (frame ||= requestAnimationFrame(run));
    const observer = new ResizeObserver(schedule);
    observer.observe(page);
    document.fonts?.ready.then(schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [pageRef]);

  // Draw it to the scroll position.
  useEffect(() => {
    if (!geo) return;
    const line = lineRef.current;
    const head = headRef.current;
    const svg = svgRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = [...svg.querySelectorAll("[data-at]")];
    const marks = ["use-cases", "download"].map((id) => document.getElementById(id)?.querySelector("[data-landing]"));
    let frame = 0;

    line.style.strokeDasharray = `${geo.total} ${geo.total + 1}`;

    function update() {
      frame = 0;
      const len = reduced ? geo.total : lengthAt(geo.keys, scrollY - geo.top0 + innerHeight * HEAD);
      line.style.strokeDashoffset = String(geo.total - len);
      const flying = len > 0.5 && len < geo.total - 0.5;
      head.toggleAttribute("data-on", flying);
      if (flying) {
        const p = line.getPointAtLength(len);
        head.setAttribute("transform", `translate(${f(p.x)} ${f(p.y)})`);
      }
      for (const point of points) {
        const on = len >= Number(point.dataset.at) - 0.5;
        if (on !== point.hasAttribute("data-landed")) {
          point.toggleAttribute("data-landed", on);
          const mark = marks[point.dataset.mark];
          if (mark) mark.toggleAttribute("data-landed", on);
        }
      }
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));

    update();
    svg.setAttribute("data-ready", "");
    addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
    };
  }, [geo]);

  return (
    <svg
      ref={svgRef}
      className={styles.thread}
      width={geo?.w ?? 0}
      height={geo?.h ?? 0}
      viewBox={geo ? `0 0 ${geo.w} ${geo.h}` : undefined}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="thread-bloom">
          <stop offset="0" stopColor="#5fe0b0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5fe0b0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {geo ? <path d={geo.d} className={styles.track} /> : null}
      <path ref={lineRef} d={geo?.d} className={styles.line} />

      {geo?.frames.map((k, i) => (
        <g key={`k${i}`} className={styles.keyframe} data-at={k.len} transform={`translate(${f(k.x)} ${f(k.y)})`}>
          <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" />
        </g>
      ))}

      {geo?.landings.map((l, i) => (
        <g key={`l${i}`} className={styles.landing} data-at={l.len} data-mark={i} data-final={i === geo.landings.length - 1 ? "" : undefined}>
          <path d={`M${f(l.tx + 7)} ${f(l.y)}H${f(l.x - 3)}`} className={styles.reach} pathLength="1" />
          <circle cx={l.tx} cy={l.y} r="60" fill="url(#thread-bloom)" className={styles.bloom} />
          <circle cx={l.tx} cy={l.y} r="14" className={styles.ring} />
          <circle cx={l.tx} cy={l.y} r={i === geo.landings.length - 1 ? 6 : 4.5} className={styles.point} />
        </g>
      ))}

      <g ref={headRef} className={styles.head}>
        <circle r="26" fill="url(#thread-bloom)" />
        <circle r="3.5" className={styles.headCore} />
      </g>
    </svg>
  );
}
