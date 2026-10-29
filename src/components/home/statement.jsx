"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { statement } from "@/content/home";
import { plainText } from "./accent-text";
import styles from "./statement.module.css";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const mix = (a, b, f) => a + (b - a) * f;
const ease = (f) => (f < 0.5 ? 4 * f * f * f : 1 - (-2 * f + 2) ** 3 / 2);
const phase = (p, from, to) => clamp((p - from) / (to - from));

// Where the icon sits in the panel (fraction of its height); the square
// that opens into the panel is centred on it. Matches .icon in the CSS.
const ICON_Y = 0.68;

/** The statement as words; *word* takes the serif accent. */
function Words({ text }) {
  let index = 0;
  return text.split(/(\*.+?\*)/).flatMap((part, p) => {
    const accent = part.startsWith("*");
    return part
      .replace(/\*/g, "")
      .split(" ")
      .filter(Boolean)
      .map((word, w) => {
        const i = index++;
        const Tag = accent ? "em" : "span";
        return (
          <span key={`${p}-${w}`}>
            <Tag className={styles.word} data-word={i}>
              {word}
            </Tag>{" "}
          </span>
        );
      });
  });
}

/**
 * The page's turning point, played by the scroll. Keyfly's app icon rises
 * in a small mint square; the square opens into a full panel; the
 * statement lights up word by word; then the panel folds back into the
 * square and the icon flies on down into the next section, where it lands.
 *
 * Without JS, and with reduced motion, it is simply the open panel with
 * the whole statement.
 */
export function Statement() {
  const sectionRef = useRef(null);
  const panelRef = useRef(null);
  const copyRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    const panel = panelRef.current;
    const copy = copyRef.current;
    const icon = iconRef.current;
    const words = [...copy.querySelectorAll("[data-word]")];
    section.dataset.live = "true";

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp(-rect.top / Math.max(1, rect.height - vh));
      const W = panel.offsetWidth;
      const H = panel.offsetHeight;
      const cx = W / 2;
      const cy = H * ICON_Y;
      const square = W < 600 ? 104 : 132;

      // 0–0.12 rise in · 0.12–0.3 open · 0.3–0.72 words · 0.72–0.86 fold ·
      // 0.86–1 fly on down.
      const rise = ease(phase(p, 0, 0.12));
      const open = ease(phase(p, 0.12, 0.3)) * (1 - ease(phase(p, 0.72, 0.86)));
      const fly = ease(phase(p, 0.86, 1));
      const size = mix(square, 76, fly);

      const top = (cy - size / 2) * (1 - open);
      const bottom = (H - cy - size / 2) * (1 - open);
      const side = (cx - size / 2) * (1 - open);
      const radius = mix(size * 0.27, 28, open);
      panel.style.clipPath = `inset(${top}px ${side}px ${bottom}px ${side}px round ${radius}px)`;
      panel.style.transform = `translate3d(0, ${(1 - rise) * vh * 0.5 + fly * vh * 0.55}px, 0)`;
      panel.style.opacity = String(1 - phase(p, 0.94, 1));
      icon.style.transform = `translate(-50%, -50%) scale(${mix(1, 0.78, fly)})`;

      // The words: hidden until the panel is open, lit one after another,
      // then gone before it folds.
      const shown = phase(p, 0.26, 0.32) * (1 - phase(p, 0.72, 0.76));
      copy.style.opacity = String(shown);
      const lit = phase(p, 0.32, 0.68) * (words.length + 0.6);
      for (const word of words) {
        const on = clamp(lit - Number(word.dataset.word));
        word.style.opacity = String(0.16 + 0.84 * on);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.statement} aria-label={plainText(statement.text)}>
      <div className={styles.sticky}>
        <div ref={panelRef} className={styles.panel}>
          <div ref={copyRef} className={styles.copy} aria-hidden="true">
            <p className={styles.kicker}>{statement.kicker}</p>
            <p className={styles.text}>
              <Words text={statement.text} />
            </p>
          </div>
          <span ref={iconRef} className={styles.icon}>
            <Image src="/brand/app-icon-flat.svg" alt="" width={76} height={76} unoptimized />
          </span>
        </div>
      </div>
    </section>
  );
}
