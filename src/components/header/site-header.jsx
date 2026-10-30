"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { primaryCta, primaryNav, signIn } from "@/content/navigation";
import styles from "./header.module.css";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The site header. At the top of the page it is an open bar; once the page
 * scrolls it gathers into a floating glass pill, slips away while scrolling
 * down and returns on the way up. A light follows the pointer between the
 * navigation links. On small screens the links fold into a menu panel.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 12);
      // Hide only after a real move down, well past the hero's top.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 860 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // Move the hover light under whichever link the pointer is on.
  function lightUp(event) {
    const link = event.target.closest("a");
    const nav = navRef.current;
    if (!link || !nav) return;
    nav.style.setProperty("--lx", `${link.offsetLeft}px`);
    nav.style.setProperty("--lw", `${link.offsetWidth}px`);
    nav.dataset.lit = "";
  }

  function lightOff() {
    delete navRef.current?.dataset.lit;
  }

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled || open ? "" : undefined}
      data-hidden={hidden && !open ? "" : undefined}
      data-open={open ? "" : undefined}
    >
      <div className={styles.bar}>
        <Logo className={styles.brand} height={26} onClick={() => setOpen(false)} />

        <nav ref={navRef} className={styles.nav} aria-label="Main" onPointerOver={lightUp} onPointerLeave={lightOff} onFocus={lightUp} onBlur={lightOff}>
          <span className={styles.light} aria-hidden="true" />
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href={signIn.href} className={styles.signIn}>
            {signIn.label}
          </a>
          <a href={primaryCta.href} className={styles.cta}>
            <span>{primaryCta.label}</span>
            <Arrow />
          </a>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="site-menu" className={styles.menu} hidden={!open}>
        <nav aria-label="Menu">
          {primaryNav.map((item, index) => (
            <Link key={item.href} href={item.href} className={styles.menuLink} style={{ "--i": index }} onClick={() => setOpen(false)}>
              <span className={styles.menuIndex}>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.menuActions}>
          <a href={signIn.href} className={styles.signIn}>
            {signIn.label}
          </a>
          <a href={primaryCta.href} className={styles.cta}>
            <span>{primaryCta.label}</span>
            <Arrow />
          </a>
        </div>
      </div>
    </header>
  );
}
