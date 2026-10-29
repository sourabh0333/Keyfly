import Image from "next/image";
import { desktops } from "@/content/home";
import { InView } from "./in-view";
import rise from "./rise.module.css";
import { SectionHead } from "./section-head";
import styles from "./desktops.module.css";

// Hub geometry in its own units (400 × 250): each desktop connects to the
// icon in the middle, and light runs along the line towards it.
const HUB_LINKS = [
  { d: "M70 54 C 140 54, 150 125, 200 125", x: 70, y: 54 },
  { d: "M330 54 C 260 54, 250 125, 200 125", x: 330, y: 54 },
  { d: "M200 226 C 200 190, 200 160, 200 125", x: 200, y: 226 },
];

// The footage being reframed: the brand's flight path as the subject.
const SHOT = "M44 196 C 90 192, 130 166, 142 128 C 154 90, 132 62, 107 74 C 82 86, 90 128, 132 131 C 166 133, 190 102, 201 70";

function Hub({ hub }) {
  return (
    <InView className={styles.hub} threshold={0.45}>
      <svg className={styles.hubLinks} viewBox="0 0 400 250" preserveAspectRatio="none" aria-hidden="true">
        {HUB_LINKS.map((link, i) => (
          <g key={link.d}>
            <path d={link.d} className={styles.hubLink} />
            <circle r="2.6" className={styles.hubPulse}>
              <animateMotion dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" path={link.d} />
            </circle>
          </g>
        ))}
      </svg>
      {hub.nodes.map((name, i) => (
        <span
          key={name}
          className={styles.node}
          style={{ left: `${(HUB_LINKS[i].x / 400) * 100}%`, top: `${(HUB_LINKS[i].y / 250) * 100}%` }}
        >
          {name}
        </span>
      ))}
      <span className={styles.landing} aria-hidden="true">
        <span className={styles.ring} />
        <Image src="/brand/app-icon-flat.svg" alt="" width={64} height={64} unoptimized className={styles.hubIcon} />
      </span>
    </InView>
  );
}

function Reframe({ formats }) {
  return (
    <div className={styles.reframe} aria-hidden="true">
      <div className={styles.screen}>
        <svg className={styles.footage} viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="rf-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1c3a30" />
              <stop offset="1" stopColor="#0c1210" />
            </linearGradient>
          </defs>
          <rect width="320" height="180" fill="url(#rf-sky)" />
          <path d="M0 150 C 80 132, 200 146, 320 128 L320 180 L0 180 Z" fill="#0a0f0d" />
          <g transform="translate(108 22) scale(0.58)">
            <path d={SHOT} fill="none" stroke="#f4f1ea" strokeWidth="9" strokeLinecap="round" />
            <circle cx="214" cy="40" r="15" fill="#5fe0b0" />
          </g>
        </svg>
        <div className={styles.dim} />
        <div className={styles.crop} />
      </div>
      <ol className={styles.formats}>
        {formats.map((format, i) => (
          <li key={format.id} className={styles.format} style={{ "--i": i }}>
            <span className={styles.ratio}>{format.ratio}</span>
            <span>{format.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * One editor on every desktop, one edit on every screen. The hub is where
 * the statement's icon lands; light runs from each desktop into it. The
 * reframe card crops one shot through wide, square and vertical in turn.
 */
export function Desktops() {
  const { hub, reframe } = desktops;
  return (
    <section className={styles.desktops} aria-labelledby="desktops-title">
      <div className={styles.inner} id={desktops.id}>
        <SectionHead id="desktops-title" chip={desktops.chip} title={desktops.title} aside={desktops.aside} />

        <div className={styles.grid}>
          <article className={`${styles.card} ${rise.rise}`}>
            <h3 className={styles.cardTitle}>{hub.title}</h3>
            <p className={styles.cardText}>{hub.text}</p>
            <Hub hub={hub} />
            <p className={styles.note}>{hub.note}</p>
          </article>

          <article className={`${styles.card} ${rise.rise}`} style={{ "--rise-delay": "8%" }}>
            <h3 className={styles.cardTitle}>{reframe.title}</h3>
            <p className={styles.cardText}>{reframe.text}</p>
            <Reframe formats={reframe.formats} />
          </article>
        </div>
      </div>
    </section>
  );
}
