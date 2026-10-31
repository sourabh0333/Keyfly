"use client";

import { useEffect } from "react";

const REACH = 220; // px: how near the pointer must be for an edge to light

/**
 * Spotlight edges: every element marked data-spotlight gets a fine mint
 * edge light that follows the pointer while it is near (see
 * motion.module.css), by --sx/--sy (the pointer, in the element's own
 * coordinates) and --so (its strength). Fine pointers only; renders
 * nothing.
 */
export function Spotlight() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let point = null;

    function update() {
      frame = 0;
      for (const el of document.querySelectorAll("[data-spotlight]")) {
        const r = el.getBoundingClientRect();
        if (!point || r.bottom < 0 || r.top > innerHeight) {
          el.style.setProperty("--so", "0");
          continue;
        }
        const dx = Math.max(r.left - point.x, 0, point.x - r.right);
        const dy = Math.max(r.top - point.y, 0, point.y - r.bottom);
        const near = 1 - Math.min(1, Math.hypot(dx, dy) / REACH);
        el.style.setProperty("--sx", `${(point.x - r.left).toFixed(0)}px`);
        el.style.setProperty("--sy", `${(point.y - r.top).toFixed(0)}px`);
        el.style.setProperty("--so", near.toFixed(2));
      }
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));
    const onMove = (event) => {
      point = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const onLeave = () => {
      point = null;
      schedule();
    };

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", schedule, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", schedule);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
