"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HOLD = 2500; // ms the anchor is held while the page settles

/**
 * Landing on an anchor from another page (/#pricing from /product). The
 * browser jumps to the section at once, but the page keeps growing after
 * that (pinned tracks size themselves, TrimPins trims them, media load), so
 * the visitor ended up short of the section. This holds the anchor in
 * place, under the header, while the layout settles: it lets go after a
 * moment, or as soon as the visitor or a section (a navbar pick turning
 * the presets dial) scrolls somewhere else.
 */
export function HashLanding() {
  const pathname = usePathname();

  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    let expected = null;
    let done = false;

    const align = () => {
      if (done) return;
      const target = document.getElementById(id);
      if (!target) return;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const off = target.getBoundingClientRect().top - pad;
      if (Math.abs(off) < 2) return;
      expected = Math.round(scrollY + off);
      scrollTo({ top: expected, behavior: "instant" });
    };
    // Someone else scrolled (the visitor, or a section's own move): stop.
    const onScroll = () => {
      if (expected !== null && Math.abs(scrollY - expected) > 4) stop();
    };
    const observer = new ResizeObserver(align);
    function stop() {
      done = true;
      observer.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("wheel", stop);
      removeEventListener("touchstart", stop);
      removeEventListener("keydown", stop);
    }

    const first = setTimeout(() => {
      align();
      observer.observe(document.body);
      addEventListener("scroll", onScroll, { passive: true });
    }, 60);
    const last = setTimeout(stop, HOLD);
    addEventListener("wheel", stop, { passive: true });
    addEventListener("touchstart", stop, { passive: true });
    addEventListener("keydown", stop);
    return () => {
      clearTimeout(first);
      clearTimeout(last);
      stop();
    };
  }, [pathname]);

  return null;
}
