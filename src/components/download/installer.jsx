"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./download.module.css";

const ICON = "/brand/app-icon-macos.svg";
const DUR = "4.8s";

// The flight from the app icon (left) to the platform (right), with one
// loop on the way, like the brand's Flight path gesture.
const FLIGHT = "M190 160 C 300 70, 420 60, 470 118 C 510 168, 450 214, 418 176 C 388 140, 452 82, 548 92 C 650 104, 720 150, 770 160";

// Shared timing: hold at the source, fly, land, rest.
const KEY_TIMES = "0;0.14;0.62;1";

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
// fall back to "unknown system, motion allowed").
const SERVER_SYSTEM = { id: null, phone: false };
let systemCache;
const getSystem = () => (systemCache ??= detect());
const never = () => () => {};

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

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
 * The install moment from the brand kit's DMG art, animated: a copy of the
 * Keyfly app icon lifts off, flies one loop of the flight path and lands
 * on the chosen platform, where the mint point pulses. It loops while on
 * screen (SVG timeline, paused off screen), and with reduced motion shows
 * the icon already in place. The platform is picked from the visitor's
 * system; the buttons download that build once its link exists and
 * otherwise lead to the browser app.
 */
export function Installer({ title, platformLabel, stepLabel, trackLabel, stages, platforms, detected, soon, browser, phone: phoneNote }) {
  const system = useSyncExternalStore(never, getSystem, () => SERVER_SYSTEM);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const [chosen, setChosen] = useState(null);
  const [visible, setVisible] = useState(true);
  const svgRef = useRef(null);

  // Play the flight only while it is on screen.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reduced) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, [chosen, system.id, reduced]);

  const active = platforms.find((p) => p.id === (chosen || system.id)) || platforms[0];
  const download = !system.phone && active.href;

  return (
    <div className={styles.window} data-paused={visible ? undefined : ""}>
      <div className={styles.chrome}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.file}>
          {title}
          <span className={styles.fileMuted}> · Keyfly</span>
        </span>
        <span className={styles.target}>→ {active.target}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.viewer}>
            <svg key={active.id} ref={svgRef} className={styles.stage} viewBox="0 0 960 320" role="img" aria-label={`Keyfly installing on ${active.label}`}>
              <defs>
                <radialGradient id="dl-glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#5fe0b0" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#5fe0b0" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* The path, faint, and the trail the flight leaves on it. */}
              <path d={FLIGHT} pathLength="1" className={styles.guide} />
              <path d={FLIGHT} pathLength="1" className={styles.trail} strokeDasharray="1 1" strokeDashoffset={reduced ? 0 : 1}>
                {reduced ? null : <animate attributeName="stroke-dashoffset" values="1;1;0;0" keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1;0.65 0 0.35 1;0 0 1 1" />}
                {reduced ? null : <animate attributeName="opacity" values="1;1;1;0" keyTimes="0;0.6;0.8;1" dur={DUR} repeatCount="indefinite" />}
              </path>

              {/* The source: Keyfly, as it ships. */}
              <image href={ICON} x="90" y="60" width="200" height="200" className={styles.source} />
              <text x="190" y="292" className={styles.label}>
                Keyfly
              </text>

              <Destination id={active.id} />
              <text x="770" y="292" className={styles.label}>
                {active.target}
              </text>

              {/* Landing: a glow and a ring where the point lands, and the icon in place. */}
              <circle cx="770" cy="160" r="90" fill="url(#dl-glow)" opacity={reduced ? 0.6 : 0}>
                {reduced ? null : <animate attributeName="opacity" values="0;0;1;0.5;0" keyTimes="0;0.6;0.66;0.85;1" dur={DUR} repeatCount="indefinite" />}
              </circle>
              {reduced ? null : (
                <circle cx="770" cy="160" r="30" className={styles.ring}>
                  <animate attributeName="r" values="30;30;30;80;80" keyTimes="0;0.61;0.62;0.82;1" dur={DUR} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0;0.9;0;0" keyTimes="0;0.61;0.62;0.82;1" dur={DUR} repeatCount="indefinite" />
                </circle>
              )}
              <image href={ICON} x="725" y="115" width="90" height="90" opacity={reduced ? 1 : 0}>
                {reduced ? null : <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.61;0.62;0.94;1" dur={DUR} repeatCount="indefinite" />}
              </image>

              {/* The copy in flight. */}
              {reduced ? null : (
                <g opacity="0">
                  <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.1;0.6;0.62;1" dur={DUR} repeatCount="indefinite" />
                  <animateMotion path={FLIGHT} keyPoints="0;0;1;1" keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1;0.65 0 0.35 1;0 0 1 1" />
                  <g>
                    <animateTransform attributeName="transform" type="scale" values="1;1;0.45;0.45" keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" calcMode="spline" keySplines="0 0 1 1;0.65 0 0.35 1;0 0 1 1" />
                    <image href={ICON} x="-100" y="-100" width="200" height="200" className={styles.flying} />
                  </g>
                </g>
              )}
            </svg>
        </div>

        <div className={styles.panel}>
          <p className={styles.panelLabel}>{platformLabel}</p>
          <div className={styles.platforms} role="group" aria-label={platformLabel}>
            {platforms.map((p) => (
              <button key={p.id} type="button" className={styles.platform} aria-pressed={p.id === active.id} onClick={() => setChosen(p.id)}>
                <span className={styles.tick} aria-hidden="true" />
                {p.label}
                {p.id === system.id ? <span className={styles.detected}>{detected}</span> : null}
              </button>
            ))}
          </div>

          <p className={styles.panelLabel}>{stepLabel}</p>
          <p className={styles.step} aria-live="polite">
            {system.phone ? phoneNote : active.step}
          </p>

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
                <a href={browser.href} className={styles.primary}>
                  {browser.label}
                  <Arrow up />
                </a>
                {system.phone ? null : (
                  <span className={styles.soon}>
                    <i />
                    {active.label} · {soon}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* The install on a timeline: the playhead runs with the flight. */}
      <div className={styles.timeline} aria-hidden="true">
        <div className={styles.ruler} />
        <div className={styles.track}>
          <span className={styles.trackLabel}>{trackLabel}</span>
          <div className={styles.lane}>
            {stages.map((stage, i) => (
              <span key={stage} className={styles.clip} data-i={i}>
                {stage}
              </span>
            ))}
            <span key={active.id} className={styles.playhead} data-still={reduced ? "" : undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
