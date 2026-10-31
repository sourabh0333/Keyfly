"use client";

import { useEffect, useRef } from "react";
import { LightField } from "./light-field";
import styles from "./scene.module.css";

// Section id → the light layer it brings up.
const SCENES = [
  ["product", "how"],
  ["use-cases", "cases"],
  ["download", "land"],
];

/**
 * The page's light, behind every section: the night is never flat black.
 * LightField draws it live on the GPU; these CSS layers are its fallback
 * (no WebGL), each section bringing up its own light as it fills the
 * screen: dusk for "How it works", the colours of the feed on air for "Use
 * cases" and the mint of the landing for "Download" (weights as --w).
 *
 * It also cues the footer: data-await while the page is above it, and
 * data-arrived once it is well into view, which plays its arrival.
 */
export function SceneLight() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const layers = SCENES.map(([id, key]) => [document.getElementById(id), root.querySelector(`[data-scene="${key}"]`)]);
    const footer = document.querySelector("footer");
    footer?.setAttribute("data-await", "");
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
      footer?.toggleAttribute("data-arrived", footer.getBoundingClientRect().top < vh * 0.55);
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      footer?.removeAttribute("data-await");
      footer?.removeAttribute("data-arrived");
    };
  }, []);

  return (
    <div ref={ref} className={styles.light} aria-hidden="true">
      <div className={styles.layer} data-scene="how" />
      <div className={styles.layer} data-scene="cases" />
      <div className={styles.layer} data-scene="land" />
      <LightField />
    </div>
  );
}
