"use client";

import { useEffect, useRef } from "react";

/**
 * Sets data-play on its parent the first time the parent is well on
 * screen, so a CSS-only loop starts from its beginning where people can
 * see it. Never with reduced motion: then the parent keeps its finished,
 * still state. Renders an empty, hidden marker.
 */
export function PlayOnView({ threshold = 0.35 }) {
  const ref = useRef(null);

  useEffect(() => {
    const target = ref.current.parentElement;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      target.setAttribute("data-play", "");
      observer.disconnect();
    }, { threshold });
    observer.observe(target);
    return () => observer.disconnect();
  }, [threshold]);

  return <span ref={ref} hidden />;
}
