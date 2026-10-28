"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import styles from "./magnetic.module.css";

/**
 * Lets a call to action lean gently toward the pointer. Mouse and trackpad
 * only; touch devices and reduced motion get a still button.
 */
export function Magnetic({ children, strength = 0.28, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !canHover || reduced) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const move = (event) => {
      const box = el.getBoundingClientRect();
      x = (event.clientX - (box.left + box.width / 2)) * strength;
      y = (event.clientY - (box.top + box.height / 2)) * strength;
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
      }
    };

    const leave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      el.style.transform = "";
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={cx(styles.magnetic, className)}>
      {children}
    </span>
  );
}
