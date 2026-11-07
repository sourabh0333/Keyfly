"use client";

import { useId, useRef, useState } from "react";
import styles from "./pricing-questions.module.css";

const STEP = 6; // seconds between cues on the track's timecode
const tc = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * The pricing questions as a captions track; no boxes. Along the foot, a
 * ruler with a cue per question (its timecode, a keyframe, a short label);
 * the chosen cue holds a mint playhead. Above it the answer plays like a
 * burnt-in subtitle: the cue's number and timecode, the question in the
 * serif accent, the answer large with its words lighting up one by one, as
 * KeyFly's captions do, and a link to the section that shows it. Every
 * answer shares one cell, so the area never changes height. The cues are
 * tabs (arrow keys, Home and End); nothing changes by itself. Reduced
 * motion: the words show at once.
 */
export function CaptionTrack({ items, label, of }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = useRef([]);

  const go = (i) => {
    const n = (i + items.length) % items.length;
    setActive(n);
    tabs.current[n]?.focus();
  };

  const keys = (e) => {
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    go(next);
  };

  return (
    <div className={styles.stage} data-main="">
      {/* The answer, as a subtitle. */}
      <div className={styles.screen}>
        {items.map((q, i) => (
          <div
            key={q.id}
            id={`${base}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${base}-tab-${i}`}
            className={styles.pane}
            data-on={i === active ? "" : undefined}
            inert={i !== active}
          >
            <p className={styles.meta}>
              <span>{of.replace("{n}", String(i + 1).padStart(2, "0")).replace("{total}", String(items.length).padStart(2, "0"))}</span>
              <span>{tc((i + 1) * STEP)}</span>
            </p>
            <h3 className={styles.question}>{q.q}</h3>
            <p className={styles.subtitle}>
              {q.a.split(" ").map((w, k) => (
                <span key={k} className={styles.word} style={{ "--k": k }}>
                  {w}{" "}
                </span>
              ))}
            </p>
            {q.link ? (
              <a className={styles.link} href={q.link.href}>
                {q.link.label} <span aria-hidden="true">{q.link.href.startsWith("#") ? "↑" : "→"}</span>
              </a>
            ) : null}
          </div>
        ))}
      </div>

      {/* The captions track: a cue per question. */}
      <div className={styles.rulerWrap}>
        <div className={styles.ruler} role="tablist" aria-label={label} onKeyDown={keys} style={{ "--n": items.length }}>
          {items.map((q, i) => (
            <button
              key={q.id}
              ref={(el) => (tabs.current[i] = el)}
              id={`${base}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${base}-panel-${i}`}
              tabIndex={i === active ? 0 : -1}
              className={styles.cue}
              onClick={() => setActive(i)}
            >
              <span className={styles.cueTime}>{tc((i + 1) * STEP)}</span>
              <i className={styles.cueKey} aria-hidden="true" />
              <span className={styles.cueLabel}>{q.cue}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
