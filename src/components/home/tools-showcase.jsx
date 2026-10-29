"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import desk from "@/assets/tools/desk.webp";
import { toolsShowcase } from "@/content/home";
import { BeatPanel, CutPanel, DirectorPanel } from "./feature-panels";
import styles from "./tools-showcase.module.css";

const VISUALS = { director: DirectorPanel, "first-cut": CutPanel, "beat-sync": BeatPanel };
const SLIDE_MS = 7000;
const pad = (n) => String(n).padStart(2, "0");

/** The tool's name as letters, ending in the mint landing point. */
function Name({ text }) {
  return (
    <>
      {[...text].map((char, i) => (
        <span key={i} className={styles.letter} style={{ "--l": i }}>
          {char === " " ? " " : char}
        </span>
      ))}
      <span className={`${styles.letter} ${styles.point}`} style={{ "--l": text.length }}>
        .
      </span>
    </>
  );
}

function Icon({ d }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/**
 * Keyfly's own tools, one at a time, after the reference's featured
 * project: the section slides up over the pinned hero; a frosted panel on
 * the left carries the tool's name (revealed letter by letter out of a
 * blur), a line about it and the slide controls; an illustrative interface
 * panel for the tool sits on the right, over the photo.
 *
 * Autoplays only while on screen, and pauses on hover, on focus or with
 * the pause button. Reduced motion: no autoplay, changes are cuts.
 */
export function ToolsShowcase() {
  const { slides, label } = toolsShowcase;
  const ref = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const running = visible && !paused && !held;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [running, index, slides.length]);

  const go = (step) => setIndex((i) => (i + step + slides.length) % slides.length);
  const Visual = VISUALS[slides[index].id];

  return (
    <section
      ref={ref}
      id={toolsShowcase.id}
      data-section="Product"
      className={styles.section}
      aria-roledescription="carousel"
      aria-labelledby="tools-title"
    >
      <div className={styles.backdrop} aria-hidden="true">
        <Image src={desk} alt="" fill sizes="100vw" placeholder="blur" className={styles.photo} />
        <div className={styles.shade} />
        <div className={styles.grid}>
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className={styles.layout}>
        <div
          className={styles.panel}
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
          }}
        >
          <div className={styles.head}>
            <h2 id="tools-title" className={styles.label}>
              {label}
            </h2>
            <p className={styles.count} aria-hidden="true">
              {pad(index + 1)} / {pad(slides.length)}
            </p>
          </div>

          <div className={styles.slides} aria-live={running ? "off" : "polite"}>
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className={styles.slide}
                data-active={i === index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}`}
                aria-hidden={i !== index}
                inert={i !== index}
              >
                <p className={styles.kicker}>{slide.kicker}</p>
                <h3 className={styles.name} aria-label={slide.name}>
                  <span aria-hidden="true">
                    <Name text={slide.name} />
                  </span>
                </h3>
                <p className={styles.text}>{slide.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.controls}>
            <button type="button" className={styles.control} onClick={() => go(-1)} aria-label="Previous tool">
              <Icon d="M11 3.5v9L4.5 8z" />
            </button>
            <button
              type="button"
              className={styles.control}
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play" : "Pause"}
            >
              {paused ? <Icon d="M5 3.5v9L11.5 8z" /> : <Icon d="M4.5 3.5h2.5v9H4.5zM9 3.5h2.5v9H9z" />}
            </button>
            <button type="button" className={styles.control} onClick={() => go(1)} aria-label="Next tool">
              <Icon d="M5 3.5v9L11.5 8z" />
            </button>
            <span className={styles.timer} aria-hidden="true">
              <span
                key={index}
                className={styles.timerFill}
                style={{ "--slide-ms": `${SLIDE_MS}ms` }}
                data-running={running}
              />
            </span>
          </div>
        </div>

        {/* Keyed, so the tool's illustrative panel plays again each time. */}
        <div className={styles.visual} aria-hidden="true">
          <div key={slides[index].id} className={styles.visualInner}>
            <Visual />
          </div>
          <p className={styles.caption}>Illustrative interface</p>
        </div>
      </div>
    </section>
  );
}
