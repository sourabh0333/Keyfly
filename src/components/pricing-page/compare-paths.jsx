"use client";

import { useState } from "react";
import styles from "./compare.module.css";

// Where a value sits across a track, in percent of the track: the scale or
// stops run from 3% to 83%; "Custom" has its own zone at 93%.
const pct = (x) => (x === null ? 93 : 3 + x * 80);
const ROW = 10; // a track's height in the overlay's units

// A plan's path down the tracks: a keyframe on each, joined by easing
// curves, like an editor's keyframe graph.
function path(id, tracks) {
  const pts = tracks.map((t, i) => [pct(t.points[id].x), (i + 0.5) * ROW]);
  return pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = pts[i - 1];
    const m = (y - py) / 2;
    return `${d} C ${px} ${py + m} ${x} ${y - m} ${x} ${y}`;
  }, "");
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
      <path
        d="m3.5 8.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Every plan as a path through the editor's tracks; no boxes. Above, the
 * plans by lane. Then one track per comparison: a scale (a number, placed on
 * a square-root scale with its ends labelled) or stops (labelled), with a
 * dashed "Custom" zone where a plan is by arrangement. Each plan has a
 * keyframe on every track at its true value, and a line runs through its
 * keyframes: every plan's line faint, the plan in focus in mint (it eases to
 * its new path), its keyframes lit and its exact value at the track's right.
 * Beneath, that plan's line, what it adds and its button. Pointing at a
 * plan's name or one of its keyframes previews it; clicking keeps it. It
 * rests on the most popular plan. A visually hidden table carries every
 * value for assistive technology.
 */
export function ComparePaths({ groups, tracks, start, words, caption }) {
  const [chosen, setChosen] = useState(start);
  const [hover, setHover] = useState(null);
  const active = hover ?? chosen;
  const plans = groups.flatMap((g) => g.plans);
  const plan = plans.find((p) => p.id === active) || plans[0];

  const over = (e) => {
    const el = e.target.closest("[data-plan]");
    if (el) setHover(el.dataset.plan);
  };

  return (
    <div
      className={styles.stage}
      data-main=""
      onPointerOver={over}
      onPointerLeave={() => setHover(null)}
    >
      {/* The plans, by lane. */}
      <div className={styles.picker} role="group" aria-label={words.plans}>
        {groups.map((g) => (
          <div key={g.name} className={styles.lane}>
            <span className={styles.laneName}>{g.name}</span>
            <span className={styles.laneNames}>
              {g.plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  data-plan={p.id}
                  data-on={p.id === active ? "" : undefined}
                  aria-pressed={p.id === chosen}
                  onClick={() => setChosen(p.id)}
                  onFocus={() => setChosen(p.id)}
                >
                  {p.name}
                  {p.popular ? <em>{words.popular}</em> : null}
                </button>
              ))}
            </span>
          </div>
        ))}
      </div>

      {/* The tracks, with every plan's path laid over them. */}
      <div
        className={styles.tracks}
        style={{ "--rows": tracks.length }}
        aria-hidden="true"
      >
        <svg
          className={styles.paths}
          viewBox={`0 0 100 ${tracks.length * ROW}`}
          preserveAspectRatio="none"
        >
          {plans.map((p) => (
            <path key={p.id} className={styles.thread} d={path(p.id, tracks)} />
          ))}
          <path
            className={styles.route}
            style={{ d: `path("${path(active, tracks)}")` }}
          />
        </svg>

        {tracks.map((t) => {
          const v = t.points[active];
          return (
            <div key={t.id} className={styles.row}>
              <p className={styles.label}>
                {t.label}
                {t.hint ? <span>{t.hint}</span> : null}
              </p>
              <div className={styles.track}>
                <span className={styles.rail} />
                {t.custom ? (
                  <span className={styles.customZone}>
                    <span>{words.custom}</span>
                  </span>
                ) : null}
                {t.ends ? (
                  <>
                    <span className={styles.end} style={{ left: `${pct(0)}%` }}>
                      {t.ends[0]}
                    </span>
                    <span className={styles.end} style={{ left: `${pct(1)}%` }} data-before="">
                      {t.ends[1]}
                    </span>
                  </>
                ) : null}
                {t.stops
                  ? t.stops.map((s) => (
                      <span
                        key={s.label}
                        className={styles.stop}
                        style={{ left: `${pct(s.x)}%` }}
                        data-on={s.label === v.text ? "" : undefined}
                        data-before={s.x > 0.5 ? "" : undefined}
                      >
                        {s.label}
                      </span>
                    ))
                  : null}
                {plans.map((p) => (
                  <i
                    key={p.id}
                    className={styles.key}
                    data-plan={p.id}
                    data-on={p.id === active ? "" : undefined}
                    style={{ left: `${pct(t.points[p.id].x)}%` }}
                  />
                ))}
              </div>
              <p className={styles.value}>
                <b>{v.text}</b>
                {v.sub ? <span>{v.sub}</span> : null}
              </p>
            </div>
          );
        })}
      </div>

      {/* The plan in focus. */}
      <div className={styles.summary} aria-live="polite">
        <div className={styles.summaryName}>
          <p>
            {plan.name}
            {plan.popular ? <em>{words.popular}</em> : null}
          </p>
          {plan.tagline ? <span>{plan.tagline}</span> : null}
        </div>
        <div className={styles.summaryAdds}>
          {plan.includes ? <p>{plan.includes}</p> : null}
          <ul>
            {plan.features.map((f) => (
              <li key={f}>
                <Tick />
                {f}
              </li>
            ))}
          </ul>
        </div>
        {plan.cta ? (
          <a
            className={styles.cta}
            href={plan.cta.href}
            data-solid={plan.popular ? "" : undefined}
          >
            {plan.cta.label} <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>

      {/* Every value, for assistive technology. */}
      <div className={styles.hidden}>
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <td />
              {plans.map((p) => (
                <th key={p.id} scope="col">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tracks.map((t) => (
              <tr key={t.id}>
                <th scope="row">{t.label}</th>
                {plans.map((p) => (
                  <td key={p.id}>
                    {t.points[p.id].text}
                    {t.points[p.id].sub ? ` (${t.points[p.id].sub})` : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
