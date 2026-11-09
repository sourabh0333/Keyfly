import Link from "next/link";
import styles from "./error-screen.module.css";

// The timeline under the heading: two tracks of clips with a hole in them.
// The playhead scrubs in and stops on the hole: a missing clip (404) or a
// render that stopped (an error).
const CLIPS = [
  { at: 0, w: 14 },
  { at: 15, w: 11 },
  { at: 27, w: 17 },
  // the hole: 45–61
  { at: 62, w: 13 },
  { at: 76, w: 24 },
];
const GAP = { at: 45, w: 16 };
const BARS = Array.from({ length: 64 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)));
const TICKS = ["00:00", "00:01", "00:02", "00:03", "00:04", "00:05", "00:06"];

function Timeline({ kind, gap, timecode }) {
  return (
    <div className={styles.timeline} data-kind={kind} aria-hidden="true">
      <div className={styles.ruler}>
        {TICKS.map((t, i) => (
          <span key={t} style={{ "--x": `${(i / (TICKS.length - 1)) * 100}%` }}>
            {t}
          </span>
        ))}
      </div>

      <div className={styles.tracks}>
        <div className={styles.track}>
          <b className={styles.trackName}>V1</b>
          <div className={styles.lane}>
            {CLIPS.map((c, i) => (
              <i
                key={c.at}
                className={styles.clip}
                style={{ "--at": `${c.at}%`, "--w": `${c.w}%`, "--k": i }}
              />
            ))}
            <span className={styles.gap} style={{ "--at": `${GAP.at}%`, "--w": `${GAP.w}%` }}>
              <em>{gap}</em>
            </span>
          </div>
        </div>
        <div className={styles.track}>
          <b className={styles.trackName}>A1</b>
          <div className={`${styles.lane} ${styles.wave}`}>
            {BARS.map((h, i) => {
              const x = (i / BARS.length) * 100;
              if (x >= GAP.at && x < GAP.at + GAP.w) return null;
              return <i key={i} style={{ "--x": `${x}%`, "--h": h.toFixed(3) }} />;
            })}
          </div>
        </div>

        <span className={styles.rail}>
          <span className={styles.sweep} style={{ "--stop": (GAP.at + GAP.w / 2) / 100 }}>
            <span className={styles.playhead}>
              <span className={styles.timecode}>{timecode}</span>
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

/**
 * The 404 and error screens: the eyebrow with its recording light, the
 * two-line heading, the lead, the actions (passed in, so the error page can
 * add its retry button), the timeline, and optionally where to go instead
 * and how to report it.
 */
export function ErrorScreen({ kind = "missing", content, actions, pages, pagesLabel }) {
  const { eyebrow, title, lead, timeline, report } = content;

  return (
    <section className={styles.screen} data-kind={kind}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.head}>
        <p className={styles.eyebrow}>
          <span className={styles.light} aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className={styles.title}>
          {title.map((line) => (
            <span key={line.text} className={line.accent ? styles.accent : styles.plain}>
              {line.text}
            </span>
          ))}
        </h1>
        <p className={styles.lead}>{lead}</p>
        <div className={styles.actions}>{actions}</div>
      </div>

      <Timeline kind={kind} gap={timeline.gap} timecode={timeline.timecode} />

      {pages ? (
        <nav className={styles.pages} aria-label={pagesLabel}>
          <p className={styles.pagesLabel}>{pagesLabel}</p>
          <ul>
            {pages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className={styles.page}>
                  <strong>
                    {p.label}
                    <span aria-hidden="true"> →</span>
                  </strong>
                  <span>{p.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <p className={styles.report}>
        {report.line}{" "}
        <a href={report.href} className={styles.mail}>
          {report.label}
        </a>
      </p>
    </section>
  );
}
