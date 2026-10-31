"use client";

import { useEffect, useRef } from "react";
import styles from "./scene.module.css";

const SEEK_MS = 650; // the frame's travel from one target to the next
const LOCK_PAD = 10; // how far the brackets stand off a locked target
const SEEK_PAD = 28; // and while they hunt

const ease = (t) => 1 - Math.pow(1 - t, 3);
const mix = (a, b, t) => a + (b - a) * t;

// How much of an element sits in the middle of the screen, as a share of
// what could (a tall element only needs to fill the band).
function score(el, vh) {
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return 0;
  const top = vh * 0.1;
  const bottom = vh * 0.9;
  const seen = Math.max(0, Math.min(r.bottom, bottom) - Math.max(r.top, top));
  return seen / Math.min(r.height, bottom - top);
}

/**
 * The camera's focus frame: four mint brackets that travel with the scroll
 * and lock onto the one thing that matters in each section, every element
 * marked data-focus (the prompt, the editor, the preview on air, the
 * landing, the footer's call to action). On a new target the frame lets go,
 * glides and resizes to it, then snaps tight with a focus flash, the tag
 * reads "AF · Locked" and the target pulls into focus (data-focused). It
 * follows its target as it moves or changes shape, and fades when nothing
 * fills the middle of the screen. The footer waits (data-await) and plays
 * its arrival (data-arrived) as it comes well into view, where the frame
 * locks onto its call to action. With reduced motion the frame jumps
 * straight to each target and nothing pulls focus.
 */
export function FocusFrame() {
  const frameRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    const label = labelRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const footer = document.querySelector("footer");
    const state = { target: null, from: null, start: 0, locked: false, rect: null, raf: 0, idle: 0 };

    footer?.setAttribute("data-await", "");

    function choose() {
      const vh = innerHeight;
      const targets = [...document.querySelectorAll("[data-focus]")];
      let best = null;
      let bestScore = 0;
      for (const el of targets) {
        const s = score(el, vh) + (el === state.target ? 0.15 : 0);
        if (s > bestScore) {
          best = el;
          bestScore = s;
        }
      }
      return bestScore > 0.45 ? best : null;
    }

    function setTarget(next, now) {
      if (state.target) state.target.removeAttribute("data-focused");
      state.from = state.rect;
      state.target = next;
      state.start = now;
      state.locked = false;
      frame.removeAttribute("data-locked");
      frame.toggleAttribute("data-on", Boolean(next));
      if (next) label.textContent = next.dataset.focus;
    }

    function lock() {
      state.locked = true;
      frame.setAttribute("data-locked", "");
      if (!reduced) state.target.setAttribute("data-focused", "");
    }

    function tick(now) {
      state.raf = 0;
      const next = choose();
      if (next !== state.target) setTarget(next, now);
      // The footer plays its arrival once it is well into view (its call
      // to action may already be above the screen on short ones).
      if (footer) footer.toggleAttribute("data-arrived", footer.getBoundingClientRect().top < innerHeight * 0.55);
      if (state.target) {
        const r = state.target.getBoundingClientRect();
        const t = reduced || !state.from ? 1 : Math.min(1, (now - state.start) / SEEK_MS);
        const k = ease(t);
        const pad = t < 1 ? mix(SEEK_PAD, SEEK_PAD - 6, k) : LOCK_PAD;
        const box = state.from
          ? {
              x: mix(state.from.x, r.left, k),
              y: mix(state.from.y, r.top, k),
              w: mix(state.from.w, r.width, k),
              h: mix(state.from.h, r.height, k),
            }
          : { x: r.left, y: r.top, w: r.width, h: r.height };
        if (t >= 1 && !state.locked) lock();
        const changed = !state.rect || Math.abs(state.rect.x - box.x) + Math.abs(state.rect.y - box.y) + Math.abs(state.rect.w - box.w) + Math.abs(state.rect.h - box.h) > 0.3;
        state.rect = box;
        frame.style.transform = `translate(${(box.x - pad).toFixed(1)}px, ${(box.y - pad).toFixed(1)}px)`;
        frame.style.width = `${(box.w + pad * 2).toFixed(1)}px`;
        frame.style.height = `${(box.h + pad * 2).toFixed(1)}px`;
        state.idle = changed || t < 1 ? now : state.idle;
      }
      // Keep running while the frame travels or its target moves (a
      // preview changing format, a pinned stage); rest after a second still.
      if (now - state.idle < 1000) state.raf = requestAnimationFrame(tick);
    }

    const kick = () => {
      if (!state.raf) {
        state.idle = performance.now();
        state.raf = requestAnimationFrame(tick);
      }
    };

    kick();
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", kick);
    addEventListener("click", kick);
    return () => {
      cancelAnimationFrame(state.raf);
      removeEventListener("scroll", kick);
      removeEventListener("resize", kick);
      removeEventListener("click", kick);
      state.target?.removeAttribute("data-focused");
      footer?.removeAttribute("data-await");
      footer?.removeAttribute("data-arrived");
    };
  }, []);

  return (
    <div ref={frameRef} className={styles.focus} aria-hidden="true">
      <i data-corner="tl" />
      <i data-corner="tr" />
      <i data-corner="bl" />
      <i data-corner="br" />
      <span className={styles.reticle} />
      <span className={styles.tag}>
        <b />
        AF
        <span className={styles.tagState} data-seek="Focusing" data-lock="Locked" />
        <span ref={labelRef} className={styles.tagLabel} />
      </span>
    </div>
  );
}
