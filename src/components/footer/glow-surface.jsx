"use client";

import { useEffect, useRef } from "react";
import styles from "./footer.module.css";

/**
 * A surface with a warm tungsten light that follows the pointer, like the
 * glow behind the app icon's landing point. The light is one element moved
 * with transform, so it never repaints the page. Mouse and trackpad only.
 */
export function GlowSurface({ as: Tag = "div", className, children, ...rest }) {
  const ref = useRef(null);
  const lightRef = useRef(null);

  useEffect(() => {
    const surface = ref.current;
    const light = lightRef.current;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!surface || !light || !canHover || reduced) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const move = (event) => {
      const box = surface.getBoundingClientRect();
      x = event.clientX - box.left;
      y = event.clientY - box.top;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          light.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          surface.dataset.glow = "";
        });
      }
    };

    const leave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      delete surface.dataset.glow;
    };

    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <Tag ref={ref} className={className} {...rest}>
      <span ref={lightRef} className={styles.light} aria-hidden="true" />
      {children}
    </Tag>
  );
}
