import { useCases } from "@/content/home";
import { Preview } from "./preview";
import { ReelStage } from "./reel-stage";
import styles from "./use-cases.module.css";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * "Use cases": the six presets from the prompt box as clips on a reel. While
 * the section is pinned the reel slides under a fixed playhead, and the clip
 * under it lifts and plays its preview. "Try this prompt" sends its preset
 * back up to the hero's prompt box. Without the script (or with reduced
 * motion) the reel is a row you can swipe or scroll.
 */
export function UseCases() {
  const { eyebrow, title, lead, cta, note, items } = useCases;
  const total = String(items.length).padStart(2, "0");

  return (
    <ReelStage className={styles.section} id="use-cases" labelledBy="cases-title" label="Use cases" labels={items.map((item) => item.label)}>
      <div className={styles.stage}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="cases-title" className={styles.title}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <div className={styles.aside}>
            <p className={styles.lead}>{lead}</p>
            <p className={styles.counter} aria-hidden="true">
              <span data-counter>01</span>
              <span className={styles.counterTotal}> / {total}</span>
              <span className={styles.counterLabel} data-counter-label>
                {items[0].label}
              </span>
            </p>
          </div>
        </div>

        <div className={styles.viewport} data-viewport>
          <ol className={styles.track} data-track>
            {items.map((item, i) => (
              <li key={item.label} className={styles.card} data-card={i}>
                <div className={styles.preview}>
                  <Preview kind={item.kind} format={item.format} />
                </div>
                <div className={styles.info}>
                  <p className={styles.meta}>
                    <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.format}>{item.format}</span>
                  </p>
                  <h3 className={styles.cardTitle}>{item.label}</h3>
                  <p className={styles.body}>{item.body}</p>
                  <button type="button" className={styles.try} data-try={item.label}>
                    {cta}
                    <Arrow />
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <span className={styles.playhead} aria-hidden="true">
            <span className={styles.playheadTag}>
              <i />
              <span data-timecode>00:00:00:00</span>
            </span>
          </span>
        </div>

        <nav className={styles.ruler} aria-label="Use cases">
          <span className={styles.rulerFill} aria-hidden="true" />
          {items.map((item, i) => (
            <button key={item.label} type="button" className={styles.rulerItem} data-jump={i}>
              <span className={styles.rulerIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.rulerLabel}>{item.label}</span>
            </button>
          ))}
        </nav>
        <p className={styles.note}>{note}</p>
      </div>
    </ReelStage>
  );
}
