"use client";

import { useEffect, useRef } from "react";

const POINT_RADIUS = 11; // the mint point's radius in px (glance.module.css)

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (f) => f * f * (3 - 2 * f);
const pad = (n) => String(n).padStart(2, "0");

/**
 * Drives the glance section, writing straight to the DOM:
 * - the figures count up from 00 as the section rises into view;
 * - once pinned, the mint point grows (a circular clip on a mint layer, so
 *   its edge stays crisp) until it fills the frame, while the figures fade.
 * The section only becomes tall and pinned (data-live) once this runs;
 * without JS, and with reduced motion, it is one still frame with the
 * final figures.
 */
export function GlanceShell({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = ref.current;
    const figures = [...section.querySelectorAll("[data-figure]")];
    const fill = section.querySelector("[data-fill]");
    section.dataset.live = "true";

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // Count up while the section rises into view.
      const arrive = smooth(clamp((vh - rect.top) / vh / 0.85));
      figures.forEach((el) => {
        el.textContent = pad(Math.round(Number(el.dataset.figure) * arrive));
      });

      // Once pinned: the point grows to fill the frame; the figures fade.
      const p = clamp(-rect.top / Math.max(1, rect.height - vh));
      const grow = smooth(clamp((p - 0.3) / 0.6));
      const cover = Math.hypot(window.innerWidth, vh) / 2 + 4;
      const radius = POINT_RADIUS + (cover - POINT_RADIUS) * grow * grow;
      fill.style.clipPath = `circle(${radius.toFixed(1)}px at 50% 50%)`;
      section.style.setProperty("--fade", String(1 - clamp((p - 0.35) / 0.3)));
      section.dataset.growing = String(grow > 0);
      // Once the mint reaches the header's line, the header reads it as a
      // light surface and switches to Ink (HeaderShell follows data-tone).
      const reachesHeader = radius > Math.hypot(window.innerWidth / 2, vh / 2 - 36);
      if (reachesHeader) section.dataset.tone = "paper";
      else delete section.dataset.tone;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section ref={ref} className={className} aria-labelledby="glance-title" data-section="At a glance">
      {children}
    </section>
  );
}
