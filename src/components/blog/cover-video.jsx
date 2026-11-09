"use client";

import { useEffect, useRef } from "react";

/**
 * A post's cover: the poster, and its reel playing muted.
 * - mode "view": plays while it's on screen (the featured post, a post's
 *   own cover). With `progress`, writes `--p` (0–1) on `progressRef`'s
 *   element each frame while playing, for a scrub line.
 * - mode "hover": plays while a mouse rests on the card around it (the
 *   closest `[data-cover-host]`), from the start each time. Touch screens
 *   keep the poster.
 * Reduced motion: the poster only. Nothing loads until it's needed.
 */
export function CoverVideo({ cover, mode = "view", progressRef, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return undefined;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    const tick = () => {
      const bar = progressRef?.current;
      if (bar && video.duration) bar.style.setProperty("--p", (video.currentTime / video.duration).toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      if (progressRef) frame = requestAnimationFrame(tick);
    };
    const onPause = () => cancelAnimationFrame(frame);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    const play = () => video.play().catch(() => {});
    let cleanup = () => {};

    if (mode === "view") {
      const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? play() : video.pause()),
        { threshold: 0.35 },
      );
      observer.observe(video);
      cleanup = () => observer.disconnect();
    } else if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const host = video.closest("[data-cover-host]");
      if (host) {
        const enter = () => {
          video.currentTime = 0;
          play();
        };
        const leave = () => video.pause();
        host.addEventListener("pointerenter", enter);
        host.addEventListener("pointerleave", leave);
        cleanup = () => {
          host.removeEventListener("pointerenter", enter);
          host.removeEventListener("pointerleave", leave);
        };
      }
    }

    return () => {
      cleanup();
      cancelAnimationFrame(frame);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [mode, progressRef]);

  return (
    <video
      ref={ref}
      className={className}
      src={cover.video}
      poster={cover.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
