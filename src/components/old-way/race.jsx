"use client";

import { useEffect, useRef } from "react";
import styles from "./old-way.module.css";

const LOOP = 9000; // ms: one race
const TYPE = [0, 800]; // the sentence types in
const FLY = [900, 2100]; // Keyfly's line, from the sentence to the first cut
const HAND_END = 0.38; // how far round by hand gets in one loop
const FADE = 8500; // both fade before the loop starts again

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const f = (n) => Math.round(n * 10) / 10;

/**
 * The long way round: from the start (u0) to the finish (u1) along the
 * axis, with six chores, each a loop-the-loop (a full circle of radius r
 * standing on the line, above and below in turn) with its stop at the
 * loop's foot and its label on the other side of the line. Points are in
 * (u, v) space, mapped to (x, y) by `at`; `flip` mirrors the arcs' sweep
 * when the mapping swaps the axes.
 */
function longWay(u0, u1, v0, r, at, flip) {
  const n = 8; // a straight run in, six loops, a straight run out
  const d = (u1 - u0) / n;
  const P = (u, v) => at(u, v).map(f).join(" ");
  const stops = [];
  let path = `M${P(u0, v0)}`;
  for (let i = 0; i < n; i++) {
    const a = u0 + i * d;
    const b = a + d;
    if (i === 0 || i === n - 1) {
      path += `L${P(b, v0)}`;
      continue;
    }
    const s = i % 2 ? 1 : -1; // loop above, then below
    const c = a + d / 2;
    // Moving forward, a loop above turns against the clock (sweep 0).
    const sweep = (s > 0 ? 0 : 1) ^ (flip ? 1 : 0);
    path += `L${P(c, v0)}A${f(r)} ${f(r)} 0 0 ${sweep} ${P(c, v0 - 2 * s * r)}A${f(r)} ${f(r)} 0 0 ${sweep} ${P(c, v0)}L${P(b, v0)}`;
    stops.push({ xy: at(c, v0), side: s }); // label on the other side (see the CSS)
  }
  return { path, stops };
}

// Two layouts: across (wide screens) and down (phones).
const ACROSS = (() => {
  const W = 1200;
  const H = 350;
  const at = (u, v) => [u, v];
  const hand = longWay(220, 1160, 130, 28, at, false);
  return { W, H, hand, key: { path: `M220 300H1160`, start: [220, 300], end: [1160, 300] }, start: [220, 130], guides: [220, 1160], axis: "x" };
})();
const DOWN = (() => {
  const W = 360;
  const H = 760;
  const at = (u, v) => [v, u];
  const hand = longWay(70, 700, 236, 30, at, true);
  return { W, H, hand, key: { path: `M64 70V700`, start: [64, 70], end: [64, 700] }, start: [236, 70], guides: [70, 700], axis: "y" };
})();

function Layout({ g, name, hand, keyfly, chores, start, finish, ask }) {
  const pct = ([x, y]) => ({ left: `${(x / g.W) * 100}%`, top: `${(y / g.H) * 100}%` });
  return (
    <div className={styles.layout} data-layout={name} style={{ aspectRatio: `${g.W} / ${g.H}` }}>
      <svg viewBox={`0 0 ${g.W} ${g.H}`} className={styles.svg} aria-hidden="true">
        <defs>
          <radialGradient id={`glow-${name}`}>
            <stop offset="0" stopColor="#5FE0B0" stopOpacity="0.55" />
            <stop offset="1" stopColor="#5FE0B0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`dim-${name}`}>
            <stop offset="0" stopColor="#F4F1EA" stopOpacity="0.35" />
            <stop offset="1" stopColor="#F4F1EA" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Start and finish: two faint guides, as on a ruler. */}
        {g.guides.map((u) =>
          g.axis === "x" ? (
            <line key={u} className={styles.guide} x1={u} y1="20" x2={u} y2={g.H - 20} />
          ) : (
            <line key={u} className={styles.guide} x1="20" y1={u} x2={g.W - 20} y2={u} />
          ),
        )}

        {/* By hand: the whole way round, faint; then what's been done. */}
        <path className={styles.route} d={g.hand.path} />
        <path className={styles.handLine} d={g.hand.path} pathLength="1" data-line="hand" style={{ strokeDashoffset: 1 - HAND_END }} />
        {g.hand.stops.map((s, i) => (
          <circle key={i} className={styles.stop} cx={s.xy[0]} cy={s.xy[1]} r="5" data-stop={i} data-done={i < 2 ? "" : undefined} />
        ))}

        {/* With Keyfly: straight there. */}
        <path className={styles.route} d={g.key.path} />
        <path className={styles.keyLine} d={g.key.path} pathLength="1" data-line="key" />
        <circle className={styles.dot} cx={g.key.start[0]} cy={g.key.start[1]} r="5" />
        <g className={styles.landing} transform={`translate(${g.key.end[0]} ${g.key.end[1]})`}>
          <circle className={styles.ring} r="10" />
          <circle className={styles.point} r="7" />
        </g>

        {/* The comets. */}
        <g className={styles.headHand} data-head="hand" transform={`translate(${g.start[0]} ${g.start[1]})`}>
          <circle r="16" fill={`url(#dim-${name})`} />
          <circle r="4" className={styles.headCoreDim} />
        </g>
        <g className={styles.headKey} data-head="key" transform={`translate(${g.key.end[0]} ${g.key.end[1]})`}>
          <circle r="22" fill={`url(#glow-${name})`} />
          <circle r="4.5" className={styles.headCore} />
        </g>
      </svg>

      {/* Labels, placed in the same coordinates. */}
      <span className={`${styles.label} ${styles.edge}`} style={pct(g.axis === "x" ? [g.guides[0], 0] : [g.W, g.guides[0]])} data-edge="start">
        {start}
      </span>
      <span className={`${styles.label} ${styles.edge}`} style={pct(g.axis === "x" ? [g.guides[1], 0] : [g.W, g.guides[1]])} data-edge="finish">
        {finish}
      </span>
      <span className={`${styles.label} ${styles.who}`} style={pct(g.start)} data-who="hand">
        {hand.label}
        <i>
          <b />
          {hand.busy}
        </i>
      </span>
      <span className={`${styles.label} ${styles.who} ${styles.whoKey}`} style={pct(g.key.start)} data-who="key">
        {keyfly.label}
        <i>
          <b />
          {keyfly.short}
        </i>
      </span>
      <span className={`${styles.label} ${styles.ask}`} style={pct(g.key.start)}>
        <span className={styles.chevron}>›</span>
        <span data-ask="">{ask}</span>
      </span>
      {g.hand.stops.map((s, i) => (
        <span key={i} className={`${styles.label} ${styles.chore}`} style={pct(s.xy)} data-side={s.side} data-chore={i} data-done={i < 2 ? "" : undefined}>
          <em>{String(i + 1).padStart(2, "0")}</em> {chores[i]}
        </span>
      ))}
      <span className={`${styles.label} ${styles.done}`} style={pct(g.key.end)}>
        <i />
        {keyfly.done}
      </span>
    </div>
  );
}

/**
 * Two flight paths from the same start to the same finish. By hand, a
 * long way round that loops through six chores; with Keyfly, one sentence
 * and a straight line to the first cut. A comet runs each at once: Keyfly
 * lands with a ring while by hand is still looping around its first stops.
 *
 * Drawn with pathLength="1" dashes; the heads follow tables of points
 * sampled once per layout. It runs only while on screen; with reduced
 * motion (and before JS) it shows that moment, still.
 */
export function Race(props) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let t0 = 0;
    let running = false;
    let layout = null;

    // The layout on show, with its paths sampled into tables of points.
    function measure() {
      const el = [...root.querySelectorAll("[data-layout]")].find((l) => l.offsetParent);
      if (!el) return null;
      const sample = (path) => {
        const len = path.getTotalLength();
        return Array.from({ length: 401 }, (_, i) => path.getPointAtLength((i / 400) * len));
      };
      const hand = el.querySelector('[data-line="hand"]');
      const key = el.querySelector('[data-line="key"]');
      const handPts = sample(hand);
      // Where along the long way each stop sits.
      const stops = [...el.querySelectorAll("[data-stop]")].map((c) => {
        const x = +c.getAttribute("cx");
        const y = +c.getAttribute("cy");
        let best = 0;
        handPts.forEach((p, i) => {
          if (Math.hypot(p.x - x, p.y - y) < Math.hypot(handPts[best].x - x, handPts[best].y - y)) best = i;
        });
        return best / 400;
      });
      return {
        el,
        hand,
        key,
        handPts,
        keyPts: sample(key),
        heads: { hand: el.querySelector('[data-head="hand"]'), key: el.querySelector('[data-head="key"]') },
        stops,
        stopEls: [...el.querySelectorAll("[data-stop]")],
        choreEls: [...el.querySelectorAll("[data-chore]")],
        ask: el.querySelector("[data-ask]"),
        askText: props.ask,
      };
    }

    const place = (head, pts, p) => {
      const pt = pts[Math.round(clamp01(p) * 400)];
      head.setAttribute("transform", `translate(${f(pt.x)} ${f(pt.y)})`);
    };

    function frame(now) {
      if (!layout) layout = measure();
      if (!layout) return;
      const t = (now - t0) % LOOP;
      const L = layout;
      const typed = clamp01((t - TYPE[0]) / (TYPE[1] - TYPE[0]));
      L.ask.textContent = L.askText.slice(0, Math.round(typed * L.askText.length));
      const pk = ease(clamp01((t - FLY[0]) / (FLY[1] - FLY[0])));
      const ph = (t / FADE) * HAND_END;
      L.key.style.strokeDashoffset = 1 - pk;
      L.hand.style.strokeDashoffset = 1 - Math.min(ph, HAND_END);
      place(L.heads.key, L.keyPts, pk);
      place(L.heads.hand, L.handPts, Math.min(ph, HAND_END));
      L.stops.forEach((s, i) => {
        const on = ph >= s;
        L.stopEls[i].toggleAttribute("data-done", on);
        L.choreEls[i].toggleAttribute("data-done", on);
      });
      root.toggleAttribute("data-landed", t >= FLY[1]);
      root.toggleAttribute("data-fading", t >= FADE);
      raf = requestAnimationFrame(frame);
    }

    function startRun() {
      if (running) return;
      running = true;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stopRun() {
      running = false;
      cancelAnimationFrame(raf);
    }

    // The moment that says it, still: Keyfly landed, by hand a little way
    // round. Shown before the loop starts, and instead of it with reduced
    // motion.
    function still() {
      layout = measure();
      if (!layout) return;
      place(layout.heads.key, layout.keyPts, 1);
      place(layout.heads.hand, layout.handPts, HAND_END);
      root.setAttribute("data-landed", "");
      root.setAttribute("data-live", "");
    }

    still();
    if (reduced) {
      const ro = new ResizeObserver(still);
      ro.observe(root);
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? startRun() : stopRun()), { threshold: 0.35 });
    io.observe(root);
    const ro = new ResizeObserver(() => {
      layout = null;
    });
    ro.observe(root);
    return () => {
      stopRun();
      io.disconnect();
      ro.disconnect();
    };
  }, [props.ask]);

  return (
    <div ref={rootRef} className={styles.race} data-landed="">
      <Layout g={ACROSS} name="across" {...props} />
      <Layout g={DOWN} name="down" {...props} />
    </div>
  );
}
