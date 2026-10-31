"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./download.module.css";

const ICON = "/brand/app-icon-macos.svg";
const LIGHTS = 26;

// The flight from the app icon (left) to the platform (right), with one
// loop on the way, like the brand's Flight path gesture.
const FLIGHT = "M190 160 C 300 70, 420 60, 470 118 C 510 168, 450 214, 418 176 C 388 140, 452 82, 548 92 C 650 104, 720 150, 770 160";

// The scroll's share for each part: lift-off, flight, landing.
const LIFT = 0.12;
const LAND = 0.82;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const smooth = (t) => t * t * (3 - 2 * t);

function detect() {
  const ua = navigator.userAgent;
  const platform = navigator.userAgentData?.platform || navigator.platform || "";
  const phone = /Android|iPhone|iPad|iPod/i.test(ua) || (platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (phone) return { id: null, phone: true };
  if (/Mac/i.test(platform)) return { id: "macos", phone: false };
  if (/Win/i.test(platform)) return { id: "windows", phone: false };
  if (/Linux|X11/i.test(platform)) return { id: "linux", phone: false };
  return { id: null, phone: false };
}

// Browser-only facts, read without a render on the server (where they
// fall back to "unknown system").
const SERVER_SYSTEM = { id: null, phone: false };
let systemCache;
const getSystem = () => (systemCache ??= detect());
const never = () => () => {};

function Arrow({ up }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      {up ? (
        <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M8 3v9.5M3.5 8 8 12.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

// Where the icon lands, drawn per platform around (770, 160). Generic
// shapes: no operating system's own artwork.
function Destination({ id }) {
  if (id === "windows") {
    return (
      <g className={styles.dest}>
        <rect x="660" y="78" width="220" height="150" rx="12" className={styles.destFrame} />
        <rect x="672" y="90" width="196" height="112" rx="6" className={styles.destScreen} />
        <rect x="672" y="206" width="196" height="12" rx="3" className={styles.destBar} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={738 + i * 16} y="208" width="9" height="8" rx="2" className={styles.destSlot} />
        ))}
        <rect x="726" y="248" width="88" height="10" rx="2" className={styles.destStand} />
      </g>
    );
  }
  if (id === "linux") {
    return (
      <g className={styles.dest}>
        {[-1, 0, 1].flatMap((row) =>
          [-1, 0, 1].map((col) =>
            row === 0 && col === 0 ? null : (
              <rect key={`${row}${col}`} x={770 + col * 74 - 28} y={160 + row * 74 - 28} width="56" height="56" rx="14" className={styles.destApp} />
            ),
          ),
        )}
        <rect x="744" y="134" width="52" height="52" rx="13" className={styles.destEmpty} />
      </g>
    );
  }
  return (
    <g className={styles.dest}>
      <path d="M676 104a10 10 0 0 1 10-10h50l14 14h100a10 10 0 0 1 10 10v116a10 10 0 0 1-10 10H686a10 10 0 0 1-10-10Z" className={styles.destFolderBack} />
      <path d="M670 132a10 10 0 0 1 10-10h180a10 10 0 0 1 10 10v104a10 10 0 0 1-10 10H680a10 10 0 0 1-10-10Z" className={styles.destFolder} />
      <path d="M752 196h36" className={styles.destMark} />
    </g>
  );
}

/**
 * The landing, played by the scroll: the stage pins (data-live on the
 * track) and scrolling flies a copy of the Keyfly app icon from the
 * source, one loop of the flight path, onto the visitor's platform. Runway
 * lights come on as it passes, the readout counts Download, Install, Open
 * to 100%, and on landing a ring goes out and the buttons light. The
 * platform is picked from the visitor's system and can be changed; the
 * buttons download that build once its link exists and otherwise lead to
 * the browser app. Where the stage doesn't fit the screen, or with reduced
 * motion, nothing pins and it shows landed. Writes --fly (0–1) on the
 * track and data-phase (lift, fly, landed).
 */
export function Landing({ stages, status, hint, platformLabel, platforms, detected, soon, browser, phone: phoneNote }) {
  const system = useSyncExternalStore(never, getSystem, () => SERVER_SYSTEM);
  const [chosen, setChosen] = useState(null);
  const [live, setLive] = useState(false);
  const [phase, setPhase] = useState("landed");
  const [lights, setLights] = useState([]);
  const trackRef = useRef(null);
  const pinRef = useRef(null);
  const pathRef = useRef(null);
  const iconRef = useRef(null);
  const percentRef = useRef(null);
  const phaseRef = useRef("landed");

  const active = platforms.find((p) => p.id === (chosen || system.id)) || platforms[0];
  const download = !system.phone && active.href;
  const stageIndex = phase === "lift" ? 0 : phase === "fly" ? 1 : 2;

  // The runway lights, spaced along the flight once it can be measured.
  useEffect(() => {
    const path = pathRef.current;
    const total = path.getTotalLength();
    const frame = requestAnimationFrame(() =>
      setLights(
        Array.from({ length: LIGHTS }, (_, i) => {
          const t = (i + 1) / (LIGHTS + 1);
          const p = path.getPointAtLength(t * total);
          return { x: p.x, y: p.y, t };
        }),
      ),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  // Pin only where the stage fits the screen and motion is welcome.
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const check = () => {
      frame = 0;
      setLive(!reduced && pinRef.current.firstElementChild.offsetHeight + 96 <= innerHeight);
    };
    const schedule = () => (frame ||= requestAnimationFrame(check));
    const observer = new ResizeObserver(schedule);
    observer.observe(pinRef.current.firstElementChild);
    addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("resize", schedule);
    };
  }, []);

  // Fly the icon to the scroll position (or show it landed).
  useEffect(() => {
    const track = trackRef.current;
    const path = pathRef.current;
    const icon = iconRef.current;
    const total = path.getTotalLength();
    let frame = 0;

    function paint(p) {
      const fly = smooth(clamp((p - LIFT) / (LAND - LIFT), 0, 1));
      const lift = smooth(clamp(p / LIFT, 0, 1));
      const at = path.getPointAtLength(fly * total);
      const scale = (1 + lift * 0.06) * (1 - fly * 0.53);
      icon.setAttribute("transform", `translate(${at.x.toFixed(1)} ${(at.y - lift * (1 - fly) * 14).toFixed(1)}) scale(${scale.toFixed(3)})`);
      track.style.setProperty("--fly", fly.toFixed(4));
      percentRef.current.textContent = `${Math.round(clamp((p - 0.04) / (LAND - 0.04), 0, 1) * 100)}%`;
      const next = p >= LAND ? "landed" : p >= LIFT ? "fly" : "lift";
      if (next !== phaseRef.current) {
        phaseRef.current = next;
        setPhase(next);
      }
    }

    function update() {
      frame = 0;
      const r = track.getBoundingClientRect();
      paint(clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1));
    }
    const schedule = () => (frame ||= requestAnimationFrame(update));

    if (!live) {
      paint(1);
      return;
    }
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [live]);

  return (
    <div ref={trackRef} className={styles.track} data-live={live ? "" : undefined} data-phase={phase}>
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.stage}>
          {/* The readout: where the install is, and how far. */}
          <div className={styles.readout}>
            <p className={styles.status} aria-live="polite">
              <i aria-hidden="true" />
              {phase === "landed" ? status.ready : status.flying}
              <span className={styles.statusTarget}>→ {active.target}</span>
            </p>
            <ol className={styles.stages} aria-hidden="true">
              {stages.map((s, i) => (
                <li key={s} data-on={i === stageIndex ? "" : undefined} data-done={i < stageIndex ? "" : undefined}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </li>
              ))}
            </ol>
            <span ref={percentRef} className={styles.percent} aria-hidden="true">
              100%
            </span>
          </div>

          <svg className={styles.flight} viewBox="40 20 880 290" role="img" aria-label={`Keyfly flying to ${active.target} on ${active.label}`}>
            <defs>
              <radialGradient id="land-glow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#5fe0b0" stopOpacity="0.55" />
                <stop offset="1" stopColor="#5fe0b0" stopOpacity="0" />
              </radialGradient>
            </defs>

            <path ref={pathRef} d={FLIGHT} fill="none" />
            <path d={FLIGHT} pathLength="1" className={styles.guide} />
            <path d={FLIGHT} pathLength="1" className={styles.trail} />
            {lights.map((l) => (
              <circle key={l.t} cx={l.x.toFixed(1)} cy={l.y.toFixed(1)} r="3" className={styles.light} style={{ "--t": l.t.toFixed(3) }} />
            ))}

            {/* The source: Keyfly, as it ships. */}
            <image href={ICON} x="90" y="60" width="200" height="200" className={styles.source} />
            <text x="190" y="296" className={styles.label}>
              Keyfly
            </text>

            <Destination id={active.id} />
            <text x="770" y="296" className={styles.label}>
              {active.target}
            </text>

            <circle cx="770" cy="160" r="110" fill="url(#land-glow)" className={styles.glow} />
            <circle key={phase === "landed" ? active.id : "air"} cx="770" cy="160" r="40" className={styles.ring} />

            {/* The copy in flight; it ends at the platform, installed. */}
            <g ref={iconRef} transform="translate(770 160) scale(0.47)">
              <image href={ICON} x="-100" y="-100" width="200" height="200" className={styles.flying} />
            </g>
          </svg>

          <div className={styles.controls}>
            <div className={styles.platforms} role="group" aria-label={platformLabel}>
              {platforms.map((p) => (
                <button key={p.id} type="button" className={styles.platform} aria-pressed={p.id === active.id} onClick={() => setChosen(p.id)}>
                  {p.label}
                  {p.id === system.id ? <span className={styles.detected}>{detected}</span> : null}
                </button>
              ))}
            </div>

            <p className={styles.step}>{system.phone ? phoneNote : active.step}</p>

            <div className={styles.actions}>
              {download ? (
                <>
                  <a href={active.href} className={styles.primary} download>
                    Download for {active.label}
                    <Arrow />
                  </a>
                  <a href={browser.href} className={styles.secondary}>
                    {browser.label}
                    <Arrow up />
                  </a>
                </>
              ) : (
                <>
                  {system.phone ? null : (
                    <span className={styles.soon}>
                      <i />
                      {active.label} · {soon}
                    </span>
                  )}
                  <a href={browser.href} className={styles.primary}>
                    {browser.label}
                    <Arrow up />
                  </a>
                </>
              )}
            </div>
          </div>

          <p className={styles.hint} aria-hidden="true">
            {hint}
          </p>
        </div>
      </div>
    </div>
  );
}
