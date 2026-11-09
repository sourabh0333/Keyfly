import { Button } from "@/components/button";
import { siteConfig } from "@/config/site";
import { pricingHero } from "@/content/pricing";
import { HeroFilms } from "./hero-films";
import { PriceSheet } from "./price-sheet";
import styles from "./pricing-hero.module.css";

/**
 * The Pricing page's hero: centred, oversized type as the other pages'
 * heroes, with three films either side of it as a waveform that peaks at
 * the heading (see HeroFilms), then every plan at once on one price sheet (see PriceSheet),
 * with the billing switch, and a line of what holds for every plan. All
 * numbers come from the pricing API (`data`); without it, the plans are
 * "loading" and the way in is the free plan in the app.
 */
export function PricingHero({ data }) {
  const { eyebrow, title, lead, films, pauseFilms, playFilms, sheet, promises, primary, compare, note, pending } = pricingHero;

  return (
    <section className={styles.hero} data-tone="night" aria-labelledby="pricing-title" data-section="Intro">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.glow} />
        <div className={styles.grain} />
      </div>

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.head}>
            {/* The eyebrow is part of the h1, so the page's main heading names
                its topic ("AI video editor pricing"); it looks as it did. */}
            <h1 id="pricing-title" className={styles.heading}>
              <span className={styles.eyebrow}>
                <span className={styles.rec} aria-hidden="true" />
                {eyebrow}
                <span className="visually-hidden">: </span>
              </span>
              <span className={styles.title}>
                {(data ? title : [{ text: pending.title }]).map((line, i, all) => (
                  <span key={i} className={line.accent ? styles.accent : styles.plain}>
                    {line.text}
                    {i < all.length - 1 ? " " : null}
                  </span>
                ))}
              </span>
            </h1>
            <p className={styles.lead}>{data ? lead : pending.lead}</p>
          </div>
          <HeroFilms films={films} pauseLabel={pauseFilms} playLabel={playFilms} />
        </div>

        {data ? (
          <>
            <PriceSheet data={data} copy={sheet} switchCopy={pricingHero.switch} />
            <div className={styles.under}>
              <ul className={styles.promises}>
                {promises.map((p) => (
                  <li key={p}>{p.replace("{currency}", data.currency || "USD")}</li>
                ))}
              </ul>
              <a className={styles.compare} href={compare.href}>
                {compare.label} ↓
              </a>
            </div>
            <p className={styles.footnote}>{note}</p>
          </>
        ) : (
          <div className={styles.actions}>
            <Button href={primary.href} arrow>
              {primary.label}
            </Button>
            <Button href={siteConfig.appUrl} variant="ghost">
              {pending.open}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
