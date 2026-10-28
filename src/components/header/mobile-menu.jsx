"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { FlightPath } from "@/components/flight-path";
import { Logo } from "@/components/logo";
import { footerContent } from "@/content/navigation";
import styles from "./mobile-menu.module.css";

const CLOSE_FALLBACK_MS = 700;

function MenuIcon() {
  // Two lines; the short one ends in the amber point, like a tiny flight.
  return (
    <span className={styles.icon} aria-hidden="true">
      <span className={styles.lineTop} />
      <span className={styles.lineBottom} />
      <span className={styles.iconPoint} />
    </span>
  );
}

/**
 * Small-screen menu: a native modal <dialog> (focus stays inside, Escape
 * closes, the page behind is inert). It opens as a circle that grows from
 * the menu button, the links arrive one after another and the flight path
 * draws itself each time it opens.
 */
export function MobileMenu({ items, cta }) {
  const dialogRef = useRef(null);
  const toggleRef = useRef(null);
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
    const desktop = window.matchMedia("(min-width: 960px)");

    const onCancel = (event) => {
      event.preventDefault(); // animate out instead of vanishing
      close();
    };
    const onTransitionEnd = (event) => {
      if (
        event.target === dialog &&
        event.propertyName === "clip-path" &&
        "closing" in dialog.dataset
      ) {
        finishClose();
      }
    };
    const onDesktop = (event) => event.matches && finishClose();

    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("transitionend", onTransitionEnd);
    desktop.addEventListener("change", onDesktop);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("transitionend", onTransitionEnd);
      desktop.removeEventListener("change", onDesktop);
      clearTimeout(closingRef.current);
      delete document.documentElement.dataset.scrollLocked;
    };
  }, [close, finishClose]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-haspopup="dialog"
        aria-controls="mobile-menu"
        onClick={open}
      >
        <MenuIcon />
        <span className="visually-hidden">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        className={styles.menu}
        aria-label="Menu"
        data-tone="paper"
      >
        <div className={styles.top}>
          {/* Keyed so the logo animation replays on every open. */}
          <Logo key={openCount} className={styles.brand} height={36} onClick={close} />
          <button type="button" className={styles.close} onClick={close}>
            <MenuIcon />
            <span className="visually-hidden">Close menu</span>
          </button>
        </div>

        <nav aria-label="Main" className={styles.nav}>
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li key={item.href} style={{ "--i": index }}>
                <Link href={item.href} className={styles.link} onClick={close}>
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

        <FlightPath key={openCount} play="load" className={styles.mark} />
      </dialog>
    </>
  );
}
