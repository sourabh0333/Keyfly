"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./scene.module.css";

// Where the head of the line rides, as a share of the viewport's height.
const HEAD = 0.62;

const f = (n) => n.toFixed(1);
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Builds the line in page coordinates from the sections as laid out now:
// it picks up the hero's playhead and swings out to the left margin, runs
// down past "How it works", swerves out into the page and back to land on
// the "Use cases" eyebrow, flies one loop of the brand's flight path across
// the next gap to land on "Download", then runs on to the footer, turns
// onto the panel's top edge (its ruler) and runs along it to the playhead.
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

  // The swerve: out into the page and back down onto the Use cases eyebrow.
  const y0 = Math.max(a + s + 40, y(how) + how.offsetHeight - 24);
  const g = landings[0].y - y0;
  const reach = Math.min(w * 0.3, 340);
  const swerve =
    g > 90
      ? `C${f(tx)} ${f(y0 + g * 0.3)} ${f(tx + reach)} ${f(y0 + g * 0.12)} ${f(tx + reach * 0.62)} ${f(y0 + g * 0.5)}` +
        `C${f(tx + reach * 0.24)} ${f(y0 + g * 0.86)} ${f(tx)} ${f(y0 + g * 0.66)} ${f(tx)} ${f(landings[0].y)}`
      : `V${f(landings[0].y)}`;

  // The gap between Use cases and Download, for the loop.
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
    [`V${f(y0)}`, y0],
    [swerve, landings[0].y, "land0"],
    [`V${f(g0)}`, g0],
    [loop, g1, "land1"],
  ];
  // The vertical runs, where keyframes can sit on the line.
  const runs = [
    [a + s, y0],
    [landings[0].y, g0],
  ];

  // The footer: down to the panel's corner, onto its top edge and along it
  // to the playhead. The run along the edge gets its own stretch of scroll
  // (as much as the page has left, up to 260px), so it plays, not snaps.
  const panel = document.querySelector("[data-thread-end]");
  const stop = panel?.querySelector("[data-thread-stop]");
  let end = null;
  if (panel && stop) {
    const pr = panel.getBoundingClientRect();
    const pTop = y(panel);
    const sr = stop.getBoundingClientRect();
    const stopX = sr.left + 1;
    const maxHead = document.documentElement.scrollHeight - top0 - (1 - HEAD) * vh;
    const run = Math.max(60, Math.min(260, maxHead - pTop - 24));
    const corner = Math.min(40, Math.max(12, pr.left - tx + 24));
    segs.push(
      [`V${f(pTop - corner)}`, pTop - corner],
      [`C${f(tx)} ${f(pTop - corner * 0.3)} ${f(tx + corner * 0.4)} ${f(pTop)} ${f(Math.max(pr.left + 12, tx + corner))} ${f(pTop)}`, pTop],
      [`H${f(stopX)}`, pTop + run],
    );
    runs.push([g1, pTop - corner]);
    end = { panel, bottom: pr.bottom + scrollY - top0, stop: { x: stopX, y: pTop } };
  } else {
    runs.push([g1, Infinity]);
  }

  const keys = [[a, 0]];
  const at = {};
  let d = `M${f(w / 2)} ${f(a)}`;
  for (const [seg, endY, name] of segs) {
    d += seg;
    path.setAttribute("d", d);
    keys.push([endY, path.getTotalLength()]);
    if (name) at[name] = keys.at(-1)[1];
  }

  // Keyframes where the pinned sections change: How it works' steps, each
  // preset on the jog wheel, the lift-off and landing in Download. Each
  // pinned track lists its stops as fractions of its scroll.
  const frames = [];
  for (const el of document.querySelectorAll("[data-thread-stops]")) {
    if (!el.hasAttribute("data-live")) continue;
    const top = y(el);
    const range = el.offsetHeight - vh;
    for (const stopAt of el.dataset.threadStops.split(",").map(Number)) {
      const fy = top + stopAt * range + HEAD * vh;
      if (runs.some(([r0, r1]) => fy > r0 + 12 && fy < r1 - 12)) frames.push({ x: tx, y: fy, len: lengthAt(keys, fy) });
    }
  }

  // A table of points along the line (every 4px), so the comet's position
  // is a lookup on every frame rather than a measurement of the whole path.
  const total = keys.at(-1)[1];
  const step = 4;
  const count = Math.ceil(total / step) + 1;
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const p = path.getPointAtLength(Math.min(total, i * step));
    xs[i] = p.x;
    ys[i] = p.y;
  }

  return {
    top0,
    w,
    points: { xs, ys, step },
    h: Math.max(page.offsetHeight, end ? Math.ceil(end.bottom) : 0),
    footer: end?.panel.closest("footer") ?? null,
    stop: end?.stop ?? null,
    d,
    keys,
    total: keys.at(-1)[1],
    frames,
    landings: landings.map((l, i) => ({ ...l, tx, len: at[`land${i}`] })),
  };
}

// The point at `len` along the line, from its table.
function pointAt({ xs, ys, step }, len) {
  const f = Math.max(0, len) / step;
  const i = Math.min(xs.length - 2, Math.floor(f));
  const t = Math.min(1, f - i);
  return { x: xs[i] + (xs[i + 1] - xs[i]) * t, y: ys[i] + (ys[i + 1] - ys[i]) * t };
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
 * The flight thread: one line of light that ties the page together, in
 * the language of the logo's comet. It draws itself as you scroll, its head
 * riding a fixed height on screen: a white-hot core leads a burning mint
 * tail that cools behind it into the finished line, and the tail stretches
 * and the head sheds sparks with the speed of the scroll. It lights a
 * keyframe wherever a pinned
 * section changes (with a burst), lands as a point on each section's
 * eyebrow (which lights in answer, data-landed) and finishes at the
 * footer's playhead (data-arrived on the footer). With reduced motion it is
 * drawn whole, still, and everything has landed.
 */
export function FlightThread({ pageRef }) {
  const [geo, setGeo] = useState(null);
  const svgRef = useRef(null);
  const baseRef = useRef(null);
  const glowRef = useRef(null);
  const hotRef = useRef(null);
  const coreRef = useRef(null);
  const headRef = useRef(null);
  const canvasRef = useRef(null);

  // Lay the line out, and again whenever the page changes size.
  useEffect(() => {
    const page = pageRef.current;
    let frame = 0;
    const run = () => {
      frame = 0;
      setGeo(measure(page, baseRef.current));
    };
    const schedule = () => (frame ||= requestAnimationFrame(run));
    const observer = new ResizeObserver(schedule);
    observer.observe(page);
    const footer = document.querySelector("footer");
    if (footer) observer.observe(footer);
    document.fonts?.ready.then(schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [pageRef]);

  // Draw it to the scroll position, with the comet and its sparks.
  useEffect(() => {
    if (!geo) return;
    const svg = svgRef.current;
    const base = baseRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const trails = [
      [glowRef.current, 210],
      [hotRef.current, 110],
      [coreRef.current, 34],
    ];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = [...svg.querySelectorAll("[data-at]")];
    const marks = ["use-cases", "download"].map((id) => document.getElementById(id)?.querySelector("[data-landing]"));
    const footer = geo.footer;
    const total = geo.total;
    const sparks = [];
    const state = { len: null, v: 0, last: 0, debt: 0, raf: 0 };

    // The footer waits for the line, then plays its arrival (see SiteFooter).
    footer?.setAttribute("data-thread", "");

    const dash = `${total} ${total + 1}`;
    base.style.strokeDasharray = dash;

    // Page → screen.
    const screen = (x, yy) => [x, yy + geo.top0 - scrollY];

    function size() {
      const dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function burst(x, yy, n, power) {
      const [sx, sy] = screen(x, yy);
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.04 + Math.random() * 0.12) * power;
        sparks.push({ x: sx, y: sy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.03, age: 0, life: 500 + Math.random() * 700, r: 0.8 + Math.random() * 1.4, hot: Math.random() < 0.35 });
      }
    }

    function paint(len, v, dt) {
      const flying = len > 0.5 && len < total - 0.5;
      base.style.strokeDashoffset = String(total - len);

      // The comet's tail: windows of the line ending at the head, longer
      // the faster it moves.
      const stretch = clamp(0.55 + v * 1.1, 0.55, 2.6);
      for (const [el, length] of trails) {
        const l = Math.min(len, length * stretch);
        el.style.strokeDasharray = `${f(l)} ${total + 1}`;
        el.style.strokeDashoffset = f(-(len - l));
        el.style.opacity = flying ? String(clamp(0.45 + v * 1.4, 0.45, 1)) : "0";
      }

      const head = headRef.current;
      head.toggleAttribute("data-on", flying);
      let p = null;
      if (flying) {
        p = pointAt(geo.points, len);
        head.setAttribute("transform", `translate(${f(p.x)} ${f(p.y)}) scale(${f(clamp(0.8 + v * 0.8, 0.8, 1.8))})`);
      }

      // Sparks shed from the head while it moves.
      if (p && dt && v > 0.06 && !reduced) {
        const back = pointAt(geo.points, len - 8);
        const dx = p.x - back.x;
        const dy = p.y - back.y;
        const n = Math.hypot(dx, dy) || 1;
        state.debt += Math.min(5, v * 1.6) * (dt / 16);
        const [sx, sy] = screen(p.x, p.y);
        while (state.debt >= 1) {
          state.debt -= 1;
          sparks.push({
            x: sx + (Math.random() - 0.5) * 3,
            y: sy + (Math.random() - 0.5) * 3,
            vx: (-dx / n) * (0.02 + Math.random() * 0.05) + (Math.random() - 0.5) * 0.06,
            vy: (-dy / n) * (0.02 + Math.random() * 0.05) + (Math.random() - 0.5) * 0.06,
            age: 0,
            life: 450 + Math.random() * 650,
            r: 0.7 + Math.random() * 1.3,
            hot: Math.random() < 0.3,
          });
        }
      }

      // Keyframes, landings and the footer, as the head passes them.
      const forward = state.len !== null && len > state.len;
      footer?.toggleAttribute("data-arrived", len >= total - 0.5);
      if (forward && state.len < total - 0.5 && len >= total - 0.5 && geo.stop) burst(geo.stop.x, geo.stop.y, 26, 1.2);
      for (const point of points) {
        const on = len >= Number(point.dataset.at) - 0.5;
        if (on === point.hasAttribute("data-landed")) continue;
        point.toggleAttribute("data-landed", on);
        const mark = marks[point.dataset.mark];
        if (mark) mark.toggleAttribute("data-landed", on);
        if (on && forward && !reduced) {
          const big = point.dataset.mark !== undefined;
          burst(Number(point.dataset.x), Number(point.dataset.y), big ? 22 : 9, big ? 1.1 : 0.7);
        }
      }
      state.len = len;
    }

    function drawSparks(dt) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        s.vy += 0.00022 * dt;
        s.vx *= 0.985;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const k = 1 - s.age / s.life;
        ctx.fillStyle = `rgba(95, 224, 176, ${(k * 0.35).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.hot ? `rgba(234, 255, 246, ${k.toFixed(3)})` : `rgba(130, 232, 194, ${k.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function target() {
      return reduced ? total : lengthAt(geo.keys, scrollY - geo.top0 + innerHeight * HEAD);
    }

    // One loop that runs while the line moves or sparks are alive.
    let lastY = scrollY;
    function frame(now) {
      const dt = Math.min(48, now - (state.last || now));
      state.last = now;
      const len = target();
      const moved = state.len === null ? 0 : Math.abs(len - state.len);
      const shift = scrollY - lastY;
      lastY = scrollY;
      // Speed in px/ms, smoothed, from the line's own progress.
      state.v += ((dt ? moved / dt : 0) - state.v) * 0.2;
      paint(len, state.v, dt);
      // Sparks live on screen: carry them with the page.
      if (shift) for (const s of sparks) s.y -= shift;
      drawSparks(dt);
      state.raf = state.v > 0.01 || sparks.length ? requestAnimationFrame(frame) : 0;
      if (!state.raf) {
        state.last = 0;
        paint(len, 0, 0);
      }
    }
    const kick = () => {
      if (!state.raf) state.raf = requestAnimationFrame(frame);
    };

    size();
    paint(target(), 0, 0);
    svg.setAttribute("data-ready", "");
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(state.raf);
      removeEventListener("scroll", kick);
      removeEventListener("resize", size);
      footer?.removeAttribute("data-thread");
      footer?.removeAttribute("data-arrived");
    };
  }, [geo]);

  return (
    <>
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
          <radialGradient id="thread-core">
            <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="0.35" stopColor="#eafff6" stopOpacity="0.9" />
            <stop offset="1" stopColor="#5fe0b0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {geo ? <path d={geo.d} className={styles.track} /> : null}
        <path ref={baseRef} d={geo?.d} className={styles.base} />
        <path ref={glowRef} d={geo?.d} className={styles.glowTrail} />
        <path ref={hotRef} d={geo?.d} className={styles.hotTrail} />
        <path ref={coreRef} d={geo?.d} className={styles.coreTrail} />

        {geo?.frames.map((k, i) => (
          <g key={`k${i}`} className={styles.keyframe} data-at={k.len} data-x={k.x} data-y={k.y} transform={`translate(${f(k.x)} ${f(k.y)})`}>
            <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" />
          </g>
        ))}

        {geo?.landings.map((l, i) => (
          <g key={`l${i}`} className={styles.landing} data-at={l.len} data-mark={i} data-x={l.tx} data-y={l.y}>
            <path d={`M${f(l.tx + 7)} ${f(l.y)}H${f(l.x - 3)}`} className={styles.reach} pathLength="1" />
            <circle cx={l.tx} cy={l.y} r="60" fill="url(#thread-bloom)" className={styles.bloom} />
            <circle cx={l.tx} cy={l.y} r="14" className={styles.ring} />
            <circle cx={l.tx} cy={l.y} r="4.5" className={styles.point} />
          </g>
        ))}

        <g ref={headRef} className={styles.head}>
          <circle r="30" fill="url(#thread-bloom)" />
          <circle r="9" fill="url(#thread-core)" />
          <circle r="2.6" className={styles.headCore} />
        </g>
      </svg>
      <canvas ref={canvasRef} className={styles.sparks} aria-hidden="true" />
    </>
  );
}
