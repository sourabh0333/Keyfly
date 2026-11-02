"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./every-format.module.css";

const LOOP = 8000; // ms: one walk of the subject, and one pass of the playhead
const HOLD = 4000; // ms each format stays up while it runs by itself
const SOURCE = 16 / 9;

// The subject's path across the source (fractions of its width): it stands
// left, walks right, stands, walks back. Each move is a reframe keyframe.
const PATH = [
  { at: 0, x: 0.28 },
  { at: 0.15, x: 0.28 },
  { at: 0.45, x: 0.72 },
  { at: 0.6, x: 0.72 },
  { at: 0.9, x: 0.28 },
  { at: 1, x: 0.28 },
];
const KEYS = PATH.slice(1, -1).map((p) => p.at);

const CLIPS = [0, 18, 34, 47, 66, 81, 100];
const WORDS = [6, 24, 42, 60, 78]; // where each caption word starts

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// The crop's width as a fraction of the source, and its left edge for a
// subject at x, kept inside the picture.
const cropWidth = (f) => Math.min(1, f.w / f.h / SOURCE);
const cropAt = (x, cw) => Math.min(1 - cw, Math.max(0, x - cw / 2));

const frames = (fn) => PATH.map((p) => ({ offset: p.at, transform: fn(p.x), easing: "ease-in-out" }));
const subjectAt = (x) => `translateX(${(x * 100).toFixed(2)}cqw)`;
const cropMove = (cw) => (x) => `translateX(${(cropAt(x, cw) * 100).toFixed(2)}cqw)`;
const sceneMove = (cw) => (x) => `translateX(calc(${(-cropAt(x, cw)).toFixed(4)} * 100cqh * 16 / 9))`;

// The crop's left edge over time, as a path over 100 × 20 (top = left).
function cropPath(cw) {
  if (cw === 1) return "M0 10H100";
  return PATH.map((p, i) => `${i ? "L" : "M"}${p.at * 100} ${(3 + (cropAt(p.x, cw) / (1 - cw)) * 14).toFixed(2)}`).join("");
}

function Shape({ f }) {
  const r = f.w / f.h;
  return (
    <span className={styles.shape} aria-hidden="true">
      <i style={{ width: `${r >= 1 ? 100 : r * 100}%`, height: `${r >= 1 ? 100 / r : 100}%` }} />
    </span>
  );
}

// The shot itself: dusk through a window, a presenter who walks across.
function Scene({ subjectStyle }) {
  return (
    <span className={styles.scene} aria-hidden="true">
      <span className={styles.sky} />
      <span className={styles.panes} />
      <span className={styles.floorLine} />
      <span className={styles.lamp} />
      <span className={styles.desk} />
      <span className={styles.subject} data-move="subject" style={subjectStyle}>
        <span className={styles.figure}>
          <i />
          <b />
        </span>
      </span>
    </span>
  );
}

/**
 * The Keyfly editor reframing one cut: the formats on the left, the 16:9
 * source in the middle with a crop that follows the subject, the output at
 * its true shape on the right, and beneath, the timeline with the crop's
 * path and a keyframe wherever it moves. Every moving part (the subject,
 * the crop, the output's picture, the playhead) runs on one clock through
 * the Web Animations API, so they stay in step. It turns through the
 * formats by itself until one is picked (while on screen, not held, and
 * with motion allowed); reduced motion holds the subject still.
 */
export function Reframe({ formats, file, mode, panel, source, output, tracked, settings, captions }) {
  const [active, setActive] = useState(1);
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const f = formats[active];
  const cw = cropWidth(f);
  const auto = visible && !held && !touched && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % formats.length), HOLD);
    return () => clearTimeout(timer);
  }, [auto, active, formats.length]);

  // One clock for every moving part; rebuilt when the format changes.
  useEffect(() => {
    const root = rootRef.current;
    const timing = { duration: LOOP, iterations: Infinity };
    const parts = [
      ...[...root.querySelectorAll('[data-move="subject"]')].map((el) => [el, frames(subjectAt)]),
      [root.querySelector('[data-move="crop"]'), frames(cropMove(cw))],
      [root.querySelector('[data-move="scene"]'), frames(sceneMove(cw))],
      [root.querySelector('[data-move="head"]'), [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }]],
    ];
    const now = document.timeline.currentTime ?? 0;
    const start = now - (now % LOOP);
    const animations = parts.map(([el, keyframes]) => {
      const animation = el.animate(keyframes, timing);
      animation.startTime = start;
      return animation;
    });
    for (const animation of animations) {
      if (reduced) animation.currentTime = LOOP * 0.52;
      if (reduced || !visible) animation.pause();
    }
    return () => animations.forEach((a) => a.cancel());
  }, [cw, reduced, visible]);

  function choose(i) {
    setActive(i);
    setTouched(true);
  }

  const still = PATH[0].x;

  return (
    <div
      ref={rootRef}
      className={styles.window}
      data-full={cw === 1 ? "" : undefined}
      data-paused={visible ? undefined : ""}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setHeld(false)}
    >
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.file}>
          {file}
          <span className={styles.fileMuted}> · Keyfly</span>
        </span>
        <span key={f.id} className={styles.mode}>
          {mode} · {f.ratio}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.panel}>
          <p className={styles.panelHead}>
            {panel}
            <span>{formats.length}</span>
          </p>
          <div className={styles.formats} role="radiogroup" aria-label={panel}>
            {formats.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={i === active}
                className={styles.format}
                data-auto={i === active && auto ? "" : undefined}
                onClick={() => choose(i)}
              >
                <Shape f={item} />
                <span className={styles.formatName}>{item.name}</span>
                <span className={styles.formatRatio}>{item.ratio}</span>
                <span className={styles.formatUse}>{item.use}</span>
                <i key={i === active ? `on${active}` : "off"} className={styles.formatFill} aria-hidden="true" />
              </button>
            ))}
          </div>
          <dl className={styles.settings}>
            {settings.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.sourceCol} aria-hidden="true">
          <p className={styles.colHead}>
            {source} <span>16:9</span>
          </p>
          <div className={styles.source}>
            <Scene subjectStyle={{ transform: subjectAt(still) }} />
            <span className={styles.crop} data-move="crop" style={{ width: `${cw * 100}%`, transform: cropMove(cw)(still) }}>
              <span className={styles.cropTag}>{f.ratio}</span>
              <span className={styles.thirds} />
            </span>
            <span className={styles.track} data-move="subject" style={{ transform: subjectAt(still) }}>
              <span>{tracked}</span>
            </span>
          </div>
        </div>

        <div className={styles.outCol} aria-hidden="true">
          <p className={styles.colHead}>
            {output} <span>{f.ratio}</span>
          </p>
          <div className={styles.outStage}>
            <div className={styles.out} style={{ "--r": f.w / f.h }}>
              <span className={styles.outScene} data-move="scene" style={{ transform: sceneMove(cw)(still) }}>
                <Scene subjectStyle={{ transform: subjectAt(still) }} />
              </span>
              <span className={styles.captions}>
                {captions.map((word) => (
                  <span key={word}>{word}</span>
                ))}
              </span>
            </div>
          </div>
          <p key={f.id} className={styles.outMeta}>
            <b>
              {f.px[0]} × {f.px[1]}
            </b>
            <span>{f.use}</span>
          </p>
        </div>
      </div>

      <div className={styles.timeline} aria-hidden="true">
        <div className={styles.ruler} />
        <div className={styles.lane}>
          <span className={styles.trackLabel}>V1</span>
          <div className={styles.laneBody}>
            {CLIPS.slice(0, -1).map((at, i) => (
              <i key={at} className={styles.clip} data-n={i % 3} style={{ left: `${at}%`, width: `${CLIPS[i + 1] - at}%` }} />
            ))}
          </div>
        </div>
        <div className={styles.lane}>
          <span className={styles.trackLabel}>RF</span>
          <div className={`${styles.laneBody} ${styles.reframe}`}>
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className={styles.path}>
              <path d={cropPath(cw)} />
            </svg>
            {cw < 1
              ? KEYS.map((at) => <i key={at} className={styles.key} style={{ left: `${at * 100}%` }} />)
              : null}
            <span className={styles.pathLabel}>{cw < 1 ? `${mode} · ${f.ratio}` : "Full frame"}</span>
          </div>
        </div>
        <div className={styles.lane}>
          <span className={styles.trackLabel}>C1</span>
          <div className={styles.laneBody}>
            {WORDS.map((at, i) => (
              <i key={at} className={styles.word} style={{ left: `${at}%` }}>
                {captions[i]}
              </i>
            ))}
          </div>
        </div>
        <span className={styles.rail} data-move="head">
          <i className={styles.playhead} />
        </span>
      </div>
    </div>
  );
}
