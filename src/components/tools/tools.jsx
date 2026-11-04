import { tools } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PauseOffscreen } from "@/components/pause-offscreen";
import { Handoff } from "./handoff";
import styles from "./tools.module.css";

// Down to a section on this page; out to anything else.
function Arrow({ href }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d={href.startsWith("#") ? "M8 3v9M4.5 8.5 8 12l3.5-3.5" : "M4 12 12 4M5.5 4H12v6.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * "Open by design": what KeyFly doesn't lock you into. First where it runs
 * (a bar of the platforms, each linking to how to get it, with a light
 * running along it for the sync between them), then the hand-off: the AI
 * that edits, one KeyFly timeline, and the editor it goes to (see Handoff).
 */
export function Tools() {
  const { eyebrow, title, lead, note, on, ...handoff } = tools;

  return (
    <section id="tools" className={styles.section} aria-labelledby="tools-title" data-section="Open by design">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="tools-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>{lead}</p>
        </div>

        <div className={styles.platforms}>
          <div className={styles.platformsHead}>
            <p className={styles.kicker}>
              <span>{on.index}</span> {on.kicker}
            </p>
            <p className={styles.platformsFoot}>{on.foot}</p>
          </div>
          <ul className={styles.platformList}>
            {on.options.map((o) => {
              const body = (
                <>
                  <span className={styles.platformName}>
                    {o.name}
                    {o.href ? <Arrow href={o.href} /> : null}
                  </span>
                  <span className={styles.platformNote}>{o.note}</span>
                </>
              );
              return (
                <li key={o.id}>
                  {o.href ? (
                    <a className={styles.platform} href={o.href}>
                      {body}
                    </a>
                  ) : (
                    <span className={styles.platform}>{body}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <Handoff {...handoff} />

        <p className={styles.footnote}>{note}</p>
      </div>
    </section>
  );
}
