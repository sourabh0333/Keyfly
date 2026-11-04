"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./product-hero.module.css";

const STEP = 3000; // ms per stage of the tour
const WIDE = "(min-width: 1101px)"; // callouts beside the editor, with wires

// Which side of the editor each stage's callout sits on, top to bottom,
// next to the part it points at.
const LEFT = ["your-way", "brand", "footage"];
const RIGHT = ["deliver", "direct", "make"];

const pad = (n) => String(n).padStart(2, "0");
const WAVE = Array.from({ length: 46 }, (_, i) => 0.25 + ((Math.sin(i * 1.3) + Math.sin(i * 0.47) + 2) / 4) * 0.75);

const MOTION = "(prefers-reduced-motion: reduce)";
function subscribe(query) {
  return (callback) => {
    const list = matchMedia(query);
    list.addEventListener("change", callback);
    return () => list.removeEventListener("change", callback);
  };
}
const onMotion = subscribe(MOTION);

// An element's top-left in its positioned ancestor `root`, in layout
// pixels (unaffected by the stage's 3D tilt, which the wires share).
function offset(el, root) {
  let x = 0;
  let y = 0;
  for (let n = el; n && n !== root; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

/**
 * The hero's picture: an illustrative KeyFly editor (chrome with the
 * platforms and Export, the brand kit, the viewer, the AI director with the
 * prompt box, and the timeline), with the page's six stages as callouts
 * beside it, each wired to the part of the editor it explains.
 *
 * A tour lights one stage at a time (its callout, wire and part of the
 * editor) while on screen; pointing at or focusing a callout holds it, and
 * a button pauses it (WCAG 2.2.2). The wires are measured from layout
 * positions and redrawn on resize. Below 1101px the callouts become a list
 * under the editor and its parts carry their numbers instead of wires.
 * Reduced motion: no tour, nothing moves.
 */
export function Anatomy({ label, pause, play, stages, editor }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const [wires, setWires] = useState(null);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const stageRef = useRef(null);
  const windowRef = useRef(null);

  const auto = visible && !paused && !held && !reduced;
  const current = stages[active].id;
  const index = Object.fromEntries(stages.map((s, i) => [s.id, i]));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % stages.length), STEP);
    return () => clearInterval(timer);
  }, [auto, stages.length]);

  // Measure the wires: from each callout's inner edge, level to just beside
  // the editor, then straight to the near edge of its part (so they barely
  // cross the editor).
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const wide = matchMedia(WIDE);
    const measure = () => {
      if (!wide.matches) return setWires(null);
      const win = offset(windowRef.current, stage);
      const winRight = win.x + windowRef.current.offsetWidth;
      const paths = stages.map(({ id }) => {
        const spot = stage.querySelector(`[data-spot="${id}"]`);
        const call = stage.querySelector(`[data-callout="${id}"]`);
        const s = offset(spot, stage);
        const c = offset(call, stage);
        const left = LEFT.includes(id);
        const ax = left ? c.x + call.offsetWidth : c.x;
        const ay = c.y + call.offsetHeight / 2;
        const ex = left ? win.x - 18 : winRight + 18;
        const sx = left ? s.x : s.x + spot.offsetWidth;
        const sy = s.y + spot.offsetHeight / 2;
        return { id, d: `M ${ax} ${ay} H ${ex} L ${sx} ${sy}`, sx, sy };
      });
      setWires({ w: stage.offsetWidth, h: stage.offsetHeight, paths });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    wide.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", measure);
    };
  }, [stages]);

  function hold(i) {
    setActive(i);
    setHeld(true);
  }

  // Props for a part of the editor that a stage points at.
  const spot = (id) => ({
    "data-spot": id,
    "data-on": current === id ? "" : undefined,
  });
  const badge = (id) => <b className={styles.badge}>{pad(index[id] + 1)}</b>;

  const callout = (id) => {
    const i = index[id];
    const s = stages[i];
    return (
      <a
        key={id}
        href={s.href}
        data-callout={id}
        className={styles.callout}
        style={{ "--o": i }}
        data-on={i === active ? "" : undefined}
        onPointerEnter={(event) => event.pointerType === "mouse" && hold(i)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => hold(i)}
        onBlur={() => setHeld(false)}
      >
        <span className={styles.calloutHead}>
          <em>{pad(i + 1)}</em>
          {s.name}
        </span>
        <span className={styles.calloutLine}>{s.line}</span>
      </a>
    );
  };

  return (
    <div className={styles.anatomy} role="group" aria-label={label}>
      <div ref={stageRef} className={styles.stage} data-tour={auto ? "" : undefined} data-paused={visible ? undefined : ""}>
        {wires ? (
          <svg className={styles.wires} viewBox={`0 0 ${wires.w} ${wires.h}`} aria-hidden="true">
            {wires.paths.map((p) => (
              <g key={p.id} data-on={p.id === current ? "" : undefined}>
                <path d={p.d} pathLength="1" />
                <circle cx={p.sx} cy={p.sy} r="3.5" />
              </g>
            ))}
          </svg>
        ) : null}

        <div className={`${styles.side} ${styles.sideLeft}`}>{LEFT.map(callout)}</div>

        {/* The editor (illustrative). */}
        <div ref={windowRef} className={styles.window} aria-hidden="true">
          <div className={styles.chrome}>
            <span className={styles.dots}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.platforms} {...spot("your-way")}>
              {badge("your-way")}
              {editor.platforms}
            </span>
            <span className={styles.file}>
              {editor.file}
              <span> · KeyFly</span>
            </span>
            <span className={styles.export} {...spot("deliver")}>
              {badge("deliver")}
              {editor.export}
            </span>
          </div>

          <div className={styles.body}>
            <div className={styles.kit} {...spot("brand")}>
              {badge("brand")}
              <span className={styles.panelLabel}>{editor.brand.label}</span>
              <span className={styles.logo}>{editor.brand.logo}</span>
              <span className={styles.swatches}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className={styles.kitRow}>
                <b>Aa</b> {editor.brand.font}
              </span>
              <span className={styles.kitRow}>{editor.brand.voice}</span>
            </div>

            <div className={styles.viewer}>
              <Preview kind="launch" format="16:9" bleed />
            </div>

            <div className={styles.director}>
              <div className={styles.note} {...spot("direct")}>
                {badge("direct")}
                <span className={styles.panelLabel}>
                  <i />
                  {editor.director.label}
                </span>
                {editor.director.rows.map(([k, v]) => (
                  <span key={k} className={styles.noteRow}>
                    <em>{k}</em>
                    {v}
                  </span>
                ))}
              </div>
              <div className={styles.ask} {...spot("make")}>
                {badge("make")}
                <span>› {editor.ask}</span>
                <i />
              </div>
            </div>
          </div>

          <div className={styles.timeline}>
            <span className={styles.trackLabel}>{editor.tracks[0]}</span>
            <span className={`${styles.lane} ${styles.boards}`}>
              {[0, 1, 2, 3, 4].map((n) => (
                <i key={n} />
              ))}
            </span>
            <span className={styles.trackLabel}>{editor.tracks[1]}</span>
            <span className={`${styles.lane} ${styles.voice}`} {...spot("footage")}>
              {badge("footage")}
              {WAVE.map((h, n) => (
                <i key={n} style={{ "--h": h.toFixed(2) }} />
              ))}
              <b className={styles.cut} style={{ left: "31%" }} />
              <b className={styles.cut} style={{ left: "68%" }} />
            </span>
            <span className={styles.trackLabel}>{editor.tracks[2]}</span>
            <span className={`${styles.lane} ${styles.graphics}`}>
              <i style={{ left: "2%", width: "22%" }} />
              <i style={{ left: "40%", width: "18%" }} />
              <i style={{ left: "74%", width: "22%" }} />
            </span>
            <span className={styles.trackLabel}>{editor.tracks[3]}</span>
            <span className={`${styles.lane} ${styles.music}`} />
            <span className={styles.playhead} />
          </div>
        </div>

        <div className={`${styles.side} ${styles.sideRight}`}>{RIGHT.map(callout)}</div>
      </div>

      {reduced ? null : (
        <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
          {paused ? play : pause}
        </button>
      )}
    </div>
  );
}
