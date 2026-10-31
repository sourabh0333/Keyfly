"use client";

import { useEffect, useRef } from "react";

/**
 * Pauses every CSS animation inside its parent while the parent is off
 * screen (data-offscreen on the parent; see globals.css), so sections
 * scrolled past cost nothing. Renders an empty, hidden marker.
 */
export function PauseOffscreen({ margin = "200px" }) {
  const ref = useRef(null);

  useEffect(() => {
    const target = ref.current.parentElement;
    const observer = new IntersectionObserver(([entry]) => target.toggleAttribute("data-offscreen", !entry.isIntersecting), { rootMargin: margin });
    observer.observe(target);
    return () => {
      observer.disconnect();
      target.removeAttribute("data-offscreen");
    };
  }, [margin]);

  return <span ref={ref} hidden />;
}
