"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Shot } from "@/components/shot/shot";
import styles from "./on-brand.module.css";

const STEP = 1100; // ms between kit items while it applies them
const HOLD = 3200; // ms the finished cut holds before it starts again

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// The sample beside each kit item.
function Specimen({ id }) {
  if (id === "logo") return <span className={styles.mark} />;
  if (id === "lower") return <span className={styles.miniLower} />;
  if (id === "font") return <span className={styles.aa}>Aa</span>;
  return (
    <span className={styles.swatches}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

// One picture: the same shot, plain or with the kit items that are on.
function Picture({ on, lowerTitle, lowerSub, captions }) {
  return (
    <span className={styles.frame} data-logo={on.logo ? "" : undefined} data-lower={on.lower ? "" : undefined} data-font={on.font ? "" : undefined} data-colours={on.colours ? "" : undefined}>
      <Shot />
      <span className={styles.grade} />
      <span className={styles.lower}>
        <b>{lowerTitle}</b>
        <span>{lowerSub}</span>
      </span>
      <span className={styles.captions}>
        {captions.map((word, i) => (
          <span key={word} data-hot={i === 2 ? "" : undefined}>
            {word}
          </span>
        ))}
      </span>
      <span className={styles.bug}>
        <span className={styles.mark} />
        logo
      </span>
    </span>
  );
}

/**
 * Plain cut | brand kit | on brand, on one set of rows (labels, pictures,
 * facts) shared by all three columns. Keyfly applies the kit one item at a
 * time (the item lights, the branded picture and its facts change), holds
 * the finished cut, then starts again; while on screen and not held. Once
 * an item is clicked it becomes a toggle and the self-running stops.
 * Reduced motion: everything applied, no self-running.
 */
export function BrandCut({ plainLabel, kitLabel, brandLabel, applied, items, lowerTitle, lowerSub, captions }) {
  const n = items.length;
  const [step, setStep] = useState(n); // items before step are applied
  const [mine, setMine] = useState(null); // the toggles, once touched
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !held && !mine && !reduced;
  const isOn = items.map((item, i) => (mine ? mine[i] : reduced || i < step));
  const on = Object.fromEntries(items.map((item, i) => [item.id, isOn[i]]));
  const count = isOn.filter(Boolean).length;
  const latest = mine || reduced ? -1 : step - 1;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setStep((s) => (s >= n ? 0 : s + 1)), step >= n ? HOLD : STEP);
    return () => clearTimeout(timer);
  }, [auto, step, n]);

  function toggle(i) {
    const next = [...isOn];
    next[i] = !next[i];
    setMine(next);
  }

  return (
    <div
      ref={rootRef}
      className={styles.compare}
      data-auto={auto ? "" : undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <figure className={styles.side} aria-hidden="true">
        <p className={styles.label}>{plainLabel}</p>
        <span className={styles.screen}>
          <Picture on={{}} lowerTitle={lowerTitle} lowerSub={lowerSub} captions={captions} />
        </span>
        <ul className={styles.facts}>
          {items.map((item) => (
            <li key={item.id}>{item.plain}</li>
          ))}
        </ul>
      </figure>

      <div className={styles.kitCol}>
        <p className={styles.label}>{kitLabel}</p>
        <div className={styles.kit}>
          <span className={styles.wire} aria-hidden="true">
            <i />
          </span>
          <ul className={styles.items}>
            {items.map((item, i) => (
              <li key={item.id}>
                <button type="button" className={styles.item} aria-pressed={isOn[i]} data-latest={i === latest ? "" : undefined} onClick={() => toggle(i)}>
                  <span className={styles.specimen} aria-hidden="true">
                    <Specimen id={item.id} />
                  </span>
                  <span className={styles.itemText}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemDetail}>{item.detail}</span>
                  </span>
                  <span className={styles.check} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className={styles.count}>
          <b>
            {count}/{n}
          </b>{" "}
          {applied}
          <span className={styles.meter} aria-hidden="true">
            <i style={{ scale: `${count / n} 1` }} />
          </span>
        </p>
      </div>

      <figure className={styles.side} data-brand="" aria-hidden="true">
        <p className={styles.label}>{brandLabel}</p>
        <span className={styles.screen}>
          <Picture on={on} lowerTitle={lowerTitle} lowerSub={lowerSub} captions={captions} />
        </span>
        <ul className={styles.facts}>
          {items.map((item, i) => (
            <li key={item.id} data-on={isOn[i] ? "" : undefined}>
              {isOn[i] ? item.name : item.plain}
            </li>
          ))}
        </ul>
      </figure>
    </div>
  );
}
