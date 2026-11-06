"use client";

import { useState } from "react";
import styles from "./pricing-hero.module.css";

const SEGMENTS = 12; // the AI-minutes meter's segments
// The plans' places on the sheet, by the API's ids: your own AI along the
// top, the plans where KeyFly's AI does the work in the middle, teams
// beneath. Any plan the API adds later joins the middle.
const OWN = ["free", "byo"];
const TEAMS = ["team", "enterprise"];

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A price with its labels: the amount (the list price struck when lower),
// "a month" or "a seat a month", what's billed, the discount and its reason.
function Price({ p, yearly, copy, size }) {
  const price = yearly ? p.annual : p.monthly;
  const custom = !p.monthly && !p.annual && p.id !== "free";
  const perSeat = p.seats?.perSeat;
  const interval = yearly ? "year" : "month";
  return (
    <div className={styles.price} data-size={size}>
      <p className={styles.amount}>
        {price?.was ? <s>{price.was}</s> : null}
        <b key={`${p.id}-${interval}`}>{price ? price.amount : custom ? copy.custom : copy.free}</b>
        <span className={styles.per}>{price ? (perSeat ? copy.perSeat : copy.perMonth) : custom ? "" : copy.forever}</span>
      </p>
      {price?.billed || (perSeat && p.seats?.minimum) ? (
        <p className={styles.billed}>
          {price?.billed}
          {yearly && price?.discount ? (
            <span className={styles.off}>
              {copy.off.replace("{n}", price.discount)}
              {price.reason && price.reason !== "Billed annually" ? ` · ${price.reason}` : ""}
            </span>
          ) : null}
          {perSeat && p.seats?.minimum ? <span>{copy.seatsMin.replace("{n}", p.seats.minimum)}</span> : null}
        </p>
      ) : null}
    </div>
  );
}

// AI minutes as a level meter: segments lit by the square root of the
// plan's minutes.
function Meter({ p, max, copy }) {
  const custom = p.aiMinutes === null;
  const perSeat = p.seats?.perSeat;
  const lit = p.aiMinutes ? Math.max(1, Math.round(Math.sqrt(p.aiMinutes / max) * SEGMENTS)) : 0;
  return (
    <div className={styles.meter}>
      <span className={styles.segments} data-custom={custom ? "" : undefined} aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <i key={i} data-on={i < lit ? "" : undefined} />
        ))}
      </span>
      <p className={styles.minutes}>
        {custom ? (
          <b>{copy.customMinutes}</b>
        ) : p.aiMinutes ? (
          <>
            <b>{p.aiMinutes}</b> {perSeat ? copy.perSeatMinutes : copy.minutes}
          </>
        ) : (
          <b className={styles.own}>{copy.noMinutes}</b>
        )}
      </p>
    </div>
  );
}

function Cta({ p, yearly }) {
  if (!p.cta) return null;
  const href = p.contact || p.links?.[yearly ? "year" : "month"]?.signup || p.cta.href;
  return (
    <a className={styles.ctaLink} href={href} data-solid={p.mostPopular ? "" : undefined}>
      {p.cta.label}
      <span aria-hidden="true">→</span>
    </a>
  );
}

// A slim lane between hairlines: a row per plan with its name and line, the
// price, the meter and the button.
function Lane({ label, list, ...rest }) {
  return (
    <div className={styles.lane}>
      <p className={styles.laneLabel}>{label}</p>
      <ul>
        {list.map((p) => (
          <li key={p.id} className={styles.laneRow}>
            <div className={styles.laneName}>
              <b>{p.name}</b>
              <span>{p.tagline}</span>
            </div>
            <Price p={p} size="s" yearly={rest.yearly} copy={rest.copy} />
            <Meter p={p} max={rest.max} copy={rest.copy} />
            <Cta p={p} yearly={rest.yearly} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Every plan, in three tiers with a clear hierarchy instead of seven equal
 * columns. Along the top, a lane for working with your own AI (Free, BYO);
 * in the middle, the plans where KeyFly's AI does the work (Starter,
 * Creator, Pro) set large, the most popular raised in a glass panel with a
 * mint edge, each with its labelled price, an AI-minutes level meter and
 * the API's own plan lines; beneath, a lane for teams (Team, Enterprise).
 * The billing switch defaults to yearly and says how much it saves at most,
 * from the plans' own discounts. Every number and line is the API's.
 */
export function PriceSheet({ data, copy, switchCopy }) {
  const [yearly, setYearly] = useState(true);
  const plans = data.plans;
  const max = Math.max(...plans.map((p) => p.aiMinutes ?? 0), 1);
  const maxSave = Math.max(0, ...plans.map((p) => p.annual?.discount ?? 0));
  const own = plans.filter((p) => OWN.includes(p.id));
  const teams = plans.filter((p) => TEAMS.includes(p.id));
  const main = plans.filter((p) => !OWN.includes(p.id) && !TEAMS.includes(p.id));
  const shared = { yearly, copy, max };

  return (
    <div className={styles.sheetWrap}>
      <div className={styles.switchRow}>
        <span className={styles.switchLabel}>{switchCopy.label}</span>
        <div className={styles.switch} role="group" aria-label={switchCopy.label}>
          <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>
            {switchCopy.monthly}
          </button>
          <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>
            {switchCopy.yearly}
            {maxSave ? <em>{switchCopy.save.replace("{n}", maxSave)}</em> : null}
          </button>
        </div>
      </div>

      {own.length ? <Lane label={copy.ownLane} list={own} {...shared} /> : null}

      <div className={styles.mainWrap}>
        <p className={styles.laneLabel}>{copy.mainLane}</p>
        <ol className={styles.main}>
          {main.map((p) => (
            <li key={p.id} className={styles.plan} data-popular={p.mostPopular ? "" : undefined}>
              {p.mostPopular ? <span className={styles.popular}>{copy.popular}</span> : null}
              <div className={styles.planHead}>
                <p className={styles.name}>{p.name}</p>
                <p className={styles.tagline}>{p.tagline}</p>
              </div>
              <Price p={p} size="l" yearly={yearly} copy={copy} />
              <Meter p={p} max={max} copy={copy} />
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
              <div className={styles.cta}>
                <Cta p={p} yearly={yearly} />
                {p.trial?.days ? (
                  <small>
                    {[p.trial.noCard ? copy.noCard : null, p.trial.aiMinutes ? copy.trialMinutes.replace("{n}", p.trial.aiMinutes) : null].filter(Boolean).join(" · ")}
                  </small>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {teams.length ? <Lane label={copy.teamLane} list={teams} {...shared} /> : null}
    </div>
  );
}
