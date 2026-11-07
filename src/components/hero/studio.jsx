"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { sketchPlan } from "./studio-plan";
import styles from "./studio.module.css";

// Small line icons in the app's style (16 × 16, 1.5 stroke).
const PATHS = {
  home: "M2.5 7.5 8 3l5.5 4.5V13a.5.5 0 0 1-.5.5H9.5V10h-3v3.5H3a.5.5 0 0 1-.5-.5Z",
  videos: "M2.5 4.5h11v8h-11ZM2.5 7h11M5.5 4.5 7 7M9 4.5 10.5 7",
  templates: "M2.5 2.5h4.5v4.5H2.5ZM9 2.5h4.5v4.5H9ZM2.5 9h4.5v4.5H2.5ZM9 9h4.5v4.5H9Z",
  brand: "M3 3h10v10H3ZM6 6.5h.01M5.5 10.5h5",
  settings: "M8 5.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4",
  keyboard: "M2 4.5h12v7H2ZM4.5 7h.01M7 7h.01M9.5 7h.01M12 7h.01M5 9.5h6",
  media: "M2.5 3h11v10h-11ZM2.5 6.5h11M2.5 9.5h11M6 3v10M10 3v10",
  text: "M3.5 4V3h9v1M8 3v10M6.5 13h3",
  graphics: "M8 2.5 9.2 6l3.3.3-2.5 2.2.8 3.3L8 10l-2.8 1.8.8-3.3-2.5-2.2L6.8 6Z",
  transitions: "M5.5 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0ZM2 8h3.5M10.5 8H14",
  undo: "M6 4 3 7l3 3M3 7h6.5a3.5 3.5 0 0 1 0 7H8",
  redo: "M10 4l3 3-3 3M13 7H6.5a3.5 3.5 0 0 0 0 7H8",
  grid: "M2.5 2.5h4.5v4.5H2.5ZM9 2.5h4.5v4.5H9ZM2.5 9h4.5v4.5H2.5ZM9 9h4.5v4.5H9Z",
  ratio: "M2.5 4.5h11v7h-11Z",
  share: "M10.5 3.5 13 6l-2.5 2.5M13 6H7.5A3.5 3.5 0 0 0 4 9.5V12",
  export: "M8 2.5v7M5 6.5l3 3 3-3M3 11v2.5h10V11",
  panel: "M2.5 3h11v10h-11ZM10 3v10",
  bell: "M4 11V7.5a4 4 0 0 1 8 0V11l1 1.5H3ZM6.5 14h3",
  chevron: "m4.5 6 3.5 3.5L11.5 6",
  collapse: "M10 4 6 8l4 4",
  upload: "M8 10.5V3M5 6l3-3 3 3M3 11v2.5h10V11",
  prev: "M4.5 3.5v9M12 3.5 6.5 8l5.5 4.5Z",
  next: "M11.5 3.5v9M4 3.5 9.5 8 4 12.5Z",
  camera: "M2.5 5h2.5l1-1.5h4l1 1.5h2.5v7.5h-11ZM8 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  fit: "M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10",
  full: "M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10M6 6l-3-3M10 6l3-3M10 10l3 3M6 10l-3 3",
  curves: "M2.5 12.5c3 0 3-9 5.5-9s2.5 9 5.5 9",
  pointer: "M4 2.5 12 8l-3.5.8L7 12.5Z",
  razor: "M5 5a2 2 0 1 1-2.8 2.8A2 2 0 0 1 5 5Zm0 6a2 2 0 1 1-2.8 2.8A2 2 0 0 1 5 11ZM6 6.5l7.5 5M6 9.5l7.5-5",
  split: "M8 2.5v11M4.5 5.5h-2v5h2M11.5 5.5h2v5h-2",
  copy: "M5.5 5.5h8v8h-8ZM2.5 10.5v-8h8",
  trash: "M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 9h5.8l.6-9",
  plus: "M8 3v10M3 8h10",
  magnet: "M4 3v5a4 4 0 0 0 8 0V3M4 5.5h2.5M9.5 5.5H12",
  target: "M8 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3",
  bookmark: "M4.5 2.5h7v11L8 11l-3.5 2.5Z",
  lines: "M3 4.5h10M3 8h10M3 11.5h10",
  minus: "M3.5 8h9",
  expand: "M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9",
  sparkle: "M7 2.5 8.1 6l3.4 1-3.4 1L7 11.5 5.9 8 2.5 7l3.4-1Z",
  sliders: "M3 4.5h6M11 4.5h2M3 11.5h2M7 11.5h6M9 3v3M5 10v3",
  captions: "M2.5 4h11v8h-11ZM4.5 7.5h3M8.5 7.5h3M4.5 9.5h5",
  chat: "M3 3.5h10v7H7l-3 2.5v-2.5H3Z",
  popout: "M9.5 2.5h4v4M13.5 2.5 8 8M11.5 9.5v4h-9v-9h4",
  close: "m4 4 8 8M12 4l-8 8",
  search: "M7 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8ZM13 13l-3.2-3.2",
  attach: "M11 5.5 6.2 10.3a1.5 1.5 0 0 0 2.1 2.1l5-5a3 3 0 0 0-4.2-4.2l-5 5a4.5 4.5 0 0 0 6.4 6.4L13 12",
  up: "M8 13V3.5M3.5 8 8 3.5 12.5 8",
  cloud: "M4.5 12.5a3 3 0 0 1-.3-6 4 4 0 0 1 7.6 1 2.5 2.5 0 0 1 .2 5Z",
  bolt: "M9 1.5 3.5 9H8l-1 5.5L12.5 7H8Z",
  revert: "M3.5 5.5h6a3.5 3.5 0 0 1 0 7H6M6 3 3.5 5.5 6 8",
  retry: "M12.5 8a4.5 4.5 0 1 1-1.3-3.2M12.5 3v2.5H10",
  mail: "M2 3.5h12v9H2ZM2.8 4.6 8 8.6l5.2-4",
  arrow: "m6 3.5 4.5 4.5L6 12.5",
};

function Icon({ name, size = 16 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" className={styles.icon}>
      <path d={PATHS[name]} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Play({ size = 16 }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <path d="M5.2 3v10L13 8Z" fill="currentColor" />
    </svg>
  );
}

// The sign-in providers' marks, as on the app's own sign-up page.
function ProviderMark({ name }) {
  if (name === "Google")
    return (
      <svg viewBox="0 0 18 18" width="15" height="15" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
        <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
      </svg>
    );
  if (name === "GitHub")
    return (
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 0a8 8 0 0 0-2.53 15.6c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.67.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.8 0H1.2C.54 0 0 .52 0 1.16v13.68C0 15.48.54 16 1.2 16h13.6c.66 0 1.2-.52 1.2-1.16V1.16C16 .52 15.46 0 14.8 0ZM4.75 13.63H2.38V6h2.37v7.63ZM3.56 4.96a1.37 1.37 0 1 1 0-2.75 1.37 1.37 0 0 1 0 2.75Zm10.07 8.67h-2.37V9.92c0-.89-.02-2.02-1.23-2.02-1.23 0-1.42.96-1.42 1.96v3.77H6.24V6h2.27v1.04h.03c.32-.6 1.09-1.23 2.24-1.23 2.4 0 2.85 1.58 2.85 3.63v4.19Z"
      />
    </svg>
  );
}

const secs = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;

/**
 * The studio Create opens over the page, laid out like the KeyFly app's
 * editor (read from the app on 2026-11-07): the icon rail, the project
 * header (File, Edit, Clip, View, Help; Share and Export), the media panel,
 * the viewer and its player bar, the storyboard, the timeline and the AI
 * director's panel. The plan is sketched from the prompt in the browser
 * (studio-plan.js); nothing plays. The viewer shows only a play button, and
 * pressing it (or any scene, Share, Export, Revert, Retry, or asking for a
 * change) opens the sign-up card, styled as the app's own, whose choices
 * copy the prompt and open the app's sign-up page.
 */
export function Studio({ request, copy, motionStyles, onClose }) {
  const dialog = useRef(null);
  const thread = useRef(null);
  const gateCard = useRef(null);
  const play = useRef(null);
  const wasGate = useRef(false);
  const [phase, setPhase] = useState("reading"); // reading → building → ready
  const [shown, setShown] = useState(0);
  const [gate, setGate] = useState(false);
  const [log, setLog] = useState([]);
  const [ask, setAsk] = useState("");

  const plan = useMemo(
    () => sketchPlan({ text: request.text, format: request.format, style: request.style, styles: motionStyles, files: request.files }),
    [request, motionStyles]
  );
  const [reduce] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // The director's reply, in the app's words: one line per part of the plan.
  const lines = useMemo(() => {
    const note = (id) => plan.notes.find((n) => n.id === id);
    const voice = note("voice");
    const music = note("music");
    const look = note("look");
    const footage = note("footage");
    return [
      `${copy.reply.hook} “${plan.scenes[0].text.replace(/[“”]/g, "")}”`,
      `${copy.reply.voice} ${voice.value}${voice.detail ? ` (${voice.detail.replace("Also fits:", "also fits:")})` : ""}`,
      `${copy.reply.music} ${music.value}${music.detail ? `, ${music.detail.toLowerCase()}` : ""}`,
      `${look.assumed ? copy.reply.assumed : copy.reply.look} ${look.value} look, ${plan.shape}`,
      `${copy.reply.storyboard} ${plan.scenes.map((s) => s.name).join(" → ")}`,
      footage ? `${footage.label}: ${footage.value.charAt(0).toLowerCase()}${footage.value.slice(1)}` : null,
    ].filter(Boolean);
  }, [plan, copy]);

  // Open as a modal; lock the page's scroll behind it.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (!el.open) el.showModal();
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = before;
    };
  }, []);

  // Write the reply: a moment planning, then its lines one by one.
  useEffect(() => {
    const timers = [];
    const wait = reduce ? 0 : 1;
    timers.push(setTimeout(() => setPhase("building"), 1000 * wait));
    lines.forEach((_, i) => timers.push(setTimeout(() => setShown(i + 1), (1200 + i * 260) * wait)));
    timers.push(setTimeout(() => setPhase("ready"), (1400 + lines.length * 260) * wait));
    return () => timers.forEach(clearTimeout);
  }, [lines, reduce]);

  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [shown, log, reduce]);

  // The sign-up card takes focus; closing it hands focus back to play.
  useEffect(() => {
    if (gate) gateCard.current?.querySelector("a")?.focus();
    else if (wasGate.current) play.current?.focus();
    wasGate.current = gate;
  }, [gate]);

  const ready = phase === "ready";
  const openGate = () => ready && setGate(true);

  function sendAsk(event) {
    event.preventDefault();
    const text = ask.trim();
    if (!text || !ready) return;
    setAsk("");
    setLog((l) => [...l, text]);
    setTimeout(openGate, reduce ? 0 : 450);
  }

  async function signUp(event) {
    event.preventDefault();
    const href = event.currentTarget.href;
    try {
      await navigator.clipboard.writeText(plan.prompt);
    } catch {
      // Copying isn't allowed here; the app still opens.
    }
    window.location.assign(href);
  }

  function onCancel(event) {
    if (gate) {
      event.preventDefault();
      setGate(false);
    }
  }

  const close = () => dialog.current?.close();
  const [rw, rh] = plan.shape.split(":").map(Number);
  const styleNote = request.style.id === "ai" ? "" : ` ${request.style.label} style.`;
  // Ruler marks: about eight across the cut.
  const step = [1, 2, 5, 10, 15, 30, 60].find((s) => plan.length / s <= 9) || 60;
  const marks = Array.from({ length: Math.floor(plan.length / step) + 1 }, (_, i) => i * step);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      data-tone="night"
      aria-label={`${copy.label}: ${plan.title}`}
      onClose={onClose}
      onCancel={onCancel}
      onClick={(event) => event.target === dialog.current && close()}
    >
      <div className={styles.app} data-gate={gate ? "" : undefined} data-phase={phase}>
        <div className={styles.shell} inert={gate}>
          {/* The icon rail. */}
          <nav className={styles.rail} aria-hidden="true">
            {/* The brand kit's symbol, unchanged. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.symbol} src="/brand/symbol-dark.svg" alt="" width="24" height="24" />
            {["home", "videos", "templates", "brand", "settings"].map((n) => (
              <span key={n} className={styles.railIcon}>
                <Icon name={n} size={18} />
              </span>
            ))}
            <span className={`${styles.railIcon} ${styles.railFoot}`}>
              <Icon name="keyboard" size={18} />
            </span>
          </nav>

          {/* The project header. */}
          <header className={styles.head}>
            <div className={styles.project}>
              <p className={styles.projectName}>{plan.title}</p>
              <p className={styles.saved}>
                {copy.saved} · {secs(plan.length)}
              </p>
            </div>
            <ul className={styles.menus} aria-hidden="true">
              {copy.menus.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <div className={styles.headEnd}>
              <span className={styles.ghostIcon} aria-hidden="true">
                <Icon name="undo" />
              </span>
              <span className={styles.ghostIcon} aria-hidden="true">
                <Icon name="redo" />
              </span>
              <span className={styles.pick} aria-hidden="true">
                <Icon name="grid" /> {copy.edit} <Icon name="chevron" size={12} />
              </span>
              <span className={`${styles.pick} ${styles.wide}`} aria-hidden="true">
                <Icon name="brand" /> {copy.noBrandKit} <Icon name="chevron" size={12} />
              </span>
              <span className={styles.pick} aria-hidden="true">
                <Icon name="ratio" /> {plan.shape} <Icon name="chevron" size={12} />
              </span>
              <button type="button" className={styles.share} onClick={openGate} disabled={!ready}>
                <Icon name="share" /> {copy.share}
              </button>
              <button type="button" className={styles.export} onClick={openGate} disabled={!ready}>
                <Icon name="export" /> {copy.export}
              </button>
              <button type="button" className={styles.close} onClick={close} aria-label={copy.close}>
                <Icon name="close" />
              </button>
            </div>
          </header>

          {/* The media panel. */}
          <aside className={styles.left} aria-hidden="true">
            <ul className={styles.tabs}>
              {copy.tabs.map((t, i) => (
                <li key={t.id} data-on={i === 0 ? "" : undefined}>
                  <Icon name={t.id} size={17} />
                  {t.label}
                </li>
              ))}
            </ul>
            <div className={styles.media}>
              <p className={styles.panelTitle}>
                {copy.tabs[0].label}
                <Icon name="collapse" size={14} />
              </p>
              <div className={styles.drop}>
                <Icon name="upload" size={18} />
                <span>{copy.drop}</span>
                <small>{copy.dropNote}</small>
              </div>
              {request.files.length ? (
                <ul className={styles.mediaFiles}>
                  {request.files.map((f) => (
                    <li key={f.url || f.name}>{f.name}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </aside>

          {/* The editor: viewer, storyboard, timeline. */}
          <main className={styles.center}>
            <div className={styles.viewerArea}>
              <div className={styles.viewerFit}>
                <div className={styles.viewer} style={{ "--rw": rw, "--rh": rh }}>
                  {ready ? (
                    <button ref={play} type="button" className={styles.bigPlay} onClick={openGate} aria-label={`${copy.play}: ${plan.title}`}>
                      <Play size={26} />
                    </button>
                  ) : (
                    <span className={styles.building} aria-hidden="true">
                      <i />
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.player}>
                <span className={styles.time}>
                  <b>0:00.0</b> / {secs(plan.length)}
                </span>
                <span className={styles.transport}>
                  <span className={styles.ghostIcon} aria-hidden="true">
                    <Icon name="prev" />
                  </span>
                  <button type="button" className={styles.playBtn} onClick={openGate} disabled={!ready} aria-label={copy.play}>
                    <Play />
                  </button>
                  <span className={styles.ghostIcon} aria-hidden="true">
                    <Icon name="next" />
                  </span>
                </span>
                <span className={styles.meter} aria-hidden="true">
                  <i />– LUFS
                </span>
                <span className={styles.viewTools} aria-hidden="true">
                  <Icon name="camera" />
                  <Icon name="fit" />
                  <Icon name="full" />
                </span>
              </div>
            </div>

            <section className={styles.board} aria-label={copy.storyboard}>
              <p className={styles.boardHead}>
                <b>{copy.storyboard}</b>
                <span>
                  {plan.scenes.length} {copy.scenes}
                </span>
                <span className={styles.boardEnd} aria-hidden="true">
                  <Icon name="curves" /> {copy.curves}
                  <i className={styles.toggle} /> {copy.allTracks}
                </span>
              </p>
              <ol className={styles.cards}>
                {plan.scenes.map((s, i) => (
                  <li key={i} style={{ "--k": i }}>
                    <button type="button" onClick={openGate} disabled={!ready} data-on={i === 0 ? "" : undefined} aria-label={`${s.name}: ${copy.play}`}>
                      <span className={styles.card} style={{ "--rw": rw, "--rh": rh }}>
                        <b>{i + 1}</b>
                        <em>{(s.dur).toFixed(1)}s</em>
                      </span>
                      <span className={styles.cardName}>{s.name}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>

            <section className={styles.timeline} aria-hidden="true">
              <div className={styles.tools}>
                <span className={styles.toolOn}>
                  <Icon name="pointer" />
                </span>
                <Icon name="razor" />
                <span className={styles.tool}>
                  <Icon name="split" /> {copy.split}
                </span>
                <Icon name="copy" />
                <Icon name="trash" />
                <span className={styles.tool}>
                  <Icon name="plus" /> {copy.track}
                </span>
                <span className={`${styles.tool} ${styles.snap}`}>
                  <Icon name="magnet" /> {copy.snap}
                </span>
                <span className={styles.toolOn}>
                  <Icon name="target" />
                </span>
                <Icon name="bookmark" />
                <Icon name="lines" />
                <span className={styles.zoom}>
                  <Icon name="minus" />
                  <i />
                  <Icon name="plus" />
                  <Icon name="expand" />
                </span>
              </div>
              <div className={styles.tracks}>
                <div className={styles.rulerRow}>
                  <span className={styles.fps}>30 fps</span>
                  <div className={styles.ruler}>
                    {marks.map((m) => (
                      <span key={m} style={{ "--x": m / plan.length }}>
                        {m}s
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.row}>
                  <span className={styles.rowName}>
                    {copy.tracks.scenes}
                    <Icon name="plus" size={13} />
                  </span>
                  <div className={styles.lane}>
                    {plan.scenes.map((s, i) => (
                      <span key={i} className={styles.sceneClip} data-on={i === 0 ? "" : undefined} style={{ "--x": s.start / plan.length, "--w": s.dur / plan.length, "--k": i }}>
                        {i + 1} {s.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.row}>
                  <span className={styles.rowName}>
                    <i className={styles.badge} data-kind="transitions" />
                    {copy.tracks.transitions}
                  </span>
                  <div className={styles.lane}>
                    {plan.scenes.slice(1).map((s, i) => (
                      <span key={i} className={styles.transition} style={{ "--x": s.start / plan.length, "--k": i + 1 }} />
                    ))}
                  </div>
                </div>
                <div className={styles.row}>
                  <span className={styles.rowName}>
                    <i className={styles.badge} data-kind="video" />
                    {copy.tracks.video}
                  </span>
                  <div className={styles.lane} />
                </div>
                <div className={`${styles.row} ${styles.tall}`}>
                  <span className={styles.rowName}>
                    <i className={styles.badge} data-kind="voice" />
                    {copy.tracks.voice}
                  </span>
                  <div className={styles.lane}>
                    {plan.scenes.map((s, i) => (
                      <span key={i} className={styles.voice} style={{ "--x": (s.start + 0.1) / plan.length, "--w": (s.dur * 0.86) / plan.length, "--k": i }} />
                    ))}
                  </div>
                </div>
                <div className={styles.row}>
                  <span className={styles.rowName}>
                    <i className={styles.badge} data-kind="music" />
                    {copy.tracks.music}
                  </span>
                  <div className={styles.lane}>
                    {plan.kind === "podcast" ? null : <span className={styles.music} style={{ "--x": 0, "--w": 1, "--k": plan.scenes.length }} />}
                  </div>
                </div>
                <span className={styles.playhead} />
              </div>
            </section>
          </main>

          {/* The AI director's panel. */}
          <aside className={styles.right} aria-label={copy.director}>
            <div className={styles.rightTabs} aria-hidden="true">
              <span className={styles.rightTabOn}>
                <Icon name="sparkle" /> {copy.director}
              </span>
              <Icon name="sliders" />
              <Icon name="captions" />
              <Icon name="chat" />
              <span className={styles.rightTabsEnd}>
                <Icon name="popout" />
              </span>
            </div>
            <p className={styles.rightHead}>
              {copy.director}
              <span aria-hidden="true">
                <Icon name="search" size={14} />
              </span>
            </p>

            <div ref={thread} className={styles.thread}>
              <div className={styles.bubble}>
                <p>{plan.prompt}</p>
                <p>
                  ({copy.aspect} {plan.shape}.{styleNote})
                </p>
              </div>

              <p className={styles.worked}>
                <Icon name="arrow" size={12} />
                {phase === "reading" ? (
                  <>
                    {copy.planning}
                    <span className={styles.dots} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  </>
                ) : (
                  <>
                    {copy.sketched} · {plan.scenes.length} {copy.scenes}
                    <span className={styles.tag}>{copy.label}</span>
                  </>
                )}
              </p>

              {phase !== "reading" ? (
                <div className={styles.answer}>
                  <p>
                    {copy.reply.built} “{plan.title}”
                  </p>
                  <ul>
                    {lines.map((line, i) => (
                      <li key={i} data-on={i < shown ? "" : undefined}>
                        {line}
                      </li>
                    ))}
                  </ul>
                  {ready ? (
                    <p className={styles.next}>
                      {copy.reply.next}
                    </p>
                  ) : null}
                  {ready ? (
                    <div className={styles.actions}>
                      <button type="button" onClick={openGate}>
                        <Icon name="revert" size={14} /> {copy.revert}
                      </button>
                      <button type="button" onClick={openGate}>
                        <Icon name="retry" size={14} /> {copy.retry}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {log.map((text, i) => (
                <div key={i} className={styles.bubble}>
                  <p>{text}</p>
                </div>
              ))}
            </div>

            <form className={styles.composer} onSubmit={sendAsk}>
              <label htmlFor="studio-ask" className="visually-hidden">
                {copy.composer}
              </label>
              <textarea
                id="studio-ask"
                rows={2}
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && sendAsk(e)}
                placeholder={copy.composer}
              />
              <div className={styles.composerBar}>
                <span className={styles.ghostIcon} aria-hidden="true">
                  <Icon name="attach" />
                </span>
                <span className={styles.enhance} aria-hidden="true">
                  <Icon name="sparkle" size={14} /> {copy.enhance}
                </span>
                <button type="submit" className={styles.send} aria-label={copy.send} disabled={!ask.trim() || !ready}>
                  <Icon name="up" size={15} />
                </button>
              </div>
            </form>
            <p className={styles.mode} aria-hidden="true">
              <span>
                <Icon name="cloud" size={14} /> {copy.cloud} <Icon name="chevron" size={12} />
              </span>
              <span>
                <Icon name="bolt" size={14} /> {copy.auto}
              </span>
            </p>
          </aside>
        </div>

        {/* The sign-up card, as the app's own. */}
        {gate ? (
          <div className={styles.gate} onClick={(event) => event.target === event.currentTarget && setGate(false)}>
            <div ref={gateCard} className={styles.signup} role="dialog" aria-modal="true" aria-labelledby="studio-gate-title">
              <button type="button" className={styles.signupClose} onClick={() => setGate(false)} aria-label={copy.gate.back}>
                <Icon name="close" size={14} />
              </button>
              <p className={styles.brandRow}>
                {/* The brand kit's app icon, unchanged. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/app-icon-flat.svg" alt="" width="28" height="28" />
                KeyFly
              </p>
              <p className={styles.ready}>
                <Play size={10} /> {plan.title} · {secs(plan.length)} · {copy.gate.ready}
              </p>
              <p id="studio-gate-title" className={styles.signupTitle}>
                {copy.gate.title}
              </p>
              <p className={styles.signupLead}>{copy.gate.trial}</p>
              <div className={styles.providers}>
                {copy.gate.providers.map((name) => (
                  <a key={name} href={copy.signup} onClick={signUp} className={styles.provider}>
                    <ProviderMark name={name} />
                    {copy.gate.continueWith} {name}
                  </a>
                ))}
              </div>
              <p className={styles.or}>{copy.gate.or}</p>
              <a href={copy.signup} onClick={signUp} className={styles.emailBtn}>
                <Icon name="mail" size={15} /> {copy.gate.email}
              </a>
              <p className={styles.have}>
                {copy.gate.have}{" "}
                <a href={copy.signIn} onClick={signUp}>
                  {copy.gate.signIn}
                </a>
              </p>
            </div>
            <p className={styles.fine}>
              {copy.gate.legal[0]}
              <Link href="/terms">{copy.gate.legal[1]}</Link>
              {copy.gate.legal[2]}
              <Link href="/privacy">{copy.gate.legal[3]}</Link>
              {copy.gate.legal[4]}
              <br />
              {copy.gate.company}
            </p>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
