"use client";

import { useId, useState } from "react";
import styles from "./teams.module.css";

const SHOWN = 10; // tracks drawn before "+N more seats"
const MAX = 50;

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Each seat's two keyframes, placed from its number so they never jump.
const keys = (i) => [12 + ((i * 37) % 28), 70 + ((i * 23) % 22)];

/**
 * Team as a seat calculator, drawn as one shared timeline. A slider sets the
 * seats (from the API's minimum); each seat is a track with its own
 * keyframes (ten tracks are always drawn, the ones not taken faint and
 * dashed, so the block never changes height), and one mint playhead
 * crosses them all ("One project"). Beside
 * it, the team's totals: the API's per-seat prices and allowances times the
 * seats (a month billed yearly, a year, month to month, AI minutes,
 * storage), each with its sum shown. Then Team's plan lines and button. A
 * track lights as its seat is added; nothing moves by itself.
 */
export function TeamSeats({ plan, per, min, currency, copy }) {
  const [seats, setSeats] = useState(min);
  const id = useId();
  const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  const { seats: s, totals: t } = copy;
  const times = (each) => t.times.replace("{n}", seats).replace("{each}", each);

  const rows = [
    per.yearly !== null && { label: t.yearly, value: money(seats * per.yearly), sum: times(money(per.yearly)) },
    per.yearly !== null && { label: t.year, value: money(seats * per.yearly * 12), sum: times(money(per.yearly * 12)) },
    per.monthly !== null && { label: t.monthly, value: money(seats * per.monthly), sum: times(money(per.monthly)) },
    per.minutes ? { label: t.minutes, value: String(seats * per.minutes), sum: times(per.minutes) } : null,
    per.storage ? { label: t.storage, value: `${seats * per.storage} GB`, sum: times(`${per.storage} GB`) } : null,
  ].filter(Boolean);

  return (
    <div className={styles.team} style={{ "--p": (seats - min) / (MAX - min) }}>
      <div className={styles.teamHead}>
        <p className={styles.planName}>{plan.name}</p>
        <p className={styles.price}>
          <b>{plan.price}</b>
          <span>{copy.perSeatMonth}</span>
        </p>
        <p className={styles.billed}>
          {plan.billed.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </p>
        {plan.tagline ? <p className={styles.tagline}>{plan.tagline}</p> : null}
      </div>

      <div className={styles.calc}>
        {/* The seats: a slider over one shared timeline. */}
        <div className={styles.seats}>
          <label className={styles.seatsHead} htmlFor={id}>
            <span>{s.label}</span>
            <b aria-live="polite">{String(seats).padStart(2, "0")}</b>
          </label>
          <input id={id} className={styles.range} type="range" min={min} max={MAX} step={1} value={seats} aria-label={s.slider} onChange={(e) => setSeats(Number(e.target.value))} />
          <p className={styles.rangeFoot}>
            <span>{s.min.replace("{n}", min)}</span>
            <span>{MAX}</span>
          </p>

          <div className={styles.timeline} aria-hidden="true">
            <span className={styles.playhead}>
              <em>{s.project}</em>
            </span>
            {Array.from({ length: SHOWN }, (_, i) => (
              <div key={i} className={styles.seatTrack} data-open={i >= seats ? "" : undefined}>
                <span>{s.seat.replace("{n}", String(i + 1).padStart(2, "0"))}</span>
                <span className={styles.seatLine}>
                  {i < seats
                    ? keys(i).map((x) => (
                        <i key={x} style={{ left: `${x}%` }} />
                      ))
                    : null}
                </span>
              </div>
            ))}
            <p className={styles.more}>{seats > SHOWN ? s.more.replace("{n}", seats - SHOWN) : " "}</p>
          </div>
        </div>

        {/* The totals. */}
        <dl className={styles.totals}>
          {rows.map((r) => (
            <div key={r.label}>
              <dt>{r.label}</dt>
              <dd>
                <b>{r.value}</b>
                <span>{r.sum}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={styles.teamFoot}>
        <div className={styles.lines}>
          {plan.includes ? <p className={styles.includes}>{plan.includes}</p> : null}
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
          <a className={styles.cta} data-solid="" href={plan.cta.href}>
            {plan.cta.label} <span aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
