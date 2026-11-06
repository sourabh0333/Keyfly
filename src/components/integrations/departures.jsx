"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./destinations.module.css";

const ENCODE = 1700; // ms a row encodes
const NEXT = 450; // ms before the next row starts
const HOLD = 4200; // ms the finished board holds
const WIDTH = 8; // characters in the status column
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * A split-flap word: when `text` changes, its tiles riffle through letters
 * and settle left to right. The first render (and the server's HTML) shows
 * the text at once; `still` (reduced motion) skips the riffle.
 */
function Flap({ text, still }) {
  const target = text.padEnd(WIDTH, " ").slice(0, WIDTH);
  const [shown, setShown] = useState(target);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    let tick = 0;
    const timer = setInterval(() => {
      tick++;
      const settled = Math.floor(tick / 2);
      setShown(
        [...target]
          .map((c, i) => (i < settled || c === " " ? c : CHARSET[Math.floor(Math.random() * CHARSET.length)]))
          .join(""),
      );
      if (settled >= WIDTH) clearInterval(timer);
    }, 34);
    return () => clearInterval(timer);
  }, [target]);

  const chars = still ? target : shown;
  return (
    <span className={styles.flap} aria-label={text}>
      {[...chars].map((c, i) => (
        <span key={i} className={styles.tile} aria-hidden="true">
          {c}
        </span>
      ))}
    </span>
  );
}

/**
 * Where the video goes, as a departures board beside an export pass.
 * The board lists the export sheet's presets; while on screen they encode
 * one after another (WAITING → ENCODING, a progress bar → READY, the status
 * column riffling like a split-flap board), hold, and start again. The
 * row in play, or one you choose (which stops the run), fills the pass:
 * from this computer to that destination, the file, the export sheet's
 * options, and a stub: encoded on this device, nothing uploaded. "Pause"
 * holds it (WCAG 2.2.2). The server's HTML and reduced motion show every
 * row READY and TikTok on the pass.
 */
export function Departures({ pause, play, board, pass }) {
  const n = board.presets.length;
  const [step, setStep] = useState(null); // null: not started; 0..2n
  const [selected, setSelected] = useState(1);
  const [chosen, setChosen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !paused && !chosen && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const s = step ?? -1;
    const delay = s < 0 ? 400 : s === 2 * n ? HOLD : s % 2 === 0 ? ENCODE : NEXT;
    const timer = setTimeout(() => {
      const next = s >= 2 * n ? 0 : s + 1;
      setStep(next);
      if (next < 2 * n) setSelected(Math.floor(next / 2));
    }, delay);
    return () => clearTimeout(timer);
  }, [auto, step, n]);

  const live = step !== null && !chosen && !reduced;
  const statusOf = (i) => {
    if (!live) return "ready";
    const row = Math.floor(step / 2);
    if (step === 2 * n || i < row) return "ready";
    if (i > row) return "waiting";
    return step % 2 === 0 ? "encoding" : "ready";
  };
  const destination = board.presets[selected];
  const passStatus = statusOf(selected);

  return (
    <div ref={rootRef} className={styles.wrap} data-main="">
      <div className={styles.layout}>
        {/* The board. */}
        <div className={styles.board}>
          <div className={styles.boardHead}>
            <span className={styles.boardTitle}>
              <span className={styles.plane} aria-hidden="true" />
              {board.title}
            </span>
            <span className={styles.boardFile}>{board.file}</span>
            <span className={styles.boardWhere}>
              <span className={styles.dot} aria-hidden="true" />
              {board.where}
            </span>
          </div>
          <div className={styles.cols} aria-hidden="true">
            <span>{board.columns.index}</span>
            <span>{board.columns.destination}</span>
            <span>{board.columns.status}</span>
          </div>
          <ul className={styles.rows}>
            {board.presets.map((name, i) => {
              const status = statusOf(i);
              return (
                <li key={name}>
                  <button
                    type="button"
                    className={styles.row}
                    aria-pressed={i === selected}
                    data-status={status}
                    onClick={() => {
                      setSelected(i);
                      setChosen(true);
                    }}
                  >
                    <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.destination}>{name}</span>
                    <Flap text={board.statuses[status]} still={reduced} />
                    {status === "encoding" ? <span className={styles.progress} key={step} aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* The export pass. */}
        <div className={styles.pass} data-status={passStatus}>
          <div className={styles.passMain}>
            <div className={styles.passHead}>
              <span className={styles.passBrand}>
                <span className={styles.symbol} aria-hidden="true" />
                {pass.brand}
              </span>
              <span className={styles.passRight}>
                <span className={styles.stamp} aria-hidden="true" key={passStatus}>
                  {board.statuses[passStatus]}
                </span>
                <span className={styles.passKind}>{pass.kind}</span>
              </span>
            </div>

            <div className={styles.route}>
              <div>
                <p className={styles.label}>{pass.from.label}</p>
                <p className={styles.place}>{pass.from.value}</p>
              </div>
              <span className={styles.flight} aria-hidden="true">
                <i />
              </span>
              <div className={styles.toCol}>
                <p className={styles.label}>{pass.to.label}</p>
                <p className={styles.to} key={destination} aria-live="polite">
                  {destination}
                </p>
              </div>
            </div>

            <dl className={styles.meta}>
              <div>
                <dt>{pass.file.label}</dt>
                <dd>{pass.file.value}</dd>
              </div>
              <div>
                <dt>{pass.tabs.label}</dt>
                <dd>{pass.tabs.items.join(" · ")}</dd>
              </div>
            </dl>

            <dl className={styles.options}>
              {pass.rows.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>
                    {row.items.map((item) => (
                      <span key={item} data-pick={item === row.pick ? "" : undefined}>
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
            <p className={styles.small}>
              {pass.defaultNote} · {pass.extra}
            </p>
          </div>

          <div className={styles.stub}>
            <div className={styles.stubText}>
              <p>
                <span className={styles.stubDot} aria-hidden="true" />
                {pass.stub.line}
              </p>
              <small>{pass.stub.sub}</small>
            </div>
            <span className={styles.barcode} aria-hidden="true" />
            <p className={styles.count}>
              <b>{pass.stub.count}</b>
              {pass.stub.countLabel}
            </p>
          </div>

        </div>
      </div>

      {reduced ? null : (
        <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
            {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
          {paused ? play : pause}
        </button>
      )}
    </div>
  );
}
