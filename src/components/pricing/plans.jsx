"use client";

import { useState } from "react";
import styles from "./pricing.module.css";

const MAIN = ["byo", "starter", "creator", "pro"];

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
 * The plans, from the pricing API (normalised in src/lib/pricing.js): a
 * Monthly / Yearly switch with the savings pill and the launch offer, the
 * four main plans side by side (the most popular raised on a mint edge),
 * a slim row for the others (Free, Team, Enterprise), and the AI-minute
 * packs. Every price, allowance, bullet and link is the API's own.
 */
export function Plans({ data, copy }) {
  const [interval, setBilling] = useState("year");
  const key = interval === "year" ? "annual" : "monthly";
  const linkKey = interval === "year" ? "year" : "month";
  const main = data.plans.filter((p) => MAIN.includes(p.id));
  const others = data.plans.filter((p) => !MAIN.includes(p.id));

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

      {/* The main plans. */}
      <div className={styles.cards}>
        {main.map((p) => {
          const price = p[key] || p.monthly;
          const buy = p.links?.[linkKey]?.checkout;
          return (
            <article key={p.id} className={styles.card} data-popular={p.mostPopular ? "" : undefined}>
              <header className={styles.cardHead}>
                <h3 className={styles.planName}>{p.name}</h3>
                {p.mostPopular ? <span className={styles.badge}>{copy.popular}</span> : null}
              </header>
              {p.tagline ? <p className={styles.tagline}>{p.tagline}</p> : null}

              <div className={styles.price}>
                {price ? (
                  <>
                    {price.was ? <s className={styles.was}>{price.was}</s> : null}
                    <span className={styles.amount}>{price.amount}</span>
                    <span className={styles.per}>{copy.perMonth}</span>
                  </>
                ) : null}
              </div>
              <p className={styles.billed}>{price ? [price.billed, price.reason].filter(Boolean).join(" · ") : " "}</p>

              {p.aiMinutes !== null ? (
                <p className={styles.minutes}>
                  <b>{p.aiMinutes}</b> {copy.aiMinutes}
                </p>
              ) : null}

              <div className={styles.actions}>
                {p.cta ? (
                  <a className={p.mostPopular ? styles.primary : styles.secondary} href={p.cta.href}>
                    {p.cta.label}
                    <Arrow />
                  </a>
                ) : null}
                {buy ? (
                  <a className={styles.buy} href={buy}>
                    {copy.buy}
                  </a>
                ) : null}
              </div>
              {/* Every card keeps this row, so the rows line up across. */}
              <p className={styles.trial}>
                {p.trial?.days ? `${copy.trial.replace("{days}", p.trial.days)}${p.trial.noCard ? ` · ${copy.noCard}` : ""}` : "\u00a0"}
              </p>

              <div className={styles.features}>
                <p className={styles.includes}>{p.includes || "\u00a0"}</p>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <dl className={styles.specs}>
                {/* Always rendered, so every card has the same rows. */}
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
