"use client";

import { useEffect, useRef } from "react";
import styles from "./scene.module.css";

// Section id → the light layer it brings up.
const SCENES = [
  ["product", "how"],
  ["use-cases", "cases"],
  ["download", "land"],
];

/**
 * The page's light, behind every section: the night is never flat black.
 * Each section brings up its own light as it fills the screen and hands
 * over to the next as you scroll: dusk for "How it works", the colours of
 * the feed on air for "Use cases" and the mint of the landing for
 * "Download". The weights are written as --w on each layer.
 */
export function SceneLight() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const layers = SCENES.map(([id, key]) => [document.getElementById(id), root.querySelector(`[data-scene="${key}"]`)]);
    let frame = 0;

    function update() {
      frame = 0;
      const vh = innerHeight;
      for (const [section, layer] of layers) {
        if (!section || !layer) continue;
        const r = section.getBoundingClientRect();
        const seen = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / vh;
        layer.style.setProperty("--w", Math.min(1, seen * 1.25).toFixed(3));
      }
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={ref} className={styles.light} aria-hidden="true">
      <div className={styles.layer} data-scene="how" />
      <div className={styles.layer} data-scene="cases" />
      <div className={styles.layer} data-scene="land" />
    </div>
  );
}
