"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./integrations-hero.module.css";

const STEP = 2000; // ms per hand-off while the map plays
const WIDE = "(min-width: 861px)";

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// Where a connector leaves each side's chip.
const SIDES = { ai: "right", editors: "left", posts: "bottom", runs: "top" };

/**
 * A video at the centre of everything KeyFly connects to: a real film
 * (the skate montage) in a KeyFly player, on four even sides: where it
 * posts along the top, your AI down the left, your editor down the right,
 * where it runs along the bottom. Every chip is joined to the player's
 * nearest edge by a curved connector measured from the layout. Every 2s
 * one hand-off plays: a light runs in from an AI to the film and out to an
 * editor or a platform, both light up mint, the player pulses, and its
 * tags name them ("Edited with Claude Code", "→ Final Cut Pro"). The film
 * plays, and the hand-offs run, only while on screen; "Pause" holds both
 * (WCAG 2.2.2); reduced motion: still, on the poster. The groups are real
 * lists; at 860px and below they stack as rows under the player.
 */
export function OrbitMap({ label, center, film, pause, play, rings }) {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [wires, setWires] = useState(null);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);

  const auto = visible && !paused && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (auto) v.play().catch(() => {});
    else v.pause();
  }, [auto]);

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => setStep((s) => s + 1), STEP);
    return () => clearInterval(timer);
  }, [auto]);

  // Measure a connector from every chip to the player's nearest edge.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const wide = matchMedia(WIDE);
    const measure = () => {
      if (!wide.matches) return setWires(null);
      const box = stage.getBoundingClientRect();
      const hub = stage.querySelector("[data-hub]").getBoundingClientRect();
      const L = hub.left - box.left;
      const R = hub.right - box.left;
      const T = hub.top - box.top;
      const B = hub.bottom - box.top;
      // Each side's wires land on evenly spaced ports along the player's
      // facing edge (an even fan), with matching S-curves: they leave the
      // chip square to it and meet the player square to its edge.
      const counts = Object.fromEntries(Object.keys(SIDES).map((g) => [g, rings[g].items.length]));
      const port = (g, i) => {
        const n = counts[g];
        const t = (i + 0.5) / n;
        if (g === "ai" || g === "editors") {
          const pad = Math.min(28, (B - T) * 0.12);
          return [g === "ai" ? L : R, T + pad + (B - T - 2 * pad) * t];
        }
        const pad = Math.min(60, (R - L) * 0.14);
        return [L + pad + (R - L - 2 * pad) * t, g === "posts" ? T : B];
      };
      const paths = [...stage.querySelectorAll("[data-node]")].map((node) => {
        const [g, idx] = node.dataset.node.split(":");
        const r = node.firstElementChild.getBoundingClientRect();
        const side = SIDES[g];
        const x = side === "right" ? r.right - box.left : side === "left" ? r.left - box.left : r.left - box.left + r.width / 2;
        const y = side === "bottom" ? r.bottom - box.top : side === "top" ? r.top - box.top : r.top - box.top + r.height / 2;
        const [ex, ey] = port(g, Number(idx));
        const horizontal = side === "left" || side === "right";
        const c1 = horizontal ? [(x + ex) / 2, y] : [x, (y + ey) / 2];
        const c2 = horizontal ? [(x + ex) / 2, ey] : [ex, (y + ey) / 2];
        // Your AI is drawn chip → film, the rest film → chip, so the light
        // always runs the way the work goes.
        const d = g === "ai" ? `M ${x} ${y} C ${c1} ${c2} ${ex} ${ey}` : `M ${ex} ${ey} C ${c2} ${c1} ${x} ${y}`;
        return { key: node.dataset.node, d, a: [x, y], b: [ex, ey] };
      });
      setWires({ w: box.width, h: box.height, paths });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    wide.addEventListener("change", measure);
    // The map rises in on load; measure again once it has landed (and once
    // the fonts are in), since a moving box gives the wires the wrong ends.
    const root = rootRef.current;
    root.addEventListener("animationend", measure);
    document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", measure);
      root.removeEventListener("animationend", measure);
    };
  }, [rings]);

  const outs = [...rings.editors.items.map((_, i) => `editors:${i}`), ...rings.posts.items.map((_, i) => `posts:${i}`)];
  const live = auto || step > 0;
  const onIn = `ai:${step % rings.ai.items.length}`;
  const onOut = outs[(step * 3) % outs.length];
  const isOn = (key) => live && (key === onIn || key === onOut);
  // The names the player's tags show: the hand-off in play, or at rest the
  // first agent and editor.
  const nameOf = (key) => {
    const [g, i] = key.split(":");
    const it = rings[g].items[Number(i)];
    return typeof it === "string" ? it : it.name;
  };
  const inName = nameOf(live ? onIn : "ai:0");
  const outName = nameOf(live ? onOut : "editors:0");

  const group = (key, items, render) => (
    <div className={styles.group} data-g={key}>
      <p className={styles.groupLabel}>{rings[key].label}</p>
      <ul>
        {items.map((item, i) => (
          <li key={i} className={styles.node} data-node={`${key}:${i}`} data-on={isOn(`${key}:${i}`) ? "" : undefined}>
            {render(item)}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div ref={rootRef} className={styles.map}>
      <div ref={stageRef} className={styles.stage} role="group" aria-label={label}>
        {wires ? (
          <svg className={styles.spokes} viewBox={`0 0 ${wires.w} ${wires.h}`} aria-hidden="true">
            {/* Every wire, always drawn; the one in a hand-off turns mint. */}
            {wires.paths.map((p) => (
              <path key={p.key} d={p.d} className={styles.base} data-on={isOn(p.key) ? "" : undefined} />
            ))}
            {/* The light running along the wires in play, over their line. */}
            {wires.paths
              .filter((p) => isOn(p.key))
              .map((p) => (
                <path key={`${p.key}-${step}`} d={p.d} pathLength="1" className={styles.light} data-out={p.key.startsWith("ai") ? undefined : ""} />
              ))}
            {/* A port at each end: on the chip and on the player's edge. */}
            {wires.paths.map((p) => (
              <g key={`ports-${p.key}`} className={styles.ports} data-on={isOn(p.key) ? "" : undefined}>
                <circle cx={p.a[0]} cy={p.a[1]} r="2.5" />
                <circle cx={p.b[0]} cy={p.b[1]} r="3" />
              </g>
            ))}
          </svg>
        ) : null}

        {group("posts", rings.posts.items, (name) => <span className={styles.chip}>{name}</span>)}
        {group("ai", rings.ai.items, (item) => (
          <span className={styles.chip}>
            {item.name}
            <em data-free={item.note === "No AI minutes" ? "" : undefined}>{item.note}</em>
          </span>
        ))}

        <div className={styles.center} data-hub="" data-pulse={live ? step % 2 : undefined}>
          <video ref={videoRef} className={styles.film} src={film.src} poster={film.poster} muted loop playsInline preload="none" aria-hidden="true" />
          <span className={styles.badge}>
            <span className={styles.mark} aria-hidden="true" />
            <b>{center}</b>
          </span>
          <span className={styles.length} aria-hidden="true">
            {film.length}
          </span>
          <span className={styles.tags} aria-hidden="true">
            <span className={styles.tagIn} key={`in-${live ? onIn : "rest"}`}>
              <span className={styles.tagDot} />
              {film.edited} {inName}
            </span>
            <span className={styles.tagOut} key={`out-${live ? onOut : "rest"}`}>
              → {outName}
            </span>
          </span>
        </div>

        {group("editors", rings.editors.items, (item) => (
          <span className={styles.chip}>
            {item.name}
            <em>{item.note}</em>
          </span>
        ))}
        {group("runs", rings.runs.items, (name) => <span className={styles.chip}>{name}</span>)}
      </div>

      {reduced ? null : (
        <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
            {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
          {paused ? play : pause}
        </button>
      )}
    </div>
  );
}
