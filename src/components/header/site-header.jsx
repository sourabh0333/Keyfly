"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/logo";
import { download, primaryCta, primaryNav, signIn } from "@/content/navigation";
import { MenuBody } from "./mega-menu";
import styles from "./header.module.css";

const OPEN_DELAY = 140; // ms before a hovered menu opens (no accidental opens)
const CLOSE_DELAY = 240; // ms of grace when the pointer leaves for the panel

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path d="m4.5 6.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 2.5v7.5M4.8 7 8 10.2 11.2 7M3 13h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The visitor's system, for the Download button: mac, windows, phone or
// other. The server's HTML says "other" (the Download section).
function getSystem() {
  const ua = navigator.userAgent;
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  if (/Android|iPhone|iPad|iPod/i.test(ua) || (platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "phone";
  if (/Mac/i.test(platform)) return "mac";
  if (/Win/i.test(platform)) return "windows";
  return "other";
}
const never = () => () => {};

/**
 * The site header. At the top of the page it is an open bar; once the page
 * scrolls it gathers into a floating glass pill, slips away while scrolling
 * down and returns on the way up. A light follows the pointer between the
 * navigation links.
 *
 * Product, Use cases and Integrations open a menu: after a short pause on
 * hover (mouse only), or with their chevron button (click, Enter, Space).
 * Each title stays a plain link. Escape closes a menu and returns focus to
 * its button; so does moving the focus or the pointer away. The Download
 * button names the visitor's system. On small screens everything folds
 * into a menu panel whose menus expand in place.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(null); // the open desktop menu's label
  const [expanded, setExpanded] = useState(null); // the phone menu's open item
  const navRef = useRef(null);
  const timer = useRef(0);
  const system = useSyncExternalStore(never, getSystem, () => "other");
  const [intel, setIntel] = useState(false);
  const [started, setStarted] = useState(false);
  const build = system === "mac" && intel ? "macIntel" : system;
  const get = download[build];
  const installs = build === "mac" || build === "macIntel" || build === "windows";

  // Chrome and Edge can say whether a Mac is Intel; Safari can't, so it
  // gets the Apple silicon build with the Intel one offered after a click.
  useEffect(() => {
    if (system !== "mac" || !navigator.userAgentData?.getHighEntropyValues) return;
    navigator.userAgentData
      .getHighEntropyValues(["architecture"])
      .then((v) => setIntel(v.architecture === "x86"))
      .catch(() => {});
  }, [system]);

  // The note after a download starts: gone after 14s, on Escape or on a
  // click elsewhere.
  useEffect(() => {
    if (!started) return;
    const done = setTimeout(() => setStarted(false), 14000);
    const onKey = (event) => event.key === "Escape" && setStarted(false);
    const onDown = (event) => !event.target.closest("[data-download]") && setStarted(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      clearTimeout(done);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [started]);

  const starting = () => installs && setStarted(true);
  const other = build === "mac" ? download.macIntel : build === "macIntel" ? download.mac : null;
  const note = started ? (
    <div className={styles.dlNote} role="status">
      <p className={styles.dlTitle}>
        <i aria-hidden="true" />
        {download.started.title}
        <button type="button" className={styles.dlClose} aria-label={download.started.close} onClick={() => setStarted(false)}>
          ×
        </button>
      </p>
      <p className={styles.dlBuild}>{download.started.build[build]}</p>
      <p className={styles.dlNext}>{download.started.next[build === "windows" ? "windows" : "mac"]}</p>
      <p className={styles.dlLinks}>
        {other ? <a href={other.href}>{download.started.other[build]}</a> : null}
        <a href={get.href}>{download.started.retry}</a>
      </p>
    </div>
  ) : null;

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
    const onResize = () => window.innerWidth > 1000 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // A desktop menu closes on Escape (focus back to its button) or a click
  // outside the header.
  useEffect(() => {
    if (!menu) return;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setMenu(null);
      navRef.current?.querySelector(`[data-menu-button="${menu}"]`)?.focus();
    };
    const onDown = (event) => !event.target.closest("header") && setMenu(null);
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function later(next, delay) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMenu(next), delay);
  }

  // Hovering an item opens its menu after a pause; moving from one open
  // menu straight to another switches at once.
  function enter(event, label) {
    if (event.pointerType !== "mouse") return;
    later(label, menu ? 0 : OPEN_DELAY);
  }
  function leave(event) {
    if (event.pointerType !== "mouse") return;
    later(null, CLOSE_DELAY);
  }
  function toggle(label) {
    clearTimeout(timer.current);
    setMenu((current) => (current === label ? null : label));
  }
  function blurItem(event) {
    const item = event.currentTarget;
    if (item.contains(event.relatedTarget)) return;
    const label = item.dataset.item;
    setMenu((current) => (current === label ? null : current));
  }
  function pick() {
    clearTimeout(timer.current);
    setMenu(null);
    setOpen(false);
  }

  // Move the hover light under whichever top-level link the pointer is on.
  function lightUp(event) {
    const link = event.target.closest("[data-top]");
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
      data-scrolled={scrolled || open || menu ? "" : undefined}
      data-hidden={hidden && !open && !menu ? "" : undefined}
      data-open={open ? "" : undefined}
    >
      <div className={styles.bar}>
        <Logo className={styles.brand} height={26} onClick={pick} />

        <nav ref={navRef} className={styles.nav} aria-label="Main" onPointerOver={lightUp} onPointerLeave={lightOff} onFocus={lightUp} onBlur={lightOff}>
          <span className={styles.light} aria-hidden="true" />
          {primaryNav.map((item) =>
            item.menu ? (
              <div
                key={item.label}
                className={styles.item}
                data-item={item.label}
                data-open={menu === item.label ? "" : undefined}
                onPointerEnter={(event) => enter(event, item.label)}
                onPointerLeave={leave}
                onBlur={blurItem}
              >
                <span className={styles.top} data-top="">
                  <Link href={item.href} className={styles.link} onClick={pick}>
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    className={styles.chevron}
                    data-menu-button={item.label}
                    aria-expanded={menu === item.label}
                    aria-controls={`menu-${item.label.replace(/\W+/g, "-").toLowerCase()}`}
                    aria-label={`${item.label} menu`}
                    onClick={() => toggle(item.label)}
                  >
                    <Chevron />
                  </button>
                </span>
                <div
                  id={`menu-${item.label.replace(/\W+/g, "-").toLowerCase()}`}
                  className={styles.panel}
                  inert={menu !== item.label}
                >
                  <div className={styles.panelInner}>
                    <MenuBody menu={item.menu} onPick={pick} />
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.label} href={item.href} className={styles.link} data-top="" onClick={pick}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className={styles.actions}>
          <a href={signIn.href} className={styles.signIn}>
            {signIn.label}
          </a>
          {/* A short label in the bar; the link still goes to the visitor's
              build, and its accessible name and tooltip say which. */}
          <span className={styles.dlWrap} data-download="">
            <a href={get.href} className={styles.download} data-system={system} aria-label={get.label} title={get.label} onClick={starting}>
              <DownloadIcon />
              {system === "phone" ? get.label : download.label}
            </a>
            {open ? null : note}
          </span>
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
            <div key={item.label} className={styles.menuRow} style={{ "--i": index }}>
              <div className={styles.menuRowHead}>
                <Link href={item.href} className={styles.menuLink} onClick={pick}>
                  <span className={styles.menuIndex}>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
                {item.menu ? (
                  <button
                    type="button"
                    className={styles.menuExpand}
                    aria-expanded={expanded === item.label}
                    aria-label={`${item.label} menu`}
                    onClick={() => setExpanded((current) => (current === item.label ? null : item.label))}
                  >
                    <Chevron />
                  </button>
                ) : null}
              </div>
              {item.menu && expanded === item.label ? <MenuBody menu={item.menu} onPick={pick} compact /> : null}
            </div>
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
          <span className={styles.menuDlWrap} data-download="">
            <a href={get.href} className={styles.download} onClick={starting}>
              <DownloadIcon />
              {get.label}
            </a>
            {open ? note : null}
          </span>
        </div>
      </div>
    </header>
  );
}
