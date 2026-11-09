"use client";

import { useEffect, useRef } from "react";

/**
 * One shot of the editor's illustrative launch film: a real stock loop
 * (see scripts/how-shots/), muted. It plays only while it is on screen and
 * its shot is the one showing: the playhead (`--ph`, written on the section
 * by ScrollStage) is in its third of the cut. Without the pin --ph is unset
 * and the finished cut shows its last shot. With reduced motion it rests on
 * its poster.
 */
export function ShotFilm({ src, poster, className, index, count }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = video.closest("section");
    let seen = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      const ph = Number(section?.style.getPropertyValue("--ph") || 1);
      // Before the cut plays (ph 0) the viewer shows its empty state.
      const showing = seen && ph > 0 && Math.min(count - 1, Math.floor(ph * count)) === index;
      if (showing && video.paused) video.play().catch(() => {});
      else if (!showing && !video.paused) video.pause();
    };
    const schedule = () => (frame ||= requestAnimationFrame(update));
    const observer = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      schedule();
    });
    observer.observe(video);
    addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, [index, count]);

  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="none" tabIndex={-1} />;
}
