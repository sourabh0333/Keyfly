"use client";

import { useEffect } from "react";

/**
 * Shared play logic for drawn brand motion (FlightPath, AnimatedLogo).
 *
 * play:
 * - "load": animates on first paint from CSS alone (works without JS).
 * - "view": animates once when scrolled into view. The server HTML is the
 *   finished state, so nothing is hidden without JS or when it is already on
 *   screen at hydration.
 * - false:  static.
 *
 * Returns the server-rendered data-state; the hook then writes "armed" and
 * "play" straight to the element, so scrolling never re-renders React.
 */
export function usePlayState(ref, play) {
  useEffect(() => {
    const el = ref.current;
    if (play !== "view" || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen at hydration: leave it finished rather than flash it.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.state = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.state = "play";
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, play]);

  return play === "load" ? "play" : "static";
}
