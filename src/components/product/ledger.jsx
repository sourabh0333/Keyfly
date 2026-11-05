"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { RowPreview } from "./row-preview";
import styles from "./your-way.module.css";

// The hover preview's box (px) and its gap from the pointer.
const BOX_W = 300;
const BOX_H = 169;
const GAP = 22;

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const never = () => () => {};

const FINE = "(hover: hover) and (pointer: fine)";
function onFineChange(callback) {
  const query = matchMedia(FINE);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// Where the box goes for a pointer at (x, y): its foot just above and to
// the right of the pointer, so the row stays readable; to the left near
// the right edge; below the pointer near the top.
function place(x, y) {
  const left = x + GAP + BOX_W > innerWidth - 12 ? x - GAP - BOX_W : x + GAP;
  const top = y - GAP - BOX_H < 12 ? y + GAP : y - GAP - BOX_H;
  return [left, top];
}

// A padlock; its shackle lifts and turns when its row is open.
function Lock() {
  return (
    <svg className={styles.lock} viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path className={styles.shackle} d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor" />
      <circle className={styles.keyhole} cx="12" cy="16" r="1.6" />
    </svg>
  );
}

/**
 * Your way's ledger: one row per choice KeyFly leaves to you (platform, AI,
 * projects, data, team), each with a padlock, its name, its choices as
 * chips and what it means. Each row unlocks once as it comes into view:
 * the shackle lifts, the lock turns mint and the chips land, and a counter
 * above tallies them. Nothing moves by itself after that, so there is
 * nothing to pause. The server's HTML (and reduced motion) shows every row
 * open.
 *
 * Hovering a row with a mouse floats a small 16:9 box after the pointer,
 * playing that row's illustrative clip (RowPreview). The box is portalled
 * into <body>: the sections are transformed while they dissolve (and
 * filtered while out of focus), and either would make a fixed box position
 * against the section. It eases after the pointer (rAF, only while shown);
 * with reduced motion it jumps and its clip stands still. No hover, no box.
 */
export function Ledger({ counter, rows, previewNote }) {
  const [open, setOpen] = useState([]);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const hydrated = useSyncExternalStore(never, () => true, () => false);
  const fine = useSyncExternalStore(onFineChange, () => matchMedia(FINE).matches, () => false);
  const listRef = useRef(null);
  const floatRef = useRef(null);
  const target = useRef([0, 0]);
  const at = useRef(null);
  const frame = useRef(0);
  const [hover, setHover] = useState(null);

  const armed = hydrated && !reduced;
  const isOpen = (id) => !armed || open.includes(id);
  const count = armed ? open.length : rows.length;

  useEffect(() => {
    const items = [...listRef.current.querySelectorAll("[data-row]")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.dataset.row;
          setOpen((o) => (o.includes(id) ? o : [...o, id]));
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0.5 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  // The box follows the pointer: snap on entry, then ease towards it.
  function follow() {
    frame.current = 0;
    const el = floatRef.current;
    if (!el || !at.current) return;
    const [tx, ty] = target.current;
    const k = reduced ? 1 : 0.22;
    const x = at.current[0] + (tx - at.current[0]) * k;
    const y = at.current[1] + (ty - at.current[1]) * k;
    at.current = [x, y];
    el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) frame.current = requestAnimationFrame(follow);
  }

  function point(event, id) {
    if (event.pointerType !== "mouse" || !fine) return;
    target.current = place(event.clientX, event.clientY);
    if (!at.current) at.current = target.current;
    if (id !== hover) setHover(id);
    frame.current ||= requestAnimationFrame(follow);
  }

  function leave() {
    setHover(null);
    at.current = null;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const shown = rows.find((r) => r.id === hover);

  return (
    <div className={styles.ledger} data-main="" data-armed={armed ? "" : undefined}>
      <p className={styles.counter} aria-live="polite">
        <b>{count}</b> {counter.of} {rows.length} {counter.unlocked}
        <span className={styles.meter} aria-hidden="true">
          {rows.map((r) => (
            <i key={r.id} data-open={isOpen(r.id) ? "" : undefined} />
          ))}
        </span>
      </p>

      <ol ref={listRef} className={styles.rows}>
        {rows.map((r, i) => {
          const [first, ...rest] = r.name.split(" ");
          return (
            <li
              key={r.id}
              className={styles.row}
              data-row={r.id}
              data-open={isOpen(r.id) ? "" : undefined}
              data-hover={hover === r.id ? "" : undefined}
              onPointerEnter={(event) => point(event, r.id)}
              onPointerMove={(event) => point(event, r.id)}
              onPointerLeave={leave}
            >
              <span className={styles.mark}>
                <Lock />
                <em>{pad(i + 1)}</em>
              </span>
              <h3 className={styles.name}>
                {first} <span>{rest.join(" ")}</span>
              </h3>
              <ul className={styles.choices}>
                {r.choices.map((c, n) => (
                  <li key={c} style={{ "--i": n }}>
                    {c}
                  </li>
                ))}
              </ul>
              <div className={styles.means}>
                <p>{r.statement}</p>
                {r.link ? (
                  <Link href={r.link.href} className={styles.rowLink}>
                    {r.link.label}
                    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {hydrated && fine
        ? createPortal(
            <div ref={floatRef} className={styles.float} data-on={shown ? "" : undefined} data-paused={shown ? undefined : ""} aria-hidden="true">
              <div className={styles.floatScreen}>
                {shown ? <RowPreview key={shown.id} kind={shown.id} preview={shown.preview} /> : null}
                <span className={styles.floatTag}>
                  {shown ? shown.name : ""}
                  <em>{previewNote}</em>
                </span>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
