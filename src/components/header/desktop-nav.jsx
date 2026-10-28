"use client";

import Link from "next/link";
import { useRef } from "react";
import { cx } from "@/lib/cx";
import styles from "./header.module.css";

const HOP_HEIGHT = 9; // px the point rises at the middle of a hop
const HOP_STEPS = 10;

function currentX(point) {
  return new DOMMatrixReadOnly(getComputedStyle(point).transform).m41;
}

/**
 * Desktop navigation. One amber point marks the item under the pointer or
 * keyboard focus, and hops between items along a small arc, the way the
 * brand's point lands at the end of its flight.
 */
export function DesktopNav({ items, className }) {
  const listRef = useRef(null);
  const pointRef = useRef(null);
  const shown = useRef(false);

  function moveTo(link) {
    const point = pointRef.current;
    const list = listRef.current;
    if (!point || !list) return;

    const listBox = list.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    const x = box.left - listBox.left + box.width / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = currentX(point);

    point.getAnimations().forEach((animation) => animation.cancel());
    point.style.transform = `translateX(${x}px)`;
    point.style.opacity = "1";

    if (!shown.current || reduced) {
      // First appearance: drop in and settle.
      point.animate(
        [
          { opacity: 0, transform: `translate(${x}px, -${HOP_HEIGHT}px) scale(0.4)` },
          { opacity: 1, transform: `translateX(${x}px)` },
        ],
        { duration: reduced ? 150 : 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
    } else {
      // Hop along an arc from where the point is right now.
      const frames = Array.from({ length: HOP_STEPS + 1 }, (_, i) => {
        const t = i / HOP_STEPS;
        const lift = Math.sin(Math.PI * t) * HOP_HEIGHT;
        return { offset: t, transform: `translate(${from + (x - from) * t}px, ${-lift}px)` };
      });
      point.animate(frames, { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }
    shown.current = true;
  }

  function hide() {
    const point = pointRef.current;
    if (!point || !shown.current) return;
    shown.current = false;
    const x = currentX(point);
    point.getAnimations().forEach((animation) => animation.cancel());
    point.style.opacity = "0";
    point.animate(
      [
        { opacity: 1, transform: `translateX(${x}px)` },
        { opacity: 0, transform: `translate(${x}px, 4px) scale(0.5)` },
      ],
      { duration: 200, easing: "ease-in" },
    );
  }

  return (
    <nav aria-label="Main" className={cx(styles.desktopNav, className)}>
      <ul
        ref={listRef}
        className={styles.navList}
        onPointerLeave={hide}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) hide();
        }}
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={styles.navLink}
              onPointerEnter={(event) => moveTo(event.currentTarget)}
              onFocus={(event) => moveTo(event.currentTarget)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <span ref={pointRef} className={styles.navPoint} aria-hidden="true" />
    </nav>
  );
}
