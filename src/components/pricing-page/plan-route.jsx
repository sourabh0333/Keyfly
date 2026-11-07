"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./plan-fit.module.css";

const noop = () => () => {};

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The short price on a stop: the yearly price a month where there is one.
function short(p, copy) {
  const price = p.annual || p.monthly;
  if (!price) return p.id === "free" ? copy.forever : copy.custom;
  return `${price.amount}${p.seats?.perSeat ? "/seat" : "/mo"}`;
}

// The chosen plan in full: its name and line, its price (yearly a month,
// what's billed, the discount, month to month), its AI minutes, the API's
// plan lines and its button.
function Plan({ p, stop, track, copy }) {
  const price = p.annual || p.monthly;
  const custom = !price && p.id !== "free";
  const alt = p.annual && p.monthly && p.monthly.amount !== p.annual.amount ? p.monthly.amount : null;
  const perSeat = p.seats?.perSeat;
  const href = p.contact || p.links?.year?.signup || p.links?.month?.signup || p.cta?.href;
  const minutes =
    p.aiMinutes === null
      ? copy.customMinutes
      : p.aiMinutes
        ? (perSeat ? copy.perSeatMinutes : copy.minutes).replace("{n}", p.aiMinutes)
        : copy.noMinutes;

  return (
    <>
      <p className={styles.route}>
        <span>{copy.label}</span>
        <em>
          {track.name} <span aria-hidden="true">→</span> {stop.fit}
        </em>
      </p>
      <h3 className={styles.planName}>
        {p.name}
        {p.mostPopular ? <span className={styles.popular}>{copy.popular}</span> : null}
      </h3>
      {p.tagline ? <p className={styles.tagline}>{p.tagline}</p> : null}

      <div className={styles.price}>
        <p className={styles.amount}>
          {price?.was ? <s>{price.was}</s> : null}
          <b>{price ? price.amount : custom ? copy.custom : copy.free}</b>
          <span>{price ? (perSeat ? copy.perSeat : copy.perMonth) : custom ? "" : copy.forever}</span>
        </p>
        <p className={styles.billed}>
          {custom ? <span>{copy.contact}</span> : null}
          {p.annual?.billed ? <span>{p.annual.billed}</span> : null}
          {p.annual?.discount ? <span className={styles.off}>{copy.off.replace("{n}", p.annual.discount)}</span> : null}
          {alt ? <span>{copy.monthly.replace("{amount}", alt)}</span> : null}
          {perSeat && p.seats?.minimum ? <span>{copy.seatsMin.replace("{n}", p.seats.minimum)}</span> : null}
        </p>
      </div>

      {/* Unless the API's own plan lines already say it. */}
      {p.features.some((f) => /AI minutes/i.test(f)) ? null : (
        <p className={styles.minutes} data-own={p.aiMinutes === 0 ? "" : undefined}>
          {minutes}
        </p>
      )}

      {p.features.length ? (
        <div className={styles.features}>
          {p.includes ? <p className={styles.includes}>{p.includes}</p> : null}
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <Tick />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {p.cta && href ? (
        <div className={styles.cta}>
          <a className={styles.ctaLink} href={href} data-solid={p.mostPopular ? "" : undefined}>
            {p.cta.label}
            <span aria-hidden="true">→</span>
          </a>
          {p.trial?.days ? (
            <small>
              {[p.trial.noCard ? copy.noCard : null, p.trial.aiMinutes ? copy.trialMinutes.replace("{n}", p.trial.aiMinutes) : null].filter(Boolean).join(" · ")}
            </small>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

/**
 * "Which plan fits" as a map of two questions. Three tracks, like an
 * editor's, one per answer to "Who does the work?" (your own AI, KeyFly's
 * AI, a team; the price sheet's three lanes). Each plan is a keyframe stop
 * on its track, with who it's for above (the second question) and its name
 * and price below. Choosing a track or a stop lights the route in mint from
 * one origin to that plan, and the card beside the map shows it in full.
 * It starts on the most popular plan and draws its route once when it first
 * comes on screen; nothing changes by itself after that.
 */
export function PlanRoute({ tracks, plans, start, questions, copy }) {
  const byId = Object.fromEntries(plans.map((p) => [p.id, p]));
  const [chosen, setChosen] = useState(start);
  const [seen, setSeen] = useState(false);
  // Only once hydrated does the route wait to be drawn; the server's HTML
  // shows it drawn.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const armed = hydrated && !seen;
  const stageRef = useRef(null);

  // Draw the route once, when the map first comes on screen.
  useEffect(() => {
    const el = stageRef.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const track = tracks.find((t) => t.stops.some((s) => s.plan === chosen)) || tracks[0];

  return (
    <div ref={stageRef} className={styles.stage} data-main="" data-armed={armed ? "" : undefined}>
      <div className={styles.map}>
        <p className={styles.questions}>
          {questions.map((q, i) => (
            <span key={q}>
              <b>{String(i + 1).padStart(2, "0")}</b> {q}
            </span>
          ))}
        </p>

        <div className={styles.tracks} data-track={track.id} style={{ "--tracks": tracks.length }}>
          <span className={styles.trunk} aria-hidden="true" />
          {tracks.map((t) => {
            const on = t.id === track.id;
            const sel = on ? t.stops.findIndex((s) => s.plan === chosen) : -1;
            const first = t.stops.find((s) => byId[s.plan]?.mostPopular) || t.stops[0];
            return (
              <div key={t.id} className={styles.track} data-on={on ? "" : undefined} style={{ "--sel": sel, "--n": t.stops.length }}>
                <button type="button" className={styles.trackName} aria-pressed={on} onClick={() => setChosen(first.plan)}>
                  <b>{t.name}</b>
                  <span>{t.line}</span>
                </button>
                <div className={styles.line}>
                  <span className={styles.rail} aria-hidden="true" />
                  <span className={styles.fill} aria-hidden="true" />
                  {t.stops.map((s, i) => (
                    <button
                      key={s.plan}
                      type="button"
                      className={styles.stop}
                      style={{ "--col": i }}
                      aria-pressed={s.plan === chosen}
                      onClick={() => setChosen(s.plan)}
                    >
                      <span className={styles.fit}>{s.fit}</span>
                      <i className={styles.diamond} aria-hidden="true" />
                      <span className={styles.below}>
                        <span className={styles.stopName}>{byId[s.plan].name}</span>
                        <span className={styles.stopPrice}>{short(byId[s.plan], copy)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.result} aria-live="polite">
        {tracks.flatMap((t) =>
          t.stops.map((s) => (
            <div key={s.plan} className={styles.pane} data-on={s.plan === chosen ? "" : undefined} inert={s.plan !== chosen}>
              <Plan p={byId[s.plan]} stop={s} track={t} copy={copy} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}
