"use client";

import { useEffect, useRef } from "react";
import styles from "./focus.module.css";

/**
 * The links between sections, and the focus pull when one arrives (see
 * Divider). One passive scroll listener, a lookup per link per frame,
 * nothing while still.
 *
 * - Each link draws up to a tip riding the middle of the screen (--d).
 * - Each section's main content ([data-main]) waits out of focus (soft and
 *   dim, while the page has data-focus-ready); when its link is drawn
 *   whole it racks into focus (data-lit), and autofocus brackets snap in
 *   around it, flash mint and fade. Scrolling back resets it, so it
 *   replays.
 * - Sections are marked data-cut once the divider before them crosses the
 *   middle of the screen (their eyebrow mark draws out).
 * - The footer plays its arrival as it scrolls in.
 *
 * With reduced motion the links are drawn, everything is in focus and
 * marked, and the footer simply shows.
 */
export function SceneCuts({ pageRef }) {
  const afRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    const af = afRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let afTimer = 0;

    const footer = document.querySelector("footer");
    if (!reduced) {
      footer?.setAttribute("data-thread", "");
      page.setAttribute("data-focus-ready", "");
    }

    const links = [...page.querySelectorAll("[data-link]")].map((el) => ({
      line: el.querySelector("[data-link-line]"),
      main: el.nextElementSibling?.querySelector("[data-main]"),
    }));

    // Autofocus brackets: placed in page coordinates around the subject
    // (so they scroll with it), wide first, then snapped in on the next
    // frame; they flash and fade by CSS.
    function lockOn(main) {
      const box = main.getBoundingClientRect();
      const top0 = page.getBoundingClientRect().top;
      const left0 = page.getBoundingClientRect().left;
      const set = (pad) => {
        af.style.transform = `translate(${(box.left - left0 - pad).toFixed(1)}px, ${(box.top - top0 - pad).toFixed(1)}px)`;
        af.style.width = `${(box.width + pad * 2).toFixed(1)}px`;
        af.style.height = `${(box.height + pad * 2).toFixed(1)}px`;
      };
      af.removeAttribute("data-on");
      af.setAttribute("data-wide", "");
      set(innerWidth < 640 ? 22 : 44);
      void af.offsetWidth; // start the snap from the wide box
      af.removeAttribute("data-wide");
      af.setAttribute("data-on", "");
      set(innerWidth < 640 ? 6 : 10);
      clearTimeout(afTimer);
      afTimer = setTimeout(() => af.removeAttribute("data-on"), 1300);
    }

    function update() {
      frame = 0;
      const middle = innerHeight * 0.5;
      const tip = innerHeight * 0.5;
      for (const { line, main } of links) {
        const r = line.getBoundingClientRect();
        const d = reduced ? 1 : Math.min(1, Math.max(0, (tip - r.top) / Math.max(1, r.height)));
        line.style.setProperty("--d", d.toFixed(4));
        line.toggleAttribute("data-done", d >= 1);
        if (main && !reduced) {
          const was = main.hasAttribute("data-lit");
          const now = d >= 1;
          if (now !== was) {
            main.toggleAttribute("data-lit", now);
            if (now) lockOn(main);
          }
        }
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

    // Anything already past on load is in focus at once (no brackets).
    for (const { line, main } of links) {
      if (main && line.getBoundingClientRect().bottom < innerHeight * 0.5) main.setAttribute("data-lit", "");
    }
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(afTimer);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      footer?.removeAttribute("data-thread");
      footer?.removeAttribute("data-arrived");
      page.removeAttribute("data-focus-ready");
    };
  }, [pageRef]);

  return (
    <span ref={afRef} className={styles.af} aria-hidden="true">
      <i data-c="tl" />
      <i data-c="tr" />
      <i data-c="bl" />
      <i data-c="br" />
    </span>
  );
}
