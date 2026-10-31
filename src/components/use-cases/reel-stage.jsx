"use client";

import { useEffect, useRef } from "react";

const clamp = (value) => Math.min(1, Math.max(0, value));
const smooth = (t) => t * t * (3 - 2 * t);

function timecode(seconds) {
  const s = Math.floor(seconds);
  const f = Math.floor((seconds - s) * 30);
  return `00:00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

/**
 * Drives the use-case reel. While the section is pinned (data-live, never
 * with reduced motion) the scroll position slides the track so each card
 * comes to rest under the fixed playhead; the card there is data-active and
 * the rest are data-paused. It also keeps the counter, the ruler (--p) and
 * the timecode current, sends "Try this prompt" to the hero's prompt box,
 * and makes the ruler and keyboard focus jump to a card.
 */
export function ReelStage({ className, id, labelledBy, label, labels, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const track = section.querySelector("[data-track]");
    const viewport = section.querySelector("[data-viewport]");
    const cards = [...section.querySelectorAll("[data-card]")];
    const jumps = [...section.querySelectorAll("[data-jump]")];
    const counter = section.querySelector("[data-counter]");
    const counterLabel = section.querySelector("[data-counter-label]");
    const code = section.querySelector("[data-timecode]");
    const last = cards.length - 1;
    const live = !matchMedia("(prefers-reduced-motion: reduce)").matches;

    let centers = [];
    let frame = 0;
    let active = -1;

    const setActive = (index) => {
      if (index === active) return;
      active = index;
      cards.forEach((card, i) => {
        card.toggleAttribute("data-active", i === index);
        card.toggleAttribute("data-paused", i !== index);
      });
      jumps.forEach((jump, i) => jump.toggleAttribute("data-active", i === index));
      if (counter) counter.textContent = String(index + 1).padStart(2, "0");
      if (counterLabel) counterLabel.textContent = labels[index];
    };

    const measure = () => {
      centers = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
    };

    const travel = () => section.offsetHeight - window.innerHeight;

    const update = () => {
      frame = 0;
      const box = section.getBoundingClientRect();
      const p = clamp(-box.top / Math.max(1, travel()));
      const f = p * last;
      const i = Math.min(last - 1, Math.floor(f));
      // Each card rests under the playhead before the reel moves on.
      const t = smooth(clamp((f - i - 0.18) / 0.64));
      const center = centers[i] + (centers[i + 1] - centers[i]) * t;
      track.style.transform = `translate3d(${(viewport.clientWidth / 2 - center).toFixed(1)}px, 0, 0)`;
      section.style.setProperty("--p", p.toFixed(4));
      setActive(Math.round(i + t));
      if (code) code.textContent = timecode(f * 5);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Scroll the window so card `index` sits under the playhead.
    const goTo = (index, behavior = "smooth") => {
      if (!section.hasAttribute("data-live")) {
        cards[index].scrollIntoView({ behavior, inline: "center", block: "nearest" });
        return;
      }
      const f = index / last;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + f * travel(), behavior });
    };

    const onClick = (event) => {
      const tryButton = event.target.closest("[data-try]");
      if (tryButton) {
        window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { label: tryButton.dataset.try } }));
        return;
      }
      const jump = event.target.closest("[data-jump]");
      if (jump) goTo(Number(jump.dataset.jump));
    };

    // Tabbing into a card that is off to the side brings it under the playhead.
    const onFocus = (event) => {
      const card = event.target.closest("[data-card]");
      if (!card || !section.hasAttribute("data-live")) return;
      viewport.scrollLeft = 0;
      goTo(Number(card.dataset.card), "instant");
    };

    section.addEventListener("click", onClick);
    section.addEventListener("focusin", onFocus);

    if (!live) {
      return () => {
        section.removeEventListener("click", onClick);
        section.removeEventListener("focusin", onFocus);
      };
    }

    section.dataset.live = "";
    const onResize = () => {
      measure();
      schedule();
    };
    measure();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      section.removeEventListener("click", onClick);
      section.removeEventListener("focusin", onFocus);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
      delete section.dataset.live;
      track.style.transform = "";
    };
  }, [labels]);

  return (
    <section ref={ref} id={id} className={className} aria-labelledby={labelledBy} data-section={label}>
      {children}
    </section>
  );
}
