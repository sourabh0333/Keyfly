"use client";

import { useEffect, useState } from "react";
import styles from "./legal-page.module.css";

/**
 * The legal page's contents: a sticky numbered list beside the text on wide
 * screens, a fold-out list above it on narrow ones. The section being read
 * is marked (the last one whose top has passed a third of the way down).
 */
export function LegalToc({ items, label }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-legal-section]")];
    if (!sections.length) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = innerHeight / 3;
      let current = null;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  const list = (
    <ol className={styles.tocList}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={styles.tocLink}
            aria-current={active === item.id ? "location" : undefined}
          >
            <span className={styles.tocNum}>{String(item.n).padStart(2, "0")}</span>
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <nav className={styles.toc} aria-label={label}>
        <p className={styles.tocLabel}>{label}</p>
        {list}
      </nav>
      <details className={styles.tocFold}>
        <summary>
          {label}
          <span aria-hidden="true">{items.length} sections</span>
        </summary>
        <nav aria-label={label}>{list}</nav>
      </details>
    </>
  );
}
