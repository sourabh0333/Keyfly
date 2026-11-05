"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./deliver.module.css";

const STEP = 3000; // ms per route

const pad = (n) => String(n).padStart(2, "0");

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotionChange(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// Each route's small picture, played while its route is in turn.
function FilePicture({ route }) {
  return (
    <div className={`${styles.pic} ${styles.render}`} aria-hidden="true">
      <span className={styles.fileChip}>
        <i />
        {route.file}
        <em>{route.size}</em>
      </span>
      <span className={styles.bar}>
        <i />
      </span>
      <span className={styles.renderState}>
        <b>{route.rendering}</b>
        <b>{route.done}</b>
      </span>
    </div>
  );
}

function ReviewPicture({ route }) {
  return (
    <div className={`${styles.pic} ${styles.review}`} aria-hidden="true">
      <span className={styles.linkChip}>
        <svg viewBox="0 0 16 16" width="11" height="11">
          <path d="M6.5 9.5 9.5 6.5M7 4.5l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 0 1 4.5 9l1-1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {route.link}
      </span>
      <span className={styles.scrub}>
        {route.comments.map((c, i) => (
          <i key={c.at} style={{ "--x": c.x, "--i": i }} />
        ))}
      </span>
      <span className={styles.comment}>
        <b>{route.comments[0].at}</b>
        {route.comments[0].text}
      </span>
      <span className={styles.verdict}>
        <i>{route.approve}</i>
        <i>{route.changes}</i>
      </span>
    </div>
  );
}

/**
 * Deliver's stage: one finished cut at the top, a mint line branching from
 * it to three routes beneath, each a card with its small picture and its
 * spec: export a file (a render that fills to "Ready", then the shapes,
 * size, formats, sound and frames, and presets), share for review (a
 * review link, comments pinned at moments, Approve / Ask for changes) and
 * hand it on (which timeline format each editor opens, and the package).
 *
 * One route at a time is in turn while on screen: its branch lights, its
 * card takes a mint edge and its picture plays. Pointing at a card holds
 * it; a button pauses the turn (WCAG 2.2.2). Reduced motion: no turn, every
 * picture finished.
 */
export function Routes({ pause, play, cut, routes }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [held, setHeld] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(onMotionChange, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);

  const auto = visible && !held && !paused && !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % routes.length), STEP);
    return () => clearInterval(timer);
  }, [auto, routes.length]);

  return (
    <div
      ref={rootRef}
      className={styles.stage}
      data-main=""
      data-route={routes[active].id}
      data-still={reduced ? "" : undefined}
      data-paused={visible ? undefined : ""}
    >
      {/* The finished cut. */}
      <div className={styles.source}>
        <span className={styles.cut} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className={styles.cutName}>
          {cut.name}
          <em>{cut.meta}</em>
        </span>
        <span className={styles.ready}>
          <i aria-hidden="true" />
          {cut.ready}
        </span>
        {reduced ? null : (
          <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
              {paused ? <path d="M5 3.5v9l7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
            </svg>
            {paused ? play : pause}
          </button>
        )}
      </div>

      {/* The branches: from the cut to each route. */}
      <div className={styles.branches} aria-hidden="true">
        <i className={styles.stem} />
        <i className={styles.rail} />
        {routes.map((r, i) => (
          <i key={r.id} className={styles.drop} style={{ "--i": i }} data-on={i === active ? "" : undefined} />
        ))}
      </div>

      {/* The routes. */}
      <ol className={styles.routes}>
        {routes.map((r, i) => (
          <li
            key={r.id}
            className={styles.route}
            data-on={i === active ? "" : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType !== "mouse") return;
              setActive(i);
              setHeld(true);
            }}
            onPointerLeave={() => setHeld(false)}
          >
            <p className={styles.kicker}>
              <span>{pad(i + 1)}</span> {r.kicker}
            </p>
            <h3 className={styles.routeTitle}>{r.title}</h3>

            {r.id === "file" ? <FilePicture route={r} /> : null}
            {r.id === "review" ? <ReviewPicture route={r} /> : null}

            {r.id === "file" ? (
              <dl className={styles.specs}>
                {r.specs.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>
                      {s.chips ? (
                        s.chips.map((c) => (
                          <span key={c} className={styles.chip}>
                            {c}
                          </span>
                        ))
                      ) : (
                        s.text
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {r.id === "review" ? (
              <>
                <p className={styles.body}>{r.body}</p>
                <p className={styles.foot}>{r.foot}</p>
              </>
            ) : null}

            {r.id === "handoff" ? (
              <>
                <table className={styles.grid}>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="visually-hidden">Editor</span>
                      </th>
                      {r.formats.map((f) => (
                        <th key={f} scope="col">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {r.editors.map((e, row) => (
                      <tr key={e.name} style={{ "--i": row }}>
                        <th scope="row">{e.name}</th>
                        {r.formats.map((f) => (
                          <td key={f}>
                            {e.opens.includes(f) ? (
                              <span className={styles.yes}>
                                <span className="visually-hidden">Yes</span>
                              </span>
                            ) : (
                              <span className={styles.no} aria-hidden="true" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.package}>
                  <span className={styles.zip} aria-hidden="true">
                    .zip
                  </span>
                  <p>
                    <b>{r.package.title}</b>
                    {r.package.body}
                  </p>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
