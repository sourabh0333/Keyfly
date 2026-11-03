"use client";

import { useEffect } from "react";

/**
 * Draws the links between sections as you scroll (see Divider) and lights
 * each section's main content when its link arrives. Marks each section as
 * arrived (data-cut) once the divider before it has
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

    // The links between sections: drawn up to a tip riding 62% down the
    // screen; when one is drawn whole, the next section's main content
    // lights (and unlights on the way back, so it replays).
    const links = [...page.querySelectorAll("[data-link]")].map((el) => ({
      line: el.querySelector("[data-link-line]"),
      main: el.nextElementSibling?.querySelector("[data-main]"),
    }));

    function update() {
      frame = 0;
      const middle = innerHeight * 0.5;
      const tip = innerHeight * 0.62;
      for (const { line, main } of links) {
        const r = line.getBoundingClientRect();
        const d = reduced ? 1 : Math.min(1, Math.max(0, (tip - r.top) / Math.max(1, r.height)));
        line.style.setProperty("--d", d.toFixed(4));
        line.toggleAttribute("data-done", d >= 1);
        if (main && !reduced) main.toggleAttribute("data-lit", d >= 1);
      }
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
