"use client";

import { useEffect } from "react";

const STEP = 3; // px between the samples of a link's curve

/**
 * The links between sections, and the focus pull when one arrives (see
 * Divider). One passive scroll listener, a lookup per link per frame,
 * nothing while still.
 *
 * - Each link is a flight path shaped to its gap: out to one side, back
 *   through the playhead on the ruler, out to the other side and home
 *   (gaps alternate). It is sampled once (and on resize) into a table of
 *   points and lengths, so each frame only looks up how much to draw and
 *   where the tip is, its tip riding the middle of the screen (--d).
 * - Each section's main content ([data-main]) waits out of focus (soft and
 *   dim, while the page has data-focus-ready); when its link is drawn
 *   whole it racks into focus (data-lit; globals.css). Scrolling back
 *   resets it, so it replays.
 * - Sections are marked data-cut once the divider before them crosses the
 *   middle of the screen (their eyebrow mark draws out).
 * - The footer plays its arrival as it scrolls in.
 *
 * With reduced motion the links are drawn, everything is in focus and
 * marked, and the footer simply shows.
 */
export function SceneCuts({ pageRef }) {
  useEffect(() => {
    const page = pageRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const footer = document.querySelector("footer");
    if (!reduced) {
      footer?.setAttribute("data-thread", "");
      page.setAttribute("data-focus-ready", "");
    }

    const links = [...page.querySelectorAll("[data-link]")].map((el, i) => ({
      line: el.querySelector("[data-link-line]"),
      paths: [...el.querySelectorAll("[data-path]")],
      draws: [...el.querySelectorAll("[data-draw]")],
      head: el.querySelector("[data-link-head]"),
      main: el.nextElementSibling?.querySelector("[data-main]"),
      side: i % 2 ? -1 : 1,
      pts: [],
      lens: [],
    }));

    // Shape each link to its gap: a half sine out and back above the ruler
    // (the link's top sits `up` above it), the mirror below.
    function shape(link) {
      const { line, side } = link;
      const w = line.offsetWidth;
      const h = line.offsetHeight;
      const up = -line.offsetTop;
      const down = h - up;
      const swing = (w - 16) / 2;
      const cx = w / 2;
      const pts = [];
      const lens = [];
      let total = 0;
      for (let y = 0; ; y = Math.min(h, y + STEP)) {
        const x = y <= up ? cx + side * swing * Math.sin((Math.PI * y) / up) : cx - side * swing * Math.sin((Math.PI * (y - up)) / down);
        if (pts.length) {
          const [px, py] = pts[pts.length - 1];
          total += Math.hypot(x - px, y - py);
        }
        pts.push([x, y]);
        lens.push(total);
        if (y >= h) break;
      }
      const d = "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L");
      for (const path of link.paths) path.setAttribute("d", d);
      for (const path of link.draws) path.style.strokeDasharray = `${total} ${total}`;
      link.pts = pts;
      link.lens = lens;
    }

    function update() {
      frame = 0;
      const middle = innerHeight * 0.5;
      const tip = innerHeight * 0.5;
      for (const link of links) {
        const { line, main, pts, lens } = link;
        if (!pts.length) continue;
        const r = line.getBoundingClientRect();
        const d = reduced ? 1 : Math.min(1, Math.max(0, (tip - r.top) / Math.max(1, r.height)));
        const i = Math.min(pts.length - 1, Math.round((d * r.height) / STEP));
        const total = lens[lens.length - 1];
        line.style.setProperty("--d", d.toFixed(4));
        line.toggleAttribute("data-done", d >= 1);
        for (const path of link.draws) path.style.strokeDashoffset = (total - lens[i]).toFixed(1);
        link.head.style.transform = `translate(${pts[i][0].toFixed(1)}px, ${pts[i][1].toFixed(1)}px)`;
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
    const reshape = () => {
      links.forEach(shape);
      schedule();
    };

    // Anything already past on load is in focus at once.
    for (const { line, main } of links) {
      if (main && line.getBoundingClientRect().bottom < innerHeight * 0.5) main.setAttribute("data-lit", "");
    }
    links.forEach(shape);
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", reshape);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", reshape);
      footer?.removeAttribute("data-thread");
      footer?.removeAttribute("data-arrived");
      page.removeAttribute("data-focus-ready");
    };
  }, [pageRef]);

  return null;
}
