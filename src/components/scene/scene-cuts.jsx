"use client";

import { useEffect } from "react";

/**
 * Marks each section as arrived (data-cut) once the divider before it has
 * crossed the middle of the screen, and unmarks it on the way back up, so
 * its eyebrow lights as the divider's playhead finishes its sweep (see
 * Divider and globals.css), and plays the footer's arrival as it scrolls
 * in. One passive scroll listener, a lookup per
 * divider per frame, nothing while still. With reduced motion every
 * section is simply marked.
 */
export function SceneCuts({ pageRef }) {
  useEffect(() => {
    const page = pageRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    // The footer plays its arrival (playhead pulse, a comet round the
    // panel, its contents rising in; see SiteFooter) as it scrolls in.
    const footer = document.querySelector("footer");
    if (!reduced) footer?.setAttribute("data-thread", "");

    function update() {
      frame = 0;
      const middle = innerHeight * 0.5;
      const panel = footer?.querySelector("[data-thread-end]");
      if (panel && !reduced) footer.toggleAttribute("data-arrived", panel.getBoundingClientRect().top < innerHeight * 0.75);
      for (const divider of page.querySelectorAll("[data-divider]")) {
        const next = divider.nextElementSibling;
        if (!next) continue;
        next.toggleAttribute("data-cut", reduced || divider.getBoundingClientRect().top < middle);
      }
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      footer?.removeAttribute("data-thread");
      footer?.removeAttribute("data-arrived");
    };
  }, [pageRef]);

  return null;
}
