"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useRef } from "react";
import { download, hero, howItWorks, prompt, useCases } from "@/content/home";
import { EditorMock, IconMock, PreviewMock, PromptMock, Title } from "./mocks";
import lab from "./lab.module.css";
import styles from "./stack.module.css";

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

/**
 * Idea B, stacking scenes with smooth scrolling: every section is a
 * full-screen panel pinned in turn; the next slides up over it while the
 * one beneath sinks back (it shrinks, rounds its corners and dims), like
 * cards going onto a stack. The whole page scrolls with inertia (Lenis).
 * With reduced motion the scrolling stays native and nothing sinks.
 */
export function StackDemo() {
  const rootRef = useRef(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panels = [...rootRef.current.querySelectorAll("[data-panel]")];
    const lenis = reduced ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    let frame = 0;

    function update() {
      const vh = innerHeight;
      panels.forEach((panel, i) => {
        const next = panels[i + 1];
        if (!next || reduced) return;
        // How far the next panel has covered this one, 0 to 1.
        const p = clamp(1 - next.getBoundingClientRect().top / vh, 0, 1);
        const inner = panel.firstElementChild;
        inner.style.transform = `scale(${(1 - p * 0.09).toFixed(4)})`;
        inner.style.borderRadius = `${(p * 32).toFixed(1)}px`;
        inner.style.filter = `brightness(${(1 - p * 0.55).toFixed(3)})`;
      });
    }

    function loop(time) {
      lenis?.raf(time);
      update();
      frame = requestAnimationFrame(loop);
    }
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={rootRef} className={`${lab.lab} ${styles.stack}`}>
      <section className={styles.panel} data-panel>
        <div className={`${styles.inner} ${styles.center}`} data-tint="intro">
          <p className={lab.eyebrow}>{hero.eyebrow}</p>
          <Title lines={hero.title.map((line) => ({ text: line.map((w) => w.text).join(" "), accent: line.some((w) => w.accent) }))} as="h1" className={lab.h1} />
          <p className={lab.lead}>{hero.lead}</p>
          <div className={styles.promptSlot}>
            <PromptMock placeholder={prompt.placeholder} />
          </div>
        </div>
      </section>

      <section className={styles.panel} data-panel>
        <div className={`${styles.inner} ${styles.split}`} data-tint="how">
          <div>
            <p className={lab.eyebrow}>{howItWorks.eyebrow}</p>
            <Title lines={howItWorks.title} className={lab.h2} />
            <ol className={styles.steps}>
              {howItWorks.steps.map((step, i) => (
                <li key={step.title}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {step.title}
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.window}>
            <EditorMock />
          </div>
        </div>
      </section>

      <section className={styles.panel} data-panel>
        <div className={`${styles.inner} ${styles.split}`} data-tint="cases">
          <div>
            <p className={lab.eyebrow}>{useCases.eyebrow}</p>
            <Title lines={useCases.title} className={lab.h2} />
            <p className={lab.lead}>{useCases.lead}</p>
          </div>
          <div className={styles.window}>
            <PreviewMock kind="montage" format="16:9" />
          </div>
        </div>
      </section>

      <section className={styles.panel} data-panel>
        <div className={`${styles.inner} ${styles.split}`} data-tint="download">
          <div>
            <p className={lab.eyebrow}>{download.eyebrow}</p>
            <Title lines={download.title} className={lab.h2} />
            <p className={lab.lead}>{download.lead}</p>
          </div>
          <div className={styles.iconSlot}>
            <IconMock />
          </div>
        </div>
      </section>
    </div>
  );
}
