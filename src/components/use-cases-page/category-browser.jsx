"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { TemplateCard } from "./template-card";
import styles from "./browse.module.css";

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Every template, by category. A filter bar (the app's own filters: shape
 * and length) narrows every shelf at once and counts what is left; an
 * index of the ten categories (sticky beside the shelves, a row of chips on
 * narrow screens) shows each one's count and lights the one in view. Each
 * category is a section with its name, a line, its count, a link to open
 * it in KeyFly and a shelf of its templates at their real shapes. A preview
 * plays only while its card is on screen; reduced motion shows the stills.
 */
export function CategoryBrowser({ categories, filters, count, clear, indexLabel, empty, open }) {
  const [shape, setShape] = useState("all");
  const [length, setLength] = useState("all");
  const [active, setActive] = useState(categories[0].id);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const range = filters.length.options.find((o) => o.id === length);
  const shown = useMemo(
    () =>
      categories.map((c) => ({
        ...c,
        shown: c.templates.filter((t) => (shape === "all" || t.shape === shape) && t.seconds >= range.min && t.seconds <= range.max),
      })),
    [categories, shape, range],
  );
  const total = shown.reduce((n, c) => n + c.shown.length, 0);
  const filtered = shape !== "all" || length !== "all";

  // Light the category in view.
  useEffect(() => {
    const sections = [...rootRef.current.querySelectorAll("[data-category]")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.dataset.category);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // On narrow screens the index is a row of chips that scrolls sideways:
  // keep the category in view centred in it.
  useEffect(() => {
    const row = rootRef.current.querySelector("nav ol");
    const link = row?.querySelector("[data-on]");
    if (!link || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({ left: link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2, behavior: reduced ? "instant" : "smooth" });
  }, [active, reduced]);

  // Previews play while on screen (re-observed when the filters change the
  // cards); with reduced motion they stay on their stills.
  useEffect(() => {
    if (reduced) return;
    const videos = [...rootRef.current.querySelectorAll("video")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) target.play().catch(() => {});
          else target.pause();
        }
      },
      { rootMargin: "80px 0px" },
    );
    videos.forEach((v) => observer.observe(v));
    return () => {
      observer.disconnect();
      videos.forEach((v) => v.pause());
    };
  }, [reduced, shape, length]);

  const chips = (key, value, set) => (
    <div className={styles.filter} role="group" aria-label={filters[key].label}>
      <span className={styles.filterLabel}>{filters[key].label}</span>
      {filters[key].options.map((o) => (
        <button key={o.id} type="button" className={styles.chip} aria-pressed={value === o.id} onClick={() => set(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className={styles.browser}>
      <div className={styles.bar} data-main="">
        {chips("shape", shape, setShape)}
        {chips("length", length, setLength)}
        <p className={styles.count} aria-live="polite">
          <b>{count.replace("{n}", total)}</b>
          {filtered ? (
            <button
              type="button"
              className={styles.clear}
              onClick={() => {
                setShape("all");
                setLength("all");
              }}
            >
              {clear}
            </button>
          ) : null}
        </p>
      </div>

      <div className={styles.layout}>
        <nav className={styles.index} aria-label={indexLabel}>
          <p className={styles.indexLabel}>{indexLabel}</p>
          <ol>
            {shown.map((c, i) => (
              <li key={c.id}>
                <a href={`#${c.id}`} data-on={active === c.id ? "" : undefined} data-empty={c.shown.length ? undefined : ""} aria-current={active === c.id ? "true" : undefined}>
                  <em>{pad(i + 1)}</em>
                  <span>{c.name}</span>
                  <b>{c.shown.length}</b>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.shelves}>
          {shown.map((c, i) => (
            <section key={c.id} id={c.id} data-category={c.id} className={styles.category} aria-labelledby={`${c.id}-title`}>
              <header className={styles.catHead}>
                <div>
                  <p className={styles.catIndex}>
                    {pad(i + 1)} <span>· {c.shown.length === c.templates.length ? `${c.templates.length} templates` : `${c.shown.length} of ${c.templates.length}`}</span>
                  </p>
                  <h3 id={`${c.id}-title`} className={styles.catName}>
                    {c.name}
                  </h3>
                  <p className={styles.catLine}>{c.line}</p>
                </div>
                <a className={styles.open} href={open.href} target="_blank" rel="noreferrer">
                  {open.label} <Arrow />
                </a>
              </header>
              {c.shown.length ? (
                <ul className={styles.shelf}>
                  {c.shown.map((t) => (
                    <li key={t.name}>
                      <TemplateCard template={t} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>{empty}</p>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
