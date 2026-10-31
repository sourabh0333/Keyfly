"use client";

import { useEffect, useRef } from "react";

const clamp = (value) => Math.min(1, Math.max(0, value));

// Assembly takes the first part of step 2; the playhead plays the rest.
const ASSEMBLY = 0.35;
const FORMATS = ["16:9", "9:16", "1:1"];
const LENGTH = 30; // seconds in the demo cut

function timecode(seconds) {
  const s = Math.floor(seconds);
  const f = Math.floor((seconds - s) * 30);
  return `00:00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

/**
 * The pinned section that drives "How it works". It turns the scroll
 * position into progress and writes it straight to the DOM:
 * --p (whole section), --s1/--s2/--s3 (each step), --ph (the playhead),
 * data-step, data-format and data-ready, plus the typed prompt, the
 * timecode and the export percentage. The section only pins (data-live)
 * once this runs, and never with reduced motion, so without it the CSS
 * defaults show the finished cut.
 */
export function ScrollStage({ className, id, labelledBy, label, prompt, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    if (!section || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const typed = section.querySelector("[data-typed]");
    const code = section.querySelector("[data-timecode]");
    const percent = section.querySelector("[data-percent]");
    const exportLabel = section.querySelector("[data-export-label]");
    let frame = 0;
    let last = {};

    const write = (key, value, apply) => {
      if (last[key] === value) return;
      last[key] = value;
      apply(value);
    };

    const update = () => {
      frame = 0;
      const box = section.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      const p = travel > 0 ? clamp(-box.top / travel) : 1;
      const s = [0, 1, 2].map((i) => clamp(p * 3 - i));
      // Each step finishes a little early so it rests before the next.
      const s1 = clamp(s[0] / 0.8);
      const s2 = clamp(s[1] / 0.9);
      const s3 = clamp(s[2] / 0.85);
      const ph = clamp((s2 - ASSEMBLY) / (1 - ASSEMBLY));
      const step = Math.min(2, Math.floor(p * 3));

      const style = section.style;
      style.setProperty("--p", p.toFixed(4));
      style.setProperty("--s1", s1.toFixed(4));
      style.setProperty("--s2", s2.toFixed(4));
      style.setProperty("--s3", s3.toFixed(4));
      style.setProperty("--ph", ph.toFixed(4));
      style.setProperty("--asm", clamp(s2 / ASSEMBLY).toFixed(4));

      write("step", step, (v) => (section.dataset.step = v));
      write("format", FORMATS[Math.min(2, Math.floor(s3 * 3.4))], (v) => (section.dataset.format = v));
      write("ready", s3 >= 0.98, (v) => (v ? (section.dataset.ready = "") : delete section.dataset.ready));
      write("typed", Math.round(prompt.length * s1), (v) => typed && (typed.textContent = prompt.slice(0, v)));
      write("code", timecode(ph * LENGTH), (v) => code && (code.textContent = v));
      write("percent", Math.round(s3 * 100), (v) => percent && (percent.textContent = `${v}%`));
      write("label", s3 >= 0.98 ? "Ready" : s3 > 0 ? "Exporting" : "Export", (v) => exportLabel && (exportLabel.textContent = v));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    section.dataset.live = "";
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      delete section.dataset.live;
    };
  }, [prompt]);

  return (
    <section ref={ref} id={id} className={className} aria-labelledby={labelledBy} data-section={label} data-format="16:9" data-ready="">
      {children}
    </section>
  );
}
