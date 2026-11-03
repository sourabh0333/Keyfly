"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Preview } from "@/components/use-cases/preview";
import styles from "./prompts.module.css";

const pad = (n) => String(n).padStart(2, "0");

/**
 * The prompt gallery: example prompts as a numbered, frameless list under
 * their goals. Hovering a prompt (fine pointers only) brings up its little
 * preview, which floats beside the cursor and follows it (eased, one rAF
 * loop while it moves). Choosing a prompt sends its text to the hero's
 * prompt box (the keyfly:prompt event), which scrolls up and types it in.
 *
 * The preview is portalled into <body>: the section is transformed while
 * it dissolves (and filtered while out of focus), and either would make a
 * fixed element inside it position against the section instead of the
 * screen, throwing it off to the side and widening the page.
 */
export function PromptList({ groups, try: tryLabel }) {
  const [hover, setHover] = useState(null); // the prompt under the pointer
  const floatRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const at = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- portal target exists only after mount
  useEffect(() => setMounted(true), []);

  // Ease the preview towards the pointer.
  useEffect(() => {
    if (!hover) return;
    const el = floatRef.current;
    function tick() {
      at.current.x += (target.current.x - at.current.x) * 0.18;
      at.current.y += (target.current.y - at.current.y) * 0.18;
      el.style.transform = `translate(${at.current.x.toFixed(1)}px, ${at.current.y.toFixed(1)}px)`;
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [hover]);

  function move(event) {
    // The preview sits above and right of the pointer (its foot at the
    // pointer), so the line being read stays clear; near the right edge it
    // moves to the left of the pointer, and it never rises off the top.
    const w = floatRef.current?.firstElementChild?.offsetWidth || 260;
    const h = floatRef.current?.firstElementChild?.offsetHeight || 146;
    const right = event.clientX + 24 + w > innerWidth - 16;
    target.current = {
      x: right ? event.clientX - 24 - w : event.clientX + 24,
      y: Math.max(h + 16, event.clientY - 24),
    };
  }

  function enter(item, event) {
    if (event.pointerType !== "mouse") return;
    move(event);
    if (!hover) at.current = { ...target.current };
    setHover(item);
  }

  function send(item) {
    window.dispatchEvent(new CustomEvent("keyfly:prompt", { detail: { text: item.text } }));
  }

  // Each group's first number, so the list counts on across groups.
  const starts = groups.reduce((list, g, i) => [...list, i ? list[i - 1] + groups[i - 1].items.length : 0], []);

  return (
    <div className={styles.list} onPointerLeave={() => setHover(null)} data-main="">
      {groups.map((group, g) => (
        <div key={group.label} className={styles.group}>
          <p className={styles.goal}>{group.label}</p>
          <ol className={styles.items}>
            {group.items.map((item, j) => {
              const n = starts[g] + j + 1;
              return (
                <li key={item.text}>
                  <button
                    type="button"
                    className={styles.item}
                    data-on={hover === item ? "" : undefined}
                    onPointerEnter={(event) => enter(item, event)}
                    onPointerMove={move}
                    onClick={() => send(item)}
                  >
                    <span className={styles.index}>{pad(n)}</span>
                    <span className={styles.text}>“{item.text}”</span>
                    <span className={styles.meta}>
                      {item.preset} · {item.format}
                    </span>
                    <span className={styles.try}>
                      {tryLabel}
                      <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ))}

      {/* The floating preview (decorative), in <body> once mounted. */}
      {mounted ? createPortal(
      <div ref={floatRef} className={styles.float} data-on={hover ? "" : undefined} data-format={hover?.format} aria-hidden="true">
        {hover ? (
          <span key={hover.text} className={styles.floatScreen}>
            <Preview kind={hover.kind} format={hover.format === "9:16" ? "9:16" : "16:9"} bleed />
          </span>
        ) : null}
      </div>,
      document.body,
      ) : null}
    </div>
  );
}
