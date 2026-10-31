"use client";

import { useEffect, useRef } from "react";
import { download, hero, howItWorks, prompt, useCases } from "@/content/home";
import { EditorMock, IconMock, PreviewMock, PromptMock, Title } from "./mocks";
import lab from "./lab.module.css";
import styles from "./morph.module.css";

// The shape the object takes at each stop: corner radius in px, and
// whether its own surface shows (the app icon brings its own).
const STOPS = [
  { radius: 18, surface: 1 },
  { radius: 14, surface: 1 },
  { radius: 14, surface: 1 },
  { radius: 36, surface: 0 },
];

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a, b, t) => a + (b - a) * t;

/**
 * Idea A, one object that transforms down the page: the prompt box grows
 * into the editor, the editor settles into the preview on air, and the
 * preview folds into the app icon that lands on the desktop. Each section
 * holds an invisible anchor (data-stop) where the object belongs; a single
 * fixed element takes the shape between the two anchors either side of the
 * middle of the screen, and its contents cross-fade from one stage to the
 * next.
 */
export function MorphDemo() {
  const objectRef = useRef(null);

  useEffect(() => {
    const object = objectRef.current;
    const anchors = [...document.querySelectorAll("[data-stop]")];
    const layers = [...object.querySelectorAll("[data-layer]")];
    let frame = 0;

    function update() {
      frame = 0;
      const mid = innerHeight / 2;
      const rects = anchors.map((a) => a.getBoundingClientRect());
      const centres = rects.map((r) => r.top + r.height / 2);

      // s: which stop the object is at (whole numbers) or between.
      let s = 0;
      if (mid >= centres[centres.length - 1]) s = anchors.length - 1;
      else if (mid > centres[0]) {
        for (let i = 0; i < centres.length - 1; i++) {
          if (mid <= centres[i + 1]) {
            s = i + (mid - centres[i]) / (centres[i + 1] - centres[i]);
            break;
          }
        }
      }
      const i = Math.min(anchors.length - 2, Math.floor(s));
      const t = ease(clamp(s - i, 0, 1));
      const a = rects[i];
      const b = rects[i + 1];
      const x = mix(a.left, b.left, t);
      const y = mix(a.top, b.top, t);
      const w = mix(a.width, b.width, t);
      const h = mix(a.height, b.height, t);

      object.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      object.style.width = `${w.toFixed(1)}px`;
      object.style.height = `${h.toFixed(1)}px`;
      object.style.borderRadius = `${mix(STOPS[i].radius, STOPS[i + 1].radius, t).toFixed(1)}px`;
      object.style.setProperty("--surface", mix(STOPS[i].surface, STOPS[i + 1].surface, t).toFixed(3));
      const at = i + t;
      layers.forEach((layer, k) => {
        layer.style.opacity = clamp(1 - Math.abs(at - k) * 1.6, 0, 1).toFixed(3);
      });
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className={`${lab.lab} ${styles.page}`}>
      <section className={styles.hero}>
        <p className={lab.eyebrow}>{hero.eyebrow}</p>
        <Title lines={hero.title.map((line) => ({ text: line.map((w) => w.text).join(" "), accent: line.some((w) => w.accent) }))} as="h1" className={lab.h1} />
        <p className={lab.lead}>{hero.lead}</p>
        <div className={`${styles.stop} ${styles.stopPrompt}`} data-stop />
      </section>

      <section className={styles.row}>
        <div className={styles.copy}>
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
        <div className={`${styles.stop} ${styles.stopEditor}`} data-stop />
      </section>

      <section className={`${styles.row} ${styles.flip}`}>
        <div className={styles.copy}>
          <p className={lab.eyebrow}>{useCases.eyebrow}</p>
          <Title lines={useCases.title} className={lab.h2} />
          <p className={lab.lead}>{useCases.lead}</p>
        </div>
        <div className={`${styles.stop} ${styles.stopPreview}`} data-stop />
      </section>

      <section className={styles.row}>
        <div className={styles.copy}>
          <p className={lab.eyebrow}>{download.eyebrow}</p>
          <Title lines={download.title} className={lab.h2} />
          <p className={lab.lead}>{download.lead}</p>
        </div>
        <div className={styles.dock}>
          <div className={`${styles.stop} ${styles.stopIcon}`} data-stop />
        </div>
      </section>

      {/* The object itself, drawn over the page. */}
      <div ref={objectRef} className={styles.object} aria-hidden="true">
        <div className={styles.layer} data-layer>
          <PromptMock placeholder={prompt.placeholder} />
        </div>
        <div className={styles.layer} data-layer>
          <EditorMock />
        </div>
        <div className={styles.layer} data-layer>
          <PreviewMock kind="ugc" format="16:9" />
        </div>
        <div className={styles.layer} data-layer>
          <IconMock />
        </div>
      </div>
    </div>
  );
}
