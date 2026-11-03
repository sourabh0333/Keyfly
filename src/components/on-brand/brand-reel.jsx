"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Preview } from "@/components/use-cases/preview";
import styles from "./on-brand.module.css";

const STEP = 1700; // ms between kit items while it applies them
const HOLD = 3200; // ms the reel holds fully on brand before it starts again
const SWEEP = 900; // ms for the scan line to cross the reel (matches the CSS)

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// The sample in each kit cell.
function Specimen({ id }) {
  if (id === "logo") return <span className={styles.mark} />;
  if (id === "font") return <span className={styles.aa}>Aa</span>;
  if (id === "voice")
    return (
      <span className={styles.miniWave}>
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    );
  return (
    <span className={styles.swatches}>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function Tile({ video }) {
  return (
    <figure className={styles.tile} data-kind={video.kind} style={{ "--r": video.w / video.h }}>
      <span className={styles.picture}>
        <Preview kind={video.kind} format={video.ratio === "9:16" ? "9:16" : "16:9"} bleed />
        <span className={styles.grade} />
        <span className={styles.vidTitle}>
          <b>{video.title}</b>
        </span>
        <span className={styles.voice} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className={styles.bug}>
          <span className={styles.mark} />
          logo
        </span>
      </span>
      <figcaption className={styles.tileLabel}>
        {video.label}
        <span>{video.ratio}</span>
      </figcaption>
    </figure>
  );
}

/**
 * One brand kit over every video: the kit as a bar of four cells, and
 * beneath it a reel of different videos in their own shapes drifting by.
 * KeyFly applies the kit one item at a time; each time, a mint scan line
 * crosses the reel and every video takes the item as the line reaches it
 * (each tile's --delay is set from where it stands when the line sets
 * off). It holds fully on brand, then starts again; while on screen and
 * not held. Clicking a cell toggles that item and stops the self-running.
 * Reduced motion: everything applied, the reel still, no scan.
 * The reel stays inside the column, clear of the flight thread's margin.
 */
export function BrandReel({ kitLabel, applied, videosLabel, items, videos }) {
  const n = items.length;
  const [step, setStep] = useState(n); // items before step are applied
  const [mine, setMine] = useState(null); // the toggles, once touched
  const [sweep, setSweep] = useState(0); // restarts the scan line
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const reelRef = useRef(null);

  const auto = visible && !held && !mine && !reduced;
  const isOn = items.map((item, i) => (mine ? mine[i] : reduced || i < step));
  const count = isOn.filter(Boolean).length;
  const latest = mine || reduced ? -1 : step - 1;

  // Before a change: give every tile its delay from where it stands now.
  function scan() {
    const reel = reelRef.current;
    const box = reel.getBoundingClientRect();
    for (const tile of reel.querySelectorAll("figure")) {
      const r = tile.getBoundingClientRect();
      const at = Math.min(1, Math.max(0, (r.left + r.width / 2 - box.left) / box.width));
      tile.style.setProperty("--delay", `${Math.round(at * SWEEP)}ms`);
    }
    setSweep((s) => s + 1);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => {
      scan();
      setStep((s) => (s >= n ? 0 : s + 1));
    }, step >= n ? HOLD : STEP);
    return () => clearTimeout(timer);
  }, [auto, step, n]);

  function toggle(i) {
    const next = [...isOn];
    next[i] = !next[i];
    scan();
    setMine(next);
  }

  const on = Object.fromEntries(items.map((item, i) => [item.id, isOn[i]]));

  return (
    <div
      ref={rootRef}
      className={styles.brand}
      data-auto={auto ? "" : undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.kitHead}>
        <p>{kitLabel}</p>
        <p>
          <b>
            {count}/{n}
          </b>{" "}
          {applied} · {videos.length} {videosLabel}
        </p>
      </div>

      <div className={styles.kit} role="group" aria-label={kitLabel}>
        {items.map((item, i) => (
          <button key={item.id} type="button" className={styles.cell} aria-pressed={isOn[i]} data-latest={i === latest ? "" : undefined} onClick={() => toggle(i)}>
            <span className={styles.cellIndex}>{pad(i + 1)}</span>
            <span className={styles.specimen} aria-hidden="true">
              <Specimen id={item.id} />
            </span>
            <span className={styles.cellText}>
              <span className={styles.cellName}>{item.name}</span>
              <span className={styles.cellDetail}>{item.detail}</span>
            </span>
            <span className={styles.check} aria-hidden="true" />
            <i key={i === latest ? `on${step}` : "off"} className={styles.cellFill} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div
        ref={reelRef}
        className={styles.reel}
        data-main=""
        aria-hidden="true"
        data-logo={on.logo ? "" : undefined}
        data-colours={on.colours ? "" : undefined}
        data-font={on.font ? "" : undefined}
        data-voice={on.voice ? "" : undefined}
        data-paused={visible ? undefined : ""}
      >
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.set}>
              {videos.map((video) => (
                <Tile key={video.kind} video={video} />
              ))}
            </div>
          ))}
        </div>
        {sweep > 0 && !reduced ? <span key={sweep} className={styles.scan} /> : null}
      </div>
    </div>
  );
}
