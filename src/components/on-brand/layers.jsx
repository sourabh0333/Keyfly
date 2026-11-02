"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Shot } from "@/components/shot/shot";
import styles from "./on-brand.module.css";

const FOCUS = 1100; // ms each layer stays lit while the stack is apart
const FINAL = 3600; // ms the finished frame holds before it comes apart again
const SETTLE = 1200; // ms for the stack to come apart or together (matches the CSS)

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// The specimen beside each brand-kit item.
function Specimen({ id }) {
  if (id === "logo") return <span className={styles.mark} />;
  if (id === "lower") return <span className={styles.miniLower} />;
  if (id === "captions") return <span className={styles.aa}>Aa</span>;
  if (id === "grade")
    return (
      <span className={styles.swatches}>
        <i />
        <i />
        <i />
        <i />
      </span>
    );
  return <span className={styles.film} />;
}

// What each layer of the frame carries.
function LayerContent({ id, lowerTitle, lowerSub, captions }) {
  if (id === "footage") return <Shot />;
  if (id === "grade") return <span className={styles.grade} />;
  if (id === "captions")
    return (
      <span className={styles.captions}>
        {captions.map((word, i) => (
          <span key={word} data-hot={i === 2 ? "" : undefined}>
            {word}
          </span>
        ))}
      </span>
    );
  if (id === "lower")
    return (
      <span className={styles.lower}>
        <b>{lowerTitle}</b>
        <span>{lowerSub}</span>
      </span>
    );
  return (
    <span className={styles.bug}>
      <span className={styles.mark} />
      logo
    </span>
  );
}

/**
 * The frame pulled apart into its layers, an exploded view: footage, colour,
 * captions, lower third and logo float above one another, each joined by a
 * thin line to the brand-kit item it comes from. Then they come together
 * into the finished, on-brand frame, and apart again. It runs by itself
 * (lighting one layer at a time) while on screen and not held, until the
 * view switch or a kit item is used. Lines are measured from the layers'
 * anchors after the stack settles, and on resize. Reduced motion: no
 * self-running and no easing.
 */
export function Layers({ layers, kit, kitSub, views, viewLabel, lowerTitle, lowerSub, captions }) {
  const n = layers.length;
  const [step, setStep] = useState(0); // 0..n-1: a layer lit, apart; n: together
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const bodyRef = useRef(null);

  const view = step === n ? "final" : "layers";
  const focus = view === "layers" ? step : -1;
  const auto = visible && !held && !touched && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const wait = step === n ? FINAL : step === 0 ? FOCUS + SETTLE : FOCUS;
    const timer = setTimeout(() => setStep((s) => (s + 1) % (n + 1)), wait);
    return () => clearTimeout(timer);
  }, [auto, step, n]);

  // Draw each kit item's line to its layer's anchor (written to the DOM).
  useEffect(() => {
    const body = bodyRef.current;
    function draw() {
      const box = body.getBoundingClientRect();
      for (const layer of layers) {
        const from = body.querySelector(`[data-from="${layer.id}"]`);
        const to = body.querySelector(`[data-to="${layer.id}"]`);
        const path = body.querySelector(`[data-line="${layer.id}"]`);
        if (!from || !to || !path) continue;
        const a = from.getBoundingClientRect();
        const b = to.getBoundingClientRect();
        const sx = a.left + a.width / 2 - box.left;
        const sy = a.top + a.height / 2 - box.top;
        const ex = b.left + b.width / 2 - box.left;
        const ey = b.top + b.height / 2 - box.top;
        const dx = Math.max(24, (ex - sx) * 0.5);
        path.setAttribute("d", `M${sx} ${sy}C${sx + dx} ${sy} ${ex - dx} ${ey} ${ex} ${ey}`);
      }
    }
    draw();
    const timer = setTimeout(draw, reduced ? 0 : SETTLE);
    const observer = new ResizeObserver(draw);
    observer.observe(body);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [view, layers, reduced]);

  function show(nextView) {
    setTouched(true);
    setStep(nextView === "final" ? n : 0);
  }

  function pick(i) {
    setTouched(true);
    setStep(i);
  }

  return (
    <div
      ref={rootRef}
      className={styles.layers}
      data-view={view}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div ref={bodyRef} className={styles.body}>
        <div className={styles.kit}>
          <p className={styles.kitHead}>
            {kit}
            <span>{kitSub}</span>
          </p>
          <ol className={styles.items}>
            {layers.map((layer, i) => (
              <li key={layer.id}>
                <button
                  type="button"
                  className={styles.item}
                  data-on={i === focus ? "" : undefined}
                  data-kit={layer.id === "footage" ? undefined : ""}
                  aria-pressed={i === focus}
                  onClick={() => pick(i)}
                >
                  <span className={styles.specimen} aria-hidden="true">
                    <Specimen id={layer.id} />
                  </span>
                  <span className={styles.itemText}>
                    <span className={styles.itemName}>{layer.kit}</span>
                    <span className={styles.itemDetail}>{layer.detail}</span>
                  </span>
                  <span className={styles.dot} data-from={layer.id} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.stage} aria-hidden="true">
          <div className={styles.stack}>
            {layers.map((layer, i) => (
              <div key={layer.id} className={styles.layer} data-id={layer.id} data-on={i === focus ? "" : undefined} style={{ "--z": n - 1 - i }}>
                <LayerContent id={layer.id} lowerTitle={lowerTitle} lowerSub={lowerSub} captions={captions} />
                <span className={styles.tag}>
                  {pad(n - i)} · {layer.label}
                </span>
                <span className={styles.anchor} data-to={layer.id} />
              </div>
            ))}
          </div>
        </div>

        <svg className={styles.lines} aria-hidden="true">
          {layers.map((layer, i) => (
            <path key={layer.id} data-line={layer.id} data-on={i === focus ? "" : undefined} />
          ))}
        </svg>
      </div>

      <div className={styles.switch} role="group" aria-label={viewLabel}>
        {["layers", "final"].map((v) => (
          <button key={v} type="button" aria-pressed={view === v} onClick={() => show(v)}>
            {views[v]}
          </button>
        ))}
      </div>
    </div>
  );
}
