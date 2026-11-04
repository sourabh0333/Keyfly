"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./brand.module.css";

// The steps: 1 the address is in and the scan runs; 2–6 each kit field is
// found (logo, colours, font, tone, voice); 7 the kit is done and applied.
const LAST = 7;
const TIMES = [900, 1500, 900, 900, 900, 900, 900, 4400]; // ms on each step

const pad = (n) => String(n).padStart(2, "0");
const WAVE = Array.from({ length: 22 }, (_, i) => 0.25 + ((Math.sin(i * 1.5) + Math.sin(i * 0.55) + 2) / 4) * 0.75);

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Mark() {
  return <i className={styles.mark} aria-hidden="true" />;
}

/**
 * Brand's stage: "Analyze with AI" on an illustrative website (left) and
 * the brand kit it fills (right), joined by a mint connector; beneath,
 * three new videos that take the kit once it's done, and the templates the
 * app suggests for it.
 *
 * The steps run in order and what each finds stays (data-reached on the
 * stage, "1 2 …" matched with ~=): the address types in and the scan
 * sweeps the page; then a mint ring lands on what each field is read from
 * (the logo; five colours; the headline's font; the copy's tone) as its
 * row in the kit fills; the voice-over is chosen to match; then the kit is
 * marked default and the videos turn on-brand. It runs while on screen,
 * holds, then starts again; a button pauses it (WCAG 2.2.2). Reduced
 * motion: the kit complete and applied, nothing moves.
 */
export function KitScan({ pause, play, site, kit, colours, every }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const shown = reduced ? LAST : step;
  const reached = Array.from({ length: shown }, (_, i) => i + 1).join(" ");
  const running = visible && !paused && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setStep((s) => (s >= LAST ? 0 : s + 1)), TIMES[step]);
    return () => clearTimeout(timer);
  }, [running, step]);

  const swatch = (i) => ({ "--c": colours[i] });

  return (
    <div ref={rootRef} className={styles.stage} data-main="" data-step={shown} data-reached={reached} data-paused={visible ? undefined : ""}>
      <div className={styles.columns}>
        {/* The website, being read. */}
        <div className={styles.siteCol}>
          <p className={styles.kicker}>
            <span>01</span> Your website
          </p>
          <div className={styles.browser} aria-hidden="true">
            <div className={styles.chrome}>
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.url}>
                <span className={styles.urlText}>{site.url}</span>
                <i className={styles.caret} />
              </span>
              <span className={styles.analyze}>
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <path d="M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8 6.6 6.6Z" fill="currentColor" />
                </svg>
                {site.analyze}
              </span>
            </div>

            <div className={styles.page} style={swatch(2)}>
              <span className={styles.scan} />
              <span className={styles.reading}>
                <i />
                {site.scanning}
              </span>

              <div className={styles.nav}>
                <span className={styles.brandName} data-ring="logo">
                  <Mark />
                  {site.name}
                </span>
                <span className={styles.navLinks}>
                  {site.nav.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </div>

              <div className={styles.hero}>
                <div className={styles.copy}>
                  <p className={styles.headline} data-ring="font">
                    {site.headline}
                  </p>
                  <p className={styles.sub} data-ring="tone">
                    {site.sub}
                  </p>
                  <span className={styles.cta} style={swatch(0)} data-ring="colour">
                    {site.cta}
                  </span>
                </div>
                <div className={styles.phone} style={swatch(1)} data-ring="colour">
                  <span className={styles.streak}>
                    {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                      <i key={d} style={d % 3 === 2 ? swatch(3) : swatch(4)} />
                    ))}
                  </span>
                  <b>30</b>
                  <em>day streak</em>
                </div>
              </div>
              {/* Where the colours are read from: a ring on each. */}
              <span className={styles.pick} style={{ ...swatch(2), left: "6%", top: "78%" }} />
              <span className={styles.pick} style={{ ...swatch(3), left: "80%", top: "41%" }} />
              <span className={styles.pick} style={{ ...swatch(4), left: "70%", top: "41%" }} />
            </div>
          </div>
        </div>

        <span className={styles.connector} aria-hidden="true">
          <i />
        </span>

        {/* The brand kit, filling. */}
        <div className={styles.kitCol}>
          <div className={styles.kitHead}>
            <p className={styles.kicker}>
              <span>02</span> Your brand kit
            </p>
            {reduced ? null : (
              <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
                <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
                  {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
                </svg>
                {paused ? play : pause}
              </button>
            )}
          </div>
          <div className={styles.kit}>
            <p className={styles.kitTitle}>
              <span>{kit.label}</span>
              <b>{kit.name}</b>
              <em>{kit.default}</em>
            </p>
            <ol className={styles.fields}>
              {kit.fields.map((f, i) => (
                <li key={f.id} className={styles.field} data-field={f.id}>
                  <span className={styles.fieldIndex}>{pad(i + 1)}</span>
                  <span className={styles.sample} aria-hidden="true">
                    {f.id === "logo" ? (
                      <span className={styles.sLogo}>
                        <Mark />
                        <b className={styles.version} />
                        <b className={styles.version} />
                      </span>
                    ) : f.id === "colours" ? (
                      <span className={styles.sColours}>
                        {colours.map((c, n) => (
                          <i key={c} style={{ "--c": c, "--i": n }} />
                        ))}
                      </span>
                    ) : f.id === "font" ? (
                      <span className={styles.sFont}>Aa</span>
                    ) : f.id === "tone" ? (
                      <span className={styles.sTone}>“…”</span>
                    ) : (
                      <span className={styles.sVoice}>
                        {WAVE.map((h, n) => (
                          <i key={n} style={{ "--h": h.toFixed(2) }} />
                        ))}
                      </span>
                    )}
                  </span>
                  <span className={styles.fieldBody}>
                    <span className={styles.fieldLabel}>{f.label}</span>
                    <span className={styles.fieldValue}>{f.value}</span>
                  </span>
                  <span className={styles.check} aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="10" height="10">
                      <path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </li>
              ))}
            </ol>
            <p className={styles.done}>
              <i />
              {kit.done}
            </p>
          </div>
        </div>
      </div>

      {/* Every new video, on-brand once the kit is done. */}
      <div className={styles.every}>
        <p className={styles.everyLabel}>{every.label}</p>
        <div className={styles.videos} aria-hidden="true">
          {every.videos.map((v) => (
            <span key={v.ratio} className={styles.video} style={{ "--r": `${v.w} / ${v.h}` }}>
              <span className={styles.frame} style={{ ...swatch(1), "--accent": colours[0], "--light": colours[2] }}>
                <Mark />
                <b>{v.title}</b>
                <span className={styles.bar} />
              </span>
              <em>{v.ratio}</em>
            </span>
          ))}
        </div>
        <div className={styles.suggested}>
          <p>
            {every.suggested.label}
            <span>{every.suggested.sub}</span>
          </p>
          <ul>
            {every.suggested.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className={styles.team}>{every.team}</p>
        </div>
      </div>
    </div>
  );
}
