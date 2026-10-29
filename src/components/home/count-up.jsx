"use client";

import { useEffect, useRef } from "react";

/**
 * A number that counts from 0 to `to` once it is in view, in step with a
 * CSS animation of the same duration. Server HTML shows the final value.
 */
export function CountUp({ to, duration = 2600, delay = 0, suffix = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let timer = 0;
    el.textContent = `0${suffix}`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = setTimeout(() => {
          const start = performance.now();
          const tick = (now) => {
            const f = Math.min(1, (now - start) / duration);
            const eased = 1 - (1 - f) ** 3;
            el.textContent = `${Math.round(eased * to)}${suffix}`;
            if (f < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [to, duration, delay, suffix]);

  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  );
}
