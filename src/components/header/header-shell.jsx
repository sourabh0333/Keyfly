"use client";

import { useEffect, useRef } from "react";

/**
 * The fixed <header> element plus two pieces of state, written straight to
 * data attributes (no React re-renders while scrolling):
 * - data-scrolled: the page has left the top, so the frosted band shows.
 * - data-tone: the tone of whatever is under the header, so it turns to
 *   Paper-on-Night over dark sections and back again.
 */
export function HeaderShell({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const header = ref.current;
    let frame = 0;

    const update = () => {
      frame = 0;
      header.dataset.scrolled = String(window.scrollY > 8);

      const probeY = header.getBoundingClientRect().height / 2;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, probeY)
        .find((el) => !header.contains(el));
      header.dataset.tone = under?.closest("[data-tone]")?.dataset.tone ?? "night";
    };

    // A frame late on purpose: sections that change their own tone on
    // scroll (the glance section's mint) have done so by then.
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(update);
      });
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
    <header ref={ref} className={className} data-tone="night" data-scrolled="false">
      {children}
    </header>
  );
}
