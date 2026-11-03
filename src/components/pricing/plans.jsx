"use client";

import { useRef, useState } from "react";
import styles from "./pricing.module.css";

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

/**
 * The plans, from the pricing API (normalised in src/lib/pricing.js), as
 * an editing timeline: a ruler of AI minutes a month with a stop per plan
 * (over the middle of its column) and a mint playhead. Beneath, every plan
 * at once as a column under its stop, on shared rows; the one under the
 * playhead is lit. Drag the playhead, click a label, use the arrow keys, or
 * hover / focus a column to move it; it starts on the most popular plan. Per-seat and
 * custom plans (Team, Enterprise) sit in a slim row beneath, then the
 * AI-minute packs. Monthly / Yearly switch above. Every price, allowance,
 * bullet and link is the API's own.
 */
export function Plans({ data, copy }) {
  const [interval, setBilling] = useState("year");
  const key = interval === "year" ? "annual" : "monthly";
  const linkKey = interval === "year" ? "year" : "month";

  const stops = data.plans.filter((p) => p.aiMinutes !== null && !p.seats?.perSeat).sort((a, b) => a.aiMinutes - b.aiMinutes);
  const others = data.plans.filter((p) => !stops.includes(p));
  // Each stop sits over the middle of its plan's column.
  const at = stops.map((_, i) => (i + 0.5) / stops.length);
  const start = Math.max(0, stops.findIndex((p) => p.mostPopular));

  const [active, setActive] = useState(start);
  const [drag, setDrag] = useState(null); // the playhead's position while dragging (0–1)
  const rulerRef = useRef(null);

  const p = stops[active];
  const head = drag ?? at[active];

  const nearest = (x) => at.reduce((best, a, i) => (Math.abs(a - x) < Math.abs(at[best] - x) ? i : best), 0);
  const fromPointer = (event) => {
    const r = rulerRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (event.clientX - r.left) / r.width));
  };

  function onPointerDown(event) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const x = fromPointer(event);
    setDrag(x);
    setActive(nearest(x));
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
    setActive(Math.min(stops.length - 1, Math.max(0, next)));
  }

  if (!p) return null;

  return (
    <div className={styles.plans}>
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
              onClick={() => setActive(i)}
            >
              <b>{s.name}</b>
              <span>
                {s.aiMinutes} {copy.min}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Every plan at once, a column under its stop; the one under the
          playhead is lit. Rows are shared (subgrid), so they line up. */}
      <div className={styles.columns} style={{ "--n": stops.length }}>
        {stops.map((s, i) => {
          const pr = s[key] || s.monthly;
          const buyLink = s.links?.[linkKey]?.checkout;
          const on = i === active;
          return (
            <article
              key={s.id}
              className={styles.column}
              data-on={on ? "" : undefined}
              data-popular={s.mostPopular ? "" : undefined}
              onPointerEnter={(event) => event.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(i)}
            >
              <header className={styles.colHead}>
                <h3 className={styles.planName}>{s.name}</h3>
                {s.mostPopular ? <span className={styles.badge}>{copy.popular}</span> : null}
              </header>
              <p className={styles.tagline}>{s.tagline || "\u00a0"}</p>
              <p key={`${s.id}-${interval}`} className={styles.price}>
                {pr ? (
                  <>
                    {pr.was ? <s className={styles.was}>{pr.was}</s> : null}
                    <span className={styles.amount}>{pr.amount}</span>
                    <span className={styles.per}>{copy.perMonth}</span>
                  </>
                ) : (
                  <span className={styles.amount}>{copy.free}</span>
                )}
              </p>
              <p className={styles.billed}>{pr ? [pr.billed, pr.reason].filter(Boolean).join(" · ") : "\u00a0"}</p>
              <p className={styles.minutes}>
                <b>{s.aiMinutes}</b> {copy.aiMinutes}
              </p>
              <div className={styles.actions}>
                {s.cta ? (
                  <a className={on ? styles.primary : styles.secondary} href={s.cta.href}>
                    {s.cta.label}
                  </a>
                ) : null}
                <span className={styles.subAction}>
                  {s.trial?.days ? (
                    <span className={styles.trial}>
                      {copy.trial.replace("{days}", s.trial.days)}
                      {s.trial.noCard ? ` · ${copy.noCard}` : ""}
                    </span>
                  ) : buyLink ? (
                    <a className={styles.buy} href={buyLink}>
                      {copy.buy}
                    </a>
                  ) : (
                    "\u00a0"
                  )}
                </span>
              </div>
              <div className={styles.featureBlock}>
                <p className={styles.includes}>{s.includes || "\u00a0"}</p>
                <ul className={styles.features}>
                  {s.features.map((f) => (
                    <li key={f}>
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <dl className={styles.specs}>
                <div>
                  <dt>{copy.export}</dt>
                  <dd>{s.exportResolution || "—"}</dd>
                </div>
                <div>
                  <dt>{copy.storage}</dt>
                  <dd>{s.storageGb !== null ? `${s.storageGb} GB` : "—"}</dd>
                </div>
                <div>
                  <dt>{copy.watermark}</dt>
                  <dd>{s.watermark === null ? "—" : s.watermark ? copy.yes : copy.no}</dd>
                </div>
              </dl>
            </article>
          );
        })}
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
