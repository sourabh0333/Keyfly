"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Shot } from "@/components/shot/shot";
import styles from "./every-format.module.css";

const HOLD = 4200; // ms each format stays before the next (matches the tab's fill)

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Glyph({ f }) {
  const r = f.w / f.h;
  return (
    <span className={styles.glyph} aria-hidden="true">
      <i style={{ width: `${r >= 1 ? 100 : r * 100}%`, height: `${r >= 1 ? 100 / r : 100}%` }} />
    </span>
  );
}

/**
 * One frame that changes shape: the same cut morphs from format to format
 * (its size eases; the picture inside stays centred on the subject, and the
 * captions re-flow), between faint guides for every shape. The format's
 * ratio, name and size sit to the left, where it goes and what KeyFly keeps
 * to the right, and a bar of the formats beneath, which fills while it
 * waits. It moves on by itself while on screen and not held, until a format
 * is chosen; with reduced motion it waits for a click and changes at once.
 */
export function Morph({ formats, formatLabel, madeFor, keeps, bar, captions }) {
  const [active, setActive] = useState(1);
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const f = formats[active];
  const auto = visible && !held && !touched && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % formats.length), HOLD);
    return () => clearTimeout(timer);
  }, [auto, active, formats.length]);

  function choose(i) {
    setActive(i);
    setTouched(true);
  }

  return (
    <div
      ref={rootRef}
      className={styles.morph}
      data-auto={auto ? "" : undefined}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.spec} aria-live="polite">
        <p className={styles.kicker}>
          {formatLabel} <span>{pad(active + 1)}</span> / {pad(formats.length)}
        </p>
        <div key={f.id} className={styles.specBody}>
          <p className={styles.ratio}>{f.ratio}</p>
          <p className={styles.name}>{f.name}</p>
          <p className={styles.px}>
            {f.px[0]} × {f.px[1]}
          </p>
        </div>
      </div>

      <div className={styles.stage} aria-hidden="true" data-main="">
        <span className={styles.glow} />
        {formats.map((g) => (
          <span key={g.id} className={styles.guide} data-on={g.id === f.id ? "" : undefined} style={{ "--r": g.w / g.h }} />
        ))}
        <div className={styles.frame} style={{ "--r": f.w / f.h }}>
          <span className={styles.picture}>
            <Shot />
          </span>
          <span className={styles.captions}>
            {captions.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </span>
          <span className={styles.corners} />
          <span className={styles.tag}>{f.ratio}</span>
        </div>
      </div>

      <div className={styles.side}>
        <div>
          <p className={styles.kicker}>{madeFor}</p>
          <ul key={f.id} className={styles.uses}>
            {f.for.map((use, i) => (
              <li key={use} style={{ "--i": i }}>
                {use}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={styles.kicker}>{keeps.label}</p>
          <ul className={styles.keeps}>
            {keeps.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bar} role="radiogroup" aria-label={bar}>
        {formats.map((g, i) => (
          <button key={g.id} type="button" role="radio" aria-checked={i === active} className={styles.tab} onClick={() => choose(i)}>
            <span className={styles.tabIndex}>{pad(i + 1)}</span>
            <Glyph f={g} />
            <span className={styles.tabRatio}>{g.ratio}</span>
            <span className={styles.tabName}>{g.name}</span>
            <i key={i === active ? `on${active}` : "off"} className={styles.tabFill} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
