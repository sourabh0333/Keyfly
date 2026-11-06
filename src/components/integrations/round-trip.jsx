"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./editors.module.css";

const TURN = 4200; // ms each editor holds while the panel plays
const EXT = { FCPXML: "fcpxml", EDL: "edl", OTIO: "otio" }; // format → the package folder's file

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// One small timeline: a row per track, its clips placed by percentage.
function Tracks({ tracks, linking }) {
  let n = 0;
  return (
    <div className={styles.tracks} data-linking={linking ? "" : undefined}>
      {tracks.map((track) => (
        <div key={track.name} className={styles.track}>
          <span>{track.name}</span>
          <div className={styles.lane}>
            {track.clips.map(([from, to]) => (
              <i key={from} data-track={track.name} style={{ left: `${from}%`, width: `${to - from}%`, "--n": n++ }} />
            ))}
          </div>
        </div>
      ))}
      <span className={styles.playhead} />
    </div>
  );
}

/**
 * The round trip, in one panel of three stages joined by running light:
 * 01 the cut in KeyFly (its film playing over four tracks and a playhead); 02 the package, a
 * file tree of the .zip with a folder per format, the chosen editor's
 * folder open with its timeline file and every file it uses (and, with the
 * switch on, the graphics as PNG sequences); 03 the editor, picked from
 * the four, whose timeline relinks its media clip by clip. While on screen
 * the editor moves on every 4.2s; choosing one stops that, and "Pause"
 * holds it (WCAG 2.2.2). Reduced motion: no turning, no relinking motion.
 */
export function RoundTrip({ pause, play, summary, project, stages, tracks, media, graphics, toggle, folders, editors, zipNote, relative }) {
  const [current, setCurrent] = useState(0);
  const [chosen, setChosen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [withGraphics, setWithGraphics] = useState(true);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  const auto = visible && !paused && !chosen && !reduced;
  const playing = visible && !paused && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // The cut's film plays while on screen and not paused.
  useEffect(() => {
    const v = videoRef.current;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setCurrent((c) => (c + 1) % editors.length), TURN);
    return () => clearTimeout(timer);
  }, [auto, current, editors.length]);

  const editor = editors[current];
  const folder = folders.find((f) => f.id === editor.folder);
  const groups = withGraphics ? [...media, graphics] : media;
  const fileCount = groups.reduce((a, g) => a + g.files.length, 0);

  // The open folder's lines, in order, for the staggered reveal.
  const open = [
    { depth: 2, kind: "timeline", name: `${project.file}.${folder.ext}` },
    ...groups.map((g) => ({ depth: 2, kind: "dir", name: `${g.name}/`, files: g.files.join(" · "), extra: g === graphics })),
  ];

  return (
    <div ref={rootRef} className={styles.tripWrap} data-main="" data-playing={playing ? "" : undefined}>
      <p className="visually-hidden">{summary}</p>

      <div className={styles.panel}>
        <div className={styles.panelHead} aria-hidden="true">
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          <b>{project.name}</b>
          <span className={styles.chips}>
            <em>{stages[0].action}</em>
            <em data-mint="">{stages[1].action}</em>
          </span>
        </div>

        <div className={styles.stages}>
          {/* 01 The cut in KeyFly. */}
          <div className={styles.stage} aria-hidden="true">
            <StageHead stage={stages[0]} />
            <div className={styles.window}>
              <p className={styles.windowBar}>
                <span className={styles.brandDot} />
                KeyFly · {project.name}
              </p>
              <div className={styles.preview}>
                <video ref={videoRef} src={project.video} poster={project.poster} muted loop playsInline preload="none" />
                <span>{project.length}</span>
              </div>
              <Tracks tracks={tracks} />
            </div>
            <p className={styles.caption}>
              <span className={styles.arrow}>↗</span>
              {stages[0].action}
            </p>
          </div>

          <span className={styles.wire} aria-hidden="true">
            <i />
          </span>

          {/* 02 The package. */}
          <div className={styles.stage}>
            <StageHead stage={stages[1]} />
            <div className={styles.tree} aria-hidden="true">
              <p className={styles.zip}>
                <span className={styles.zipIcon} />
                {project.file}.zip
              </p>
              {folders.map((f) => {
                const isOpen = f.id === folder.id;
                return (
                  <div key={f.id} className={styles.folder} data-open={isOpen ? "" : undefined}>
                    <p className={styles.line} style={{ "--d": 1 }}>
                      <span className={styles.caret}>{isOpen ? "▾" : "▸"}</span>
                      {f.name}/
                    </p>
                    {isOpen ? (
                      <div key={`${f.id}-${withGraphics}`} className={styles.openList}>
                        {open.map((line, i) => (
                          <p
                            key={`${line.name}-${i}`}
                            className={styles.line}
                            data-kind={line.kind}
                            data-extra={line.extra ? "" : undefined}
                            style={{ "--d": line.depth, "--i": i }}
                          >
                            {line.kind === "dir" ? <span className={styles.caret}>▾</span> : <span className={styles.bullet} />}
                            {line.name}
                            {line.files ? <span className={styles.files}>{line.files}</span> : null}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <button type="button" className={styles.toggle} role="switch" aria-checked={withGraphics} onClick={() => setWithGraphics((g) => !g)}>
              <span className={styles.switch} aria-hidden="true" />
              <span>
                <b>{toggle.label}</b>
                <small>{toggle.note}</small>
              </span>
            </button>
            <p className={styles.small}>{zipNote}</p>
          </div>

          <span className={styles.wire} data-late="" aria-hidden="true">
            <i />
          </span>

          {/* 03 Your editor. */}
          <div className={styles.stage}>
            <StageHead stage={stages[2]} />
            <div className={styles.picker} role="group" aria-label="Editors">
              {editors.map((e, i) => (
                <button
                  key={e.name}
                  type="button"
                  className={styles.editor}
                  aria-pressed={i === current}
                  onClick={() => {
                    setCurrent(i);
                    setChosen(true);
                  }}
                >
                  <span className={styles.radio} aria-hidden="true" />
                  <b>{e.name}</b>
                  <span className={styles.formatChips}>
                    {e.formats.map((f) => (
                      <em key={f} data-used={i === current && EXT[f] === folder.ext ? "" : undefined}>
                        {f}
                      </em>
                    ))}
                  </span>
                </button>
              ))}
            </div>
            <div className={styles.window} data-target="" aria-hidden="true">
              <p className={styles.windowBar}>
                <span className={styles.fileDot} />
                {editor.name} · {project.file}.{folder.ext}
              </p>
              <div key={`${current}-${withGraphics}`}>
                <Tracks tracks={withGraphics ? tracks : tracks.filter((t) => t.name !== "Graphics")} linking />
              </div>
            </div>
            <p className={styles.caption} data-done="" key={`done-${current}`} aria-hidden="true">
              <Tick />
              {stages[2].action} · {fileCount} files
            </p>
          </div>
        </div>

        <p className={styles.relative} aria-hidden="true">
          {relative}
        </p>
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

function StageHead({ stage }) {
  return (
    <p className={styles.stageHead}>
      <span>{stage.index}</span>
      {stage.label}
    </p>
  );
}
