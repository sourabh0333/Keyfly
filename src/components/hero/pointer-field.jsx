"use client";

import { useEffect, useRef } from "react";

/**
 * Follows the pointer over its parent and writes the position to the
 * parent as CSS variables: --mx/--my in pixels and --nx/--ny from -1 to 1.
 * The hero uses them for a soft light and a slight tilt of the timeline.
 * Fine pointers only, and off with reduced motion.
 */
export function PointerField({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const write = () => {
      frame = 0;
      const box = host.getBoundingClientRect();
      host.style.setProperty("--mx", `${x - box.left}px`);
      host.style.setProperty("--my", `${y - box.top}px`);
      host.style.setProperty("--nx", (((x - box.left) / box.width) * 2 - 1).toFixed(3));
      host.style.setProperty("--ny", (((y - box.top) / box.height) * 2 - 1).toFixed(3));
    };
    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      host.dataset.pointer = "";
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onLeave = () => delete host.dataset.pointer;

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className={className} aria-hidden="true" />;
}
