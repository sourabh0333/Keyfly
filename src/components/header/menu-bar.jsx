"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { footerContent } from "@/content/navigation";
import styles from "./menu-bar.module.css";

const CLOSE_FALLBACK_MS = 700;

function MenuIcon() {
  return (
    <span className={styles.icon} aria-hidden="true">
      <span className={styles.lineTop} />
      <span className={styles.lineMid} />
      <span className={styles.lineBottom} />
    </span>
  );
}

/**
 * The menu bar: a small floating bar at the bottom of the screen that names
 * the section you are in (from the nearest [data-section] at the middle of
 * the viewport) and opens the menu. A mint line along its foot fills as the
 * page scrolls.
 *
 * The menu is a native modal <dialog> (focus stays inside, Escape closes,
 * the page behind is inert). It opens as a circle growing from the bar and
 * the links rise in one after another.
 */
export function MenuBar({ items, cta }) {
  const dialogRef = useRef(null);
  const toggleRef = useRef(null);
  const labelRef = useRef(null);
  const closingRef = useRef(0);
  const [openCount, setOpenCount] = useState(0);

  // The opening reveal is pure CSS (@starting-style on [open]), so it runs
  // even when animation frames are throttled. Closing sets data-closing,
  // lets the circle shrink, then really closes the dialog.
  const finishClose = useCallback(() => {
    const dialog = dialogRef.current;
    clearTimeout(closingRef.current);
    closingRef.current = 0;
    if (dialog) {
      dialog.close();
      delete dialog.dataset.closing;
    }
    delete document.documentElement.dataset.scrollLocked;
  }, []);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closingRef.current) return;
    dialog.dataset.closing = "";
    closingRef.current = window.setTimeout(finishClose, CLOSE_FALLBACK_MS);
  }, [finishClose]);

  function open() {
    const dialog = dialogRef.current;
    const toggle = toggleRef.current;
    if (!dialog || !toggle) return;

    // Reopened mid-close: just reverse the closing animation.
    if (dialog.open) {
      clearTimeout(closingRef.current);
      closingRef.current = 0;
      delete dialog.dataset.closing;
      return;
    }

    const box = toggle.getBoundingClientRect();
    dialog.style.setProperty("--origin-x", `${box.left + box.width / 2}px`);
    dialog.style.setProperty("--origin-y", `${box.top + box.height / 2}px`);
    document.documentElement.dataset.scrollLocked = "";
    setOpenCount((count) => count + 1);
    dialog.showModal();
  }

  useEffect(() => {
    const dialog = dialogRef.current;

    const onCancel = (event) => {
      event.preventDefault(); // animate out instead of vanishing
      close();
    };
    const onTransitionEnd = (event) => {
      if (event.target === dialog && event.propertyName === "clip-path" && "closing" in dialog.dataset) {
        finishClose();
      }
    };

    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("transitionend", onTransitionEnd);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("transitionend", onTransitionEnd);
      clearTimeout(closingRef.current);
      delete document.documentElement.dataset.scrollLocked;
    };
  }, [close, finishClose]);

  // The section label follows the scroll (written straight to the DOM).
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)
        .find((el) => el.closest("[data-section]"));
      const label = under?.closest("[data-section]")?.dataset.section ?? "Home";
      if (labelRef.current && labelRef.current.textContent !== label) labelRef.current.textContent = label;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={styles.bar}
        aria-haspopup="dialog"
        aria-controls="site-menu"
        onClick={open}
      >
        <span ref={labelRef} className={styles.label}>
          Home
        </span>
        <MenuIcon />
        <span className="visually-hidden">, open menu</span>
        <span className={styles.progress} aria-hidden="true" />
      </button>

      <dialog ref={dialogRef} id="site-menu" className={styles.menu} aria-label="Menu" data-tone="night">
        <div className={styles.top}>
          {/* Keyed so the logo animation replays on every open. */}
          <Logo key={openCount} className={styles.brand} height={28} onClick={close} />
          <button type="button" className={styles.close} onClick={close}>
            <span className={styles.closeText}>Close</span>
            <span className={styles.cross} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Main" className={styles.nav}>
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li key={item.href} style={{ "--i": index }}>
                <Link href={item.href} className={styles.link} onClick={close}>
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.foot} style={{ "--i": items.length }}>
          <Button href={cta.href} size="l" arrow onClick={close}>
            {cta.label}
          </Button>
          <p className={styles.note}>{footerContent.note}</p>
        </div>
      </dialog>
    </>
  );
}
