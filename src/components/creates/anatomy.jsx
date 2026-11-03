"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./creates.module.css";

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const pad = (n) => String(n).padStart(2, "0");
const clock = (s) => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}.${Math.floor((s * 10) % 10)}`;

/** Each scene's [start, end] from their lengths. */
function sceneSpans(scenes) {
  let t = 0;
  return scenes.map((s) => {
    const span = [t, t + s.length];
    t += s.length;
    return span;
  });
}

/** A layer's clips as [start, end] pairs ("scenes": one per scene; "cuts": marks at scene changes). */
function layerClips(layer, spans) {
  if (layer.clips === "scenes") return spans;
  if (layer.clips === "cuts") return spans.slice(1).map(([start]) => [start - 0.12, start + 0.12]);
  return layer.clips;
}

/**
 * A film beside a panel and above its own timeline. The panel shows the
 * prompt, the scene in play with the line spoken in it, the tracks it uses
 * and the controls; the timeline has the film's tracks (storyboard,
 * voice-over, motion graphics, transitions, music) under a playhead that
 * follows the video. The clips under the playhead, and their tracks, light.
 * Clicking the timeline seeks. The video plays muted while on screen
 * (sound on request) and pauses off it; with reduced motion it waits for
 * play. The playhead moves by transform only, on one rAF loop that runs
 * only while the video plays.
 */
export function Anatomy({ video, prompt, tag, now, says, tracksLabel, sound, scenes, layers }) {
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const headRef = useRef(null);
  const timeRef = useRef(null);
  const spans = sceneSpans(scenes);
  const total = video.duration;
  const tracks = layers.map((layer) => ({ ...layer, spans: layerClips(layer, spans) }));

  // What sits under the playhead: the scene, and each track's clip ("-1"
  // when the track is empty there), as one key so React only re-renders
  // when it changes.
  const keyAt = (t) => {
    const s = Math.max(0, spans.findIndex(([a, b]) => t >= a && t < b));
    const clips = tracks.map((l) => l.spans.findIndex(([a, b]) => t >= a && t < b));
    return `${s}|${clips.join(",")}`;
  };
  const [under, setUnder] = useState(() => keyAt(0));
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [sceneKey, clipKey] = under.split("|");
  const scene = Number(sceneKey);
  const active = clipKey.split(",").map(Number);

  // Follow the video: the playhead and timecode every frame while playing,
  // what's under the playhead only when it changes.
  useEffect(() => {
    const el = videoRef.current;
    let raf = 0;
    const draw = () => {
      const t = el.currentTime || 0;
      headRef.current.style.translate = `${((t / total) * 100).toFixed(3)}% 0`;
      timeRef.current.textContent = clock(t);
      const next = keyAt(t);
      setUnder((k) => (k === next ? k : next));
    };
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      setPlaying(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(raf);
      draw();
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("seeked", draw);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("seeked", draw);
    };
    // keyAt reads spans and tracks, which only change with the content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // Play while on screen (not with reduced motion), pause off it.
  useEffect(() => {
    const el = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced) el.play().catch(() => {});
        else if (!entry.isIntersecting) el.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [reduced]);

  function seek(event) {
    const box = event.currentTarget.getBoundingClientRect();
    const t = Math.min(total - 0.05, Math.max(0, ((event.clientX - box.left) / box.width) * total));
    videoRef.current.currentTime = t;
    if (!reduced) videoRef.current.play().catch(() => {});
  }

  function toggleSound() {
    const el = videoRef.current;
    el.muted = !muted;
    setMuted(!muted);
    if (el.paused) el.play().catch(() => {});
  }

  function togglePlay() {
    const el = videoRef.current;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }

  return (
    <div ref={rootRef} className={styles.anatomy} style={{ "--tracks": tracks.length }} data-main="">
      <div className={styles.stage}>
        <figure className={styles.film}>
          <video
            ref={videoRef}
            className={styles.video}
            src={video.src}
            poster={video.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="An illustrative film: how KeyFly makes a launch video"
          />
          <span className={styles.corners} aria-hidden="true" />
          <span className={styles.tag} aria-hidden="true">
            {tag}
          </span>
        </figure>

        {/* Beside the film: the prompt, the scene in play with its spoken
            line, the tracks it uses, and the controls. */}
        <aside className={styles.side}>
          <div className={styles.promptBox}>
            <span className={styles.kicker}>{prompt.label}</span>
            <p className={styles.promptText}>{prompt.text}</p>
            <span className={styles.send} aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M8 12.5v-9M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>

          <div className={styles.now} aria-live="polite">
            <p className={styles.kicker}>
              <span className={styles.nowMark} aria-hidden="true" />
              {now} <span className={styles.nowIndex}>{pad(scene + 1)}</span> / {pad(scenes.length)}
            </p>
            <p key={scene} className={styles.nowScene}>
              {scenes[scene].name}
            </p>
            <p key={`line-${scene}`} className={styles.nowLine}>
              <span className={styles.says}>{says}</span>“{scenes[scene].line}”
            </p>
          </div>

          <ul className={styles.tracks} aria-label={tracksLabel}>
            {tracks.map((l, i) => (
              <li key={l.id} className={styles.track} data-on={active[i] >= 0 ? "" : undefined}>
                <span className={`${styles.swatch} ${styles[l.id]}`} aria-hidden="true" />
                {l.name}
              </li>
            ))}
          </ul>

          <div className={styles.controls}>
            <button type="button" className={styles.control} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
              {playing ? (
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="4" y="3" width="3" height="10" rx="1" />
                  <rect x="9" y="3" width="3" height="10" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M5 3.2v9.6c0 .5.5.8.9.5l7.2-4.8a.6.6 0 0 0 0-1L5.9 2.7c-.4-.3-.9 0-.9.5Z" />
                </svg>
              )}
            </button>
            {/* Only a film with sound gets the sound button. */}
            {video.audio !== false ? (
              <button type="button" className={`${styles.control} ${styles.sound}`} onClick={toggleSound} aria-pressed={!muted}>
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2.5 6h2.2L8 3.3v9.4L4.7 10H2.5Z" />
                  {muted ? <path d="m10.5 6 3.5 4m0-4-3.5 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /> : <path d="M10.6 5.2a4 4 0 0 1 0 5.6M12.3 3.6a6.3 6.3 0 0 1 0 8.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
                </svg>
                {muted ? sound.on : sound.off}
              </button>
            ) : null}
            <p className={styles.time}>
              <span ref={timeRef}>0:00.0</span> / {clock(total)}
            </p>
          </div>
        </aside>
      </div>

      <div className={styles.timeline}>
        <div className={styles.labels} aria-hidden="true">
          <span className={styles.rulerLabel} />
          {tracks.map((l, i) => (
            <span key={l.id} className={styles.label} data-on={active[i] >= 0 ? "" : undefined}>
              <span className={styles.labelIndex}>{pad(i + 1)}</span>
              <span className={styles.labelName}>{l.name}</span>
              <span className={styles.labelDetail}>{l.detail}</span>
            </span>
          ))}
        </div>

        {/* Clicking anywhere on the lanes seeks the film there. */}
        <div className={styles.lanes} onClick={seek} role="presentation">
          <div className={styles.ruler} aria-hidden="true">
            {spans.map(([a], i) => (
              <span key={i} className={styles.sceneMark} style={{ left: `${(a / total) * 100}%`, width: `${(scenes[i].length / total) * 100}%` }} data-on={i === scene ? "" : undefined}>
                <span>{pad(i + 1)}</span>
              </span>
            ))}
          </div>
          {tracks.map((l, t) => (
            <div key={l.id} className={`${styles.lane} ${styles[l.id]}`} aria-hidden="true">
              {l.spans.map(([a, b], i) => (
                <span
                  key={i}
                  className={styles.clip}
                  style={{ left: `${(a / total) * 100}%`, width: `${((b - a) / total) * 100}%` }}
                  data-on={active[t] === i ? "" : undefined}
                />
              ))}
            </div>
          ))}
          <div ref={headRef} className={styles.playheadTrack} aria-hidden="true">
            <span className={styles.playhead} />
          </div>
        </div>
      </div>
    </div>
  );
}
