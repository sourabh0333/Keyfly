"use client";

import { useEffect } from "react";

/**
 * Reveals an element once when it scrolls into view, by writing
 * data-reveal="armed" (hidden, below the fold) and then "play". Server HTML
 * has no data-reveal, so content is always visible without JS, and anything
 * already on screen at hydration is left alone rather than flashed.
 * Reduced motion: nothing is hidden.
 */
export function useReveal(ref, { threshold = 0.25 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    el.dataset.reveal = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "play";
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
}
