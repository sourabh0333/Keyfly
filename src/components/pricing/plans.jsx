"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./pricing.module.css";

const NARROW = "(max-width: 640px)";
function onNarrow(callback) {
  const query = matchMedia(NARROW);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const HOLD = 3200; // ms each plan stays under the playhead while it runs by itself

const MOTION = "(prefers-reduced-motion: reduce)";
function onMotion(callback) {
  const query = matchMedia(MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// The ruler's ticks, as fractions of its length.
const TICKS = Array.from({ length: 49 }, (_, i) => i / 48);

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check() {
  return (
    <svg className={styles.check} viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <circle cx="8" cy="8" r="8" />
      <path d="M4.4 8.2 6.8 10.6 11.4 5.8" />
    </svg>
  );
}

// Where a plan sits on the ruler: the square root of its AI minutes over
// the most, so small plans don't crowd at the start; kept at least 9%
// apart.
function placeStops(plans) {
  const max = Math.max(1, ...plans.map((p) => p.aiMinutes));
  const at = [];
  plans.forEach((p, i) => {
    const raw = Math.sqrt(p.aiMinutes / max);
    at.push(i ? Math.max(raw, at[i - 1] + 0.09) : raw);
  });
  const top = at.at(-1) || 1;
  return at.map((x) => x / top);
}

/**
 * The plans, from the pricing API (normalised in src/lib/pricing.js), as
 * an editing timeline: a ruler of AI minutes a month with each plan that
 * has an allowance as a stop on it, and a mint playhead that chooses one
 * (drag it, click a stop, or use the arrow keys; it settles on the nearest
 * stop). Beneath, an inspector shows the plan under the playhead: price,
 * billing, AI minutes, what's included and its buttons. Per-seat and
 * custom plans (Team, Enterprise) sit in a slim row beneath, then the
 * AI-minute packs. Monthly / Yearly switch above. It starts on the first
 * plan and moves on by itself every 3.2s while on screen (hovering doesn't
 * pause it), until a plan is chosen; not with reduced motion. Every price, allowance,
 * bullet and link is the API's own.
 */
export function Plans({ data, copy }) {
  const [interval, setBilling] = useState("year");
  const key = interval === "year" ? "annual" : "monthly";
  const linkKey = interval === "year" ? "year" : "month";

  const stops = data.plans.filter((p) => p.aiMinutes !== null && !p.seats?.perSeat).sort((a, b) => a.aiMinutes - b.aiMinutes);
  const others = data.plans.filter((p) => !stops.includes(p));
  const narrow = useSyncExternalStore(onNarrow, () => matchMedia(NARROW).matches, () => false);
  // On narrow screens the stops sit evenly spaced, so their labels fit.
  const at = narrow ? stops.map((_, i) => (stops.length > 1 ? i / (stops.length - 1) : 0)) : placeStops(stops);
  // It starts on the first plan and moves through them by itself.
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(onMotion, () => matchMedia(MOTION).matches, () => false);
  const rootRef = useRef(null);
  const [drag, setDrag] = useState(null); // the playhead's position while dragging (0–1)
  const rulerRef = useRef(null);

  const p = stops[active];
  const price = p ? p[key] || p.monthly : null;
  const buy = p?.links?.[linkKey]?.checkout;
  const head = drag ?? at[active];

  const nearest = (x) => at.reduce((best, a, i) => (Math.abs(a - x) < Math.abs(at[best] - x) ? i : best), 0);
  const fromPointer = (event) => {
    const r = rulerRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (event.clientX - r.left) / r.width));
  };

  const auto = visible && !touched && !reduced && drag === null;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  // Self-running: the next plan every few seconds, round again after the
  // last, while on screen, until someone chooses a plan.
  useEffect(() => {
    if (!auto || stops.length < 2) return;
    const timer = setTimeout(() => setActive((a) => (a + 1) % stops.length), HOLD);
    return () => clearTimeout(timer);
  }, [auto, active, stops.length]);

  // Choosing a plan by hand stops the self-running.
  function choose(i) {
    setTouched(true);
    setActive(i);
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const x = fromPointer(event);
    setDrag(x);
    choose(nearest(x));
  }

  function onPointerMove(event) {
    if (drag === null) return;
    const x = fromPointer(event);
    setDrag(x);
    setActive(nearest(x));
  }

  function onPointerUp() {
    setDrag(null);
  }

  function onKeyDown(event) {
    const next = { ArrowRight: active + 1, ArrowUp: active + 1, ArrowLeft: active - 1, ArrowDown: active - 1, Home: 0, End: stops.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    choose(Math.min(stops.length - 1, Math.max(0, next)));
  }

  if (!p) return null;

  return (
    <div
      ref={rootRef}
      className={styles.plans}
      data-auto={auto ? "" : undefined}
    >
      {/* The switch and the offer. */}
      <div className={styles.controls}>
        <div className={styles.toggle} role="group" aria-label={copy.billing}>
          {[
            ["month", copy.monthly],
            ["year", copy.yearly],
          ].map(([value, label]) => (
            <button key={value} type="button" aria-pressed={interval === value} onClick={() => setBilling(value)}>
              {label}
              {value === "year" && data.annualSavingsPercent ? <span className={styles.save}>{copy.save.replace("{n}", data.annualSavingsPercent)}</span> : null}
            </button>
          ))}
        </div>
        {data.launchOffer ? (
          <p className={styles.offer}>
            <i aria-hidden="true" />
            {data.launchOffer}
          </p>
        ) : null}
      </div>

      {/* The timeline: AI minutes a month, a stop per plan, the playhead. */}
      <div className={styles.timeline}>
        <p className={styles.axis}>
          <span>{copy.axis}</span>
          <span>
            {stops.at(-1).aiMinutes}+ {copy.min}
          </span>
        </p>
        <div
          ref={rulerRef}
          className={styles.ruler}
          role="slider"
          tabIndex={0}
          aria-label={copy.axis}
          aria-valuemin={0}
          aria-valuemax={stops.length - 1}
          aria-valuenow={active}
          aria-valuetext={`${p.name}, ${p.aiMinutes} ${copy.aiMinutes}`}
          data-dragging={drag !== null ? "" : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          style={{ "--at": head }}
        >
          <span className={styles.ticks} aria-hidden="true">
            {TICKS.map((t) => (
              <i key={t} style={{ left: `${t * 100}%` }} />
            ))}
          </span>
          <span className={styles.track} aria-hidden="true" />
          <span className={styles.filled} aria-hidden="true" />
          {stops.map((s, i) => (
            <span key={s.id} className={styles.stop} data-on={i === active ? "" : undefined} data-done={i < active ? "" : undefined} style={{ left: `${at[i] * 100}%` }} aria-hidden="true">
              <i />
            </span>
          ))}
          <span className={styles.playhead} aria-hidden="true">
            <i />
          </span>
        </div>
        <div className={styles.labels}>
          {stops.map((s, i) => (
            <button
              key={s.id}
              type="button"
              tabIndex={-1}
              className={styles.label}
              data-on={i === active ? "" : undefined}
              data-edge={i === 0 ? "start" : i === stops.length - 1 ? "end" : undefined}
              style={{ left: `${at[i] * 100}%` }}
              onClick={() => choose(i)}
            >
              <b>{s.name}</b>
              <span>
                {s.aiMinutes} {copy.min}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* The inspector: the plan under the playhead. */}
      <div className={styles.inspector} data-popular={p.mostPopular ? "" : undefined} aria-live="polite">
        <div key={`${p.id}-${interval}`} className={styles.inspectorMain}>
          <p className={styles.planLine}>
            <span className={styles.planName}>{p.name}</span>
            {p.mostPopular ? <span className={styles.badge}>{copy.popular}</span> : null}
          </p>
          {p.tagline ? <p className={styles.tagline}>{p.tagline}</p> : null}
          <p className={styles.price}>
            {price ? (
              <>
                {price.was ? <s className={styles.was}>{price.was}</s> : null}
                <span className={styles.amount}>{price.amount}</span>
                <span className={styles.per}>{copy.perMonth}</span>
              </>
            ) : (
              <span className={styles.amount}>{copy.free}</span>
            )}
          </p>
          <p className={styles.billed}>{price ? [price.billed, price.reason].filter(Boolean).join(" · ") : "\u00a0"}</p>
          <p className={styles.minutes}>
            <b>{p.aiMinutes}</b> {copy.aiMinutes}
          </p>
        </div>

        <div key={`${p.id}-f`} className={styles.inspectorSide}>
          {p.includes ? <p className={styles.includes}>{p.includes}</p> : null}
          <ul className={styles.features}>
            {p.features.map((f) => (
              <li key={f}>
                <Check />
                {f}
              </li>
            ))}
          </ul>
          <dl className={styles.specs}>
            {p.exportResolution ? (
              <div>
                <dt>{copy.export}</dt>
                <dd>{p.exportResolution}</dd>
              </div>
            ) : null}
            {p.storageGb !== null ? (
              <div>
                <dt>{copy.storage}</dt>
                <dd>{p.storageGb} GB</dd>
              </div>
            ) : null}
            {p.watermark !== null ? (
              <div>
                <dt>{copy.watermark}</dt>
                <dd>{p.watermark ? copy.yes : copy.no}</dd>
              </div>
            ) : null}
          </dl>
          <div className={styles.actions}>
            {p.cta ? (
              <a className={styles.primary} href={p.cta.href}>
                {p.cta.label}
                <Arrow />
              </a>
            ) : null}
            {buy ? (
              <a className={styles.buy} href={buy}>
                {copy.buy}
              </a>
            ) : null}
            {p.trial?.days ? (
              <span className={styles.trial}>
                {copy.trial.replace("{days}", p.trial.days)}
                {p.trial.noCard ? ` · ${copy.noCard}` : ""}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* The other plans, in a slim row. */}
      <div className={styles.others}>
        {others.map((p) => {
          const price = p[key] || p.monthly;
          return (
            <div key={p.id} className={styles.other}>
              <div className={styles.otherHead}>
                <h3 className={styles.otherName}>{p.name}</h3>
                <p className={styles.otherPrice}>
                  {price ? (
                    <>
                      <b>{price.amount}</b> {p.seats?.perSeat ? copy.perSeat : copy.perMonth}
                    </>
                  ) : p.id === "free" ? (
                    <b>{copy.free}</b>
                  ) : (
                    <b>{copy.custom}</b>
                  )}
                </p>
              </div>
              <p className={styles.otherLine}>
                {[p.tagline, p.seats?.minimum ? copy.minSeats.replace("{n}", p.seats.minimum) : null, p.aiMinutes ? `${p.aiMinutes} ${p.seats?.perSeat ? copy.aiMinutesSeat : copy.aiMinutes}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {p.cta ? (
                <a className={styles.otherLink} href={p.cta.href}>
                  {p.cta.label}
                  <Arrow />
                </a>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* AI-minute packs. */}
      {data.packs.length ? (
        <div className={styles.packs}>
          <p className={styles.packsLabel}>{copy.packs}</p>
          <ul>
            {data.packs.map((k) => (
              <li key={k.href}>
                <a href={k.href}>
                  <b>{k.minutes}</b> {copy.min}
                  <span>{k.price}</span>
                  {k.bonus ? <em>+{k.bonus}%</em> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className={styles.note}>{copy.note}</p>
    </div>
  );
}
