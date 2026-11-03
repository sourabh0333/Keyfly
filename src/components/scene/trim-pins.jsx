"use client";

import { useEffect } from "react";

// The sticky element inside a pinned track (the track itself has
// data-live; How it works pins its own section).
function pinOf(track) {
  for (const el of track.querySelectorAll("*")) {
    if (getComputedStyle(el).position === "sticky") return el;
  }
  return null;
}

/**
 * Evens out the gaps between sections. A pinned section's stage sits at
 * the top of a pin as tall as the screen, so it leaves empty space below
 * its content, and the gap to the next section (and its divider) would be
 * that much bigger than elsewhere. For every pinned track on the page,
 * this measures the empty space and takes it off the track's bottom margin.
 * Re-measured on resize and whenever a track pins or unpins.
 */
export function TrimPins({ pageRef }) {
  useEffect(() => {
    const page = pageRef.current;
    let frame = 0;

    function trim() {
      frame = 0;
      for (const track of page.querySelectorAll("[data-trim]")) {
        track.style.marginBottom = "";
        track.removeAttribute("data-trim");
      }
      for (const track of page.querySelectorAll("[data-live]")) {
        const pin = pinOf(track);
        if (!pin) continue;
        const bottom = Math.max(...[...pin.children].map((c) => c.getBoundingClientRect().bottom));
        const spare = Math.max(0, pin.getBoundingClientRect().bottom - bottom);
        const base = parseFloat(getComputedStyle(track).marginBottom) || 0;
        track.style.marginBottom = `${base - spare}px`;
        track.setAttribute("data-trim", "");
      }
    }
    const schedule = () => (frame ||= requestAnimationFrame(trim));

    schedule();
    addEventListener("resize", schedule);
    const observer = new MutationObserver(schedule);
    observer.observe(page, { attributes: true, attributeFilter: ["data-live"], subtree: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [pageRef]);

  return null;
}
